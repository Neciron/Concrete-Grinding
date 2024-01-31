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
      'about': './src/pages/AboutPage/AboutPage.pug',
      'reviews': './src/pages/ReviewsPage/ReviewsPage.pug',
      'admin/applications/index': './src/pages/AdminApplicationsPage/AdminApplicationsPage.pug',
      'admin/content/index': './src/pages/AdminContentPage/AdminContentPage.pug',
      'admin/index': './src/pages/AdminPage/AdminPage.pug',
      'admin/reviews/index': './src/pages/AdminReviewsPage/AdminReviewsPage.pug',
      'admin/users/index': './src/pages/AdminUsersPage/AdminUsersPage.pug',
    },
    // output: {
    //   path: path.resolve(__dirname, "dist"),
    //   filename: "script.js",
    // },
    devServer: !devServer ? undefined : {
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      host: 'localhost',
      hot: true,
      port: 5174,
      client: {
        overlay: true,
        progress: true,
      },
      watchFiles: ['./src/scss/**/*.scss'],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
      extensions: [".tsx", ".ts", ".js", ".jsx"],
    },
    plugins: [
      new PugPlugin({
        pretty: true, // formatting HTML, useful for development mode
        js: {
          // output filename of extracted JS file from source script
          filename: 'js/[name].[contenthash:8].js',
        },
        css: {
          // output filename of extracted CSS file from source style
          filename: 'css/[name].[contenthash:8].css',
        },
      }), // rendering of Pug files defined in Webpack entry
      new CleanWebpackPlugin(),
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
        // sass-loader
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            // "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
        {
          test: /\.(png|jpg|jpeg|ico)/,
          type: 'asset/resource',
          generator: {
            // output filename of images
            filename: 'assets/img/[name].[hash:8][ext]',
          },
        },
      ],
    },
  };
  return config;
};
