/**
 * @typedef { import('prettier').Config } MainPrettierConfig
 * @typedef { import('prettier-plugin-organize-attributes/lib').PrettierPluginOrganizeAttributesParserOptions } AttributePrettierConfig
 * @typedef { (MainPrettierConfig & AttributePrettierConfig) } PrettierConfig
 *
 * @type { PrettierConfig }
 */
module.exports = {
	trailingComma: 'es5',
	tabWidth: 4,
	singleQuote: true,
	useTabs: true,
	printWidth: 120,
	htmlWhitespaceSensitivity: 'ignore',
	arrowParens: 'avoid',
	quoteProps: 'preserve',
	attributeSort: 'ASC',
};
