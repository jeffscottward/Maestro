import type React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

import type { CaptureManifestEntry, SceneData, SceneSurfaceId } from '../data/production-schema';
import {
	AUTO_RUN_DOCUMENTS,
	MAESTRO_SURFACE_THEMES,
	TERMINAL_PLAN_LINES,
	VISUAL_FALLBACK_SLOTS,
	WORKTREE_TABS,
	type MaestroVisualTheme,
	type VisualFallbackSlot,
	createFallbackSlot,
} from '../lib/maestroVisualSystem';
import {
	MaestroAnnotationSurface,
	MaestroAutoRunDocumentList,
	MaestroFallbackSlot,
	MaestroModalShell,
	MaestroTerminalBlock,
	MaestroWorktreeControls,
} from '../ui/MaestroPrimitives';
import { MetaBadge } from '../ui/MetaBadge';
import { DirectorNotesSurfaceShowcase } from './DirectorNotesSurfaceShowcase';
import { SymphonySurfaceShowcase } from './SymphonySurfaceShowcase';

type FeatureSurfaceShowcaseProps = {
	scene: SceneData;
	captures: CaptureManifestEntry[];
};

type SurfaceProps = {
	captures: CaptureManifestEntry[];
	fallbackSlots: VisualFallbackSlot[];
	progress: number;
	theme: MaestroVisualTheme;
};

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

const WORKTREE_CHILDREN = [
	{ name: 'beta-opt-in', status: '10', active: false },
	{ name: 'christmas-refactor', status: '', active: false },
	{ name: 'context-management', status: '', active: false },
	{ name: 'keyboard-gamification', status: '', active: false },
	{ name: 'playbook-marketplace', status: '', active: false },
] as const;

const getFallbackSlots = (captures: CaptureManifestEntry[]) => {
	return captures
		.filter((capture) => capture.mode === 'fallback-slot')
		.map((capture) => {
			return (
				VISUAL_FALLBACK_SLOTS.find((slot) => slot.id === capture.id) ??
				createFallbackSlot({
					id: capture.id,
					label: capture.feature,
					sourcePath: capture.sourceRef,
					mediaType: 'screenshot',
					reason: capture.notes,
				})
			);
		});
};

const SurfacePanel: React.FC<{
	children: React.ReactNode;
	theme: MaestroVisualTheme;
	padding?: number;
}> = ({ children, theme, padding = 18 }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				padding,
				borderRadius: 22,
				border: `1px solid ${theme.colors.border}`,
				background: theme.colors.bgActivity,
			}}
		>
			{children}
		</div>
	);
};

const FieldCard: React.FC<{
	label: string;
	value: string;
	theme: MaestroVisualTheme;
	compact?: boolean;
}> = ({ label, value, theme, compact = false }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: compact ? 6 : 10,
				padding: compact ? '14px 16px' : '16px 18px',
				borderRadius: 18,
				border: `1px solid ${theme.colors.border}`,
				background: theme.colors.bgMain,
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
			<div style={{ fontSize: compact ? 20 : 26, color: theme.colors.textMain }}>{value}</div>
		</div>
	);
};

const ActionButton: React.FC<{
	label: string;
	theme: MaestroVisualTheme;
	tone?: 'accent' | 'neutral';
}> = ({ label, theme, tone = 'accent' }) => {
	const isAccent = tone === 'accent';

	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '14px 22px',
				borderRadius: 16,
				border: `1px solid ${isAccent ? `${theme.colors.accent}88` : theme.colors.border}`,
				background: isAccent ? theme.colors.accentDim : theme.colors.bgMain,
				color: isAccent ? theme.colors.accentText : theme.colors.textMain,
				fontSize: 19,
			}}
		>
			{label}
		</div>
	);
};

const WorktreeListPanel: React.FC<{
	theme: MaestroVisualTheme;
	progress: number;
}> = ({ theme, progress }) => {
	return (
		<SurfacePanel theme={theme} padding={0}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '16px 20px',
					borderBottom: `1px solid ${theme.colors.border}`,
				}}
			>
				<div style={{ fontSize: 20, color: theme.colors.textMain }}>MAESTRO</div>
				<MetaBadge label="LIVE" tone="accent" theme={theme} />
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '18px 20px',
						background: `${theme.colors.bgMain}`,
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
						<div style={{ fontSize: 18, color: theme.colors.textDim }}>MAESTRO</div>
						<div style={{ fontSize: 28, color: theme.colors.textMain }}>Maestro</div>
						<div style={{ fontSize: 18, color: theme.colors.textDim }}>claude-code</div>
					</div>
					<MetaBadge label="GIT" tone="accent" theme={theme} />
				</div>
				{WORKTREE_CHILDREN.map((child, index) => (
					<div
						key={child.name}
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '14px 20px 14px 28px',
							borderTop: `1px solid ${theme.colors.border}`,
							opacity: interpolate(progress, [0, 1], [0.35, 1], clamp) - index * 0.05,
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
							<div style={{ color: theme.colors.accentText }}>|_</div>
							<div style={{ fontSize: 20, color: theme.colors.textMain }}>{child.name}</div>
						</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
							{child.status ? (
								<span style={{ color: theme.colors.warning }}>{child.status}</span>
							) : null}
							<div
								style={{
									width: 12,
									height: 12,
									borderRadius: 999,
									background: theme.colors.success,
								}}
							/>
						</div>
					</div>
				))}
			</div>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '12px 18px',
					borderTop: `1px solid ${theme.colors.border}`,
					color: theme.colors.textDim,
					fontSize: 18,
				}}
			>
				9 worktrees
			</div>
		</SurfacePanel>
	);
};

