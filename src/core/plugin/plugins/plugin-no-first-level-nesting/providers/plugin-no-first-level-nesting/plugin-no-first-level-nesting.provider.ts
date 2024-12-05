import { PluginMediaConfig } from '@plugin/configs';

import { PluginNoFirstLevelNesting } from '../../api';

import { PluginConfigHelper } from '@plugin/helpers';

import { PluginConfigRuleType, PluginProvider } from '@plugin/interfaces';

export const pluginNoFirstLevelNestingProvider = (): PluginProvider => ({
	provide: PluginNoFirstLevelNesting,
	options: [
		PluginConfigHelper.createRule(/^(?![a-zA-Z.#])(?!(?::host|:root)).*$/),
		PluginConfigHelper.createAtRule(/^media/),

		/**
		 * SCSS Media at-rules for breakpoints:
		 * @example @include media-min(md);
		 */
		PluginMediaConfig.PREFIX_REGEXP_MIXIN,
	] as PluginConfigRuleType[],
});
