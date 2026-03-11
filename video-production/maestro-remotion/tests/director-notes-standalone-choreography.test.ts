import { describe, expect, it } from 'vitest';

import { directorNotesStandaloneSpec } from '../src/data/specs';
import {
	getDirectorNotesAiReadySceneState,
	getDirectorNotesCursorPose,
	getDirectorNotesFlowStage,
	getDirectorNotesFocusFrame,
	getDirectorNotesHandoffState,
	getDirectorNotesHistorySceneState,
	getDirectorNotesStagePose,
} from '../src/animations/director-notes-choreography';

describe("Director's Notes standalone choreography", () => {
	it('maps the standalone scene order to the approved fragmentation-to-check-in arc', () => {
		expect(
			directorNotesStandaloneSpec.scenes.map((scene) => getDirectorNotesFlowStage(scene.id))
		).toEqual(['Fragmentation', 'Visibility', 'Actionability', 'Warmup', 'Synthesis', 'Check-In']);
	});

	it('keeps guided cursor beats inside the surface bounds for the interactive scenes', () => {
		const historyCursor = getDirectorNotesCursorPose('director-notes-standalone-history', 102, 210);
		const detailCursor = getDirectorNotesCursorPose('director-notes-standalone-detail', 150, 210);
		const readyCursor = getDirectorNotesCursorPose('director-notes-standalone-ai-ready', 64, 210);

		for (const cursor of [historyCursor, detailCursor, readyCursor]) {
			expect(cursor.visible).toBe(true);
			expect(cursor.x).toBeGreaterThan(0);
			expect(cursor.x).toBeLessThan(1);
			expect(cursor.y).toBeGreaterThan(0);
			expect(cursor.y).toBeLessThan(1);
			expect(cursor.opacity).toBeGreaterThan(0.2);
			expect(cursor.hint.length).toBeGreaterThan(3);
		}
	});

	it('starts broad on history, pushes closest on detail, then settles for the closing bridge', () => {
		const historyPose = getDirectorNotesStagePose('director-notes-standalone-history', 72, 210);
		const detailPose = getDirectorNotesStagePose('director-notes-standalone-detail', 132, 210);
		const warmupPose = getDirectorNotesStagePose('director-notes-standalone-ai-loading', 150, 180);
		const closePose = getDirectorNotesStagePose('director-notes-standalone-close', 180, 210);

		expect(detailPose.scale).toBeGreaterThan(historyPose.scale);
		expect(detailPose.focusOpacity).toBeGreaterThan(historyPose.focusOpacity - 0.05);
		expect(warmupPose.translateX).toBeGreaterThan(historyPose.translateX - 10);
		expect(closePose.scale).toBeLessThanOrEqual(1.03);
		expect(Math.abs(closePose.translateX)).toBeLessThan(24);
	});

	it('moves the focus frame from controls to detail to summary without leaving the visible surface', () => {
		const historyFocus = getDirectorNotesFocusFrame('director-notes-standalone-history', 144, 210);
		const detailFocus = getDirectorNotesFocusFrame('director-notes-standalone-detail', 168, 210);
		const readyFocus = getDirectorNotesFocusFrame('director-notes-standalone-ai-ready', 156, 210);

		for (const focus of [historyFocus, detailFocus, readyFocus]) {
			expect(focus.x).toBeGreaterThan(0);
			expect(focus.x).toBeLessThan(1);
			expect(focus.y).toBeGreaterThan(0);
			expect(focus.y).toBeLessThan(1);
			expect(focus.width).toBeGreaterThan(0.1);
			expect(focus.width).toBeLessThan(1);
			expect(focus.height).toBeGreaterThan(0.1);
			expect(focus.height).toBeLessThan(1);
			expect(focus.opacity).toBeGreaterThan(0.15);
		}

		expect(detailFocus.height).toBeGreaterThan(historyFocus.height);
		expect(readyFocus.y).toBeGreaterThan(historyFocus.y);
	});

	it('tightens Unified History state over time so the filters feel interactive instead of static', () => {
		const broadHistory = getDirectorNotesHistorySceneState(0.08);
		const filteredHistory = getDirectorNotesHistorySceneState(0.76);

		expect(broadHistory.searchQuery).toBe('');
		expect(broadHistory.autoActive).toBe(true);
		expect(broadHistory.rowsMode).toBe('global');

		expect(filteredHistory.searchQuery).toBe('rss');
		expect(filteredHistory.autoActive).toBe(false);
		expect(filteredHistory.rowsMode).toBe('filtered');
		expect(filteredHistory.showResumeCue).toBe(true);
		expect(filteredHistory.highlightedIndex).toBeGreaterThan(broadHistory.highlightedIndex);
	});

	it('holds on history briefly before switching into the ready synopsis build', () => {
		const earlyReady = getDirectorNotesAiReadySceneState(0.12);
		const lateReady = getDirectorNotesAiReadySceneState(0.82);

		expect(earlyReady.activeTab).toBe('history');
		expect(earlyReady.summaryProgress).toBeLessThan(0.1);
		expect(lateReady.activeTab).toBe('ai-overview');
		expect(lateReady.summaryProgress).toBeGreaterThan(0.7);
		expect(lateReady.tabSwitchProgress).toBeGreaterThan(earlyReady.tabSwitchProgress);
	});

	it('derives a handoff cue from the next storyboard beat when one exists', () => {
		const nextScene = directorNotesStandaloneSpec.scenes[1];
		const handoff = getDirectorNotesHandoffState(nextScene);

		expect(handoff).toEqual({
			nextStage: 'Visibility',
			nextLabel: 'Filters',
			nextCue: '`Unified History` merges `AUTO` and `USER` work.',
		});
		expect(getDirectorNotesHandoffState(null)).toBeNull();
	});
});
