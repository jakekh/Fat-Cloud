define([], function() {
	Path.map("#!/cart").to(function(){
	}).enter(function() {
		require(['tpl!template/cart.html','tpl!template/username.html'], function(tpl, userTpl) {
			pageStart(tpl, userTpl);
		});
	}).exit(function() {
		// Exit from route
		$('#main').off().empty();
	});
});
