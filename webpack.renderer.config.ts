import type { Configuration } from "webpack";
import path from "path";

import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";

rules.push({
  test: /\.css$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader" },
    { loader: "postcss-loader" },
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias: {
      "@Assets": path.resolve(__dirname, "./src/renderer/assets"),
      "@Components": path.resolve(__dirname, "./src/renderer/components"),
      "@Config": path.resolve(__dirname, "./config"),
      "@Layouts": path.resolve(__dirname, "./src/renderer/layouts"),
      "@Pages": path.resolve(__dirname, "./src/renderer/pages"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
