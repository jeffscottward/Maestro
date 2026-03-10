import { describe, expect, it } from 'vitest';

import { worktreeSpinOffsStandaloneSpec } from '../src/data/specs';
import {
	getWorktreeCursorPose,
	getWorktreeFlowStage,
	getWorktreeFocusFrame,
	getWorktreeStagePose,
} from '../src/animations/worktree-choreography';

describe('Worktree standalone choreography', () => {
	it('maps the standalone scene order to the approved risk-to-proof arc', () => {
		expect(
			worktreeSpinOffsStandaloneSpec.scenes.map((scene) => getWorktreeFlowStage(scene.id))
		).toEqual(['Risk', 'Toggle', 'Branch', 'Branch', 'Inventory', 'Proof']);
	});

	it('keeps guided cursor beats inside the surface bounds for interactive worktree scenes', () => {
		const toggleCursor = getWorktreeCursorPose('worktree-standalone-toggle', 108, 180);
		const createCursor = getWorktreeCursorPose('worktree-standalone-create-form', 120, 180);
		const prCursor = getWorktreeCursorPose('worktree-standalone-pr-intent', 132, 180);
		const inventoryCursor = getWorktreeCursorPose('worktree-standalone-inventory', 132, 180);

		for (const cursor of [toggleCursor, createCursor, prCursor, inventoryCursor]) {
			expect(cursor.visible).toBe(true);
			expect(cursor.x).toBeGreaterThan(0);
			expect(cursor.x).toBeLessThan(1);
			expect(cursor.y).toBeGreaterThan(0);
			expect(cursor.y).toBeLessThan(1);
			expect(cursor.opacity).toBeGreaterThan(0.2);
			expect(cursor.hint.length).toBeGreaterThan(6);
		}

		expect(getWorktreeCursorPose('worktree-standalone-risk', 90, 150).visible).toBe(false);
		expect(getWorktreeCursorPose('worktree-standalone-terminal-proof', 90, 180).visible).toBe(
			false
		);
	});

	it('pushes closest on the branch setup beats, then settles for the terminal proof close', () => {
		const riskPose = getWorktreeStagePose('worktree-standalone-risk', 72, 150);
		const createPose = getWorktreeStagePose('worktree-standalone-create-form', 120, 180);
		const prPose = getWorktreeStagePose('worktree-standalone-pr-intent', 132, 180);
		const proofPose = getWorktreeStagePose('worktree-standalone-terminal-proof', 144, 180);

		expect(createPose.scale).toBeGreaterThan(riskPose.scale);
		expect(prPose.scale).toBeGreaterThan(riskPose.scale);
		expect(proofPose.scale).toBeLessThanOrEqual(1.03);
		expect(Math.abs(proofPose.translateX)).toBeLessThan(24);
	});

	it('moves focus from the toggle row to branch setup to tracked destinations without leaving the surface', () => {
		const toggleFocus = getWorktreeFocusFrame('worktree-standalone-toggle', 132, 180);
		const createFocus = getWorktreeFocusFrame('worktree-standalone-create-form', 132, 180);
		const inventoryFocus = getWorktreeFocusFrame('worktree-standalone-inventory', 144, 180);
		const proofFocus = getWorktreeFocusFrame('worktree-standalone-terminal-proof', 144, 180);

		for (const focus of [toggleFocus, createFocus, inventoryFocus, proofFocus]) {
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

		expect(createFocus.height).toBeGreaterThan(toggleFocus.height);
		expect(inventoryFocus.x).toBeLessThan(createFocus.x);
		expect(proofFocus.y).toBeLessThanOrEqual(0.42);
	});
});
