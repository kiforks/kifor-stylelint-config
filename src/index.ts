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
	},
};
