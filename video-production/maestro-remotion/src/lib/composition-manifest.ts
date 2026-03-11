import type { VideoCompositionProps, VideoSpec } from '../data/production-schema';
import { prototypeSpecs, standaloneFeatureSpecs } from '../data/specs';
import {
	WORKSPACE_COMPOSITION_ID,
	WORKSPACE_DIMENSIONS,
	WORKSPACE_DURATION_IN_FRAMES,
	WORKSPACE_FPS,
	workspaceBootstrapDefaults,
} from '../workspace-metadata';
import {
	createVideoCompositionMetadata,
	getStandaloneCompositionMetadata,
} from './aspect-ratio-adaptation';
import { getDurationInFrames } from './timeline';

export type CompositionManifestEntry = {
	id: string;
	width: number;
	height: number;
	fps: number;
	durationInFrames: number;
	defaultProps: VideoCompositionProps;
};

const createCompositionManifestEntry = (
	spec: VideoSpec,
	composition = createVideoCompositionMetadata(spec, '16:9')
): CompositionManifestEntry => ({
	id: composition.compositionId,
	width: composition.dimensions.width,
	height: composition.dimensions.height,
	fps: spec.fps,
	durationInFrames: getDurationInFrames(spec),
	defaultProps: {
		spec,
		composition,
	},
});

export const compositionManifest = [
	{
		id: WORKSPACE_COMPOSITION_ID,
		width: WORKSPACE_DIMENSIONS.width,
		height: WORKSPACE_DIMENSIONS.height,
		fps: WORKSPACE_FPS,
		durationInFrames: WORKSPACE_DURATION_IN_FRAMES,
		defaultProps: workspaceBootstrapDefaults,
	},
	...prototypeSpecs.map((spec) => createCompositionManifestEntry(spec)),
	...standaloneFeatureSpecs.flatMap((spec) =>
		getStandaloneCompositionMetadata(spec).map((composition) =>
			createCompositionManifestEntry(spec, composition)
		)
	),
] satisfies CompositionManifestEntry[];

export const prototypeCompositionManifest = compositionManifest.filter(
	(entry) => entry.id !== WORKSPACE_COMPOSITION_ID
);

export const getCompositionManifestById = (compositionId: string) => {
	return compositionManifest.find((entry) => entry.id === compositionId);
};
