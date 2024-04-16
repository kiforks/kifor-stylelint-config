import { PluginMediaConfig } from '../../../configs/plugin-media/plugin-media.config';

import { PluginProvider } from '../../../interfaces/plugin.interface';

import { PluginNoDuplicateAtRule } from '../api/plugin-no-duplicate-at-rule';

export const pluginNoDuplicateAtRuleProvider = (): PluginProvider => {
	return {
		provide: PluginNoDuplicateAtRule,
		options: PluginMediaConfig.AT_RULES,
	};
};
