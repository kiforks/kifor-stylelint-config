import { Rule, RuleAt } from '../../../../rule/interfaces/rule.interface';
import { PluginRule } from '../../../interfaces/plugin.interface';

export type PluginNoNestingName = string;
export type PluginNoNestingScopeName = string;
export type PluginNoNestingOptions = Array<RuleAt | Rule>;
export type PluginNoNestingMessageArgs = [PluginNoNestingName, PluginNoNestingScopeName];

export interface PluginNoNestingData {
	scopeName: PluginNoNestingScopeName;
	violatedName: PluginNoNestingName;
	violatedNode: PluginRule;
}
