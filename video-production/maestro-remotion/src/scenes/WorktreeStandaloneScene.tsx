import type React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import {
	getEntranceProgress,
	getSceneOpacity,
	translateXFromProgress,
	translateYFromProgress,
} from '../animations/motion';
import { AnimatedReveal } from '../components/SymphonyMotionPrimitives';
import { WorktreeSurfaceShowcase } from '../components/WorktreeSurfaceShowcase';
import { ProductionFrame } from '../components/ProductionFrame';
import type { CaptureManifestEntry, SceneData, VideoSpec } from '../data/production-schema';
import { getSurfaceTheme } from '../components/FeatureSurfaceShowcase';
import type { MaestroVisualTheme } from '../lib/maestroVisualSystem';
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

const WORKTREE_FLOW_STAGES = ['Risk', 'Toggle', 'Branch', 'Inventory', 'Proof'] as const;

const formatNarrativeCopy = (value: string) => value.replaceAll('`', '');

const getStageForScene = (sceneId: string) => {
	switch (sceneId) {
		case 'worktree-standalone-risk':
			return 'Risk';
		case 'worktree-standalone-toggle':
			return 'Toggle';
		case 'worktree-standalone-create-form':
		case 'worktree-standalone-pr-intent':
			return 'Branch';
		case 'worktree-standalone-inventory':
			return 'Inventory';
		case 'worktree-standalone-terminal-proof':
		default:
			return 'Proof';
	}
};

const getComparisonCopy = (sceneId: string) => {
	switch (sceneId) {
		case 'worktree-standalone-risk':
			return {
				before: 'One checkout carries manual edits, review work, and the pending Auto Run lane.',
				after:
					'Run in Worktree keeps the Auto Run queue on the parent agent while opening a separate execution path.',
			};
		case 'worktree-standalone-toggle':
			return {
				before: 'Isolation is easy to skip when the toggle is hidden or implied.',
				after:
					'Dispatch to a separate worktree turns the safer lane into an explicit decision inside Auto Run.',
			};
		case 'worktree-standalone-create-form':
			return {
				before: 'The developer still has to guess how the separate branch and path will land.',
				after:
					'Base branch, worktree branch name, and path preview explain the exact isolation step before launch.',
			};
		case 'worktree-standalone-pr-intent':
			return {
				before: 'Review handoff is still something the user has to reconstruct after the run.',
				after:
					'Automatically create PR when complete keeps the branch, execution lane, and review path attached.',
			};
		case 'worktree-standalone-inventory':
			return {
				before: 'A separate lane feels abstract until the destination is visible inside Maestro.',
				after:
					'Open in Maestro and Available Worktrees prove the isolated branch is a tracked destination, not a hidden folder.',
			};
		case 'worktree-standalone-terminal-proof':
		default:
			return {
				before:
					'The main checkout absorbs long-running automation and becomes a review bottleneck.',
				after:
					'The worktree branch carries execution and PR handoff while the parent checkout stays clean for parallel work.',
			};
	}
};

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

const WorktreeFlowStrip: React.FC<{
	activeStage: (typeof WORKTREE_FLOW_STAGES)[number];
	frame: number;
	theme: MaestroVisualTheme;
}> = ({ activeStage, frame, theme }) => {
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: `repeat(${WORKTREE_FLOW_STAGES.length}, minmax(0, 1fr))`,
				gap: 10,
			}}
		>
			{WORKTREE_FLOW_STAGES.map((stage, index) => {
				const reveal = interpolate(frame, [index * 3, index * 3 + 16], [0, 1], clamp);
				const isActive = stage === activeStage;

				return (
					<div
						key={stage}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 6,
							padding: '10px 12px',
							borderRadius: 16,
							border: `1px solid ${isActive ? `${theme.colors.accent}88` : theme.colors.border}`,
							background: isActive ? theme.colors.accentDim : theme.colors.bgActivity,
							opacity: interpolate(reveal, [0, 1], [0.32, 1], clamp),
							transform: `translate3d(0, ${translateYFromProgress(reveal, 18, 0)}px, 0)`,
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
								fontSize: 18,
								color: isActive ? theme.colors.accentText : theme.colors.textMain,
							}}
						>
							{stage}
						</div>
						<div
							style={{
								height: 4,
								borderRadius: 999,
								background: isActive ? `${theme.colors.accent}66` : theme.colors.border,
							}}
						/>
					</div>
				);
			})}
		</div>
	);
};

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
	const activeStage = getStageForScene(scene.id);
	const comparisonCopy = getComparisonCopy(scene.id);
	const title = formatNarrativeCopy(scene.title);
	const body = formatNarrativeCopy(scene.body);
	const currentBeat = formatNarrativeCopy(storyboard?.uiStateShown ?? scene.accentLabel);
	const onScreenCopy = (storyboard?.onScreenCopy ?? []).map((line) => formatNarrativeCopy(line));
	const userAction = formatNarrativeCopy(storyboard?.userAction ?? scene.accentLabel);
	const systemResponse = formatNarrativeCopy(storyboard?.systemResponse ?? scene.body);
	const titleLift = translateYFromProgress(titleEntrance, 56, 0);
	const copyLift = translateYFromProgress(copyEntrance, 36, 0);
	const stageSlide = translateXFromProgress(supportEntrance, 48, 0);

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
							display: 'flex',
							flexDirection: 'column',
							gap: 16,
							minHeight: 0,
							transform: `translateX(${stageSlide}px)`,
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

						<div style={{ minHeight: 0, flex: 1 }}>
							<WorktreeSurfaceShowcase
								scene={scene}
								captures={captures}
								progress={copyEntrance}
								theme={theme}
							/>
						</div>
					</div>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
					<AnimatedReveal frame={frame} delayFrames={18} durationFrames={18}>
						<StoryNote label="Before" body={comparisonCopy.before} theme={theme} />
					</AnimatedReveal>
					<AnimatedReveal frame={frame} delayFrames={22} durationFrames={18}>
						<StoryNote label="After" body={comparisonCopy.after} theme={theme} />
					</AnimatedReveal>
				</div>
			</div>
		</ProductionFrame>
	);
};
