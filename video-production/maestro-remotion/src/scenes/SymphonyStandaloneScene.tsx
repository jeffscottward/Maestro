import type React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import {
	getEntranceProgress,
	getSceneOpacity,
	translateXFromProgress,
	translateYFromProgress,
} from '../animations/motion';
import {
	SYMPHONY_FLOW_STAGES,
	getSymphonyCursorPose,
	getSymphonyFlowStage,
	getSymphonyStagePose,
} from '../animations/symphony-choreography';
import { FeatureSurfaceShowcase, getSurfaceTheme } from '../components/FeatureSurfaceShowcase';
import {
	AnimatedReveal,
	SymphonyFlowStrip,
	SymphonyGuidedCursor,
} from '../components/SymphonyMotionPrimitives';
import { ProductionFrame } from '../components/ProductionFrame';
import type {
	CaptureManifestEntry,
	SceneData,
	VideoCompositionMetadata,
	VideoSpec,
} from '../data/production-schema';
import { getSceneShellLayout } from '../lib/aspect-ratio-adaptation';
import type { MaestroVisualTheme } from '../lib/maestroVisualSystem';
import { MetaBadge } from '../ui/MetaBadge';

type SymphonyStandaloneSceneProps = {
	scene: SceneData;
	sceneIndex: number;
	sceneCount: number;
	spec: VideoSpec;
	composition: VideoCompositionMetadata;
	captures: CaptureManifestEntry[];
};

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

const formatNarrativeCopy = (value: string) => value.replaceAll('`', '');

const StoryNote: React.FC<{
	label: string;
	body: string;
	theme: MaestroVisualTheme;
	compact?: boolean;
}> = ({ label, body, theme, compact = false }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: compact ? 8 : 12,
				padding: compact ? '14px 16px' : '18px 20px',
				borderRadius: 22,
				border: `1px solid ${theme.colors.border}`,
				background: theme.colors.bgActivity,
			}}
		>
			<div
				style={{
					fontSize: 15,
					letterSpacing: 1.1,
					textTransform: 'uppercase',
					color: theme.colors.textDim,
				}}
			>
				{label}
			</div>
			<div
				style={{
					fontSize: compact ? 18 : 20,
					lineHeight: compact ? 1.42 : 1.46,
					color: theme.colors.textMain,
				}}
			>
				{body}
			</div>
		</div>
	);
};

