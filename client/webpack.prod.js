const merge = require("webpack-merge");
const common = require("./webpack.common.js");

const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new CopyWebpackPlugin([
      { from: "../conf/prod/appconfig.json", to: "config/appconfig.json" },
      { from: "./config/language.json", to: "config" },
      { from: "../server/", to: "../dist/api/" },
      { from: "../conf/prod/conf.ini", to: "../dist/api/config/conf.ini" },
    ]),
  ],
});
