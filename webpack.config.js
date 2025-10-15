const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const { ProvidePlugin } = require('webpack');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve.fallback = {
    ...config.resolve.fallback,
    "buffer": require.resolve("buffer/"),
  };

  config.plugins.push(
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};
