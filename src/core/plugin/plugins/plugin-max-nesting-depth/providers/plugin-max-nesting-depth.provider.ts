import { PluginProvider } from '../../../interfaces/plugin.interface';
import { PluginMaxNestingDepthOptions } from '../interfaces/plugin-max-nesting-depth.interface';

import { PluginMaxNestingDepth } from '../api/plugin-max-nesting-depth';

export const pluginMaxNestingDepthProvider = (): PluginProvider => ({
	provide: PluginMaxNestingDepth,
	options: [
		3,
		{
			ignore: ['pseudo-classes'],
			ignoreRules: ['/^&::/', '/^::/'],
			ignoreAtRules: ['/^\\include/', '/^\\media/'],
			ignoreHostSelectors: [/:host/],
		},
	] as PluginMaxNestingDepthOptions,
});
