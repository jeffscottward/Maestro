import type React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

import {
	maestroVisualTheme,
	type MaestroVisualTheme,
	type VisualFallbackSlot,
} from '../lib/maestroVisualSystem';

type PrimitiveProps = {
	theme?: MaestroVisualTheme;
};

type PillTone = 'accent' | 'neutral' | 'success' | 'warning';

type PillProps = PrimitiveProps & {
	label: string;
	tone?: PillTone;
};

const getToneStyles = (
	theme: MaestroVisualTheme
): Record<PillTone, { background: string; color: string; border: string }> => ({
	accent: {
		background: theme.colors.accentDim,
		color: theme.colors.accentText,
		border: `${theme.colors.accent}44`,
	},
	neutral: {
		background: 'rgba(255, 255, 255, 0.04)',
		color: theme.colors.textMain,
		border: `${theme.colors.border}aa`,
	},
	success: {
		background: `${theme.colors.success}22`,
		color: theme.colors.success,
		border: `${theme.colors.success}44`,
	},
	warning: {
		background: `${theme.colors.warning}22`,
		color: theme.colors.warning,
		border: `${theme.colors.warning}44`,
	},
});

const Pill: React.FC<PillProps> = ({ label, tone = 'neutral', theme = maestroVisualTheme }) => {
	const palette = getToneStyles(theme)[tone];

	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				padding: '8px 14px',
				borderRadius: 999,
				fontSize: 15,
				letterSpacing: 0.8,
				border: `1px solid ${palette.border}`,
				background: palette.background,
				color: palette.color,
			}}
		>
			{label}
		</div>
	);
};

type MaestroModalShellProps = PrimitiveProps & {
	title: string;
	badge?: string;
	children: React.ReactNode;
	tabs?: readonly string[];
	activeTab?: string;
	footer?: React.ReactNode;
};

export const MaestroTabStrip: React.FC<
	PrimitiveProps & {
		tabs: readonly string[];
		activeTab: string;
	}
> = ({ tabs, activeTab, theme = maestroVisualTheme }) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				padding: '0 24px 18px',
				borderBottom: `1px solid ${theme.colors.border}`,
			}}
		>
			{tabs.map((tab) => {
				const isActive = tab === activeTab;

				return (
					<div
						key={tab}
						style={{
							padding: '10px 16px',
							borderRadius: 14,
							fontSize: 18,
							background: isActive ? theme.colors.accentDim : 'transparent',
							color: isActive ? theme.colors.accentText : theme.colors.textDim,
							border: `1px solid ${isActive ? `${theme.colors.accent}55` : 'transparent'}`,
						}}
					>
						{tab}
					</div>
				);
			})}
		</div>
	);
};

export const MaestroModalShell: React.FC<MaestroModalShellProps> = ({
	title,
	badge,
	children,
	tabs,
	activeTab,
	footer,
	theme = maestroVisualTheme,
}) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				borderRadius: 28,
				border: `1px solid ${theme.colors.border}`,
				background: `linear-gradient(180deg, ${theme.colors.bgSidebar}, ${theme.colors.bgMain})`,
				boxShadow: `0 28px 80px ${theme.colors.accentDim}`,
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '20px 24px',
					borderBottom: `1px solid ${theme.colors.border}`,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
					<div
						style={{
							fontSize: 24,
							color: theme.colors.accentText,
						}}
					>
						⌘
					</div>
					<div
						style={{
							fontSize: 38,
							color: theme.colors.textMain,
						}}
					>
						{title}
					</div>
				</div>
				{badge ? <Pill label={badge} tone="success" theme={theme} /> : null}
			</div>
			{tabs && activeTab ? (
				<MaestroTabStrip tabs={tabs} activeTab={activeTab} theme={theme} />
			) : null}
			<div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 24 }}>
				{children}
			</div>
			{footer ? (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '16px 24px',
						borderTop: `1px solid ${theme.colors.border}`,
						color: theme.colors.textDim,
						fontSize: 17,
					}}
				>
					{footer}
				</div>
			) : null}
		</div>
	);
};

export const MaestroStatCard: React.FC<
	PrimitiveProps & {
		label: string;
		value: string;
		note?: string;
		tone?: PillTone;
	}
