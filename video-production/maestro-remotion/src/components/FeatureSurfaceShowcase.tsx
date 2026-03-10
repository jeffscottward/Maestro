import type React from 'react';

import type {
	CaptureManifestEntry,
	SceneData,
	SceneSurfaceId,
} from '../data/production-schema';
import {
	AUTO_RUN_DOCUMENTS,
	DIRECTOR_NOTES_TABS,
	MAESTRO_SURFACE_THEMES,
	SYMPHONY_TABS,
	TERMINAL_PLAN_LINES,
	VISUAL_FALLBACK_SLOTS,
	WORKTREE_TABS,
	createFallbackSlot,
} from '../lib/maestroVisualSystem';
import {
	MaestroActivityRow,
	MaestroAnnotationSurface,
	MaestroAutoRunDocumentList,
	MaestroFallbackSlot,
	MaestroModalShell,
	MaestroStatCard,
	MaestroTerminalBlock,
	MaestroWorktreeControls,
} from '../ui/MaestroPrimitives';

type FeatureSurfaceShowcaseProps = {
	scene: SceneData;
	captures: CaptureManifestEntry[];
};

type ShowcaseRow = {
	title: string;
	tag: string;
	summary: string;
	meta: string;
	highlighted?: boolean;
};

const SYMPHONY_PROJECT_ROWS: readonly ShowcaseRow[] = [
	{
		title: 'runmaestro/maestro',
		tag: 'Developer Tools',
		summary:
			'Issue detail, document previews, and blocked states stay visible without leaving the modal.',
		meta: '12 open issues',
		highlighted: true,
	},
	{
		title: 'runmaestro/docs',
		tag: 'Docs',
		summary:
			'Registered projects keep category, status, and Start Symphony context grounded in real repository copy.',
		meta: '5 docs',
	},
	{
		title: 'runmaestro/website',
		tag: 'Active',
		summary:
			'Contribution progress, PR links, and token usage can deepen later without changing the prototype shell.',
		meta: '3 active runs',
	},
] as const;

const DIRECTOR_HISTORY_ROWS: readonly ShowcaseRow[] = [
	{
		title: 'Remotion Videos',
		tag: 'AUTO',
		summary:
			'Implemented teaser registration, prototype spec wiring, and validation updates inside video-production/maestro-remotion.',
		meta: '2m | $0.42',
		highlighted: true,
	},
	{
		title: 'Codex',
		tag: 'USER',
		summary:
			'Queued follow-up work for deeper scene polish after the first prototype reel is renderable end to end.',
		meta: '45s | $0.09',
	},
	{
		title: 'Factory Droid',
		tag: 'AUTO',
		summary:
			'Tracked prototype constraints, remaining capture fallback slots, and future ratio adaptation work.',
		meta: '3m | $0.31',
	},
] as const;

const DIRECTOR_AI_OVERVIEW_LINES = [
	'# AI Overview',
	'',
	'Accomplishments',
	'- Registered MaestroFeatureTeaser plus three prototype stubs.',
	'- Kept Maestro Symphony, Director\'s Notes, and Run in Worktree copy literal.',
	'',
	'Challenges',
	'- Dense modal surfaces still rely on exact screenshot fallback slots.',
	'',
	'Next Steps',
	'- Replace screenshot slots with deeper reconstructed scenes.',
] as const;

const WORKTREE_EXECUTION_LINES = [
	'Auto Run Playbook: maestro-remotion-videos-01',
	'Branch: worktree/teaser-prototype',
	'Base Branch: main',
	'',
	'Dispatch to a separate worktree',
	'Create New Worktree',
	'Automatically create PR when complete',
] as const;

const getResolvedFallbackSlots = (captures: CaptureManifestEntry[]) =>
	captures
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

const renderStats = (
	stats: readonly { label: string; value: string; tone?: 'accent' | 'neutral' | 'success' | 'warning' }[],
	theme: typeof MAESTRO_SURFACE_THEMES.symphony
) => (
	<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
		{stats.map((stat) => (
			<MaestroStatCard
				key={stat.label}
				label={stat.label}
				value={stat.value}
				tone={stat.tone}
				theme={theme}
			/>
		))}
	</div>
);

export const getSurfaceTheme = (surfaceId: SceneSurfaceId) => {
	if (surfaceId.startsWith('symphony')) {
		return MAESTRO_SURFACE_THEMES.symphony;
	}

	if (surfaceId.startsWith('director')) {
		return MAESTRO_SURFACE_THEMES['director-notes'];
	}

	return MAESTRO_SURFACE_THEMES.worktree;
};

