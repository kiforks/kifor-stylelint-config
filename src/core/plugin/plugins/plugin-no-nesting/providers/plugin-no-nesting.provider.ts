import { RuleHelper } from '../../../../rule/helpers/rule-order/rule.helper';

import { PluginProvider } from '../../../interfaces/plugin.interface';
import { PluginNoNestingOptions } from '../interfaces/plugin-no-nesting.interface';

import { PluginNoNesting } from '../api/plugin-no-nesting';

export const pluginNoNestingProvider = (): PluginProvider => {
	return {
		provide: PluginNoNesting,
		options: [
			RuleHelper.createSelector('body'),
			RuleHelper.createSelector('html'),
			RuleHelper.createSelector('main'),
			RuleHelper.createSelector('h1'),
			RuleHelper.createSelector(/^:host/),
			RuleHelper.createSelector(/^::ng-deep/),
			RuleHelper.createSelector(/^&::ng-deep/),
			RuleHelper.createInclude(/^media-/),
		] as PluginNoNestingOptions,
	};
};
