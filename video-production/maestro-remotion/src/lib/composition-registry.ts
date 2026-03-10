import type { ComponentType } from 'react';
import type { z } from 'zod';

import { WorkspaceBootstrap } from '../WorkspaceBootstrap';
import { VideoCompositionPropsSchema, type VideoCompositionProps } from '../data/production-schema';
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

export const compositionDefinitions = [
	{
		id: WORKSPACE_COMPOSITION_ID,
		component: WorkspaceBootstrap,
		width: WORKSPACE_DIMENSIONS.width,
		height: WORKSPACE_DIMENSIONS.height,
		fps: WORKSPACE_FPS,
		durationInFrames: WORKSPACE_DURATION_IN_FRAMES,
		defaultProps: workspaceBootstrapDefaults,
		schema: VideoCompositionPropsSchema,
	},
] satisfies RegisteredComposition[];

export const getCompositionById = (compositionId: string) => {
	return compositionDefinitions.find((composition) => composition.id === compositionId);
};

export { WORKSPACE_COMPOSITION_ID };
