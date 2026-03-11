import { Easing, interpolate } from 'remotion';

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

export const DIRECTOR_NOTES_FLOW_STAGES = [
	'Fragmentation',
	'Visibility',
	'Actionability',
	'Warmup',
	'Synthesis',
	'Check-In',
] as const;

export type DirectorNotesFlowStage = (typeof DIRECTOR_NOTES_FLOW_STAGES)[number];

export type DirectorNotesStagePose = {
	translateX: number;
	translateY: number;
	scale: number;
	rotate: number;
	focusOpacity: number;
	glowOpacity: number;
	vignetteOpacity: number;
};

export type DirectorNotesFocusFrame = {
	x: number;
	y: number;
	width: number;
	height: number;
	opacity: number;
	label: string;
};

export type DirectorNotesCursorPose = {
	x: number;
	y: number;
	scale: number;
	opacity: number;
	haloScale: number;
	pressed: boolean;
	visible: boolean;
	hint: string;
};

export type DirectorNotesHistorySceneState = {
	searchQuery: string;
	autoActive: boolean;
	userActive: boolean;
	countLabel: string;
	highlightedIndex: number;
	statsMode: 'global' | 'filtered';
	rowsMode: 'global' | 'filtered';
	showResumeCue: boolean;
};

export type DirectorNotesAiReadySceneState = {
	activeTab: 'history' | 'ai-overview';
	tabSwitchProgress: number;
	summaryProgress: number;
};

export type DirectorNotesHandoffState = {
	nextStage: DirectorNotesFlowStage;
	nextLabel: string;
	nextCue: string;
};

type DirectorNotesStagePreset = {
	translateX: readonly number[];
	translateY: readonly number[];
	scale: readonly number[];
	rotate: readonly number[];
	focusOpacity: readonly number[];
	glowOpacity: readonly number[];
	vignetteOpacity: readonly number[];
};

type DirectorNotesFocusPreset = {
	x: readonly number[];
	y: readonly number[];
	width: readonly number[];
	height: readonly number[];
	opacity: readonly number[];
	label: string;
};

type DirectorNotesCursorPreset = {
	x: readonly number[];
	y: readonly number[];
	opacity: readonly number[];
	scale: readonly number[];
	pressedWindows?: ReadonlyArray<readonly [number, number]>;
	hint: string;
};

const STAGE_KEYFRAMES = [0, 0.38, 0.74, 1] as const;
const FOCUS_KEYFRAMES = [0, 0.34, 0.7, 1] as const;

const getNormalizedProgress = (frame: number, durationInFrames: number) => {
	return interpolate(frame, [0, Math.max(durationInFrames - 1, 1)], [0, 1], {
		...clamp,
		easing: Easing.inOut(Easing.cubic),
	});
};

const interpolateKeyframes = (
	progress: number,
	values: readonly number[],
	keyframes: readonly number[] = STAGE_KEYFRAMES
) => {
	return interpolate(progress, keyframes, values, {
		...clamp,
		easing: Easing.inOut(Easing.cubic),
	});
};

