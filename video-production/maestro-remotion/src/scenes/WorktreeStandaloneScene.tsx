import type React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import {
	getWorktreeCursorPose,
	getWorktreeFlowStage,
	getWorktreeFocusFrame,
	getWorktreeStagePose,
} from '../animations/worktree-choreography';
import {
	getEntranceProgress,
	getProgressInRange,
	getSceneOpacity,
	translateXFromProgress,
	translateYFromProgress,
} from '../animations/motion';
import { getSurfaceTheme } from '../components/FeatureSurfaceShowcase';
import { AnimatedReveal, GuidedCursor } from '../components/SymphonyMotionPrimitives';
import {
	getWorktreeComparisonCopy,
	StoryNote,
	WorktreeBranchBackdrop,
	WorktreeComparisonBoard,
	WorktreeFlowStrip,
	WorktreeFocusOverlay,
} from '../components/WorktreeStandalonePrimitives';
import { WorktreeSurfaceShowcase } from '../components/WorktreeSurfaceShowcase';
import { ProductionFrame } from '../components/ProductionFrame';
import type { CaptureManifestEntry, SceneData, VideoSpec } from '../data/production-schema';
import { MetaBadge } from '../ui/MetaBadge';

type WorktreeStandaloneSceneProps = {
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

const formatNarrativeCopy = (value: string) => value.replaceAll('`', '');

export const WorktreeStandaloneScene: React.FC<WorktreeStandaloneSceneProps> = ({
	scene,
	sceneIndex,
	sceneCount,
	spec,
	captures,
}) => {
	const theme = getSurfaceTheme(scene.surfaceId);
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const storyboard = scene.storyboard;
	const titleEntrance = getEntranceProgress(frame, fps, spec.motion);
	const copyEntrance = getEntranceProgress(frame, fps, spec.motion, 6);
	const supportEntrance = getEntranceProgress(frame, fps, spec.motion, 12);
	const sceneOpacity = getSceneOpacity(frame, scene.durationInFrames, spec.motion);
	const sceneProgress = getProgressInRange(frame, 0, Math.max(scene.durationInFrames - 1, 1));
	const surfaceProgress = interpolate(sceneProgress, [0, 0.14, 0.92], [0, 0.16, 1], clamp);
	const stagePose = getWorktreeStagePose(scene.id, frame, scene.durationInFrames);
	const cursorPose = getWorktreeCursorPose(scene.id, frame, scene.durationInFrames);
	const focusFrame = getWorktreeFocusFrame(scene.id, frame, scene.durationInFrames);
	const activeStage = getWorktreeFlowStage(scene.id);
	const comparisonCopy = getWorktreeComparisonCopy(scene.id);
	const title = formatNarrativeCopy(scene.title);
	const body = formatNarrativeCopy(scene.body);
	const currentBeat = formatNarrativeCopy(storyboard?.uiStateShown ?? scene.accentLabel);
	const onScreenCopy = (storyboard?.onScreenCopy ?? []).map((line) => formatNarrativeCopy(line));
	const userAction = formatNarrativeCopy(storyboard?.userAction ?? scene.accentLabel);
	const systemResponse = formatNarrativeCopy(storyboard?.systemResponse ?? scene.body);
	const titleLift = translateYFromProgress(titleEntrance, 56, 0);
	const copyLift = translateYFromProgress(copyEntrance, 36, 0);
	const stageSlide = translateXFromProgress(supportEntrance, 48, 0);
	const surfaceShadowOpacity = interpolate(
		supportEntrance,
		[0, 1],
		[0.08, stagePose.glowOpacity],
		clamp
	);

	return (
		<ProductionFrame theme={theme}>
			<div
				style={{
					display: 'grid',
					gridTemplateRows: '1fr auto',
					gap: 28,
					height: '100%',
					opacity: sceneOpacity,
				}}
			>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '0.88fr 1.12fr',
						gap: 40,
						minHeight: 0,
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 18,
							transform: `translateY(${titleLift}px)`,
						}}
					>
						<AnimatedReveal frame={frame} delayFrames={0} durationFrames={18}>
							<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
								<MetaBadge label={scene.accentLabel} tone="accent" theme={theme} />
								<MetaBadge label={`${sceneIndex + 1}/${sceneCount} scenes`} theme={theme} />
								<MetaBadge label={`${spec.fps} fps master`} theme={theme} />
							</div>
						</AnimatedReveal>

						<AnimatedReveal frame={frame} delayFrames={4} durationFrames={20}>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
								<h1
									style={{
										fontSize: 66,
										lineHeight: 0.96,
										margin: 0,
										maxWidth: 820,
									}}
								>
									{title}
								</h1>
								<p
									style={{
										fontSize: 24,
										lineHeight: 1.44,
										margin: 0,
										maxWidth: 840,
										color: theme.colors.textDim,
										opacity: interpolate(copyEntrance, [0, 1], [0.18, 1], clamp),
									}}
								>
									{body}
								</p>
							</div>
						</AnimatedReveal>

						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
								gap: 14,
								transform: `translateY(${copyLift}px)`,
							}}
						>
							{onScreenCopy.map((line, index) => (
								<AnimatedReveal
									key={line}
									frame={frame}
									index={index}
									delayFrames={12}
									stepFrames={5}
									durationFrames={16}
								>
									<StoryNote label={`Hook ${index + 1}`} body={line} theme={theme} compact />
								</AnimatedReveal>
							))}
						</div>

						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
								gap: 14,
							}}
						>
							<AnimatedReveal frame={frame} delayFrames={18} durationFrames={18}>
								<StoryNote label="User Action" body={userAction} theme={theme} compact />
							</AnimatedReveal>
							<AnimatedReveal frame={frame} delayFrames={22} durationFrames={18}>
								<StoryNote label="System Response" body={systemResponse} theme={theme} compact />
							</AnimatedReveal>
						</div>
					</div>

					<div
						style={{
							position: 'relative',
							minHeight: 0,
							transform: `translateX(${stageSlide}px)`,
						}}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 16,
								height: '100%',
							}}
						>
							<AnimatedReveal frame={frame} delayFrames={8} durationFrames={16}>
								<WorktreeFlowStrip activeStage={activeStage} frame={frame} theme={theme} />
							</AnimatedReveal>

							<AnimatedReveal frame={frame} delayFrames={12} durationFrames={16}>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										gap: 14,
										padding: '16px 20px',
										borderRadius: 22,
										border: `1px solid ${theme.colors.border}`,
										background: theme.colors.bgActivity,
									}}
								>
									<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
										<div
											style={{
												fontSize: 15,
												letterSpacing: 1.1,
												textTransform: 'uppercase',
												color: theme.colors.textDim,
											}}
										>
											Current Beat
										</div>
										<div style={{ fontSize: 22, color: theme.colors.textMain }}>{currentBeat}</div>
									</div>
									<MetaBadge label={activeStage} tone="accent" theme={theme} />
								</div>
							</AnimatedReveal>

							<div style={{ position: 'relative', minHeight: 0, flex: 1 }}>
								<div
									style={{
										position: 'absolute',
										inset: 0,
										borderRadius: 34,
										background: `radial-gradient(circle at 24% 16%, ${theme.colors.accent}22, transparent 46%)`,
										opacity: surfaceShadowOpacity,
									}}
								/>
								<div
									style={{
										position: 'absolute',
										inset: 0,
										borderRadius: 34,
										border: `1px solid ${theme.colors.border}`,
										background: `linear-gradient(180deg, ${theme.colors.bgSidebar}, ${theme.colors.bgMain})`,
										overflow: 'hidden',
										boxShadow: `0 28px 80px ${theme.colors.accent}10`,
									}}
								>
									<div
										style={{
											position: 'absolute',
											inset: 0,
											background: `radial-gradient(circle at 74% 16%, transparent, ${theme.colors.bgMain})`,
											opacity: stagePose.vignetteOpacity,
										}}
									/>
									<WorktreeBranchBackdrop
										progress={sceneProgress}
										theme={theme}
										opacity={stagePose.glowOpacity}
									/>
									<div
										style={{
											position: 'absolute',
											inset: 0,
											transform: `translate3d(${stagePose.translateX}px, ${stagePose.translateY}px, 0) scale(${stagePose.scale}) rotate(${stagePose.rotate}deg)`,
											transformOrigin: 'center center',
										}}
									>
										<WorktreeSurfaceShowcase
											scene={scene}
											captures={captures}
											progress={surfaceProgress}
											theme={theme}
										/>
									</div>
									<WorktreeFocusOverlay
										label={focusFrame.label}
										opacity={focusFrame.opacity}
										theme={theme}
										x={focusFrame.x}
										y={focusFrame.y}
										width={focusFrame.width}
										height={focusFrame.height}
									/>
								</div>
								<GuidedCursor cursor={cursorPose} theme={theme} />
							</div>
						</div>
					</div>
				</div>

				<AnimatedReveal frame={frame} delayFrames={20} durationFrames={20}>
					<WorktreeComparisonBoard
						sceneId={scene.id}
						comparisonCopy={comparisonCopy}
						theme={theme}
						frame={frame}
						progress={sceneProgress}
					/>
				</AnimatedReveal>
			</div>
		</ProductionFrame>
	);
};
