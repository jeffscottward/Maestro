import { Composition } from 'remotion';

import { WorkspaceBootstrap } from './WorkspaceBootstrap';
import {
	WORKSPACE_COMPOSITION_ID,
	WORKSPACE_DIMENSIONS,
	WORKSPACE_DURATION_IN_FRAMES,
	WORKSPACE_FPS,
	workspaceBootstrapDefaults,
} from './workspace-metadata';

export const RemotionRoot = () => {
	return (
		<Composition
			id={WORKSPACE_COMPOSITION_ID}
			component={WorkspaceBootstrap}
			durationInFrames={WORKSPACE_DURATION_IN_FRAMES}
			fps={WORKSPACE_FPS}
			width={WORKSPACE_DIMENSIONS.width}
			height={WORKSPACE_DIMENSIONS.height}
			defaultProps={workspaceBootstrapDefaults}
		/>
	);
};
