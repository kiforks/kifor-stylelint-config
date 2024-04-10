import { AtRule, Rule } from 'postcss';

import { PluginHelper } from '../plugin/plugin.helper';

import {
	PluginConfigAtRule,
	PluginConfigRule,
	PluginConfigRuleType,
	PluginConfigValidationAtRule,
	PluginConfigValidationData,
	PluginConfigValidationRule,
} from '../../interfaces/plugin-config.interface';
import { PluginRuleType } from '../../interfaces/plugin.interface';

/**
 * The PluginConfigHelper class provides static methods to create and validate plugin configuration
 * rules and at-rules for CSS processing. It offers functionality to work with stylelint rules and
 * configurations, aiding in the creation and validation of custom plugin configurations.
 */
export abstract class PluginConfigHelper {
	/**
	 * Determines if all elements in the array are AtRule objects.
	 *
	 * @param array - The array to be checked.
	 * @returns True if all elements are AtRule objects, false otherwise.
	 * @example
	 * PluginConfigHelper.areAtRules([{ name: 'media', params: '(min-width: 500px)' }, { name: 'charset', params: '"utf-8"' }]); // returns true
	 */
	public static areAtRules(array: unknown): boolean {
		return Array.isArray(array) && array.every(element => PluginConfigHelper.isAtRule(element));
	}

	/**
	 * Determines if all elements in the array are Rule objects.
	 *
	 * @param array - The array to be checked.
	 * @returns True if all elements are Rule objects, false otherwise.
	 * @example
	 * PluginConfigHelper.areRules([{ selector: '.example' }, { selector: '#id' }]); // returns true
	 */
	public static areRules(array: unknown): boolean {
		return Array.isArray(array) && array.every(element => PluginConfigHelper.isRule(element));
	}

	/**
	 * Checks if the provided object is a Rule.
	 *
	 * @param obj - The object to be checked.
	 * @returns True if the object is a Rule, false otherwise.
	 * @example
	 * PluginConfigHelper.isRule({ selector: '.example' }); // returns true
	 */
	public static isRule(obj: unknown): obj is PluginConfigRule {
		return typeof obj === 'object' && obj !== null && 'selector' in obj;
	}

	/**
	 * Checks if the provided object is an AtRule.
	 *
	 * @param obj - The object to be checked.
	 * @returns True if the object is an AtRule, false otherwise.
	 * @example
	 * PluginConfigHelper.isAtRule({ name: 'media', params: '(min-width: 500px)' }); // returns true
	 */
	public static isAtRule(obj: unknown): obj is PluginConfigAtRule {
		return typeof obj === 'object' && obj !== null && 'name' in obj;
	}

	/**
	 * Validates whether the provided data is a valid rule configuration.
	 *
	 * @param array - The data to validate.
	 * @returns True if the data is a valid rule configuration, false otherwise.
	 * @example PluginConfigHelper.isValidRuleData([{ selector: '.example' }, { name: 'media', params: '(max-width: 600px)' }]);
	 * // returns true
	 */
	public static isValidRuleData(array: unknown): boolean {
		return (
			Array.isArray(array) &&
			array.every(element => PluginConfigHelper.isRule(element) || PluginConfigHelper.isAtRule(element))
		);
	}

	/**
	 * Creates an AtRule include object with specified parameters.
	 *
	 * @param params - The parameters for the AtRule.
	 * @returns An AtRule include object.
	 * @example
	 * PluginConfigHelper.createAtRuleInclude('^media-'); // returns { name: 'include', params: '^media-' }
	 */
	public static createAtRuleInclude(params?: TextPattern): PluginConfigAtRule {
		return params
			? {
					name: 'include',
					params,
				}
			: { name: 'include' };
	}

	/**
	 * Creates a Rule object with a specified selector.
	 *
	 * @param selector - The selector for the rule.
	 * @returns A Rule object.
	 * @example
	 * PluginConfigHelper.createRule('.example'); // returns { selector: '.example' }
	 */
	public static createRule(selector: TextPattern): PluginConfigRule {
		return {
			selector,
		};
	}

