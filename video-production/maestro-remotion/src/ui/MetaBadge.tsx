import type React from 'react';

type MetaBadgeProps = {
	label: string;
	tone?: 'accent' | 'neutral';
};

const toneStyles: Record<NonNullable<MetaBadgeProps['tone']>, React.CSSProperties> = {
	accent: {
		backgroundColor: 'rgba(244, 139, 204, 0.14)',
		borderColor: 'rgba(244, 139, 204, 0.32)',
		color: '#ffb0dd',
	},
	neutral: {
		backgroundColor: 'rgba(255, 255, 255, 0.04)',
		borderColor: 'rgba(208, 185, 255, 0.16)',
		color: '#f3e9ff',
	},
};

export const MetaBadge: React.FC<MetaBadgeProps> = ({ label, tone = 'neutral' }) => {
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '10px 16px',
				borderRadius: 999,
				borderWidth: 1,
				borderStyle: 'solid',
				fontSize: 17,
				letterSpacing: 1,
				textTransform: 'uppercase',
				...toneStyles[tone],
			}}
		>
			{label}
		</div>
	);
};
