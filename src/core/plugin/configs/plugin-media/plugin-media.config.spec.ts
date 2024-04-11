import { PluginMediaConfig } from './plugin-media.config';

describe('PluginMediaConfig', () => {
	describe('MEDIA_PREFIX_MIXIN', () => {
		it('should define the correct MEDIA_PREFIX_MIXIN', () => {
			expect(PluginMediaConfig.MEDIA_PREFIX_MIXIN).toEqual({
				name: 'include',
				params: '^media-',
			});
		});
	});

	describe('MEDIA_PREFIX_REGEXP_MIXIN', () => {
		it('should define the correct MEDIA_PREFIX_REGEXP_MIXIN', () => {
			expect(PluginMediaConfig.MEDIA_PREFIX_REGEXP_MIXIN).toEqual({
				name: 'include',
				params: /^media-/,
			});
		});
	});

	describe('MEDIA_MIN_PREFIX_MIXIN', () => {
		it('should define the correct MEDIA_MIN_PREFIX_MIXIN', () => {
			expect(PluginMediaConfig.MEDIA_MIN_PREFIX_MIXIN).toEqual({
				name: 'include',
				params: '^media-min',
			});
		});
	});

	describe('MEDIA_MAX_PREFIX_MIXIN', () => {
		it('should define the correct MEDIA_MAX_PREFIX_MIXIN', () => {
			expect(PluginMediaConfig.MEDIA_MAX_PREFIX_MIXIN).toEqual({
				name: 'include',
				params: '^media-max',
			});
		});
	});

	describe('MEDIA_ONLY_PREFIX_MIXIN', () => {
		it('should define the correct MEDIA_ONLY_PREFIX_MIXIN', () => {
			expect(PluginMediaConfig.MEDIA_ONLY_PREFIX_MIXIN).toEqual({
				name: 'include',
				params: '^media-only',
			});
		});
	});

	describe('MEDIA_BETWEEN_PREFIX_MIXIN', () => {
		it('should define the correct MEDIA_BETWEEN_PREFIX_MIXIN', () => {
			expect(PluginMediaConfig.MEDIA_BETWEEN_PREFIX_MIXIN).toEqual({
				name: 'include',
				params: '^media-between',
			});
		});
	});

	describe('MEDIA_MIN_PREFIX_REGEXP_MIXIN', () => {
		it('should define the correct MEDIA_MIN_PREFIX_REGEXP_MIXIN', () => {
			expect(PluginMediaConfig.MEDIA_MIN_PREFIX_REGEXP_MIXIN).toEqual({
				name: 'include',
				params: /^media-min/,
			});
		});
	});

	describe('MEDIA_MAX_PREFIX_REGEXP_MIXIN', () => {
		it('should define the correct MEDIA_MAX_PREFIX_REGEXP_MIXIN', () => {
			expect(PluginMediaConfig.MEDIA_MAX_PREFIX_REGEXP_MIXIN).toEqual({
				name: 'include',
				params: /^media-max/,
			});
		});
	});

	describe('MEDIA_ONLY_PREFIX_REGEXP_MIXIN', () => {
		it('should define the correct MEDIA_ONLY_PREFIX_REGEXP_MIXIN', () => {
			expect(PluginMediaConfig.MEDIA_ONLY_PREFIX_REGEXP_MIXIN).toEqual({
				name: 'include',
				params: /^media-only/,
			});
		});
	});

	describe('MEDIA_BETWEEN_PREFIX_REGEXP_MIXIN', () => {
		it('should define the correct MEDIA_BETWEEN_PREFIX_REGEXP_MIXIN', () => {
			expect(PluginMediaConfig.MEDIA_BETWEEN_PREFIX_REGEXP_MIXIN).toEqual({
				name: 'include',
				params: /^media-between/,
			});
		});
	});
});
