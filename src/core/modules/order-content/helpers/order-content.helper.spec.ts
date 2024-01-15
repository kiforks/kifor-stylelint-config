import { OrderContentHelper } from './order-content.helper';

describe('OrderContentHelper', () => {
	describe('createMediaFeatures', () => {
		it('should create an array of media feature at-rules', () => {
			const features = ['max-width: 768px', 'min-resolution: 2dppx'];
			const mediaFeatures = OrderContentHelper.createMediaFeatures(features);

			expect(mediaFeatures).toEqual([
				{ type: 'at-rule', name: 'media', parameter: '(max-width: 768px)' },
				{ type: 'at-rule', name: 'media', parameter: '(min-resolution: 2dppx)' },
			]);
		});
	});

	describe('createPseudoClasses', () => {
		it('should create an array of pseudo class rules', () => {
			const pseudoClasses = ['hover', 'active'];
			const pseudoClassRules = OrderContentHelper.createPseudoClasses(pseudoClasses);

			expect(pseudoClassRules).toEqual([
				{ type: 'rule', selector: '^&:hover' },
				{ type: 'rule', selector: '^&:active' },
			]);
		});
	});

	describe('createPseudoElements', () => {
		it('should create an array of pseudo-element rules', () => {
			const pseudoElements = ['before', 'after'];
			const pseudoElementRules = OrderContentHelper.createPseudoElements(pseudoElements);

			expect(pseudoElementRules).toEqual([
				{ type: 'rule', selector: '^&::before' },
				{ type: 'rule', selector: '^&::after' },
			]);
		});
	});
});
