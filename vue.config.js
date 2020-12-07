module.exports = {
    devServer: {
        proxy: {
            "^/backend": {
                target: "http://localhost:9103",
                changeOrigin: true,
                pathRewrite: {
                    "^/backend": "/"
                }
            }
        }
    }
}