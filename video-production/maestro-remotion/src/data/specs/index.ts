export { directorNotesPrototypeSpec } from './director-notes-prototype-spec';
export { directorNotesStandaloneSpec } from './director-notes-standalone-spec';
export { featureTeaserSpec } from './feature-teaser-spec';
export {
	DATA_DRIVEN_TEXT_LAYERS,
	PROTOTYPE_SPEC_MODULE_PATHS,
	prototypeProductionArtifacts,
} from './prototype-production-artifacts';
export { symphonyPrototypeSpec } from './symphony-prototype-spec';
export { symphonyStandaloneSpec } from './symphony-standalone-spec';
export { worktreeSpinOffsPrototypeSpec } from './worktree-spin-offs-prototype-spec';
export { worktreeSpinOffsStandaloneSpec } from './worktree-spin-offs-standalone-spec';

import { directorNotesPrototypeSpec } from './director-notes-prototype-spec';
import { directorNotesStandaloneSpec } from './director-notes-standalone-spec';
import { featureTeaserSpec } from './feature-teaser-spec';
import { symphonyPrototypeSpec } from './symphony-prototype-spec';
import { symphonyStandaloneSpec } from './symphony-standalone-spec';
import { worktreeSpinOffsPrototypeSpec } from './worktree-spin-offs-prototype-spec';
import { worktreeSpinOffsStandaloneSpec } from './worktree-spin-offs-standalone-spec';

export const prototypeSpecs = [
	featureTeaserSpec,
	symphonyPrototypeSpec,
	directorNotesPrototypeSpec,
	worktreeSpinOffsPrototypeSpec,
] as const;

export const standaloneFeatureSpecs = [
	symphonyStandaloneSpec,
	directorNotesStandaloneSpec,
	worktreeSpinOffsStandaloneSpec,
] as const;
