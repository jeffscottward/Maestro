import { Easing, interpolate } from 'remotion';

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

export const WORKTREE_FLOW_STAGES = ['Risk', 'Toggle', 'Branch', 'Inventory', 'Proof'] as const;

export type WorktreeFlowStage = (typeof WORKTREE_FLOW_STAGES)[number];

export type WorktreeStagePose = {
	translateX: number;
	translateY: number;
	scale: number;
	rotate: number;
	glowOpacity: number;
	vignetteOpacity: number;
};

export type WorktreeFocusFrame = {
	x: number;
	y: number;
	width: number;
	height: number;
	opacity: number;
	label: string;
};

export type WorktreeCursorPose = {
	x: number;
	y: number;
	scale: number;
	opacity: number;
	haloScale: number;
	pressed: boolean;
	visible: boolean;
	hint: string;
};

type WorktreeStagePreset = {
	translateX: readonly number[];
	translateY: readonly number[];
	scale: readonly number[];
	rotate: readonly number[];
	glowOpacity: readonly number[];
	vignetteOpacity: readonly number[];
};

type WorktreeFocusPreset = {
	x: readonly number[];
	y: readonly number[];
	width: readonly number[];
	height: readonly number[];
	opacity: readonly number[];
	label: string;
};

type WorktreeCursorPreset = {
	x: readonly number[];
	y: readonly number[];
	opacity: readonly number[];
	scale: readonly number[];
	pressedWindows?: ReadonlyArray<readonly [number, number]>;
	hint: string;
};

const STAGE_KEYFRAMES = [0, 0.36, 0.72, 1] as const;
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

const getStagePreset = (sceneId: string): WorktreeStagePreset => {
	switch (sceneId) {
		case 'worktree-standalone-toggle':
			return {
				translateX: [54, 22, -10, -18],
				translateY: [24, 10, -6, -12],
				scale: [0.92, 1, 1.05, 1.08],
				rotate: [-0.66, -0.24, -0.06, 0],
				glowOpacity: [0.16, 0.26, 0.34, 0.38],
				vignetteOpacity: [0.2, 0.24, 0.3, 0.34],
			};
		case 'worktree-standalone-create-form':
			return {
				translateX: [72, 30, 8, -4],
				translateY: [34, 14, 0, -8],
				scale: [0.88, 0.98, 1.08, 1.12],
				rotate: [-0.84, -0.3, -0.08, 0],
				glowOpacity: [0.18, 0.28, 0.4, 0.44],
				vignetteOpacity: [0.22, 0.28, 0.34, 0.38],
			};
		case 'worktree-standalone-pr-intent':
			return {
				translateX: [44, 20, -6, -10],
				translateY: [24, 10, -4, -8],
				scale: [0.94, 1, 1.06, 1.09],
				rotate: [-0.46, -0.18, -0.04, 0],
				glowOpacity: [0.18, 0.28, 0.38, 0.42],
				vignetteOpacity: [0.2, 0.24, 0.3, 0.34],
			};
		case 'worktree-standalone-inventory':
			return {
				translateX: [34, 12, -4, 0],
				translateY: [18, 8, 0, 0],
				scale: [0.95, 0.99, 1.03, 1.04],
				rotate: [-0.32, -0.12, -0.04, 0],
				glowOpacity: [0.2, 0.28, 0.34, 0.38],
				vignetteOpacity: [0.18, 0.22, 0.26, 0.3],
			};
		case 'worktree-standalone-terminal-proof':
			return {
				translateX: [18, 8, 0, 0],
				translateY: [12, 4, 0, 0],
				scale: [0.99, 1.01, 1.01, 1],
				rotate: [-0.18, -0.08, -0.02, 0],
				glowOpacity: [0.18, 0.24, 0.3, 0.34],
				vignetteOpacity: [0.18, 0.2, 0.22, 0.24],
			};
		case 'worktree-standalone-risk':
		default:
			return {
				translateX: [88, 42, 14, 0],
				translateY: [42, 18, 6, 0],
				scale: [0.84, 0.92, 0.99, 1.02],
				rotate: [-1.08, -0.42, -0.08, 0],
				glowOpacity: [0.12, 0.18, 0.24, 0.28],
				vignetteOpacity: [0.24, 0.3, 0.34, 0.36],
			};
	}
};

