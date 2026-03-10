import type { CaptureManifestEntry, SceneData, VideoSpec } from '../production-schema';

import { directorNotesPrototypeSpec } from './director-notes-prototype-spec';
import { featureTeaserSpec } from './feature-teaser-spec';
import { symphonyPrototypeSpec } from './symphony-prototype-spec';
import { worktreeSpinOffsPrototypeSpec } from './worktree-spin-offs-prototype-spec';

export const DATA_DRIVEN_TEXT_LAYERS = ['accentLabel', 'title', 'body'] as const;

export const PROTOTYPE_SPEC_MODULE_PATHS = {
	MaestroFeatureTeaser: 'src/data/specs/feature-teaser-spec.ts',
	SymphonyPrototype: 'src/data/specs/symphony-prototype-spec.ts',
	DirectorNotesPrototype: 'src/data/specs/director-notes-prototype-spec.ts',
	WorktreeSpinOffsPrototype: 'src/data/specs/worktree-spin-offs-prototype-spec.ts',
} as const;

type PrototypeCompositionId = keyof typeof PROTOTYPE_SPEC_MODULE_PATHS;
type DataDrivenTextLayer = (typeof DATA_DRIVEN_TEXT_LAYERS)[number];

type SceneCaptureFallback = Pick<CaptureManifestEntry, 'id' | 'mode' | 'sourceRef'>;

export type PrototypeSceneDelivery = {
	sceneId: SceneData['id'];
	sceneType: SceneData['type'];
	featureName: SceneData['featureName'];
	reconstructedUi: {
		surfaceId: SceneData['surfaceId'];
		sourceCaptureIds: string[];
	};
	dataDrivenTextLayers: readonly DataDrivenTextLayer[];
	captureFallbacks: SceneCaptureFallback[];
};

export type PrototypeProductionArtifact = {
	compositionId: PrototypeCompositionId;
	featureName: VideoSpec['featureName'];
	title: VideoSpec['title'];
	aspectRatio: VideoSpec['aspectRatio'];
	fps: VideoSpec['fps'];
	runtimeSeconds: VideoSpec['runtimeSeconds'];
	specModulePath: (typeof PROTOTYPE_SPEC_MODULE_PATHS)[PrototypeCompositionId];
	sceneDelivery: PrototypeSceneDelivery[];
};

const prototypeSpecCatalog = {
	MaestroFeatureTeaser: featureTeaserSpec,
	SymphonyPrototype: symphonyPrototypeSpec,
	DirectorNotesPrototype: directorNotesPrototypeSpec,
	WorktreeSpinOffsPrototype: worktreeSpinOffsPrototypeSpec,
} satisfies Record<PrototypeCompositionId, VideoSpec>;

const getCaptureEntriesForScene = (spec: VideoSpec, scene: SceneData) => {
	return spec.capturePlan.filter((capture) => scene.captureIds.includes(capture.id));
};

const createSceneDelivery = (spec: VideoSpec, scene: SceneData): PrototypeSceneDelivery => {
	const captureEntries = getCaptureEntriesForScene(spec, scene);

	return {
		sceneId: scene.id,
		sceneType: scene.type,
		featureName: scene.featureName,
		reconstructedUi: {
			surfaceId: scene.surfaceId,
			sourceCaptureIds: captureEntries
				.filter((capture) => capture.mode === 'reconstructed-ui')
				.map((capture) => capture.id),
		},
		dataDrivenTextLayers: DATA_DRIVEN_TEXT_LAYERS,
		captureFallbacks: captureEntries
			.filter((capture) => capture.mode !== 'reconstructed-ui')
			.map(({ id, mode, sourceRef }) => ({
				id,
				mode,
				sourceRef,
			})),
	};
};

export const prototypeProductionArtifacts = (
	Object.entries(prototypeSpecCatalog) as [PrototypeCompositionId, VideoSpec][]
).map(([compositionId, spec]) => ({
	compositionId,
	featureName: spec.featureName,
	title: spec.title,
	aspectRatio: spec.aspectRatio,
	fps: spec.fps,
	runtimeSeconds: spec.runtimeSeconds,
	specModulePath: PROTOTYPE_SPEC_MODULE_PATHS[compositionId],
	sceneDelivery: spec.scenes.map((scene) => createSceneDelivery(spec, scene)),
})) satisfies PrototypeProductionArtifact[];
