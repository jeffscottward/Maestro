import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const qaReportsDir = resolve(workspaceRoot, 'docs/reports/qa');

const qaReports = [
	{
		fileName: 'symphony-final-qa-report.md',
		title: 'Symphony Final QA Report',
		requiredPhrases: [
			'[[symphony-prototype-plan]]',
			'[[symphony-render-report]]',
			'Automated QA Status: `PASS`',
			'No scene needs to switch to capture fallback for final delivery.',
			'`Start Symphony`',
			'`Create Symphony Agent`',
		],
	},
	{
		fileName: 'directors-notes-final-qa-report.md',
		title: "Director's Notes Final QA Report",
		requiredPhrases: [
			'[[director-notes-prototype-plan]]',
			'[[directors-notes-render-report]]',
			'Automated QA Status: `PASS`',
			'No scene needs to switch to capture fallback for final delivery.',
			'`Unified History`',
			'`AI Overview`',
			'`Regenerate`',
		],
	},
	{
		fileName: 'worktree-spin-offs-final-qa-report.md',
		title: 'Worktree Spin-offs Final QA Report',
		requiredPhrases: [
			'[[worktree-spin-offs-prototype-plan]]',
			'[[worktree-spin-offs-render-report]]',
			'Automated QA Status: `PASS`',
			'No scene needs to switch to capture fallback for final delivery.',
			'`Run in Worktree`',
			'`Dispatch to a separate worktree`',
		],
	},
] as const;

const requiredSections = [
	'## Automated QA Summary',
	'## UI Fidelity Review',
	'## Capture Fallback Decision',
	'## Aspect Ratio Watchlist',
	'## Remaining Risks',
];

describe('final delivery QA reports', () => {
	it('stores one structured QA report per standalone feature', () => {
		expect(existsSync(qaReportsDir)).toBe(true);

		for (const qaReport of qaReports) {
			const docPath = resolve(qaReportsDir, qaReport.fileName);

			expect(existsSync(docPath)).toBe(true);

			const doc = readFileSync(docPath, 'utf8');

			expect(doc.startsWith('---\n')).toBe(true);
			expect(doc).toContain('type: report');
			expect(doc).toContain(`title: ${qaReport.title}`);

			for (const section of requiredSections) {
				expect(doc).toContain(section);
			}

			for (const phrase of qaReport.requiredPhrases) {
				expect(doc).toContain(phrase);
			}
		}
	});
});
