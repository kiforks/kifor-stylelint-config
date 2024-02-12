import stylelint, { PostcssResult, Rule } from 'stylelint';

export const MAX_NESTING_DEPTH = (() => {
	// if (!stylelint) {
	// 	return 'kifor-stylelint/max-nesting-depth';
	// }

	const {
		createPlugin,
		utils: { report, ruleMessages, validateOptions },
	} = stylelint;

	const ruleName = 'kifor-stylelint/max-nesting-depth';

	const messages = ruleMessages(ruleName, {
		rejected: selector => `Unexpected "foo" within selector "${selector}"`,
	});

	const meta = {
		url: 'https://github.com/foo-org/stylelint-selector-no-foo/blob/main/README.md',
	};

	/** @type {import('stylelint').Rule} */
	const ruleFunction: Rule = (primary, _secondaryOptions, _context) => {
		return (root: { walkRules: (arg0: (ruleNode: any) => void) => void }, result: PostcssResult) => {
			const validOptions = validateOptions(result, ruleName, {
				actual: primary,
				possible: [true],
			});

			if (!validOptions) return;

			root.walkRules(ruleNode => {
				const { selector } = ruleNode;

				if (!selector.includes('foo')) return;

				report({
					result,
					ruleName,
					message: messages.rejected(selector),
					node: ruleNode,
					word: selector,
				});
			});
		};
	};

	ruleFunction.ruleName = ruleName;
	ruleFunction.messages = messages;
	ruleFunction.meta = meta;

	return createPlugin(ruleName, ruleFunction);
})();
