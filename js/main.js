requirejs.config({
	baseUrl: 'js/lib',
	waitSeconds: 30,

	paths:{
		app: '../app',
		model: '../app/models',
		route: '../app/routes',
		template: '../app/templates',
		widget: '../app/widgets',
		worker: '../app/workers',
		root: '../..',

		jquery: 'http://code.jquery.com/jquery-2.1.0.min',
        bootstrap: '//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min',
        bootstrapHover: 'bootstrap-hover-dropdown.min',
        alertify: 'alertify',
        utils: '../utils',

		// requirejs plugins
		text: 'requirejs-plugins/text',
		tpl: 'requirejs-plugins/template',
		image: 'requirejs-plugins/image'
	},
	shim:{
		'bootstrap':{ 
            deps:['jquery']
        },
        'bootstrapHover':{
            deps:['jquery']
        },
        'alertify':{
            deps:['jquery']
        },
        'utils':{
            deps:['jquery']
        }
	}
});

require([
	'alertify','tpl!template/username.html',
	'route/home',  'route/admin',   'route/signup', 
	'route/login', 'route/confirm', 'route/reset',
	'route/account', 'route/cart', 'route/product'
], function(alertify, tpl){
	Path.rescue(function(){
		window.location = '404.html'; // -- TODO change when done to /404.html
	});

	Path.root("#!/home");

	Path.listen();

	if(typeof(Storage) !== "undefined"){
		$('.js-username').append($(tpl.apply(JSON.parse(localStorage.getItem("user")))));
	} else {
		$('.js-username').append($(tpl.apply()));
	}

	var $doc = $(document);
	var menuVisible = false;

	function toggleMenu(){
		$('.js-menu').slideToggle();
        $('.js-bar-top').toggleClass('bars-top');
        $('.js-bar-middle').toggleClass('bars-middle');
        $('.js-bar-bottom').toggleClass('bars-bottom');
		$('.js-click-the-menu').fadeToggle();

		if(menuVisible){
			menuVisible = false;
		}else{
			menuVisible = true;
		}
	}

	$doc
	.delegate('.js-btn-menu', 'click', function(e){
		toggleMenu();
	})
	.delegate('#main', 'click', function(e){
		if($('.js-menu').is(':visible') && menuVisible){
			toggleMenu();
		}
	})
	.delegate('.js-menu-btn', 'click', function(e){
		var $target = $(e.target),
		$this       = $target.parent();

		if($this.hasClass('cont-logo')){
			if($('.js-menu').is(':visible') && menuVisible){
				toggleMenu();
			}
		}else{
			if($('.js-menu').is(':visible') && menuVisible){
				toggleMenu();
			}
		}
	})
	.scroll(function(e){
		if($('.js-menu').is(':visible') && menuVisible){
			toggleMenu();
		}
	})
	.delegate('.js-btn-logout', 'click', function(e){
		var xhr;

		sessionStorage.clear();

		for (key in sessionStorage){
	   		sessionStorage.removeItem(key);
		}

		localStorage.clear();

		for(key in localStorage) {
	        delete localStorage[key];
	    }

		xhr = $.ajax({
			url: 'api/index.php/logout',
			type: 'GET',
		});

		xhr
		.done(function(response){
			alertify.success(response.statusText);
			window.location.hash = '#!/home';

			$('.js-username').empty().text('Sign In');
			$('.js-auth-welcome').removeClass("hidden");
			$('.js-auth-loggedin').addClass("hidden");
		}).fail(function(jqXHR, status, error){
			var response = JSON.parse(jqXHR.responseText);
			alertify.error(response.statusText);
		})
		.always(function(){
		});

		e.preventDefault();
	});

	$.ajaxSetup({
		dataType: 'json'
	});
});