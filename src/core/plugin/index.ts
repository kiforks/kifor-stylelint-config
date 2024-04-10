import { PluginProvider } from './interfaces/plugin.interface';

import { pluginMaxNestingDepthProvider } from './plugins/plugin-max-nesting-depth/providers/plugin-max-nesting-depth.provider';
import { pluginNoDuplicateAtRuleProvider } from './plugins/plugin-no-duplicate-at-rule/providers/plugin-no-duplicate-at-rule.provider';
import { pluginNoSelfNestingProvider } from './plugins/plugin-no-self-nesting/providers/plugin-no-self-nesting.provider';

export * from './plugins/plugin-max-nesting-depth/api/plugin-max-nesting-depth';
export * from './plugins/plugin-base/api/plugin-base';

export const plugins: PluginProvider[] = [
	pluginMaxNestingDepthProvider(),
	pluginNoSelfNestingProvider(),
	pluginNoDuplicateAtRuleProvider(),
];
