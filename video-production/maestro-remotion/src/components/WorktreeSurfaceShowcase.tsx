import type React from 'react';
import { Img, interpolate } from 'remotion';

import worktreeAutorunReferencePng from '../../capture/docs/worktree/autorun-worktree-reference.png';
import worktreeConfigurationReferencePng from '../../capture/docs/worktree/worktree-configuration-reference.png';
import worktreeInventoryReferencePng from '../../capture/docs/worktree/worktree-inventory-reference.png';
import worktreeTerminalProofJson from '../../capture/derived/worktree/terminal-proof.json';
import worktreeCaptureManifestJson from '../../capture/manifests/worktree/worktree-capture-manifest.json';
import { FeatureCaptureManifestSchema, type CaptureMediaType } from '../data/capture-schema';
import type { CaptureManifestEntry, SceneData } from '../data/production-schema';
import { translateYFromProgress } from '../animations/motion';
import { getDeclaredCaptureAssetPath } from '../lib/capture-pipeline';
import {
	AUTO_RUN_DOCUMENTS,
	createFallbackSlot,
	type MaestroVisualTheme,
	type VisualFallbackSlot,
} from '../lib/maestroVisualSystem';
import {
	MaestroAnnotationSurface,
	MaestroAutoRunDocumentList,
	MaestroFallbackSlot,
	MaestroModalShell,
	MaestroTerminalBlock,
} from '../ui/MaestroPrimitives';
import { MetaBadge } from '../ui/MetaBadge';

type WorktreeSurfaceShowcaseProps = {
	scene: SceneData;
	captures: CaptureManifestEntry[];
	progress: number;
	theme: MaestroVisualTheme;
};

export type WorktreeSceneVariant =
	| 'dispatch-overview'
	| 'toggle-focus'
	| 'create-form'
	| 'pr-intent'
	| 'inventory-proof'
	| 'terminal-proof';

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

const AUTO_RUN_FOLDER = '/Users/pedram/Projects/Maestro/Auto Run Docs';
const WORKTREE_DIRECTORY = '/Users/pedram/Projects/Maestro-WorkTrees';
const WORKTREE_BRANCH = 'autorun-spinout';
const WORKTREE_PATH = `${WORKTREE_DIRECTORY}/${WORKTREE_BRANCH}`;

const TERMINAL_LINES = [
	'$ pwd',
	WORKTREE_PATH,
	'$ git branch --show-current',
	WORKTREE_BRANCH,
	'$ git status --short',
	'working tree clean',
	'$ gh pr create --draft --title "Auto Run: autorun-spinout"',
] as const;

const OPEN_WORKTREES = [
	{
		name: 'christmas-refactor',
		branch: 'christmas-refactor',
		status: 'ready',
		tone: 'success' as const,
	},
	{
		name: 'keyboard-gamification',
		branch: 'keyboard-gamification',
		status: 'ready',
		tone: 'success' as const,
	},
] as const;

const AVAILABLE_WORKTREES = [
	{
		name: 'playbook-marketplace',
		branch: 'playbook-marketplace',
		status: 'scanned',
		tone: 'warning' as const,
	},
	{
		name: 'ssh-tunneling',
		branch: 'ssh-tunneling',
		status: 'scanned',
		tone: 'warning' as const,
	},
] as const;

const proofPoints = worktreeTerminalProofJson.proofPoints;
const worktreeCaptureManifest = FeatureCaptureManifestSchema.parse(worktreeCaptureManifestJson);
const worktreeAssetsById = new Map(
	worktreeCaptureManifest.assets.map((asset) => [asset.id, asset])
);
const worktreeSceneMappingsById = new Map(
	worktreeCaptureManifest.sceneMappings.map((sceneMapping) => [sceneMapping.sceneId, sceneMapping])
);
const WORKTREE_CAPTURE_PREVIEW_URLS = {
	'capture/docs/worktree/autorun-worktree-reference.png': worktreeAutorunReferencePng,
	'capture/docs/worktree/worktree-configuration-reference.png': worktreeConfigurationReferencePng,
	'capture/docs/worktree/worktree-inventory-reference.png': worktreeInventoryReferencePng,
} as const;

