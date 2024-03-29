import { MediaConfig } from '../../configs/media.config';

import { RuleHelper } from '../../../../core/rule/helpers/rule-order/rule.helper';

import {
	MediaRuleAtOrderBreakpoint,
	MediaRuleAtOrderBreakpointBetween,
	MediaRuleAtOrderDevice,
	MediaRuleBreakpointBetweenParameter,
	MediaRuleBreakpointParameter,
	MediaRuleBreakpointPrefix,
	MediaRuleDevice,
	MediaRuleFullDevicePrefix,
} from '../../interfaces/media-rule.interface';
import { MediaBreakpoint } from '../../interfaces/media.interface';

export abstract class MediaRuleHelper {
	/**
	 * Generates a device-specific media rule prefix.
	 * @param device - Type of device (e.g., 'mobile' or 'desktop').
	 * @example: For getDevicePrefixParameter('mobile'), the output is: '^media-mobile'.
	 */
	public static getDevicePrefixParameter<D extends MediaRuleDevice>(device: D): MediaRuleFullDevicePrefix<D> {
		return `${MediaConfig.PREFIX}${device}`;
	}

	/**
	 * Generates a breakpoint-specific media rule prefix.
	 * @param prefix - Type of breakpoint prefix (e.g., 'min', 'max').
	 * @param breakpoint - Media breakpoint value (e.g., 'xs', 'sm').
	 * @example: For getBreakpointPrefixParameter('min', 'sm'), the output is: '^media-min(sm)'.
	 */
	public static getBreakpointPrefixParameter<P extends MediaRuleBreakpointPrefix, B extends MediaBreakpoint>(
		prefix: P,
		breakpoint: B
	): MediaRuleBreakpointParameter<P, B> {
		return `${MediaConfig.PREFIX}${prefix}(${breakpoint})`;
	}

	/**
	 * @param breakpointFrom - Media breakpoint value (e.g., 'xs', 'sm').
	 * @param breakpointTo - Media breakpoint value (e.g., 'xs', 'sm').
	 * @example: For getBreakpointBetweenPrefixParameter('xs', 'sm'), the output is: '^media-between(xs, sm)'.
	 */
	public static getBreakpointBetweenPrefixParameter<FROM extends MediaBreakpoint, TO extends MediaBreakpoint>(
		breakpointFrom: FROM,
		breakpointTo: TO
	): MediaRuleBreakpointBetweenParameter<FROM, TO> {
		return `${MediaConfig.PREFIX}between(${breakpointFrom}, ${breakpointTo})`;
	}

	/**
	 * @param device - Type of device.
	 * @example: For createDeviceRuleOrder('mobile'), the output is: { type: 'at-rule', name: 'include', parameter: '^media-mobile' }.
	 */
	public static createDeviceRuleOrder<D extends MediaRuleDevice>(device: D): Readonly<MediaRuleAtOrderDevice<D>> {
		return RuleHelper.createInclude(MediaRuleHelper.getDevicePrefixParameter(device));
	}

	/**
	 * @param prefix - Type of breakpoint prefix.
	 * @param breakpoint - Media breakpoint value.
	 * @example: For createBreakpointRuleOrder('min', 'sm'), the output is:
	 * { type: 'at-rule', name: 'include', parameter: '^media-min(sm)' }.
	 */
	public static createBreakpointRuleOrder<P extends MediaRuleBreakpointPrefix, B extends MediaBreakpoint>(
		prefix: P,
		breakpoint: B
	): Readonly<MediaRuleAtOrderBreakpoint<P, B>> {
		return RuleHelper.createInclude(MediaRuleHelper.getBreakpointPrefixParameter(prefix, breakpoint));
	}

	/**
	 * @param breakpointFrom - Media breakpoint value (e.g., 'xs', 'sm').
	 * @param breakpointTo - Media breakpoint value (e.g., 'xs', 'sm').
	 * @example: For createBreakpointBetweenRuleOrder('xs', 'sm'), the output is:
	 * { type: 'at-rule', name: 'include', parameter: '^media-between(xs, sm)' }.
	 */
	public static createBreakpointBetweenRuleOrder<FROM extends MediaBreakpoint, TO extends MediaBreakpoint>(
		breakpointFrom: FROM,
		breakpointTo: TO
	): Readonly<MediaRuleAtOrderBreakpointBetween<FROM, TO>> {
		return RuleHelper.createInclude(MediaRuleHelper.getBreakpointBetweenPrefixParameter(breakpointFrom, breakpointTo));
	}

	/**
	 * @param devices - Array of devices.
	 * @example: For createDeviceRulesOrder(['mobile', 'desktop']), the output is:
	 * [
	 *    { type: 'at-rule', name: 'include', parameter: '^media-mobile' },
	 *    { type: 'at-rule', name: 'include', parameter: '^media-desktop' }
	 * ].
	 */
	public static createDeviceRulesOrder<D extends MediaRuleDevice>(
		devices: readonly D[]
	): ReadonlyArray<MediaRuleAtOrderDevice<D>> {
		return devices.map(value => MediaRuleHelper.createDeviceRuleOrder(value));
	}

	/**
	 * @param prefix - Type of breakpoint prefix.
	 * @param breakpoints - Array of media breakpoints.
	 * @example: For createBreakpointRulesOrder('min', ['sm', 'md']), the output is:
	 * [
	 *    { type: 'at-rule', name: 'include', parameter: '^media-min(sm)' },
	 *    { type: 'at-rule', name: 'include', parameter: '^media-min(md)' }
	 * ].
	 */
	public static createBreakpointRulesOrder<P extends MediaRuleBreakpointPrefix, B extends MediaBreakpoint>(
		prefix: P,
		breakpoints: readonly B[]
	): ReadonlyArray<MediaRuleAtOrderBreakpoint<P, B>> {
		return breakpoints.map(value => MediaRuleHelper.createBreakpointRuleOrder(prefix, value));
	}

	/**
	 * @param breakpoints - Array of media breakpoints.
	 * @example: For createBreakpointBetweenRulesOrder(['xs', 'sm', 'md']), the output is:
	 * [
	 *    { type: 'at-rule', name: 'include', parameter: '^media-between(xs, sm)' },
	 *    { type: 'at-rule', name: 'include', parameter: '^media-between(xs, md)' },
	 *    { type: 'at-rule', name: 'include', parameter: '^media-between(sm, md)' },
	 * ].
	 */
	public static createBreakpointBetweenRulesOrder<B extends MediaBreakpoint>(
		breakpoints: readonly B[]
	): ReadonlyArray<MediaRuleAtOrderBreakpointBetween<B, B>> {
		return breakpoints.flatMap((current, idx, arr) =>
			arr.slice(idx + 1).map(next => MediaRuleHelper.createBreakpointBetweenRuleOrder(current, next))
		);
	}
}
