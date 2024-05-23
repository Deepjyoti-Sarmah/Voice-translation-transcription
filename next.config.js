// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;



// import nodeExternals from 'webpack-node-externals';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.target = 'electron-renderer';
//     }

//     config.externals = [
//       nodeExternals({
//         allowlist: [/^onnxruntime-node/],
//       }),
//     ];

//     config.module.rules.push({
//       test: /\.node$/,
//       use: 'node-loader',
//     });

//     return config;
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    // (Optional) Export as a static site
    // See https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#configuration
    output: 'export', // Feel free to modify/remove this option

    // Override the default webpack configuration
    webpack: (config) => {
        // See https://webpack.js.org/configuration/resolve/#resolvealias
        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
        }
        return config;
    },
}

module.exports = nextConfig