type WorktreeCaptureReference = {
	id: string;
	label: string;
	sourcePath: string;
	mediaType: CaptureMediaType;
	reason: string;
	previewUrl?: string;
};

const getWorktreeCaptureMediaLabel = (mediaType: CaptureMediaType) => {
	switch (mediaType) {
		case 'image':
			return 'Captured screenshot';
		case 'video':
			return 'Recorded source';
		case 'audio':
			return 'Audio source';
		case 'data':
		default:
			return 'Derived proof';
	}
};

const getPrototypeFallbackSlots = (captures: CaptureManifestEntry[]): VisualFallbackSlot[] => {
	return captures
		.filter((capture) => capture.mode === 'fallback-slot')
		.map((capture) =>
			createFallbackSlot({
				id: capture.id,
				label: capture.feature,
				sourcePath: capture.sourceRef,
				mediaType: 'screenshot',
				reason: capture.notes,
			})
		);
};

const getStandaloneCaptureReferences = (scene: SceneData): WorktreeCaptureReference[] => {
	const sceneMapping = worktreeSceneMappingsById.get(scene.id);

	if (!sceneMapping) {
		return [];
	}

	return (scene.assetPlaceholderIds ?? []).flatMap((assetId) => {
		const asset = worktreeAssetsById.get(assetId);

		if (!asset) {
			return [];
		}

		const sourcePath = getDeclaredCaptureAssetPath(asset);
		const reasons = [
			...new Set(
				sceneMapping.sources
					.filter((source) => source.fallbackAssetIds.includes(assetId))
					.map((source) => source.notes.trim())
					.filter(Boolean)
			),
		];

		return [
			{
				id: asset.id,
				label: asset.label,
				sourcePath,
				mediaType: asset.mediaType,
				reason: reasons.join(' ') || asset.usage,
				previewUrl:
					sourcePath in WORKTREE_CAPTURE_PREVIEW_URLS
						? WORKTREE_CAPTURE_PREVIEW_URLS[
								sourcePath as keyof typeof WORKTREE_CAPTURE_PREVIEW_URLS
							]
						: undefined,
			},
		];
	});
};

const Panel: React.FC<{
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

const CaptureReferenceCard: React.FC<{
	reference: WorktreeCaptureReference;
	theme: MaestroVisualTheme;
	compact?: boolean;
}> = ({ reference, theme, compact = false }) => {
	return (
		<Panel theme={theme} padding={16} gap={12}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 12,
				}}
			>
				<div style={{ fontSize: compact ? 17 : 19, color: theme.colors.textMain }}>
					{reference.label}
				</div>
				<MetaBadge label={getWorktreeCaptureMediaLabel(reference.mediaType)} theme={theme} />
			</div>
			{reference.previewUrl ? (
				<div
					style={{
						position: 'relative',
						borderRadius: 18,
						border: `1px solid ${theme.colors.border}`,
						overflow: 'hidden',
						background: theme.colors.bgMain,
						aspectRatio: compact ? '2.2 / 1' : '16 / 9',
					}}
				>
					<Img
						src={reference.previewUrl}
						alt={reference.label}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							display: 'block',
						}}
					/>
				</div>
			) : null}
			<div style={{ fontSize: compact ? 15 : 16, lineHeight: 1.45, color: theme.colors.textDim }}>
				{reference.reason}
			</div>
			<div
				style={{
					fontSize: compact ? 14 : 15,
					lineHeight: 1.5,
					color: theme.colors.accentText,
					fontFamily: 'monospace',
					wordBreak: 'break-all',
				}}
			>
				{reference.sourcePath}
			</div>
		</Panel>
	);
};

