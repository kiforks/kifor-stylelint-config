import { MediaConfig } from '../../../modules/media/configs/media/media.config';

import { MediaRuleHelper } from '../../../modules/media/helpers/media-rule-helper/media-rule.helper';
import { PluginConfigHelper } from '../../helpers/plugin-config/plugin-config.helper';

import { PluginConfigAtRule } from '../../interfaces/plugin-config.interface';

export abstract class PluginMediaConfig {
	/**
	 * Mixin for applying media prefix in CSS rules.
	 * @example for PluginMediaConfig.MEDIA_PREFIX_MIXIN output is:
	 * { name: 'include', params: '^media-' }.
	 */
	public static readonly PREFIX_MIXIN = PluginConfigHelper.createAtRuleInclude(MediaConfig.PREFIX);

	/**
	 * Regular expression mixin for matching media prefix in CSS rules.
	 * @example for PluginMediaConfig.MEDIA_PREFIX_REGEXP_MIXIN output is:
	 * { name: 'include', params: /^media-/ }.
	 */
	public static readonly PREFIX_REGEXP_MIXIN = PluginConfigHelper.createAtRuleInclude(new RegExp(MediaConfig.PREFIX));

	public static readonly AT_RULES: readonly PluginConfigAtRule[] = PluginConfigHelper.atRuleParamsToRegExp([
		/**
		 * SCSS Media includes for specific devices:
		 * @example @include media-desktop;
		 */
		...MediaRuleHelper.createDeviceConfigRules(MediaConfig.DEVICES),
		/**
		 * SCSS Media includes for minimum breakpoints:
		 * @example @include media-min(md);
		 */
		...MediaRuleHelper.createBreakpointConfigRules('min', MediaConfig.BREAKPOINTS),
		/**
		 * SCSS Media includes for maximum breakpoints:
		 * @example @include media-max(md);
		 */
		...MediaRuleHelper.createBreakpointConfigRules('max', MediaConfig.BREAKPOINTS),
		/**
		 * SCSS Media includes for specific breakpoints:
		 * @example @include media-only(md);
		 */
		...MediaRuleHelper.createBreakpointConfigRules('only', MediaConfig.BREAKPOINTS),
		/**
		 * SCSS Media includes for range between breakpoints:
		 * @example @include media-between(md, lg);
		 */
		...MediaRuleHelper.createBreakpointBetweenConfigRules(MediaConfig.BREAKPOINTS),
	]);
}
