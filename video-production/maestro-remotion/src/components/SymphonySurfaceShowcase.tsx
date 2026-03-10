import type React from 'react';
import { useCurrentFrame } from 'remotion';

import type { CaptureManifestEntry, SceneData } from '../data/production-schema';
import { AnimatedReveal, getAnimatedMetricValue } from './SymphonyMotionPrimitives';
import {
	SYMPHONY_TABS,
	VISUAL_FALLBACK_SLOTS,
	type MaestroVisualTheme,
	type VisualFallbackSlot,
	createFallbackSlot,
} from '../lib/maestroVisualSystem';
import {
	MaestroAnnotationSurface,
	MaestroFallbackSlot,
	MaestroModalShell,
	MaestroStatCard,
	MaestroTerminalBlock,
} from '../ui/MaestroPrimitives';
import { MetaBadge } from '../ui/MetaBadge';

type SymphonySurfaceShowcaseProps = {
	scene: SceneData;
	captures: CaptureManifestEntry[];
	progress: number;
	theme: MaestroVisualTheme;
};

export type SymphonySceneVariant =
	| 'projects-browse'
	| 'issue-detail'
	| 'create-agent'
	| 'setup-proof'
	| 'active-proof'
	| 'history-stats';

const REPOSITORY_ROWS = [
	{
		name: 'pedramamini/Maestro',
		category: 'Developer Tools',
		summary: 'Keyboard-first desktop app for managing multiple AI coding assistants.',
		maintainer: 'Pedram Amini',
		issueCount: '2 issues',
		stars: '16.2K',
		selected: true,
	},
	{
		name: 'runmaestro/playbooks',
		category: 'Workflows',
		summary: 'Curated automation documents, storyboards, and contribution-ready capture plans.',
		maintainer: 'Maestro Team',
		issueCount: '5 issues',
		stars: '1.4K',
		selected: false,
	},
	{
		name: 'runmaestro/docs',
		category: 'Documentation',
		summary: 'Hosted product docs and examples that anchor the Maestro MCP knowledge base.',
		maintainer: 'Docs Crew',
		issueCount: '0 issues',
		stars: '920',
		selected: false,
	},
] as const;

const IN_PROGRESS_ISSUES = [
	{
		number: 158,
		title: 'Review PR state handoff for Symphony sessions',
		meta: 'Draft PR #402 by @pedram',
		tone: 'accent' as const,
	},
] as const;

const AVAILABLE_ISSUES = [
	{
		number: 160,
		title: 'Improved Terminal Experience',
		meta: '14 Auto Run docs',
		selected: true,
	},
	{
		number: 163,
		title: 'Potential Refactor',
		meta: '62 Auto Run docs',
		selected: false,
	},
] as const;

const BLOCKED_ISSUES = [
	{
		number: 166,
		title: 'Refine keyboard-first worktree naming',
		meta: 'Blocked by worktree state sync cleanup',
	},
] as const;

const DOC_PREVIEW_LINES = [
	'# 4_IMPLEMENT',
	'',
	'- Keep keyboard shortcuts visible across the AI Terminal and Command Terminal surfaces.',
	'- Preserve the `Create Symphony Agent` handoff and working-directory context.',
	'- Verify `Check PR Status` and `Finalize PR` remain discoverable after activation.',
] as const;

const PROVIDER_ROWS = [
	{ label: 'Claude Code', availability: 'Available', active: true, beta: false },
	{ label: 'Codex', availability: 'Available', active: false, beta: true },
	{ label: 'OpenCode', availability: 'Available', active: false, beta: true },
] as const;

const SETUP_STEPS = [
	{
		label: 'Repository cloned',
		detail: 'pedramamini/Maestro -> ~/Maestro-Symphony/pedramamini-Maestro-160',
		tone: 'success' as const,
	},
	{
		label: 'Branch created',
		detail: 'symphony/160-terminal-experience',
		tone: 'success' as const,
	},
	{
		label: 'Empty commit created',
		detail: '[Symphony] Start contribution for #160',
		tone: 'success' as const,
	},
	{
		label: 'Draft PR created',
		detail: 'Draft PR #160 claims the issue before Auto Run begins',
		tone: 'accent' as const,
	},
	{
		label: 'Auto Run Docs staged',
		detail: '14 documents copied into Auto Run Docs',
		tone: 'accent' as const,
	},
	{
		label: 'Active lane ready',
		detail: 'Check PR Status once the contribution card moves into Active',
		tone: 'neutral' as const,
	},
] as const;

