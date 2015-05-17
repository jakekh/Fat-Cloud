define([], function() {
	Path.map("#!/product").to(function(){
	}).enter(function() {
		require([
			'tpl!template/product.html', 'tpl!template/username.html',
			'bootstrap', 'bootstrapHover', 'utils'
		], function(tpl, userTpl) {
			pageStart(tpl, userTpl);

			var sku = localStorage.getItem('sku'),
				xhr;

			xhr = $.ajax({
						url: 'api/index.php/product',
						type: 'POST',
						data: JSON.stringify({
							sku: sku
						})
					});

					xhr
					.done(function(response){
						var product = response.data[0];

						$('#main').empty();
						$('#main').append($(tpl.apply(product)));
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