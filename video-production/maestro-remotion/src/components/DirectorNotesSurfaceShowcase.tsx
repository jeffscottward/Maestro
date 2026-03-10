import type React from 'react';

import directorNotesCaptureManifestJson from '../../capture/manifests/director-notes/director-notes-capture-manifest.json';
import directorNotesAiOverviewLoadingProofJson from '../../capture/derived/director-notes/ai-overview-loading-proof.json';
import directorNotesEvidenceLinkJson from '../../capture/derived/director-notes/evidence-link.json';
import directorNotesHistoryDetailProofJson from '../../capture/derived/director-notes/history-detail-proof.json';
import { FeatureCaptureManifestSchema } from '../data/capture-schema';
import type { CaptureManifestEntry, SceneData } from '../data/production-schema';
import {
	createFallbackSlot,
	type MaestroVisualTheme,
	type VisualFallbackSlot,
} from '../lib/maestroVisualSystem';
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
import { MaestroFallbackSlot } from '../ui/MaestroPrimitives';

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

const directorNotesCaptureManifest = FeatureCaptureManifestSchema.parse(
	directorNotesCaptureManifestJson
);
const directorNotesAssetsById = new Map(
	directorNotesCaptureManifest.assets.map((asset) => [asset.id, asset])
);
const directorNotesSceneMappingsById = new Map(
	directorNotesCaptureManifest.sceneMappings.map((sceneMapping) => [
		sceneMapping.sceneId,
		sceneMapping,
	])
);
const historyDetailProof = directorNotesHistoryDetailProofJson;
const aiOverviewLoadingProof = directorNotesAiOverviewLoadingProofJson;
const evidenceLinkProof = directorNotesEvidenceLinkJson;

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

const getSceneFallbackSlots = (scene: SceneData): VisualFallbackSlot[] => {
	const sceneMapping = directorNotesSceneMappingsById.get(scene.id);

	if (!sceneMapping) {
		return [];
	}

	return (scene.assetPlaceholderIds ?? []).flatMap((assetId) => {
		const asset = directorNotesAssetsById.get(assetId);

		if (!asset) {
			return [];
		}

		const source = sceneMapping.sources.find((candidate) =>
			candidate.fallbackAssetIds.includes(assetId)
		);
		const sourcePath = asset.capturedPath ?? asset.plannedSource;

		return [
			createFallbackSlot({
				id: asset.id,
				label: asset.label,
				sourcePath,
				mediaType: asset.mediaType === 'video' ? 'video' : 'screenshot',
				reason: source?.notes ?? asset.usage,
			}),
		];
	});
};

const sceneUsesScreenshotFallback = (scene: SceneData) => {
	const sceneMapping = directorNotesSceneMappingsById.get(scene.id);

	return (
		sceneMapping?.sources.some((source) =>
			source.notes.toLowerCase().includes('screenshot fallback')
		) ?? false
	);
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
	fallbackSlots: VisualFallbackSlot[];
}> = ({ theme, progress, showCaptureNote, fallbackSlots }) => {
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
			{fallbackSlots[0] ? <MaestroFallbackSlot slot={fallbackSlots[0]} theme={theme} /> : null}
		</DirectorNotesSurfaceShell>
	);
};

const HistoryFilteredSurface: React.FC<{
	theme: MaestroVisualTheme;
	progress: number;
	fallbackSlots: VisualFallbackSlot[];
}> = ({ theme, progress, fallbackSlots }) => {
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
			{fallbackSlots[0] ? <MaestroFallbackSlot slot={fallbackSlots[0]} theme={theme} /> : null}
		</DirectorNotesSurfaceShell>
	);
};

const HistoryDetailSurface: React.FC<{
	theme: MaestroVisualTheme;
	fallbackSlots: VisualFallbackSlot[];
}> = ({ theme, fallbackSlots }) => {
	const detailSlot = fallbackSlots[fallbackSlots.length - 1];

	return (
		<DirectorNotesSurfaceShell
			tabs={createTabs({ activeTab: 'history', aiEnabled: false, aiGenerating: false })}
			footer={
				<>
					<span>{historyDetailProof.claims[1]}</span>
					<span>{historyDetailProof.claims[2]}</span>
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
						display: 'grid',
						gridTemplateRows: '1fr auto',
						gap: 16,
					}}
				>
					<DirectorDetailCard row={HISTORY_ROWS[0]} theme={theme} />
					{detailSlot ? <MaestroFallbackSlot slot={detailSlot} theme={theme} /> : null}
				</div>
			</div>
		</DirectorNotesSurfaceShell>
	);
};

