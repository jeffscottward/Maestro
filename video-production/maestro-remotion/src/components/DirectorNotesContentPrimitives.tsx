import type React from 'react';

import type { MaestroVisualTheme } from '../lib/maestroVisualSystem';
import {
	DirectorActionButton,
	DirectorHistoryRow,
	DirectorPanel,
	DirectorStatsBar,
	type DirectorNotesHistoryRowData,
	type DirectorNotesOverviewSection,
} from './DirectorNotesPrimitives';
import { MetaBadge } from '../ui/MetaBadge';

export const DirectorOverviewToolbar: React.FC<{
	theme: MaestroVisualTheme;
	lookbackDays: number;
	generatedAt: string;
	showGenerating?: boolean;
	disableSecondaryActions?: boolean;
}> = ({
	theme,
	lookbackDays,
	generatedAt,
	showGenerating = false,
	disableSecondaryActions = false,
}) => {
	return (
		<DirectorPanel theme={theme} padding={18} gap={14}>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'minmax(0, 1fr) auto',
					gap: 18,
					alignItems: 'center',
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
					<div style={{ fontSize: 18, color: theme.colors.textMain }}>
						Lookback: {lookbackDays} days
					</div>
					<div
						style={{
							height: 10,
							borderRadius: 999,
							background: `${theme.colors.border}`,
							position: 'relative',
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								position: 'absolute',
								left: '22%',
								top: 0,
								bottom: 0,
								width: '32%',
								borderRadius: 999,
								background: theme.colors.accent,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								left: '22%',
								top: '50%',
								width: 18,
								height: 18,
								borderRadius: 999,
								transform: 'translate(-50%, -50%)',
								background: theme.colors.textMain,
								boxShadow: `0 0 0 4px ${theme.colors.accent}22`,
							}}
						/>
					</div>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<div
						style={{
							fontSize: 15,
							color: theme.colors.textDim,
							whiteSpace: 'nowrap',
						}}
					>
						{generatedAt}
					</div>
					<DirectorActionButton
						label={showGenerating ? 'Regenerating...' : 'Regenerate'}
						tone="accent"
						disabled={showGenerating}
						theme={theme}
					/>
					<DirectorActionButton label="Save" disabled={disableSecondaryActions} theme={theme} />
					<DirectorActionButton label="Copy" disabled={disableSecondaryActions} theme={theme} />
				</div>
			</div>
			{showGenerating ? (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
					<div
						style={{
							height: 8,
							borderRadius: 999,
							background: theme.colors.border,
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								width: '44%',
								height: '100%',
								borderRadius: 999,
								background: theme.colors.warning,
							}}
						/>
					</div>
					<div style={{ fontSize: 15, color: theme.colors.warning }}>Generating synopsis...</div>
				</div>
			) : null}
		</DirectorPanel>
	);
};

export const DirectorOverviewSections: React.FC<{
	sections: readonly DirectorNotesOverviewSection[];
	theme: MaestroVisualTheme;
}> = ({ sections, theme }) => {
	return (
		<DirectorPanel theme={theme} padding={22} gap={20}>
			{sections.map((section) => (
				<div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
						<div style={{ fontSize: 34, color: theme.colors.warning }}>{section.title}</div>
						{section.subtitle ? (
							<div style={{ fontSize: 18, color: theme.colors.textDim }}>{section.subtitle}</div>
						) : null}
					</div>
					{section.lines.map((line) => (
						<div
							key={line}
							style={{
								display: 'flex',
								gap: 12,
								alignItems: 'flex-start',
								fontSize: 18,
								lineHeight: 1.48,
								color: theme.colors.textMain,
							}}
						>
							<span style={{ color: theme.colors.accentText }}>-</span>
							<span>{line}</span>
						</div>
					))}
				</div>
			))}
		</DirectorPanel>
	);
};

