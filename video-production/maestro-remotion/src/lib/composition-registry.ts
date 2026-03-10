import type { ComponentType } from 'react';
import type { z } from 'zod';

import { MaestroFeatureComposition } from '../compositions/MaestroWorkspaceBootstrapComposition';
import { VideoCompositionPropsSchema, type VideoCompositionProps } from '../data/production-schema';
import { compositionManifest } from './composition-manifest';
import { WORKSPACE_COMPOSITION_ID } from '../workspace-metadata';

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

const createRegisteredComposition = (
	entry: (typeof compositionManifest)[number]
): RegisteredComposition => ({
	id: entry.id,
	component: MaestroFeatureComposition,
	width: entry.width,
	height: entry.height,
	fps: entry.fps,
	durationInFrames: entry.durationInFrames,
	defaultProps: entry.defaultProps,
	schema: VideoCompositionPropsSchema,
});

export const compositionDefinitions = compositionManifest.map((entry) =>
	createRegisteredComposition(entry)
) satisfies RegisteredComposition[];

export const getCompositionById = (compositionId: string) => {
	return compositionDefinitions.find((composition) => composition.id === compositionId);
};

export { WORKSPACE_COMPOSITION_ID };
