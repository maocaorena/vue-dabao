var path = require('path')
var glob = require('glob')

var build = {
	env: require('./prod.env'),
	//index: path.resolve(__dirname, '../dist/index.html'),
	//login: path.resolve(__dirname, '../dist/login.html'),
	assetsRoot: path.resolve(__dirname, '../dist'),
	assetsSubDirectory: './',
	assetsPublicPath: './',
	productionSourceMap: false,
	productionGzip: false,
	productionGzipExtensions: ['js', 'css']
}

function getEntry(globPath) {
	var entries = {},
		basename;

	glob.sync(globPath).forEach(function(entry) {

		basename = path.basename(entry, path.extname(entry));
		entries[basename] = entry;
	});
	return entries;
}

var pages = getEntry('src/pages/**/*.html');

for(var pathname in pages) {
	if(isFolder(pathname)){
		build[pathname] = path.resolve(__dirname, '../dist/html/' + pathname + '/index.html')
	}else{
		build[pathname] = path.resolve(__dirname, '../dist/html/' + pathname + '.html')
	};
};
function isFolder(t){
	var _folder = ['account', 'ad', 'finance'];
	for(var _t=0;_t<_folder.length;_t++){
		if(t == _folder[_t]){
			return true;
		}
	};
	return false;
}
module.exports = {
	build: build
		/*{
		    env: require('./prod.env'),
		    //index: path.resolve(__dirname, '../dist/index.html'),
		    //login: path.resolve(__dirname, '../dist/login.html'),
		    assetsRoot: path.resolve(__dirname, '../dist'),
		    assetsSubDirectory: 'static',
		    assetsPublicPath: '/',
		    productionSourceMap: true,
		    productionGzip: false,
		    productionGzipExtensions: ['js', 'css']
		  }*/
		,
	dev: {
		env: require('./dev.env'),
		port: 8081,
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		proxyTable: {
			'/bb': { 
                target: 'https://buy.bianxianmao.com/',
                changeOrigin: true,
                pathRewrite:{
                	'^/bb':''
                }
          	}
		},
		cssSourceMap: false
	}
}