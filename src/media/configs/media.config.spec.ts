import { MediaConfig } from './media.config';

describe('MediaConfig', () => {
	it('should have the correct breakpoints', () => {
		expect(MediaConfig.BREAKPOINTS).toEqual(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']);
	});

	it('should have the correct devices', () => {
		expect(MediaConfig.DEVICES).toEqual(['desktop', 'mobile']);
	});

	it('should have the correct prefix', () => {
		expect(MediaConfig.PREFIX).toBe('^media-');
	});
});
