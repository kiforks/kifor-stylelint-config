import { PluginMediaConfig } from '../../../configs/plugin-media/plugin-media.config';

import { PluginNoFirstLevelNesting } from '../api/plugin-no-first-level-nesting';

import { PluginConfigHelper } from '../../../helpers/plugin-config/plugin-config.helper';

import { PluginConfigRuleType } from '../../../interfaces/plugin-config.interface';
import { PluginProvider } from '../../../interfaces/plugin.interface';

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
