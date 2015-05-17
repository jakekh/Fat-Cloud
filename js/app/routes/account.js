define([], function() {
	Path.map("#!/account").to(function(){
	}).enter(function() {
		require([
			'tpl!template/account.html','tpl!template/username.html', 
			'bootstrap', 'bootstrapHover', 'utils'
		], function(tpl, userTpl) {
			pageStart(tpl, userTpl);

			if(localStorage.getItem('active')){
				var active  = localStorage.getItem('active'),
					$panel  = $('.account-content .account-panel:eq(' + active + ')'),
					$button = $('.account-menu span:eq(' + active + ')');
				
				if(!$panel.is(':visible')){
					$('.account-panel').hide(0, function(){
					  	$panel.show(0);
				  	});

				  	$('.account-menu span').removeClass('active');
				  	$button.addClass('active');
				}
			}

			$(document).delegate('.account-menu span', 'click', function(e) {
				var $target = $(e.target),
					index   = $target.index()-1,
					$panel  = $('.account-content .account-panel:eq(' + index + ')');

				$('.account-menu span').removeClass('active');
			  	$target.addClass('active');

			  	// -- set active in localstorage
			  	localStorage.setItem('active', index);

			  	$.each($('.account-content .account-panel'), function(){
			  		if($(this).is(':visible') && $(this).html() !== $panel.html()){
					  	$(this).fadeOut(200, function(){
						  	$panel.fadeIn(200);
					  	});
				  	}
			  	});

			});

			// -- get values from localstorage and populate
			var user = $.parseJSON(localStorage.getItem('user'));

			$('#name').val(user.name);
			$('#email').val(user.email);

			// -- get input values and do update

			var name = $('#name').val(),
				email = $('#email').val(),
				remail = $('#remail').val();

			xhr = $.ajax({
				url: 'api/index.php/updateName',
				type: 'POST',
				data: JSON.stringify({
					name: name,
					email: user.email
				})
			});

			xhr
			.done(function(response){
				var user = response.data[0];

				$('.js-username').empty().append($(userTpl.apply(user)));

				alertify.success(response.statusText);
				
				sessionStorage.setItem("isLoggedIn", true);

				if(typeof(Storage) !== "undefined") {
			    	localStorage.setItem('user', JSON.stringify(user));
				} else {
				    console.log('No session storage!');
				}

				if(user.admin == 1){
					window.location.hash = '#!/admin';
					sessionStorage.setItem("admin", true);
				}else{
					window.location.hash = '#!/home';
					sessionStorage.setItem("admin", false);
				}
			}).fail(function(jqXHR, status, error){
				var response = JSON.parse(jqXHR.responseText);

				$('#container-login-error').removeClass('hidden');
				$('#login-error').text(response.statusText);
			})
			.always(function(response){
			});
		});
	}).exit(function() {
		// Exit from route
		$('#main').off().empty();
	});
});