const getFocusPreset = (sceneId: string): WorktreeFocusPreset => {
	switch (sceneId) {
		case 'worktree-standalone-toggle':
			return {
				x: [0.78, 0.76, 0.74, 0.74],
				y: [0.42, 0.36, 0.32, 0.32],
				width: [0.36, 0.4, 0.46, 0.48],
				height: [0.16, 0.18, 0.2, 0.2],
				opacity: [0.12, 0.42, 0.72, 0.78],
				label: 'Enable isolated lane',
			};
		case 'worktree-standalone-create-form':
			return {
				x: [0.78, 0.74, 0.72, 0.72],
				y: [0.56, 0.6, 0.64, 0.64],
				width: [0.3, 0.44, 0.56, 0.58],
				height: [0.18, 0.26, 0.34, 0.36],
				opacity: [0.14, 0.48, 0.78, 0.82],
				label: 'Branch and path defaults',
			};
		case 'worktree-standalone-pr-intent':
			return {
				x: [0.72, 0.72, 0.72, 0.72],
				y: [0.74, 0.78, 0.82, 0.82],
				width: [0.34, 0.42, 0.48, 0.5],
				height: [0.14, 0.18, 0.22, 0.22],
				opacity: [0.16, 0.5, 0.78, 0.82],
				label: 'Attach review handoff',
			};
		case 'worktree-standalone-inventory':
			return {
				x: [0.26, 0.28, 0.3, 0.3],
				y: [0.32, 0.38, 0.44, 0.44],
				width: [0.34, 0.38, 0.42, 0.42],
				height: [0.22, 0.34, 0.46, 0.46],
				opacity: [0.18, 0.46, 0.72, 0.76],
				label: 'Tracked worktree destinations',
			};
		case 'worktree-standalone-terminal-proof':
			return {
				x: [0.28, 0.28, 0.3, 0.3],
				y: [0.34, 0.38, 0.4, 0.4],
				width: [0.34, 0.4, 0.46, 0.46],
				height: [0.24, 0.32, 0.38, 0.38],
				opacity: [0.16, 0.36, 0.6, 0.66],
				label: 'Isolated branch executes here',
			};
		case 'worktree-standalone-risk':
		default:
			return {
				x: [0.74, 0.72, 0.7, 0.7],
				y: [0.58, 0.62, 0.66, 0.66],
				width: [0.3, 0.34, 0.4, 0.42],
				height: [0.16, 0.18, 0.22, 0.22],
				opacity: [0.08, 0.2, 0.36, 0.42],
				label: 'Single checkout pressure',
			};
	}
};

const getCursorPreset = (sceneId: string): WorktreeCursorPreset | null => {
	switch (sceneId) {
		case 'worktree-standalone-toggle':
			return {
				x: [0.9, 0.84, 0.78, 0.74],
				y: [0.18, 0.24, 0.32, 0.32],
				opacity: [0, 0.94, 1, 0.86],
				scale: [0.92, 1.02, 1.06, 1],
				pressedWindows: [[0.36, 0.44]],
				hint: 'Dispatch to a separate worktree',
			};
		case 'worktree-standalone-create-form':
			return {
				x: [0.66, 0.72, 0.78, 0.84],
				y: [0.54, 0.58, 0.58, 0.58],
				opacity: [0, 0.94, 1, 0.84],
				scale: [0.92, 1, 1.04, 1],
				pressedWindows: [[0.2, 0.26]],
				hint: 'Confirm branch defaults',
			};
		case 'worktree-standalone-pr-intent':
			return {
				x: [0.76, 0.74, 0.72, 0.72],
				y: [0.66, 0.74, 0.82, 0.82],
				opacity: [0, 0.92, 1, 0.82],
				scale: [0.92, 1.02, 1.04, 1],
				pressedWindows: [[0.48, 0.56]],
				hint: 'Keep PR handoff attached',
			};
		case 'worktree-standalone-inventory':
			return {
				x: [0.22, 0.24, 0.26, 0.28],
				y: [0.24, 0.3, 0.4, 0.5],
				opacity: [0, 0.88, 0.98, 0.76],
				scale: [0.94, 1.02, 1.04, 1],
				pressedWindows: [[0.56, 0.62]],
				hint: 'Open in Maestro',
			};
		case 'worktree-standalone-risk':
		case 'worktree-standalone-terminal-proof':
		default:
			return null;
	}
};

export const getWorktreeFlowStage = (sceneId: string): WorktreeFlowStage => {
	switch (sceneId) {
		case 'worktree-standalone-toggle':
			return 'Toggle';
		case 'worktree-standalone-create-form':
		case 'worktree-standalone-pr-intent':
			return 'Branch';
		case 'worktree-standalone-inventory':
			return 'Inventory';
		case 'worktree-standalone-terminal-proof':
			return 'Proof';
		case 'worktree-standalone-risk':
		default:
			return 'Risk';
	}
};

export const getWorktreeStagePose = (
	sceneId: string,
	frame: number,
	durationInFrames: number
): WorktreeStagePose => {
	const progress = getNormalizedProgress(frame, durationInFrames);
	const preset = getStagePreset(sceneId);

	return {
		translateX: interpolateKeyframes(progress, preset.translateX),
		translateY: interpolateKeyframes(progress, preset.translateY),
		scale: interpolateKeyframes(progress, preset.scale),
		rotate: interpolateKeyframes(progress, preset.rotate),
		glowOpacity: interpolateKeyframes(progress, preset.glowOpacity),
		vignetteOpacity: interpolateKeyframes(progress, preset.vignetteOpacity),
	};
};

export const getWorktreeFocusFrame = (
	sceneId: string,
	frame: number,
	durationInFrames: number
): WorktreeFocusFrame => {
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

export const getWorktreeCursorPose = (
	sceneId: string,
	frame: number,
	durationInFrames: number
): WorktreeCursorPose => {
	const progress = getNormalizedProgress(frame, durationInFrames);
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

	const opacity = interpolateKeyframes(progress, preset.opacity);
	const pulse = interpolate(frame % 40, [0, 18, 39], [1, 1.18, 1], clamp);
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
