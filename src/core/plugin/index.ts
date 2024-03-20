import { PluginProvider } from './interfaces/plugin.interface';

import { pluginMaxNestingDepthProvider } from './plugins/plugin-max-nesting-depth/providers/plugin-max-nesting-depth.provider';
import { pluginNoNestingProvider } from './plugins/plugin-no-nesting/providers/plugin-no-nesting.provider';

export * from './plugins/plugin-max-nesting-depth/api/plugin-max-nesting-depth';
export * from './plugins/plugin-base/api/plugin-base';

export const plugins: PluginProvider[] = [pluginMaxNestingDepthProvider(), pluginNoNestingProvider()];
