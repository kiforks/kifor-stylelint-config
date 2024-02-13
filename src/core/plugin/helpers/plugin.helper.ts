import stylelint, { Plugin, Rule, RuleBase, RuleMessages, RuleMeta } from 'stylelint';

export abstract class PluginHelper {
	public static createRule<P = unknown, S = unknown>(
		ruleName: string,
		ruleBase: RuleBase<P, S>,
		config: {
			messages: RuleMessages;
			meta?: RuleMeta;
			primaryOptionArray?: boolean;
			ruleName: string;
		}
	): Plugin {
		const rule: Rule<P, S> = Object.assign(ruleBase, config);

		return stylelint.createPlugin(ruleName, rule);
	}
}
