import { PluginConfigExecutionMode } from '../../../interfaces/plugin-config.interface';

import { stylelintMock } from '../../../../mocks/stylelint.mock';
import { PluginSelectorCombinatorNesting } from '../api/plugin-selector-combinator-nesting';
import { pluginSelectorCombinatorNestingProvider } from './plugin-selector-combinator-nesting.provider';

jest.mock('stylelint', () => stylelintMock());

describe('PluginSelectorCombinatorNestingProvider', () => {
	it('should have the following value', () => {
		const provider = {
			provide: PluginSelectorCombinatorNesting,
			options: 'always' as PluginConfigExecutionMode,
		};

		expect(pluginSelectorCombinatorNestingProvider()).toEqual(provider);
	});
});