const getStagePreset = (sceneId: string): DirectorNotesStagePreset => {
	switch (sceneId) {
		case 'director-notes-standalone-history':
			return {
				translateX: [52, 28, -12, -34],
				translateY: [26, 12, 4, -8],
				scale: [0.92, 0.98, 1.03, 1.05],
				rotate: [-0.56, -0.2, -0.06, 0],
				focusOpacity: [0.2, 0.42, 0.62, 0.68],
				glowOpacity: [0.16, 0.22, 0.28, 0.32],
				vignetteOpacity: [0.2, 0.24, 0.28, 0.3],
			};
		case 'director-notes-standalone-detail':
			return {
				translateX: [76, 36, 10, -2],
				translateY: [32, 16, 4, -10],
				scale: [0.9, 0.99, 1.08, 1.12],
				rotate: [-0.72, -0.28, -0.08, 0],
				focusOpacity: [0.28, 0.48, 0.72, 0.76],
				glowOpacity: [0.18, 0.24, 0.34, 0.38],
				vignetteOpacity: [0.22, 0.26, 0.3, 0.34],
			};
		case 'director-notes-standalone-ai-loading':
			return {
				translateX: [-12, 4, 22, 36],
				translateY: [18, 8, 0, -4],
				scale: [0.97, 0.99, 1.02, 1.05],
				rotate: [-0.28, -0.1, -0.04, 0],
				focusOpacity: [0.18, 0.34, 0.58, 0.68],
				glowOpacity: [0.16, 0.2, 0.28, 0.34],
				vignetteOpacity: [0.18, 0.24, 0.3, 0.34],
			};
		case 'director-notes-standalone-ai-ready':
			return {
				translateX: [26, 14, 6, 0],
				translateY: [16, 8, 2, 0],
				scale: [0.96, 0.99, 1.01, 1.01],
				rotate: [-0.24, -0.08, -0.02, 0],
				focusOpacity: [0.24, 0.42, 0.6, 0.66],
				glowOpacity: [0.18, 0.22, 0.28, 0.32],
				vignetteOpacity: [0.18, 0.2, 0.22, 0.24],
			};
		case 'director-notes-standalone-close':
			return {
				translateX: [12, 6, 0, 0],
				translateY: [8, 4, 0, 0],
				scale: [1.01, 1.02, 1.01, 1],
				rotate: [-0.12, -0.04, 0, 0],
				focusOpacity: [0.2, 0.28, 0.36, 0.42],
				glowOpacity: [0.2, 0.26, 0.34, 0.38],
				vignetteOpacity: [0.22, 0.24, 0.28, 0.3],
			};
		case 'director-notes-standalone-open':
		default:
			return {
				translateX: [88, 48, 16, 0],
				translateY: [42, 20, 8, 0],
				scale: [0.82, 0.9, 0.97, 1.02],
				rotate: [-1.12, -0.44, -0.08, 0],
				focusOpacity: [0.1, 0.24, 0.42, 0.5],
				glowOpacity: [0.14, 0.18, 0.22, 0.26],
				vignetteOpacity: [0.3, 0.34, 0.36, 0.38],
			};
	}
};

const getFocusPreset = (sceneId: string): DirectorNotesFocusPreset => {
	switch (sceneId) {
		case 'director-notes-standalone-history':
			return {
				x: [0.28, 0.32, 0.56, 0.34],
				y: [0.16, 0.16, 0.16, 0.56],
				width: [0.36, 0.36, 0.46, 0.86],
				height: [0.16, 0.16, 0.18, 0.18],
				opacity: [0.2, 0.54, 0.76, 0.72],
				label: 'Filter and search the timeline',
			};
		case 'director-notes-standalone-detail':
			return {
				x: [0.34, 0.34, 0.54, 0.68],
				y: [0.58, 0.58, 0.34, 0.22],
				width: [0.84, 0.84, 0.72, 0.54],
				height: [0.18, 0.18, 0.58, 0.28],
				opacity: [0.24, 0.54, 0.82, 0.82],
				label: 'Open detail and jump back',
			};
		case 'director-notes-standalone-ai-loading':
			return {
				x: [0.32, 0.72, 0.78, 0.78],
				y: [0.56, 0.14, 0.34, 0.42],
				width: [0.78, 0.28, 0.44, 0.44],
				height: [0.18, 0.12, 0.34, 0.42],
				opacity: [0.18, 0.48, 0.74, 0.78],
				label: 'AI Overview warms in the background',
			};
		case 'director-notes-standalone-ai-ready':
			return {
				x: [0.52, 0.55, 0.58, 0.6],
				y: [0.14, 0.14, 0.44, 0.68],
				width: [0.86, 0.86, 0.84, 0.84],
				height: [0.14, 0.14, 0.32, 0.3],
				opacity: [0.22, 0.5, 0.72, 0.76],
				label: 'Summary builds with controls intact',
			};
		case 'director-notes-standalone-close':
			return {
				x: [0.5, 0.5, 0.5, 0.5],
				y: [0.5, 0.5, 0.5, 0.5],
				width: [0.84, 0.88, 0.9, 0.92],
				height: [0.68, 0.7, 0.72, 0.74],
				opacity: [0.16, 0.26, 0.34, 0.4],
				label: 'Evidence first, synthesis second',
			};
		case 'director-notes-standalone-open':
			return {
				x: [0.52, 0.54, 0.56, 0.56],
				y: [0.18, 0.18, 0.18, 0.18],
				width: [0.62, 0.7, 0.78, 0.82],
				height: [0.16, 0.16, 0.18, 0.18],
				opacity: [0.12, 0.26, 0.42, 0.48],
				label: 'Help, Unified History, AI Overview',
			};
		default:
			return {
				x: [0.5, 0.5, 0.5, 0.5],
				y: [0.5, 0.5, 0.5, 0.5],
				width: [0.8, 0.8, 0.8, 0.8],
				height: [0.6, 0.6, 0.6, 0.6],
				opacity: [0.16, 0.24, 0.32, 0.36],
				label: 'Director Notes surface',
			};
	}
};

