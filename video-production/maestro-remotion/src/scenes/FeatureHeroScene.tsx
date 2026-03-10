import type React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import {
	getEntranceProgress,
	getSceneOpacity,
	translateXFromProgress,
	translateYFromProgress,
} from '../animations/motion';
import { FeatureSurfaceShowcase } from '../components/FeatureSurfaceShowcase';
import { ProductionFrame } from '../components/ProductionFrame';
import type { CaptureManifestEntry, SceneData, VideoSpec } from '../data/production-schema';
import { MAESTRO_SURFACE_THEMES } from '../lib/maestroVisualSystem';
import { MetaBadge } from '../ui/MetaBadge';

type FeatureHeroSceneProps = {
	scene: SceneData;
	sceneIndex: number;
	sceneCount: number;
	spec: VideoSpec;
	captures: CaptureManifestEntry[];
};

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

export const FeatureHeroScene: React.FC<FeatureHeroSceneProps> = ({
	scene,
	sceneIndex,
	sceneCount,
	spec,
	captures,
}) => {
	const theme =
		scene.type === 'title-card' ? MAESTRO_SURFACE_THEMES.symphony : MAESTRO_SURFACE_THEMES.worktree;
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const primaryEntrance = getEntranceProgress(frame, fps, spec.motion);
	const secondaryEntrance = getEntranceProgress(frame, fps, spec.motion, 8);
	const sceneOpacity = getSceneOpacity(frame, scene.durationInFrames, spec.motion);
	const topRailProgress = interpolate(frame, [0, scene.durationInFrames - 1], [0.12, 1], clamp);
	const titleOpacity = interpolate(primaryEntrance, [0, 1], [0.15, 1], clamp);
	const bodyOpacity = interpolate(secondaryEntrance, [0, 1], [0, 1], clamp);
	const contentLift = translateYFromProgress(primaryEntrance, 56, 0);
	const cardSlide = translateXFromProgress(secondaryEntrance, 84, 0);

	return (
		<ProductionFrame theme={theme}>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1.4fr 0.9fr',
					gap: 44,
					height: '100%',
					opacity: sceneOpacity,
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						transform: `translateY(${contentLift}px)`,
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
						<div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', opacity: titleOpacity }}>
							<MetaBadge label={scene.accentLabel} tone="accent" theme={theme} />
							<MetaBadge label={scene.featureName} theme={theme} />
							<MetaBadge label={`${sceneIndex + 1}/${sceneCount} scenes`} theme={theme} />
						</div>

						<div
							style={{ display: 'flex', flexDirection: 'column', gap: 18, opacity: titleOpacity }}
						>
							<h1
								style={{
									fontSize: 88,
									lineHeight: 0.96,
									margin: 0,
									maxWidth: 900,
								}}
							>
								{scene.title}
							</h1>
							<p
								style={{
									fontSize: 31,
									lineHeight: 1.45,
									margin: 0,
									maxWidth: 920,
									color: theme.colors.textDim,
									opacity: bodyOpacity,
								}}
							>
								{scene.body}
							</p>
						</div>
					</div>

					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 16,
							maxWidth: 920,
							opacity: bodyOpacity,
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								fontSize: 18,
								letterSpacing: 1.2,
								textTransform: 'uppercase',
								color: theme.colors.textDim,
							}}
						>
							<span>Validated Production Spec</span>
							<span>{spec.aspectRatio} master</span>
						</div>
						<div
							style={{
								height: 10,
								borderRadius: 999,
								backgroundColor: theme.colors.accentDim,
								overflow: 'hidden',
							}}
						>
							<div
								style={{
									height: '100%',
									width: `${topRailProgress * 100}%`,
									borderRadius: 999,
									background: `linear-gradient(90deg, ${theme.colors.accentText}, ${theme.colors.accent})`,
								}}
							/>
						</div>
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						alignItems: 'stretch',
						transform: `translateX(${cardSlide}px)`,
						opacity: bodyOpacity,
					}}
				>
					<FeatureSurfaceShowcase scene={scene} captures={captures} />
				</div>
			</div>
		</ProductionFrame>
	);
};
