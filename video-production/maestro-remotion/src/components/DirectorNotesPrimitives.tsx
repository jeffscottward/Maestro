import type React from 'react';

import { MaestroModalShell } from '../ui/MaestroPrimitives';
import { MetaBadge } from '../ui/MetaBadge';
import type { MaestroVisualTheme } from '../lib/maestroVisualSystem';

export type DirectorNotesTabId = 'overview' | 'history' | 'ai-overview';

export type DirectorNotesTabState = {
	id: DirectorNotesTabId;
	label: string;
	active?: boolean;
	disabled?: boolean;
	generating?: boolean;
};

export type DirectorNotesHistoryRowData = {
	agent: string;
	session: string;
	type: 'AUTO' | 'USER';
	summary: string;
	duration: string;
	cost?: string;
	timestamp: string;
	status?: 'done' | 'validated' | 'attention';
};

export type DirectorNotesStatItem = {
	label: string;
	value: string;
	tone?: 'accent' | 'warning' | 'neutral';
};

export type DirectorNotesOverviewSection = {
	title: string;
	subtitle?: string;
	lines: readonly string[];
};

const toneStyles = (
	theme: MaestroVisualTheme
): Record<'accent' | 'warning' | 'neutral', React.CSSProperties> => ({
	accent: {
		background: theme.colors.accentDim,
		color: theme.colors.accentText,
		borderColor: `${theme.colors.accent}66`,
	},
	warning: {
		background: `${theme.colors.warning}1e`,
		color: theme.colors.warning,
		borderColor: `${theme.colors.warning}66`,
	},
	neutral: {
		background: theme.colors.bgActivity,
		color: theme.colors.textMain,
		borderColor: theme.colors.border,
	},
});

const tabTypeTone = (
	type: DirectorNotesHistoryRowData['type'],
	theme: MaestroVisualTheme
): React.CSSProperties => {
	return type === 'AUTO' ? toneStyles(theme).warning : toneStyles(theme).accent;
};

const statusTone = (
	status: DirectorNotesHistoryRowData['status'],
	theme: MaestroVisualTheme
): React.CSSProperties => {
	if (status === 'validated') {
		return {
			background: `${theme.colors.success}18`,
			borderColor: `${theme.colors.success}4a`,
			color: theme.colors.success,
		};
	}

	if (status === 'attention') {
		return toneStyles(theme).warning;
	}

	return {
		background: `${theme.colors.success}10`,
		borderColor: `${theme.colors.success}2e`,
		color: theme.colors.success,
	};
};

export const DIRECTOR_NOTES_TAB_ORDER = [
	{ id: 'overview', label: 'Help' },
	{ id: 'history', label: 'Unified History' },
	{ id: 'ai-overview', label: 'AI Overview' },
] as const satisfies readonly Pick<DirectorNotesTabState, 'id' | 'label'>[];

export const DirectorPanel: React.FC<{
	children: React.ReactNode;
	theme: MaestroVisualTheme;
	padding?: number | string;
	gap?: number;
}> = ({ children, theme, padding = 18, gap = 12 }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap,
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

export const DirectorNotesSurfaceShell: React.FC<{
	children: React.ReactNode;
	theme: MaestroVisualTheme;
	badge?: string;
	tabs: readonly DirectorNotesTabState[];
	footer?: React.ReactNode;
}> = ({ children, theme, badge, tabs, footer }) => {
	return (
		<MaestroModalShell title="Director's Notes" badge={badge} footer={footer} theme={theme}>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
				<DirectorNotesTabStrip tabs={tabs} theme={theme} />
				{children}
			</div>
		</MaestroModalShell>
	);
};

export const DirectorNotesTabStrip: React.FC<{
	tabs: readonly DirectorNotesTabState[];
	theme: MaestroVisualTheme;
}> = ({ tabs, theme }) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				paddingBottom: 18,
				borderBottom: `1px solid ${theme.colors.border}`,
			}}
		>
			{tabs.map((tab) => {
				const tone = tab.active ? toneStyles(theme).accent : toneStyles(theme).neutral;
				const opacity = tab.disabled && !tab.active ? 0.48 : 1;

				return (
					<div
						key={tab.id}
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							padding: '10px 16px',
							borderRadius: 14,
							border: `1px solid ${tab.active ? tone.borderColor : theme.colors.border}`,
							background: tab.active ? tone.background : 'transparent',
							color: tab.active ? tone.color : theme.colors.textDim,
							opacity,
						}}
					>
						<div
							style={{
								width: 10,
								height: 10,
								borderRadius: 999,
								background: tab.generating ? theme.colors.warning : theme.colors.accent,
								boxShadow: tab.generating
									? `0 0 0 4px ${theme.colors.warning}18`
									: `0 0 0 4px ${theme.colors.accent}14`,
							}}
						/>
						<div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
							<span style={{ fontSize: 18 }}>{tab.label}</span>
							{tab.generating ? (
								<span
									style={{
										fontSize: 13,
										letterSpacing: 0.8,
										textTransform: 'uppercase',
										color: theme.colors.warning,
									}}
								>
									generating...
								</span>
							) : null}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const DirectorFilterPill: React.FC<{
	label: 'AUTO' | 'USER';
	active: boolean;
	theme: MaestroVisualTheme;
}> = ({ label, active, theme }) => {
	const colors = label === 'AUTO' ? toneStyles(theme).warning : toneStyles(theme).accent;

	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 8,
				padding: '10px 14px',
				borderRadius: 999,
				border: `1px solid ${active ? colors.borderColor : theme.colors.border}`,
				background: active ? colors.background : 'transparent',
				color: active ? colors.color : theme.colors.textDim,
				opacity: active ? 1 : 0.54,
				fontSize: 15,
				letterSpacing: 0.9,
				textTransform: 'uppercase',
			}}
		>
			<div
				style={{
					width: 8,
					height: 8,
					borderRadius: 999,
					background: active ? colors.color : theme.colors.textDim,
				}}
			/>
			{label}
		</div>
	);
};

