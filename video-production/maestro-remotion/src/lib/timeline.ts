import type { CaptureManifestEntry, SceneData, VideoSpec } from '../data/production-schema';

export const getDurationInFrames = (spec: VideoSpec) => {
	return Math.round(spec.runtimeSeconds * spec.fps);
};

export const getSceneOffsets = (spec: VideoSpec) => {
	let cursor = 0;

	return spec.scenes.map((scene, index) => {
		const startFrame = cursor;
		cursor += scene.durationInFrames;

		return {
			index,
			scene,
			startFrame,
		};
	});
};

export const getCapturesForScene = (spec: VideoSpec, scene: SceneData): CaptureManifestEntry[] => {
	const capturesById = new Map(spec.capturePlan.map((capture) => [capture.id, capture]));

	return scene.captureIds.flatMap((captureId) => {
		const capture = capturesById.get(captureId);
		return capture ? [capture] : [];
	});
};
