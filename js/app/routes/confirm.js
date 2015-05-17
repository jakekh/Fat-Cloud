define([], function() {
	Path.map("#!/confirm/:email/:hash").to(function(){
	}).enter(function() {
		require([
			'tpl!template/confirm.html',
			'alertify'
		], function(tpl, alertify) {
			$('#main').empty();
			$('#main').append($(tpl.apply()));

			$('header').hide();
			$('footer').hide();

			$('.js-close-alert').on('click', function(){
				$('#container-confirm-error').addClass('hidden');
				$('#container-confirm-reset').addClass('hidden');
			})
			
			var email = this.location.hash.split("/")[2];
			var hash = this.location.hash.split("/")[3];

			$(document).delegate('.js-confirm', 'click', function(e){
				var $target = $(e.target),
					xhr;

				xhr = $.ajax({
					url: 'api/index.php/confirm',
					type: 'POST',
					data: JSON.stringify({
						email: email,
						hash: hash,
					})
				});

				xhr
				.done(function(response){
					alertify.success(response.statusText);
					window.location.hash = '#!/login';
				}).fail(function(jqXHR, status, error){
					var response = JSON.parse(jqXHR.responseText);

					$('#container-confirm-error').removeClass('hidden');
					$('#confirm-error').text(response.statusText);
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