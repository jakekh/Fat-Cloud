define([], function() {
	Path.map("#!/home").to(function(){
	}).enter(function() {
		require([
			'tpl!template/home.html', 'tpl!template/username.html', 'tpl!template/product-tpl.html',
			'bootstrap', 'bootstrapHover', 'utils'
		], function(tpl, userTpl, productTpl) {
			pageStart(tpl, userTpl);

			var xhr;

			xhr = $.ajax({
						url: 'api/index.php/newproducts',
						type: 'POST'
					});

					xhr
					.done(function(response){
						var products = response.data;

						$.each(products, function(index, value){
							$('.js-featured').append($(productTpl.apply(value)));
						})

					}).fail(function(jqXHR, status, error){
						var response = JSON.parse(jqXHR.responseText);
					})
					.always(function(response){
					});
		});
	}).exit(function() {
		// Exit from route
		$('#main').off().empty();
	});
});