const SETUP_TERMINAL_LINES = [
	'git clone --depth=1 https://github.com/pedramamini/Maestro.git',
	'git checkout -b symphony/160-terminal-experience',
	'git commit --allow-empty -m "[Symphony] Start contribution for #160"',
	'gh pr create --draft --title "[WIP] Symphony: Improved Terminal Experience"',
	'cp docs/Terminal-1.md "Auto Run Docs/"',
] as const;

const ACTIVE_CONTRIBUTIONS = [
	{
		label: 'Running',
		issue: '#160 Improved Terminal Experience',
		repo: 'pedramamini/Maestro',
		prLabel: 'Draft PR #160',
		docProgress: '9 / 14 documents',
		currentDocument: '5_PROGRESS.md',
		timeSpent: '24m',
		inputTokens: '666K',
		outputTokens: '118K',
		cost: '$4.82',
		tone: 'accent' as const,
		showFinalize: false,
	},
	{
		label: 'Ready for Review',
		issue: '#158 Review PR state handoff for Symphony sessions',
		repo: 'pedramamini/Maestro',
		prLabel: 'Draft PR #158',
		docProgress: '6 / 6 documents',
		currentDocument: 'review summary ready',
		timeSpent: '11m',
		inputTokens: '145K',
		outputTokens: '38K',
		cost: '$1.06',
		tone: 'success' as const,
		showFinalize: true,
	},
] as const;

const HISTORY_ROWS = [
	{
		title: '#154 Stabilize provider refresh states',
		status: 'Merged',
		meta: 'Completed Mar 9 • PR #397',
		documents: '8 docs',
		tasks: '42 tasks',
	},
	{
		title: '#149 Improve Auto Run doc preview density',
		status: 'Open',
		meta: 'Completed Mar 7 • PR #391',
		documents: '5 docs',
		tasks: '19 tasks',
	},
] as const;

const ACHIEVEMENTS = [
	{ title: 'First Steps', detail: 'Completed first Symphony contribution', earned: true },
	{ title: 'Merged Melody', detail: 'First contribution merged', earned: true },
	{
		title: 'Ensemble Player',
		detail: '5 repositories contributed',
		earned: false,
		progress: '3 / 5',
	},
] as const;

const statGridStyle: React.CSSProperties = {
	display: 'grid',
	gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
	gap: 12,
};

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

const Panel: React.FC<{
	children: React.ReactNode;
	theme: MaestroVisualTheme;
	padding?: number | string;
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
}> = ({ label, value, theme }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
				padding: '16px 18px',
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
			<div style={{ fontSize: 24, color: theme.colors.textMain }}>{value}</div>
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
				padding: '13px 20px',
				borderRadius: 16,
				border: `1px solid ${isAccent ? `${theme.colors.accent}88` : theme.colors.border}`,
				background: isAccent ? theme.colors.accentDim : theme.colors.bgMain,
				color: isAccent ? theme.colors.accentText : theme.colors.textMain,
				fontSize: 18,
			}}
		>
			{label}
		</div>
	);
};

const SectionLabel: React.FC<{
	label: string;
	theme: MaestroVisualTheme;
}> = ({ label, theme }) => {
	return (
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
	);
};

const ProgressRail: React.FC<{
	progress: number;
	theme: MaestroVisualTheme;
}> = ({ progress, theme }) => {
	return (
		<div
			style={{
				height: 4,
				borderRadius: 999,
				background: theme.colors.border,
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					width: `${Math.max(progress, 0.12) * 100}%`,
					height: '100%',
					borderRadius: 999,
					background: theme.colors.accent,
				}}
			/>
		</div>
	);
};

const RepositoryCard: React.FC<{
	row: (typeof REPOSITORY_ROWS)[number];
	progress: number;
	theme: MaestroVisualTheme;
}> = ({ row, progress, theme }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				padding: '18px 20px',
				borderRadius: 20,
				border: `1px solid ${row.selected ? `${theme.colors.accent}88` : theme.colors.border}`,
				background: row.selected ? theme.colors.accentDim : theme.colors.bgMain,
			}}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
				<MetaBadge label={row.category} tone={row.selected ? 'accent' : 'neutral'} theme={theme} />
				<MetaBadge label={row.issueCount} theme={theme} />
			</div>
			<div style={{ fontSize: 28, color: theme.colors.textMain }}>{row.name}</div>
			<div style={{ fontSize: 18, lineHeight: 1.45, color: theme.colors.textDim }}>
				{row.summary}
			</div>
			<ProgressRail progress={row.selected ? progress : 0.28} theme={theme} />
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					fontSize: 17,
					color: theme.colors.textDim,
				}}
			>
				<span>{row.maintainer}</span>
				<span>{row.stars}</span>
			</div>
		</div>
	);
};

