import type React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import {
	getEntranceProgress,
	getProgressInRange,
	getSceneOpacity,
	translateXFromProgress,
	translateYFromProgress,
} from '../animations/motion';
import {
	DIRECTOR_NOTES_FLOW_STAGES,
	getDirectorNotesCursorPose,
	getDirectorNotesFlowStage,
	getDirectorNotesFocusFrame,
	getDirectorNotesStagePose,
} from '../animations/director-notes-choreography';
import { DirectorNotesSurfaceShowcase } from '../components/DirectorNotesSurfaceShowcase';
import { AnimatedReveal, GuidedCursor } from '../components/SymphonyMotionPrimitives';
import { ProductionFrame } from '../components/ProductionFrame';
import type { CaptureManifestEntry, SceneData, VideoSpec } from '../data/production-schema';
import { getSurfaceTheme } from '../components/FeatureSurfaceShowcase';
import type { MaestroVisualTheme } from '../lib/maestroVisualSystem';
import { MetaBadge } from '../ui/MetaBadge';

type DirectorNotesStandaloneSceneProps = {
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

const StoryNote: React.FC<{
	label: string;
	body: string;
	theme: MaestroVisualTheme;
}> = ({ label, body, theme }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
				padding: '16px 18px',
				borderRadius: 22,
				border: `1px solid ${theme.colors.border}`,
				background: theme.colors.bgActivity,
			}}
		>
			<div
				style={{
					fontSize: 14,
					letterSpacing: 1.1,
					textTransform: 'uppercase',
					color: theme.colors.textDim,
				}}
			>
				{label}
			</div>
			<div style={{ fontSize: 20, lineHeight: 1.44, color: theme.colors.textMain }}>{body}</div>
		</div>
	);
};

const DirectorNotesFlowStrip: React.FC<{
	activeStage: (typeof DIRECTOR_NOTES_FLOW_STAGES)[number];
	frame: number;
	theme: MaestroVisualTheme;
}> = ({ activeStage, frame, theme }) => {
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: `repeat(${DIRECTOR_NOTES_FLOW_STAGES.length}, minmax(0, 1fr))`,
				gap: 12,
			}}
		>
			{DIRECTOR_NOTES_FLOW_STAGES.map((stage, index) => {
				const isActive = stage === activeStage;

				return (
					<AnimatedReveal
						key={stage}
						frame={frame}
						index={index}
						delayFrames={10}
						stepFrames={4}
						durationFrames={16}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 8,
								padding: '12px 14px',
								borderRadius: 18,
								border: `1px solid ${isActive ? `${theme.colors.accent}88` : theme.colors.border}`,
								background: isActive ? theme.colors.accentDim : theme.colors.bgActivity,
							}}
						>
							<div
								style={{
									fontSize: 13,
									letterSpacing: 1.1,
									textTransform: 'uppercase',
									color: theme.colors.textDim,
								}}
							>
								{String(index + 1).padStart(2, '0')}
							</div>
							<div
								style={{
									fontSize: 19,
									color: isActive ? theme.colors.accentText : theme.colors.textMain,
								}}
							>
								{stage}
							</div>
							<div
								style={{
									height: 4,
									borderRadius: 999,
									background: isActive ? `${theme.colors.accent}88` : theme.colors.border,
								}}
							/>
						</div>
					</AnimatedReveal>
				);
			})}
		</div>
	);
};

const DirectorNotesFocusOverlay: React.FC<{
	label: string;
	opacity: number;
	theme: MaestroVisualTheme;
	x: number;
	y: number;
	width: number;
	height: number;
}> = ({ label, opacity, theme, x, y, width, height }) => {
	return (
		<div
			style={{
				position: 'absolute',
				left: `${x * 100}%`,
				top: `${y * 100}%`,
				width: `${width * 100}%`,
				height: `${height * 100}%`,
				transform: 'translate(-50%, -50%)',
				borderRadius: 28,
				border: `1px solid ${theme.colors.accent}88`,
				boxShadow: `0 0 0 1px ${theme.colors.accent}33, 0 20px 60px ${theme.colors.accent}18`,
				background: `linear-gradient(180deg, ${theme.colors.accent}10, transparent)`,
				opacity,
				pointerEvents: 'none',
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: 18,
					top: -18,
					padding: '8px 12px',
					borderRadius: 999,
					border: `1px solid ${theme.colors.accent}55`,
					background: `${theme.colors.bgMain}f2`,
					color: theme.colors.accentText,
					fontSize: 14,
					letterSpacing: 0.8,
					whiteSpace: 'nowrap',
				}}
			>
				{label}
			</div>
		</div>
	);
};

const FragmentedContextBackdrop: React.FC<{
	theme: MaestroVisualTheme;
	opacity: number;
}> = ({ theme, opacity }) => {
	const ghostCards = [
		{ title: 'PedTome RSSidian', detail: 'Recent history' },
		{ title: 'Learned Hand', detail: 'Session log' },
		{ title: 'Maestro', detail: 'AUTO run output' },
	];

	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				pointerEvents: 'none',
				opacity,
			}}
		>
			{ghostCards.map((card, index) => (
				<div
					key={card.title}
					style={{
						position: 'absolute',
						left: `${4 + index * 13}%`,
						top: `${8 + index * 16}%`,
						width: '42%',
						padding: '18px 20px',
						borderRadius: 22,
						border: `1px solid ${theme.colors.border}`,
						background: `${theme.colors.bgSidebar}c2`,
						boxShadow: `0 22px 40px ${theme.colors.bgSidebar}`,
						filter: 'blur(0.4px)',
						transform: `scale(${1 - index * 0.04}) translateX(${-20 + index * 18}px)`,
					}}
				>
					<div style={{ fontSize: 16, color: theme.colors.textDim }}>{card.detail}</div>
					<div style={{ fontSize: 28, color: theme.colors.textMain }}>{card.title}</div>
				</div>
			))}
		</div>
	);
};

