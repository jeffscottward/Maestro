import { Composition, Folder } from 'remotion';

import { compositionDefinitions } from './lib/composition-registry';

export const RemotionRoot = () => {
	return (
		<Folder name="Foundation">
			{compositionDefinitions.map((definition) => (
				<Composition
					key={definition.id}
					id={definition.id}
					component={definition.component}
					durationInFrames={definition.durationInFrames}
					fps={definition.fps}
					width={definition.width}
					height={definition.height}
					defaultProps={definition.defaultProps}
					schema={definition.schema}
				/>
			))}
		</Folder>
	);
};
