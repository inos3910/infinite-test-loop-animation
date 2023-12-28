import { merge } from 'webpack-merge';
import common from './webpack.common.mjs';
import TerserPlugin from 'terser-webpack-plugin';

export default merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          format: {
            ascii_only: true,
          },
        },
      }),
    ],
  },
});
