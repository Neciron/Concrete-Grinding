import path from "path";
import webpack from "webpack";
import "webpack-dev-server";
// @ts-expect-error
import PugPlugin from 'pug-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

interface EnvironmentOptions {
  WEBPACK_SERVE?: boolean;
  WEBPACK_BUNDLE?: boolean;
  WEBPACK_BUILD?: boolean;
  production?: boolean;
}

export default (env: EnvironmentOptions): webpack.Configuration => {
  const production = env.production ?? false;
  const devServer = Boolean(env.WEBPACK_SERVE) || process.env.WEBPACK_DEV_SERVER === "true";
  const mode = production ? "production" : "development";
  const config: webpack.Configuration = {
    mode,
    entry: {
      'index': './src/pages/HomePage/HomePage.pug',
      'script': './src/index.ts',
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "script.js",
    },
    devServer: !devServer ? undefined : {
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      host: 'localhost',
      hot: true,
      port: 5174,
  } ,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
      extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new PugPlugin(), // rendering of Pug files defined in Webpack entry
    ],
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                configFile: path.resolve(__dirname, "tsconfig.json"),
                onlyCompileBundledFiles: true,
              },
            },
          ],
        },
        {
          test: /\.pug$/,
          loader: PugPlugin.loader, 
        },
      ],
    },
  };
  return config;
};
