import { z } from 'zod';

import {
	AspectRatioIntentSchema,
	AssetPlaceholderSchema,
	CaptureManifestEntrySchema,
} from './production-schema';

const positiveInt = z.number().int().positive();

export const CaptureBucketSchema = z.enum(['live', 'docs', 'derived', 'manifests', 'recordings']);

export const CaptureMediaTypeSchema = z.enum(['video', 'image', 'audio', 'data']);

export const CapturePathMetadataSchema = z.object({
	relativePath: z.string().min(1),
	bucket: CaptureBucketSchema,
	featureSlug: z.string().min(1),
	fileName: z.string().min(1),
	stem: z.string().min(1),
	extension: z.string().min(1),
	mediaType: CaptureMediaTypeSchema,
});

export const CaptureDirectoryMapSchema = z.object({
	live: z.string().min(1),
	docs: z.string().min(1),
	derived: z.string().min(1),
	manifests: z.string().min(1),
	recordings: z.string().min(1),
});

export const CropRatioSchema = z.enum(['16:9', '1:1', '9:16']);

export const CaptureCropPlanEntrySchema = z.object({
	ratio: CropRatioSchema,
	framing: z.string().min(1),
	safeZone: z.string().min(1),
});

export const AssetSourceStatusSchema = z.enum(['planned', 'captured', 'derived']);
export const SceneSourceStatusSchema = z.enum(['planned', 'resolved']);
export const CaptureManifestStatusSchema = z.enum(['planned', 'in-progress', 'ready']);

export const CaptureAssetManifestEntrySchema = AssetPlaceholderSchema.extend({
	bucket: CaptureBucketSchema,
	featureSlug: z.string().min(1),
	mediaType: CaptureMediaTypeSchema,
	metadata: CapturePathMetadataSchema,
	sourceStatus: AssetSourceStatusSchema,
	capturedPath: z.string().min(1).nullable(),
});

export const SceneCaptureSourceSchema = z.object({
	captureId: z.string().min(1),
	plannedMode: CaptureManifestEntrySchema.shape.mode,
	sourceRef: z.string().min(1),
	required: z.boolean(),
	sourceStatus: SceneSourceStatusSchema,
	resolvedSourcePath: z.string().min(1).nullable(),
	fallbackAssetIds: z.array(z.string().min(1)),
	notes: z.string().min(1),
});

export const SceneCaptureMappingSchema = z.object({
	sceneId: z.string().min(1),
	sceneNumber: positiveInt,
	purpose: z.string().min(1),
	captureIds: z.array(z.string().min(1)).min(1),
	assetPlaceholderIds: z.array(z.string().min(1)).min(1),
	recordingPath: z.string().min(1),
	cropPlan: z.array(CaptureCropPlanEntrySchema).min(1),
	sources: z.array(SceneCaptureSourceSchema).min(1),
});

export const FeatureCaptureManifestSchema = z.object({
	version: z.literal(1),
	status: CaptureManifestStatusSchema,
	specId: z.string().min(1),
	featureName: z.string().min(1),
	featureSlug: z.string().min(1),
	manifestPath: z.string().min(1),
	directories: CaptureDirectoryMapSchema,
	captures: z.array(CaptureManifestEntrySchema).min(1),
	assets: z.array(CaptureAssetManifestEntrySchema).min(1),
	sceneMappings: z.array(SceneCaptureMappingSchema).min(1),
	aspectRatioIntent: AspectRatioIntentSchema.optional(),
});

export type CaptureBucket = z.infer<typeof CaptureBucketSchema>;
export type CaptureMediaType = z.infer<typeof CaptureMediaTypeSchema>;
export type CapturePathMetadata = z.infer<typeof CapturePathMetadataSchema>;
export type CaptureDirectoryMap = z.infer<typeof CaptureDirectoryMapSchema>;
export type CaptureCropPlanEntry = z.infer<typeof CaptureCropPlanEntrySchema>;
export type AssetSourceStatus = z.infer<typeof AssetSourceStatusSchema>;
export type SceneSourceStatus = z.infer<typeof SceneSourceStatusSchema>;
export type CaptureManifestStatus = z.infer<typeof CaptureManifestStatusSchema>;
export type CaptureAssetManifestEntry = z.infer<typeof CaptureAssetManifestEntrySchema>;
export type SceneCaptureSource = z.infer<typeof SceneCaptureSourceSchema>;
export type SceneCaptureMapping = z.infer<typeof SceneCaptureMappingSchema>;
export type FeatureCaptureManifest = z.infer<typeof FeatureCaptureManifestSchema>;
