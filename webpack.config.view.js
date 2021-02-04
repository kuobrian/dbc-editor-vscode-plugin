const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
var path = require('path');



// const htmlWebpackPlugin = new HtmlWebPackPlugin({
//   template: path.resolve(__dirname, "react-app/src/index.html"),
//   filename: "./index_out.html",
//   inlineSource: '.(js|css)$'
// });

const htmlWebpackInlineSourcePlugin = new HtmlWebpackInlineSourcePlugin();

module.exports = {
  entry: {
    signalEditor: path.resolve(__dirname, "react-app/src/signalEditor.tsx"),
    messageEditor: path.resolve(__dirname, "react-app/src/messageEditor.tsx"),
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