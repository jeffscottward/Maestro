import type { VideoCompositionProps } from './data/production-schema';
import { workspaceBootstrapSpec } from './data/workspace-bootstrap-spec';
import { createVideoCompositionMetadata } from './lib/aspect-ratio-adaptation';
import { getDurationInFrames } from './lib/timeline';

export const WORKSPACE_COMPOSITION_ID = workspaceBootstrapSpec.id;
export const WORKSPACE_DIMENSIONS = workspaceBootstrapSpec.dimensions;
export const WORKSPACE_FPS = workspaceBootstrapSpec.fps;
export const WORKSPACE_DURATION_IN_FRAMES = getDurationInFrames(workspaceBootstrapSpec);

export const workspaceBootstrapDefaults = {
	spec: workspaceBootstrapSpec,
	composition: createVideoCompositionMetadata(workspaceBootstrapSpec, '16:9'),
} satisfies VideoCompositionProps;
