import type { ComponentType } from 'react';
import type { z } from 'zod';

import { MaestroFeatureComposition } from '../compositions/MaestroWorkspaceBootstrapComposition';
import { VideoCompositionPropsSchema, type VideoCompositionProps, type VideoSpec } from '../data/production-schema';
import { prototypeSpecs } from '../data/specs';
import { getDurationInFrames } from './timeline';
import {
	WORKSPACE_COMPOSITION_ID,
	WORKSPACE_DIMENSIONS,
	WORKSPACE_DURATION_IN_FRAMES,
	WORKSPACE_FPS,
	workspaceBootstrapDefaults,
} from '../workspace-metadata';

type RegisteredComposition = {
	id: string;
	component: ComponentType<VideoCompositionProps>;
	width: number;
	height: number;
	fps: number;
	durationInFrames: number;
	defaultProps: VideoCompositionProps;
	schema: z.ZodType<VideoCompositionProps>;
};

const createRegisteredComposition = (spec: VideoSpec): RegisteredComposition => ({
	id: spec.id,
	component: MaestroFeatureComposition,
	width: spec.dimensions.width,
	height: spec.dimensions.height,
	fps: spec.fps,
	durationInFrames: getDurationInFrames(spec),
	defaultProps: {
		spec,
	},
	schema: VideoCompositionPropsSchema,
});

export const compositionDefinitions = [
	{
		id: WORKSPACE_COMPOSITION_ID,
		component: MaestroFeatureComposition,
		width: WORKSPACE_DIMENSIONS.width,
		height: WORKSPACE_DIMENSIONS.height,
		fps: WORKSPACE_FPS,
		durationInFrames: WORKSPACE_DURATION_IN_FRAMES,
		defaultProps: workspaceBootstrapDefaults,
		schema: VideoCompositionPropsSchema,
	},
	...prototypeSpecs.map((spec) => createRegisteredComposition(spec)),
] satisfies RegisteredComposition[];

export const getCompositionById = (compositionId: string) => {
	return compositionDefinitions.find((composition) => composition.id === compositionId);
};

export { WORKSPACE_COMPOSITION_ID };
