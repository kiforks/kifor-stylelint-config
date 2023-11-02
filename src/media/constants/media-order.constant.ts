import { MediaConfig } from '../configs/media.config';
import { MediaOrder } from '../interfaces/media.interface';
import { MediaRuleHelper } from '../helpers/media-rule-helper/media-rule-helper';

export const MEDIA_ORDER: Readonly<MediaOrder> = Object.freeze({
	min: MediaRuleHelper.createBreakpointRulesOrder('min', MediaConfig.BREAKPOINTS),
	max: MediaRuleHelper.createBreakpointRulesOrder('max', MediaConfig.BREAKPOINTS),
	only: MediaRuleHelper.createBreakpointRulesOrder('only', MediaConfig.BREAKPOINTS),
	between: MediaRuleHelper.createBreakpointBetweenRulesOrder(MediaConfig.BREAKPOINTS),
	devices: MediaRuleHelper.createDeviceRulesOrder(MediaConfig.DEVICES),
});
