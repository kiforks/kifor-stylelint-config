import type * as PostCSS from 'postcss';
import stylelint, { Plugin, PostcssResult, Rule, RuleBase, RuleContext, RuleMessage } from 'stylelint';

import { PluginConfig } from '../../../configs/plugin.config';

import {
	PluginCheckData,
	PluginCheckFn,
	PluginCheckStatementFn,
	PluginConfigData,
	PluginData,
	PluginProblem,
	PluginRuleBaseFn,
	PluginRuleOptions,
	PluginSecondaryOptions,
} from '../../../interfaces/plugin.interface';

const {
	utils: { ruleMessages, validateOptions, report },
} = stylelint;

export abstract class PluginBase {
	protected abstract readonly ruleName: string;
	protected abstract readonly message: RuleMessage;

	protected readonly isArrayOptions: boolean = false;

	protected validateOptions!: (options: PluginRuleOptions, secondaryOptions?: PluginRuleOptions) => boolean;
	protected reportProblem!: (problem: PluginProblem) => void;
	protected checkRule!: PluginCheckFn;
	protected checkAtRule!: PluginCheckFn;

	public get name(): string {
		return `${PluginConfig.NAMESPACE}/${this.ruleName}`;
	}

	private get messages(): { expected: RuleMessage } {
		return ruleMessages(this.name, {
			expected: this.message,
		});
	}

	public createRule(): Plugin {
		const ruleBase: RuleBase =
			<O = unknown, S = unknown>(
				options: O,
				secondaryOptions: PluginSecondaryOptions<S>,
				context: RuleContext
			): PluginRuleBaseFn =>
			(root: PostCSS.Root, result: PostcssResult) =>
				this.render({ options, secondaryOptions, context, result, root });
		const config: PluginConfigData = {
			ruleName: this.name,
			messages: this.messages,
			meta: { url: PluginConfig.REPOSITORY_URL },
			primaryOptionArray: this.isArrayOptions,
		};
		const rule: Rule = Object.assign(ruleBase, config);

		return stylelint.createPlugin(this.name, rule);
	}

	protected abstract initialize(options: PluginData): void;
	protected abstract check(data: PluginCheckData): false | void;

	private render<O = unknown, S = unknown>({ options, secondaryOptions, context, result, root }: PluginData): void {
		const checkStatement =
			<Options = O, SecondaryOptions = S>(
				result: PostcssResult,
				options: Options,
				secondaryOptions?: PluginSecondaryOptions<SecondaryOptions>
			): PluginCheckStatementFn =>
			rule =>
				this.check({
					rule,
					result,
					options,
					secondaryOptions: secondaryOptions || ({} as PluginSecondaryOptions<S>),
				});

		this.checkRule = <Options = O, SecondaryOptions = S>(
			result: PostcssResult,
			options: Options,
			secondaryOptions?: PluginSecondaryOptions<SecondaryOptions>
		): void => {
			root.walkRules(checkStatement(result, options, secondaryOptions));
		};
		this.checkAtRule = <Options = O, SecondaryOptions = S>(
			result: PostcssResult,
			options: Options,
			secondaryOptions?: PluginSecondaryOptions<SecondaryOptions>
		): void => {
			root.walkAtRules(checkStatement(result, options, secondaryOptions));
		};

		this.validateOptions = (options: PluginRuleOptions, secondaryOptions?: PluginRuleOptions): boolean =>
			secondaryOptions
				? validateOptions(result, this.name, options, secondaryOptions)
				: validateOptions(result, this.name, options);

		this.reportProblem = (problem: PluginProblem) =>
			report({ ruleName: this.name, result, message: this.messages.expected, ...problem });

		this.initialize({ options, root, result, secondaryOptions, context });
	}
}
