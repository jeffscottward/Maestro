import type React from 'react';
import { interpolate } from 'remotion';

import { WORKTREE_FLOW_STAGES } from '../animations/worktree-choreography';
import { translateYFromProgress } from '../animations/motion';
import { AnimatedReveal } from './SymphonyMotionPrimitives';
import type { MaestroVisualTheme } from '../lib/maestroVisualSystem';
import { MetaBadge } from '../ui/MetaBadge';

type ComparisonTone = 'accent' | 'success' | 'warning' | 'neutral';

type PressureItem = {
	label: string;
	note: string;
	tone: ComparisonTone;
};

type LaneCardData = {
	title: string;
	branch: string;
	status: string;
	note: string;
	tone: ComparisonTone;
};

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

export const StoryNote: React.FC<{
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

export const WorktreeFlowStrip: React.FC<{
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

export const WorktreeFocusOverlay: React.FC<{
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

export const WorktreeBranchBackdrop: React.FC<{
	progress: number;
	theme: MaestroVisualTheme;
	opacity: number;
}> = ({ progress, theme, opacity }) => {
	const splitOffset = interpolate(progress, [0, 1], [12, 94], clamp);
	const railOpacity = interpolate(progress, [0, 1], [0.16, 0.42], clamp) * opacity;

	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				pointerEvents: 'none',
				opacity: railOpacity,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: '12%',
					top: '48%',
					width: '28%',
					height: 2,
					borderRadius: 999,
					background: `linear-gradient(90deg, transparent, ${theme.colors.accent}88, ${theme.colors.accentText})`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: '38%',
					top: '48%',
					width: '24%',
					height: 2,
					borderRadius: 999,
					background: `linear-gradient(90deg, ${theme.colors.accentText}, ${theme.colors.accent}66)`,
					transform: `translate3d(0, ${-splitOffset}px, 0) rotate(-14deg)`,
					transformOrigin: 'left center',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: '38%',
					top: '48%',
					width: '24%',
					height: 2,
					borderRadius: 999,
					background: `linear-gradient(90deg, ${theme.colors.accentText}, ${theme.colors.success}66)`,
					transform: `translate3d(0, ${splitOffset}px, 0) rotate(14deg)`,
					transformOrigin: 'left center',
				}}
			/>
		</div>
	);
};

const getComparisonToneStyles = (theme: MaestroVisualTheme, tone: ComparisonTone) => {
	switch (tone) {
		case 'accent':
			return {
				border: `${theme.colors.accent}55`,
				background: theme.colors.accentDim,
				text: theme.colors.accentText,
			};
		case 'success':
			return {
				border: `${theme.colors.success}55`,
				background: `${theme.colors.success}16`,
				text: theme.colors.success,
			};
		case 'warning':
			return {
				border: `${theme.colors.warning}55`,
				background: `${theme.colors.warning}16`,
				text: theme.colors.warning,
			};
		case 'neutral':
		default:
			return {
				border: theme.colors.border,
				background: theme.colors.bgMain,
				text: theme.colors.textMain,
			};
	}
};

const PressureRow: React.FC<{
	item: PressureItem;
	theme: MaestroVisualTheme;
}> = ({ item, theme }) => {
	const tone = getComparisonToneStyles(theme, item.tone);

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'auto 1fr',
				gap: 12,
				alignItems: 'start',
				padding: '12px 14px',
				borderRadius: 18,
				border: `1px solid ${tone.border}`,
				background: tone.background,
			}}
		>
			<div
				style={{
					width: 10,
					height: 10,
					borderRadius: 999,
					background: tone.text,
					marginTop: 7,
				}}
			/>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
				<div style={{ fontSize: 18, color: theme.colors.textMain }}>{item.label}</div>
				<div style={{ fontSize: 15, lineHeight: 1.42, color: theme.colors.textDim }}>
					{item.note}
				</div>
			</div>
		</div>
	);
};

const LaneCard: React.FC<{
	lane: LaneCardData;
	theme: MaestroVisualTheme;
}> = ({ lane, theme }) => {
	const tone = getComparisonToneStyles(theme, lane.tone);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
				padding: '16px 18px',
				borderRadius: 20,
				border: `1px solid ${tone.border}`,
				background: tone.background,
				minHeight: 0,
			}}
		>
			<div
				style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
			>
				<div style={{ fontSize: 18, color: theme.colors.textMain }}>{lane.title}</div>
				<MetaBadge
					label={lane.status}
					tone={lane.tone === 'neutral' ? 'neutral' : 'accent'}
					theme={theme}
				/>
			</div>
			<div style={{ fontSize: 16, color: tone.text, fontFamily: 'monospace' }}>{lane.branch}</div>
			<div style={{ fontSize: 15, lineHeight: 1.42, color: theme.colors.textDim }}>{lane.note}</div>
		</div>
	);
};

