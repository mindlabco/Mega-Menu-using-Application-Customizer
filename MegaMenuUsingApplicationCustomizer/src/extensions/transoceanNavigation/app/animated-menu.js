( function( $ ) {
$( document ).ready(function() {
	$('.nav').prepend('<div id="menu-button">Menu</div>');
	$('.nav #menu-button').on('click', function(){
		var menu = $(this).next('ul');
		if (menu.hasClass('open')) {
			menu.removeClass('open');
		}
		else {
			menu.addClass('open');
		}
	});


	//For Sub Menu
	//$('#top-navigation1').prepend('<div id="menu-button1">Menu</div>');
	$('#menu-button1').on('click', function(){
		var menu = $(this).next('ul');
		if (menu.hasClass('open')) {
			menu.removeClass('open');
		}
		else {
			menu.addClass('open');
		}
	});
});
} )( jQuery );