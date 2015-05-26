/*Main application entrypoint*/
function main() {

	'use stict';

	//Add class to reduce nav size
	$(window).scroll(function() {
	if ($(this).scrollTop() > 0){  
	    $('#navigation').addClass("smallnav");
	  }
	  else{
	    $('#navigation').removeClass("smallnav");
	  }
	});
	
	//Instantclick breaks browsersync..
	//InstantClick.init();
	smoothScroll.init();

	window.sr = new scrollReveal();
}

main();
