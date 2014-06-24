'use strict';

function scroll(id){
	console.log(id)


	var $ = window.$;
	var $id = $(id);
	var id = $id.get(0);
	var scrollDom;
	var st;

	// 插入模拟滚动条dom
	$id.append($('<div class="iscroll"></div>'));
	scrollDom = $id.find('.iscroll');

	// 获取最新的容器高度
	id.height = $id.height();
	// 获取滚动条与父级比例
	id.ratio = (id.height + id.scrollHeight) / id.scrollHeight;


	function get(){
		var _scroll;

		// 获取最新的容器高度
		id.height = $id.height();

		// 计算模拟滚动条高度
		_scroll = {
			ratio: id.ratio,
			height: id.height * id.height / id.scrollHeight
		}

		return _scroll;
	}

	function set(){
		var _scroll = get();

		// 设置模拟滚动条高度
		scrollDom.height(_scroll.height + 'px');
	}

	function hide(time){
		time = time || 3000;
		clearTimeout(st);

		st = setTimeout(function(){
			scrollDom.css('opacity', 0);
		}, time)
	}

	id.onscroll = function(){
		$id.find('.iscroll').css({top: id.scrollTop * id.ratio, opacity: 1});
		hide();
	}

	set();

}

module.exports = scroll;