import { prototypeSpecs } from '../data/specs';
import {
	VideoCompositionPropsSchema,
	VideoSpecSchema,
	type VideoSpec,
} from '../data/production-schema';
import { getCompositionManifestById } from './composition-manifest';
import { getDurationInFrames } from './timeline';

export const REQUIRED_PROTOTYPE_COMPOSITION_IDS = [
	'MaestroFeatureTeaser',
	'SymphonyPrototype',
	'DirectorNotesPrototype',
	'WorktreeSpinOffsPrototype',
] as const;

const pushIssue = (issues: string[], issue: string) => {
	if (!issues.includes(issue)) {
		issues.push(issue);
	}
};

export const validateVideoSpecCompleteness = (spec: VideoSpec) => {
	const issues: string[] = [];

	if (spec.featureName.trim().length === 0) {
		pushIssue(issues, `${spec.id}: featureName is required.`);
	}

	if (spec.fps <= 0) {
		pushIssue(issues, `${spec.id}: fps must be greater than 0.`);
	}

	if (spec.runtimeSeconds <= 0) {
		pushIssue(issues, `${spec.id}: runtimeSeconds must be greater than 0.`);
	}

	if (spec.scenes.length === 0) {
		pushIssue(issues, `${spec.id}: scenes must contain at least one entry.`);
	}

	if (spec.capturePlan.length === 0) {
		pushIssue(issues, `${spec.id}: capturePlan must contain at least one entry.`);
	}

	if (!spec.capturePlan.some((capture) => capture.required)) {
		pushIssue(issues, `${spec.id}: capturePlan must include at least one required capture.`);
	}

	const parseResult = VideoSpecSchema.safeParse(spec);
	if (!parseResult.success) {
		for (const issue of parseResult.error.issues) {
			const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
			pushIssue(issues, `${spec.id}: ${path}${issue.message}`);
		}
	}

	return issues;
};

export const validatePrototypeWorkspace = () => {
	const issues: string[] = [];
	const prototypeIds = prototypeSpecs.map((spec) => spec.id);

	if (
		REQUIRED_PROTOTYPE_COMPOSITION_IDS.length !== prototypeIds.length ||
		!REQUIRED_PROTOTYPE_COMPOSITION_IDS.every(
			(compositionId, index) => prototypeIds[index] === compositionId
		)
	) {
		pushIssue(
			issues,
			`prototypeSpecs must stay ordered as ${REQUIRED_PROTOTYPE_COMPOSITION_IDS.join(', ')}.`
		);
	}

	for (const spec of prototypeSpecs) {
		issues.push(...validateVideoSpecCompleteness(spec));

		const definition = getCompositionManifestById(spec.id);
		if (!definition) {
			pushIssue(issues, `${spec.id}: missing composition registry entry.`);
			continue;
		}

		if (definition.fps !== spec.fps) {
			pushIssue(issues, `${spec.id}: composition fps must match the source spec.`);
		}

		if (definition.durationInFrames !== getDurationInFrames(spec)) {
			pushIssue(issues, `${spec.id}: composition duration must match runtimeSeconds * fps.`);
		}

		if (
			definition.width !== spec.dimensions.width ||
			definition.height !== spec.dimensions.height
		) {
			pushIssue(issues, `${spec.id}: composition dimensions must match the source spec.`);
		}

		if (definition.defaultProps.spec.id !== spec.id) {
			pushIssue(issues, `${spec.id}: defaultProps must point at the matching source spec.`);
		}

		const defaultPropsParseResult = VideoCompositionPropsSchema.safeParse(definition.defaultProps);
		if (!defaultPropsParseResult.success) {
			pushIssue(issues, `${spec.id}: defaultProps must satisfy the composition props schema.`);
		}
	}

	return issues;
};
