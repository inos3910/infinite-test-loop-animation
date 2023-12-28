import { paths } from './config.mjs';

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

export default {
  cache: true,
  output: {
    filename: '[name].bundle.js',
  },
  // plugins: [
  //   // new BundleAnalyzerPlugin(),
  // ],
  target: ['web', 'es5'],
  module: {
    rules: [{
      test: /\.js$/,
        exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      }],
    }],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js'],
    alias: {
      '@as': paths.assetsDir,
      '@js': paths.jsSrcDir,
    },
  },
};
