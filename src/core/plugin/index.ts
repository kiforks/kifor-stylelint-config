import { MediaConfig } from '../../media/configs/media.config';

import { PluginProvider } from './interfaces/plugin.interface';
import { PluginMaxNestingDepthOptions } from './plugins/max-nesting-depth/interfaces/plugin-max-nesting-depth.interface';

import { PluginMaxNestingDepth } from './plugins/max-nesting-depth/api/plugin-max-nesting-depth';

export * from './plugins/max-nesting-depth/api/plugin-max-nesting-depth';
export * from './plugins/plugin-base/api/plugin-base';

export const plugins: PluginProvider[] = [
	{
		provide: PluginMaxNestingDepth,
		options: [
			3,
			{
				ignore: ['blockless-at-rules', 'pseudo-classes'],
				ignoreRules: ['/^&::/', '/^::/'],
				ignoreHostSelector: ['/^:host/'],
				ignoreAtRules: ['/^\\include/', `/^\\${MediaConfig.NAME}/`],
			},
		] as PluginMaxNestingDepthOptions,
	},
];