> = ({ label, value, note, tone = 'accent', theme = maestroVisualTheme }) => {
	const noteColor =
		tone === 'success'
			? theme.colors.success
			: tone === 'warning'
				? theme.colors.warning
				: tone === 'accent'
					? theme.colors.accentText
					: theme.colors.textDim;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
				padding: '18px 20px',
				borderRadius: 18,
				border: `1px solid ${theme.colors.border}`,
				background: theme.colors.bgActivity,
			}}
		>
			<div
				style={{
					fontSize: 16,
					letterSpacing: 1.2,
					textTransform: 'uppercase',
					color: theme.colors.textDim,
				}}
			>
				{label}
			</div>
			<div style={{ fontSize: 34, color: theme.colors.textMain }}>{value}</div>
			{note ? <div style={{ fontSize: 16, color: noteColor }}>{note}</div> : null}
		</div>
	);
};

export const MaestroActivityRow: React.FC<
	PrimitiveProps & {
		title: string;
		tag: string;
		summary: string;
		meta: string;
		highlighted?: boolean;
	}
> = ({ title, tag, summary, meta, highlighted = false, theme = maestroVisualTheme }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
				padding: '16px 18px',
				borderRadius: 18,
				border: `1px solid ${highlighted ? `${theme.colors.accent}88` : theme.colors.border}`,
				background: highlighted ? `${theme.colors.accentDim}` : theme.colors.bgActivity,
			}}
		>
			<div
				style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<div style={{ fontSize: 21, color: theme.colors.textMain }}>{title}</div>
					<Pill label={tag} tone="accent" theme={theme} />
				</div>
				<div style={{ fontSize: 16, color: theme.colors.textDim }}>{meta}</div>
			</div>
			<div style={{ fontSize: 18, lineHeight: 1.4, color: theme.colors.textDim }}>{summary}</div>
		</div>
	);
};

export const MaestroAutoRunDocumentList: React.FC<
	PrimitiveProps & {
		title?: string;
		documents: readonly { name: string; tasks: string; active: boolean }[];
		summaryPillLabel?: string;
	}
> = ({ title = 'Auto Run', documents, summaryPillLabel = '20 tasks', theme = maestroVisualTheme }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				padding: 20,
				borderRadius: 22,
				border: `1px solid ${theme.colors.border}`,
				background: theme.colors.bgActivity,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 16,
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
					<div
						style={{
							fontSize: 18,
							letterSpacing: 1.2,
							textTransform: 'uppercase',
							color: theme.colors.textDim,
						}}
					>
						{title}
					</div>
					<div style={{ fontSize: 15, color: theme.colors.textDim }}>Documents to Run</div>
				</div>
				<Pill label={summaryPillLabel} tone="warning" theme={theme} />
			</div>
			{documents.map((document) => (
				<div
					key={document.name}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 16,
						padding: '14px 16px',
						borderRadius: 16,
						border: `1px solid ${document.active ? `${theme.colors.accent}88` : theme.colors.border}`,
						background: document.active ? theme.colors.accentDim : theme.colors.bgMain,
					}}
				>
					<div style={{ fontSize: 19, color: theme.colors.textMain }}>{document.name}</div>
					<Pill
						label={document.tasks}
						tone={document.active ? 'accent' : 'neutral'}
						theme={theme}
					/>
				</div>
			))}
		</div>
	);
};

export const MaestroWorktreeControls: React.FC<
	PrimitiveProps & {
		baseBranch: string;
		branchName: string;
		createPROnCompletion: boolean;
		pathPreview?: string;
	}
> = ({
	baseBranch,
	branchName,
	createPROnCompletion,
	pathPreview = '/Users/jeff/Projects/Maestro-WorkTrees/autorun-spinout',
	theme = maestroVisualTheme,
}) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 18,
				padding: 20,
				borderRadius: 22,
				border: `1px solid ${theme.colors.border}`,
				background: theme.colors.bgActivity,
			}}
		>
			<div
				style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
			>
				<div style={{ fontSize: 24, color: theme.colors.accentText }}>
					Dispatch to a separate worktree
				</div>
				<Pill label="Enabled" tone="accent" theme={theme} />
			</div>
			<div
				style={{
					padding: '18px 20px',
					borderRadius: 18,
					border: `1px solid ${theme.colors.border}`,
					background: theme.colors.bgMain,
					fontSize: 22,
					color: theme.colors.textMain,
				}}
			>
				Create New Worktree
			</div>
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
				<div
					style={{
						padding: '16px 18px',
						borderRadius: 18,
						border: `1px solid ${theme.colors.border}`,
						background: theme.colors.bgMain,
					}}
				>
					<div style={{ fontSize: 16, color: theme.colors.textDim, textTransform: 'uppercase' }}>
						Base Branch
					</div>
					<div style={{ fontSize: 28, color: theme.colors.textMain, marginTop: 6 }}>
						{baseBranch}
					</div>
				</div>
				<div
					style={{
						padding: '16px 18px',
						borderRadius: 18,
						border: `1px solid ${theme.colors.border}`,
						background: theme.colors.bgMain,
					}}
				>
					<div style={{ fontSize: 16, color: theme.colors.textDim, textTransform: 'uppercase' }}>
						Worktree Branch Name
					</div>
					<div style={{ fontSize: 28, color: theme.colors.textMain, marginTop: 6 }}>
						{branchName}
					</div>
				</div>
			</div>
			<div style={{ fontSize: 17, color: theme.colors.textDim }}>{pathPreview}</div>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 14,
					color: theme.colors.textDim,
					fontSize: 18,
				}}
			>
				<div
					style={{
						width: 30,
						height: 30,
						borderRadius: 10,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: createPROnCompletion ? theme.colors.accentDim : theme.colors.bgMain,
						border: `1px solid ${createPROnCompletion ? `${theme.colors.accent}88` : theme.colors.border}`,
						color: createPROnCompletion ? theme.colors.accentText : theme.colors.textDim,
					}}
				>
					✓
				</div>
				<span>Automatically create PR when complete</span>
			</div>
		</div>
	);
};

