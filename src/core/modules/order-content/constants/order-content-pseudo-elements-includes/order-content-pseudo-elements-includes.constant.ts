import { RuleHelper } from '../../../../../rule/helpers/rule-order/rule.helper';

export const ORDER_CONTENT_PSEUDO_ELEMENT_INCLUDES = RuleHelper.createIncludes([
	// before
	'before-clean',
	'before',
	'before-hover',
	'before-active',

	// after
	'after-clean',
	'after',
	'after-hover',
	'after-active',

	// before-after
	'before-after-clean',
	'before-after',
	'before-after-hover',
	'before-after-active',
]);
