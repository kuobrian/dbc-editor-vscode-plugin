const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
var path = require('path');

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: path.resolve(__dirname, "src/index.html"),
  filename: "./index_out.html",
  inlineSource: '.(js|css)$'
});
const htmlWebpackInlineSourcePlugin = new HtmlWebpackInlineSourcePlugin();

module.exports = {
  entry: [
    path.resolve(__dirname, "src/index.js")
  ],
 
  
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }
        ]
      }
    ],
  },
  plugins: [htmlWebpackPlugin, htmlWebpackInlineSourcePlugin]
};