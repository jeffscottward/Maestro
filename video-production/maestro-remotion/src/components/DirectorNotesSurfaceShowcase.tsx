import type React from 'react';

import type { CaptureManifestEntry, SceneData } from '../data/production-schema';
import type { MaestroVisualTheme } from '../lib/maestroVisualSystem';
import {
	DIRECTOR_NOTES_TAB_ORDER,
	DirectorActivityGraph,
	DirectorFilterPill,
	DirectorHistoryRow,
	DirectorNotesSurfaceShell,
	DirectorPanel,
	DirectorSearchField,
	DirectorStatsBar,
	type DirectorNotesHistoryRowData,
	type DirectorNotesOverviewSection,
	type DirectorNotesStatItem,
	type DirectorNotesTabId,
} from './DirectorNotesPrimitives';
import {
	DirectorDetailCard,
	DirectorEvidenceBridge,
	DirectorOverviewSections,
	DirectorOverviewToolbar,
} from './DirectorNotesContentPrimitives';

type DirectorNotesSurfaceShowcaseProps = {
	scene: SceneData;
	captures: CaptureManifestEntry[];
	progress: number;
	theme: MaestroVisualTheme;
};

export type DirectorNotesSceneVariant =
	| 'history-default'
	| 'history-filtered'
	| 'history-detail'
	| 'history-warmup'
	| 'ai-ready'
	| 'evidence-bridge';

const HISTORY_ROWS = [
	{
		agent: 'PedTome RSSidian',
		session: 'News Synopsis Request',
		type: 'USER',
		summary:
			'Queried the RSSidian database to retrieve and synthesize 79 quality-rated articles from the past two days.',
		duration: '1m 6s',
		cost: '$0.15',
		timestamp: '07:11 PM',
		status: 'done',
	},
	{
		agent: 'PedTome Podsidian',
		session: 'Podcast Recommendations',
		type: 'USER',
		summary:
			'Queried the Podsidian database to identify unprocessed podcast episodes from recent days.',
		duration: '23s',
		cost: '$0.05',
		timestamp: '07:10 PM',
		status: 'done',
	},
	{
		agent: 'Maestro',
		session: 'Git Status Check',
		type: 'USER',
		summary:
			'Reviewed current git working tree status and identified two files with uncommitted debug logging changes.',
		duration: '19s',
		cost: '$0.20',
		timestamp: 'Feb 5 04:12 PM',
		status: 'attention',
	},
	{
		agent: 'PedTome RSSidian',
		session: 'News Briefing Embeddings',
		type: 'AUTO',
		summary:
			'Conducted exploratory analysis demonstrating seven unique analytical capabilities enabled by article embeddings.',
		duration: '2m 46s',
		cost: '$0.16',
		timestamp: 'Feb 5 02:16 AM',
		status: 'validated',
	},
	{
		agent: 'Learned Hand',
		session: 'Project Overview',
		type: 'USER',
		summary: 'Surveyed repository structure and key components to produce a project synopsis.',
		duration: '25s',
		timestamp: 'Feb 4 06:29 PM',
		status: 'done',
	},
] as const satisfies readonly DirectorNotesHistoryRowData[];

const READY_OVERVIEW_SECTIONS = [
	{
		title: 'Accomplishments',
		subtitle: 'Grounded from the current unified history set.',
		lines: [
			'RSSidian fixed a critical embedding-generation bug and backfilled 223 missing embeddings.',
			'Podsidian identified unprocessed podcast episodes from recent days.',
			'Maestro reviewed quit-handler behavior and isolated debug-only instrumentation.',
		],
	},
	{
		title: 'Challenges',
		lines: [
			'The embedding backfill needed a broader OR query to catch every missing edge case.',
			'Uncommitted quit-flow logging still signals a follow-up investigation before cleanup.',
		],
	},
	{
		title: 'Next Steps',
		lines: [
			'Turn the seven embedding-driven analysis capabilities into repeatable product commands.',
			'Validate the quit-flow fix, then remove temporary debug instrumentation.',
		],
	},
] as const satisfies readonly DirectorNotesOverviewSection[];

const historyBars = [2, 4, 8, 5, 3, 6, 7, 4, 4, 3, 3, 3, 2, 2] as const;

