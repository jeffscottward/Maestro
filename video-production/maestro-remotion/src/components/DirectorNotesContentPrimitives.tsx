import type React from 'react';
import { interpolate } from 'remotion';

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

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

export const DirectorOverviewToolbar: React.FC<{
	theme: MaestroVisualTheme;
	lookbackDays: number;
	generatedAt: string;
	showGenerating?: boolean;
	disableSecondaryActions?: boolean;
	progress?: number;
}> = ({
	theme,
	lookbackDays,
	generatedAt,
	showGenerating = false,
	disableSecondaryActions = false,
	progress = 1,
}) => {
	const toolbarOpacity = interpolate(progress, [0, 1], [0.54, 1], clamp);
	const controlsOffset = interpolate(progress, [0, 1], [24, 0], clamp);
	const sliderWidth = interpolate(progress, [0, 1], [18, 32], clamp);
	const sliderHandleLeft = interpolate(progress, [0, 1], [18, 22], clamp);
	const generatingWidth = interpolate(progress, [0, 1], [18, 44], clamp);

	return (
		<DirectorPanel theme={theme} padding={18} gap={14}>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'minmax(0, 1fr) auto',
					gap: 18,
					alignItems: 'center',
					opacity: toolbarOpacity,
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
								left: `${sliderHandleLeft}%`,
								top: 0,
								bottom: 0,
								width: `${sliderWidth}%`,
								borderRadius: 999,
								background: theme.colors.accent,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								left: `${sliderHandleLeft}%`,
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
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						transform: `translate3d(${controlsOffset}px, 0, 0)`,
					}}
				>
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
								width: `${generatingWidth}%`,
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
	progress?: number;
}> = ({ sections, theme, progress = 1 }) => {
	return (
		<DirectorPanel theme={theme} padding={22} gap={20}>
			{sections.map((section, index) => {
				const sectionProgress = interpolate(
					progress,
					[index * 0.18, Math.min(index * 0.18 + 0.34, 1)],
					[0, 1],
					clamp
				);
				const sectionOpacity = interpolate(sectionProgress, [0, 1], [0.2, 1], clamp);
				const sectionLift = interpolate(sectionProgress, [0, 1], [28, 0], clamp);

				return (
					<div
						key={section.title}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 10,
							opacity: sectionOpacity,
							transform: `translate3d(0, ${sectionLift}px, 0)`,
						}}
					>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
							<div style={{ fontSize: 34, color: theme.colors.warning }}>{section.title}</div>
							{section.subtitle ? (
								<div style={{ fontSize: 18, color: theme.colors.textDim }}>{section.subtitle}</div>
							) : null}
						</div>
						{section.lines.map((line, lineIndex) => {
							const lineProgress = interpolate(
								progress,
								[
									index * 0.18 + lineIndex * 0.08,
									Math.min(index * 0.18 + lineIndex * 0.08 + 0.28, 1),
								],
								[0, 1],
								clamp
							);

							return (
								<div
									key={line}
									style={{
										display: 'flex',
										gap: 12,
										alignItems: 'flex-start',
										fontSize: 18,
										lineHeight: 1.48,
										color: theme.colors.textMain,
										opacity: interpolate(lineProgress, [0, 1], [0.12, 1], clamp),
										transform: `translate3d(0, ${interpolate(
											lineProgress,
											[0, 1],
											[18, 0],
											clamp
										)}px, 0)`,
									}}
								>
									<span style={{ color: theme.colors.accentText }}>-</span>
									<span>{line}</span>
								</div>
							);
						})}
					</div>
				);
			})}
		</DirectorPanel>
	);
};

export const DirectorDetailCard: React.FC<{
	row: DirectorNotesHistoryRowData;
	theme: MaestroVisualTheme;
	progress?: number;
}> = ({ row, theme, progress = 1 }) => {
	const cardOpacity = interpolate(progress, [0, 1], [0.2, 1], clamp);
	const cardScale = interpolate(progress, [0, 1], [0.92, 1], clamp);
	const cardLift = interpolate(progress, [0, 1], [42, 0], clamp);

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
				opacity: cardOpacity,
				transform: `translate3d(0, ${cardLift}px, 0) scale(${cardScale})`,
				transformOrigin: 'center top',
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
	progress?: number;
}> = ({ theme, historyRows, sections, progress = 1 }) => {
	const historyPanelOffset = interpolate(progress, [0, 1], [0, -18], clamp);
	const historyPanelScale = interpolate(progress, [0, 1], [1, 0.98], clamp);
	const summaryPanelOffset = interpolate(progress, [0, 1], [28, 0], clamp);
	const summaryPanelScale = interpolate(progress, [0, 1], [0.96, 1.02], clamp);
	const summaryOpacity = interpolate(progress, [0, 1], [0.52, 1], clamp);
	const connectorWidth = interpolate(progress, [0, 1], [36, 72], clamp);
	const connectorScale = interpolate(progress, [0, 1], [0.84, 1.08], clamp);

	return (
		<div style={{ display: 'grid', gridTemplateColumns: '0.98fr auto 1.02fr', gap: 18 }}>
			<div
				style={{
					transform: `translate3d(${historyPanelOffset}px, 0, 0) scale(${historyPanelScale})`,
					transformOrigin: 'left center',
				}}
			>
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
			</div>
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
						transform: `scale(${connectorScale})`,
					}}
				>
					+ grounded synthesis
				</div>
				<div
					style={{
						width: connectorWidth,
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
						transform: `scale(${connectorScale})`,
					}}
				>
					{'>'}
				</div>
			</div>
			<div
				style={{
					display: 'grid',
					gap: 14,
					opacity: summaryOpacity,
					transform: `translate3d(${summaryPanelOffset}px, 0, 0) scale(${summaryPanelScale})`,
					transformOrigin: 'right center',
				}}
			>
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
				<DirectorOverviewSections progress={progress} sections={sections} theme={theme} />
			</div>
		</div>
	);
};
