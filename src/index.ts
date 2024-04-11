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
	public extends = ['stylelint-config-standard'];
	public customSyntax = 'postcss-scss';
	public ignoreFiles = ['**/*.css'];
	public plugins = [
		/**
		 * @name order/order
		 * @name order/properties-order
		 * @see https://www.npmjs.com/package/stylelint-order
		 */
		'stylelint-order',
	];
	public rules = {
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
	};
}

export default { ...new Configuration() };
