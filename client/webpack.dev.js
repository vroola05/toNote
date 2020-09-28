const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "../dist"),
    compress: true,
    port: 9000,
  },
  watch: true,
  plugins: [
    new CopyWebpackPlugin([
      { from: "../conf/dev/appconfig.json", to: "config/appconfig.json" },
      { from: "./config/language.json", to: "config" },
    ]),
  ],
});