export const SymphonyStandaloneScene: React.FC<SymphonyStandaloneSceneProps> = ({
	scene,
	sceneIndex,
	sceneCount,
	spec,
	composition,
	captures,
}) => {
	const theme = getSurfaceTheme(scene.surfaceId);
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const layout = getSceneShellLayout({
		specId: spec.id,
		sceneId: scene.id,
		aspectRatio: composition.aspectRatio,
	});
	const storyboard = scene.storyboard;
	const headlineEntrance = getEntranceProgress(frame, fps, spec.motion);
	const copyEntrance = getEntranceProgress(frame, fps, spec.motion, 6);
	const supportEntrance = getEntranceProgress(frame, fps, spec.motion, 12);
	const sceneOpacity = getSceneOpacity(frame, scene.durationInFrames, spec.motion);
	const stagePose = getSymphonyStagePose(scene.id, frame, scene.durationInFrames);
	const cursorPose = getSymphonyCursorPose(scene.id, frame, scene.durationInFrames);
	const activeStage = getSymphonyFlowStage(scene.id);
	const title = formatNarrativeCopy(scene.title);
	const body = formatNarrativeCopy(scene.body);
	const uiStateShown = formatNarrativeCopy(storyboard?.uiStateShown ?? scene.accentLabel);
	const onScreenCopy = (storyboard?.onScreenCopy ?? []).map((line) => formatNarrativeCopy(line));
	const userAction = formatNarrativeCopy(storyboard?.userAction ?? scene.accentLabel);
	const systemResponse = formatNarrativeCopy(storyboard?.systemResponse ?? scene.body);
	const headlineLift = translateYFromProgress(headlineEntrance, 58, 0);
	const copyLift = translateYFromProgress(copyEntrance, 38, 0);
	const stageSlide = layout.mode === 'split' ? translateXFromProgress(supportEntrance, 52, 0) : 0;
	const stageGlow = interpolate(supportEntrance, [0, 1], [0.12, 0.3], clamp);

	return (
		<ProductionFrame theme={theme} composition={composition}>
			<div
				data-aspect-ratio={composition.aspectRatio}
				data-layout-mode={layout.mode}
				data-story-note-columns={String(layout.noteColumns)}
				data-surface-priority={layout.surfacePriority}
				style={{
					display: 'grid',
					gridTemplateRows: layout.mode === 'split' ? '1fr auto' : 'auto auto',
					gap: layout.frameGap,
					height: '100%',
					opacity: sceneOpacity,
				}}
			>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: layout.mode === 'split' ? '0.88fr 1.12fr' : '1fr',
						gap: layout.contentGap,
						minHeight: 0,
					}}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: layout.sectionGap,
							transform: `translateY(${headlineLift}px)`,
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
										fontSize: layout.titleFontSize,
										lineHeight: 0.96,
										margin: 0,
										maxWidth: layout.headlineMaxWidth,
									}}
								>
									{title}
								</h1>
								<p
									style={{
										fontSize: layout.bodyFontSize,
										lineHeight: 1.44,
										margin: 0,
										maxWidth: layout.bodyMaxWidth,
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
								gridTemplateColumns: `repeat(${layout.noteColumns}, minmax(0, 1fr))`,
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
									<StoryNote
										label={`Hook ${index + 1}`}
										body={line}
										theme={theme}
										compact={layout.compactStoryCards}
									/>
								</AnimatedReveal>
							))}
						</div>

						<div
							style={{
								display: 'grid',
								gridTemplateColumns: `repeat(${layout.supportColumns}, minmax(0, 1fr))`,
								gap: 14,
							}}
						>
							<AnimatedReveal frame={frame} delayFrames={18} durationFrames={18}>
								<StoryNote
									label="User Action"
									body={userAction}
									theme={theme}
									compact={layout.compactStoryCards}
								/>
							</AnimatedReveal>
							<AnimatedReveal frame={frame} delayFrames={22} durationFrames={18}>
								<StoryNote
									label="System Response"
									body={systemResponse}
									theme={theme}
									compact={layout.compactStoryCards}
								/>
							</AnimatedReveal>
						</div>
					</div>

					<div
						style={{
							position: 'relative',
							minHeight: layout.mode === 'split' ? 0 : layout.stageMinHeight,
							transform: `translateX(${stageSlide}px)`,
						}}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: layout.stageGap,
								height: layout.mode === 'split' ? '100%' : 'auto',
							}}
						>
							<AnimatedReveal frame={frame} delayFrames={10} durationFrames={18}>
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
										<div style={{ fontSize: 22, color: theme.colors.textMain }}>{uiStateShown}</div>
									</div>
									<MetaBadge label={activeStage} tone="accent" theme={theme} />
								</div>
							</AnimatedReveal>

							<div
								style={{
									position: 'relative',
									flex: layout.mode === 'split' ? 1 : undefined,
									minHeight: layout.mode === 'split' ? 0 : layout.stageMinHeight,
									borderRadius: 34,
									border: `1px solid ${theme.colors.border}`,
									background: `linear-gradient(180deg, ${theme.colors.bgSidebar}, ${theme.colors.bgMain})`,
									boxShadow: `0 28px 80px rgba(7, 4, 14, ${0.28 + stageGlow})`,
									overflow: 'hidden',
								}}
							>
								<div
									style={{
										position: 'absolute',
										inset: 0,
										background: `radial-gradient(circle at 20% 10%, ${theme.colors.accent}33 0%, transparent 38%), radial-gradient(circle at 82% 84%, ${theme.colors.warning}12 0%, transparent 32%)`,
									}}
								/>
								<div
									style={{
										position: 'absolute',
										inset: 18,
										transform: `translate3d(${stagePose.translateX}px, ${stagePose.translateY}px, 0) scale(${stagePose.scale}) rotate(${stagePose.rotate}deg)`,
										transformOrigin: 'center center',
									}}
								>
									<FeatureSurfaceShowcase scene={scene} captures={captures} />
								</div>
								<SymphonyGuidedCursor cursor={cursorPose} theme={theme} />
							</div>
						</div>
					</div>
				</div>

				<AnimatedReveal frame={frame} delayFrames={14} durationFrames={20}>
					<SymphonyFlowStrip
						activeStage={activeStage}
						stages={SYMPHONY_FLOW_STAGES}
						frame={frame}
						theme={theme}
					/>
				</AnimatedReveal>
			</div>
		</ProductionFrame>
	);
};
