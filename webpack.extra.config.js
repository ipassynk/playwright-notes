/* eslint-disable @typescript-eslint/no-require-imports */
const { join } = require('path');

module.exports = require(
  join(__dirname, '../../node_modules/@rci/ngx-proxy-environment/src/lib/webpack.extra.config.js'),
);
if (['playwright', 'serve'].includes(process.env['NX_TASK_TARGET_TARGET'])) {
  module.exports.module.rules.push({
    test: /\.([jt])s$/,
    use: {
      loader: 'babel-loader',
      options: {
        // presets: ['@babel/preset-env'],
        plugins: ['babel-plugin-istanbul'],
      },
    },
    enforce: 'post',
    include: [join(__dirname, 'src')],
    // include: [join(__dirname, 'src'), join(__dirname, 'proxy')],
    exclude: [
      /\.(e2e|spec)\.ts$/,
      /node_modules/,
      /src\/environments/,
      /\.interface\.ts$/,
      ...['src/main.ts'].map(v => join(__dirname, v)),
    ],
  });
}
