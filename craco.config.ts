import fs from "fs";

import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import evalSourceMap from "react-dev-utils/evalSourceMapMiddleware";
import redirectServedPath from "react-dev-utils/redirectServedPathMiddleware";
import noopServiceWorker from "react-dev-utils/noopServiceWorkerMiddleware";

import type { CracoConfig } from "@craco/craco";

const config: CracoConfig = {
  webpack: {
    plugins: {
      add: [
        new NodePolyfillPlugin({
          excludeAliases: ["console"],
        }),
      ] /* An array of plugins */,
    },
  },
  devServer: (devServerConfig, { env, paths }) => {
    devServerConfig = {
      onBeforeSetupMiddleware: undefined,
      onAfterSetupMiddleware: undefined,
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error("webpack-dev-server is not defined");
        }

        if (fs.existsSync(paths.proxySetup)) {
          require(paths.proxySetup)(devServer.app);
        }

        middlewares.push(
          evalSourceMap(devServer),
          redirectServedPath(paths.publicUrlOrPath),
          noopServiceWorker(paths.publicUrlOrPath)
        );

        return middlewares;
      },
      historyApiFallback: true,
    };
    return devServerConfig;
  },
};

export default config;