const WorktreeDispatchSurface: React.FC<SurfaceProps> = ({ fallbackSlots, theme }) => {
	const footer = (
		<>
			<span>Dispatch to a separate worktree</span>
			<span>Automatically create PR when complete</span>
		</>
	);

	return (
		<MaestroModalShell
			title="Run in Worktree"
			badge="Enabled"
			tabs={WORKTREE_TABS}
			activeTab="Run in Worktree"
			footer={footer}
			theme={theme}
		>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 0.92fr', gap: 16 }}>
				<div style={{ display: 'grid', gap: 14 }}>
					<MaestroWorktreeControls
						baseBranch="main"
						branchName="autorun-spinout"
						createPROnCompletion
						pathPreview="/Users/pedram/Projects/Maestro-WorkTrees/autorun-spinout"
						theme={theme}
					/>
				</div>
				<div style={{ display: 'grid', gap: 14 }}>
					<MaestroAutoRunDocumentList
						title="Auto Run"
						documents={AUTO_RUN_DOCUMENTS}
						summaryPillLabel="20 tasks"
						theme={theme}
					/>
					<MaestroAnnotationSurface
						title="Clean Main Checkout"
						body="Longer Auto Run sessions stay isolated on a dedicated branch and directory, then hand off to pull-request creation once the run completes."
						theme={theme}
					/>
					{fallbackSlots[0] ? <MaestroFallbackSlot slot={fallbackSlots[0]} theme={theme} /> : null}
				</div>
			</div>
		</MaestroModalShell>
	);
};

const WorktreeTerminalSurface: React.FC<SurfaceProps> = ({ fallbackSlots, progress, theme }) => {
	return (
		<MaestroModalShell title="Worktree Configuration" badge="Follow-through" theme={theme}>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 0.94fr', gap: 16 }}>
				<div style={{ display: 'grid', gap: 14 }}>
					<SurfacePanel theme={theme}>
						<FieldCard
							label="Worktree Directory"
							value="/Users/pedram/Projects/Maestro-WorkTrees"
							theme={theme}
						/>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								padding: '16px 18px',
								borderRadius: 18,
								border: `1px solid ${theme.colors.border}`,
								background: theme.colors.bgMain,
							}}
						>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
								<div style={{ fontSize: 28, color: theme.colors.textMain }}>
									Watch for new worktrees
								</div>
								<div style={{ fontSize: 18, color: theme.colors.textDim }}>
									Auto-detect worktrees created outside Maestro
								</div>
							</div>
							<div
								style={{
									width: 80,
									height: 42,
									borderRadius: 999,
									background: theme.colors.success,
									position: 'relative',
								}}
							>
								<div
									style={{
										position: 'absolute',
										top: 4,
										right: 4,
										width: 34,
										height: 34,
										borderRadius: 999,
										background: '#ffffff',
									}}
								/>
							</div>
						</div>
						<div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
							<FieldCard label="Create New Worktree" value="feature-xyz" theme={theme} />
							<ActionButton label="+ Create" theme={theme} />
						</div>
					</SurfacePanel>
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<ActionButton label="Disable" tone="neutral" theme={theme} />
						<ActionButton label="Cancel" tone="neutral" theme={theme} />
						<ActionButton label="Save Configuration" theme={theme} />
					</div>
					{fallbackSlots[0] ? <MaestroFallbackSlot slot={fallbackSlots[0]} theme={theme} /> : null}
				</div>
				<div style={{ display: 'grid', gap: 14 }}>
					<MaestroTerminalBlock
						title="Dispatch to a separate worktree"
						lines={TERMINAL_PLAN_LINES}
						theme={theme}
					/>
					<WorktreeListPanel theme={theme} progress={progress} />
					{fallbackSlots[1] ? <MaestroFallbackSlot slot={fallbackSlots[1]} theme={theme} /> : null}
				</div>
			</div>
		</MaestroModalShell>
	);
};

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
	const fallbackSlots = getFallbackSlots(captures);

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
			return (
				<WorktreeTerminalSurface
					captures={captures}
					fallbackSlots={fallbackSlots}
					progress={progress}
					theme={theme}
				/>
			);
		case 'worktree-dispatch':
		default:
			return (
				<WorktreeDispatchSurface
					captures={captures}
					fallbackSlots={fallbackSlots}
					progress={progress}
					theme={theme}
				/>
			);
	}
};
