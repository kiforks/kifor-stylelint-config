import { RuleHelper } from '../../rule/helpers/rule-order/rule.helper';

export abstract class RegExpHelper {
	/**
	 * Creates a RegExp based on the provided string, inserting a wildcard pattern for flexible matching.
	 * @param parameter - The string to be converted into a RegExp.
	 * @returns A RegExp object based on the input string, enhanced with wildcard patterns.
	 * @example For makeRegex('color: (blue)'), returns a RegExp matching /color: \(blue[\s\S]*\)/.
	 */
	public static makeRegex(parameter: string): RegExp {
		// Search for the last opening parenthesis
		const lastOpeningIndex = parameter.lastIndexOf('(');
		// Find the corresponding closing parenthesis
		const closingIndex = parameter.indexOf(')', lastOpeningIndex);
		// Validate existence of both parenthesis
		const hasValidParenthesis = lastOpeningIndex !== -1 && closingIndex !== -1;

		// Insert [\s\S]* before the closing parenthesis
		const modifiedParameter = hasValidParenthesis
			? `${parameter.substring(0, closingIndex)}[\\s\\S]*${parameter.substring(closingIndex)}`
			: `${parameter}[\\s\\S]*`;

		// Escape special characters
		const escapedParameter = modifiedParameter.replace(/\(/g, '\\(').replace(/\)/g, '\\)');

		return new RegExp(escapedParameter);
	}

	/**
	 * Transforms the 'parameter' field of each rule in the array into a RegExp source string for flexible matching.
	 * @param rules - An array of objects, potentially containing 'parameter' fields.
	 * @returns The same array of objects with 'parameter' fields converted to RegExp source strings.
	 * @example For paramToRegex([
	 *   { type: 'at-rule', name: 'include', parameter: '^media-min(xs)' },
	 *   { type: 'at-rule', name: 'media', parameter: '(width)' }
	 * ]),
	 * output is [
	 *   { type: 'at-rule', name: 'include', parameter: ^media-min\(xs[\s\S]*\) },
	 *   { type: 'at-rule', name: 'media', parameter: \(width[\s\S]*\) }
	 * ].
	 */
	public static paramToRegex<T>(rules: T[]): T[] {
		return rules.map(rule => {
			const isAtRule = RuleHelper.isRuleAt(rule) && rule.type === 'at-rule';

			return isAtRule && typeof rule.parameter === 'string'
				? {
						...rule,
						parameter: RegExpHelper.makeRegex(rule.parameter).source,
					}
				: rule;
		});
	}
}
