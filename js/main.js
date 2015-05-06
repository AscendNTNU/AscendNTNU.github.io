/*Main application entrypoint*/

//Instantclick breaks browsersync..
//InstantClick.init();

$(window).scroll(function() {
if ($(this).scrollTop() > 60){  
    $('#navigation').addClass("smallnav");
  }
  else{
    $('#navigation').removeClass("smallnav");
  }
});