module.exports = {
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    open: true
  },

  lintOnSave: false, // 临时关闭eslint检查

  publicPath:
    process.env.NODE_ENV === "production" ? "/admin/" : "/",

  outputDir:__dirname+'/../server/admin'
};
