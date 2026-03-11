import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { FeatureCaptureManifestSchema, type FeatureCaptureManifest } from '../data/capture-schema';
import {
	VideoCompositionPropsSchema,
	type SceneData,
	type VideoCompositionMetadata,
	type VideoSpec,
} from '../data/production-schema';
import { standaloneFeatureSpecs } from '../data/specs';
import {
	buildFeatureCaptureManifest,
	getDeclaredCaptureAssetPath,
	validateFeatureCaptureManifest,
} from './capture-pipeline';
import { getStandaloneCompositionMetadata, getSceneShellLayout } from './aspect-ratio-adaptation';
import { getCompositionManifestById } from './composition-manifest';
import { validateVideoSpecCompleteness } from './production-validation';
import { getDurationInFrames } from './timeline';

const TITLE_CHAR_WIDTH_FACTOR = 0.52;
const BODY_CHAR_WIDTH_FACTOR = 0.5;
const TITLE_LINE_HEIGHT_FACTOR = 1.08;
const BODY_LINE_HEIGHT_FACTOR = 1.32;

export const FINAL_DELIVERY_QA_REPORT_PATHS = {
	SymphonyStandalone: 'docs/reports/qa/symphony-final-qa-report.md',
	DirectorNotesStandalone: 'docs/reports/qa/directors-notes-final-qa-report.md',
	WorktreeSpinOffsStandalone: 'docs/reports/qa/worktree-spin-offs-final-qa-report.md',
} as const satisfies Record<string, string>;

export const DELIVERY_QA_CHECK_IDS = [
	'schema-integrity',
	'missing-assets',
	'text-overflow',
	'safe-area',
	'timing-drift',
	'broken-fallbacks',
	'composition-registration',
] as const;

export type DeliveryQaCheckId = (typeof DELIVERY_QA_CHECK_IDS)[number];

export type DeliveryQaCheckResult = {
	id: DeliveryQaCheckId;
	label: string;
	status: 'pass' | 'fail';
	issues: string[];
};

export type DeliveryQaFeatureResult = {
	specId: string;
	featureName: string;
	featureSlug: string;
	qaReportPath: string;
	checks: DeliveryQaCheckResult[];
	issueCount: number;
};

export type FinalDeliveryQaReport = {
	features: DeliveryQaFeatureResult[];
	totalIssueCount: number;
};

const QA_CHECK_LABELS: Record<DeliveryQaCheckId, string> = {
	'schema-integrity': 'Schema integrity',
	'missing-assets': 'Missing assets',
	'text-overflow': 'Text overflow',
	'safe-area': 'Safe-area coverage',
	'timing-drift': 'Timing drift',
	'broken-fallbacks': 'Broken fallbacks',
	'composition-registration': 'Composition registration',
};

const pushIssue = (issues: string[], issue: string) => {
	if (!issues.includes(issue)) {
		issues.push(issue);
	}
};

const estimateWrappedLines = ({
	text,
	maxWidth,
	fontSize,
	charWidthFactor,
}: {
	text: string;
	maxWidth: number;
	fontSize: number;
	charWidthFactor: number;
}) => {
	if (text.trim().length === 0) {
		return 0;
	}

	const estimatedLineWidth = Math.max(fontSize * charWidthFactor, 1);
	return Math.max(1, Math.ceil((text.length * estimatedLineWidth) / Math.max(maxWidth, 1)));
};

const getNoteColumnWidth = ({
	safeWidth,
	noteColumns,
	sectionGap,
}: {
	safeWidth: number;
	noteColumns: number;
	sectionGap: number;
}) => {
	const gutters = Math.max(0, noteColumns - 1) * sectionGap;
	return Math.max(240, Math.floor((safeWidth - gutters) / noteColumns) - 24);
};

const getMaxColumnHeight = (cardHeights: number[], columnCount: number, gap: number) => {
	const columns = Array.from({ length: columnCount }, () => 0);

	for (const height of cardHeights) {
		const targetIndex = columns.indexOf(Math.min(...columns));
		const existingHeight = columns[targetIndex];
		columns[targetIndex] = existingHeight === 0 ? height : existingHeight + gap + height;
	}

	return Math.max(...columns, 0);
};

