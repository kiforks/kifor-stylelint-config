import { AtRule } from 'postcss';
import Rule from 'postcss/lib/rule';
import { RuleOptionsPossible } from 'stylelint';

import { PluginIgnoreRegExpArray } from '../../../interfaces/plugin.interface';

export type PluginMaxNestingDepthCheckStatementFn = (rule: Rule | AtRule) => false | void;

export type PluginMaxNestingDepthIgnore = 'blockless-at-rules' | 'pseudo-classes';
export type PluginMaxNestingDepthMainOptions = number;
export type PluginMaxNestingDepthOptions =
	| PluginMaxNestingDepthMainOptions
	| [number, PluginMaxNestingDepthSecondaryOptions];

export type PluginMaxNestingDepthPossibleOptions = Record<
	keyof PluginMaxNestingDepthSecondaryOptions,
	RuleOptionsPossible[]
>;

export interface PluginMaxNestingDepthSecondaryOptions {
	ignore?: PluginMaxNestingDepthIgnore[];
	ignoreAtRules?: PluginIgnoreRegExpArray;
	ignoreHostSelector?: PluginIgnoreRegExpArray;
	ignorePseudoClasses?: PluginIgnoreRegExpArray;
	ignoreRules?: PluginIgnoreRegExpArray;
}
