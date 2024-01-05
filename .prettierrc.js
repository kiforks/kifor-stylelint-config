/**
 * @typedef { import('prettier').Config } MainPrettierConfig
 * @typedef { import('prettier-plugin-organize-attributes/lib').PrettierPluginOrganizeAttributesParserOptions } AttributePrettierConfig
 * @typedef { (MainPrettierConfig & AttributePrettierConfig) } PrettierConfig
 *
 * @type { PrettierConfig }
 */
export default {
	trailingComma: 'es5',
	tabWidth: 2,
	singleQuote: true,
	useTabs: true,
	printWidth: 120,
	htmlWhitespaceSensitivity: 'ignore',
	arrowParens: 'avoid',
	quoteProps: 'preserve',
};
