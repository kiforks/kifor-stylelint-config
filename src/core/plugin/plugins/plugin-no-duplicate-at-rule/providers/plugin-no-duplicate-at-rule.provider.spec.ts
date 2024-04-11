import { PluginConfigRuleType } from '../../../interfaces/plugin-config.interface';

import { stylelintMock } from '../../../../mocks/stylelint.mock';
import { PluginNoDuplicateAtRule } from '../api/plugin-no-duplicate-at-rule';
import { pluginNoDuplicateAtRuleProvider } from './plugin-no-duplicate-at-rule.provider';

jest.mock('stylelint', () => stylelintMock());

describe('PluginNoDuplicateAtRule', () => {
	it('should have the following value', () => {
		const provider = {
			provide: PluginNoDuplicateAtRule,
			options: [
				{
					'name': 'include',
					'params': /^media-min/,
				},
				{
					'name': 'include',
					'params': /^media-max/,
				},
				{
					'name': 'include',
					'params': /^media-only/,
				},
				{
					'name': 'include',
					'params': /^media-between/,
				},
			] as PluginConfigRuleType[],
		};

		expect(pluginNoDuplicateAtRuleProvider()).toEqual(provider);
	});
});
