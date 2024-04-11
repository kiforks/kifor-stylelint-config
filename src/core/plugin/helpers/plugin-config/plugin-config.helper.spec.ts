import { AtRule, Rule } from 'postcss';

import { PluginConfigHelper } from './plugin-config.helper';

describe('PluginConfigHelper', () => {
	describe('areAtRules', () => {
		it('should return true if all elements are AtRule objects', () => {
			const array = [
				{ name: 'media', params: '(min-width: 500px)' },
				{ name: 'charset', params: 'utf-8' },
			];
			expect(PluginConfigHelper.areAtRules(array)).toBeTruthy();
		});

		it('should return false if any element is not an AtRule object', () => {
			const array = [{ name: 'media', params: '(min-width: 500px)' }, { selector: '.example' }];
			expect(PluginConfigHelper.areAtRules(array)).toBeFalsy();
		});
	});

	describe('areRules', () => {
		it('should return true if all elements are Rule objects', () => {
			const array = [{ selector: '.example' }, { selector: '#id' }];
			expect(PluginConfigHelper.areRules(array)).toBeTruthy();
		});

		it('should return false if any element is not a Rule object', () => {
			const array = [{ selector: '.example' }, { name: 'media', params: '(min-width: 500px)' }];
			expect(PluginConfigHelper.areRules(array)).toBeFalsy();
		});
	});

	describe('isRule', () => {
		it('should return true if object is a Rule', () => {
			const obj = { selector: '.example' };
			expect(PluginConfigHelper.isRule(obj)).toBeTruthy();
		});

		it('should return false if object is not a Rule', () => {
			const obj = { name: 'media', params: '(min-width: 500px)' };
			expect(PluginConfigHelper.isRule(obj)).toBeFalsy();
		});
	});

	describe('isAtRule', () => {
		it('should return true if object is an AtRule', () => {
			const obj = { name: 'media', params: '(min-width: 500px)' };
			expect(PluginConfigHelper.isAtRule(obj)).toBeTruthy();
		});

		it('should return false if object is not an AtRule', () => {
			const obj = { selector: '.example' };
			expect(PluginConfigHelper.isAtRule(obj)).toBeFalsy();
		});
	});

	describe('isValidRuleData', () => {
		it('should return true if all elements are Rule or AtRule objects', () => {
			const array = [{ selector: '.example' }, { name: 'media', params: '(min-width: 500px)' }];
			expect(PluginConfigHelper.isValidRuleData(array)).toBeTruthy();
		});

		it('should return false if any element is not a Rule or AtRule object', () => {
			const array = [{ selector: '.example' }, { invalid: 'data' }];
			expect(PluginConfigHelper.isValidRuleData(array)).toBeFalsy();
		});
	});

	describe('createAtRuleInclude', () => {
		it('should create an AtRule include object with parameters', () => {
			const params = '^media-';
			const result = PluginConfigHelper.createAtRuleInclude(params);
			expect(result).toEqual({ name: 'include', params });
		});

		it('should create an AtRule include object without parameters', () => {
			const result = PluginConfigHelper.createAtRuleInclude();
			expect(result).toEqual({ name: 'include' });
		});
	});

	describe('createRule', () => {
		it('should create a Rule object with a selector', () => {
			const selector = '.example';
			const result = PluginConfigHelper.createRule(selector);
			expect(result).toEqual({ selector });
		});
	});

	describe('createAtRule', () => {
		it('should create an AtRule object with name and params', () => {
			const name = 'media';
			const params = '(min-width: 500px)';
			const result = PluginConfigHelper.createAtRule(name, params);
			expect(result).toEqual({ name, params });
		});

		it('should create an AtRule object with only name', () => {
			const name = 'charset';
			const result = PluginConfigHelper.createAtRule(name);
			expect(result).toEqual({ name });
		});
	});

	describe('createRules', () => {
		it('should create an array of Rule objects from an array of selectors', () => {
			const selectors = ['.example', '#id'];
			const result = PluginConfigHelper.createRules(selectors);
			expect(result).toEqual([{ selector: '.example' }, { selector: '#id' }]);
		});
	});

	describe('createAtRulesFromParams', () => {
		it('should create an array of AtRule objects from a name and an array of parameters', () => {
			const name = 'media';
			const params = ['(min-width: 500px)', '(max-width: 1000px)'];
			const result = PluginConfigHelper.createAtRulesFromParams(name, params);
			expect(result).toEqual([
				{ name, params: params[0] },
				{ name, params: params[1] },
			]);
		});
	});

	describe('createAtRuleIncludes', () => {
		it('should create an array of AtRule include objects from an array of parameters', () => {
			const params = ['^media-', '^print-'];
			const result = PluginConfigHelper.createAtRuleIncludes(params);
			expect(result).toEqual([
				{ name: 'include', params: params[0] },
				{ name: 'include', params: params[1] },
			]);
		});
	});

	describe('getValidationRule', () => {
		it('should return validation data for a rule', () => {
			const rule = { selector: '.example' };
			const configData = [{ selector: '.example' }];
			const result = PluginConfigHelper.getValidationRule(rule as Rule, configData);
			expect(result).toHaveProperty('rule');
			expect(result?.rule.selector).toEqual('.example');
		});

		it('should return null if no matching rule is found', () => {
			const rule = { selector: '.non-existent' };
			const configData = [{ selector: '.example' }];
			const result = PluginConfigHelper.getValidationRule(rule as Rule, configData);
			expect(result).toBeNull();
		});
	});

	describe('getValidationAtRule', () => {
		it('should return validation data for an AtRule', () => {
			const atRule = { name: 'media', params: '(min-width: 500px)' };
			const configData = [{ name: 'media', params: '(min-width: 500px)' }];
			const result = PluginConfigHelper.getValidationAtRule(atRule as AtRule, configData);
			expect(result).toHaveProperty('rule');
			expect(result?.rule.name).toEqual('media');
		});

		it('should return null if no matching AtRule is found', () => {
			const atRule = { name: 'media', params: '(min-width: 1200px)' };
			const configData = [{ name: 'media', params: '(min-width: 500px)' }];
			const result = PluginConfigHelper.getValidationAtRule(atRule as AtRule, configData);
			expect(result).toBeNull();
		});
	});

	describe('getRuleOptions', () => {
		it('should filter and return Rule configurations', () => {
			const options = [{ selector: '.example' }, { name: 'media', params: '(max-width: 600px)' }];
			const result = PluginConfigHelper.getRuleOptions(options);
			expect(result).toEqual([{ selector: '.example' }]);
		});
	});

	describe('getAtRuleOptions', () => {
		it('should filter and return AtRule configurations', () => {
			const options = [{ selector: '.example' }, { name: 'media', params: '(max-width: 600px)' }];
			const result = PluginConfigHelper.getAtRuleOptions(options);
			expect(result).toEqual([{ name: 'media', params: '(max-width: 600px)' }]);
		});
	});

	describe('isValidationAtRule', () => {
		it('should return true if the AtRule matches the validation rule', () => {
			const atRule = { name: 'media', params: '(max-width: 600px)' };
			const validationRule = { name: 'media', params: '(max-width: 600px)' };
			expect(PluginConfigHelper.isValidationAtRule(atRule as AtRule, validationRule)).toBeTruthy();
		});

		it('should return false if the AtRule does not match the validation rule', () => {
			const atRule = { name: 'media', params: '(max-width: 1200px)' };
			const validationRule = { name: 'media', params: '(max-width: 600px)' };
			expect(PluginConfigHelper.isValidationAtRule(atRule as AtRule, validationRule)).toBeFalsy();
		});
	});
});
