import { AtRule } from 'postcss';
import Rule from 'postcss/lib/rule';

export type MaxNestingDepthCheckStatementFn = (rule: Rule | AtRule) => false | void;

export interface MaxNestingDepthOptions {
	ignore?: string[];
	ignoreAtRules?: Array<(value: unknown) => value is RegExp>;
	ignorePseudoClasses?: Array<(value: unknown) => value is RegExp>;
	ignoreRules?: Array<(value: unknown) => value is RegExp>;
}
