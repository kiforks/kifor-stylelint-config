/* prettier-ignore */
import { stylelintMock } from '../../../../mocks/stylelint.mock';

import { PluginNoSelfNesting } from '../api/plugin-no-self-nesting';

import { PluginConfigRuleType } from '../../../interfaces/plugin-config.interface';

import { pluginNoSelfNestingProvider } from './plugin-no-self-nesting.provider';

jest.mock('stylelint', () => stylelintMock());

describe('PluginNoSelfNestingProvider', () => {
	it('should have the following value', () => {
		const provider = {
			provide: PluginNoSelfNesting,
			options: [
				{ selector: 'body' },
				{ selector: 'html' },
				{ selector: 'main' },
				{ selector: 'h1' },
				{ selector: /^:host/ },
				{ selector: /^&:host/ },
				{ selector: /^::ng-deep/ },
				{ selector: /^&::ng-deep/ },
				{ name: 'include', params: /^media-/ },
			] as PluginConfigRuleType[],
		};

		expect(pluginNoSelfNestingProvider()).toEqual(provider);
	});
});
