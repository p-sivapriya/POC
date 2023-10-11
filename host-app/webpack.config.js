const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const { dependencies } = require("./package.json");
const path = require("path");

module.exports = {
 entry: "./src/index",
    mode: "development",
 
 devServer: {
     port: 3000,
     static: {
        directory: path.join(__dirname, "public"),
        },
 },
 module: {
   rules: [
     {
       test: /\.(js|jsx)?$/,
       exclude: /node_modules/,
       use: [
         {
           loader: "babel-loader",
           options: {
             presets: ["@babel/preset-env", "@babel/preset-react"],
           },
         },
       ],
     },
     {
       test: /\.css$/i,
       use: ["style-loader", "css-loader"],
         },
         {
            test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
            exclude: /node_modules/,
            use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
          }
   ],
 },
 plugins: [
   new HtmlWebpackPlugin({
     template: "./public/index.html",
     favicon: "./public/favicon.ico",
   }),
    new ModuleFederationPlugin({
      name: "Host",
      remotes: {
        Remote: `Remote@http://localhost:4000/moduleEntry.js`,
      },
      shared: {
        ...dependencies,
        react: {
          singleton: true,
          requiredVersion: dependencies["react"],
        },
        "react-dom": {
          singleton: true,
          requiredVersion: dependencies["react-dom"],
        },
      },
    }),
 ],
 resolve: {
   extensions: [".js", ".jsx"],
 },
 target: "web",
};