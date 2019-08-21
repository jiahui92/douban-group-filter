module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3333',
                changeOrigin: true,
            }
        }
    },
    configureWebpack: {
        externals: {
            'vue': 'Vue',
            'element-ui': 'ELEMENT'
        }
    }
}