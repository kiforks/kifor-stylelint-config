import { PluginMaxNestingDepth } from '../../api';

import { PluginMaxNestingDepthOptions } from '../../interfaces';
import { PluginProvider } from '@plugin/interfaces';

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
