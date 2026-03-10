import type React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';

import type { VideoCompositionProps } from '../data/production-schema';
import { getCapturesForScene, getSceneOffsets } from '../lib/timeline';
import { FeatureHeroScene } from '../scenes/FeatureHeroScene';

export const MaestroFeatureComposition: React.FC<VideoCompositionProps> = ({ spec }) => {
	const scenes = getSceneOffsets(spec);

	return (
		<AbsoluteFill>
			{scenes.map(({ scene, startFrame, index }) => (
				<Sequence key={scene.id} from={startFrame} durationInFrames={scene.durationInFrames}>
					<FeatureHeroScene
						scene={scene}
						sceneIndex={index}
						sceneCount={scenes.length}
						spec={spec}
						captures={getCapturesForScene(spec, scene)}
					/>
				</Sequence>
			))}
		</AbsoluteFill>
	);
};

export const MaestroWorkspaceBootstrapComposition = MaestroFeatureComposition;
