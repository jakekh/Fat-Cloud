define([], function(){
	Path.map("#!/admin").to(function(){
		if(!JSON.parse(sessionStorage.getItem("isLoggedIn"))){
			window.location.hash = '#!/login';
		}
	}).enter(function(){
		require([
			'tpl!template/admin.html','tpl!template/username.html', 
			'utils'
		], function(tpl, userTpl){
			pageStart(tpl, userTpl);
		});
	}).exit(function(){
		// Exit from route
		$('#main').off().empty();
	});
});