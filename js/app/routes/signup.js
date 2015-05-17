define([], function() {
	Path.map("#!/signup").to(function(){
	}).enter(function() {
		require([ 
			'tpl!template/signup.html',
			'alertify'
		], function(tpl, alertify) {
			$('#main').empty();
			$('#main').append($(tpl.apply()));

			$('header').hide();
			$('footer').hide();

			$('.js-close').on('click', function(){
				$('#container-signup-error').addClass('hidden');
				$('#container-signup-success').addClass('hidden');
			})

			$(document).delegate('.js-input-phone', 'keyup', function(e) {
				var $target = $(e.target),
					number  = $target.val().replace('(', '').replace(')', '').replace(' ', '').replace('-', ''),
					newNumber;

				if(e.keyCode != 8 && e.keyCode != 46){
					if(number.length == 3){
						newNumber = number.replace(/(\d{3})/, "($1)");
						$('.js-input-phone').val(newNumber);
					}else if(number.length == 6){
						newNumber = number.replace(/(\d{3})(\d{3})/, "($1) $2");
						$('.js-input-phone').val(newNumber);
					}else if(number.length == 10){
						newNumber = number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
						$('.js-input-phone').val(newNumber);
					}
				}
		    });

			$('#signup').on('submit', function(e) {
				var email    = $('#email').val(),
					password = $('#password').val(),
					name     = $('#name').val(),
					phone,
					xhr;

				if ($('#phone').is(':visible')) {
					phone = $('#phone').val().replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
				}else{
					phone = $('#phone-alt').val().replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
				}

				xhr = $.ajax({
					url:  'api/index.php/signup',
					type: 'POST',
					data: JSON.stringify({
						email:    email,
						password: password,
						name:     name,
						phone:    phone,
					})
				});

				xhr
				.done(function(response) {
					alertify.success(response.statusText);
					window.location.hash = '#!/home';
				}).fail(function(jqXHR, status, error) {
					var response = JSON.parse(jqXHR.responseText);

					$('#container-signup-error').removeClass('hidden');
					$('#signup-error').text(response.statusText);
				})
				.always(function(response) {
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
