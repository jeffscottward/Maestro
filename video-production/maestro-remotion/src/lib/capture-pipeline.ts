import {
	CaptureAssetManifestEntrySchema,
	CapturePathMetadataSchema,
	FeatureCaptureManifestSchema,
	SceneCaptureMappingSchema,
	type CaptureBucket,
	type CaptureCropPlanEntry,
	type CaptureMediaType,
	type FeatureCaptureManifest,
} from '../data/capture-schema';
import type { AssetPlaceholder, VideoSpec } from '../data/production-schema';

export const CAPTURE_ROOT = 'capture';
export const CAPTURE_BUCKETS = [
	'live',
	'docs',
	'derived',
	'manifests',
	'recordings',
] as const satisfies readonly CaptureBucket[];

type FfmpegTrimCrop = {
	width: number;
	height: number;
	x: number;
	y: number;
};

export type FfmpegTrimCommandInput = {
	inputPath: string;
	outputPath: string;
	trimStartSeconds: number;
	trimDurationSeconds: number;
	fps?: number;
	crop?: FfmpegTrimCrop;
};

const videoExtensions = new Set(['mov', 'mp4', 'mkv', 'webm']);
const imageExtensions = new Set(['png', 'jpg', 'jpeg', 'webp']);
const audioExtensions = new Set(['wav', 'mp3', 'aac', 'm4a']);

const pushIssue = (issues: string[], issue: string) => {
	if (!issues.includes(issue)) {
		issues.push(issue);
	}
};

const getFileExtension = (fileName: string) => {
	const extensionStart = fileName.lastIndexOf('.');

	if (extensionStart <= 0 || extensionStart === fileName.length - 1) {
		throw new Error(`Capture path must include a file extension, got: ${fileName}`);
	}

	return fileName.slice(extensionStart + 1).toLowerCase();
};

const formatSceneNumber = (sceneNumber: number) => String(sceneNumber).padStart(2, '0');

const arraysMatch = (left: readonly string[], right: readonly string[]) =>
	left.length === right.length && left.every((value, index) => value === right[index]);

const getCapturePathSegments = (relativePath: string) => {
	const segments = relativePath.split('/').filter(Boolean);

	if (segments.length !== 4 || segments[0] !== CAPTURE_ROOT) {
		throw new Error(
			`Capture path must follow "capture/<bucket>/<feature>/<file>", got: ${relativePath}`
		);
	}

	return segments as [typeof CAPTURE_ROOT, CaptureBucket, string, string];
};

