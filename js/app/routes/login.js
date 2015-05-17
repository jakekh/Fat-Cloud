define([], function(){
	Path.map("#!/login").to(function(){
	}).enter(function(){
		require([ 
			'tpl!template/login.html', 'tpl!template/username.html',
			'alertify'
		], function(tpl, userTpl, alertify){
			$('#main').empty();
			$('#main').append($(tpl.apply()));

			$('header').hide();
			$('footer').hide();

			$('#forgot-password').on('click', function(){
				if($(this).is(':checked')){
					$('#password').hide();
					$('#button-login').addClass('hidden');
					$('#button-reset').removeClass('hidden');
				}else{
					$('#password').show();
					$('#button-login').removeClass('hidden');
					$('#button-reset').addClass('hidden');
				}
			});

			$('.js-close-alert').on('click', function(){
				$('#container-login-error').addClass('hidden');
				$('#container-login-reset').addClass('hidden');
			})

			$('#login').on('submit', function(e){
				var $target = $(e.target),
					user = $('#email').val(),
					pass = $('#password').val(),
					xhr;

				if($('#button-login').is(':visible')){
					xhr = $.ajax({
						url: 'api/index.php/login',
						type: 'POST',
						data: JSON.stringify({
							email: user,
							password: pass
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
				}else{
					xhr = $.ajax({
						url: 'api/index.php/forgot',
						type: 'POST',
						data: JSON.stringify({
							email: user
						})
					});

					xhr
					.done(function(response){
						$('#container-login-reset').removeClass('hidden');
						$('#login-reset').text(response.statusText);
					}).fail(function(jqXHR, status, error){
						var response = JSON.parse(jqXHR.responseText);

						$('#container-login-error').removeClass('hidden');
						$('#login-error').text(response.statusText);
					})
					.always(function(){
					});
				}

				e.preventDefault();
			});
		});
	}).exit(function(){
		// Exit from route
		$('#main').off().empty();
		$('header').show();
		$('footer').show();
	});
});

