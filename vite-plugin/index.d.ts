import type { Options, Plugin } from "vite";

declare function frameworkPlugin(
  pluginConfig?: Partial<Options>
): Plugin<any>[];

export default frameworkPlugin;
