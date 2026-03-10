export const WORKSPACE_COMPOSITION_ID = 'MaestroWorkspaceBootstrap';
export const WORKSPACE_DIMENSIONS = {
	width: 1920,
	height: 1080,
} as const;
export const WORKSPACE_FPS = 30;
export const WORKSPACE_DURATION_IN_FRAMES = WORKSPACE_FPS * 6;

export const workspaceBootstrapDefaults = {
	title: 'Maestro Remotion Workspace',
	subtitle: "Source-of-truth references captured for Symphony, Director's Notes, and Auto Run worktrees.",
} as const;
