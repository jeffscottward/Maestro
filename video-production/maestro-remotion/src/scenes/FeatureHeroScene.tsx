import type React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import {
	getEntranceProgress,
	getSceneOpacity,
	translateXFromProgress,
	translateYFromProgress,
} from '../animations/motion';
import { ProductionFrame } from '../components/ProductionFrame';
import type { CaptureManifestEntry, SceneData, VideoSpec } from '../data/production-schema';
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
		<ProductionFrame>
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
							<MetaBadge label={scene.accentLabel} tone="accent" />
							<MetaBadge label={scene.featureName} />
							<MetaBadge label={`${sceneIndex + 1}/${sceneCount} scenes`} />
						</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: 18, opacity: titleOpacity }}>
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
									color: 'rgba(243, 233, 255, 0.76)',
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
								color: 'rgba(243, 233, 255, 0.62)',
							}}
						>
							<span>Validated Production Spec</span>
							<span>{spec.aspectRatio} master</span>
						</div>
						<div
							style={{
								height: 10,
								borderRadius: 999,
								backgroundColor: 'rgba(149, 115, 193, 0.2)',
								overflow: 'hidden',
							}}
						>
							<div
								style={{
									height: '100%',
									width: `${topRailProgress * 100}%`,
									borderRadius: 999,
									background:
										'linear-gradient(90deg, rgba(244, 139, 204, 0.84), rgba(151, 151, 255, 0.95))',
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
					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							gap: 24,
							padding: '28px 30px',
							borderRadius: 28,
							border: '1px solid rgba(210, 181, 255, 0.18)',
							background:
								'linear-gradient(180deg, rgba(23, 16, 41, 0.92), rgba(12, 10, 20, 0.86))',
						}}
					>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
							<div
								style={{
									fontSize: 18,
									letterSpacing: 1.4,
									textTransform: 'uppercase',
									color: 'rgba(243, 233, 255, 0.6)',
								}}
							>
								Capture Manifest
							</div>
							<div style={{ fontSize: 44, lineHeight: 1.05 }}>{captures.length} linked inputs</div>
						</div>

						<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
							{captures.map((capture) => (
								<div
									key={capture.id}
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: 10,
										padding: '18px 20px',
										borderRadius: 22,
										backgroundColor: 'rgba(255, 255, 255, 0.03)',
										border: '1px solid rgba(210, 181, 255, 0.12)',
									}}
								>
									<div style={{ display: 'flex', justifyContent: 'space-between', gap: 18 }}>
										<div style={{ fontSize: 24 }}>{capture.feature}</div>
										<MetaBadge label={capture.mode.replaceAll('-', ' ')} />
									</div>
									<div style={{ fontSize: 18, color: 'rgba(243, 233, 255, 0.65)' }}>{capture.notes}</div>
									<div
										style={{
											fontSize: 17,
											color: 'rgba(244, 139, 204, 0.84)',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
										}}
									>
										{capture.sourceRef}
									</div>
								</div>
							))}
						</div>

						<div
							style={{
								marginTop: 'auto',
								display: 'grid',
								gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
								gap: 14,
							}}
						>
							<div
								style={{
									padding: '18px 20px',
									borderRadius: 22,
									backgroundColor: 'rgba(255, 255, 255, 0.03)',
									border: '1px solid rgba(210, 181, 255, 0.12)',
								}}
							>
								<div style={{ fontSize: 16, color: 'rgba(243, 233, 255, 0.56)', textTransform: 'uppercase' }}>
									FPS
								</div>
								<div style={{ fontSize: 32, marginTop: 8 }}>{spec.fps}</div>
							</div>
							<div
								style={{
									padding: '18px 20px',
									borderRadius: 22,
									backgroundColor: 'rgba(255, 255, 255, 0.03)',
									border: '1px solid rgba(210, 181, 255, 0.12)',
								}}
							>
								<div style={{ fontSize: 16, color: 'rgba(243, 233, 255, 0.56)', textTransform: 'uppercase' }}>
									Runtime
								</div>
								<div style={{ fontSize: 32, marginTop: 8 }}>{spec.runtimeSeconds.toFixed(0)}s</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ProductionFrame>
	);
};
