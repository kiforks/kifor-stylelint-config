import { MediaConfig } from '../../../modules/media/configs/media/media.config';

import { MediaRuleHelper } from '../../../modules/media/helpers/media-rule-helper/media-rule.helper';
import { PluginConfigHelper } from '../../helpers/plugin-config/plugin-config.helper';

export abstract class PluginMediaConfig {
	/**
	 * Mixin for applying media prefix in CSS rules.
	 * @example for PluginMediaConfig.MEDIA_PREFIX_MIXIN output is:
	 * { name: 'include', params: '^media-' }.
	 */
	public static readonly MEDIA_PREFIX_MIXIN = PluginConfigHelper.createAtRuleInclude(MediaConfig.PREFIX);

	/**
	 * Regular expression mixin for matching media prefix in CSS rules.
	 * @example for PluginMediaConfig.MEDIA_PREFIX_REGEXP_MIXIN output is:
	 * { name: 'include', params: /^media-/ }.
	 */
	public static readonly MEDIA_PREFIX_REGEXP_MIXIN = PluginConfigHelper.createAtRuleInclude(
		new RegExp(MediaConfig.PREFIX)
	);

	/**
	 * Mixin for creating minimum width media queries.
	 * @example for PluginMediaConfig.MEDIA_MIN_PREFIX_MIXIN output is:
	 * { name: 'include', params: '^media-min' }.
	 */
	public static readonly MEDIA_MIN_PREFIX_MIXIN = PluginConfigHelper.createAtRuleInclude(
		MediaRuleHelper.getRuleFullBreakpointPrefix('min')
	);

	/**
	 * Mixin for creating maximum width media queries.
	 * @example for PluginMediaConfig.MEDIA_MAX_PREFIX_MIXIN output is:
	 * { name: 'include', params: '^media-max' }.
	 */
	public static readonly MEDIA_MAX_PREFIX_MIXIN = PluginConfigHelper.createAtRuleInclude(
		MediaRuleHelper.getRuleFullBreakpointPrefix('max')
	);

	/**
	 * Mixin for media queries targeting a specific breakpoint only.
	 * @example for PluginMediaConfig.MEDIA_ONLY_PREFIX_MIXIN output is:
	 * { name: 'include', params: '^media-only' }.
	 */
	public static readonly MEDIA_ONLY_PREFIX_MIXIN = PluginConfigHelper.createAtRuleInclude(
		MediaRuleHelper.getRuleFullBreakpointPrefix('only')
	);

	/**
	 * Mixin for media queries targeting a range of breakpoints.
	 * @example for PluginMediaConfig.MEDIA_BETWEEN_PREFIX_MIXIN output is:
	 * { name: 'include', params: '^media-between' }.
	 */
	public static readonly MEDIA_BETWEEN_PREFIX_MIXIN = PluginConfigHelper.createAtRuleInclude(
		MediaRuleHelper.getRuleFullBreakpointPrefix('between')
	);

	/**
	 * Regular expression mixin for creating minimum width media queries.
	 * @example for PluginMediaConfig.MEDIA_MIN_PREFIX_REGEXP_MIXIN output is:
	 * { name: 'include', params: /^media-min/ }.
	 */
	public static readonly MEDIA_MIN_PREFIX_REGEXP_MIXIN = PluginConfigHelper.createAtRuleInclude(
		new RegExp(MediaRuleHelper.getRuleFullBreakpointPrefix('min'))
	);

	/**
	 * Regular expression mixin for creating maximum width media queries.
	 * @example for PluginMediaConfig.MEDIA_MAX_PREFIX_REGEXP_MIXIN output is:
	 * { name: 'include', params: /^media-max/ }.
	 */
	public static readonly MEDIA_MAX_PREFIX_REGEXP_MIXIN = PluginConfigHelper.createAtRuleInclude(
		new RegExp(MediaRuleHelper.getRuleFullBreakpointPrefix('max'))
	);

	/**
	 * Regular expression mixin for media queries targeting a specific breakpoint only.
	 * @example for PluginMediaConfig.MEDIA_ONLY_PREFIX_REGEXP_MIXIN output is:
	 * { name: 'include', params: /^media-only/ }.
	 */
	public static readonly MEDIA_ONLY_PREFIX_REGEXP_MIXIN = PluginConfigHelper.createAtRuleInclude(
		new RegExp(MediaRuleHelper.getRuleFullBreakpointPrefix('only'))
	);

	/**
	 * Regular expression mixin for media queries targeting a range of breakpoints.
	 * @example for PluginMediaConfig.MEDIA_BETWEEN_PREFIX_REGEXP_MIXIN output is:
	 * { name: 'include', params: /^media-between/ }.
	 */
	public static readonly MEDIA_BETWEEN_PREFIX_REGEXP_MIXIN = PluginConfigHelper.createAtRuleInclude(
		new RegExp(MediaRuleHelper.getRuleFullBreakpointPrefix('between'))
	);
}
