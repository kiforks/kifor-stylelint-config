import { PluginConfigExecutionMode } from '../../../interfaces/plugin-config.interface';
import { PluginProvider } from '../../../interfaces/plugin.interface';

import { PluginSelectorCombinatorNesting } from '../api/plugin-selector-combinator-nesting';

export const pluginSelectorCombinatorNestingProvider = (): PluginProvider => ({
	provide: PluginSelectorCombinatorNesting,
	options: 'always' as PluginConfigExecutionMode,
});
