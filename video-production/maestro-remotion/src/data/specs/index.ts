export { directorNotesPrototypeSpec } from './director-notes-prototype-spec';
export { featureTeaserSpec } from './feature-teaser-spec';
export {
	DATA_DRIVEN_TEXT_LAYERS,
	PROTOTYPE_SPEC_MODULE_PATHS,
	prototypeProductionArtifacts,
} from './prototype-production-artifacts';
export { symphonyPrototypeSpec } from './symphony-prototype-spec';
export { worktreeSpinOffsPrototypeSpec } from './worktree-spin-offs-prototype-spec';

import { directorNotesPrototypeSpec } from './director-notes-prototype-spec';
import { featureTeaserSpec } from './feature-teaser-spec';
import { symphonyPrototypeSpec } from './symphony-prototype-spec';
import { worktreeSpinOffsPrototypeSpec } from './worktree-spin-offs-prototype-spec';

export const prototypeSpecs = [
	featureTeaserSpec,
	symphonyPrototypeSpec,
	directorNotesPrototypeSpec,
	worktreeSpinOffsPrototypeSpec,
] as const;