export const slugifyCaptureSegment = (value: string) =>
	value
		.toLowerCase()
		.replace(/['"]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-{2,}/g, '-');

export const getCaptureMediaType = (extension: string): CaptureMediaType => {
	if (videoExtensions.has(extension)) {
		return 'video';
	}

	if (imageExtensions.has(extension)) {
		return 'image';
	}

	if (audioExtensions.has(extension)) {
		return 'audio';
	}

	return 'data';
};

export const extractCaptureAssetMetadata = (relativePath: string) => {
	const [, bucket, featureSlug, fileName] = getCapturePathSegments(relativePath);
	const extension = getFileExtension(fileName);

	return CapturePathMetadataSchema.parse({
		relativePath,
		bucket,
		featureSlug,
		fileName,
		stem: fileName.slice(0, -(extension.length + 1)),
		extension,
		mediaType: getCaptureMediaType(extension),
	});
};

export const getCaptureBucketForAssetKind = (kind: AssetPlaceholder['kind']): CaptureBucket => {
	switch (kind) {
		case 'live-capture':
			return 'live';
		case 'doc-capture':
			return 'docs';
		case 'reconstructed-ui':
		case 'motion-graphic':
		case 'voiceover':
		case 'music':
		case 'sfx':
			return 'derived';
	}
};

export const getFeatureCaptureSlug = (spec: VideoSpec) => {
	const featureSlugs = new Set(
		(spec.assetPlaceholders ?? []).map(
			(asset) => extractCaptureAssetMetadata(asset.plannedSource).featureSlug
		)
	);

	if (featureSlugs.size > 1) {
		throw new Error(
			`${spec.id} must use a single feature slug across asset placeholders, got: ${[
				...featureSlugs,
			].join(', ')}`
		);
	}

	if (featureSlugs.size === 1) {
		return [...featureSlugs][0];
	}

	return slugifyCaptureSegment(spec.featureName);
};

export const getCaptureDirectories = (featureSlug: string) => ({
	live: `${CAPTURE_ROOT}/live/${featureSlug}`,
	docs: `${CAPTURE_ROOT}/docs/${featureSlug}`,
	derived: `${CAPTURE_ROOT}/derived/${featureSlug}`,
	manifests: `${CAPTURE_ROOT}/manifests/${featureSlug}`,
	recordings: `${CAPTURE_ROOT}/recordings/${featureSlug}`,
});

export const getFeatureCaptureManifestPath = (featureSlug: string) =>
	`${getCaptureDirectories(featureSlug).manifests}/${featureSlug}-capture-manifest.json`;

export const getSceneRecordingPath = (
	featureSlug: string,
	sceneNumber: number,
	sceneId: string,
	extension = 'mov'
) =>
	`${CAPTURE_ROOT}/recordings/${featureSlug}/s${formatSceneNumber(sceneNumber)}-${sceneId}.${extension}`;

export const buildSceneCropPlan = (spec: VideoSpec): CaptureCropPlanEntry[] => {
	const cropPlan: CaptureCropPlanEntry[] = [
		{
			ratio: '16:9',
			framing: `Use the authored ${spec.dimensions.width}x${spec.dimensions.height} master frame for capture logging and trims.`,
			safeZone:
				'Keep the full master frame available so later trims can derive square and vertical crops without re-recording.',
		},
	];

	if (spec.aspectRatioIntent) {
		cropPlan.push(...spec.aspectRatioIntent.adaptations);
	}

	return cropPlan;
};

export const buildFfmpegTrimCommand = ({
	inputPath,
	outputPath,
	trimStartSeconds,
	trimDurationSeconds,
	fps,
	crop,
}: FfmpegTrimCommandInput) => {
	const filters: string[] = [];

	if (crop) {
		filters.push(`crop=${crop.width}:${crop.height}:${crop.x}:${crop.y}`);
	}

	if (fps) {
		filters.push(`fps=${fps}`);
	}

	return [
		'ffmpeg',
		'-y',
		'-ss',
		trimStartSeconds.toFixed(3),
		'-i',
		inputPath,
		'-t',
		trimDurationSeconds.toFixed(3),
		...(filters.length > 0 ? ['-vf', filters.join(',')] : []),
		outputPath,
	];
};

export const buildFeatureCaptureManifest = (spec: VideoSpec): FeatureCaptureManifest => {
	if (!spec.assetPlaceholders || spec.assetPlaceholders.length === 0) {
		throw new Error(`${spec.id} requires assetPlaceholders before capture manifests can be built.`);
	}

	const featureSlug = getFeatureCaptureSlug(spec);
	const directories = getCaptureDirectories(featureSlug);
	const captureById = new Map(spec.capturePlan.map((capture) => [capture.id, capture]));

	const assets = spec.assetPlaceholders.map((asset) => {
		const metadata = extractCaptureAssetMetadata(asset.plannedSource);

		return CaptureAssetManifestEntrySchema.parse({
			...asset,
			bucket: metadata.bucket,
			featureSlug: metadata.featureSlug,
			mediaType: metadata.mediaType,
			metadata,
			sourceStatus: metadata.bucket === 'derived' ? 'derived' : 'planned',
			capturedPath: null,
		});
	});

	const sceneMappings = spec.scenes.map((scene, index) => {
		const sceneNumber = scene.storyboard?.sceneNumber ?? index + 1;
		const assetPlaceholderIds = scene.assetPlaceholderIds ?? [];

		if (assetPlaceholderIds.length === 0) {
			throw new Error(`${spec.id} scene "${scene.id}" requires assetPlaceholderIds.`);
		}

		return SceneCaptureMappingSchema.parse({
			sceneId: scene.id,
			sceneNumber,
			purpose: scene.storyboard?.purpose ?? scene.title,
			captureIds: scene.captureIds,
			assetPlaceholderIds,
			recordingPath: getSceneRecordingPath(featureSlug, sceneNumber, scene.id),
			cropPlan: buildSceneCropPlan(spec),
			sources: scene.captureIds.map((captureId) => {
				const capture = captureById.get(captureId);

				if (!capture) {
					throw new Error(
						`${spec.id} scene "${scene.id}" references unknown capture "${captureId}".`
					);
				}

				return {
					captureId: capture.id,
					plannedMode: capture.mode,
					sourceRef: capture.sourceRef,
					required: capture.required,
					sourceStatus: 'planned',
					resolvedSourcePath: null,
					fallbackAssetIds: assetPlaceholderIds,
					notes: capture.notes,
				};
			}),
		});
	});

	return FeatureCaptureManifestSchema.parse({
		version: 1,
		status: 'planned',
		specId: spec.id,
		featureName: spec.featureName,
		featureSlug,
		manifestPath: getFeatureCaptureManifestPath(featureSlug),
		directories,
		captures: spec.capturePlan,
		assets,
		sceneMappings,
		aspectRatioIntent: spec.aspectRatioIntent,
	});
};

export const getDeclaredCaptureAssetPath = (asset: {
	capturedPath: string | null;
	plannedSource: string;
}) => asset.capturedPath ?? asset.plannedSource;

export const validateFeatureCaptureManifest = (
	manifest: FeatureCaptureManifest,
	spec: VideoSpec
) => {
	const issues: string[] = [];
	const expectedFeatureSlug = getFeatureCaptureSlug(spec);
	const expectedDirectories = getCaptureDirectories(expectedFeatureSlug);
	const expectedManifestPath = getFeatureCaptureManifestPath(expectedFeatureSlug);
	const assetById = new Map(spec.assetPlaceholders?.map((asset) => [asset.id, asset]) ?? []);
	const sceneMappingsById = new Map(
		manifest.sceneMappings.map((sceneMapping) => [sceneMapping.sceneId, sceneMapping])
	);

	if (manifest.specId !== spec.id) {
		pushIssue(issues, `${spec.id}: manifest specId must stay in sync with the source spec.`);
	}

	if (manifest.featureName !== spec.featureName) {
		pushIssue(issues, `${spec.id}: manifest featureName must stay in sync with the source spec.`);
	}

	if (manifest.featureSlug !== expectedFeatureSlug) {
		pushIssue(
			issues,
			`${spec.id}: manifest featureSlug must stay in sync with planned asset paths.`
		);
	}

	if (manifest.manifestPath !== expectedManifestPath) {
		pushIssue(
			issues,
			`${spec.id}: manifestPath must stay under capture/manifests/<feature-slug>/.`
		);
	}

	for (const directoryKey of Object.keys(
		expectedDirectories
	) as (keyof typeof expectedDirectories)[]) {
		if (manifest.directories[directoryKey] !== expectedDirectories[directoryKey]) {
			pushIssue(
				issues,
				`${spec.id}: directory "${directoryKey}" must stay aligned with the feature slug scaffold.`
			);
		}
	}

	if (manifest.captures.length !== spec.capturePlan.length) {
		pushIssue(issues, `${spec.id}: manifest capture count must match the source spec.`);
	}

	if (manifest.assets.length !== (spec.assetPlaceholders?.length ?? 0)) {
		pushIssue(issues, `${spec.id}: manifest asset count must match the source spec.`);
	}

	if (manifest.sceneMappings.length !== spec.scenes.length) {
		pushIssue(issues, `${spec.id}: manifest scene mapping count must match the source spec.`);
	}

	for (const asset of manifest.assets) {
		const sourceAsset = assetById.get(asset.id);

		if (!sourceAsset) {
			pushIssue(
				issues,
				`${spec.id}: manifest asset "${asset.id}" is not declared in the source spec.`
			);
			continue;
		}

		const expectedBucket = getCaptureBucketForAssetKind(sourceAsset.kind);

		if (asset.plannedSource !== sourceAsset.plannedSource) {
			pushIssue(issues, `${spec.id}: asset "${asset.id}" must preserve its plannedSource path.`);
		}

		if (asset.bucket !== expectedBucket) {
			pushIssue(
				issues,
				`${spec.id}: asset "${asset.id}" must live in capture/${expectedBucket}/ based on its kind.`
			);
		}

		if (asset.metadata.relativePath !== asset.plannedSource) {
			pushIssue(
				issues,
				`${spec.id}: asset "${asset.id}" metadata must point at its plannedSource.`
			);
		}

		if (
			asset.featureSlug !== manifest.featureSlug ||
			asset.metadata.featureSlug !== manifest.featureSlug
		) {
			pushIssue(issues, `${spec.id}: asset "${asset.id}" must keep the manifest feature slug.`);
		}
	}

	for (const [index, scene] of spec.scenes.entries()) {
		const sceneMapping = sceneMappingsById.get(scene.id);
		const expectedSceneNumber = scene.storyboard?.sceneNumber ?? index + 1;
		const expectedAssetPlaceholderIds = scene.assetPlaceholderIds ?? [];

		if (!sceneMapping) {
			pushIssue(issues, `${spec.id}: scene "${scene.id}" is missing from the capture manifest.`);
			continue;
		}

		if (sceneMapping.sceneNumber !== expectedSceneNumber) {
			pushIssue(
				issues,
				`${spec.id}: scene "${scene.id}" must preserve storyboard scene number ${expectedSceneNumber}.`
			);
		}

		if (!arraysMatch(sceneMapping.captureIds, scene.captureIds)) {
			pushIssue(
				issues,
				`${spec.id}: scene "${scene.id}" captureIds must stay aligned with the source spec.`
			);
		}

		if (!arraysMatch(sceneMapping.assetPlaceholderIds, expectedAssetPlaceholderIds)) {
			pushIssue(
				issues,
				`${spec.id}: scene "${scene.id}" assetPlaceholderIds must stay aligned with the source spec.`
			);
		}

		if (
			sceneMapping.recordingPath !==
			getSceneRecordingPath(manifest.featureSlug, expectedSceneNumber, scene.id)
		) {
			pushIssue(
				issues,
				`${spec.id}: scene "${scene.id}" recordingPath must stay under capture/recordings/<feature-slug>/.`
			);
		}

		if (sceneMapping.sources.length !== scene.captureIds.length) {
			pushIssue(
				issues,
				`${spec.id}: scene "${scene.id}" must carry one planned source entry per captureId.`
			);
		}

		const cropRatios = sceneMapping.cropPlan.map((entry) => entry.ratio);
		if (cropRatios[0] !== '16:9') {
			pushIssue(
				issues,
				`${spec.id}: scene "${scene.id}" crop bookkeeping must begin with the 16:9 master.`
			);
		}

		for (const source of sceneMapping.sources) {
			if (!scene.captureIds.includes(source.captureId)) {
				pushIssue(
					issues,
					`${spec.id}: scene "${scene.id}" includes unknown source mapping "${source.captureId}".`
				);
			}

			if (!arraysMatch(source.fallbackAssetIds, expectedAssetPlaceholderIds)) {
				pushIssue(
					issues,
					`${spec.id}: scene "${scene.id}" source "${source.captureId}" must keep the scene asset fallback list.`
				);
			}
		}
	}

	return issues;
};

export const validateFeatureCaptureReadiness = (
	manifest: FeatureCaptureManifest,
	spec: VideoSpec
) => {
	const issues: string[] = [];
	const sceneMappingsById = new Map(
		manifest.sceneMappings.map((sceneMapping) => [sceneMapping.sceneId, sceneMapping])
	);
	const assetsById = new Map(manifest.assets.map((asset) => [asset.id, asset]));

	for (const scene of spec.scenes) {
		const sceneMapping = sceneMappingsById.get(scene.id);

		if (!sceneMapping) {
			pushIssue(
				issues,
				`${spec.id}: scene "${scene.id}" cannot be marked ready because it is missing from the manifest.`
			);
			continue;
		}

		if (sceneMapping.sources.length === 0) {
			pushIssue(
				issues,
				`${spec.id}: scene "${scene.id}" must declare at least one visual source before implementation starts.`
			);
			continue;
		}

		let hasResolvedVisualSource = false;
		let hasDeclaredFallbackPath = false;

		for (const source of sceneMapping.sources) {
			if (source.required && source.sourceStatus !== 'resolved') {
				pushIssue(
					issues,
					`${spec.id}: scene "${scene.id}" source "${source.captureId}" must be resolved before implementation starts.`
				);
			}

			if (source.resolvedSourcePath) {
				hasResolvedVisualSource = true;
			}

			if (source.required && source.fallbackAssetIds.length === 0) {
				pushIssue(
					issues,
					`${spec.id}: scene "${scene.id}" source "${source.captureId}" must declare a fallback asset path.`
				);
			}

			for (const fallbackAssetId of source.fallbackAssetIds) {
				const asset = assetsById.get(fallbackAssetId);

				if (!asset) {
					pushIssue(
						issues,
						`${spec.id}: scene "${scene.id}" source "${source.captureId}" references unknown fallback asset "${fallbackAssetId}".`
					);
					continue;
				}

				if (!sceneMapping.assetPlaceholderIds.includes(fallbackAssetId)) {
					pushIssue(
						issues,
						`${spec.id}: scene "${scene.id}" source "${source.captureId}" fallback "${fallbackAssetId}" must stay aligned with the scene asset placeholders.`
					);
				}

				const fallbackPath = getDeclaredCaptureAssetPath(asset);

				if (fallbackPath) {
					hasDeclaredFallbackPath = true;
				}
			}
		}

		if (!hasResolvedVisualSource) {
			pushIssue(
				issues,
				`${spec.id}: scene "${scene.id}" must declare a resolved visual source path before implementation starts.`
			);
		}

		if (!hasDeclaredFallbackPath) {
			pushIssue(
				issues,
				`${spec.id}: scene "${scene.id}" must declare at least one fallback path before implementation starts.`
			);
		}
	}

	return issues;
};

export const serializeCaptureManifest = (manifest: FeatureCaptureManifest) =>
	`${JSON.stringify(manifest, null, '\t')}\n`;
