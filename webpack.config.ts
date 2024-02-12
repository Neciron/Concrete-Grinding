import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import type { Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import path from 'path';
// @ts-expect-error
import PugPlugin from 'pug-plugin';

interface EnvironmentOptions {
  WEBPACK_SERVE?: boolean;
  WEBPACK_BUNDLE?: boolean;
  WEBPACK_BUILD?: boolean;
  production?: boolean;
}

const devServerConfig: DevServerConfiguration = {
  static: {
    directory: path.join(__dirname, 'dist'),
  },
  host: 'localhost',
  compress: true,
  open: false,
  liveReload: true,
  client: {
    overlay: false,
  },
  watchFiles: {
    paths: ['src/**/*.*'],
    options: {
      usePolling: true,
    },
  },
};

export default (env: EnvironmentOptions): Configuration => {
  const production = env.production ?? false;
  const devServer = Boolean(env.WEBPACK_SERVE) || process.env.WEBPACK_DEV_SERVER === 'true';
  const mode = production ? 'production' : 'development';
  const config: Configuration = {
    mode,
    entry: {
      'index': './src/pages/HomePage/HomePage.pug',
      'about/index': './src/pages/AboutPage/AboutPage.pug',
      'feedbacks/index': './src/pages/FeedbacksPage/FeedbacksPage.pug',
      'admin/applications/index': './src/pages/AdminApplicationsPage/AdminApplicationsPage.pug',
      'admin/content/index': './src/pages/AdminContentPage/AdminContentPage.pug',
      'admin/index': './src/pages/AdminPage/AdminPage.pug',
      'admin/feedbacks/index': './src/pages/AdminFeedbacksPage/AdminFeedbacksPage.pug',
      'admin/users/index': './src/pages/AdminUsersPage/AdminUsersPage.pug',
    },
    devtool: production ? false : 'inline-source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: production ? '/Concrete-Grinding/' : '/',
    },
    devServer: devServer ? devServerConfig : undefined,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    plugins: [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      new PugPlugin({
        // formatting HTML, useful for development mode
        pretty: true,
        js: {
          // output filename of extracted JS file from source script
          filename: 'js/[name].[contenthash:8].js',
        },
        css: {
          // output filename of extracted CSS file from source style
          filename: 'css/[name].[contenthash:8].css',
        },
      }),
      new CleanWebpackPlugin(),
    ],
    externals: ['firebase'],
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.pug$/,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
          oneOf: [
            // import Pug in JavaScript/TypeScript as template function
            {
              // match scripts where Pug is used
              issuer: /\.(js|ts)$/,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              loader: PugPlugin.loader,
              options: {
                // compile Pug into template function
                method: 'compile',
              },
            },
            // render Pug from Webpack entry into static HTML
            {
              // default method is 'render'
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              loader: PugPlugin.loader,
            },
          ],
        },
        // sass-loader
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            // "style-loader",
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
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