const IssueRow: React.FC<{
	number: number;
	title: string;
	meta: string;
	theme: MaestroVisualTheme;
	selected?: boolean;
	tone?: 'accent' | 'warning' | 'neutral';
}> = ({ number, title, meta, theme, selected = false, tone = 'neutral' }) => {
	const accentColor =
		tone === 'warning'
			? theme.colors.warning
			: tone === 'accent'
				? theme.colors.accent
				: theme.colors.border;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
				padding: '14px 16px',
				borderRadius: 18,
				border: `1px solid ${selected ? `${theme.colors.accent}88` : accentColor}`,
				background: selected ? theme.colors.accentDim : theme.colors.bgMain,
			}}
		>
			<div style={{ fontSize: 18, color: theme.colors.textMain }}>
				#{number} {title}
			</div>
			<div style={{ fontSize: 16, color: theme.colors.textDim }}>{meta}</div>
		</div>
	);
};

const ProviderRow: React.FC<{
	label: string;
	availability: string;
	active: boolean;
	beta: boolean;
	theme: MaestroVisualTheme;
}> = ({ label, availability, active, beta, theme }) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 16,
				padding: '14px 16px',
				borderRadius: 18,
				border: `1px solid ${active ? `${theme.colors.accent}88` : theme.colors.border}`,
				background: active ? theme.colors.accentDim : theme.colors.bgMain,
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
				<div style={{ fontSize: 19, color: theme.colors.textMain }}>{label}</div>
				{beta ? <MetaBadge label="Beta" theme={theme} /> : null}
			</div>
			<MetaBadge label={availability} tone={active ? 'accent' : 'neutral'} theme={theme} />
		</div>
	);
};

const SetupStepRow: React.FC<{
	step: (typeof SETUP_STEPS)[number];
	theme: MaestroVisualTheme;
}> = ({ step, theme }) => {
	const toneColor =
		step.tone === 'success'
			? theme.colors.success
			: step.tone === 'accent'
				? theme.colors.accentText
				: theme.colors.textDim;

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'auto 1fr',
				gap: 12,
				alignItems: 'start',
				padding: '14px 16px',
				borderRadius: 18,
				border: `1px solid ${theme.colors.border}`,
				background: theme.colors.bgMain,
			}}
		>
			<div
				style={{
					width: 12,
					height: 12,
					marginTop: 6,
					borderRadius: 999,
					background: toneColor,
				}}
			/>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
				<div style={{ fontSize: 18, color: theme.colors.textMain }}>{step.label}</div>
				<div style={{ fontSize: 16, lineHeight: 1.4, color: toneColor }}>{step.detail}</div>
			</div>
		</div>
	);
};

const ContributionCard: React.FC<{
	card: (typeof ACTIVE_CONTRIBUTIONS)[number];
	theme: MaestroVisualTheme;
	progress: number;
}> = ({ card, theme, progress }) => {
	const isReady = card.tone === 'success';
	const fill = isReady ? 1 : progress;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
				padding: '18px 20px',
				borderRadius: 20,
				border: `1px solid ${isReady ? `${theme.colors.success}55` : `${theme.colors.accent}55`}`,
				background: isReady ? `${theme.colors.success}11` : theme.colors.bgActivity,
			}}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
					<div style={{ fontSize: 20, color: theme.colors.textMain }}>{card.issue}</div>
					<div style={{ fontSize: 16, color: theme.colors.textDim }}>{card.repo}</div>
				</div>
				<MetaBadge label={card.label} tone={isReady ? 'neutral' : 'accent'} theme={theme} />
			</div>
			<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 17 }}>
				<span style={{ color: theme.colors.accentText }}>{card.prLabel}</span>
				<span style={{ color: theme.colors.textDim }}>{card.timeSpent}</span>
			</div>
			<ProgressRail progress={fill} theme={theme} />
			<div style={{ fontSize: 16, color: theme.colors.textDim }}>
				{card.docProgress} • Current: {card.currentDocument}
			</div>
			<div style={{ display: 'flex', gap: 18, fontSize: 16, color: theme.colors.textDim }}>
				<span>In {card.inputTokens}</span>
				<span>Out {card.outputTokens}</span>
				<span>{card.cost}</span>
			</div>
			<div style={{ display: 'flex', gap: 10 }}>
				<ActionButton label="Check PR Status" theme={theme} tone="neutral" />
				{card.showFinalize ? <ActionButton label="Finalize PR" theme={theme} /> : null}
			</div>
		</div>
	);
};

