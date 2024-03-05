import stylelint, { Config } from 'stylelint';

import { PluginBase } from '../plugins/plugin-base/api/plugin-base';

export type PluginRules = Config['rules'];
export type PluginPlugins = Array<string | stylelint.Plugin>;
export type PluginProvide = new () => PluginBase;
export type PluginConstructor = new (...args: any[]) => Config;
export type PluginIgnoreRegExp = string | RegExp;
export type PluginIgnoreRegExpArray = PluginIgnoreRegExp[];

export interface PluginProvider<T = unknown> {
	options: T;
	provide: PluginProvide;
}

export interface PluginDecoratorConfig {
	providers: PluginProvider[];
}
