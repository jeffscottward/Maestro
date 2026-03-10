import type React from 'react';

import { interpolate } from 'remotion';

import {
	getStaggeredProgress,
	scaleFromProgress,
	translateXFromProgress,
	translateYFromProgress,
} from '../animations/motion';
import type { MaestroVisualTheme } from '../lib/maestroVisualSystem';
import type { SymphonyCursorPose, SymphonyFlowStage } from '../animations/symphony-choreography';

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

export const AnimatedReveal: React.FC<{
	children: React.ReactNode;
	frame: number;
	index?: number;
	delayFrames?: number;
	stepFrames?: number;
	durationFrames?: number;
	axis?: 'x' | 'y';
	distance?: number;
}> = ({
	children,
	frame,
	index = 0,
	delayFrames = 0,
	stepFrames = 6,
	durationFrames = 18,
	axis = 'y',
	distance = 28,
}) => {
	const progress = getStaggeredProgress(frame, index, {
		initialDelayFrames: delayFrames,
		stepFrames,
		durationFrames,
	});
	const translate =
		axis === 'x'
			? `translate3d(${translateXFromProgress(progress, distance, 0)}px, 0, 0)`
			: `translate3d(0, ${translateYFromProgress(progress, distance, 0)}px, 0)`;

	return (
		<div
			style={{
				opacity: progress,
				transform: `${translate} scale(${scaleFromProgress(progress, 0.98, 1)})`,
				transformOrigin: 'center',
			}}
		>
			{children}
		</div>
	);
};

export const SymphonyGuidedCursor: React.FC<{
	cursor: SymphonyCursorPose;
	theme: MaestroVisualTheme;
}> = ({ cursor, theme }) => {
	if (!cursor.visible) {
		return null;
	}

	const accent = cursor.pressed ? theme.colors.warning : theme.colors.accentText;
	const haloOpacity = interpolate(cursor.opacity, [0, 1], [0, 0.38], clamp);

	return (
		<div
			style={{
				position: 'absolute',
				left: `${cursor.x * 100}%`,
				top: `${cursor.y * 100}%`,
				transform: `translate(-50%, -50%) scale(${cursor.scale})`,
				opacity: cursor.opacity,
				pointerEvents: 'none',
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: -20,
					borderRadius: 999,
					border: `1px solid ${accent}55`,
					background: `${accent}12`,
					transform: `scale(${cursor.haloScale})`,
					opacity: haloOpacity,
				}}
			/>
			<div
				style={{
					position: 'relative',
					width: 24,
					height: 24,
					borderRadius: 999,
					border: `1px solid ${accent}aa`,
					background: `${theme.colors.bgMain}ee`,
					boxShadow: `0 0 0 6px ${accent}12`,
				}}
			>
				<div
					style={{
						position: 'absolute',
						inset: 6,
						borderRadius: 999,
						background: accent,
					}}
				/>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 34,
					top: -4,
					padding: '8px 12px',
					borderRadius: 999,
					border: `1px solid ${theme.colors.border}`,
					background: `${theme.colors.bgMain}f0`,
					color: accent,
					fontSize: 15,
					letterSpacing: 0.6,
					whiteSpace: 'nowrap',
				}}
			>
				{cursor.hint}
			</div>
		</div>
	);
};

export const SymphonyFlowStrip: React.FC<{
	activeStage: SymphonyFlowStage;
	stages: readonly SymphonyFlowStage[];
	frame: number;
	theme: MaestroVisualTheme;
}> = ({ activeStage, stages, frame, theme }) => {
	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`,
				gap: 10,
			}}
		>
			{stages.map((stage, index) => {
				const reveal = getStaggeredProgress(frame, index, {
					initialDelayFrames: 8,
					stepFrames: 4,
					durationFrames: 16,
				});
				const isActive = stage === activeStage;

				return (
					<div
						key={stage}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 6,
							padding: '10px 12px',
							borderRadius: 16,
							border: `1px solid ${isActive ? `${theme.colors.accent}88` : theme.colors.border}`,
							background: isActive ? theme.colors.accentDim : theme.colors.bgActivity,
							opacity: interpolate(reveal, [0, 1], [0.36, 1], clamp),
							transform: `translate3d(0, ${translateYFromProgress(reveal, 18, 0)}px, 0)`,
						}}
					>
						<div
							style={{
								fontSize: 13,
								letterSpacing: 1.1,
								textTransform: 'uppercase',
								color: theme.colors.textDim,
							}}
						>
							{String(index + 1).padStart(2, '0')}
						</div>
						<div
							style={{
								fontSize: 18,
								color: isActive ? theme.colors.accentText : theme.colors.textMain,
							}}
						>
							{stage}
						</div>
						<div
							style={{
								height: 4,
								borderRadius: 999,
								background: isActive ? `${theme.colors.accent}66` : theme.colors.border,
							}}
						/>
					</div>
				);
			})}
		</div>
	);
};

export const getAnimatedMetricValue = ({
	frame,
	target,
	prefix = '',
	suffix = '',
	decimals = 0,
	delayFrames = 0,
	durationFrames = 30,
}: {
	frame: number;
	target: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
	delayFrames?: number;
	durationFrames?: number;
}) => {
	const progress = getProgress(frame, delayFrames, durationFrames);
	const value = target * progress;
	const display =
		decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-US');

	return `${prefix}${display}${suffix}`;
};

const getProgress = (frame: number, delayFrames: number, durationFrames: number) => {
	return getStaggeredProgress(frame, 0, {
		initialDelayFrames: delayFrames,
		stepFrames: 0,
		durationFrames,
	});
};