export const DirectorDetailCard: React.FC<{
	row: DirectorNotesHistoryRowData;
	theme: MaestroVisualTheme;
}> = ({ row, theme }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 16,
				padding: 22,
				borderRadius: 24,
				border: `1px solid ${theme.colors.border}`,
				background: `${theme.colors.bgSidebar}f4`,
				boxShadow: `0 26px 60px ${theme.colors.bgSidebar}`,
				backdropFilter: 'blur(18px)',
			}}
		>
			<div
				style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
					<div style={{ fontSize: 26, color: theme.colors.textMain }}>{row.agent}</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
						<MetaBadge label={row.session} theme={theme} />
						<div
							style={{
								padding: '8px 12px',
								borderRadius: 999,
								border: `1px solid ${
									row.type === 'AUTO' ? `${theme.colors.warning}66` : `${theme.colors.accent}66`
								}`,
								background:
									row.type === 'AUTO' ? `${theme.colors.warning}1e` : theme.colors.accentDim,
								color: row.type === 'AUTO' ? theme.colors.warning : theme.colors.accentText,
								fontSize: 14,
								letterSpacing: 0.8,
								textTransform: 'uppercase',
							}}
						>
							{row.type}
						</div>
						<div style={{ fontSize: 15, color: theme.colors.textDim }}>{row.timestamp}</div>
					</div>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
					<DirectorActionButton label="Prev" theme={theme} />
					<DirectorActionButton label="Next" theme={theme} />
					<DirectorActionButton label="Resume Session" tone="accent" theme={theme} />
				</div>
			</div>
			<DirectorPanel theme={theme} padding={18} gap={10}>
				<div style={{ fontSize: 15, color: theme.colors.textDim }}>Evidence Detail</div>
				<div style={{ fontSize: 18, lineHeight: 1.48, color: theme.colors.textMain }}>
					- Queried the RSSidian database for quality-rated articles across the last two days.
				</div>
				<div style={{ fontSize: 18, lineHeight: 1.48, color: theme.colors.textMain }}>
					- Synthesized the results into a focused news briefing with AI burnout, security
					incidents, and platform changes highlighted.
				</div>
				<div style={{ fontSize: 18, lineHeight: 1.48, color: theme.colors.textMain }}>
					- The session pill stays attached so the user can jump back into the originating agent
					tab.
				</div>
			</DirectorPanel>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 12,
					fontSize: 15,
					color: theme.colors.textDim,
				}}
			>
				<span>Left/Right move between entries</span>
				<span>Esc closes detail view</span>
			</div>
		</div>
	);
};

export const DirectorEvidenceBridge: React.FC<{
	theme: MaestroVisualTheme;
	historyRows: readonly DirectorNotesHistoryRowData[];
	sections: readonly DirectorNotesOverviewSection[];
}> = ({ theme, historyRows, sections }) => {
	return (
		<div style={{ display: 'grid', gridTemplateColumns: '0.98fr auto 1.02fr', gap: 18 }}>
			<DirectorPanel theme={theme} padding={18} gap={14}>
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
					<div style={{ fontSize: 22, color: theme.colors.textMain }}>Unified History</div>
					<div style={{ fontSize: 15, color: theme.colors.textDim }}>history files</div>
				</div>
				{historyRows.slice(0, 3).map((row, index) => (
					<DirectorHistoryRow
						key={`${row.agent}-${row.session}`}
						row={row}
						highlighted={index === 0}
						showResumeCue={index === 0}
						theme={theme}
					/>
				))}
			</DirectorPanel>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 12,
					color: theme.colors.accentText,
				}}
			>
				<div
					style={{
						padding: '12px 14px',
						borderRadius: 999,
						border: `1px solid ${theme.colors.accent}44`,
						background: `${theme.colors.accent}16`,
						fontSize: 14,
						letterSpacing: 1,
						textTransform: 'uppercase',
					}}
				>
					+ grounded synthesis
				</div>
				<div
					style={{
						width: 72,
						height: 2,
						background: theme.colors.accent,
					}}
				/>
				<div
					style={{
						width: 24,
						height: 24,
						borderRadius: 999,
						border: `1px solid ${theme.colors.accent}55`,
						background: `${theme.colors.accent}12`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: 16,
					}}
				>
					{'>'}
				</div>
			</div>
			<div style={{ display: 'grid', gap: 14 }}>
				<DirectorPanel theme={theme} padding={18} gap={10}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<div style={{ fontSize: 22, color: theme.colors.textMain }}>AI Overview</div>
						<div style={{ fontSize: 15, color: theme.colors.textDim }}>synopsis out</div>
					</div>
					<DirectorStatsBar
						items={[
							{ label: 'History Entries', value: '7', tone: 'accent' },
							{ label: 'Agents', value: '4', tone: 'neutral' },
							{ label: 'Time', value: '1m 11s', tone: 'warning' },
						]}
						theme={theme}
					/>
				</DirectorPanel>
				<DirectorOverviewSections sections={sections} theme={theme} />
			</div>
		</div>
	);
};