export const DirectorSearchField: React.FC<{
	query: string;
	theme: MaestroVisualTheme;
	placeholder?: string;
}> = ({ query, theme, placeholder = 'Filter by summary or agent name...' }) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 10,
				padding: '11px 14px',
				minWidth: 280,
				borderRadius: 999,
				border: `1px solid ${theme.colors.accent}3f`,
				background: theme.colors.bgActivity,
				color: theme.colors.textMain,
				boxShadow: `0 0 0 1px ${theme.colors.accent}10`,
			}}
		>
			<div
				style={{
					width: 12,
					height: 12,
					borderRadius: 999,
					border: `2px solid ${theme.colors.accent}`,
					position: 'relative',
				}}
			>
				<div
					style={{
						position: 'absolute',
						right: -5,
						bottom: -5,
						width: 7,
						height: 2,
						borderRadius: 999,
						background: theme.colors.accent,
						transform: 'rotate(45deg)',
						transformOrigin: 'center',
					}}
				/>
			</div>
			<span style={{ fontSize: 16, color: query ? theme.colors.textMain : theme.colors.textDim }}>
				{query || placeholder}
			</span>
		</div>
	);
};

export const DirectorActivityGraph: React.FC<{
	bars: readonly number[];
	theme: MaestroVisualTheme;
	startLabel: string;
	endLabel: string;
	countLabel: string;
	highlightedIndex?: number;
}> = ({ bars, theme, startLabel, endLabel, countLabel, highlightedIndex = -1 }) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
			<div
				style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}
			>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))`,
						gap: 8,
						alignItems: 'end',
						minHeight: 52,
					}}
				>
					{bars.map((value, index) => {
						const isHighlighted = index === highlightedIndex;
						const useWarning = index % 6 === 1;

						return (
							<div
								key={`${value}-${index}`}
								style={{
									height: 10 + value * 3,
									borderRadius: 999,
									background: isHighlighted
										? theme.colors.warning
										: useWarning
											? `${theme.colors.warning}88`
											: `${theme.colors.accent}${index > bars.length / 2 ? 'cc' : '77'}`,
									boxShadow: isHighlighted ? `0 0 0 2px ${theme.colors.warning}18` : undefined,
								}}
							/>
						);
					})}
				</div>
				<div
					style={{
						fontSize: 15,
						color: theme.colors.textDim,
						letterSpacing: 0.4,
						whiteSpace: 'nowrap',
					}}
				>
					{countLabel}
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					fontSize: 13,
					color: theme.colors.textDim,
					letterSpacing: 0.8,
					textTransform: 'uppercase',
				}}
			>
				<span>{startLabel}</span>
				<span>{endLabel}</span>
			</div>
		</div>
	);
};

export const DirectorStatsBar: React.FC<{
	items: readonly DirectorNotesStatItem[];
	theme: MaestroVisualTheme;
}> = ({ items, theme }) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 16,
				flexWrap: 'wrap',
				padding: '8px 6px',
			}}
		>
			{items.map((item) => {
				const tone = toneStyles(theme)[item.tone ?? 'neutral'];

				return (
					<div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<div
							style={{
								width: 18,
								height: 18,
								borderRadius: 6,
								border: `1px solid ${tone.borderColor}`,
								background: tone.background,
								color: tone.color,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 11,
							}}
						>
							{item.value.slice(0, 1)}
						</div>
						<div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
							<span
								style={{
									fontSize: 13,
									letterSpacing: 1.1,
									textTransform: 'uppercase',
									color: theme.colors.textDim,
								}}
							>
								{item.label}
							</span>
							<span style={{ fontSize: 19, color: theme.colors.textMain }}>{item.value}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const DirectorHistoryRow: React.FC<{
	row: DirectorNotesHistoryRowData;
	theme: MaestroVisualTheme;
	highlighted?: boolean;
	selected?: boolean;
	showResumeCue?: boolean;
}> = ({ row, theme, highlighted = false, selected = false, showResumeCue = false }) => {
	const typeTone = tabTypeTone(row.type, theme);
	const statusStyles = statusTone(row.status, theme);
	const borderColor = selected
		? `${theme.colors.warning}7a`
		: highlighted
			? `${theme.colors.accent}88`
			: theme.colors.border;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				padding: '16px 18px',
				borderRadius: 20,
				border: `1px solid ${borderColor}`,
				background: highlighted ? `${theme.colors.accent}10` : theme.colors.bgActivity,
				boxShadow: selected ? `0 18px 36px ${theme.colors.bgSidebar}` : undefined,
			}}
		>
			<div
				style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
					<div style={{ fontSize: 22, color: theme.colors.textMain }}>{row.agent}</div>
					<MetaBadge label={row.session} theme={theme} />
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							padding: '8px 12px',
							borderRadius: 999,
							border: `1px solid ${typeTone.borderColor}`,
							background: typeTone.background,
							color: typeTone.color,
							fontSize: 14,
							letterSpacing: 0.8,
							textTransform: 'uppercase',
						}}
					>
						<div
							style={{
								width: 8,
								height: 8,
								borderRadius: 999,
								background: typeTone.color,
							}}
						/>
						{row.type}
					</div>
					{row.status ? (
						<div
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 8,
								padding: '8px 12px',
								borderRadius: 999,
								border: `1px solid ${statusStyles.borderColor}`,
								background: statusStyles.background,
								color: statusStyles.color,
								fontSize: 14,
								letterSpacing: 0.8,
								textTransform: 'uppercase',
							}}
						>
							{row.status === 'validated'
								? 'Validated'
								: row.status === 'attention'
									? 'Review'
									: 'Done'}
						</div>
					) : null}
				</div>
				<div style={{ fontSize: 15, color: theme.colors.textDim }}>{row.timestamp}</div>
			</div>
			<div style={{ fontSize: 18, lineHeight: 1.46, color: theme.colors.textMain }}>
				{row.summary}
			</div>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 12,
					paddingTop: 10,
					borderTop: `1px solid ${theme.colors.border}`,
					color: theme.colors.textDim,
					fontSize: 15,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
					<span>{row.duration}</span>
					{row.cost ? (
						<span
							style={{
								padding: '4px 10px',
								borderRadius: 999,
								background: `${theme.colors.success}16`,
								border: `1px solid ${theme.colors.success}33`,
								color: theme.colors.success,
							}}
						>
							{row.cost}
						</span>
					) : null}
				</div>
				{showResumeCue ? (
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							color: theme.colors.accentText,
						}}
					>
						<span>Open session</span>
						<span style={{ fontFamily: 'monospace' }}>TAB</span>
					</div>
				) : null}
			</div>
		</div>
	);
};

export const DirectorActionButton: React.FC<{
	label: string;
	theme: MaestroVisualTheme;
	tone?: 'accent' | 'neutral' | 'warning';
	disabled?: boolean;
}> = ({ label, theme, tone = 'neutral', disabled = false }) => {
	const colors = toneStyles(theme)[tone];

	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '12px 18px',
				borderRadius: 14,
				border: `1px solid ${colors.borderColor}`,
				background: colors.background,
				color: colors.color,
				fontSize: 16,
				opacity: disabled ? 0.45 : 1,
			}}
		>
			{label}
		</div>
	);
};
