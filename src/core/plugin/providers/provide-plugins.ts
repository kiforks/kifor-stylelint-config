import { Plugin } from 'stylelint';

import { PluginBase } from '../classes/plugin-base/plugin-base';

export const providePlugins = (plugins: Array<new () => PluginBase>): Plugin[] =>
	plugins.map(PluginClass => new PluginClass().createRule());
