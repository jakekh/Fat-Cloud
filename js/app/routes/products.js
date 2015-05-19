define([], function() {
	Path.map("#!/products").to(function(){
	}).enter(function() {
		require([
			'tpl!template/products.html', 'tpl!template/username.html', 'tpl!template/product-tpl.html',
			'bootstrap', 'bootstrapHover', 'utils'
		], function(tpl, userTpl, productTpl) {
			pageStart(tpl, userTpl);

			function render(){
				var products = JSON.parse(localStorage.getItem('products'));

				$('.js-products').empty();

				if(products != null){
					$.each(products, function(index, value){
						$('.js-products').append($(productTpl.apply(value)));
					});
				} else{
					$('.js-products').append("<h3>No search results</h3>");
				}
			}

			setTimeout(render, 100);
			
			var done    = false;

			$(document).delegate('.js-form-search', 'submit', function(e){
				
				setTimeout(render, 100);

			})
			.delegate('.js-brands span', 'click', function(e){
				
				var $target = $(e.target),
					search  = $target.attr('data-search'),
					xhr;

					xhr = $.ajax({
								url: 'api/index.php/products',
								type: 'POST',
								data: JSON.stringify({
									search: search
								})
							});

							xhr
							.done(function(response){
								var products = response.data;

								localStorage.setItem('products', JSON.stringify(products));

								setTimeout(render, 100);

							}).fail(function(jqXHR, status, error){
								var response = JSON.parse(jqXHR.responseText);
								localStorage.setItem('products', null);
							})
							.always(function(response){
							});

			})
			.delegate('.js-flavors a', 'click', function(e){
				
				var $target = $(e.currentTarget),
					filter  = $target[0].text.toLowerCase(),
					$ele    = $('[data-flavor='+filter+']');

				if(filter == 'clear'){
					$('.js-product').parent().fadeIn().removeClass('hidden');
				}else{
					$('.js-product').parent().fadeOut(function(){
						$(this).addClass('hidden');
						$ele.parent().fadeIn().removeClass('hidden');
					});
					if(!done){
						$ele.parent( ":hidden" ).fadeIn().removeClass('hidden');
						done = true;
					}
				}

			});

		});
	}).exit(function() {
		// Exit from route
		$('#main').off().empty();
	});
});