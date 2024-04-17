/* prettier-ignore */
import { stylelintMock } from '../../../../mocks/stylelint.mock';

import { PluginMediaConfig } from '../../../configs/plugin-media/plugin-media.config';

import { PluginNoDuplicateAtRule } from '../api/plugin-no-duplicate-at-rule';

import { pluginNoDuplicateAtRuleProvider } from './plugin-no-duplicate-at-rule.provider';

jest.mock('stylelint', () => stylelintMock());

describe('PluginNoDuplicateAtRule', () => {
	it('should have the following value', () => {
		const provider = {
			provide: PluginNoDuplicateAtRule,
			options: PluginMediaConfig.AT_RULES,
		};

		expect(pluginNoDuplicateAtRuleProvider()).toEqual(provider);
	});
});
