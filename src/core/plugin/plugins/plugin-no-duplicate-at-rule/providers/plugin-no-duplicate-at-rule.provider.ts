import { PluginMediaConfig } from '../../../configs/plugin-media/plugin-media.config';

import { PluginNoDuplicateAtRule } from '../api/plugin-no-duplicate-at-rule';

import { PluginProvider } from '../../../interfaces/plugin.interface';

export const pluginNoDuplicateAtRuleProvider = (): PluginProvider => ({
	provide: PluginNoDuplicateAtRule,
	options: PluginMediaConfig.AT_RULES,
});
