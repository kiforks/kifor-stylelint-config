import type * as PostCSS from 'postcss';
import { AtRule, Node } from 'postcss';
import parser from 'postcss-selector-parser';
import Rule from 'postcss/lib/rule';
import stylelint, { PostcssResult, RuleBase, RuleContext } from 'stylelint';
import hasBlock from 'stylelint/lib/utils/hasBlock.mjs';
import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';
import optionsMatches from 'stylelint/lib/utils/optionsMatches.mjs';
import { isAtRule, isDeclaration, isRoot, isRule } from 'stylelint/lib/utils/typeGuards.mjs';
import { isNumber, isRegExp, isString } from 'stylelint/lib/utils/validateTypes.mjs';

import { PluginConfig } from '../../../configs/plugin.config';

import { PluginBase } from '../../plugin-base/api/plugin-base';

import { MaxNestingDepthOptions } from '../interfaces/max-nesting-depth.interface';

const {
	utils: { report, ruleMessages, validateOptions },
} = stylelint;

export class MaxNestingDepthPlugin extends PluginBase {
	public static readonly RULE_NAME = `${PluginConfig.NAMESPACE}/max-nesting-depth`;

	protected readonly ruleName = MaxNestingDepthPlugin.RULE_NAME;
	protected readonly meta = {
		url: PluginConfig.REPOSITORY_URL,
	};
	protected readonly messages = ruleMessages(this.ruleName, {
		expected: depth => `Expected nesting depth to be no more than ${depth}`,
	});

	private maxDepth: number = 0;

	protected readonly ruleBase: RuleBase = (
		maxDepth: number,
		secondaryOptions: MaxNestingDepthOptions,
		_context: RuleContext
	) => {
		return (root: PostCSS.Root, result: PostcssResult): void => {
			this.maxDepth = maxDepth;

			const validOptions = validateOptions(
				result,
				this.ruleName,
				{
					actual: maxDepth,
					possible: [isNumber],
				},
				{
					optional: true,
					actual: secondaryOptions,
					possible: {
						ignore: ['blockless-at-rules', 'pseudo-classes'],
						ignoreAtRules: [isString, isRegExp],
						ignoreRules: [isString, isRegExp],
						ignorePseudoClasses: [isString, isRegExp],
					},
				}
			);

			if (!validOptions) return;

			root.walkRules(this.checkStatement(result, secondaryOptions));
			root.walkAtRules(this.checkStatement(result, secondaryOptions));
		};
	};

	private checkStatement(result: PostcssResult, secondaryOptions: MaxNestingDepthOptions) {
		return (rule: Rule | AtRule): false | void => {
			if (this.isIgnoreAtRule(rule, secondaryOptions)) {
				return;
			}

			if (this.isIgnoreRule(rule, secondaryOptions)) {
				return;
			}

			if (!hasBlock(rule)) {
				return;
			}

			if (isRule(rule) && !isStandardSyntaxRule(rule)) {
				return;
			}

			const depth = this.nestingDepth(rule, 0, secondaryOptions);

			if (depth > this.maxDepth) {
				report({
					ruleName: this.ruleName,
					result,
					node: rule,
					message: this.messages.expected,
					messageArgs: [this.maxDepth],
				});
			}
		};
	}

	private nestingDepth(node: Node, level: number, secondaryOptions: MaxNestingDepthOptions): number {
		const parent = node.parent;

		if (!parent) {
			return 0;
		}

		if (this.isIgnoreAtRule(parent)) {
			return 0;
		}

		// The nesting maxDepth level's computation has finished
		// when this function, recursively called, receives
		// a node that is not nested -- a direct child of the
		// root node
		if (isRoot(parent) || (isAtRule(parent) && parent.parent && isRoot(parent.parent))) {
			return level;
		}

		/**
		 * @param {string[]} selectors
		 * @returns {boolean}
		 */

		if (
			(optionsMatches(secondaryOptions, 'ignore', 'blockless-at-rules') &&
				isAtRule(node) &&
				node.every(child => !isDeclaration(child))) ||
			(optionsMatches(secondaryOptions, 'ignore', 'pseudo-classes') &&
				isRule(node) &&
				this.containsPseudoClassesOnly(node.selector)) ||
			(isRule(node) && this.containsIgnoredPseudoClassesOrRulesOnly(node.selectors, secondaryOptions))
		) {
			return this.nestingDepth(parent, level, secondaryOptions);
		}

		// Unless any of the conditions above apply, we want to
		// add 1 to the nesting maxDepth level and then check the parent,
		// continuing to add and move up the hierarchy
		// until we hit the root node
		return this.nestingDepth(parent, level + 1, secondaryOptions);
	}

	private isIgnoreRule(node: Node, secondaryOptions: MaxNestingDepthOptions = {}): boolean {
		return isRule(node) && optionsMatches(secondaryOptions, 'ignoreRules', node.selector);
	}

	private isIgnoreAtRule(node: Node, secondaryOptions: MaxNestingDepthOptions = {}): boolean {
		return isAtRule(node) && optionsMatches(secondaryOptions, 'ignoreAtRules', node.name);
	}

	private containsPseudoClassesOnly(selector: string): boolean {
		const normalized = parser().processSync(selector, { lossless: false });
		const selectors = normalized.split(',');

		return selectors.every(item => this.extractPseudoRule(item));
	}

	private containsIgnoredPseudoClassesOrRulesOnly(
		selectors: string[],
		secondaryOptions: MaxNestingDepthOptions
	): boolean {
		if (!(secondaryOptions && (secondaryOptions.ignorePseudoClasses || secondaryOptions.ignoreRules))) {
			return false;
		}

		return selectors.every(selector => {
			if (secondaryOptions.ignoreRules && optionsMatches(secondaryOptions, 'ignoreRules', selector)) return true;

			if (!secondaryOptions.ignorePseudoClasses) return false;

			const pseudoRule = this.extractPseudoRule(selector);

			if (!pseudoRule) return false;

			return optionsMatches(secondaryOptions, 'ignorePseudoClasses', pseudoRule);
		});
	}

	private extractPseudoRule(selector: string): Nullable<string> {
		return selector.startsWith('&:') && selector[2] !== ':' ? selector.slice(2) : undefined;
	}
}
