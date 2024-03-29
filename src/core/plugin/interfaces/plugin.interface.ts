import type * as PostCSS from 'postcss';
import { AtRule } from 'postcss';
import Rule from 'postcss/lib/rule';
import stylelint, { Config, PostcssResult, Problem, RuleContext, RuleOptions, Rule as StylelintRule } from 'stylelint';

import { PluginBase } from '../plugins/plugin-base/api/plugin-base';

export type PluginRule = Rule | AtRule;
export type PluginRules = Config['rules'];
export type PluginPlugins = Array<string | stylelint.Plugin>;
export type PluginProvide = new () => PluginBase;
export type PluginConstructor = new (...args: any[]) => Config;
export type PluginRegExp = string | RegExp;
export type PluginRegExpArray = PluginRegExp[];
export type PluginRuleBaseFn = (root: PostCSS.Root, result: PostcssResult) => Promise<void> | void;
export type PluginCheckStatementFn = (rule: PluginRule) => false | void;
export type PluginOptions<O = unknown> = O;
export type PluginSecondaryOptions<S = unknown> = Record<string, S>;
export type PluginConfigData = Pick<StylelintRule, 'primaryOptionArray' | 'messages' | 'meta' | 'ruleName'>;
export type PluginRuleOptions = RuleOptions;
export type PluginProblem = Omit<Problem, 'ruleName' | 'result' | 'message'>;
export type PluginCheckFn = <O = unknown, S = unknown>(
	result: PostcssResult,
	options: O,
	secondaryOptions?: PluginSecondaryOptions<S>
) => void;

export interface PluginData<O = unknown, S = unknown> {
	context: RuleContext;
	options: PluginOptions<O>;
	result: PostcssResult;
	root: PostCSS.Root;
	secondaryOptions: PluginSecondaryOptions<S>;
}

export interface PluginCheckData<O = unknown, S = unknown>
	extends Pick<PluginData<O, S>, 'result' | 'options' | 'secondaryOptions'> {
	rule: PluginRule;
}

export interface PluginProvider<T = unknown> {
	options: T;
	provide: PluginProvide;
}

export interface PluginDecoratorConfig {
	providers: PluginProvider[];
}
