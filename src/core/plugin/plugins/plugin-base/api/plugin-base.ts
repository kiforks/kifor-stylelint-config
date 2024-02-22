import { Plugin, RuleBase, RuleMessages, RuleMeta } from 'stylelint';

import { PluginHelper } from '../../../helpers/plugin.helper';

export abstract class PluginBase {
	protected abstract readonly messages: RuleMessages;
	protected abstract readonly meta?: RuleMeta;
	protected abstract readonly ruleBase: RuleBase;
	protected abstract readonly ruleName: string;

	public createRule(): Plugin {
		return PluginHelper.createRule(this.ruleName, this.ruleBase, {
			ruleName: this.ruleName,
			messages: this.messages,
			meta: this.meta,
		});
	}
}
