import { Rule, RuleAt, RuleString } from '../../interfaces/rule.interface';

export abstract class RuleHelper {
	/**
	 * Checks if the given object conforms to the RuleAt interface.
	 * @param obj - The object to be checked.
	 * @returns true if obj is a RuleAt type, false otherwise.
	 * @example For isRuleAt({ type: 'at-rule', parameter: 'example' }), returns true.
	 */
	public static isRuleAt(obj: unknown): obj is RuleAt {
		return typeof obj === 'object' && obj !== null && 'type' in obj && 'parameter' in obj;
	}

	/**
	 * Creates an at-rule with a given name and parameter.
	 * @param name - The name of the at-rule (e.g., 'media', 'include', etc.).
	 * @param parameter - The parameter for the at-rule (e.g., 'screen and (max-width: 768px)', 'mixinName', etc.).
	 * @example: For createAtRule('media', 'screen and (max-width: 768px)'), the output is:
	 * { type: 'at-rule', name: 'media', parameter: 'screen and (max-width: 768px)' }.
	 */
	public static createAtRule(name: RuleString, parameter?: RuleString): RuleAt {
		return parameter
			? {
					type: 'at-rule',
					name,
					parameter,
				}
			: {
					type: 'at-rule',
					name,
				};
	}

	/**
	 * Creates a standard CSS rule with a given selector.
	 * @param selector - The CSS selector string or regular expression.
	 * @example: For createSelector('.myClass'), the output is:
	 * { type: 'rule', selector: '.myClass' }.
	 */
	public static createSelector(selector: RuleString): Rule {
		return {
			type: 'rule',
			selector,
		};
	}

	/**
	 * Creates an @include rule with a given mixin parameter.
	 * @param mixin - The mixin parameter string or regular expression.
	 * @example: For createInclude('mixinName'), the output is:
	 * { type: 'at-rule', name: 'include', parameter: 'mixinName' }.
	 */
	public static createInclude<P extends RuleString = RuleString>(mixin: P): RuleAt<P> {
		return {
			type: 'at-rule',
			name: 'include',
			parameter: mixin,
		};
	}

	/**
	 * Creates an array of standard CSS rules with given selectors.
	 * @param selectors - Array of CSS selector strings or regular expressions.
	 * @example: For createSelectors(['.class1', '.class2']), the output is:
	 * [
	 *    { type: 'rule', selector: '.class1' },
	 *    { type: 'rule', selector: '.class2' }
	 * ].
	 */
	public static createSelectors(selectors: RuleString[]): Rule[] {
		return selectors.map(selector => RuleHelper.createSelector(selector));
	}

	/**
	 * Creates an array of @include rules with given mixin parameters.
	 * @param mixins - Array of mixin parameters strings or regular expressions.
	 * @example: For createIncludes(['mixin1', 'mixin2']), the output is:
	 * [
	 *    { type: 'at-rule', name: 'include', parameter: 'mixin1' },
	 *    { type: 'at-rule', name: 'include', parameter: 'mixin2' }
	 * ].
	 */
	public static createIncludes<P extends RuleString = RuleString>(mixins: P[]): Array<RuleAt<P>> {
		return mixins.map(mixin => RuleHelper.createInclude(mixin));
	}

	/**
	 * Creates an array of at-rules with a given name and an array of parameters.
	 * @param name - The name of the at-rule (e.g., 'media', 'include', etc.).
	 * @param parameters - An array of parameters for the at-rule
	 * @example: For createAtRules('media', ['screen and (max-width: 768px)', 'print']), the output is:
	 * [
	 *    { type: 'at-rule', name: 'media', parameter: 'screen and (max-width: 768px)' },
	 *    { type: 'at-rule', name: 'media', parameter: 'print' }
	 * ].
	 */
	public static createAtRules(name: RuleString, parameters: RuleString[]): RuleAt[] {
		return parameters.map(parameter => RuleHelper.createAtRule(name, parameter));
	}
}
