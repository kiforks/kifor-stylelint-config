import { Rule, RuleAt } from '../../../../rule/interfaces/rule.interface';
import { PluginRule } from '../../../interfaces/plugin.interface';

export type PluginNoSelfNestingName = string;
export type PluginNoSelfNestingScopeName = string;
export type PluginNoSelfNestingOptions = Array<RuleAt | Rule>;
export type PluginNoSelfNestingMessageArgs = [PluginNoSelfNestingName, PluginNoSelfNestingScopeName];

export interface PluginNoSelfNestingData {
	scopeName: PluginNoSelfNestingScopeName;
	violatedName: PluginNoSelfNestingName;
	violatedNode: PluginRule;
}
