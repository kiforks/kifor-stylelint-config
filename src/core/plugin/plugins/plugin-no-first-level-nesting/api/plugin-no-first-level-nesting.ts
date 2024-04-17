import { PluginBase } from '../../plugin-base/api/plugin-base';

import { PluginConfigHelper } from '../../../helpers/plugin-config/plugin-config.helper';
import { PluginHelper } from '../../../helpers/plugin/plugin.helper';

import { PluginConfigRuleType } from '../../../interfaces/plugin-config.interface';
import { PluginCheckData, PluginData, PluginRuleOptions } from '../../../interfaces/plugin.interface';
import {
	PluginNoFirstLevelNestingMessageArgs,
	PluginNoFirstLevelNestingName,
	PluginNoFirstLevelNestingPattern,
} from '../interfaces/plugin-no-self-nesting.interface';

export class PluginNoFirstLevelNesting extends PluginBase {
	protected override readonly isArrayOptions = true;

	protected readonly ruleName = 'no-first-level-nesting';
	protected readonly message = (
		name: PluginNoFirstLevelNestingName,
		pattern: PluginNoFirstLevelNestingPattern
	): string => `First level nesting of "${name}" is not allowed for the given ${pattern} rule pattern.`;

	protected initialize({ options, result }: PluginData<PluginConfigRuleType[]>): void {
		const mainOptions: PluginRuleOptions = {
			actual: options,
			possible: PluginConfigHelper.isValidRuleData,
		};

		if (!this.isValidOptions(mainOptions)) return;

		this.checkRule(result, options);
		this.checkAtRule(result, options);
	}

	protected check({ rule, options }: PluginCheckData<PluginConfigRuleType[]>): void {
		const validationRule = PluginConfigHelper.getValidationData(rule, options);

		if (!validationRule || !PluginHelper.isPluginRuleType(rule) || !PluginHelper.isParentRoot(rule)) return;

		const messageArgs: PluginNoFirstLevelNestingMessageArgs = [PluginHelper.getName(rule)!, validationRule.messageName];

		this.reportProblem({ node: rule, messageArgs });
	}
}
