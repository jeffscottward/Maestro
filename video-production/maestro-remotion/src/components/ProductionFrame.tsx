import type React from 'react';
import { AbsoluteFill } from 'remotion';

type ProductionFrameProps = {
	children: React.ReactNode;
};

export const ProductionFrame: React.FC<ProductionFrameProps> = ({ children }) => {
	return (
		<AbsoluteFill
			style={{
				background:
					'radial-gradient(circle at top left, rgba(54, 34, 79, 0.96) 0%, rgba(23, 16, 41, 0.98) 46%, #09070f 100%)',
				color: '#f3e9ff',
				fontFamily: '"SF Mono", "IBM Plex Mono", monospace',
				overflow: 'hidden',
			}}
		>
			<AbsoluteFill
				style={{
					backgroundImage:
						'linear-gradient(rgba(201, 165, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(201, 165, 255, 0.08) 1px, transparent 1px)',
					backgroundSize: '72px 72px',
					maskImage: 'linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 92%)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 40,
					borderRadius: 34,
					border: '1px solid rgba(204, 178, 255, 0.18)',
					backgroundColor: 'rgba(12, 10, 20, 0.56)',
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