export const MaestroTerminalCursor: React.FC<PrimitiveProps> = ({ theme = maestroVisualTheme }) => {
	const frame = useCurrentFrame();
	const blink = interpolate(frame % 24, [0, 10, 11, 23], [1, 1, 0.18, 0.18], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<span
			style={{
				display: 'inline-block',
				width: 12,
				height: 24,
				background: theme.colors.accent,
				borderRadius: 2,
				marginLeft: 4,
				opacity: blink,
				verticalAlign: 'middle',
			}}
		/>
	);
};

export const MaestroTerminalBlock: React.FC<
	PrimitiveProps & {
		title: string;
		lines: readonly string[];
	}
> = ({ title, lines, theme = maestroVisualTheme }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 14,
				padding: '20px 22px',
				borderRadius: 22,
				border: `1px solid ${theme.colors.border}`,
				background: theme.colors.bgMain,
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<div
					style={{
						fontSize: 18,
						textTransform: 'uppercase',
						letterSpacing: 1.2,
						color: theme.colors.textDim,
					}}
				>
					Terminal Block
				</div>
				<Pill label={title} tone="accent" theme={theme} />
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
				{lines.map((line, index) => (
					<div
						key={`${title}-${index}-${line}`}
						style={{
							fontSize: 18,
							lineHeight: 1.45,
							color:
								index === 0 || line === 'Overview'
									? theme.colors.accentText
									: line.length === 0
										? theme.colors.textDim
										: theme.colors.textMain,
						}}
					>
						{line}
						{index === lines.length - 1 ? <MaestroTerminalCursor theme={theme} /> : null}
					</div>
				))}
			</div>
		</div>
	);
};

export const MaestroAnnotationSurface: React.FC<
	PrimitiveProps & {
		title: string;
		body: string;
	}
> = ({ title, body, theme = maestroVisualTheme }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
				padding: '18px 20px',
				borderRadius: 20,
				border: `1px solid ${theme.colors.accent}66`,
				background: `${theme.colors.accentDim}`,
			}}
		>
			<div
				style={{
					fontSize: 18,
					letterSpacing: 1.2,
					textTransform: 'uppercase',
					color: theme.colors.accentText,
				}}
			>
				{title}
			</div>
			<div style={{ fontSize: 19, lineHeight: 1.45, color: theme.colors.textMain }}>{body}</div>
		</div>
	);
};

export const MaestroFallbackSlot: React.FC<
	PrimitiveProps & {
		slot: VisualFallbackSlot;
	}
> = ({ slot, theme = maestroVisualTheme }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
				padding: '18px 20px',
				borderRadius: 20,
				border: `1px dashed ${theme.colors.accent}88`,
				background: `${theme.colors.bgMain}`,
			}}
		>
			<div
				style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
			>
				<div style={{ fontSize: 22, color: theme.colors.textMain }}>{slot.label}</div>
				<Pill label={`${slot.mediaType} fallback`} tone="warning" theme={theme} />
			</div>
			<div style={{ fontSize: 17, lineHeight: 1.4, color: theme.colors.textDim }}>
				{slot.reason}
			</div>
			<div style={{ fontSize: 17, color: theme.colors.accentText }}>{slot.sourcePath}</div>
		</div>
	);
};
