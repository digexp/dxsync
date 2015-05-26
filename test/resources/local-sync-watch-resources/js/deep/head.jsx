(function(){
	if(i$.isIE){
		document.createElement('article');
		document.createElement('aside');
		document.createElement('footer');
		document.createElement('header');
		document.createElement('hgroup');
		document.createElement('nav');
		document.createElement('section');
	}
	if(i$.isIE == 7){ document.getElementsByTagName("html")[0].className+=" wptheme_ie7"; }
	if(i$.isIE == 8){ document.getElementsByTagName("html")[0].className+=" wptheme_ie8"; }
	if(i$.isIE == 9){ document.getElementsByTagName("html")[0].className+=" wptheme_ie9"; }
	if(i$.isIE == 10){ document.getElementsByTagName("html")[0].className+=" wptheme_ie10"; }
	if(i$.isIE == 11){ document.getElementsByTagName("html")[0].className+=" wptheme_ie11"; }
})();

