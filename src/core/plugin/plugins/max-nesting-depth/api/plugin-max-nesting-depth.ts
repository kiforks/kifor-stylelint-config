import type * as PostCSS from 'postcss';
import { Node } from 'postcss';
import parser from 'postcss-selector-parser';
import stylelint, { PostcssResult, Problem, RuleBase, RuleOptions } from 'stylelint';
import hasBlock from 'stylelint/lib/utils/hasBlock.mjs';
import isStandardSyntaxRule from 'stylelint/lib/utils/isStandardSyntaxRule.mjs';
import optionsMatches from 'stylelint/lib/utils/optionsMatches.mjs';
import { isAtRule, isDeclaration, isRoot, isRule } from 'stylelint/lib/utils/typeGuards.mjs';
import { isBoolean, isNumber, isRegExp, isString } from 'stylelint/lib/utils/validateTypes.mjs';

import { PluginConfig } from '../../../configs/plugin.config';

import {
	PluginMaxNestingDepthCheckStatementFn,
	PluginMaxNestingDepthPossibleOptions,
	PluginMaxNestingDepthSecondaryOptions,
} from '../interfaces/plugin-max-nesting-depth.interface';

import { PluginBase } from '../../plugin-base/api/plugin-base';

const {
	utils: { report, ruleMessages, validateOptions },
} = stylelint;

/**
 * Source was taken from:
 * @see https://github.com/stylelint/stylelint/blob/main/lib/rules/max-nesting-depth/README.md
 *
 * Tests:
 * @see ./.stylelintrc.spec.js
 */
export class PluginMaxNestingDepth extends PluginBase {
	public readonly ruleName = `${PluginConfig.NAMESPACE}/max-nesting-depth`;
	public readonly meta = {
		url: PluginConfig.REPOSITORY_URL,
	};
	public readonly messages = ruleMessages(this.ruleName, {
		expected: depth => `Expected nesting depth to be no more than ${depth}`,
	});

	private maxDepth: number = 0;

	public readonly ruleBase: RuleBase = (maxDepth: number, secondaryOptions: PluginMaxNestingDepthSecondaryOptions) => {
		return (root: PostCSS.Root, result: PostcssResult): void => {
			this.maxDepth = maxDepth;

			const possibleSecondary: PluginMaxNestingDepthPossibleOptions = {
				ignore: ['blockless-at-rules', 'pseudo-classes'],
				ignoreAtRules: [isString, isRegExp],
				ignoreRules: [isString, isRegExp],
				ignorePseudoClasses: [isString, isRegExp],
				ignoreHostSelector: [isString, isRegExp, isBoolean],
			};
			const mainOptions: RuleOptions = {
				actual: maxDepth,
				possible: [isNumber],
			};
			const optionalOptions: RuleOptions = {
				optional: true,
				actual: secondaryOptions,
				possible: possibleSecondary,
			};

			const validOptions = validateOptions(result, this.ruleName, mainOptions, optionalOptions);

			if (!validOptions) return;

			const checkStatement = this.checkStatement(result, secondaryOptions);

			root.walkRules(checkStatement);
			root.walkAtRules(checkStatement);
		};
	};

	private checkStatement(
		result: PostcssResult,
		secondaryOptions: PluginMaxNestingDepthSecondaryOptions
	): PluginMaxNestingDepthCheckStatementFn {
		return rule => {
			const isIgnoreAtRule = this.isIgnoreAtRule(rule, secondaryOptions);
			const isIgnoreRule = this.isIgnoreRule(rule, secondaryOptions);
			const hasRuleBlock = hasBlock(rule);
			const isNotStandardSyntaxRule = isRule(rule) && !isStandardSyntaxRule(rule);

			if (isIgnoreAtRule || isIgnoreRule || !hasRuleBlock || isNotStandardSyntaxRule) return;

			const depth = this.nestingDepth(rule, 0, secondaryOptions);

			const isIgnoreHostSelector = this.isIgnoreHostSelector(rule, secondaryOptions) && depth === 0;

			if (isIgnoreHostSelector) {
				this.maxDepth -= -1;
			}

			if (depth <= this.maxDepth) return;

			const problem: Problem = {
				ruleName: this.ruleName,
				result,
				node: rule,
				message: this.messages.expected,
				messageArgs: [this.maxDepth],
			};

			report(problem);
		};
	}