const WorktreeCaptureEvidence: React.FC<{
	scene: SceneData;
	captures: CaptureManifestEntry[];
	theme: MaestroVisualTheme;
	compact?: boolean;
}> = ({ scene, captures, theme, compact = false }) => {
	const references = getStandaloneCaptureReferences(scene);
	const fallbackSlots = references.length === 0 ? getPrototypeFallbackSlots(captures) : [];

	if (references.length === 0 && fallbackSlots.length === 0) {
		return null;
	}

	return (
		<div style={{ display: 'grid', gap: 12 }}>
			<SectionLabel label="Scene source" theme={theme} />
			{references.length > 0 ? (
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: references.length > 1 ? 'repeat(2, minmax(0, 1fr))' : '1fr',
						gap: 12,
					}}
				>
					{references.map((reference) => (
						<CaptureReferenceCard
							key={reference.id}
							reference={reference}
							theme={theme}
							compact={compact}
						/>
					))}
				</div>
			) : null}
			{fallbackSlots.length > 0 ? (
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: fallbackSlots.length > 1 ? 'repeat(2, minmax(0, 1fr))' : '1fr',
						gap: 12,
					}}
				>
					{fallbackSlots.map((slot) => (
						<MaestroFallbackSlot key={slot.id} slot={slot} theme={theme} />
					))}
				</div>
			) : null}
		</div>
	);
};

const ActionButton: React.FC<{
	label: string;
	theme: MaestroVisualTheme;
	tone?: 'accent' | 'neutral' | 'warning';
}> = ({ label, theme, tone = 'accent' }) => {
	const isAccent = tone === 'accent';
	const isWarning = tone === 'warning';
	const borderColor = isAccent
		? `${theme.colors.accent}88`
		: isWarning
			? `${theme.colors.warning}66`
			: theme.colors.border;
	const background = isAccent
		? theme.colors.accentDim
		: isWarning
			? `${theme.colors.warning}16`
			: theme.colors.bgMain;
	const color = isAccent
		? theme.colors.accentText
		: isWarning
			? theme.colors.warning
			: theme.colors.textMain;

	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '13px 18px',
				borderRadius: 16,
				border: `1px solid ${borderColor}`,
				background,
				color,
				fontSize: 18,
			}}
		>
			{label}
		</div>
	);
};

const StatusBadge: React.FC<{
	label: string;
	tone: 'success' | 'warning';
	theme: MaestroVisualTheme;
}> = ({ label, tone, theme }) => {
	const color = tone === 'success' ? theme.colors.success : theme.colors.warning;

	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '8px 12px',
				borderRadius: 999,
				border: `1px solid ${color}44`,
				background: `${color}18`,
				color,
				fontSize: 15,
				letterSpacing: 0.8,
				textTransform: 'uppercase',
			}}
		>
			{label}
		</div>
	);
};

const FieldCard: React.FC<{
	label: string;
	value: string;
	theme: MaestroVisualTheme;
	highlighted?: boolean;
	monospace?: boolean;
}> = ({ label, value, theme, highlighted = false, monospace = false }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
				padding: '16px 18px',
				borderRadius: 18,
				border: `1px solid ${highlighted ? `${theme.colors.accent}88` : theme.colors.border}`,
				background: highlighted ? `${theme.colors.accent}12` : theme.colors.bgMain,
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
			<div
				style={{
					fontSize: monospace ? 22 : 24,
					color: theme.colors.textMain,
					fontFamily: monospace ? 'monospace' : undefined,
				}}
			>
				{value}
			</div>
		</div>
	);
};

const ToggleIndicator: React.FC<{
	progress: number;
	theme: MaestroVisualTheme;
}> = ({ progress, theme }) => {
	const clampedProgress = Math.max(0, Math.min(1, progress));
	const knobOffset = interpolate(clampedProgress, [0, 1], [4, 32], clamp);
	const enabled = clampedProgress > 0.5;

	return (
		<div
			style={{
				position: 'relative',
				width: 62,
				height: 34,
				borderRadius: 999,
				background: enabled ? theme.colors.success : theme.colors.border,
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 4,
					left: knobOffset,
					width: 26,
					height: 26,
					borderRadius: 999,
					background: '#ffffff',
				}}
			/>
		</div>
	);
};

