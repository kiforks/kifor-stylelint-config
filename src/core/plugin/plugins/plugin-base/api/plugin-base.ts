import { Plugin, RuleBase, RuleMessages, RuleMeta } from 'stylelint';

import { PluginHelper } from '../../../helpers/plugin.helper';

export abstract class PluginBase {
	public abstract readonly ruleName: string;
	public abstract readonly messages: RuleMessages;
	public abstract readonly meta?: RuleMeta;
	public abstract readonly ruleBase: RuleBase;

	public createRule(): Plugin {
		return PluginHelper.createRule(this.ruleName, this.ruleBase, {
			ruleName: this.ruleName,
			messages: this.messages,
			meta: this.meta,
		});
	}
}
