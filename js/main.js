/*Main application entrypoint*/
(function() {
	
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
	
	smoothScroll.init();
})();