const createTabs = ({
	activeTab,
	aiEnabled,
	aiGenerating,
}: {
	activeTab: DirectorNotesTabId;
	aiEnabled: boolean;
	aiGenerating: boolean;
}) => {
	return DIRECTOR_NOTES_TAB_ORDER.map((tab) => ({
		...tab,
		active: tab.id === activeTab,
		disabled: tab.id === 'ai-overview' && !aiEnabled,
		generating: tab.id === 'ai-overview' && aiGenerating,
	}));
};

const buildHistoryControls = ({
	theme,
	searchQuery,
	autoActive,
	userActive,
	countLabel,
}: {
	theme: MaestroVisualTheme;
	searchQuery: string;
	autoActive: boolean;
	userActive: boolean;
	countLabel: string;
}) => {
	return (
		<DirectorPanel theme={theme} padding={16} gap={14}>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto auto minmax(0, 1fr)',
					gap: 12,
					alignItems: 'center',
				}}
			>
				<DirectorFilterPill label="AUTO" active={autoActive} theme={theme} />
				<DirectorFilterPill label="USER" active={userActive} theme={theme} />
				<DirectorSearchField query={searchQuery} theme={theme} />
			</div>
			<DirectorActivityGraph
				bars={historyBars}
				theme={theme}
				startLabel="Jan 9"
				endLabel="Now"
				countLabel={countLabel}
				highlightedIndex={2}
			/>
		</DirectorPanel>
	);
};

const buildHistoryStats = (items: readonly DirectorNotesStatItem[], theme: MaestroVisualTheme) => {
	return (
		<DirectorPanel theme={theme} padding="8px 14px">
			<DirectorStatsBar items={items} theme={theme} />
		</DirectorPanel>
	);
};

const HistoryDefaultSurface: React.FC<{
	theme: MaestroVisualTheme;
	progress: number;
	showCaptureNote: boolean;
}> = ({ theme, progress, showCaptureNote }) => {
	const visibleRows = Math.max(
		3,
		Math.min(HISTORY_ROWS.length, Math.round(progress * HISTORY_ROWS.length))
	);

	return (
		<DirectorNotesSurfaceShell
			tabs={createTabs({ activeTab: 'history', aiEnabled: false, aiGenerating: false })}
			footer={
				<>
					<span>357 total entries across 27 agents</span>
					<span>Enter opens detail view</span>
				</>
			}
			theme={theme}
		>
			{showCaptureNote ? (
				<div style={{ fontSize: 15, color: theme.colors.textDim }}>
					Layout parity stays aligned with the checked-in Unified History reference while the live
					rebuild becomes exact.
				</div>
			) : null}
			{buildHistoryControls({
				theme,
				searchQuery: '',
				autoActive: true,
				userActive: true,
				countLabel: '100/357',
			})}
			{buildHistoryStats(
				[
					{ label: 'Agents', value: '27', tone: 'accent' },
					{ label: 'Sessions', value: '203', tone: 'neutral' },
					{ label: 'User', value: '210', tone: 'accent' },
					{ label: 'Auto', value: '147', tone: 'warning' },
					{ label: 'Total', value: '357', tone: 'neutral' },
				],
				theme
			)}
			<div style={{ display: 'grid', gap: 12 }}>
				{HISTORY_ROWS.slice(0, visibleRows).map((row, index) => (
					<DirectorHistoryRow
						key={`${row.agent}-${row.session}`}
						row={row}
						highlighted={index === 0}
						theme={theme}
					/>
				))}
			</div>
		</DirectorNotesSurfaceShell>
	);
};

const HistoryFilteredSurface: React.FC<{
	theme: MaestroVisualTheme;
	progress: number;
}> = ({ theme, progress }) => {
	const filteredRows = HISTORY_ROWS.filter((row) =>
		`${row.agent} ${row.session} ${row.summary}`.toLowerCase().includes('rss')
	);
	const visibleRows = Math.max(
		2,
		Math.min(filteredRows.length, Math.round(progress * filteredRows.length))
	);

	return (
		<DirectorNotesSurfaceShell
			tabs={createTabs({ activeTab: 'history', aiEnabled: false, aiGenerating: false })}
			footer={
				<>
					<span>Search narrowed the timeline without losing context</span>
					<span>Search, filters, and stats stay visible together</span>
				</>
			}
			theme={theme}
		>
			{buildHistoryControls({
				theme,
				searchQuery: 'rss',
				autoActive: false,
				userActive: true,
				countLabel: '7 matching entries',
			})}
			{buildHistoryStats(
				[
					{ label: 'Agents', value: '2', tone: 'accent' },
					{ label: 'Sessions', value: '5', tone: 'neutral' },
					{ label: 'User', value: '6', tone: 'accent' },
					{ label: 'Auto', value: '1', tone: 'warning' },
					{ label: 'Total', value: '7', tone: 'neutral' },
				],
				theme
			)}
			<div style={{ display: 'grid', gap: 12 }}>
				{filteredRows.slice(0, visibleRows).map((row, index) => (
					<DirectorHistoryRow
						key={`${row.agent}-${row.session}`}
						row={row}
						highlighted={index === 0}
						showResumeCue={index === 0}
						theme={theme}
					/>
				))}
			</div>
		</DirectorNotesSurfaceShell>
	);
};

