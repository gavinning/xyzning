var $ = window.$;
var tips = $('#global_tips');

module.exports = {
	show: function(msg, time){
		if(tips.length == 0){
			$('body').append('<div id="globalTips"></div>');
			tips = $('#global_tips');
		}

		tips.text(msg);
		tips.css('top', 0);

		setTimeout(function(){
			tips.css('top', '-50px');
		}, time || 2000)
	},

	hide: function(){
		tips.css('top', '-50px');
	}
}