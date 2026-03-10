import { interpolate, spring } from 'remotion';

import type { MotionSettings } from '../data/production-schema';

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

export const getEntranceProgress = (frame: number, fps: number, motion: MotionSettings, delayFrames = 0) => {
	return spring({
		frame: frame - delayFrames,
		fps,
		durationInFrames: motion.entranceDurationFrames,
		config: motion.spring,
	});
};

export const getSceneOpacity = (frame: number, durationInFrames: number, motion: MotionSettings) => {
	const fadeIn = interpolate(frame, [0, motion.fadeInFrames], [0, 1], clamp);
	const fadeOut = interpolate(
		frame,
		[Math.max(durationInFrames - motion.fadeOutFrames, 0), durationInFrames],
		[1, 0],
		clamp
	);

	return Math.min(fadeIn, fadeOut);
};

export const translateYFromProgress = (progress: number, from = 48, to = 0) => {
	return interpolate(progress, [0, 1], [from, to], clamp);
};

export const translateXFromProgress = (progress: number, from = 64, to = 0) => {
	return interpolate(progress, [0, 1], [from, to], clamp);
};
