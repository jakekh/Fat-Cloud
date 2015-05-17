define([], function() {
	Path.map("#!/contact").to(function(){
	}).enter(function() {
		require(['tpl!template/contact.html','tpl!template/username.html'], function(tpl, userTpl) {
			pageStart(tpl, userTpl);
		});
	}).exit(function() {
		// Exit from route
		$('#main').off().empty();
	});
});