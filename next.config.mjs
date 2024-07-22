const nextConfig = {
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    // Modify the Webpack configuration here
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'd3-interpolate': false,
      };
    }

    // Add Babel options to Webpack configuration
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          compact: false, // Disable compacting for both dev and prod
          presets: [
            '@babel/preset-env',
            ['@babel/preset-react', { runtime: 'automatic' }]
          ],
        },
      },
    });

    return config;
  },
};

export default nextConfig;