const getComparisonState = (sceneId: string) => {
	switch (sceneId) {
		case 'worktree-standalone-toggle':
			return {
				pressureLevel: 0.88,
				pressureItems: [
					{
						label: 'Parent checkout carries the queue',
						note: 'Manual edits, review, and automation still share one branch until dispatch is enabled.',
						tone: 'warning' as const,
					},
					{
						label: 'Isolation is still optional',
						note: 'Without a clear toggle, it is easy to keep the risky default.',
						tone: 'neutral' as const,
					},
				],
				afterLanes: [
					{
						title: 'Parent agent',
						branch: 'feature/terminal-refresh',
						status: 'Docs stay here',
						note: 'The Auto Run queue and manual context remain attached to the parent agent.',
						tone: 'neutral' as const,
					},
					{
						title: 'Worktree lane',
						branch: 'Dispatch to a separate worktree',
						status: 'Enabled',
						note: 'The safer path becomes explicit inside the same launch flow.',
						tone: 'accent' as const,
					},
				],
			};
		case 'worktree-standalone-create-form':
			return {
				pressureLevel: 0.9,
				pressureItems: [
					{
						label: 'One checkout would absorb the run',
						note: 'The parent branch still risks carrying long Auto Run edits and later cleanup.',
						tone: 'warning' as const,
					},
					{
						label: 'Review path would be reconstructed later',
						note: 'Without branch defaults and a path preview, isolation still feels abstract.',
						tone: 'neutral' as const,
					},
				],
				afterLanes: [
					{
						title: 'Parent agent',
						branch: 'main docs + manual edits',
						status: 'Stable',
						note: 'The markdown queue remains visible without moving the current workspace.',
						tone: 'neutral' as const,
					},
					{
						title: 'Worktree lane',
						branch: 'main -> autorun-spinout',
						status: 'Named',
						note: 'Base branch, worktree branch name, and path preview now explain the split.',
						tone: 'accent' as const,
					},
				],
			};
		case 'worktree-standalone-pr-intent':
			return {
				pressureLevel: 0.92,
				pressureItems: [
					{
						label: 'Branch cleanup would still land on the parent lane',
						note: 'The isolated branch exists, but review handoff is not credible until PR intent is visible.',
						tone: 'warning' as const,
					},
					{
						label: 'Handoff needs to stay attached',
						note: 'The reviewer should inherit the branch context instead of rediscovering it later.',
						tone: 'neutral' as const,
					},
				],
				afterLanes: [
					{
						title: 'Parent agent',
						branch: 'Current checkout stays clean',
						status: 'Clear',
						note: 'Manual edits and docs remain on the original branch.',
						tone: 'success' as const,
					},
					{
						title: 'Worktree branch',
						branch: 'autorun-spinout',
						status: 'Isolated',
						note: 'Execution now has its own branch and path before the run starts.',
						tone: 'accent' as const,
					},
					{
						title: 'Review lane',
						branch: 'Create Pull Request',
						status: 'Ready',
						note: 'The PR path is attached before launch instead of reconstructed later.',
						tone: 'success' as const,
					},
				],
			};
		case 'worktree-standalone-inventory':
			return {
				pressureLevel: 0.9,
				pressureItems: [
					{
						label: 'Hidden folders do not build trust',
						note: 'A separate lane still feels theoretical until the destination is visible inside Maestro.',
						tone: 'warning' as const,
					},
					{
						label: 'The parent agent still needs continuity',
						note: 'Docs remain on the original agent while the worktree becomes a tracked destination.',
						tone: 'neutral' as const,
					},
				],
				afterLanes: [
					{
						title: 'Parent agent',
						branch: 'Auto Run docs stay attached',
						status: 'Stable',
						note: 'The parent workspace keeps the markdown queue and surrounding context.',
						tone: 'neutral' as const,
					},
					{
						title: 'Open in Maestro',
						branch: 'christmas-refactor / keyboard-gamification',
						status: 'Tracked',
						note: 'Opened worktrees prove the isolated lane is a first-class destination.',
						tone: 'accent' as const,
					},
					{
						title: 'Available Worktrees',
						branch: 'playbook-marketplace / ssh-tunneling',
						status: 'Scanned',
						note: 'Detected directories reinforce that Maestro can follow the whole inventory.',
						tone: 'success' as const,
					},
				],
			};
		case 'worktree-standalone-terminal-proof':
			return {
				pressureLevel: 0.94,
				pressureItems: [
					{
						label: 'One checkout would still bottleneck the run',
						note: 'Execution, review, and manual follow-up would all converge on the same branch.',
						tone: 'warning' as const,
					},
					{
						label: 'Long-running automation needs a separate lane',
						note: 'The parent checkout should remain ready for unrelated work while the run completes.',
						tone: 'neutral' as const,
					},
				],
				afterLanes: [
					{
						title: 'Parent checkout',
						branch: 'feature/terminal-refresh',
						status: 'Clean',
						note: 'Manual work can continue without the Auto Run branch polluting the current tree.',
						tone: 'success' as const,
					},
					{
						title: 'Worktree branch',
						branch: 'autorun-spinout',
						status: 'Executing',
						note: 'The isolated branch and directory absorb the run and its generated changes.',
						tone: 'accent' as const,
					},
					{
						title: 'Review handoff',
						branch: 'Create Pull Request',
						status: 'Ready',
						note: 'The PR path remains attached to the worktree lane at the close.',
						tone: 'success' as const,
					},
				],
			};
		case 'worktree-standalone-risk':
		default:
			return {
				pressureLevel: 0.86,
				pressureItems: [
					{
						label: 'Manual edits are already active',
						note: 'The developer is still using the current branch for ongoing work and review.',
						tone: 'warning' as const,
					},
					{
						label: 'Auto Run queue wants the same checkout',
						note: 'Launching the run directly would send a long-lived automation lane into the parent tree.',
						tone: 'warning' as const,
					},
					{
						label: 'Review path becomes crowded',
						note: 'The same branch has to carry execution, cleanup, and handoff all at once.',
						tone: 'neutral' as const,
					},
				],
				afterLanes: [
					{
						title: 'Parent agent',
						branch: 'Docs + current edits',
						status: 'Queued',
						note: 'The Auto Run document set remains on the parent workspace.',
						tone: 'neutral' as const,
					},
					{
						title: 'Worktree lane',
						branch: 'Run in Worktree',
						status: 'Optional',
						note: 'A separate branch path is available before the parent checkout becomes the bottleneck.',
						tone: 'accent' as const,
					},
				],
			};
	}
};