const CheckboxRow: React.FC<{
	label: string;
	progress: number;
	theme: MaestroVisualTheme;
	highlighted?: boolean;
}> = ({ label, progress, theme, highlighted = false }) => {
	const clampedProgress = Math.max(0, Math.min(1, progress));
	const checked = clampedProgress > 0.55;
	const emphasis = interpolate(clampedProgress, [0, 1], [0, 1], clamp);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 14,
				padding: '6px 0 0',
				color: theme.colors.textDim,
			}}
		>
			<div
				style={{
					width: 28,
					height: 28,
					borderRadius: 10,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					border: `1px solid ${
						checked || highlighted ? `${theme.colors.accent}88` : theme.colors.border
					}`,
					background: checked || highlighted ? theme.colors.accentDim : theme.colors.bgMain,
					color: checked || highlighted ? theme.colors.accentText : theme.colors.textDim,
					fontSize: 18,
					transform: `scale(${interpolate(emphasis, [0, 1], [0.92, 1], clamp)})`,
				}}
			>
				<div
					style={{
						opacity: interpolate(emphasis, [0, 0.4, 1], [0, 0, 1], clamp),
						transform: `translateY(${interpolate(emphasis, [0, 1], [4, 0], clamp)}px)`,
					}}
				>
					✓
				</div>
			</div>
			<div
				style={{
					fontSize: 18,
					color: highlighted || checked ? theme.colors.textMain : theme.colors.textDim,
				}}
			>
				{label}
			</div>
		</div>
	);
};

const AutoRunSetupContextCard: React.FC<{
	theme: MaestroVisualTheme;
}> = ({ theme }) => {
	return (
		<Panel theme={theme}>
			<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
					<SectionLabel label="Change Auto Run Folder" theme={theme} />
					<div style={{ fontSize: 18, lineHeight: 1.4, color: theme.colors.textMain }}>
						Auto Run keeps the markdown queue on the parent agent while execution can branch into a
						separate worktree lane.
					</div>
				</div>
				<MetaBadge label="5 markdown documents" tone="accent" theme={theme} />
			</div>

			<FieldCard label="Auto Run Folder" value={AUTO_RUN_FOLDER} monospace theme={theme} />

			<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
				<ActionButton label="Select Auto Run Folder" theme={theme} tone="neutral" />
				<ActionButton label="Continue" theme={theme} />
			</div>
		</Panel>
	);
};