	/**
	 * Creates an AtRule object with specified name and parameters.
	 *
	 * @param name - The name of the AtRule.
	 * @param params - The parameters of the AtRule.
	 * @returns An AtRule object.
	 * @example
	 * PluginConfigHelper.createAtRule('media', '(min-width: 500px)'); // returns { name: 'media', params: '(min-width: 500px)' }
	 */
	public static createAtRule(name: TextPattern, params?: TextPattern): PluginConfigAtRule {
		return params
			? {
					name,
					params,
				}
			: { name };
	}

	/**
	 * Creates an array of Rule objects from an array of selectors.
	 *
	 * @param selectors - An array of selectors.
	 * @returns An array of Rule objects.
	 * @example
	 * PluginConfigHelper.createRules(['.example', '#id']); // returns [{ selector: '.example' }, { selector: '#id' }]
	 */
	public static createRules(selector: TextPattern[]): PluginConfigRule[] {
		return selector.map(selector => PluginConfigHelper.createRule(selector));
	}

	/**
	 * Creates an array of AtRule objects from a name and an array of parameters.
	 *
	 * @param name - The name for the AtRules.
	 * @param params - An array of parameters.
	 * @returns An array of AtRule objects.
	 * @example PluginConfigHelper.createAtRulesFromParams('media', ['(min-width: 500px)', '(max-width: 1000px)']);
	 * // returns [{ name: 'media', params: '(min-width: 500px)' }, { name: 'media', params: '(max-width: 1000px)' }]
	 */
	public static createAtRulesFromParams(name: TextPattern, params: TextPattern[]): PluginConfigAtRule[] {
		return params.map(param => PluginConfigHelper.createAtRule(name, param));
	}

	/**
	 * Creates an array of AtRule include objects from an array of parameters.
	 *
	 * @param params - An array of parameters for the include AtRules.
	 * @returns An array of AtRule include objects.
	 * @example
	 * PluginConfigHelper.createAtRuleIncludes(['^media-', '^print-']); // returns [{ name: 'include', params: '^media-' }, { name: 'include', params: '^print-' }]
	 */
	public static createAtRuleIncludes(params: TextPattern[]): PluginConfigAtRule[] {
		return PluginConfigHelper.createAtRulesFromParams('include', params);
	}

	/**
	 * Retrieves validation data for a given rule, determining if the rule conforms to the provided configuration.
	 *
	 * @param rule - The rule to validate.
	 * @param configData - The configuration data against which the rule is validated.
	 * @returns Validation data if the rule is valid, null otherwise.
	 * @example
	 * PluginConfigHelper.getValidationData(rule, [{ selector: '.example' }]);
	 * // returns the validation data for '.example'
	 */
	public static getValidationData(
		rule: PluginRuleType,
		configData: PluginConfigRuleType[] | PluginConfigRuleType
	): Nullable<PluginConfigValidationData> {
		if (PluginHelper.isRule(rule)) {
			const ruleConfigData = Array.isArray(configData)
				? PluginConfigHelper.getRuleOptions(configData)
				: (configData as PluginConfigRule);

			return PluginConfigHelper.getValidationRule(rule, ruleConfigData);
		}

		const atRuleConfigData = Array.isArray(configData)
			? PluginConfigHelper.getAtRuleOptions(configData)
			: (configData as PluginConfigAtRule);

		return PluginConfigHelper.getValidationAtRule(rule, atRuleConfigData);
	}

	/**
	 * Retrieves validation data for a CSS rule based on the plugin configuration.
	 *
	 * @param rule - The CSS rule to validate.
	 * @param configData - The plugin configuration for rules.
	 * @returns Validation data for the rule, or null if it does not conform to the configuration.
	 * @example
	 * PluginConfigHelper.getValidationRule(rule, { selector: '.example' });
	 * // returns validation data for '.example'
	 */
	public static getValidationRule(
		rule: Rule,
		configData: PluginConfigRule[] | PluginConfigRule
	): Nullable<PluginConfigValidationRule> {
		const { selector } = rule;
		const validationRule = Array.isArray(configData)
			? configData.find(option => PluginHelper.matchesStringOrRegExp(selector, option.selector))
			: PluginHelper.matchesStringOrRegExp(selector, configData.selector) && configData;

		return validationRule
			? {
					rule: validationRule,
					messageName: `${validationRule.selector}`,
					messageFormattedName: `${validationRule.selector}`,
				}
			: null;
	}

