import type React from 'react';

import type { CaptureManifestEntry, SceneData } from '../data/production-schema';
import {
	AUTO_RUN_DOCUMENTS,
	DIRECTOR_NOTES_STATS,
	MAESTRO_SURFACE_THEMES,
	SYMPHONY_TABS,
	TERMINAL_PLAN_LINES,
	VISUAL_FALLBACK_SLOTS,
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

export const FeatureSurfaceShowcase: React.FC<FeatureSurfaceShowcaseProps> = ({
	scene,
	captures,
}) => {
	const symphonyTheme = MAESTRO_SURFACE_THEMES.symphony;
	const worktreeTheme = MAESTRO_SURFACE_THEMES.worktree;
	const fallbackSlots = captures
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
	const footer = (
		<>
			<span>Arrow keys to navigate • Enter to select</span>
			<span>{captures.length} linked capture inputs</span>
		</>
	);

	if (scene.type === 'title-card') {
		return (
			<MaestroModalShell
				title="Maestro Symphony"
				badge="Live"
				tabs={SYMPHONY_TABS}
				activeTab="Projects"
				footer={footer}
				theme={symphonyTheme}
			>
				<div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 18 }}>
					<MaestroAutoRunDocumentList
						title="Auto Run"
						documents={AUTO_RUN_DOCUMENTS}
						theme={symphonyTheme}
					/>
					<div style={{ display: 'grid', gap: 14 }}>
						<div
							style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}
						>
							{DIRECTOR_NOTES_STATS.map((stat) => (
								<MaestroStatCard
									key={stat.label}
									label={stat.label}
									value={stat.value}
									tone={stat.tone}
									theme={symphonyTheme}
								/>
							))}
						</div>
						<MaestroAnnotationSurface
							title="Director's Notes"
							body="Unified History and AI Overview stay literal here so later phases can replace these shells with exact reconstructions instead of generic dashboard copy."
							theme={symphonyTheme}
						/>
						<MaestroActivityRow
							title="Unified History"
							tag="AI Overview"
							summary="Director's Notes keeps the aggregate timeline, synopsis framing, and agent-first metadata visible while the deeper modal layouts are reconstructed."
							meta="7 days"
							highlighted
							theme={symphonyTheme}
						/>
					</div>
				</div>
			</MaestroModalShell>
		);
	}

	return (
		<MaestroModalShell
			title="Run in Worktree"
			badge="Enabled"
			tabs={['Auto Run', 'Run in Worktree', 'History']}
			activeTab="Run in Worktree"
			footer={footer}
			theme={worktreeTheme}
		>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 0.95fr', gap: 18 }}>
				<div style={{ display: 'grid', gap: 14 }}>
					<MaestroWorktreeControls
						baseBranch="main"
						branchName="autorun-spinout"
						createPROnCompletion
						pathPreview="/Users/jeff/Projects/Maestro-WorkTrees/autorun-spinout"
						theme={worktreeTheme}
					/>
					{fallbackSlots[0] ? (
						<MaestroFallbackSlot slot={fallbackSlots[0]} theme={worktreeTheme} />
					) : (
						<MaestroAnnotationSurface
							title="Fallback Slot"
							body="Any surface that cannot be matched exactly stays explicit as a screenshot or video slot instead of a loose approximation."
							theme={worktreeTheme}
						/>
					)}
				</div>
				<div style={{ display: 'grid', gap: 14 }}>
					<MaestroTerminalBlock
						title={scene.featureName}
						lines={TERMINAL_PLAN_LINES}
						theme={worktreeTheme}
					/>
					{fallbackSlots[1] ? (
						<MaestroFallbackSlot slot={fallbackSlots[1]} theme={worktreeTheme} />
					) : (
						<MaestroAnnotationSurface
							title="Capture Coverage"
							body="This surface is now driven by the scene capture manifest, so later prototype specs can swap in exact screenshot or video references without touching layout code."
							theme={worktreeTheme}
						/>
					)}
				</div>
			</div>
		</MaestroModalShell>
	);
};
