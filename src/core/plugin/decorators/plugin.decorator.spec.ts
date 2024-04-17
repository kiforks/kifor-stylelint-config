/* prettier-ignore */
import { stylelintMock } from '../../mocks/stylelint.mock';

import { Config } from 'stylelint';

import { PluginMaxNestingDepth } from '../plugins/plugin-max-nesting-depth/api/plugin-max-nesting-depth';
import { PluginNoSelfNesting } from '../plugins/plugin-no-self-nesting/api/plugin-no-self-nesting';

import { Plugin } from './plugin.decorator';

jest.mock('stylelint', () => stylelintMock({ plugin: 'name' }));

describe('PluginDecorator', () => {
	it('should have the following value', () => {
		@Plugin({
			providers: [
				{
					provide: PluginNoSelfNesting,
					options: { someOption: 'value' },
				},
				{
					provide: PluginMaxNestingDepth,
					options: { someOption: 'value-2' },
				},
			],
		})
		class Configuration implements Config {
			public plugins = ['stylelint-order'];
			public rules = { 'color-no-hex': true };
		}

		const decorator = new Configuration();

		expect(decorator.plugins).toEqual(['stylelint-order', { plugin: 'name' }, { plugin: 'name' }]);
		expect(decorator.rules).toEqual({
			'color-no-hex': true,
			'kifor-stylelint/no-self-nesting': { someOption: 'value' },
			'kifor-stylelint/max-nesting-depth': { someOption: 'value-2' },
		});
	});
});
