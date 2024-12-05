import { PluginSelectorCombinatorNesting } from '../../api';

import { PluginConfigExecutionMode, PluginProvider } from '@plugin/interfaces';

export const pluginSelectorCombinatorNestingProvider = (): PluginProvider => ({
	provide: PluginSelectorCombinatorNesting,
	options: 'always' as PluginConfigExecutionMode,
});
