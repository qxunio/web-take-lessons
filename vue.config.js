let hosts = 'localhost';
let tl = 'http://localhost:9000';

module.exports = {
    devServer: {
        port: 8080,
        host: hosts,
        https: false,
        open: true,

        proxy: {
            '/tl': {
                target: tl,
                changeOrigin: true,
                pathRewrite: {
                    '^/tl': '/'
                }
            },
        },
    },
    outputDir: 'ROOT',
    productionSourceMap: false
};