	private nestingDepth(node: Node, level: number, secondaryOptions: PluginMaxNestingDepthSecondaryOptions): number {
		const parent = node.parent;

		if (!parent || this.isIgnoreAtRule(parent)) {
			return 0;
		}

		const isParentRoot = isRoot(parent);
		const isGrandparentRootAndParentAtRule = isAtRule(parent) && parent.parent && isRoot(parent.parent);

		// The nesting maxDepth level's computation has finished
		// when this function, recursively called, receives
		// a node that is not nested -- a direct child of the
		// root node
		if (isParentRoot || isGrandparentRootAndParentAtRule) {
			return level;
		}

		const ignoresBlocklessAtRules =
			optionsMatches(secondaryOptions, 'ignore', 'blockless-at-rules') &&
			isAtRule(node) &&
			node.every(child => !isDeclaration(child));
		const ignoresPseudoClasses =
			optionsMatches(secondaryOptions, 'ignore', 'pseudo-classes') &&
			isRule(node) &&
			this.containsPseudoClassesOnly(node.selector);
		const ignoresSpecificPseudoClassesOrRules =
			isRule(node) && this.containsIgnoredPseudoClassesOrRulesOnly(node.selectors, secondaryOptions);
		const isIgnoreRule = ignoresBlocklessAtRules || ignoresPseudoClasses || ignoresSpecificPseudoClassesOrRules;

		// Unless any of the conditions above apply, we want to
		// add 1 to the nesting maxDepth level and then check the parent,
		// continuing to add and move up the hierarchy
		// until we hit the root node
		return this.nestingDepth(parent, isIgnoreRule ? level : level + 1, secondaryOptions);
	}

	private isIgnoreRule(node: Node, secondaryOptions: PluginMaxNestingDepthSecondaryOptions = {}): boolean {
		return (
			isRule(node) &&
			optionsMatches<keyof PluginMaxNestingDepthSecondaryOptions>(secondaryOptions, 'ignoreRules', node.selector)
		);
	}

	private isIgnoreAtRule(node: Node, secondaryOptions: PluginMaxNestingDepthSecondaryOptions = {}): boolean {
		return (
			isAtRule(node) &&
			optionsMatches<keyof PluginMaxNestingDepthSecondaryOptions>(secondaryOptions, 'ignoreAtRules', node.name)
		);
	}

	private isIgnoreHostSelector(node: Node, secondaryOptions: PluginMaxNestingDepthSecondaryOptions = {}): boolean {
		return (
			isRule(node) &&
			optionsMatches<keyof PluginMaxNestingDepthSecondaryOptions>(secondaryOptions, 'ignoreHostSelector', node.selector)
		);
	}

	private containsPseudoClassesOnly(selector: string): boolean {
		const normalized = parser().processSync(selector, { lossless: false });
		const selectors = normalized.split(',');

		return selectors.every(item => this.extractPseudoRule(item));
	}

	private containsIgnoredPseudoClassesOrRulesOnly(
		selectors: string[],
		secondaryOptions: PluginMaxNestingDepthSecondaryOptions
	): boolean {
		const ignorePseudoClasses = secondaryOptions?.ignorePseudoClasses;
		const ignoreRules = secondaryOptions?.ignoreRules;
		const hasIgnoredEntities = !!ignorePseudoClasses || !!ignoreRules;

		return secondaryOptions && hasIgnoredEntities && this.allSelectorsMatchIgnoredRules(selectors, secondaryOptions);
	}

	private allSelectorsMatchIgnoredRules(
		selectors: string[],
		secondaryOptions: PluginMaxNestingDepthSecondaryOptions
	): boolean {
		return selectors.every(selector => {
			const ignoresRules = secondaryOptions?.ignoreRules && optionsMatches(secondaryOptions, 'ignoreRules', selector);
			const ignorePseudoClasses = secondaryOptions?.ignorePseudoClasses;

			if (ignoresRules) return true;
			if (!ignorePseudoClasses) return false;

			const pseudoRule = this.extractPseudoRule(selector);

			return pseudoRule && optionsMatches(secondaryOptions, 'ignorePseudoClasses', pseudoRule);
		});
	}

	private extractPseudoRule(selector: string): Nullable<string> {
		// Check if the selector starts with '&:' and does not have a double colon '::' indicating a pseudo-element
		const startsWithPseudoClass = selector.startsWith('&:') && selector[2] !== ':';

		// Extract and return the pseudo-rule part of the selector if the above condition is true, otherwise return undefined
		return startsWithPseudoClass ? selector.slice(2) : undefined;
	}
}