const HistoryDetailSurface: React.FC<{
	theme: MaestroVisualTheme;
}> = ({ theme }) => {
	return (
		<DirectorNotesSurfaceShell
			tabs={createTabs({ activeTab: 'history', aiEnabled: false, aiGenerating: false })}
			footer={
				<>
					<span>
						Resume Session closes Director&apos;s Notes and returns to the originating agent tab
					</span>
					<span>Arrow keys move between neighboring entries</span>
				</>
			}
			theme={theme}
		>
			{buildHistoryControls({
				theme,
				searchQuery: 'rss',
				autoActive: true,
				userActive: true,
				countLabel: '7 matching entries',
			})}
			<div style={{ position: 'relative', minHeight: 500 }}>
				<div style={{ display: 'grid', gap: 12, opacity: 0.44 }}>
					{HISTORY_ROWS.slice(0, 3).map((row, index) => (
						<DirectorHistoryRow
							key={`${row.agent}-${row.session}`}
							row={row}
							highlighted={index === 0}
							selected={index === 0}
							showResumeCue={index === 0}
							theme={theme}
						/>
					))}
				</div>
				<div
					style={{
						position: 'absolute',
						inset: '56px 48px 20px 48px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<DirectorDetailCard row={HISTORY_ROWS[0]} theme={theme} />
				</div>
			</div>
		</DirectorNotesSurfaceShell>
	);
};

const HistoryWarmupSurface: React.FC<{
	theme: MaestroVisualTheme;
}> = ({ theme }) => {
	return (
		<DirectorNotesSurfaceShell
			tabs={createTabs({ activeTab: 'history', aiEnabled: false, aiGenerating: true })}
			footer={
				<>
					<span>
						AI Overview starts on modal open and stays unavailable until the synopsis exists
					</span>
					<span>Unified History remains the active default view</span>
				</>
			}
			theme={theme}
		>
			<div style={{ display: 'grid', gridTemplateColumns: '1.06fr 0.94fr', gap: 16 }}>
				<div style={{ display: 'grid', gap: 14 }}>
					{buildHistoryControls({
						theme,
						searchQuery: '',
						autoActive: true,
						userActive: true,
						countLabel: '100/357',
					})}
					{buildHistoryStats(
						[
							{ label: 'Agents', value: '27', tone: 'accent' },
							{ label: 'Sessions', value: '203', tone: 'neutral' },
							{ label: 'User', value: '210', tone: 'accent' },
							{ label: 'Auto', value: '147', tone: 'warning' },
							{ label: 'Total', value: '357', tone: 'neutral' },
						],
						theme
					)}
					<div style={{ display: 'grid', gap: 12 }}>
						{HISTORY_ROWS.slice(0, 2).map((row, index) => (
							<DirectorHistoryRow
								key={`${row.agent}-${row.session}`}
								row={row}
								highlighted={index === 0}
								showResumeCue={index === 0}
								theme={theme}
							/>
						))}
					</div>
				</div>
				<div style={{ display: 'grid', gap: 14 }}>
					<DirectorOverviewToolbar
						generatedAt="Preparing from current history files"
						lookbackDays={7}
						showGenerating
						disableSecondaryActions
						theme={theme}
					/>
					<DirectorPanel theme={theme} padding={18} gap={12}>
						<div style={{ fontSize: 18, color: theme.colors.textMain }}>
							AI Overview is building in the background.
						</div>
						<div style={{ fontSize: 16, lineHeight: 1.46, color: theme.colors.textDim }}>
							The main-process handler is collecting history-file paths and grounding the synopsis
							before the tab becomes ready.
						</div>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
								gap: 10,
							}}
						>
							{['History files', 'Provider warmup', 'Markdown report'].map((label, index) => (
								<DirectorPanel key={label} theme={theme} padding={14} gap={8}>
									<div style={{ fontSize: 13, color: theme.colors.textDim }}>{label}</div>
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
												width: `${index === 0 ? 100 : index === 1 ? 58 : 22}%`,
												height: '100%',
												borderRadius: 999,
												background: index === 2 ? theme.colors.warning : theme.colors.accent,
											}}
										/>
									</div>
								</DirectorPanel>
							))}
						</div>
					</DirectorPanel>
				</div>
			</div>
		</DirectorNotesSurfaceShell>
	);
};