const WorktreeRunPanel: React.FC<{
	variant: Exclude<WorktreeSceneVariant, 'inventory-proof' | 'terminal-proof'>;
	theme: MaestroVisualTheme;
	progress: number;
}> = ({ variant, theme, progress }) => {
	const toggleProgress =
		variant === 'dispatch-overview' ? 0 : variant === 'toggle-focus' ? progress : 1;
	const formProgress =
		variant === 'dispatch-overview'
			? 0
			: variant === 'toggle-focus'
				? interpolate(progress, [0.28, 0.92], [0, 1], clamp)
				: 1;
	const reviewProgress = variant === 'pr-intent' ? progress : 0;
	const isExpanded = toggleProgress > 0.12;
	const isEnabled = toggleProgress > 0.5;
	const showCreateForm =
		variant === 'create-form' || variant === 'pr-intent' || variant === 'toggle-focus';
	const showReviewPath = variant === 'pr-intent';

	return (
		<Panel theme={theme} gap={16}>
			<div
				style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
			>
				<SectionLabel label="Run in Worktree" theme={theme} />
				<MetaBadge
					label={isEnabled ? 'Enabled' : 'Off'}
					tone={isEnabled ? 'accent' : 'neutral'}
					theme={theme}
				/>
			</div>

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 14,
					padding: '18px 20px',
					borderRadius: 20,
					border: `1px solid ${isExpanded ? `${theme.colors.accent}55` : theme.colors.border}`,
					background: isExpanded ? `${theme.colors.accent}10` : theme.colors.bgMain,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 14,
						padding: '14px 16px',
						borderRadius: 18,
						border: `1px solid ${
							variant === 'toggle-focus' ? `${theme.colors.accent}88` : theme.colors.border
						}`,
						background:
							variant === 'toggle-focus' ? theme.colors.accentDim : `${theme.colors.bgMain}`,
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
						<div style={{ fontSize: 22, color: theme.colors.textMain }}>
							Dispatch to a separate worktree
						</div>
						<div style={{ fontSize: 16, color: theme.colors.textDim }}>
							Run the selected Auto Run documents away from the parent checkout.
						</div>
					</div>
					<ToggleIndicator progress={toggleProgress} theme={theme} />
				</div>

				{isExpanded ? (
					<div
						style={{
							display: 'grid',
							gap: 14,
							opacity: formProgress,
							transform: `translateY(${translateYFromProgress(formProgress, 20, 0)}px)`,
						}}
					>
						<FieldCard
							label="Create New Worktree"
							value="Create New Worktree"
							highlighted={variant === 'toggle-focus'}
							theme={theme}
						/>
						{showCreateForm ? (
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
									gap: 12,
								}}
							>
								<FieldCard
									label="Base Branch"
									value="main"
									highlighted={variant === 'create-form'}
									theme={theme}
								/>
								<FieldCard
									label="Worktree Branch Name"
									value={WORKTREE_BRANCH}
									highlighted={variant === 'create-form' || variant === 'pr-intent'}
									theme={theme}
								/>
							</div>
						) : null}
						<div style={{ fontSize: 17, color: theme.colors.textDim, fontFamily: 'monospace' }}>
							{WORKTREE_PATH}
						</div>
						<CheckboxRow
							label="Automatically create PR when complete"
							progress={reviewProgress}
							highlighted={variant === 'pr-intent'}
							theme={theme}
						/>
					</div>
				) : (
					<Panel theme={theme} padding={16} gap={10}>
						<div style={{ fontSize: 19, color: theme.colors.textMain }}>Current checkout</div>
						<div style={{ fontSize: 17, lineHeight: 1.45, color: theme.colors.textDim }}>
							Manual edits and review work already sit on the active branch, so long Auto Run
							execution would compete for the same lane.
						</div>
					</Panel>
				)}
			</div>

			{showReviewPath ? (
				<Panel theme={theme} padding={16} gap={12}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 12,
						}}
					>
						<div style={{ fontSize: 20, color: theme.colors.textMain }}>Review path</div>
						<MetaBadge label="Review ready" tone="accent" theme={theme} />
					</div>
					<div style={{ fontSize: 17, lineHeight: 1.45, color: theme.colors.textDim }}>
						Branch, path, and PR intent are visible before launch, so the handoff stays attached to
						the isolated lane instead of the parent checkout.
					</div>
					<div style={{ display: 'flex', gap: 10 }}>
						<ActionButton label="Create Pull Request" theme={theme} />
						<ActionButton label="Open in Maestro" theme={theme} tone="neutral" />
					</div>
				</Panel>
			) : null}
		</Panel>
	);
};

const InventoryList: React.FC<{
	title: string;
	rows: readonly {
		name: string;
		branch: string;
		status: string;
		tone: 'success' | 'warning';
	}[];
	theme: MaestroVisualTheme;
	progress: number;
}> = ({ title, rows, theme, progress }) => {
	const visibleRows = Math.max(
		1,
		Math.min(rows.length, Math.round(interpolate(progress, [0, 1], [1, rows.length], clamp)))
	);

	return (
		<Panel theme={theme} padding={16} gap={10}>
			<div
				style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
			>
				<div style={{ fontSize: 19, color: theme.colors.textMain }}>{title}</div>
				<MetaBadge label={`${rows.length}`} theme={theme} />
			</div>
			{rows.slice(0, visibleRows).map((row) => (
				<div
					key={`${title}-${row.name}`}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 12,
						padding: '12px 14px',
						borderRadius: 16,
						border: `1px solid ${theme.colors.border}`,
						background: theme.colors.bgMain,
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
						<div style={{ fontSize: 18, color: theme.colors.textMain }}>{row.name}</div>
						<div style={{ fontSize: 15, color: theme.colors.textDim }}>{row.branch}</div>
					</div>
					<StatusBadge label={row.status} tone={row.tone} theme={theme} />
				</div>
			))}
		</Panel>
	);
};

