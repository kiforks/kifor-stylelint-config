import { ORDER_CONTENT } from './order-content.constant';

describe('ORDER_CONTENT', () => {
	it('should have the following value', () => {
		expect(ORDER_CONTENT).toEqual([
			{
				'name': 'property',
				'type': 'at-rule',
			},
		]);
	});
});
