import { PluginNoSelfNestingOptions } from '../interfaces/plugin-no-self-nesting.interface';

import { stylelintMock } from '../../../../mocks/stylelint.mock';
import { PluginNoSelfNesting } from '../api/plugin-no-self-nesting';
import { pluginNoSelfNestingProvider } from './plugin-no-self-nesting.provider';

jest.mock('stylelint', () => stylelintMock());

describe('PluginNoSelfNestingProvider', () => {
	it('should have the following value', () => {
		const provider = {
			provide: PluginNoSelfNesting,
			options: [
				{ type: 'rule', selector: 'body' },
				{ type: 'rule', selector: 'html' },
				{ type: 'rule', selector: 'main' },
				{ type: 'rule', selector: 'h1' },
				{ type: 'rule', selector: /^:host/ },
				{ type: 'rule', selector: /^&:host/ },
				{ type: 'rule', selector: /^::ng-deep/ },
				{ type: 'rule', selector: /^&::ng-deep/ },
				{ type: 'at-rule', name: 'include', parameter: /^media-/ },
			] as PluginNoSelfNestingOptions,
		};

		expect(pluginNoSelfNestingProvider()).toEqual(provider);
	});
});