const AchievementBadge: React.FC<{
	title: string;
	detail: string;
	earned: boolean;
	progress?: string;
	theme: MaestroVisualTheme;
}> = ({ title, detail, earned, progress, theme }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
				padding: '14px 16px',
				borderRadius: 18,
				border: `1px solid ${earned ? `${theme.colors.accent}88` : theme.colors.border}`,
				background: earned ? theme.colors.accentDim : theme.colors.bgMain,
				opacity: earned ? 1 : 0.78,
			}}
		>
			<div style={{ fontSize: 18, color: theme.colors.textMain }}>{title}</div>
			<div style={{ fontSize: 16, lineHeight: 1.4, color: theme.colors.textDim }}>{detail}</div>
			{progress ? (
				<div style={{ fontSize: 15, color: theme.colors.warning }}>{progress}</div>
			) : null}
		</div>
	);
};

const ProjectsBrowseSurface: React.FC<{
	progress: number;
	theme: MaestroVisualTheme;
	fallbackSlots: VisualFallbackSlot[];
}> = ({ progress, theme, fallbackSlots }) => {
	return (
		<MaestroModalShell
			title="Maestro Symphony"
			badge="Projects"
			tabs={SYMPHONY_TABS}
			activeTab="Projects"
			footer={
				<>
					<span>3 repositories • Contribute to open source with AI</span>
					<span>Arrow keys to navigate • Enter to select</span>
				</>
			}
			theme={theme}
		>
			<Panel theme={theme}>
				<div style={{ display: 'grid', gridTemplateColumns: '1.5fr auto auto', gap: 12 }}>
					<FieldCard label="Search" value="Search repositories..." theme={theme} />
					<ActionButton label="All" theme={theme} tone="neutral" />
					<ActionButton label="Refresh" theme={theme} tone="neutral" />
				</div>
			</Panel>
			<div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.82fr', gap: 16 }}>
				<div style={{ display: 'grid', gap: 14 }}>
					{REPOSITORY_ROWS.map((row) => (
						<RepositoryCard key={row.name} row={row} progress={progress} theme={theme} />
					))}
				</div>
				<div style={{ display: 'grid', gap: 14 }}>
					<Panel theme={theme}>
						<SectionLabel label="Projects" theme={theme} />
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
							<MetaBadge label="Projects" tone="accent" theme={theme} />
							<MetaBadge label="Active" theme={theme} />
							<MetaBadge label="History" theme={theme} />
							<MetaBadge label="Stats" theme={theme} />
						</div>
						<div style={{ fontSize: 18, lineHeight: 1.45, color: theme.colors.textDim }}>
							Symphony keeps repository discovery, issue counts, and maintainer context in one
							contribution surface instead of scattering setup across separate tools.
						</div>
					</Panel>
					<MaestroAnnotationSurface
						title="Start Symphony"
						body="Selecting `pedramamini/Maestro` keeps the issue inventory and maintainer context visible before any setup work begins."
						theme={theme}
					/>
					{fallbackSlots[0] ? <MaestroFallbackSlot slot={fallbackSlots[0]} theme={theme} /> : null}
				</div>
			</div>
		</MaestroModalShell>
	);
};

