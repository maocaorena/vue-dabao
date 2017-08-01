const Util = {
	myAlert: function(text, time) {
		if(!document.getElementById('alertBg')) {
			let _time = time || 1000;
			let parent = document.createElement('div');
			parent.setAttribute('id', 'alertBg');
			let child = document.createElement('p');
			child.setAttribute('class', 'text');
			let _text = document.createTextNode(text);
			child.appendChild(_text);
			parent.appendChild(child);
			document.body.appendChild(parent);
			setTimeout(() => {
				document.body.removeChild(parent);
			}, _time)
		};
	},
	trim: function(str) { //删除左右两端的空格
		return str.replace(/(^\s*)|(\s*$)/g, "");
	},
	getSearch: function() {
		var args = {};
		var query = location.search.substring(1); //获取查询串  
		var len = query.replace(/(^\s*)|(\s*$)/g, "").length;
		if(len < 1) {
			return args;
		};
		var pairs = query.split("&"); //在逗号处断开 
		for(var i = 0; i < pairs.length; i++) {
			var pos = pairs[i].indexOf('='); //查找name=value  
			if(pos > 0) {
				var argname = pairs[i].substring(0, pos); //提取name  
				var value = pairs[i].substring(pos + 1); //提取value  
				args[argname] = decodeURI(value); //存为属性  
			} else {
				args[pairs[i]] = '';
			}
		};
		return args;
	},
	setItem : function(name, content){
		if (!name) return;
		if (typeof content !== 'string') {
			 content = JSON.stringify(content);
		};
		window.localStorage.setItem(name, content);
	},
	getItem : function(name){
		if (!name) return;
		return JSON.parse(window.localStorage.getItem(name));
	},
	removeItem : function(name){
		if (!name) return;
		window.localStorage.removeItem(name);
	},
}

export {
	Util
}