	/**
	 * Retrieves validation data for an AtRule based on the plugin configuration.
	 *
	 * @param rule - The AtRule to validate.
	 * @param configData - The plugin configuration for at-rules.
	 * @returns Validation data for the AtRule, or null if it does not conform to the configuration.
	 * @example
	 * PluginConfigHelper.getValidationAtRule(atRule, { name: 'media', params: '(min-width: 500px)' });
	 * // returns validation data for the 'media' AtRule
	 */
	public static getValidationAtRule(
		rule: AtRule,
		configData: PluginConfigAtRule[] | PluginConfigAtRule
	): Nullable<PluginConfigValidationAtRule> {
		const validationRule = Array.isArray(configData)
			? configData.find(option => PluginConfigHelper.isValidationAtRule(rule, option))
			: PluginConfigHelper.isValidationAtRule(rule, configData) && configData;

		if (!validationRule) return null;

		const messageName = validationRule.params
			? `"${validationRule.name} ${validationRule.params}"`
			: `"${validationRule.name}"`;
		const messageFormattedName = validationRule.params ? `"@${rule.name} ${rule.params}"` : `"@${rule.name}"`;

		return {
			rule: validationRule,
			messageName,
			messageFormattedName,
		};
	}

	/**
	 * Filters and returns an array of Rule configurations from the given plugin configuration options.
	 *
	 * @param options - The array of plugin configuration options.
	 * @returns An array of Rule configurations.
	 * @example
	 * PluginConfigHelper.getRuleOptions([{ selector: '.example' }, { name: 'media', params: '(max-width: 600px)' }]);
	 * // returns [{ selector: '.example' }]
	 */
	public static getRuleOptions(options: PluginConfigRuleType[]): PluginConfigRule[] {
		return options.filter(option => PluginConfigHelper.isRule(option)) as PluginConfigRule[];
	}

	/**
	 * Filters and returns an array of AtRule configurations from the given plugin configuration options.
	 *
	 * @param options - The array of plugin configuration options.
	 * @returns An array of AtRule configurations.
	 * @example
	 * PluginConfigHelper.getAtRuleOptions([{ selector: '.example' }, { name: 'media', params: '(max-width: 600px)' }]);
	 * // returns [{ name: 'media', params: '(max-width: 600px)' }]
	 */
	public static getAtRuleOptions(options: PluginConfigRuleType[]): PluginConfigAtRule[] {
		return options.filter(option => PluginConfigHelper.isAtRule(option)) as PluginConfigAtRule[];
	}

	/**
	 * Determines if a given AtRule object matches a specified validation AtRule configuration.
	 *
	 * @param rule - The AtRule object to be checked.
	 * @param option - The validation AtRule configuration to match against.
	 * @returns True if the AtRule object matches the validation configuration, false otherwise.
	 * @example
	 * // Given a plain AtRule object and a corresponding validation rule
	 * const atRule = { name: 'media', params: '(max-width: 600px)' };
	 * const validationRule = { name: 'media', params: '(max-width: 600px)' };
	 * PluginConfigHelper.isValidationAtRule(atRule, validationRule);
	 * // returns true
	 *
	 * @example
	 * // If the AtRule object doesn't match the validation rule's parameters
	 * const atRuleDifferentParams = { name: 'media', params: '(min-width: 300px)' };
	 * PluginConfigHelper.isValidationAtRule(atRuleDifferentParams, validationRule);
	 * // returns false
	 */
	public static isValidationAtRule({ name, params }: AtRule, option: PluginConfigAtRule): boolean {
		const hasParams = !!params && !!option.params;
		const isMatchedName = !!PluginHelper.matchesStringOrRegExp(name, option.name);
		const isMatchedParams = hasParams && !!PluginHelper.matchesStringOrRegExp(params, option.params!);

		return hasParams ? isMatchedName && isMatchedParams : isMatchedName;
	}
}
