import { PluginMaxNestingDepthOptions } from '../interfaces/plugin-max-nesting-depth.interface';

import { stylelintUtilsMock } from '../../../../mocks/stylelint-utils.mock';
import { PluginMaxNestingDepth } from '../api/plugin-max-nesting-depth';
import { pluginMaxNestingDepthProvider } from './plugin-max-nesting-depth.provider';

jest.mock('stylelint', () => stylelintUtilsMock);

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
