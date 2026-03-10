import { z } from 'zod';

const positiveInt = z.number().int().positive();

export const FrameDimensionsSchema = z.object({
	width: positiveInt,
	height: positiveInt,
});

export const MotionSettingsSchema = z.object({
	entranceDurationFrames: positiveInt,
	fadeInFrames: positiveInt,
	fadeOutFrames: positiveInt,
	spring: z.object({
		damping: z.number().positive(),
		stiffness: z.number().positive().optional(),
		mass: z.number().positive().optional(),
	}),
});

export const CaptureManifestEntrySchema = z.object({
	id: z.string().min(1),
	feature: z.string().min(1),
	mode: z.enum(['reconstructed-ui', 'live-capture', 'fallback-slot']),
	sourceRef: z.string().min(1),
	notes: z.string().min(1),
	required: z.boolean(),
});

export const SceneSurfaceIdSchema = z.enum([
	'symphony-projects',
	'symphony-create-agent',
	'director-history',
	'director-ai-overview',
	'worktree-dispatch',
	'worktree-terminal',
]);

export const SceneDataSchema = z.object({
	id: z.string().min(1),
	type: z.enum(['title-card', 'feature-spotlight', 'capture-callout']),
	surfaceId: SceneSurfaceIdSchema,
	featureName: z.string().min(1),
	accentLabel: z.string().min(1),
	title: z.string().min(1),
	body: z.string().min(1),
	durationInFrames: positiveInt,
	captureIds: z.array(z.string().min(1)).min(1),
});

export const VideoSpecSchema = z
	.object({
		id: z.string().min(1),
		featureName: z.string().min(1),
		title: z.string().min(1),
		description: z.string().min(1),
		aspectRatio: z.literal('16:9'),
		dimensions: FrameDimensionsSchema,
		fps: positiveInt,
		runtimeSeconds: z.number().positive(),
		scenes: z.array(SceneDataSchema).min(1),
		capturePlan: z.array(CaptureManifestEntrySchema).min(1),
		motion: MotionSettingsSchema,
		terminology: z.array(z.string().min(1)).min(1),
		sourceRefs: z.array(z.string().min(1)).min(1),
	})
	.superRefine((spec, context) => {
		const expectedDuration = Math.round(spec.runtimeSeconds * spec.fps);
		const timelineDuration = spec.scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0);

		if (timelineDuration !== expectedDuration) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['scenes'],
				message: `Scene durations must total ${expectedDuration} frames for ${spec.runtimeSeconds}s @ ${spec.fps} fps.`,
			});
		}

		const captureIds = new Set(spec.capturePlan.map((capture) => capture.id));

		for (const scene of spec.scenes) {
			for (const captureId of scene.captureIds) {
				if (!captureIds.has(captureId)) {
					context.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['capturePlan'],
						message: `Scene "${scene.id}" references unknown capture "${captureId}".`,
					});
				}
			}
		}
	});

export const VideoCompositionPropsSchema = z.object({
	spec: VideoSpecSchema,
});

export type FrameDimensions = z.infer<typeof FrameDimensionsSchema>;
export type MotionSettings = z.infer<typeof MotionSettingsSchema>;
export type CaptureManifestEntry = z.infer<typeof CaptureManifestEntrySchema>;
export type SceneSurfaceId = z.infer<typeof SceneSurfaceIdSchema>;
export type SceneData = z.infer<typeof SceneDataSchema>;
export type VideoSpec = z.infer<typeof VideoSpecSchema>;
export type VideoCompositionProps = z.infer<typeof VideoCompositionPropsSchema>;

export const validateVideoSpec = (spec: VideoSpec) => VideoSpecSchema.parse(spec);
