//本番モードフラグ
const is_production = process.env.NODE_ENV === 'production';
import dev_config from './webpack.dev.mjs';
import prod_config from './webpack.prod.mjs';

export default is_production ? prod_config : dev_config;
