import type * as PostCSS from 'postcss';
import stylelint, { PostcssResult, RuleBase, RuleContext, RuleOptions } from 'stylelint';

import { PluginConfig } from '../../configs/plugin.config';

import { PluginBase } from '../plugin-base/plugin-base';

const {
	utils: { report, ruleMessages, validateOptions },
} = stylelint;

export class MaxNestingDepthPlugin extends PluginBase {
	public static readonly RULE_NAME = `${PluginConfig.NAMESPACE}/max-nesting-depth`;

	protected readonly ruleName = MaxNestingDepthPlugin.RULE_NAME;
	protected readonly meta = {
		url: PluginConfig.REPOSITORY_URL,
	};

	protected readonly messages = ruleMessages(this.ruleName, {
		rejected: selector => `Unexpected "foo" within selector "${selector}"`,
	});

	protected readonly ruleBase: RuleBase =
		(primaryOption: boolean, _secondaryOptions: Nullable<Record<string, unknown>>, _context: RuleContext) =>
		(root: PostCSS.Root, result: PostcssResult): void => {
			if (!this.isValidOptions(primaryOption, result)) return;

			this.walkRules(root, result);
		};

	private isValidOptions(primaryOption: boolean, result: PostcssResult): boolean {
		const options: RuleOptions = {
			actual: primaryOption,
			possible: [true],
		};

		return validateOptions(result, this.ruleName, options);
	}

	private walkRules(root: PostCSS.Root, result: PostcssResult): void {
		root.walkRules(ruleNode => {
			const { selector } = ruleNode;

			if (!selector.includes('foo')) return;

			report({
				result,
				ruleName: this.ruleName,
				message: this.messages.rejected(selector),
				node: ruleNode,
				word: selector,
			});
		});
	}
}