const getCursorPreset = (sceneId: string): DirectorNotesCursorPreset | null => {
	switch (sceneId) {
		case 'director-notes-standalone-history':
			return {
				x: [0.1, 0.14, 0.26, 0.42],
				y: [0.16, 0.16, 0.16, 0.16],
				opacity: [0, 0.9, 1, 0.84],
				scale: [0.92, 1.02, 1.04, 1],
				pressedWindows: [
					[0.18, 0.24],
					[0.56, 0.64],
				],
				hint: 'Filter to RSSidian',
			};
		case 'director-notes-standalone-detail':
			return {
				x: [0.24, 0.28, 0.62, 0.78],
				y: [0.56, 0.56, 0.24, 0.24],
				opacity: [0, 0.94, 1, 0.78],
				scale: [0.92, 1.02, 1.06, 1],
				pressedWindows: [
					[0.22, 0.28],
					[0.76, 0.84],
				],
				hint: 'Resume Session',
			};
		case 'director-notes-standalone-ai-ready':
			return {
				x: [0.26, 0.26, 0.74, 0.88],
				y: [0.08, 0.08, 0.12, 0.12],
				opacity: [0.16, 0.94, 0.88, 0],
				scale: [0.94, 1.04, 1.02, 0.94],
				pressedWindows: [[0.16, 0.24]],
				hint: 'Open AI Overview',
			};
		default:
			return null;
	}
};

export const getDirectorNotesHistorySceneState = (
	progress: number
): DirectorNotesHistorySceneState => {
	const normalizedProgress = Math.max(0, Math.min(progress, 1));

	if (normalizedProgress < 0.18) {
		return {
			searchQuery: '',
			autoActive: true,
			userActive: true,
			countLabel: '100/357',
			highlightedIndex: 2,
			statsMode: 'global',
			rowsMode: 'global',
			showResumeCue: false,
		};
	}

	if (normalizedProgress < 0.36) {
		return {
			searchQuery: 'r',
			autoActive: true,
			userActive: true,
			countLabel: '23 matching entries',
			highlightedIndex: 2,
			statsMode: 'global',
			rowsMode: 'global',
			showResumeCue: false,
		};
	}

	if (normalizedProgress < 0.58) {
		return {
			searchQuery: 'rs',
			autoActive: false,
			userActive: true,
			countLabel: '11 matching entries',
			highlightedIndex: 3,
			statsMode: 'filtered',
			rowsMode: 'filtered',
			showResumeCue: true,
		};
	}

	return {
		searchQuery: 'rss',
		autoActive: false,
		userActive: true,
		countLabel: '7 matching entries',
		highlightedIndex: 4,
		statsMode: 'filtered',
		rowsMode: 'filtered',
		showResumeCue: true,
	};
};