export const DirectorNotesStandaloneScene: React.FC<DirectorNotesStandaloneSceneProps> = ({
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
	const stagePose = getDirectorNotesStagePose(scene.id, frame, scene.durationInFrames);
	const cursorPose = getDirectorNotesCursorPose(scene.id, frame, scene.durationInFrames);
	const focusFrame = getDirectorNotesFocusFrame(scene.id, frame, scene.durationInFrames);
	const activeStage = getDirectorNotesFlowStage(scene.id);
	const title = formatNarrativeCopy(scene.title);
	const body = formatNarrativeCopy(scene.body);
	const currentBeat = formatNarrativeCopy(storyboard?.uiStateShown ?? scene.accentLabel);
	const onScreenCopy = (storyboard?.onScreenCopy ?? []).map((line) => formatNarrativeCopy(line));
	const userAction = formatNarrativeCopy(storyboard?.userAction ?? scene.accentLabel);
	const systemResponse = formatNarrativeCopy(storyboard?.systemResponse ?? scene.body);
	const titleLift = translateYFromProgress(titleEntrance, 56, 0);
	const copyLift = translateYFromProgress(copyEntrance, 36, 0);
	const surfaceSlide = translateXFromProgress(supportEntrance, 54, 0);
	const backdropOpacity = interpolate(supportEntrance, [0, 1], [0, 0.78], clamp);

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
						gap: 42,
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
								<MetaBadge label="Help / Unified History / AI Overview" theme={theme} />
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
										lineHeight: 1.46,
										margin: 0,
										maxWidth: 840,
										color: theme.colors.textDim,
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
									delayFrames={10}
									stepFrames={4}
									durationFrames={14}
								>
									<StoryNote label={`Hook ${index + 1}`} body={line} theme={theme} />
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
								<StoryNote label="User Action" body={userAction} theme={theme} />
							</AnimatedReveal>
							<AnimatedReveal frame={frame} delayFrames={22} durationFrames={18}>
								<StoryNote label="System Response" body={systemResponse} theme={theme} />
							</AnimatedReveal>
						</div>

						<AnimatedReveal frame={frame} delayFrames={26} durationFrames={16}>
							<StoryNote
								label="Grounding"
								body="History evidence stays visible before AI synthesis takes over."
								theme={theme}
							/>
						</AnimatedReveal>
					</div>

					<div
						style={{
							position: 'relative',
							minHeight: 0,
							transform: `translateX(${surfaceSlide}px)`,
						}}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 16,
								height: '100%',
								position: 'relative',
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
										<div style={{ fontSize: 22, color: theme.colors.textMain }}>{currentBeat}</div>
									</div>
									<MetaBadge label={activeStage} tone="accent" theme={theme} />
								</div>
							</AnimatedReveal>

							<div
								style={{
									position: 'relative',
									flex: 1,
									minHeight: 0,
									borderRadius: 34,
									border: `1px solid ${theme.colors.border}`,
									background: `linear-gradient(180deg, ${theme.colors.bgSidebar}, ${theme.colors.bgMain})`,
									boxShadow: `0 28px 80px rgba(7, 4, 14, ${0.28 + stagePose.glowOpacity})`,
									overflow: 'hidden',
								}}
							>
								<div
									style={{
										position: 'absolute',
										inset: 0,
										background: `radial-gradient(circle at 16% 12%, ${theme.colors.accent}2a 0%, transparent 36%), radial-gradient(circle at 80% 82%, ${theme.colors.warning}16 0%, transparent 30%)`,
									}}
								/>
								<div
									style={{
										position: 'absolute',
										inset: 0,
										background: `linear-gradient(180deg, ${theme.colors.bgSidebar}00, ${theme.colors.bgMain})`,
										opacity: stagePose.vignetteOpacity,
									}}
								/>
								{scene.id === 'director-notes-standalone-open' ? (
									<FragmentedContextBackdrop opacity={backdropOpacity} theme={theme} />
								) : null}
								<AnimatedReveal frame={frame} delayFrames={14} durationFrames={18}>
									<div
										style={{
											position: 'absolute',
											inset: 18,
											transform: `translate3d(${stagePose.translateX}px, ${stagePose.translateY}px, 0) scale(${stagePose.scale}) rotate(${stagePose.rotate}deg)`,
											transformOrigin: 'center center',
										}}
									>
										<DirectorNotesSurfaceShowcase
											scene={scene}
											captures={captures}
											progress={copyEntrance}
											theme={theme}
											timelineProgress={sceneProgress}
										/>
									</div>
								</AnimatedReveal>
								<DirectorNotesFocusOverlay
									height={focusFrame.height}
									label={focusFrame.label}
									opacity={focusFrame.opacity * stagePose.focusOpacity}
									theme={theme}
									width={focusFrame.width}
									x={focusFrame.x}
									y={focusFrame.y}
								/>
								<GuidedCursor cursor={cursorPose} theme={theme} />
							</div>
						</div>
					</div>
				</div>

				<AnimatedReveal frame={frame} delayFrames={18} durationFrames={18}>
					<DirectorNotesFlowStrip activeStage={activeStage} frame={frame} theme={theme} />
				</AnimatedReveal>
			</div>
		</ProductionFrame>
	);
};
