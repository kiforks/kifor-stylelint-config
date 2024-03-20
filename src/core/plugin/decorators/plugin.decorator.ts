import { PluginConstructor, PluginDecoratorConfig, PluginPlugins, PluginRules } from '../interfaces/plugin.interface';

export const Plugin = (config: PluginDecoratorConfig): (<T extends PluginConstructor>(constructor: T) => T) => {
	return <T extends PluginConstructor>(constructor: T): T => {
		return class extends constructor {
			constructor(...args: any[]) {
				super(...args);

				const currentPlugins = (this.plugins || []) as PluginPlugins;
				const currentRules: PluginRules = this.rules;

				this.plugins = [...currentPlugins, ...config.providers.map(({ provide }) => new provide().createRule())];

				this.rules = Object.assign(
					{},
					currentRules,
					...config.providers.map(({ options }, index) => {
						const ruleName = new config.providers[index].provide().name;

						return { [ruleName]: options };
					})
				);
			}
		};
	};
};
