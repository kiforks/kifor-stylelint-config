import { Config } from 'stylelint';

import { RULE_NO_UNKNOWN } from './core/rule/configs/rule-no-unknown/rule-no-unknown.config';
import { RULE_PROPERTY_UNIT_ALLOWED_LIST } from './core/rule/configs/rule-property-unit-allowed-list/rule-property-unit-allowed-list.config';
import { RULE_UNIT_ALLOWED_LIST } from './core/rule/configs/rule-unit-allowed-list/rule-unit-allowed-list.config';

import { ORDER_CONTENT } from './core/modules/order/modules/order-content/constants/order-content/order-content.constant';
import { ORDER_PROPERTIES } from './core/modules/order/modules/order-property/constants/order-properties/order-properties.constant';
import { plugins } from './core/plugin';
import { Plugin } from './core/plugin/decorators/plugin.decorator';

/**
 * Docs:
 * @see https://stylelint.io/user-guide/rules
 */
@Plugin({ providers: plugins })
class Configuration implements Config {
	public extends = [
		/** @see https://github.com/stylelint-scss/stylelint-config-standard-scss */
		'stylelint-config-standard',
	];
	public customSyntax = 'postcss-scss';
	public ignoreFiles = ['**/*.css'];
	public plugins = [
		/** @see https://github.com/stylelint-scss/stylelint-scss */
		'stylelint-scss',

		/**
		 * @name order/order
		 * @name order/properties-order
		 * @see https://www.npmjs.com/package/stylelint-order
		 */
		'stylelint-order',

		/** @see https://github.com/kristerkari/stylelint-declaration-block-no-ignored-properties/blob/master/README.md */
		'stylelint-declaration-block-no-ignored-properties',

		/** @see https://github.com/AndyOGo/stylelint-declaration-strict-value */
		'stylelint-declaration-strict-value',
	];
	public rules = {
		'annotation-no-unknown': [true, { ignoreAnnotations: [/default\b/] }],

		/* At-rule */
		'at-rule-no-unknown': [
			true,
			{
				'ignoreAtRules': RULE_NO_UNKNOWN,
			},
		],
		'at-rule-property-required-list': {
			'font-face': ['font-display', 'font-family', 'font-style'],
		},

		/* Color */
		'color-function-notation': ['legacy', { 'ignore': ['with-var-inside'] }],
		'color-no-hex': true,

		/* Declaration block */
		'declaration-block-no-duplicate-properties': true,
		'declaration-block-no-redundant-longhand-properties': null,

		/* Declaration property */
		'declaration-property-unit-allowed-list': RULE_PROPERTY_UNIT_ALLOWED_LIST,
		'declaration-property-value-no-unknown': true,
		'plugin/declaration-block-no-ignored-properties': true,

		/* Function */
		'function-disallowed-list': ['rgb'],
		'function-url-no-scheme-relative': true,
		'function-url-scheme-disallowed-list': ['ftp', '/^http/'],

		/* Media feature */
		'media-feature-name-no-vendor-prefix': true,
		'media-feature-name-unit-allowed-list': RULE_PROPERTY_UNIT_ALLOWED_LIST,

		/* Rule */
		'rule-selector-property-disallowed-list': {
			'/ri\\-/': ['font-size'],
			'/^\\.ri-/': ['font-size'],
			'i': ['font-size'],
		},
		'at-rule-disallowed-list': ['extend'],

		/* Selector */
		'selector-disallowed-list': [
			'i',
			'/^\\.container/',
			'/^\\.g-col/',
			'/^\\.col/',
			'/^\\.grid/',
			'/\\[data-test.+]/',
			'/\\[data-po.+]/',
		],
		'selector-max-attribute': 1,
		'selector-max-id': 1,
		'selector-no-qualifying-type': true,
		'selector-not-notation': 'simple',
		'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['ng-deep'] }],
		'selector-nested-pattern': '^(?:&:?[^&]+|[^&:]+)$',
		'declaration-property-value-disallowed-list': {
			/** @see https://github.com/YozhikM/stylelint-a11y/blob/master/src/rules/no-display-none/README.md */
			'display': ['/none/'],
			/** @see https://github.com/YozhikM/stylelint-a11y/blob/master/src/rules/no-text-align-justify/README.md */
			'text-align': ['/justify/'],
		},

		/* Time */
		'time-min-milliseconds': 50,

		/* Unit */
		'unit-allowed-list': RULE_UNIT_ALLOWED_LIST,

		/* Plugin */
		'order/order': ORDER_CONTENT,
		'order/properties-order': [
			{
				properties: ORDER_PROPERTIES,
			},
		],

		/* Notation */
		'font-weight-notation': 'numeric',

		/* SCSS */
		'scss/at-extend-no-missing-placeholder': true,
		'scss/at-if-no-null': true,
		'scss/at-import-partial-extension': 'never',
		'scss/at-rule-no-unknown': true,
		'scss/comment-no-empty': true,
		'scss/declaration-nested-properties-no-divided-groups': true,
		'scss/declaration-nested-properties': 'never',
		'scss/dollar-variable-no-missing-interpolation': true,
		'scss/dollar-variable-default': [true, { ignore: 'local' }],
		'scss/dollar-variable-no-namespaced-assignment': true,
		'scss/function-quote-no-quoted-strings-inside': true,
		'scss/function-unquote-no-unquoted-strings-inside': true,
		'scss/load-no-partial-leading-underscore': true,
		'scss/no-duplicate-mixins': true,
		'scss/no-global-function-names': true,
		'scss/operator-no-newline-after': true,
		'scss/operator-no-newline-before': true,
		'scss/operator-no-unspaced': true,
		'scss/selector-no-redundant-nesting-selector': true,
		'scss/selector-no-union-class-name': true,
		'scss/no-duplicate-dollar-variables': true,
		'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
		'scss/at-else-closing-brace-space-after': 'always-intermediate',
		'scss/at-else-empty-line-before': 'never',
		'scss/at-else-if-parentheses-space-before': 'always',
		'scss/at-function-parentheses-space-before': 'never',
		'scss/at-function-pattern': [
			'^(-?[a-z][a-z0-9]*)(-[a-z0-9]+)*$',
			{
				message: 'Expected function name to be kebab-case',
			},
		],
		'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
		'scss/at-if-closing-brace-space-after': 'always-intermediate',
		'scss/at-mixin-argumentless-call-parentheses': 'never',
		'scss/at-mixin-parentheses-space-before': 'never',
		'scss/at-mixin-pattern': [
			'^(-?[a-z][a-z0-9]*)(-[a-z0-9]+)*$',
			{
				message: 'Expected mixin name to be kebab-case',
			},
		],
		'scss/at-rule-conditional-no-parentheses': true,
		'scss/dollar-variable-colon-space-after': 'always-single-line',
		'scss/dollar-variable-colon-space-before': 'never',
		'scss/dollar-variable-first-in-block': [true, { ignore: ['comments', 'imports'] }],
		'scss/dollar-variable-empty-line-before': [
			'always',
			{
				except: ['after-dollar-variable', 'first-nested'],
				ignore: ['after-comment', 'inside-single-line-block'],
			},
		],
		'scss/dollar-variable-pattern': [
			'^(-?[a-z][a-z0-9]*)(-[a-z0-9]+)*$',
			{
				message: 'Expected variable to be kebab-case',
			},
		],
		'scss/double-slash-comment-empty-line-before': [
			'always',
			{
				except: ['first-nested'],
				ignore: ['between-comments', 'stylelint-commands'],
			},
		],
		'scss/double-slash-comment-whitespace-inside': 'always',
		'scss/percent-placeholder-pattern': [
			'^(-?[a-z][a-z0-9]*)(-[a-z0-9]+)*$',
			{
				message: 'Expected placeholder to be kebab-case',
			},
		],

		/* Other */
		'scale-unlimited/declaration-strict-value': [
			['/color/', 'background-color', 'font-family', 'font-size', 'size', 'line-height', 'stroke', 'fill'],
			{
				'ignoreValues': ['/^rgba/', 'inherit', 'initial', 'none', 'transparent', '/^rem/', '/em$/', '0', '1', '/^url/'],
				'ignoreFunctions': false,
			},
		],
	};
}

export default { ...new Configuration() };