const readFeatureCaptureManifest = ({
	workspaceRoot,
	spec,
}: {
	workspaceRoot: string;
	spec: VideoSpec;
}) => {
	const scaffold = buildFeatureCaptureManifest(spec);
	const manifestPath = resolve(workspaceRoot, scaffold.manifestPath);

	return FeatureCaptureManifestSchema.parse(JSON.parse(readFileSync(manifestPath, 'utf8')));
};

const validateSchemaIntegrity = ({ spec }: { spec: VideoSpec }) => {
	const issues = validateVideoSpecCompleteness(spec);

	for (const composition of getStandaloneCompositionMetadata(spec)) {
		const propsParse = VideoCompositionPropsSchema.safeParse({
			spec,
			composition,
		});

		if (!propsParse.success) {
			pushIssue(
				issues,
				`${spec.id}: composition props for ${composition.compositionId} must satisfy the Remotion props schema.`
			);
		}
	}

	return issues;
};

export const validateFeatureAssetCoverage = ({
	spec,
	manifest,
	workspaceRoot,
}: {
	spec: VideoSpec;
	manifest: FeatureCaptureManifest;
	workspaceRoot: string;
}) => {
	const issues: string[] = [];

	for (const asset of manifest.assets) {
		const assetPath = getDeclaredCaptureAssetPath(asset);

		if (!existsSync(resolve(workspaceRoot, assetPath))) {
			pushIssue(
				issues,
				`${spec.id}: missing asset file at ${assetPath} for fallback asset "${asset.id}".`
			);
		}
	}

	return issues;
};

const validateTimingDrift = ({ spec }: { spec: VideoSpec }) => {
	const issues: string[] = [];
	const expectedDurationInFrames = getDurationInFrames(spec);
	const sceneDurationTotal = spec.scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0);

	if (sceneDurationTotal !== expectedDurationInFrames) {
		pushIssue(
			issues,
			`${spec.id}: scene durations total ${sceneDurationTotal} frames instead of ${expectedDurationInFrames}.`
		);
	}

	for (const scene of spec.scenes) {
		const storyboardDuration = Math.round((scene.storyboard?.durationSeconds ?? 0) * spec.fps);

		if (scene.storyboard && storyboardDuration !== scene.durationInFrames) {
			pushIssue(
				issues,
				`${spec.id}: scene "${scene.id}" storyboard duration drifts from ${scene.durationInFrames} frames.`
			);
		}
	}

	return issues;
};

