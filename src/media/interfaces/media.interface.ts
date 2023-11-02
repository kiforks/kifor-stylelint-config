import {
	MediaRuleAtOrderBreakpoint,
	MediaRuleAtOrderBreakpointBetween,
	MediaRuleAtOrderDevice,
	MediaRuleDevice,
} from './media-rule.interface';

export type MediaBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface MediaOrder {
	readonly between: ReadonlyArray<MediaRuleAtOrderBreakpointBetween<MediaBreakpoint, MediaBreakpoint>>;
	readonly devices: ReadonlyArray<MediaRuleAtOrderDevice<MediaRuleDevice>>;
	readonly max: ReadonlyArray<MediaRuleAtOrderBreakpoint<'max', MediaBreakpoint>>;
	readonly min: ReadonlyArray<MediaRuleAtOrderBreakpoint<'min', MediaBreakpoint>>;
	readonly only: ReadonlyArray<MediaRuleAtOrderBreakpoint<'only', MediaBreakpoint>>;
}
