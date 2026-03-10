import type React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

import type { CaptureManifestEntry, SceneData, SceneSurfaceId } from '../data/production-schema';
import { MAESTRO_SURFACE_THEMES, type MaestroVisualTheme } from '../lib/maestroVisualSystem';
import { DirectorNotesSurfaceShowcase } from './DirectorNotesSurfaceShowcase';
import { SymphonySurfaceShowcase } from './SymphonySurfaceShowcase';
import { WorktreeSurfaceShowcase } from './WorktreeSurfaceShowcase';

type FeatureSurfaceShowcaseProps = {
	scene: SceneData;
	captures: CaptureManifestEntry[];
};

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

export const getSurfaceTheme = (surfaceId: SceneSurfaceId): MaestroVisualTheme => {
	if (surfaceId === 'director-history' || surfaceId === 'director-ai-overview') {
		return MAESTRO_SURFACE_THEMES['director-notes'];
	}

	if (surfaceId === 'worktree-dispatch' || surfaceId === 'worktree-terminal') {
		return MAESTRO_SURFACE_THEMES.worktree;
	}

	return MAESTRO_SURFACE_THEMES.symphony;
};

export const FeatureSurfaceShowcase: React.FC<FeatureSurfaceShowcaseProps> = ({
	scene,
	captures,
}) => {
	const frame = useCurrentFrame();
	const theme = getSurfaceTheme(scene.surfaceId);
	const progress = interpolate(frame, [0, scene.durationInFrames - 1], [0.18, 1], clamp);

	switch (scene.surfaceId) {
		case 'symphony-projects':
		case 'symphony-create-agent':
			return (
				<SymphonySurfaceShowcase
					scene={scene}
					captures={captures}
					progress={progress}
					theme={theme}
				/>
			);
		case 'director-history':
		case 'director-ai-overview':
			return (
				<DirectorNotesSurfaceShowcase
					scene={scene}
					captures={captures}
					progress={progress}
					theme={theme}
				/>
			);
		case 'worktree-terminal':
		case 'worktree-dispatch':
		default:
			return (
				<WorktreeSurfaceShowcase
					scene={scene}
					captures={captures}
					progress={progress}
					theme={theme}
				/>
			);
	}
};
