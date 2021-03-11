const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
var path = require('path');

console.log(__dirname)
const htmlWebpackInlineSourcePlugin = new HtmlWebpackInlineSourcePlugin();

module.exports = {
  entry: {
    signalView: path.resolve(__dirname, "react-app/src/signalView.tsx"),
    messageView: path.resolve(__dirname, "react-app/src/messageView.tsx"),
    nodeView: path.resolve(__dirname, "react-app/src/nodeView.tsx"),
    attributeView: path.resolve(__dirname, "react-app/src/attributeView.tsx"),
    tableView: path.resolve(__dirname, "react-app/src/tableView.tsx")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  resolve: {
    // 加入'.ts' and '.tsx' 結尾
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      { test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader" ,
        options: {
          configFile: path.join(__dirname, "/react-app/tsconfig.json")
        }
      },
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
  }
};