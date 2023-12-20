import { RegExpHelper } from './reg-exp.helper';

describe('RegExpHelper', () => {
	describe('makeRegex', () => {
		it('should create regex with wildcard for matching parenthesis', () => {
			const regex = RegExpHelper.makeRegex('color: (blue)');

			expect(regex).toEqual(new RegExp(/color: \(blue[\s\S]*\)/));
		});

		it('should create regex with wildcard at the end if no matching parenthesis', () => {
			const regex = RegExpHelper.makeRegex('color: blue');

			expect(regex).toEqual(new RegExp('color: blue[\\s\\S]*'));
		});
	});

	describe('paramToRegex', () => {
		it('should transform rule parameters to regex source strings', () => {
			const rules = [
				{ type: 'at-rule', name: 'include', parameter: '^media-min(xs)' },
				{ type: 'at-rule', name: 'media', parameter: '(width)' },
			];
			const transformed = RegExpHelper.paramToRegex(rules);

			expect(transformed).toEqual([
				{
					'name': 'include',
					'parameter': '^media-min\\(xs[\\s\\S]*\\)',
					'type': 'at-rule',
				},
				{
					'name': 'media',
					'parameter': '\\(width[\\s\\S]*\\)',
					'type': 'at-rule',
				},
			]);
		});

		it('should not modify rules without a string parameter', () => {
			const rules = [
				{ type: 'at-rule', name: 'include', parameter: 123 },
				{ type: 'rule', name: 'color', parameter: 'blue' },
			];
			const transformed = RegExpHelper.paramToRegex(rules);

			expect(transformed).toEqual(rules);
		});
	});
});