export const validateSceneLayoutReadability = ({
	spec,
	scene,
	composition,
}: {
	spec: VideoSpec;
	scene: SceneData;
	composition: VideoCompositionMetadata;
}) => {
	const issues: string[] = [];
	const layout = getSceneShellLayout({
		specId: spec.id,
		sceneId: scene.id,
		aspectRatio: composition.aspectRatio,
	});
	const safeWidth =
		composition.dimensions.width - composition.safeArea.left - composition.safeArea.right;
	const safeHeight =
		composition.dimensions.height - composition.safeArea.top - composition.safeArea.bottom;
	const textColumnWidth =
		layout.mode === 'split' ? Math.floor((safeWidth - layout.contentGap) / 2) : safeWidth;
	const titleLines = estimateWrappedLines({
		text: scene.title,
		maxWidth: Math.min(layout.headlineMaxWidth, textColumnWidth),
		fontSize: layout.titleFontSize,
		charWidthFactor: TITLE_CHAR_WIDTH_FACTOR,
	});
	const bodyLines = estimateWrappedLines({
		text: scene.body,
		maxWidth: Math.min(layout.bodyMaxWidth, textColumnWidth),
		fontSize: layout.bodyFontSize,
		charWidthFactor: BODY_CHAR_WIDTH_FACTOR,
	});
	const noteColumnWidth = getNoteColumnWidth({
		safeWidth: textColumnWidth,
		noteColumns: layout.noteColumns,
		sectionGap: layout.sectionGap,
	});
	const noteLineBudgets =
		composition.aspectRatio === '16:9'
			? { title: 4, body: 4, note: 3 }
			: composition.aspectRatio === '1:1'
				? { title: 4, body: 5, note: 4 }
				: { title: 4, body: 5, note: 4 };

	if (titleLines > noteLineBudgets.title) {
		pushIssue(
			issues,
			`${spec.id}: scene "${scene.id}" risks text overflow in ${composition.aspectRatio} because the title wraps to ${titleLines} lines.`
		);
	}

	if (bodyLines > noteLineBudgets.body) {
		pushIssue(
			issues,
			`${spec.id}: scene "${scene.id}" risks text overflow in ${composition.aspectRatio} because the body wraps to ${bodyLines} lines.`
		);
	}

	const noteHeights = (scene.storyboard?.onScreenCopy ?? []).map((note, index) => {
		const noteLines = estimateWrappedLines({
			text: note,
			maxWidth: noteColumnWidth,
			fontSize: layout.bodyFontSize,
			charWidthFactor: BODY_CHAR_WIDTH_FACTOR,
		});

		if (noteLines > noteLineBudgets.note) {
			pushIssue(
				issues,
				`${spec.id}: scene "${scene.id}" risks text overflow in ${composition.aspectRatio} because note ${index + 1} wraps to ${noteLines} lines.`
			);
		}

		return noteLines * layout.bodyFontSize * BODY_LINE_HEIGHT_FACTOR + 28;
	});

	const copyHeight =
		layout.bodyFontSize * BODY_LINE_HEIGHT_FACTOR +
		titleLines * layout.titleFontSize * TITLE_LINE_HEIGHT_FACTOR +
		bodyLines * layout.bodyFontSize * BODY_LINE_HEIGHT_FACTOR +
		(noteHeights.length > 0
			? getMaxColumnHeight(noteHeights, layout.noteColumns, layout.sectionGap)
			: 0) +
		layout.sectionGap * 3;
	const availableStageHeight =
		layout.mode === 'split' ? safeHeight : safeHeight - copyHeight - layout.contentGap;

	if (availableStageHeight < layout.stageMinHeight) {
		pushIssue(
			issues,
			`${spec.id}: scene "${scene.id}" risks safe-area compression in ${composition.aspectRatio} because only ${Math.max(0, Math.round(availableStageHeight))} vertical pixels remain for a ${layout.stageMinHeight}px stage.`
		);
	}

	if (
		issues.some((issue) => issue.includes('text overflow')) &&
		composition.aspectRatio !== '16:9'
	) {
		pushIssue(
			issues,
			`${spec.id}: scene "${scene.id}" risks safe-area crowding in ${composition.aspectRatio} because the copy budget overruns the ${layout.mode} layout.`
		);
	}

	return issues;
};

const validateFeatureLayoutBudgets = ({ spec }: { spec: VideoSpec }) => {
	const textOverflowIssues: string[] = [];
	const safeAreaIssues: string[] = [];

	for (const composition of getStandaloneCompositionMetadata(spec)) {
		for (const scene of spec.scenes) {
			for (const issue of validateSceneLayoutReadability({ spec, scene, composition })) {
				if (issue.includes('text overflow')) {
					pushIssue(textOverflowIssues, issue);
				}

				if (issue.includes('safe-area')) {
					pushIssue(safeAreaIssues, issue);
				}
			}
		}
	}

	return {
		textOverflowIssues,
		safeAreaIssues,
	};
};

