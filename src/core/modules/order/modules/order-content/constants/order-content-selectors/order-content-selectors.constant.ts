import { OrderHelper } from '../../../../helpers/order/order.helper';

export const ORDER_CONTENT_SELECTORS = OrderHelper.createSelectors([
	'^[a-z]', // example: 'div'
	'^\\*', // example: '*'
	'^\\.\\w+', // example: '.class'
	'^\\w+\\[\\w+', // example: 'input[type]'
	'^\\w+\\[\\w+\\$=', // example: 'input[type$="text"]'
	'^\\w+\\[\\w+\\^=', // example: 'input[type^="text"]'
	'^\\w+\\[\\w+\\*=', // example: 'input[type*="text"]'
	'^\\w+\\[\\w+\\~=', // example: 'input[type~="text"]'
	'^\\w+\\[\\w+\\|=', // example: 'input[type|="text"]'
	'^\\w+\\[\\w+="\\w+"]', // example: 'input[type="text"]'
	'^\\[\\w+', // example: '[attr]'
	'^\\[\\w+\\$=', // example: '[attr$=value]'
	'^\\[\\w+\\^=', // example: '[attr^=value]'
	'^\\[\\w+\\*=', // example: '[attr*=value]'
	'^\\[\\w+\\~=', // example: '[attr~=value]'
	'^\\[\\w+\\|=', // example: '[attr|=value]'
	'^\\>', // example: '> child'
	'^\\+', // example: '+ sibling'
	'^\\~', // example: '~ sibling'
	'^#', // example: '#id'
	'^&\\.\\w+', // example: '&.class'
	'^&\\[\\w+', // example: '&[attr]'
	'^&\\[\\w+\\$=', // example: '[attr$=value]'
	'^&\\[\\w+\\^=', // example: '[attr^=value]'
	'^&\\[\\w+\\*=', // example: '[attr*=value]'
	'^&\\[\\w+\\~=', // example: '[attr~=value]'
	'^&\\[\\w+\\|=', // example: '[attr|=value]'
	'^&', // example: '&'
	'^&:not', // example: '&:not(.class)'
]);