import { PluginConfigRuleType } from '../../../interfaces/plugin-config.interface';

import { stylelintMock } from '../../../../mocks/stylelint.mock';
import { PluginNoFirstLevelNesting } from '../api/plugin-no-first-level-nesting';
import { pluginNoFirstLevelNestingProvider } from './plugin-no-first-level-nesting.provider';

jest.mock('stylelint', () => stylelintMock());

describe('PluginNoFirstLevelNestingProvider', () => {
	it('should have the following value', () => {
		const provider = {
			provide: PluginNoFirstLevelNesting,
			options: [
				{ selector: /^(?![a-zA-Z.#])(?!(?::host|:root)).*$/ },
				{ name: /^media/ },
				{ name: 'include', params: /^media-/ },
			] as PluginConfigRuleType[],
		};

		expect(pluginNoFirstLevelNestingProvider()).toEqual(provider);
	});
});
