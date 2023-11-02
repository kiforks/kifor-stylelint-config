import { ORDER_CONTENT } from './core/modules/order-content/order-content';
import { ORDER_PROPERTIES } from './core/modules/order-property/order-properties';

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
	},
};
