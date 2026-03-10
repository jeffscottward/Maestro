import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { directorNotesStandaloneSpec } from '../src/data/specs/director-notes-standalone-spec';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const repoRoot = resolve(workspaceRoot, '..', '..');

const readWorkspaceFile = (relativePath: string) =>
	readFileSync(resolve(workspaceRoot, relativePath), 'utf8');

const readRepoFile = (relativePath: string) =>
	readFileSync(resolve(repoRoot, relativePath), 'utf8');

describe("Director's Notes planning alignment", () => {
	it('keeps the narrative artifacts aligned with the shipped AI Overview warmup behavior', () => {
		const strategyDoc = readWorkspaceFile('docs/strategy/director-notes-prototype-plan.md');
		const storyboardDoc = readWorkspaceFile('docs/storyboards/director-notes-storyboard.md');
		const productDoc = readRepoFile('docs/director-notes.md');
		const modalSource = readRepoFile(
			'src/renderer/components/DirectorNotes/DirectorNotesModal.tsx'
		);
		const aiOverviewSource = readRepoFile(
			'src/renderer/components/DirectorNotes/AIOverviewTab.tsx'
		);

		expect(modalSource).toContain("const [activeTab, setActiveTab] = useState<TabId>('history');");
		expect(modalSource).toContain("if (tabId === 'ai-overview') return overviewReady;");
		expect(modalSource).toContain(
			'<AIOverviewTab theme={theme} onSynopsisReady={handleSynopsisReady} />'
		);
		expect(aiOverviewSource).toContain('generateSynopsis();');

		expect(strategyDoc).toContain('starts when the modal opens');
		expect(strategyDoc).toContain('tab remains disabled until the synopsis is ready');
		expect(strategyDoc).toContain('`Help`, `Unified History`, and `AI Overview`');

		expect(storyboardDoc).toContain(
			'Continue reviewing `Unified History` while `AI Overview` generates in the background.'
		);
		expect(storyboardDoc).toContain(
			'The tab strip shows background progress and only enables `AI Overview` after the synopsis exists.'
		);
		expect(storyboardDoc).toContain('Select the now-ready `AI Overview` tab.');

		expect(productDoc).toContain('**Regenerate**');
		expect(productDoc).toContain(
			"starts generating in the background as soon as Director's Notes opens"
		);

		const loadingScene = directorNotesStandaloneSpec.scenes.find(
			(scene) => scene.id === 'director-notes-standalone-ai-loading'
		);
		const readyScene = directorNotesStandaloneSpec.scenes.find(
			(scene) => scene.id === 'director-notes-standalone-ai-ready'
		);

		expect(loadingScene?.storyboard?.uiStateShown).toContain('`Unified History`');
		expect(loadingScene?.storyboard?.userAction).toContain('background');
		expect(loadingScene?.storyboard?.systemResponse).toContain('only enables `AI Overview`');
		expect(readyScene?.storyboard?.userAction).toContain('now-ready `AI Overview` tab');
		expect(directorNotesStandaloneSpec.sourceRefs).toContain(
			'src/renderer/components/DirectorNotes/DirectorNotesModal.tsx'
		);
		expect(directorNotesStandaloneSpec.sourceRefs).toContain('docs/director-notes.md');
	});
});
