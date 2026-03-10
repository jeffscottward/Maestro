import type React from 'react';

import { maestroVisualTheme, type MaestroVisualTheme } from '../lib/maestroVisualSystem';

type MetaBadgeProps = {
	label: string;
	tone?: 'accent' | 'neutral';
	theme?: MaestroVisualTheme;
};

export const MetaBadge: React.FC<MetaBadgeProps> = ({
	label,
	tone = 'neutral',
	theme = maestroVisualTheme,
}) => {
	const toneStyles: Record<NonNullable<MetaBadgeProps['tone']>, React.CSSProperties> = {
		accent: {
			backgroundColor: theme.colors.accentDim,
			borderColor: `${theme.colors.accent}55`,
			color: theme.colors.accentText,
		},
		neutral: {
			backgroundColor: theme.colors.bgActivity,
			borderColor: theme.colors.border,
			color: theme.colors.textMain,
		},
	};

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