const WorktreeInventorySurface: React.FC<{
	theme: MaestroVisualTheme;
	progress: number;
	captureEvidence: React.ReactNode;
}> = ({ theme, progress, captureEvidence }) => {
	return (
		<MaestroModalShell
			title="Worktree Configuration"
			badge="Tracked destinations"
			theme={theme}
			footer={
				<>
					<span>Parent agent keeps the Auto Run documents.</span>
					<span>Each worktree keeps its own branch and directory.</span>
				</>
			}
		>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 0.96fr', gap: 16 }}>
				<div style={{ display: 'grid', gap: 14 }}>
					<InventoryList
						title="Open in Maestro"
						rows={OPEN_WORKTREES}
						theme={theme}
						progress={progress}
					/>
					<InventoryList
						title="Available Worktrees"
						rows={AVAILABLE_WORKTREES}
						theme={theme}
						progress={progress}
					/>
				</div>
				<div style={{ display: 'grid', gap: 14 }}>
					<Panel theme={theme}>
						<FieldCard
							label="Worktree Directory"
							value={WORKTREE_DIRECTORY}
							monospace
							theme={theme}
						/>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								gap: 14,
								padding: '16px 18px',
								borderRadius: 18,
								border: `1px solid ${theme.colors.border}`,
								background: theme.colors.bgMain,
							}}
						>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
								<div style={{ fontSize: 22, color: theme.colors.textMain }}>
									Watch for new worktrees
								</div>
								<div style={{ fontSize: 16, color: theme.colors.textDim }}>
									Auto-detect worktrees created outside Maestro
								</div>
							</div>
							<ToggleIndicator progress={1} theme={theme} />
						</div>
						<div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
							<FieldCard label="Create New Worktree" value="feature-xyz" theme={theme} />
							<ActionButton label="+ Create" theme={theme} />
						</div>
					</Panel>
					<MaestroAnnotationSurface
						title="Inventory proof"
						body="Open and scanned worktrees stay visible as real Maestro destinations, so the isolated lane reads as an operational branch path instead of a promise."
						theme={theme}
					/>
					{captureEvidence}
				</div>
			</div>
		</MaestroModalShell>
	);
};

const TerminalOutcomeSurface: React.FC<{
	theme: MaestroVisualTheme;
	progress: number;
	captureEvidence: React.ReactNode;
}> = ({ theme, progress, captureEvidence }) => {
	const visibleProofPoints = Math.max(
		2,
		Math.min(
			proofPoints.length,
			Math.round(interpolate(progress, [0, 1], [2, proofPoints.length], clamp))
		)
	);

	return (
		<MaestroModalShell
			title="Run in Worktree"
			badge="Parallel ready"
			theme={theme}
			footer={
				<>
					<span>Parent checkout stays clean.</span>
					<span>Review path stays attached to the worktree lane.</span>
				</>
			}
		>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 0.96fr', gap: 16 }}>
				<div style={{ display: 'grid', gap: 14 }}>
					<MaestroTerminalBlock title="Isolated execution" lines={TERMINAL_LINES} theme={theme} />
					<MaestroAnnotationSurface
						title="Auto Run outcome"
						body="The run executes in the isolated directory while the parent checkout remains free for manual work or other review flows."
						theme={theme}
					/>
				</div>
				<div style={{ display: 'grid', gap: 14 }}>
					<Panel theme={theme}>
						<div
							style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}
						>
							<FieldCard label="Parent checkout" value="feature/terminal-refresh" theme={theme} />
							<FieldCard label="Worktree Branch Name" value={WORKTREE_BRANCH} theme={theme} />
						</div>
						<FieldCard
							label="Separate worktree path"
							value={WORKTREE_PATH}
							monospace
							theme={theme}
						/>
						<div style={{ display: 'flex', gap: 10 }}>
							<ActionButton label="Create Pull Request" theme={theme} />
							<ActionButton label="Open in Maestro" theme={theme} tone="neutral" />
						</div>
					</Panel>
					<Panel theme={theme} padding={16} gap={10}>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								gap: 12,
							}}
						>
							<div style={{ fontSize: 20, color: theme.colors.textMain }}>Proof points</div>
							<MetaBadge label={worktreeTerminalProofJson.title} tone="accent" theme={theme} />
						</div>
						{proofPoints.slice(0, visibleProofPoints).map((point) => (
							<div
								key={point}
								style={{
									display: 'grid',
									gridTemplateColumns: 'auto 1fr',
									gap: 10,
									alignItems: 'center',
									fontSize: 17,
									color: theme.colors.textMain,
								}}
							>
								<div style={{ color: theme.colors.success }}>✓</div>
								<div>{point}</div>
							</div>
						))}
					</Panel>
					{captureEvidence}
				</div>
			</div>
		</MaestroModalShell>
	);
};

