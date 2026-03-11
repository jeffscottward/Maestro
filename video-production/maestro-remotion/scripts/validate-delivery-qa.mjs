/* global console, process */

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { formatFinalDeliveryQaReport, runFinalDeliveryQa } from '../src/lib/final-delivery-qa.ts';

const isDirectExecution =
	process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

export const validateDeliveryQa = () => {
	const report = runFinalDeliveryQa({ workspaceRoot: process.cwd() });
	const formatted = formatFinalDeliveryQaReport(report);

	if (report.totalIssueCount > 0) {
		throw new Error(formatted);
	}

	return formatted;
};

if (isDirectExecution) {
	try {
		console.log(validateDeliveryQa());
	} catch (error) {
		console.error(error instanceof Error ? error.message : String(error));
		process.exit(1);
	}
}