export const WorktreeComparisonBoard: React.FC<{
	sceneId: string;
	comparisonCopy: {
		before: string;
		after: string;
	};
	theme: MaestroVisualTheme;
	frame: number;
	progress: number;
}> = ({ sceneId, comparisonCopy, theme, frame, progress }) => {
	const state = getComparisonState(sceneId);
	const pressureFill = interpolate(
		progress,
		[0, 1],
		[state.pressureLevel * 0.74, state.pressureLevel],
		clamp
	);
	const connectorOpacity = interpolate(progress, [0, 1], [0.22, 0.46], clamp);

	return (
		<div style={{ display: 'grid', gridTemplateColumns: '0.94fr 1.06fr', gap: 16 }}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 16,
					padding: '18px 20px',
					borderRadius: 24,
					border: `1px solid ${theme.colors.border}`,
					background: theme.colors.bgActivity,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 12,
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
						<div
							style={{
								fontSize: 15,
								letterSpacing: 1.1,
								textTransform: 'uppercase',
								color: theme.colors.textDim,
							}}
						>
							Single checkout pressure
						</div>
						<div style={{ fontSize: 22, color: theme.colors.textMain }}>Before</div>
					</div>
					<MetaBadge label="1 lane" tone="neutral" theme={theme} />
				</div>
				<div style={{ fontSize: 18, lineHeight: 1.48, color: theme.colors.textDim }}>
					{comparisonCopy.before}
				</div>
				<div
					style={{
						height: 8,
						borderRadius: 999,
						background: theme.colors.bgMain,
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							height: '100%',
							width: `${pressureFill * 100}%`,
							borderRadius: 999,
							background: `linear-gradient(90deg, ${theme.colors.warning}, ${theme.colors.accent})`,
						}}
					/>
				</div>
				<div style={{ display: 'grid', gap: 12 }}>
					{state.pressureItems.map((item, index) => (
						<AnimatedReveal
							key={item.label}
							frame={frame}
							index={index}
							delayFrames={16}
							stepFrames={4}
							durationFrames={16}
						>
							<PressureRow item={item} theme={theme} />
						</AnimatedReveal>
					))}
				</div>
			</div>

			<div
				style={{
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					gap: 16,
					padding: '18px 20px',
					borderRadius: 24,
					border: `1px solid ${theme.colors.accent}44`,
					background: `linear-gradient(180deg, ${theme.colors.accent}10, ${theme.colors.bgActivity})`,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 12,
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
						<div
							style={{
								fontSize: 15,
								letterSpacing: 1.1,
								textTransform: 'uppercase',
								color: theme.colors.textDim,
							}}
						>
							Parallel isolated lanes
						</div>
						<div style={{ fontSize: 22, color: theme.colors.textMain }}>After</div>
					</div>
					<MetaBadge label={`${state.afterLanes.length} lanes`} tone="accent" theme={theme} />
				</div>
				<div style={{ fontSize: 18, lineHeight: 1.48, color: theme.colors.textDim }}>
					{comparisonCopy.after}
				</div>
				<div
					style={{
						position: 'absolute',
						left: '18%',
						right: '18%',
						top: 108,
						height: 2,
						borderRadius: 999,
						background: `linear-gradient(90deg, ${theme.colors.accent}44, ${theme.colors.success}44)`,
						opacity: connectorOpacity,
					}}
				/>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: `repeat(${state.afterLanes.length}, minmax(0, 1fr))`,
						gap: 12,
					}}
				>
					{state.afterLanes.map((lane, index) => (
						<AnimatedReveal
							key={`${lane.title}-${lane.branch}`}
							frame={frame}
							index={index}
							delayFrames={18}
							stepFrames={4}
							durationFrames={18}
							axis="x"
							distance={24}
						>
							<LaneCard lane={lane} theme={theme} />
						</AnimatedReveal>
					))}
				</div>
			</div>
		</div>
	);
};

export const getWorktreeComparisonCopy = (sceneId: string) => {
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