export const FeatureSurfaceShowcase: React.FC<FeatureSurfaceShowcaseProps> = ({
	scene,
	captures,
}) => {
	const theme = getSurfaceTheme(scene.surfaceId);
	const fallbackSlots = getResolvedFallbackSlots(captures);
	const primaryFallback = fallbackSlots[0];
	const secondaryFallback = fallbackSlots[1];
	const footer = (
		<>
			<span>Arrow keys to navigate | Enter to select</span>
			<span>{captures.length} linked capture inputs</span>
		</>
	);

	if (scene.surfaceId === 'symphony-projects') {
		return (
			<MaestroModalShell
				title="Maestro Symphony"
				badge="Projects"
				tabs={SYMPHONY_TABS}
				activeTab="Projects"
				footer={footer}
				theme={theme}
			>
				<div style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: 18 }}>
					<div style={{ display: 'grid', gap: 14 }}>
						{SYMPHONY_PROJECT_ROWS.map((row) => (
							<MaestroActivityRow
								key={row.title}
								title={row.title}
								tag={row.tag}
								summary={row.summary}
								meta={row.meta}
								highlighted={row.highlighted}
								theme={theme}
							/>
						))}
					</div>
					<div style={{ display: 'grid', gap: 14 }}>
						{renderStats(
							[
								{ label: 'Projects', value: '18', tone: 'accent' },
								{ label: 'Issues', value: '47', tone: 'warning' },
								{ label: 'PRs', value: '9', tone: 'success' },
							],
							theme
						)}
						<MaestroAnnotationSurface
							title="Issue Detail"
							body="Document previews rotate with Cmd+Shift+[ and Cmd+Shift+]. Blocked issues stay visible but disabled, while Start Symphony opens the Create Agent sheet for available work."
							theme={theme}
						/>
						<MaestroAutoRunDocumentList
							title="Document Previews"
							documents={AUTO_RUN_DOCUMENTS}
							summaryPillLabel="5 docs"
							theme={theme}
						/>
						{primaryFallback ? <MaestroFallbackSlot slot={primaryFallback} theme={theme} /> : null}
					</div>
				</div>
			</MaestroModalShell>
		);
	}

	if (scene.surfaceId === 'symphony-create-agent') {
		return (
			<MaestroModalShell
				title="Maestro Symphony"
				badge="Create Agent"
				tabs={SYMPHONY_TABS}
				activeTab="Projects"
				footer={footer}
				theme={theme}
			>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
					<div style={{ display: 'grid', gap: 14 }}>
						<MaestroActivityRow
							title="Issue #482"
							tag="Start Symphony"
							summary="Symphony: runmaestro/maestro #482 keeps the issue, repo, and Auto Run doc context attached to the launch action."
							meta="Available"
							highlighted
							theme={theme}
						/>
						<MaestroAutoRunDocumentList
							title="Document Previews"
							documents={AUTO_RUN_DOCUMENTS}
							summaryPillLabel="5 docs"
							theme={theme}
						/>
						{primaryFallback ? <MaestroFallbackSlot slot={primaryFallback} theme={theme} /> : null}
					</div>
					<div style={{ display: 'grid', gap: 14 }}>
						{renderStats(
							[
								{ label: 'Provider', value: 'Codex', tone: 'accent' },
								{ label: 'Branch', value: '#482', tone: 'neutral' },
								{ label: 'Docs', value: '5', tone: 'warning' },
							],
							theme
						)}
						<MaestroAnnotationSurface
							title="Create Agent"
							body="AI Provider, Session Name, and Working Directory stay literal to the real launch flow so later phases can deepen the handoff instead of replacing a generic CTA sheet."
							theme={theme}
						/>
						<MaestroAnnotationSurface
							title="Working Directory"
							body="~/Maestro-Symphony/runmaestro-maestro | Create Agent clones the repo, creates symphony/{issue-number}-{short-id}, and starts the Playbook automatically."
							theme={theme}
						/>
					</div>
				</div>
			</MaestroModalShell>
		);
	}

	if (scene.surfaceId === 'director-history') {
		return (
			<MaestroModalShell
				title="Director's Notes"
				badge="Unified History"
				tabs={DIRECTOR_NOTES_TABS}
				activeTab="Unified History"
				footer={footer}
				theme={theme}
			>
				<div style={{ display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: 18 }}>
					<div style={{ display: 'grid', gap: 14 }}>
						{renderStats(
							[
								{ label: 'Queries', value: '412', tone: 'accent' },
								{ label: 'Sessions', value: '203', tone: 'neutral' },
								{ label: 'AUTO', value: '147', tone: 'warning' },
							],
							theme
						)}
						<MaestroAnnotationSurface
							title="Filters"
							body="AUTO / USER toggles, Cmd+F search, and the Activity Graph narrow the current dataset before an entry detail or session jump opens."
							theme={theme}
						/>
						{primaryFallback ? <MaestroFallbackSlot slot={primaryFallback} theme={theme} /> : null}
					</div>
					<div style={{ display: 'grid', gap: 12 }}>
						{DIRECTOR_HISTORY_ROWS.map((row) => (
							<MaestroActivityRow
								key={row.title}
								title={row.title}
								tag={row.tag}
								summary={row.summary}
								meta={row.meta}
								highlighted={row.highlighted}
								theme={theme}
							/>
						))}
					</div>
				</div>
			</MaestroModalShell>
		);
	}

	if (scene.surfaceId === 'director-ai-overview') {
		return (
			<MaestroModalShell
				title="Director's Notes"
				badge="AI Overview"
				tabs={DIRECTOR_NOTES_TABS}
				activeTab="AI Overview"
				footer={footer}
				theme={theme}
			>
				<div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 18 }}>
					<div style={{ display: 'grid', gap: 14 }}>
						{renderStats(
							[
								{ label: 'Entries', value: '127', tone: 'accent' },
								{ label: 'Agents', value: '19', tone: 'neutral' },
								{ label: 'Time', value: '8.2s', tone: 'success' },
							],
							theme
						)}
						<MaestroAnnotationSurface
							title="Controls"
							body="Lookback, Refresh, Save, and Copy keep the synopsis workflow grounded in the real Director's Notes tab rather than a generic analytics surface."
							theme={theme}
						/>
						{primaryFallback ? <MaestroFallbackSlot slot={primaryFallback} theme={theme} /> : null}
					</div>
					<div style={{ display: 'grid', gap: 14 }}>
						<MaestroTerminalBlock title="AI Overview" lines={DIRECTOR_AI_OVERVIEW_LINES} theme={theme} />
						{secondaryFallback ? <MaestroFallbackSlot slot={secondaryFallback} theme={theme} /> : null}
					</div>
				</div>
			</MaestroModalShell>
		);
	}

	if (scene.surfaceId === 'worktree-dispatch') {
		return (
			<MaestroModalShell
				title="Run in Worktree"
				badge="Enabled"
				tabs={WORKTREE_TABS}
				activeTab="Run in Worktree"
				footer={footer}
				theme={theme}
			>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 0.95fr', gap: 18 }}>
					<div style={{ display: 'grid', gap: 14 }}>
						<MaestroWorktreeControls
							baseBranch="main"
							branchName="autorun-spinout"
							createPROnCompletion
							pathPreview="/Users/jeff/Projects/Maestro-WorkTrees/autorun-spinout"
							theme={theme}
						/>
						{primaryFallback ? (
							<MaestroFallbackSlot slot={primaryFallback} theme={theme} />
						) : (
							<MaestroAnnotationSurface
								title="Capture Coverage"
								body="Any surface that cannot be matched exactly stays explicit as a screenshot or video slot instead of a loose approximation."
								theme={theme}
							/>
						)}
					</div>
					<div style={{ display: 'grid', gap: 14 }}>
						{renderStats(
							[
								{ label: 'Base', value: 'main', tone: 'accent' },
								{ label: 'Branch', value: 'spinout', tone: 'neutral' },
								{ label: 'PR', value: 'Auto', tone: 'success' },
							],
							theme
						)}
						<MaestroAnnotationSurface
							title="Dispatch to a separate worktree"
							body="Create New Worktree, Base Branch, Worktree Branch Name, and Automatically create PR when complete stay attached to the same Auto Run modal."
							theme={theme}
						/>
						{secondaryFallback ? <MaestroFallbackSlot slot={secondaryFallback} theme={theme} /> : null}
					</div>
				</div>
			</MaestroModalShell>
		);
	}

	return (
		<MaestroModalShell
			title="Run in Worktree"
			badge="Follow-through"
			tabs={WORKTREE_TABS}
			activeTab="History"
			footer={footer}
			theme={theme}
		>
			<div style={{ display: 'grid', gridTemplateColumns: '0.98fr 1.02fr', gap: 18 }}>
				<div style={{ display: 'grid', gap: 14 }}>
					<MaestroAutoRunDocumentList
						title="Auto Run"
						documents={AUTO_RUN_DOCUMENTS}
						summaryPillLabel="20 tasks"
						theme={theme}
					/>
					<MaestroAnnotationSurface
						title="Dispatch to a separate worktree"
						body="The worktree flow keeps the Playbook queue, branch isolation, and PR follow-through connected instead of splitting them across separate tools."
						theme={theme}
					/>
					{primaryFallback ? <MaestroFallbackSlot slot={primaryFallback} theme={theme} /> : null}
				</div>
				<div style={{ display: 'grid', gap: 14 }}>
					<MaestroTerminalBlock
						title={scene.featureName}
						lines={[...TERMINAL_PLAN_LINES, '', ...WORKTREE_EXECUTION_LINES]}
						theme={theme}
					/>
					{secondaryFallback ? <MaestroFallbackSlot slot={secondaryFallback} theme={theme} /> : null}
				</div>
			</div>
		</MaestroModalShell>
	);
};
