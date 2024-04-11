import { Rule } from 'stylelint';

export type PluginConfigExecutionMode = 'always' | 'never';
export type PluginConfigData = Pick<Rule, 'primaryOptionArray' | 'messages' | 'meta' | 'ruleName'>;
export type PluginConfigRuleType = PluginConfigRule | PluginConfigAtRule;
export type PluginConfigValidationRule = PluginConfigValidationData<PluginConfigRule>;
export type PluginConfigValidationAtRule = PluginConfigValidationData<PluginConfigAtRule>;

export interface PluginConfigValidationData<T extends PluginConfigRuleType = PluginConfigRuleType> {
	messageFormattedName: string;
	messageName: string;
	rule: T;
}

export interface PluginConfigRule {
	selector: TextPattern;
}

export interface PluginConfigAtRule {
	name: TextPattern;
	params?: TextPattern;
}
