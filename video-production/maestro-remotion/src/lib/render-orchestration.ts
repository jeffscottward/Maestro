import {
	SupportedAspectRatioSchema,
	type SupportedAspectRatio,
	type VideoSpec,
} from '../data/production-schema';
import { standaloneFeatureSpecs } from '../data/specs';
import { getStandaloneCompositionMetadata } from './aspect-ratio-adaptation';
import { getFeatureCaptureSlug } from './capture-pipeline';
import { getCompositionManifestById } from './composition-manifest';

export const DELIVERY_RENDER_ENTRY_FILE = 'src/index.ts';
export const DELIVERY_RENDER_ROOT = 'renders/delivery';
export const DELIVERY_RENDER_MANIFEST_ROOT = 'renders/manifests';
export const DELIVERY_RENDER_VERSION = 'v1';

export type DeliveryRenderTarget = {
	traceId: string;
	featureSlug: string;
	featureName: string;
	specId: string;
	compositionId: string;
	compositionLabel: string;
	aspectRatio: SupportedAspectRatio;
	variantKey: '16x9' | '1x1' | '9x16';
	width: number;
	height: number;
	fps: number;
	durationInFrames: number;
	runtimeSeconds: number;
	version: string;
	outputDirectory: string;
	filename: string;
	outputPath: string;
	renderCommand: string;
	framing: string;
	safeZone: string;
};

export type DeliveryRenderMatrixManifest = {
	generatedAt: string;
	entryFile: string;
	renderRoot: string;
	manifestPath: string;
	version: string;
	targetCount: number;
	filters: {
		featureSlugs: string[];
		aspectRatios: SupportedAspectRatio[];
	};
	targets: DeliveryRenderTarget[];
};

export type BuildDeliveryRenderMatrixOptions = {
	featureSelectors?: string[];
	aspectRatios?: SupportedAspectRatio[];
	version?: string;
	renderRoot?: string;
	entryFile?: string;
	manifestPath?: string;
};

const joinRenderPath = (...segments: string[]) => segments.filter(Boolean).join('/');

const normalizeSelector = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const toKebabCase = (value: string) =>
	value
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
		.toLowerCase();

const removeRenderSuffix = (specId: string) => specId.replace(/(Standalone|Prototype)$/, '');

const getSpecIdSlug = (spec: Pick<VideoSpec, 'id'>) => toKebabCase(removeRenderSuffix(spec.id));

export const getFeatureSlugFromSpec = (spec: VideoSpec) => getFeatureCaptureSlug(spec);

const getArtifactStem = (spec: Pick<VideoSpec, 'id'>) => `${getSpecIdSlug(spec)}-standalone`;

const getSpecAliases = (spec: VideoSpec) =>
	new Set([
		normalizeSelector(spec.id),
		normalizeSelector(removeRenderSuffix(spec.id)),
		normalizeSelector(getSpecIdSlug(spec)),
		normalizeSelector(getFeatureCaptureSlug(spec)),
		normalizeSelector(spec.featureName),
		normalizeSelector(spec.title),
	]);

const resolveStandaloneSpecs = (featureSelectors: string[]) => {
	if (featureSelectors.length === 0) {
		return [...standaloneFeatureSpecs];
	}

	const requestedSelectors = featureSelectors.map(normalizeSelector).filter(Boolean);
	const resolvedSpecs = standaloneFeatureSpecs.filter((spec) => {
		const aliases = getSpecAliases(spec);
		return requestedSelectors.some((selector) => aliases.has(selector));
	});

	if (resolvedSpecs.length === 0) {
		throw new Error(
			`No standalone feature matched filters: ${featureSelectors.join(', ')}. Expected one of ${standaloneFeatureSpecs
				.map((spec) => getFeatureSlugFromSpec(spec))
				.join(', ')}.`
		);
	}

	return resolvedSpecs;
};

const resolveAspectRatios = (aspectRatios: string[]) => {
	if (aspectRatios.length === 0) {
		return ['16:9', '1:1', '9:16'] satisfies SupportedAspectRatio[];
	}

	return aspectRatios.map((ratio) => SupportedAspectRatioSchema.parse(ratio));
};

export const getDefaultDeliveryManifestPath = (version = DELIVERY_RENDER_VERSION) =>
	joinRenderPath(DELIVERY_RENDER_MANIFEST_ROOT, `delivery-render-matrix-${version}.json`);

export const buildDeliveryRenderMatrix = (
	options: BuildDeliveryRenderMatrixOptions = {}
): DeliveryRenderMatrixManifest => {
	const version = options.version ?? DELIVERY_RENDER_VERSION;
	const renderRoot = options.renderRoot ?? DELIVERY_RENDER_ROOT;
	const entryFile = options.entryFile ?? DELIVERY_RENDER_ENTRY_FILE;
	const manifestPath = options.manifestPath ?? getDefaultDeliveryManifestPath(version);
	const aspectRatios = resolveAspectRatios(options.aspectRatios ?? []);
	const specs = resolveStandaloneSpecs(options.featureSelectors ?? []);

	const targets = specs.flatMap((spec) => {
		const featureSlug = getFeatureSlugFromSpec(spec);
		const artifactStem = getArtifactStem(spec);

		return getStandaloneCompositionMetadata(spec)
			.filter((composition) => aspectRatios.includes(composition.aspectRatio))
			.map((composition) => {
				const manifestEntry = getCompositionManifestById(composition.compositionId);

				if (!manifestEntry) {
					throw new Error(
						`Missing registered composition manifest entry for ${composition.compositionId}.`
					);
				}

				const filename = `${artifactStem}-${composition.variantKey}-${manifestEntry.fps}fps-${version}.mp4`;
				const outputDirectory = joinRenderPath(
					renderRoot,
					featureSlug,
					composition.variantKey,
					version
				);
				const outputPath = joinRenderPath(outputDirectory, filename);
				const renderCommand = [
					'pnpm',
					'exec',
					'remotion',
					'render',
					entryFile,
					composition.compositionId,
					outputPath,
				].join(' ');

				return {
					traceId: `${artifactStem}-${composition.variantKey}-${manifestEntry.fps}fps-${version}`,
					featureSlug,
					featureName: spec.featureName,
					specId: spec.id,
					compositionId: composition.compositionId,
					compositionLabel: composition.label,
					aspectRatio: composition.aspectRatio,
					variantKey: composition.variantKey,
					width: manifestEntry.width,
					height: manifestEntry.height,
					fps: manifestEntry.fps,
					durationInFrames: manifestEntry.durationInFrames,
					runtimeSeconds: manifestEntry.durationInFrames / manifestEntry.fps,
					version,
					outputDirectory,
					filename,
					outputPath,
					renderCommand,
					framing: composition.framing,
					safeZone: composition.safeZone,
				} satisfies DeliveryRenderTarget;
			});
	});

	return {
		generatedAt: new Date().toISOString(),
		entryFile,
		renderRoot,
		manifestPath,
		version,
		targetCount: targets.length,
		filters: {
			featureSlugs: specs.map((spec) => getFeatureSlugFromSpec(spec)),
			aspectRatios,
		},
		targets,
	};
};
