define([], function() {
	Path.map("#!/home").to(function(){
	}).enter(function() {
		require([
			'tpl!template/home.html', 'tpl!template/username.html',
			'bootstrap', 'bootstrapHover', 'utils'
		], function(tpl, userTpl) {
			pageStart(tpl, userTpl);
		});
	}).exit(function() {
		// Exit from route
		$('#main').off().empty();
	});
});