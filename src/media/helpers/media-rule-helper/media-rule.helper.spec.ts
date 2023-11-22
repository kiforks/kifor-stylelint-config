import { MediaRuleHelper } from './media-rule.helper';

describe('MediaRuleHelper', () => {
	describe('getDevicePrefixParameter', () => {
		it('should return correct device prefix', () => {
			const prefix = MediaRuleHelper.getDevicePrefixParameter('mobile');

			expect(prefix).toBe('^media-mobile');
		});
	});

	describe('getBreakpointPrefixParameter', () => {
		it('should return correct breakpoint prefix', () => {
			const prefix = MediaRuleHelper.getBreakpointPrefixParameter('min', 'sm');

			expect(prefix).toBe('^media-min(sm)');
		});
	});

	describe('getBreakpointBetweenPrefixParameter', () => {
		it('should return correct between prefix', () => {
			const prefix = MediaRuleHelper.getBreakpointBetweenPrefixParameter('xs', 'sm');

			expect(prefix).toBe('^media-between(xs, sm)');
		});
	});

	describe('createDeviceRuleOrder', () => {
		it('should return correct at-rule object', () => {
			const atRule = MediaRuleHelper.createDeviceRuleOrder('mobile');

			expect(atRule).toEqual({ type: 'at-rule', name: 'include', parameter: '^media-mobile' });
		});
	});

	describe('createBreakpointRuleOrder', () => {
		it('should return correct at-rule object', () => {
			const atRule = MediaRuleHelper.createBreakpointRuleOrder('min', 'sm');

			expect(atRule).toEqual({ type: 'at-rule', name: 'include', parameter: '^media-min(sm)' });
		});
	});

	describe('createBreakpointBetweenRuleOrder', () => {
		it('should return correct at-rule object', () => {
			const atRule = MediaRuleHelper.createBreakpointBetweenRuleOrder('xs', 'sm');

			expect(atRule).toEqual({ type: 'at-rule', name: 'include', parameter: '^media-between(xs, sm)' });
		});
	});

	describe('createDeviceRulesOrder', () => {
		it('should return an array of at-rule objects', () => {
			const data = MediaRuleHelper.createDeviceRulesOrder(['mobile', 'desktop']);

			expect(data).toEqual([
				{ type: 'at-rule', name: 'include', parameter: '^media-mobile' },
				{ type: 'at-rule', name: 'include', parameter: '^media-desktop' },
			]);
		});
	});

	describe('createBreakpointRulesOrder', () => {
		it('should return an array of at-rule objects', () => {
			const data = MediaRuleHelper.createBreakpointRulesOrder('min', ['sm', 'md']);

			expect(data).toEqual([
				{ type: 'at-rule', name: 'include', parameter: '^media-min(sm)' },
				{ type: 'at-rule', name: 'include', parameter: '^media-min(md)' },
			]);
		});
	});

	describe('createBreakpointBetweenRulesOrder', () => {
		it('should return an array of at-rule objects for each unique pair of breakpoints', () => {
			const data = MediaRuleHelper.createBreakpointBetweenRulesOrder(['xs', 'sm', 'md', 'lg']);

			expect(data).toEqual([
				{
					name: 'include',
					parameter: '^media-between(xs, sm)',
					type: 'at-rule',
				},
				{
					name: 'include',
					parameter: '^media-between(xs, md)',
					type: 'at-rule',
				},
				{
					name: 'include',
					parameter: '^media-between(xs, lg)',
					type: 'at-rule',
				},
				{
					name: 'include',
					parameter: '^media-between(sm, md)',
					type: 'at-rule',
				},
				{
					name: 'include',
					parameter: '^media-between(sm, lg)',
					type: 'at-rule',
				},
				{
					name: 'include',
					parameter: '^media-between(md, lg)',
					type: 'at-rule',
				},
			]);
		});
	});
});
