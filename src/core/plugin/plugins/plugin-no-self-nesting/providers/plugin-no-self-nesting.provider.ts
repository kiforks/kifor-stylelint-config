import { RuleHelper } from '../../../../rule/helpers/rule-order/rule.helper';

import { PluginProvider } from '../../../interfaces/plugin.interface';
import { PluginNoSelfNestingOptions } from '../interfaces/plugin-no-self-nesting.interface';

import { PluginNoSelfNesting } from '../api/plugin-no-self-nesting';

export const pluginNoSelfNestingProvider = (): PluginProvider => {
	return {
		provide: PluginNoSelfNesting,
		options: [
			RuleHelper.createSelector('body'),
			RuleHelper.createSelector('html'),
			RuleHelper.createSelector('main'),
			RuleHelper.createSelector('h1'),
			RuleHelper.createSelector(/^:host/),
			RuleHelper.createSelector(/^&:host/),
			RuleHelper.createSelector(/^::ng-deep/),
			RuleHelper.createSelector(/^&::ng-deep/),
			RuleHelper.createInclude(/^media-/),
		] as PluginNoSelfNestingOptions,
	};
};
