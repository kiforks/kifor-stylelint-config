import { ORDER_CONTENT } from './core/modules/order-content/constants/order-content/order-content.constant';
import { ORDER_PROPERTIES } from './core/modules/order-property/constants/order-properties/order-properties.constant';

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
		'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['ng-deep'] }],
		'selector-not-notation': 'simple',
		'declaration-block-no-redundant-longhand-properties': false,
		'at-rule-property-required-list': {
			'font-face': ['font-display', 'font-family', 'font-style'],
		},
		'color-no-hex': true,
		'declaration-property-unit-allowed-list': {
			'font-size': [],
			'line-height': [],
			'animation': ['ms'],
			'animation-duration': ['ms'],
			'transition-duration': ['ms'],
			'transition': ['ms'],
		},
	},
};