const IssueDetailSurface: React.FC<{
	theme: MaestroVisualTheme;
	fallbackSlots: VisualFallbackSlot[];
}> = ({ theme, fallbackSlots }) => {
	return (
		<MaestroModalShell
			title="Maestro Symphony"
			badge="Projects"
			tabs={SYMPHONY_TABS}
			activeTab="Projects"
			footer={
				<>
					<span>Will clone repo, create draft PR, and run all documents</span>
					<span>Cmd+Shift+[ ] cycles Auto Run Docs</span>
				</>
			}
			theme={theme}
		>
			<div style={{ display: 'grid', gridTemplateColumns: '0.88fr 1.12fr', gap: 16 }}>
				<div style={{ display: 'grid', gap: 14 }}>
					<Panel theme={theme}>
						<SectionLabel label="About" theme={theme} />
						<div style={{ fontSize: 18, lineHeight: 1.45, color: theme.colors.textMain }}>
							Keyboard-first desktop app for orchestrating multiple AI coding assistants and Auto
							Run workflows.
						</div>
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
							<MetaBadge label="Pedram Amini" tone="accent" theme={theme} />
							<MetaBadge label="Developer Tools" theme={theme} />
						</div>
					</Panel>
					<Panel theme={theme}>
						<SectionLabel label="In Progress" theme={theme} />
						{IN_PROGRESS_ISSUES.map((issue) => (
							<IssueRow
								key={issue.number}
								number={issue.number}
								title={issue.title}
								meta={issue.meta}
								theme={theme}
								tone={issue.tone}
							/>
						))}
					</Panel>
					<Panel theme={theme}>
						<SectionLabel label="Available Issues" theme={theme} />
						{AVAILABLE_ISSUES.map((issue) => (
							<IssueRow
								key={issue.number}
								number={issue.number}
								title={issue.title}
								meta={issue.meta}
								theme={theme}
								selected={issue.selected}
							/>
						))}
					</Panel>
					<Panel theme={theme}>
						<SectionLabel label="Blocked" theme={theme} />
						{BLOCKED_ISSUES.map((issue) => (
							<IssueRow
								key={issue.number}
								number={issue.number}
								title={issue.title}
								meta={issue.meta}
								theme={theme}
								tone="warning"
							/>
						))}
					</Panel>
				</div>
				<div style={{ display: 'grid', gap: 14 }}>
					<Panel theme={theme}>
						<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
								<div style={{ fontSize: 16, color: theme.colors.textDim }}>#160 Selected Issue</div>
								<div style={{ fontSize: 28, color: theme.colors.textMain }}>
									Improved Terminal Experience
								</div>
							</div>
							<ActionButton label="View Issue" theme={theme} tone="neutral" />
						</div>
						<div style={{ fontSize: 17, color: theme.colors.textDim }}>
							14 Auto Run documents stay attached to the issue before activation.
						</div>
					</Panel>
					<Panel theme={theme}>
						<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
							<SectionLabel label="Auto Run Docs" theme={theme} />
							<MetaBadge label="4_IMPLEMENT.md" tone="accent" theme={theme} />
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 8,
								padding: '18px 20px',
								borderRadius: 18,
								border: `1px solid ${theme.colors.border}`,
								background: theme.colors.bgMain,
							}}
						>
							{DOC_PREVIEW_LINES.map((line) => (
								<div
									key={line}
									style={{
										fontSize: line.startsWith('#') ? 22 : 17,
										lineHeight: 1.45,
										color: line.startsWith('#') ? theme.colors.accentText : theme.colors.textMain,
									}}
								>
									{line || '\u00a0'}
								</div>
							))}
						</div>
					</Panel>
					<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
						<ActionButton label="Start Symphony" theme={theme} />
						<ActionButton label="Check PR Status" theme={theme} tone="neutral" />
					</div>
					{fallbackSlots[0] ? <MaestroFallbackSlot slot={fallbackSlots[0]} theme={theme} /> : null}
				</div>
			</div>
		</MaestroModalShell>
	);
};

