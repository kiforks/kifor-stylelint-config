import { MEDIA_ORDER } from './media-order.constant';

describe('MediaOrder', () => {
	it('should return correct config data', () => {
		expect(MEDIA_ORDER).toEqual({
			'between': [
				{
					'name': 'include',
					'parameter': '^media-between(xs, sm)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(xs, md)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(xs, lg)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(xs, xl)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(xs, xxl)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(sm, md)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(sm, lg)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(sm, xl)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(sm, xxl)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(md, lg)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(md, xl)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(md, xxl)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(lg, xl)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(lg, xxl)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-between(xl, xxl)',
					'type': 'at-rule',
				},
			],
			'devices': [
				{
					'name': 'include',
					'parameter': '^media-desktop',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-mobile',
					'type': 'at-rule',
				},
			],
			'max': [
				{
					'name': 'include',
					'parameter': '^media-max(xs)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-max(sm)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-max(md)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-max(lg)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-max(xl)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-max(xxl)',
					'type': 'at-rule',
				},
			],
			'min': [
				{
					'name': 'include',
					'parameter': '^media-min(xs)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-min(sm)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-min(md)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-min(lg)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-min(xl)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-min(xxl)',
					'type': 'at-rule',
				},
			],
			'only': [
				{
					'name': 'include',
					'parameter': '^media-only(xs)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-only(sm)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-only(md)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-only(lg)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-only(xl)',
					'type': 'at-rule',
				},
				{
					'name': 'include',
					'parameter': '^media-only(xxl)',
					'type': 'at-rule',
				},
			],
		});
	});
});
