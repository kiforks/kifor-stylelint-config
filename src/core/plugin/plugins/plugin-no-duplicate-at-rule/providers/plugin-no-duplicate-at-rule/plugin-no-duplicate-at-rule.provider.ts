import { PluginMediaConfig } from '@plugin/configs';

import { PluginNoDuplicateAtRule } from '../../api';

import { PluginProvider } from '@plugin/interfaces';

export const pluginNoDuplicateAtRuleProvider = (): PluginProvider => ({
	provide: PluginNoDuplicateAtRule,
	options: PluginMediaConfig.AT_RULES,
});