const CreateAgentSurface: React.FC<{
	theme: MaestroVisualTheme;
	fallbackSlots: VisualFallbackSlot[];
}> = ({ theme, fallbackSlots }) => {
	const frame = useCurrentFrame();

	return (
		<MaestroModalShell title="Create Symphony Agent" badge="Issue #160" theme={theme}>
			<AnimatedReveal frame={frame} delayFrames={0} durationFrames={16}>
				<Panel theme={theme}>
					<SectionLabel label="Prerequisites cleared" theme={theme} />
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
						<MetaBadge label="GitHub CLI authenticated" tone="accent" theme={theme} />
						<MetaBadge label="I Have the Build Tools" theme={theme} />
					</div>
					<div style={{ fontSize: 17, lineHeight: 1.45, color: theme.colors.textDim }}>
						`Start Symphony` clears the gate before the issue lands in `Create Symphony Agent`.
					</div>
				</Panel>
			</AnimatedReveal>
			<AnimatedReveal frame={frame} delayFrames={5} durationFrames={16}>
				<Panel theme={theme}>
					<SectionLabel label="Contributing to" theme={theme} />
					<div style={{ fontSize: 30, color: theme.colors.textMain }}>Maestro</div>
					<div style={{ fontSize: 21, color: theme.colors.textDim }}>
						#160: Improved Terminal Experience
					</div>
					<div style={{ fontSize: 17, color: theme.colors.textDim }}>14 Auto Run documents</div>
				</Panel>
			</AnimatedReveal>
			<AnimatedReveal frame={frame} delayFrames={10} durationFrames={18}>
				<Panel theme={theme}>
					<SectionLabel label="Select AI Provider" theme={theme} />
					{PROVIDER_ROWS.map((provider, index) => (
						<AnimatedReveal
							key={provider.label}
							frame={frame}
							index={index}
							delayFrames={14}
							stepFrames={4}
							durationFrames={14}
						>
							<ProviderRow {...provider} theme={theme} />
						</AnimatedReveal>
					))}
				</Panel>
			</AnimatedReveal>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
				<AnimatedReveal frame={frame} delayFrames={18} durationFrames={16}>
					<FieldCard
						label="Session Name"
						value="Symphony: pedramamini/Maestro #160"
						theme={theme}
					/>
				</AnimatedReveal>
				<AnimatedReveal frame={frame} delayFrames={22} durationFrames={16}>
					<FieldCard
						label="Working Directory"
						value="~/Maestro-Symphony/pedramamini-Maestro-160"
						theme={theme}
					/>
				</AnimatedReveal>
			</div>
			<AnimatedReveal frame={frame} delayFrames={28} durationFrames={16}>
				<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
					<ActionButton label="Cancel" theme={theme} tone="neutral" />
					<ActionButton label="Create Agent" theme={theme} />
				</div>
			</AnimatedReveal>
			{fallbackSlots[0] ? <MaestroFallbackSlot slot={fallbackSlots[0]} theme={theme} /> : null}
		</MaestroModalShell>
	);
};

const SetupProofSurface: React.FC<{
	theme: MaestroVisualTheme;
}> = ({ theme }) => {
	const frame = useCurrentFrame();

	return (
		<MaestroModalShell title="Create Symphony Agent" badge="Setup Proof" theme={theme}>
			<div style={{ display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: 16 }}>
				<div style={{ display: 'grid', gap: 14 }}>
					<AnimatedReveal frame={frame} delayFrames={0} durationFrames={16}>
						<Panel theme={theme}>
							<SectionLabel label="Launch Context" theme={theme} />
							<div style={{ fontSize: 28, color: theme.colors.textMain }}>
								Create Agent launches the contribution lane
							</div>
							<div style={{ fontSize: 18, lineHeight: 1.45, color: theme.colors.textDim }}>
								Clone, branch creation, draft PR setup, and Auto Run Docs staging happen before the
								run moves into `Active`.
							</div>
							<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
								<MetaBadge label="Draft PR created" tone="accent" theme={theme} />
								<MetaBadge label="Auto Run Docs staged" theme={theme} />
							</div>
						</Panel>
					</AnimatedReveal>
					<AnimatedReveal frame={frame} delayFrames={6} durationFrames={16}>
						<Panel theme={theme}>
							<SectionLabel label="Setup Milestones" theme={theme} />
							{SETUP_STEPS.map((step, index) => (
								<AnimatedReveal
									key={step.label}
									frame={frame}
									index={index}
									delayFrames={12}
									stepFrames={4}
									durationFrames={14}
								>
									<SetupStepRow step={step} theme={theme} />
								</AnimatedReveal>
							))}
						</Panel>
					</AnimatedReveal>
				</div>
				<div style={{ display: 'grid', gap: 14 }}>
					<AnimatedReveal frame={frame} delayFrames={10} durationFrames={18}>
						<MaestroTerminalBlock title="Setup Pulse" lines={SETUP_TERMINAL_LINES} theme={theme} />
					</AnimatedReveal>
					<AnimatedReveal frame={frame} delayFrames={18} durationFrames={16}>
						<MaestroAnnotationSurface
							title="Check PR Status"
							body="Once the contribution card lands in `Active`, Symphony keeps GitHub state, draft PR status, and review readiness in the same workflow lane."
							theme={theme}
						/>
					</AnimatedReveal>
					<AnimatedReveal frame={frame} delayFrames={24} durationFrames={16}>
						<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
							<ActionButton label="Check PR Status" theme={theme} tone="neutral" />
							<ActionButton label="Create Agent" theme={theme} />
						</div>
					</AnimatedReveal>
				</div>
			</div>
		</MaestroModalShell>
	);
};

