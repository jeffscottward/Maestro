import { MAESTRO_SOURCE_REFERENCES, PRESERVED_TERMINOLOGY } from '../../lib/projectSources';
import { validateVideoSpec, type MotionSettings, type VideoSpec } from '../production-schema';

export const PROTOTYPE_MASTER_DIMENSIONS = {
	width: 1920,
	height: 1080,
} as const;

export const PROTOTYPE_MOTION_PRESET = {
	entranceDurationFrames: 24,
	fadeInFrames: 14,
	fadeOutFrames: 12,
	spring: {
		damping: 190,
		stiffness: 145,
	},
} satisfies MotionSettings;

type ProductionSpecInput = Omit<
	VideoSpec,
	'aspectRatio' | 'dimensions' | 'motion' | 'terminology' | 'sourceRefs'
> & {
	dimensions?: VideoSpec['dimensions'];
	motion?: MotionSettings;
	terminology?: VideoSpec['terminology'];
	sourceRefs?: VideoSpec['sourceRefs'];
};

export const createProductionSpec = (spec: ProductionSpecInput) =>
	validateVideoSpec({
		...spec,
		aspectRatio: '16:9',
		dimensions: spec.dimensions ?? PROTOTYPE_MASTER_DIMENSIONS,
		motion: spec.motion ?? PROTOTYPE_MOTION_PRESET,
		terminology: [...new Set([...PRESERVED_TERMINOLOGY, ...(spec.terminology ?? [])])],
		sourceRefs: [...new Set([...MAESTRO_SOURCE_REFERENCES, ...(spec.sourceRefs ?? [])])],
	});

export const createPrototypeSpec = (spec: ProductionSpecInput) => createProductionSpec(spec);
