import type React from 'react';
import { AbsoluteFill } from 'remotion';

import { maestroVisualTheme, type MaestroVisualTheme } from '../lib/maestroVisualSystem';

type ProductionFrameProps = {
	children: React.ReactNode;
	theme?: MaestroVisualTheme;
};

export const ProductionFrame: React.FC<ProductionFrameProps> = ({
	children,
	theme = maestroVisualTheme,
}) => {
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at top left, ${theme.colors.accentDim} 0%, ${theme.colors.bgSidebar} 44%, ${theme.colors.bgMain} 100%)`,
				color: theme.colors.textMain,
				fontFamily: '"SF Mono", "IBM Plex Mono", monospace',
				overflow: 'hidden',
			}}
		>
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${theme.colors.accent}14 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.accent}14 1px, transparent 1px)`,
					backgroundSize: '72px 72px',
					maskImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 92%)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 40,
					borderRadius: 34,
					border: `1px solid ${theme.colors.border}`,
					backgroundColor: `${theme.colors.bgMain}cc`,
					boxShadow: '0 24px 80px rgba(7, 4, 14, 0.45)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 72,
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{children}
			</div>
		</AbsoluteFill>
	);
};