const DispatchStorySurface: React.FC<{
	variant: Exclude<WorktreeSceneVariant, 'inventory-proof' | 'terminal-proof'>;
	theme: MaestroVisualTheme;
	captureEvidence: React.ReactNode;
	progress: number;
}> = ({ variant, theme, captureEvidence, progress }) => {
	const summaryBody =
		variant === 'dispatch-overview'
			? 'The worktree lane is available inside Auto Run before the parent checkout becomes the only place long-running automation can land.'
			: variant === 'toggle-focus'
				? 'Enable the toggle and Maestro immediately pivots into the create-new worktree flow inside the same launch surface.'
				: variant === 'create-form'
					? 'Base branch, generated worktree branch name, and path preview stay readable together so the isolation step feels native and concrete.'
					: 'The optional PR handoff stays visible before launch, so the review path is attached to the isolated lane from the start.';

	return (
		<MaestroModalShell
			title="Auto Run"
			badge="Git-backed session"
			theme={theme}
			footer={
				<>
					<span>Parent agent keeps ownership of the Auto Run docs.</span>
					<span>Dispatch is optional on every run.</span>
				</>
			}
		>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 0.96fr', gap: 16 }}>
				<div style={{ display: 'grid', gap: 14 }}>
					<AutoRunSetupContextCard theme={theme} />
					<MaestroAutoRunDocumentList
						title="Auto Run"
						documents={AUTO_RUN_DOCUMENTS}
						summaryPillLabel="20 tasks"
						theme={theme}
					/>
					<MaestroAnnotationSurface title="Auto Run context" body={summaryBody} theme={theme} />
				</div>
				<div style={{ display: 'grid', gap: 14 }}>
					<WorktreeRunPanel variant={variant} theme={theme} progress={progress} />
					{captureEvidence}
				</div>
			</div>
		</MaestroModalShell>
	);
};

export const getWorktreeSceneVariant = (scene: SceneData): WorktreeSceneVariant => {
	switch (scene.id) {
		case 'worktree-dispatch-overview':
			return 'create-form';
		case 'worktree-follow-through':
			return 'terminal-proof';
		case 'worktree-standalone-risk':
			return 'dispatch-overview';
		case 'worktree-standalone-toggle':
			return 'toggle-focus';
		case 'worktree-standalone-create-form':
			return 'create-form';
		case 'worktree-standalone-pr-intent':
			return 'pr-intent';
		case 'worktree-standalone-inventory':
			return 'inventory-proof';
		case 'worktree-standalone-terminal-proof':
		default:
			return 'terminal-proof';
	}
};

export const WorktreeSurfaceShowcase: React.FC<WorktreeSurfaceShowcaseProps> = ({
	scene,
	captures,
	progress,
	theme,
}) => {
	const variant = getWorktreeSceneVariant(scene);
	const captureEvidence = (
		<WorktreeCaptureEvidence scene={scene} captures={captures} theme={theme} compact />
	);
	let surface: React.ReactElement;

	switch (variant) {
		case 'dispatch-overview':
		case 'toggle-focus':
		case 'create-form':
		case 'pr-intent':
			surface = (
				<DispatchStorySurface
					variant={variant}
					theme={theme}
					captureEvidence={captureEvidence}
					progress={progress}
				/>
			);
			break;
		case 'inventory-proof':
			surface = (
				<WorktreeInventorySurface
					theme={theme}
					progress={progress}
					captureEvidence={captureEvidence}
				/>
			);
			break;
		case 'terminal-proof':
		default:
			surface = (
				<TerminalOutcomeSurface
					theme={theme}
					progress={progress}
					captureEvidence={captureEvidence}
				/>
			);
			break;
	}

	return surface;
};
