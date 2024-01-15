import { MediaRuleDevice, MediaRulePrefix } from '../interfaces/media-rule.interface';
import { MediaBreakpoint } from '../interfaces/media.interface';

export abstract class MediaConfig {
	public static readonly BREAKPOINTS: readonly MediaBreakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
	public static readonly DEVICES: readonly MediaRuleDevice[] = ['desktop', 'mobile'];

	public static readonly PREFIX: MediaRulePrefix = '^media-';
}
