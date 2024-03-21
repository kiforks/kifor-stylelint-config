import { PluginMaxNestingDepthOptions } from '../interfaces/plugin-max-nesting-depth.interface';

import { stylelintMock } from '../../../../mocks/stylelint.mock';
import { PluginMaxNestingDepth } from '../api/plugin-max-nesting-depth';
import { pluginMaxNestingDepthProvider } from './plugin-max-nesting-depth.provider';

jest.mock('stylelint', () => stylelintMock());

describe('PluginMaxNestingDepthProvider', () => {
	it('should have the following value', () => {
		const provider = {
			provide: PluginMaxNestingDepth,
			options: [
				3,
				{
					ignore: ['pseudo-classes'],
					ignoreRules: ['/^&::/', '/^::/'],
					ignoreAtRules: ['/^\\include/', '/^\\media/'],
					ignoreHostSelectors: [/:host/],
				},
			] as PluginMaxNestingDepthOptions,
		};

		expect(pluginMaxNestingDepthProvider()).toEqual(provider);
	});
});
