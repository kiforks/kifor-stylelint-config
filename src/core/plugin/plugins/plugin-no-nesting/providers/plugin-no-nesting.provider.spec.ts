import { PluginNoNestingOptions } from '../interfaces/plugin-no-nesting.interface';

import { stylelintUtilsMock } from '../../../../mocks/stylelint-utils.mock';
import { PluginNoNesting } from '../api/plugin-no-nesting';
import { pluginNoNestingProvider } from './plugin-no-nesting.provider';

jest.mock('stylelint', () => stylelintUtilsMock);

describe('PluginNoNestingProvider', () => {
	it('should have the following value', () => {
		const provider = {
			provide: PluginNoNesting,
			options: [
				{ type: 'rule', selector: 'body' },
				{ type: 'rule', selector: 'html' },
				{ type: 'rule', selector: 'main' },
				{ type: 'rule', selector: 'h1' },
				{ type: 'rule', selector: /^:host/ },
				{ type: 'rule', selector: /^::ng-deep/ },
				{ type: 'rule', selector: /^&::ng-deep/ },
				{ type: 'at-rule', name: 'include', parameter: /^media-/ },
			] as PluginNoNestingOptions,
		};

		expect(pluginNoNestingProvider()).toEqual(provider);
	});
});
