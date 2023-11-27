import { ORDER_CONTENT } from './core/modules/order-content/constants/order-content/order-content.constant';
import { ORDER_PROPERTIES } from './core/modules/order-property/constants/order-properties/order-properties.constant';
import { RULE_PROPERTY_UNIT_ALLOWED_LIST } from './rule/configs/rule-property-unit-allowed-list/rule-property-unit-allowed-list.config';
import { RULE_UNIT_ALLOWED_LIST } from './rule/configs/rule-unit-allowed-list/rule-unit-allowed-list.config';
import { RULE_NO_UNKNOWN } from './rule/configs/rule-no-unknown/rule-no-unknown.config';

export const CONFIG = {
	customSyntax: 'postcss-scss',
	extends: ['stylelint-config-standard'],
	plugins: ['stylelint-order'],
	rules: {
		'order/order': ORDER_CONTENT,
		'order/properties-order': [
			{
				properties: ORDER_PROPERTIES,
			},
		],
		'declaration-block-no-duplicate-properties': true,
		'declaration-property-unit-allowed-list': RULE_PROPERTY_UNIT_ALLOWED_LIST,
		'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['ng-deep'] }],
		'selector-not-notation': 'simple',
		'declaration-block-no-redundant-longhand-properties': false,
		'at-rule-property-required-list': {
			'font-face': ['font-display', 'font-family', 'font-style'],
		},
		'color-no-hex': true,
		'color-function-notation': ['legacy', { 'ignore': ['with-var-inside'] }],
		'function-disallowed-list': ['rgb'],
		'function-url-no-scheme-relative': true,
		'function-url-scheme-disallowed-list': ['ftp', '/^http/'],
		'media-feature-name-no-vendor-prefix': true,
		'media-feature-name-unit-allowed-list': RULE_PROPERTY_UNIT_ALLOWED_LIST,
		'rule-selector-property-disallowed-list': {
			'/ri\\-/': ['font-size'],
			'/^\\.ri-/': ['font-size'],
			'i': ['font-size'],
		},
		'selector-disallowed-list': [
			'i',
			'/^\\.container/',
			'/^\\.g-col/',
			'/^\\.col/',
			'/^\\.grid/',
			'/\\[data-test.+]/',
			'/\\[data-po.+]/',
		],
		'selector-no-qualifying-type': true,
		'unit-allowed-list': RULE_UNIT_ALLOWED_LIST,
		'max-nesting-depth': [
			3,
			{
				'ignore': ['blockless-at-rules', 'pseudo-classes'],
				'ignoreRules': ['/^&::/', '/^::/'],
				'ignoreAtRules': ['/^\\include/', '/^\\media/'],
			},
		],
		'at-rule-no-unknown': [
			true,
			{
				'ignoreAtRules': RULE_NO_UNKNOWN,
			},
		],
		'selector-max-attribute': 1,
		'selector-max-id': 1,
		'time-min-milliseconds': 50,
		'font-weight-notation': 'numeric',
	},
};
