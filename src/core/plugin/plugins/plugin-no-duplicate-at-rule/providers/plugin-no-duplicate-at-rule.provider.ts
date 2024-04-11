import { PluginMediaConfig } from '../../../configs/plugin-media/plugin-media.config';

import { PluginConfigAtRule } from '../../../interfaces/plugin-config.interface';
import { PluginProvider } from '../../../interfaces/plugin.interface';

import { PluginNoDuplicateAtRule } from '../api/plugin-no-duplicate-at-rule';

export const pluginNoDuplicateAtRuleProvider = (): PluginProvider => {
	return {
		provide: PluginNoDuplicateAtRule,
		options: [
			/**
			 * SCSS Media at-rules for minimum breakpoints:
			 * @example @include media-min(md);
			 */
			PluginMediaConfig.MEDIA_MIN_PREFIX_REGEXP_MIXIN,
			/**
			 * SCSS Media at-rules for maximum breakpoints:
			 * @example @include media-max(md);
			 */
			PluginMediaConfig.MEDIA_MAX_PREFIX_REGEXP_MIXIN,
			/**
			 * SCSS Media at-rules for specific breakpoints:
			 * @example @include media-only(md);
			 */
			PluginMediaConfig.MEDIA_ONLY_PREFIX_REGEXP_MIXIN,
			/**
			 * SCSS Media at-rules for range between breakpoints:
			 * @example @include media-between(md, lg);
			 */
			PluginMediaConfig.MEDIA_BETWEEN_PREFIX_REGEXP_MIXIN,
		] as PluginConfigAtRule[],
	};
};