const AiReadySurface: React.FC<{
	theme: MaestroVisualTheme;
	showCaptureNote: boolean;
}> = ({ theme, showCaptureNote }) => {
	return (
		<DirectorNotesSurfaceShell
			tabs={createTabs({ activeTab: 'ai-overview', aiEnabled: true, aiGenerating: false })}
			footer={
				<>
					<span>Ready to review, save, or copy</span>
					<span>Grounded in actual history files and unified activity data</span>
				</>
			}
			theme={theme}
		>
			{showCaptureNote ? (
				<div style={{ fontSize: 15, color: theme.colors.textDim }}>
					The ready-state screenshot still says Refresh, but the live rebuild preserves the shipped
					Regenerate label from source.
				</div>
			) : null}
			<DirectorOverviewToolbar
				generatedAt="Feb 10, 2026, 11:03 PM"
				lookbackDays={7}
				theme={theme}
			/>
			{buildHistoryStats(
				[
					{ label: 'History Entries', value: '7', tone: 'accent' },
					{ label: 'Agents', value: '4', tone: 'neutral' },
					{ label: 'Time', value: '1m 11s', tone: 'warning' },
				],
				theme
			)}
			<DirectorOverviewSections sections={READY_OVERVIEW_SECTIONS} theme={theme} />
		</DirectorNotesSurfaceShell>
	);
};

const EvidenceBridgeSurface: React.FC<{
	theme: MaestroVisualTheme;
}> = ({ theme }) => {
	return (
		<DirectorNotesSurfaceShell
			tabs={createTabs({ activeTab: 'ai-overview', aiEnabled: true, aiGenerating: false })}
			footer={
				<>
					<span>One timeline first</span>
					<span>One grounded summary second</span>
				</>
			}
			theme={theme}
		>
			<DirectorOverviewToolbar
				generatedAt="Grounded from the current lookback window"
				lookbackDays={7}
				theme={theme}
			/>
			<DirectorEvidenceBridge
				historyRows={HISTORY_ROWS}
				sections={READY_OVERVIEW_SECTIONS}
				theme={theme}
			/>
		</DirectorNotesSurfaceShell>
	);
};

export const getDirectorNotesSceneVariant = (scene: SceneData): DirectorNotesSceneVariant => {
	switch (scene.id) {
		case 'director-notes-standalone-history':
			return 'history-filtered';
		case 'director-notes-standalone-detail':
			return 'history-detail';
		case 'director-notes-standalone-ai-loading':
			return 'history-warmup';
		case 'director-notes-standalone-ai-ready':
		case 'director-ai-overview-flow':
			return 'ai-ready';
		case 'director-notes-standalone-close':
			return 'evidence-bridge';
		case 'director-history-overview':
		case 'director-notes-standalone-open':
		default:
			return 'history-default';
	}
};

export const DirectorNotesSurfaceShowcase: React.FC<DirectorNotesSurfaceShowcaseProps> = ({
	scene,
	captures,
	progress,
	theme,
}) => {
	const variant = getDirectorNotesSceneVariant(scene);
	const showCaptureNote = captures.some((capture) => capture.mode === 'fallback-slot');

	switch (variant) {
		case 'history-filtered':
			return <HistoryFilteredSurface progress={progress} theme={theme} />;
		case 'history-detail':
			return <HistoryDetailSurface theme={theme} />;
		case 'history-warmup':
			return <HistoryWarmupSurface theme={theme} />;
		case 'ai-ready':
			return <AiReadySurface showCaptureNote={showCaptureNote} theme={theme} />;
		case 'evidence-bridge':
			return <EvidenceBridgeSurface theme={theme} />;
		case 'history-default':
		default:
			return (
				<HistoryDefaultSurface
					progress={progress}
					showCaptureNote={showCaptureNote}
					theme={theme}
				/>
			);
	}
};
