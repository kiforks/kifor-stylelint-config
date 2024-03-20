import { RuleHelper } from '../../../../rule/helpers/rule-order/rule.helper';
import { PluginHelper } from '../../../helpers/plugin.helper';

import { PluginCheckData, PluginData, PluginRule, PluginRuleOptions } from '../../../interfaces/plugin.interface';
import {
	PluginNoNestingData,
	PluginNoNestingMessageArgs,
	PluginNoNestingName,
	PluginNoNestingOptions,
	PluginNoNestingScopeName,
} from '../interfaces/plugin-no-nesting.interface';

import { PluginBase } from '../../plugin-base/api/plugin-base';

export class PluginNoNesting extends PluginBase {
	protected override readonly isArrayOptions = true;

	protected readonly ruleName = 'no-nesting';
	protected readonly message = (scopeName: PluginNoNestingScopeName, nestedName: PluginNoNestingName): string =>
		`Nesting of "${nestedName}" within "${scopeName}" is not allowed.`;

	protected initialize({ options, result }: PluginData<PluginNoNestingOptions, PluginNoNestingOptions>): void {
		const mainOptions: PluginRuleOptions = { actual: options, possible: RuleHelper.areRulesOrRuleAts };

		if (!this.validateOptions(mainOptions)) return;

		this.checkRule(result, options);
		this.checkAtRule(result, options);
	}

	protected check({ rule, options }: PluginCheckData<PluginNoNestingOptions, PluginNoNestingOptions>): false | void {
		if (PluginHelper.validateSyntaxBlock(rule)) return;

		const nestedData = this.getNestingData(rule, options);

		if (!nestedData) return;

		const messageArgs: PluginNoNestingMessageArgs = [nestedData.scopeName, nestedData.violatedName];

		this.reportProblem({ node: nestedData.violatedNode, messageArgs });
	}

	private getNestingData(node: PluginRule, options: PluginNoNestingOptions): Nullable<PluginNoNestingData> {
		const validationRuleName = PluginHelper.getRuleName(node);
		const validationRuleParams = PluginHelper.getRuleParams(node);
		const validationRule = options.find(option => {
			if (RuleHelper.isRule(option)) {
				return PluginHelper.matchesStringOrRegExp(validationRuleName, option.selector);
			}

			const hasParams = !!validationRuleParams && !!option.parameter;
			const isMatchedName = !!PluginHelper.matchesStringOrRegExp(validationRuleName, option.name);
			const isMatchedParams =
				hasParams && !!PluginHelper.matchesStringOrRegExp(validationRuleParams, option.parameter!);

			return hasParams ? isMatchedName && isMatchedParams : isMatchedName;
		});

		if (!validationRule) return null;

		const childNodes = node.nodes;

		if (!childNodes?.length) return null;

		const childMatchNodes: Array<Nullable<PluginRule>> = [];

		node.walk(child => {
			const isValidRule = PluginHelper.isRule(child) || PluginHelper.isAtRule(child);

			if (!isValidRule) return;

			if (RuleHelper.isRule(validationRule) && PluginHelper.isRule(child)) {
				PluginHelper.matchesStringOrRegExp(child.selector, validationRule.selector) && childMatchNodes.push(child);
			}

			if (RuleHelper.isRuleAt(validationRule) && PluginHelper.isAtRule(child)) {
				const hasParams = !!validationRule.parameter && !!child.params;
				const isMatched = !!PluginHelper.matchesStringOrRegExp(child.name, validationRule.name);
				const isMatchedParams =
					hasParams && !!PluginHelper.matchesStringOrRegExp(child.params, validationRule.parameter!);

				hasParams
					? isMatched && isMatchedParams && childMatchNodes.push(child)
					: isMatched && childMatchNodes.push(child);
			}
		});

		const violatedNode = childMatchNodes.find(item => !!item);

		if (!violatedNode) return null;

		const scopeName = this.getMessageName(validationRuleName, validationRuleParams);
		const violatedName = PluginHelper.getRuleName(violatedNode);
		const violatedParams = PluginHelper.getRuleParams(violatedNode);
		const violatedMessageName = this.getMessageName(violatedName, violatedParams);

		return violatedNode && { scopeName, violatedNode, violatedName: violatedMessageName };
	}

	private getMessageName(name: string, params: Nullable<string>): string {
		return params ? `@${name} ${params}` : name;
	}
}
