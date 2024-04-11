import { OrderAtRule } from '../../order/interfaces/order.interface';
import { MediaBreakpoint } from './media.interface';

export type MediaRuleDevice = 'mobile' | 'desktop';
export type MediaRulePrefix = '^media-'; // Base prefix for media rules.

// Different types of prefixes for media rules based on breakpoints.
export type MediaRuleMinPrefix = 'min';
export type MediaRuleMaxPrefix = 'max';
export type MediaRuleOnlyPrefix = 'only';
export type MediaRuleBetweenPrefix = 'between';

export type MediaRuleBreakpointPrefix =
	| MediaRuleMinPrefix
	| MediaRuleMaxPrefix
	| MediaRuleOnlyPrefix
	| MediaRuleBetweenPrefix;

// Template literal types to generate full prefixes.
export type MediaRuleFullBreakpointPrefix<P extends MediaRuleBreakpointPrefix> = `${MediaRulePrefix}${P}`;
export type MediaRuleFullDevicePrefix<D extends MediaRuleDevice> = `${MediaRulePrefix}${D}`;

// Template literal types to generate media rule parameters with prefixes and breakpoints.
export type MediaRuleBreakpointParameter<
	P extends MediaRuleBreakpointPrefix,
	B extends MediaBreakpoint,
> = `${MediaRuleFullBreakpointPrefix<P>}(${B})`;

export type MediaRuleBreakpointBetweenParameter<
	FROM extends MediaBreakpoint,
	TO extends MediaBreakpoint,
> = `${MediaRuleFullBreakpointPrefix<MediaRuleBetweenPrefix>}(${FROM}, ${TO})`;

// Types for rule orders based on devices and breakpoints.
export type MediaAtRuleOrderDevice<D extends MediaRuleDevice> = OrderAtRule<MediaRuleFullDevicePrefix<D>>;
export type MediaAtRuleOrderBreakpoint<P extends MediaRuleBreakpointPrefix, B extends MediaBreakpoint> = OrderAtRule<
	MediaRuleBreakpointParameter<P, B>
>;
export type MediaAtRuleOrderBreakpointBetween<FROM extends MediaBreakpoint, TO extends MediaBreakpoint> = OrderAtRule<
	MediaRuleBreakpointBetweenParameter<FROM, TO>
>;