const ActiveProofSurface: React.FC<{
	theme: MaestroVisualTheme;
	progress: number;
}> = ({ theme, progress }) => {
	const frame = useCurrentFrame();

	return (
		<MaestroModalShell
			title="Maestro Symphony"
			badge="Active"
			tabs={SYMPHONY_TABS}
			activeTab="Active"
			footer={
				<>
					<span>2 active contributions</span>
					<span>Check PR Status keeps review state current</span>
				</>
			}
			theme={theme}
		>
			<AnimatedReveal frame={frame} delayFrames={0} durationFrames={14}>
				<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
					<Panel theme={theme} padding="14px 18px">
						<div style={{ fontSize: 18, color: theme.colors.textMain }}>
							2 active contribution lanes
						</div>
					</Panel>
					<ActionButton label="Check PR Status" theme={theme} tone="neutral" />
				</div>
			</AnimatedReveal>
			<div style={{ display: 'grid', gridTemplateColumns: '1.18fr 0.82fr', gap: 16 }}>
				<div style={{ display: 'grid', gap: 14 }}>
					{ACTIVE_CONTRIBUTIONS.map((card, index) => (
						<AnimatedReveal
							key={card.issue}
							frame={frame}
							index={index}
							delayFrames={8}
							stepFrames={6}
							durationFrames={16}
						>
							<ContributionCard card={card} progress={index === 0 ? progress : 1} theme={theme} />
						</AnimatedReveal>
					))}
				</div>
				<div style={{ display: 'grid', gap: 14 }}>
					<AnimatedReveal frame={frame} delayFrames={14} durationFrames={16}>
						<div style={statGridStyle}>
							<MaestroStatCard label="Running" value="1" note="Draft PR active" theme={theme} />
							<MaestroStatCard
								label="Ready for Review"
								value="1"
								note="Finalize PR"
								theme={theme}
							/>
							<MaestroStatCard
								label="Tokens"
								value="784K"
								note="Across active runs"
								theme={theme}
							/>
							<MaestroStatCard
								label="Time"
								value="35m"
								note="Visible in product terms"
								theme={theme}
							/>
						</div>
					</AnimatedReveal>
					<AnimatedReveal frame={frame} delayFrames={20} durationFrames={16}>
						<MaestroAnnotationSurface
							title="Ready for Review"
							body="The running lane keeps progress visible while the review-ready lane exposes `Finalize PR` without leaving the Active workflow."
							theme={theme}
						/>
					</AnimatedReveal>
				</div>
			</div>
		</MaestroModalShell>
	);
};

