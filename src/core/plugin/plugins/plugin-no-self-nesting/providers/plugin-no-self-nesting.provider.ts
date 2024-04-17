import { PluginMediaConfig } from '../../../configs/plugin-media/plugin-media.config';

import { PluginNoSelfNesting } from '../api/plugin-no-self-nesting';

import { PluginConfigHelper } from '../../../helpers/plugin-config/plugin-config.helper';

import { PluginConfigRuleType } from '../../../interfaces/plugin-config.interface';
import { PluginProvider } from '../../../interfaces/plugin.interface';

export const pluginNoSelfNestingProvider = (): PluginProvider => ({
	provide: PluginNoSelfNesting,
	options: [
		PluginConfigHelper.createRule('body'),
		PluginConfigHelper.createRule('html'),
		PluginConfigHelper.createRule('main'),
		PluginConfigHelper.createRule('h1'),
		PluginConfigHelper.createRule(/^:host/),
		PluginConfigHelper.createRule(/^&:host/),
		PluginConfigHelper.createRule(/^::ng-deep/),
		PluginConfigHelper.createRule(/^&::ng-deep/),

		/**
		 * SCSS Media at-rules for breakpoints:
		 * @example @include media-min(md);
		 */
		PluginMediaConfig.PREFIX_REGEXP_MIXIN,
	] as PluginConfigRuleType[],
});