const validateCompositionRegistration = ({
	spec,
	workspaceRoot,
}: {
	spec: VideoSpec;
	workspaceRoot: string;
}) => {
	const issues: string[] = [];
	const expectedDurationInFrames = getDurationInFrames(spec);
	const registrySource = readFileSync(
		resolve(workspaceRoot, 'src/lib/composition-registry.ts'),
		'utf8'
	);
	const rootSource = readFileSync(resolve(workspaceRoot, 'src/Root.tsx'), 'utf8');

	if (!registrySource.includes('compositionManifest.map')) {
		pushIssue(
			issues,
			`${spec.id}: composition-registry.ts must continue registering compositions from compositionManifest.`
		);
	}

	if (!rootSource.includes('compositionDefinitions.map')) {
		pushIssue(
			issues,
			`${spec.id}: Root.tsx must continue mounting Remotion compositions from compositionDefinitions.`
		);
	}

	for (const composition of getStandaloneCompositionMetadata(spec)) {
		const manifestEntry = getCompositionManifestById(composition.compositionId);

		if (!manifestEntry) {
			pushIssue(
				issues,
				`${spec.id}: missing composition manifest entry for ${composition.compositionId}.`
			);
			continue;
		}

		if (
			manifestEntry.width !== composition.dimensions.width ||
			manifestEntry.height !== composition.dimensions.height
		) {
			pushIssue(
				issues,
				`${spec.id}: ${composition.compositionId} dimensions drift from its composition metadata.`
			);
		}

		if (
			manifestEntry.fps !== spec.fps ||
			manifestEntry.durationInFrames !== expectedDurationInFrames
		) {
			pushIssue(
				issues,
				`${spec.id}: ${composition.compositionId} timing must stay aligned with the standalone spec.`
			);
		}

		if (manifestEntry.defaultProps.spec.id !== spec.id) {
			pushIssue(
				issues,
				`${spec.id}: ${composition.compositionId} defaultProps must point at the matching standalone spec.`
			);
		}
	}

	return issues;
};

const createCheck = (id: DeliveryQaCheckId, issues: string[]): DeliveryQaCheckResult => ({
	id,
	label: QA_CHECK_LABELS[id],
	status: issues.length === 0 ? 'pass' : 'fail',
	issues,
});

export const runFinalDeliveryQa = ({
	workspaceRoot = process.cwd(),
}: {
	workspaceRoot?: string;
} = {}): FinalDeliveryQaReport => {
	const features = standaloneFeatureSpecs.map((spec) => {
		const manifest = readFeatureCaptureManifest({ workspaceRoot, spec });
		const layoutValidation = validateFeatureLayoutBudgets({ spec });
		const checks = [
			createCheck('schema-integrity', validateSchemaIntegrity({ spec })),
			createCheck(
				'missing-assets',
				validateFeatureAssetCoverage({
					spec,
					manifest,
					workspaceRoot,
				})
			),
			createCheck('text-overflow', layoutValidation.textOverflowIssues),
			createCheck('safe-area', layoutValidation.safeAreaIssues),
			createCheck('timing-drift', validateTimingDrift({ spec })),
			createCheck('broken-fallbacks', validateFeatureCaptureManifest(manifest, spec)),
			createCheck(
				'composition-registration',
				validateCompositionRegistration({ spec, workspaceRoot })
			),
		];
		const issueCount = checks.reduce((sum, check) => sum + check.issues.length, 0);

		return {
			specId: spec.id,
			featureName: spec.featureName,
			featureSlug: manifest.featureSlug,
			qaReportPath:
				FINAL_DELIVERY_QA_REPORT_PATHS[spec.id as keyof typeof FINAL_DELIVERY_QA_REPORT_PATHS] ??
				`docs/reports/qa/${manifest.featureSlug}-final-qa-report.md`,
			checks,
			issueCount,
		};
	});

	return {
		features,
		totalIssueCount: features.reduce((sum, feature) => sum + feature.issueCount, 0),
	};
};

export const formatFinalDeliveryQaReport = (report: FinalDeliveryQaReport) => {
	if (report.totalIssueCount === 0) {
		const featureSummaries = report.features
			.map(
				(feature) =>
					`- ${feature.featureName}: ${feature.checks.length} checks passed, report ${feature.qaReportPath}`
			)
			.join('\n');

		return `Final delivery QA passed\n${featureSummaries}`;
	}

	const failures = report.features
		.filter((feature) => feature.issueCount > 0)
		.map((feature) => {
			const checkFailures = feature.checks
				.filter((check) => check.issues.length > 0)
				.map((check) => `  - ${check.label}: ${check.issues.join(' | ')}`)
				.join('\n');

			return `${feature.featureName}\n${checkFailures}`;
		})
		.join('\n\n');

	return `Final delivery QA failed\n${failures}`;
};
