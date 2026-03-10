import type React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type WorkspaceBootstrapProps = {
	title: string;
	subtitle: string;
};

export const WorkspaceBootstrap: React.FC<WorkspaceBootstrapProps> = ({ title, subtitle }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const enter = spring({
		frame,
		fps,
		config: {
			damping: 200,
		},
	});

	const titleOpacity = interpolate(frame, [0, 24], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const subtitleOpacity = interpolate(frame, [12, 36], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const lift = interpolate(enter, [0, 1], [48, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				background: 'radial-gradient(circle at top left, #36224f 0%, #1c1630 42%, #0d0a17 100%)',
				color: '#f3e9ff',
				fontFamily: '"SF Mono", "IBM Plex Mono", monospace',
				padding: 120,
			}}
		>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					gap: 28,
					transform: `translateY(${lift}px)`,
				}}
			>
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 14,
						alignSelf: 'flex-start',
						border: '2px solid rgba(206, 149, 255, 0.35)',
						borderRadius: 999,
						padding: '14px 22px',
						backgroundColor: 'rgba(49, 30, 74, 0.5)',
						color: '#f48bcc',
						opacity: titleOpacity,
					}}
				>
					<span style={{ fontSize: 26 }}>♪</span>
					<span style={{ fontSize: 32, letterSpacing: 1 }}>Maestro video-production/maestro-remotion</span>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: 18, opacity: titleOpacity }}>
					<h1
						style={{
							fontSize: 86,
							lineHeight: 1,
							margin: 0,
							maxWidth: 1320,
						}}
					>
						{title}
					</h1>
					<p
						style={{
							fontSize: 34,
							lineHeight: 1.4,
							margin: 0,
							maxWidth: 1180,
							color: 'rgba(243, 233, 255, 0.78)',
							opacity: subtitleOpacity,
						}}
					>
						{subtitle}
					</p>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
