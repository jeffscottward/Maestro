import { createPrototypeSpec } from './shared';

export const symphonyPrototypeSpec = createPrototypeSpec({
	id: 'SymphonyPrototype',
	featureName: 'Maestro Symphony',
	title: 'Maestro Symphony prototype',
	description:
		'Standalone Symphony stub focused on issue browsing, document previews, and the Create Agent launch state.',
	fps: 30,
	runtimeSeconds: 6,
	capturePlan: [
		{
			id: 'symphony-projects-grid',
			feature: 'Maestro Symphony Projects',
			mode: 'reconstructed-ui',
			sourceRef: 'src/renderer/components/SymphonyModal.tsx',
			notes: 'Reconstruct the main Projects grid with real tabs and contribution states.',
			required: true,
		},
		{
			id: 'symphony-details',
			feature: 'Symphony Project Details',
			mode: 'fallback-slot',
			sourceRef: 'docs/screenshots/symphony-details.png',
			notes: 'Hold the exact issue detail density in an explicit fallback slot.',
			required: true,
		},
		{
			id: 'symphony-create-agent',
			feature: 'Create Agent',
			mode: 'fallback-slot',
			sourceRef: 'docs/screenshots/symphony-create-agent.png',
			notes: 'Keep the agent creation dialog exact until the full form reconstruction lands.',
			required: true,
		},
	],
	scenes: [
		{
			id: 'symphony-projects-overview',
			type: 'title-card',
			surfaceId: 'symphony-projects',
			featureName: 'Maestro Symphony',
			accentLabel: 'Projects',
			title: 'Projects, Active, History, and Stats stay visible in one modal',
			body: 'The prototype keeps project tiles, issue detail context, document previews, and blocked-state language grounded in the real Symphony flow instead of generic launch-video chrome.',
			durationInFrames: 90,
			captureIds: ['symphony-projects-grid', 'symphony-details'],
		},
		{
			id: 'symphony-create-agent-flow',
			type: 'capture-callout',
			surfaceId: 'symphony-create-agent',
			featureName: 'Create Agent',
			accentLabel: 'Start Symphony',
			title: 'Start Symphony leads straight into Create Agent',
			body: 'AI Provider, Session Name, and Working Directory stay tied to the selected issue so the later production can deepen the handoff without changing the composition contract.',
			durationInFrames: 90,
			captureIds: ['symphony-projects-grid', 'symphony-create-agent'],
		},
	],
});
