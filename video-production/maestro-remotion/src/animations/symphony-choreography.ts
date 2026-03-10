import { Easing, interpolate } from 'remotion';

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

export const SYMPHONY_FLOW_STAGES = [
	'Discover',
	'Scope',
	'Activate',
	'Setup',
	'Active',
	'Proof',
] as const;

export type SymphonyFlowStage = (typeof SYMPHONY_FLOW_STAGES)[number];

type SymphonyStagePose = {
	translateX: number;
	translateY: number;
	scale: number;
	rotate: number;
};

type SymphonyCursorPreset = {
	x: readonly number[];
	y: readonly number[];
	opacity: readonly number[];
	scale: readonly number[];
	pressedWindows?: ReadonlyArray<readonly [number, number]>;
	hint: string;
};

export type SymphonyCursorPose = {
	x: number;
	y: number;
	scale: number;
	opacity: number;
	haloScale: number;
	pressed: boolean;
	visible: boolean;
	hint: string;
};

const getNormalizedProgress = (frame: number, durationInFrames: number) => {
	return interpolate(frame, [0, Math.max(durationInFrames - 1, 1)], [0, 1], {
		...clamp,
		easing: Easing.inOut(Easing.cubic),
	});
};

const interpolateKeyframes = (
	progress: number,
	values: readonly number[],
	keyframes: readonly number[] = [0, 0.38, 0.72, 1]
) => {
	return interpolate(progress, keyframes, values, {
		...clamp,
		easing: Easing.inOut(Easing.cubic),
	});
};

const STAGE_KEYFRAMES = [0, 0.42, 0.76, 1] as const;

const getStagePreset = (sceneId: string) => {
	switch (sceneId) {
		case 'symphony-standalone-issue-detail':
			return {
				translateX: [54, 18, -16, -38],
				translateY: [26, 8, -8, -26],
				scale: [0.96, 1.01, 1.06, 1.1],
				rotate: [-0.65, -0.28, -0.08, 0],
			} as const;
		case 'symphony-standalone-create-agent':
			return {
				translateX: [76, 34, 8, 0],
				translateY: [34, 14, 4, 0],
				scale: [0.9, 0.97, 1.04, 1.09],
				rotate: [-0.8, -0.32, -0.1, 0],
			} as const;
		case 'symphony-standalone-setup-proof':
			return {
				translateX: [42, 16, -10, -24],
				translateY: [24, 8, -2, -10],
				scale: [0.96, 1, 1.03, 1.05],
				rotate: [-0.55, -0.18, -0.04, 0],
			} as const;
		case 'symphony-standalone-active-proof':
			return {
				translateX: [46, 16, -6, -18],
				translateY: [26, 10, -4, -12],
				scale: [0.95, 0.99, 1.03, 1.06],
				rotate: [-0.5, -0.16, -0.05, 0],
			} as const;
		case 'symphony-standalone-history-stats':
			return {
				translateX: [18, 8, 2, 0],
				translateY: [10, 4, 1, 0],
				scale: [0.99, 1.01, 1.02, 1.01],
				rotate: [-0.2, -0.08, -0.02, 0],
			} as const;
		case 'symphony-standalone-projects-browse':
		default:
			return {
				translateX: [48, 24, -8, -26],
				translateY: [28, 10, -4, -12],
				scale: [0.92, 0.98, 1.02, 1.04],
				rotate: [-0.72, -0.24, -0.08, 0],
			} as const;
	}
};

const getCursorPreset = (sceneId: string): SymphonyCursorPreset => {
	switch (sceneId) {
		case 'symphony-standalone-issue-detail':
			return {
				x: [0.24, 0.26, 0.63, 0.77],
				y: [0.62, 0.68, 0.24, 0.18],
				opacity: [0, 0.95, 1, 0.8],
				scale: [0.92, 1, 1.04, 1],
				pressedWindows: [[0.48, 0.56]],
				hint: 'Preview Auto Run docs',
			};
		case 'symphony-standalone-create-agent':
			return {
				x: [0.8, 0.84, 0.24, 0.28],
				y: [0.88, 0.88, 0.4, 0.33],
				opacity: [0, 1, 1, 0.88],
				scale: [0.94, 1.04, 1.02, 1],
				pressedWindows: [
					[0.18, 0.24],
					[0.62, 0.68],
				],
				hint: 'Start Symphony',
			};
		case 'symphony-standalone-setup-proof':
			return {
				x: [0.82, 0.84, 0.66, 0.72],
				y: [0.88, 0.88, 0.42, 0.24],
				opacity: [0, 1, 0.92, 0.74],
				scale: [0.96, 1.06, 1.02, 0.98],
				pressedWindows: [[0.14, 0.22]],
				hint: 'Create Agent',
			};
		case 'symphony-standalone-active-proof':
			return {
				x: [0.76, 0.8, 0.36, 0.78],
				y: [0.18, 0.18, 0.46, 0.18],
				opacity: [0, 0.95, 1, 0.88],
				scale: [0.92, 1.02, 1.06, 1],
				pressedWindows: [
					[0.2, 0.28],
					[0.74, 0.82],
				],
				hint: 'Check PR Status',
			};
		case 'symphony-standalone-history-stats':
			return {
				x: [0.62, 0.74, 0.82, 0.86],
				y: [0.62, 0.38, 0.26, 0.2],
				opacity: [0, 0.62, 0.44, 0],
				scale: [0.9, 0.98, 1, 0.92],
				hint: 'Proof retained',
			};
		case 'symphony-standalone-projects-browse':
		default:
			return {
				x: [0.16, 0.18, 0.26, 0.31],
				y: [0.18, 0.18, 0.44, 0.47],
				opacity: [0, 0.9, 1, 0.82],
				scale: [0.9, 1, 1.06, 1],
				pressedWindows: [[0.54, 0.62]],
				hint: 'Select project',
			};
	}
};

export const getSymphonyFlowStage = (sceneId: string): SymphonyFlowStage => {
	switch (sceneId) {
		case 'symphony-standalone-issue-detail':
			return 'Scope';
		case 'symphony-standalone-create-agent':
			return 'Activate';
		case 'symphony-standalone-setup-proof':
			return 'Setup';
		case 'symphony-standalone-active-proof':
			return 'Active';
		case 'symphony-standalone-history-stats':
			return 'Proof';
		case 'symphony-standalone-projects-browse':
		default:
			return 'Discover';
	}
};

export const getSymphonyStagePose = (
	sceneId: string,
	frame: number,
	durationInFrames: number
): SymphonyStagePose => {
	const progress = getNormalizedProgress(frame, durationInFrames);
	const preset = getStagePreset(sceneId);

	return {
		translateX: interpolateKeyframes(progress, preset.translateX, STAGE_KEYFRAMES),
		translateY: interpolateKeyframes(progress, preset.translateY, STAGE_KEYFRAMES),
		scale: interpolateKeyframes(progress, preset.scale, STAGE_KEYFRAMES),
		rotate: interpolateKeyframes(progress, preset.rotate, STAGE_KEYFRAMES),
	};
};

export const getSymphonyCursorPose = (
	sceneId: string,
	frame: number,
	durationInFrames: number
): SymphonyCursorPose => {
	const progress = getNormalizedProgress(frame, durationInFrames);
	const preset = getCursorPreset(sceneId);
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
