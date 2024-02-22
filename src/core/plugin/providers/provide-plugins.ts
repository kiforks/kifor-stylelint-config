import { Plugin } from 'stylelint';

import { PluginBase } from '../plugins/plugin-base/api/plugin-base';

export const providePlugins = (plugins: Array<new () => PluginBase>): Plugin[] =>
	plugins.map(PluginClass => new PluginClass().createRule());
