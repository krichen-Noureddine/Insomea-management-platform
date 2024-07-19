const nextConfig = {
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'd3-interpolate': false,
      };
    }
    return config;
    
  },
};

export default nextConfig;