const HistoryStatsSurface: React.FC<{
	theme: MaestroVisualTheme;
}> = ({ theme }) => {
	const frame = useCurrentFrame();

	return (
		<MaestroModalShell
			title="Maestro Symphony"
			badge="Stats"
			tabs={SYMPHONY_TABS}
			activeTab="Stats"
			footer={
				<>
					<span>History and Stats keep contribution proof after Active</span>
					<span>One start click becomes a durable record</span>
				</>
			}
			theme={theme}
		>
			<AnimatedReveal frame={frame} delayFrames={0} durationFrames={14}>
				<div style={statGridStyle}>
					<MaestroStatCard
						label="PRs Created"
						value={getAnimatedMetricValue({
							frame,
							target: 12,
							delayFrames: 2,
							durationFrames: 26,
						})}
						note="History summary"
						theme={theme}
					/>
					<MaestroStatCard
						label="Merged"
						value={getAnimatedMetricValue({
							frame,
							target: 9,
							delayFrames: 6,
							durationFrames: 26,
						})}
						note="Across completed contributions"
						theme={theme}
					/>
					<MaestroStatCard
						label="Tokens Donated"
						value={getAnimatedMetricValue({
							frame,
							target: 8.7,
							suffix: 'M',
							decimals: 1,
							delayFrames: 10,
							durationFrames: 28,
						})}
						note="Worth $184"
						theme={theme}
					/>
					<MaestroStatCard
						label="Time Contributed"
						value={getAnimatedMetricValue({
							frame,
							target: 31,
							suffix: 'h',
							delayFrames: 14,
							durationFrames: 28,
						})}
						note="Streak: 4 weeks"
						theme={theme}
					/>
				</div>
			</AnimatedReveal>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 0.92fr', gap: 16 }}>
				<div style={{ display: 'grid', gap: 14 }}>
					<AnimatedReveal frame={frame} delayFrames={8} durationFrames={16}>
						<Panel theme={theme}>
							<SectionLabel label="History" theme={theme} />
							{HISTORY_ROWS.map((row, index) => (
								<AnimatedReveal
									key={row.title}
									frame={frame}
									index={index}
									delayFrames={14}
									stepFrames={5}
									durationFrames={14}
								>
									<div
										style={{
											display: 'grid',
											gridTemplateColumns: '1fr auto',
											gap: 12,
											padding: '14px 16px',
											borderRadius: 18,
											border: `1px solid ${theme.colors.border}`,
											background: theme.colors.bgMain,
										}}
									>
										<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
											<div style={{ fontSize: 18, color: theme.colors.textMain }}>{row.title}</div>
											<div style={{ fontSize: 16, color: theme.colors.textDim }}>{row.meta}</div>
											<div style={{ fontSize: 15, color: theme.colors.textDim }}>
												{row.documents} • {row.tasks}
											</div>
										</div>
										<MetaBadge
											label={row.status}
											tone={row.status === 'Merged' ? 'accent' : 'neutral'}
											theme={theme}
										/>
									</div>
								</AnimatedReveal>
							))}
						</Panel>
					</AnimatedReveal>
				</div>
				<div style={{ display: 'grid', gap: 14 }}>
					<AnimatedReveal frame={frame} delayFrames={12} durationFrames={16}>
						<Panel theme={theme}>
							<SectionLabel label="Stats" theme={theme} />
							<div style={{ fontSize: 20, lineHeight: 1.45, color: theme.colors.textDim }}>
								Tokens donated, value created, repository spread, and contribution streak stay
								visible even after the run leaves Active.
							</div>
							<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
								<MetaBadge label="Value" tone="accent" theme={theme} />
								<MetaBadge label="Streak" theme={theme} />
								<MetaBadge label="Achievements" theme={theme} />
							</div>
						</Panel>
					</AnimatedReveal>
					<AnimatedReveal frame={frame} delayFrames={18} durationFrames={16}>
						<Panel theme={theme}>
							<SectionLabel label="Achievements" theme={theme} />
							{ACHIEVEMENTS.map((achievement, index) => (
								<AnimatedReveal
									key={achievement.title}
									frame={frame}
									index={index}
									delayFrames={24}
									stepFrames={5}
									durationFrames={14}
								>
									<AchievementBadge {...achievement} theme={theme} />
								</AnimatedReveal>
							))}
						</Panel>
					</AnimatedReveal>
				</div>
			</div>
		</MaestroModalShell>
	);
};

export const getSymphonySceneVariant = (scene: SceneData): SymphonySceneVariant => {
	switch (scene.id) {
		case 'symphony-standalone-issue-detail':
			return 'issue-detail';
		case 'symphony-create-agent-flow':
		case 'symphony-standalone-create-agent':
			return 'create-agent';
		case 'symphony-standalone-setup-proof':
			return 'setup-proof';
		case 'symphony-standalone-active-proof':
			return 'active-proof';
		case 'symphony-standalone-history-stats':
			return 'history-stats';
		case 'symphony-projects-overview':
		case 'symphony-standalone-projects-browse':
		default:
			return 'projects-browse';
	}
};

export const SymphonySurfaceShowcase: React.FC<SymphonySurfaceShowcaseProps> = ({
	scene,
	captures,
	progress,
	theme,
}) => {
	const fallbackSlots = getFallbackSlots(captures);
	const variant = getSymphonySceneVariant(scene);

	switch (variant) {
		case 'issue-detail':
			return <IssueDetailSurface theme={theme} fallbackSlots={fallbackSlots} />;
		case 'create-agent':
			return <CreateAgentSurface theme={theme} fallbackSlots={fallbackSlots} />;
		case 'setup-proof':
			return <SetupProofSurface theme={theme} />;
		case 'active-proof':
			return <ActiveProofSurface theme={theme} progress={progress} />;
		case 'history-stats':
			return <HistoryStatsSurface theme={theme} />;
		case 'projects-browse':
		default:
			return (
				<ProjectsBrowseSurface progress={progress} theme={theme} fallbackSlots={fallbackSlots} />
			);
	}
};
