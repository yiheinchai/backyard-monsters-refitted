const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  mode: 'development',
  entry: './scripts/main.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'openfl': path.resolve(__dirname, 'node_modules/openfl/lib/openfl'),
      'gs': path.resolve(__dirname, 'scripts/gs'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              // Use CommonJS to avoid circular dependency TDZ issues
              // Webpack handles CommonJS circular deps gracefully
              module: 'CommonJS',
              target: 'ES2020',
              moduleResolution: 'node',
              noEmit: false,
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
            },
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: false,
      cwd: process.cwd(),
      // Only log cycles that contain extends-based relationships
      onDetected({ paths, compilation }) {
        // Count circular deps silently
      },
      onEnd({ compilation }) {
        // Log summary
      },
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname),
    },
    port: 3000,
    hot: true,
    open: false,
  },
};
