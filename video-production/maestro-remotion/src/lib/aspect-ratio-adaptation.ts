import type {
	FrameDimensions,
	SupportedAspectRatio,
	VideoCompositionMetadata,
	VideoSpec,
} from '../data/production-schema';

export const ASPECT_RATIO_DIMENSIONS = {
	'16:9': {
		width: 1920,
		height: 1080,
	},
	'1:1': {
		width: 1080,
		height: 1080,
	},
	'9:16': {
		width: 1080,
		height: 1920,
	},
} as const satisfies Record<SupportedAspectRatio, FrameDimensions>;

const FRAME_CHROME = {
	'16:9': {
		borderInset: 40,
		contentInset: 72,
	},
	'1:1': {
		borderInset: 32,
		contentInset: 56,
	},
	'9:16': {
		borderInset: 28,
		contentInset: 44,
	},
} as const;

type SceneShellMode = 'split' | 'stacked' | 'portrait';
type SurfacePriority = 'balanced' | 'stage-heavy';

export type SceneShellLayout = {
	aspectRatio: SupportedAspectRatio;
	mode: SceneShellMode;
	noteColumns: 1 | 2;
	supportColumns: 1 | 2;
	frameGap: number;
	contentGap: number;
	sectionGap: number;
	stageGap: number;
	titleFontSize: number;
	bodyFontSize: number;
	headlineMaxWidth: number;
	bodyMaxWidth: number;
	stageMinHeight: number;
	surfacePriority: SurfacePriority;
	compactStoryCards: boolean;
};

type SceneShellOverride = Partial<SceneShellLayout>;

type SceneShellProfileMap = Record<SupportedAspectRatio, SceneShellLayout>;

const BASE_SCENE_LAYOUTS: SceneShellProfileMap = {
	'16:9': {
		aspectRatio: '16:9',
		mode: 'split',
		noteColumns: 2,
		supportColumns: 2,
		frameGap: 28,
		contentGap: 40,
		sectionGap: 18,
		stageGap: 16,
		titleFontSize: 66,
		bodyFontSize: 24,
		headlineMaxWidth: 820,
		bodyMaxWidth: 840,
		stageMinHeight: 0,
		surfacePriority: 'balanced',
		compactStoryCards: true,
	},
	'1:1': {
		aspectRatio: '1:1',
		mode: 'stacked',
		noteColumns: 2,
		supportColumns: 2,
		frameGap: 22,
		contentGap: 24,
		sectionGap: 16,
		stageGap: 14,
		titleFontSize: 54,
		bodyFontSize: 21,
		headlineMaxWidth: 920,
		bodyMaxWidth: 920,
		stageMinHeight: 430,
		surfacePriority: 'stage-heavy',
		compactStoryCards: true,
	},
	'9:16': {
		aspectRatio: '9:16',
		mode: 'portrait',
		noteColumns: 1,
		supportColumns: 1,
		frameGap: 24,
		contentGap: 26,
		sectionGap: 16,
		stageGap: 16,
		titleFontSize: 56,
		bodyFontSize: 22,
		headlineMaxWidth: 900,
		bodyMaxWidth: 920,
		stageMinHeight: 620,
		surfacePriority: 'stage-heavy',
		compactStoryCards: true,
	},
};

const SCENE_LAYOUT_OVERRIDES: Record<
	string,
	{
		default?: Partial<Record<SupportedAspectRatio, SceneShellOverride>>;
		scenes?: Record<string, Partial<Record<SupportedAspectRatio, SceneShellOverride>>>;
	}
> = {
	SymphonyStandalone: {
		scenes: {
			'symphony-standalone-issue-detail': {
				'1:1': {
					stageMinHeight: 470,
				},
				'9:16': {
					stageMinHeight: 680,
				},
			},
			'symphony-standalone-create-agent': {
				'9:16': {
					stageMinHeight: 700,
				},
			},
		},
	},
	DirectorNotesStandalone: {
		default: {
			'1:1': {
				stageMinHeight: 470,
			},
			'9:16': {
				stageMinHeight: 660,
			},
		},
		scenes: {
			'director-notes-standalone-history': {
				'9:16': {
					stageMinHeight: 740,
				},
			},
			'director-notes-standalone-ai-ready': {
				'9:16': {
					stageMinHeight: 710,
				},
			},
		},
	},
	WorktreeSpinOffsStandalone: {
		default: {
			'1:1': {
				stageMinHeight: 450,
			},
			'9:16': {
				stageMinHeight: 650,
			},
		},
		scenes: {
			'worktree-standalone-create-form': {
				'9:16': {
					stageMinHeight: 720,
				},
			},
			'worktree-standalone-pr-intent': {
				'9:16': {
					stageMinHeight: 720,
				},
			},
		},
	},
};

