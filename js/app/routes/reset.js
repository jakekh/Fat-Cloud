define([], function() {
	Path.map("#!/reset/:hash").to(function(){
	}).enter(function() {
		require([
			'tpl!template/reset.html',
			'alertify'
		], function(tpl, alertify) {
			$('#main').empty();
			$('#main').append($(tpl.apply()));

			$('header').hide();
			$('footer').hide();

			$('.js-close-alert').on('click', function(){
				$('#container-reset-error').addClass('hidden');
				$('#container-reset-reset').addClass('hidden');
			})
			
			var hash = this.location.hash.split("/")[2];

			$('#reset').on('submit', function(e){
				var $target = $(e.target),
					pass = $('#password').val(),
					conPass = $('#conPassword').val(),
					xhr;
				
				xhr = $.ajax({
					url: 'api/index.php/reset',
					type: 'POST',
					data: JSON.stringify({
						password: pass,
						conPassword: conPass,
						hash: hash
					})
				});

				xhr
				.done(function(response){
					alertify.success(response.statusText);
					window.location.hash = '#!/login';
				})
				.fail(function(jqXHR, status, error){
					var response = JSON.parse(jqXHR.responseText);

					$('#container-reset-error').removeClass('hidden');
					$('#reset-error').text(response.statusText);
				})
				.always(function(response){
					// always stuff
				});

				e.preventDefault();
			});
		});
	}).exit(function() {
		// Exit from route
		$('#main').off().empty();
		$('header').show();
		$('footer').show();
	});
});