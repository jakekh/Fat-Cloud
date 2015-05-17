function pageStart(tpl, userTpl){
	$('#main').empty();
	$('#main').append($(tpl.apply()));

	if(typeof(Storage) !== "undefined"){
		$('.js-username').empty().append($(userTpl.apply(JSON.parse(localStorage.getItem("user")))));
	} else {
		$('.js-username').empty().append($(userTpl.apply()));
	}

	if(sessionStorage.getItem("isLoggedIn")){
		$('.js-auth-welcome').addClass("hidden");
		$('.js-auth-loggedin').removeClass("hidden");
	}else{
		$('.js-auth-welcome').removeClass("hidden");
		$('.js-auth-loggedin').addClass("hidden");
	}
}

$(document).delegate('.js-product', 'click', function(e){
	var $target = $(e.currentTarget),
		sku     = $target.attr('data-sku');

	localStorage.setItem('sku', sku);
});