const HistoryWarmupSurface: React.FC<{
	theme: MaestroVisualTheme;
	fallbackSlots: VisualFallbackSlot[];
}> = ({ theme, fallbackSlots }) => {
	return (
		<DirectorNotesSurfaceShell
			tabs={createTabs({ activeTab: 'history', aiEnabled: false, aiGenerating: true })}
			footer={
				<>
					<span>{aiOverviewLoadingProof.claims[0]}</span>
					<span>{aiOverviewLoadingProof.claims[1]}</span>
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
						lookbackDays={aiOverviewLoadingProof.toolbar.lookbackDays}
						showGenerating
						disableSecondaryActions
						theme={theme}
					/>
					<DirectorPanel theme={theme} padding={18} gap={12}>
						<div style={{ fontSize: 18, color: theme.colors.textMain }}>
							AI Overview is building in the background.
						</div>
						<div style={{ fontSize: 16, lineHeight: 1.46, color: theme.colors.textDim }}>
							{aiOverviewLoadingProof.claims[2]}
						</div>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
								gap: 10,
							}}
						>
							{aiOverviewLoadingProof.progressSteps.map((label, index) => (
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
					{fallbackSlots[0] ? <MaestroFallbackSlot slot={fallbackSlots[0]} theme={theme} /> : null}
				</div>
			</div>
		</DirectorNotesSurfaceShell>
	);
};

const AiReadySurface: React.FC<{
	theme: MaestroVisualTheme;
	showCaptureNote: boolean;
	fallbackSlots: VisualFallbackSlot[];
}> = ({ theme, showCaptureNote, fallbackSlots }) => {
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
			{fallbackSlots[0] ? <MaestroFallbackSlot slot={fallbackSlots[0]} theme={theme} /> : null}
		</DirectorNotesSurfaceShell>
	);
};

const EvidenceBridgeSurface: React.FC<{
	theme: MaestroVisualTheme;
	fallbackSlots: VisualFallbackSlot[];
}> = ({ theme, fallbackSlots }) => {
	const evidenceSlot = fallbackSlots[fallbackSlots.length - 1];

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
			<DirectorPanel theme={theme} padding={18} gap={12}>
				<div style={{ fontSize: 15, color: theme.colors.textDim }}>
					{evidenceLinkProof.panels.join(' -> ')}
				</div>
				<div style={{ display: 'grid', gap: 10 }}>
					{evidenceLinkProof.claims.map((claim) => (
						<div
							key={claim}
							style={{ fontSize: 17, lineHeight: 1.45, color: theme.colors.textMain }}
						>
							{claim}
						</div>
					))}
				</div>
			</DirectorPanel>
			{evidenceSlot ? <MaestroFallbackSlot slot={evidenceSlot} theme={theme} /> : null}
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
	progress,
	theme,
}) => {
	const variant = getDirectorNotesSceneVariant(scene);
	const fallbackSlots = getSceneFallbackSlots(scene);
	const showCaptureNote = sceneUsesScreenshotFallback(scene);

	switch (variant) {
		case 'history-filtered':
			return (
				<HistoryFilteredSurface fallbackSlots={fallbackSlots} progress={progress} theme={theme} />
			);
		case 'history-detail':
			return <HistoryDetailSurface fallbackSlots={fallbackSlots} theme={theme} />;
		case 'history-warmup':
			return <HistoryWarmupSurface fallbackSlots={fallbackSlots} theme={theme} />;
		case 'ai-ready':
			return (
				<AiReadySurface
					fallbackSlots={fallbackSlots}
					showCaptureNote={showCaptureNote}
					theme={theme}
				/>
			);
		case 'evidence-bridge':
			return <EvidenceBridgeSurface fallbackSlots={fallbackSlots} theme={theme} />;
		case 'history-default':
		default:
			return (
				<HistoryDefaultSurface
					fallbackSlots={fallbackSlots}
					progress={progress}
					showCaptureNote={showCaptureNote}
					theme={theme}
				/>
			);
	}
};
