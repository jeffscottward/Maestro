import type { VideoCompositionProps, VideoSpec } from '../data/production-schema';
import { directorNotesStandaloneSpec, prototypeSpecs, symphonyStandaloneSpec } from '../data/specs';
import {
	WORKSPACE_COMPOSITION_ID,
	WORKSPACE_DIMENSIONS,
	WORKSPACE_DURATION_IN_FRAMES,
	WORKSPACE_FPS,
	workspaceBootstrapDefaults,
} from '../workspace-metadata';
import { getDurationInFrames } from './timeline';

export type CompositionManifestEntry = {
	id: string;
	width: number;
	height: number;
	fps: number;
	durationInFrames: number;
	defaultProps: VideoCompositionProps;
};

const createCompositionManifestEntry = (spec: VideoSpec): CompositionManifestEntry => ({
	id: spec.id,
	width: spec.dimensions.width,
	height: spec.dimensions.height,
	fps: spec.fps,
	durationInFrames: getDurationInFrames(spec),
	defaultProps: {
		spec,
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
	createCompositionManifestEntry(symphonyStandaloneSpec),
	createCompositionManifestEntry(directorNotesStandaloneSpec),
] satisfies CompositionManifestEntry[];

export const prototypeCompositionManifest = compositionManifest.filter(
	(entry) => entry.id !== WORKSPACE_COMPOSITION_ID
);

export const getCompositionManifestById = (compositionId: string) => {
	return compositionManifest.find((entry) => entry.id === compositionId);
};