export const inferAspectRatioFromDimensions = (
	width: number,
	height: number
): SupportedAspectRatio => {
	const ratio = width / height;

	if (Math.abs(ratio - 1) < 0.04) {
		return '1:1';
	}

	if (Math.abs(ratio - 9 / 16) < 0.04) {
		return '9:16';
	}

	return '16:9';
};

export const getFrameChrome = (aspectRatio: SupportedAspectRatio) => FRAME_CHROME[aspectRatio];

export const createCompositionId = (baseId: string, aspectRatio: SupportedAspectRatio) => {
	if (aspectRatio === '1:1') {
		return `${baseId}Square`;
	}

	if (aspectRatio === '9:16') {
		return `${baseId}Vertical`;
	}

	return baseId;
};

const getVariantKey = (
	aspectRatio: SupportedAspectRatio
): VideoCompositionMetadata['variantKey'] => {
	if (aspectRatio === '1:1') {
		return '1x1';
	}

	if (aspectRatio === '9:16') {
		return '9x16';
	}

	return '16x9';
};

const getVariantLabel = (aspectRatio: SupportedAspectRatio) => {
	if (aspectRatio === '1:1') {
		return '1:1 square cut';
	}

	if (aspectRatio === '9:16') {
		return '9:16 vertical cut';
	}

	return '16:9 master';
};

const getRatioGuidance = (spec: VideoSpec, aspectRatio: SupportedAspectRatio) => {
	if (aspectRatio === '16:9') {
		return {
			framing: `Use the authored ${spec.dimensions.width}x${spec.dimensions.height} master layout without additional crop restaging.`,
			safeZone:
				'Keep the full authored frame visible so the later square and vertical variants can inherit the same narrative structure.',
		};
	}

	const adaptation = spec.aspectRatioIntent?.adaptations.find(
		(candidate) => candidate.ratio === aspectRatio
	);

	return {
		framing:
			adaptation?.framing ??
			'Restage the scene around the central Maestro controls instead of relying on the wide master shell.',
		safeZone:
			adaptation?.safeZone ??
			'Protect the key control cluster inside the central safe area so the story remains readable without audio.',
	};
};

export const createVideoCompositionMetadata = (
	spec: VideoSpec,
	aspectRatio: SupportedAspectRatio
): VideoCompositionMetadata => {
	const guidance = getRatioGuidance(spec, aspectRatio);

	return {
		compositionId: createCompositionId(spec.id, aspectRatio),
		aspectRatio,
		variantKey: getVariantKey(aspectRatio),
		label: getVariantLabel(aspectRatio),
		dimensions: ASPECT_RATIO_DIMENSIONS[aspectRatio],
		safeArea: {
			top: FRAME_CHROME[aspectRatio].contentInset,
			right: FRAME_CHROME[aspectRatio].contentInset,
			bottom: FRAME_CHROME[aspectRatio].contentInset,
			left: FRAME_CHROME[aspectRatio].contentInset,
		},
		framing: guidance.framing,
		safeZone: guidance.safeZone,
	};
};

export const getStandaloneCompositionMetadata = (spec: VideoSpec) => {
	const supportedRatios = spec.aspectRatioIntent
		? (['16:9', '1:1', '9:16'] as const)
		: (['16:9'] as const);

	return supportedRatios.map((aspectRatio) => createVideoCompositionMetadata(spec, aspectRatio));
};

export const getSceneShellLayout = ({
	specId,
	sceneId,
	aspectRatio,
}: {
	specId: string;
	sceneId: string;
	aspectRatio: SupportedAspectRatio;
}): SceneShellLayout => {
	const baseLayout = BASE_SCENE_LAYOUTS[aspectRatio];
	const overrides = SCENE_LAYOUT_OVERRIDES[specId];
	const defaultOverride = overrides?.default?.[aspectRatio] ?? {};
	const sceneOverride = overrides?.scenes?.[sceneId]?.[aspectRatio] ?? {};

	return {
		...baseLayout,
		...defaultOverride,
		...sceneOverride,
	};
};