export const getDirectorNotesAiReadySceneState = (
	progress: number
): DirectorNotesAiReadySceneState => {
	const normalizedProgress = Math.max(0, Math.min(progress, 1));
	const tabSwitchProgress = interpolate(normalizedProgress, [0.08, 0.28], [0, 1], clamp);
	const activeTab = tabSwitchProgress >= 0.5 ? 'ai-overview' : 'history';
	const summaryProgress = interpolate(normalizedProgress, [0.22, 1], [0, 1], clamp);

	return {
		activeTab,
		tabSwitchProgress,
		summaryProgress,
	};
};

export const getDirectorNotesHandoffState = (
	nextScene: {
		id: string;
		accentLabel: string;
		storyboard?: { onScreenCopy?: string[] };
	} | null
): DirectorNotesHandoffState | null => {
	if (!nextScene) {
		return null;
	}

	return {
		nextStage: getDirectorNotesFlowStage(nextScene.id),
		nextLabel: nextScene.accentLabel,
		nextCue: nextScene.storyboard?.onScreenCopy?.[0] ?? nextScene.accentLabel,
	};
};

export const getDirectorNotesFlowStage = (sceneId: string): DirectorNotesFlowStage => {
	switch (sceneId) {
		case 'director-notes-standalone-history':
			return 'Visibility';
		case 'director-notes-standalone-detail':
			return 'Actionability';
		case 'director-notes-standalone-ai-loading':
			return 'Warmup';
		case 'director-notes-standalone-ai-ready':
			return 'Synthesis';
		case 'director-notes-standalone-close':
			return 'Check-In';
		case 'director-notes-standalone-open':
		default:
			return 'Fragmentation';
	}
};

export const getDirectorNotesStagePose = (
	sceneId: string,
	frame: number,
	durationInFrames: number
): DirectorNotesStagePose => {
	const progress = getNormalizedProgress(frame, durationInFrames);
	const preset = getStagePreset(sceneId);

	return {
		translateX: interpolateKeyframes(progress, preset.translateX),
		translateY: interpolateKeyframes(progress, preset.translateY),
		scale: interpolateKeyframes(progress, preset.scale),
		rotate: interpolateKeyframes(progress, preset.rotate),
		focusOpacity: interpolateKeyframes(progress, preset.focusOpacity),
		glowOpacity: interpolateKeyframes(progress, preset.glowOpacity),
		vignetteOpacity: interpolateKeyframes(progress, preset.vignetteOpacity),
	};
};

export const getDirectorNotesFocusFrame = (
	sceneId: string,
	frame: number,
	durationInFrames: number
): DirectorNotesFocusFrame => {
	const progress = getNormalizedProgress(frame, durationInFrames);
	const preset = getFocusPreset(sceneId);

	return {
		x: interpolateKeyframes(progress, preset.x, FOCUS_KEYFRAMES),
		y: interpolateKeyframes(progress, preset.y, FOCUS_KEYFRAMES),
		width: interpolateKeyframes(progress, preset.width, FOCUS_KEYFRAMES),
		height: interpolateKeyframes(progress, preset.height, FOCUS_KEYFRAMES),
		opacity: interpolateKeyframes(progress, preset.opacity, FOCUS_KEYFRAMES),
		label: preset.label,
	};
};

export const getDirectorNotesCursorPose = (
	sceneId: string,
	frame: number,
	durationInFrames: number
): DirectorNotesCursorPose => {
	const preset = getCursorPreset(sceneId);

	if (!preset) {
		return {
			x: 0.5,
			y: 0.5,
			scale: 1,
			opacity: 0,
			haloScale: 1,
			pressed: false,
			visible: false,
			hint: '',
		};
	}

	const progress = getNormalizedProgress(frame, durationInFrames);
	const opacity = interpolateKeyframes(progress, preset.opacity);
	const pulse = interpolate(frame % 42, [0, 18, 41], [1, 1.18, 1], clamp);
	const pressed =
		preset.pressedWindows?.some(([start, end]) => progress >= start && progress <= end) ?? false;

	return {
		x: interpolateKeyframes(progress, preset.x),
		y: interpolateKeyframes(progress, preset.y),
		scale: interpolateKeyframes(progress, preset.scale),
		opacity,
		haloScale: pulse,
		pressed,
		visible: opacity > 0.08,
		hint: preset.hint,
	};
};
