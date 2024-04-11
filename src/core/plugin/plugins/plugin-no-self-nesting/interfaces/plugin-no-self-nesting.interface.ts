import { PluginRuleType } from '../../../interfaces/plugin.interface';

export type PluginNoSelfNestingName = string;
export type PluginNoSelfNestingScopeName = string;
export type PluginNoSelfNestingMessageArgs = [PluginNoSelfNestingName, PluginNoSelfNestingScopeName];

export interface PluginNoSelfNestingData {
	scopeName: PluginNoSelfNestingScopeName;
	violatedName: PluginNoSelfNestingName;
	violatedNode: PluginRuleType;
}
