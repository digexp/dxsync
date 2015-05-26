(function(){
	if(!i$.isIE){
		i$.addOnLoad(function() {
			 // create a test node off the browser screen to calculate high contrast mode
			var testNode = document.createElement("div");
			testNode.style.cssText = 'border:1px solid;border-color:red green;position:absolute;height:5px;top:-999px;background-image:url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");';
			document.body.appendChild(testNode);
			// look at the computed style for the test node
			var styles = null;
			try {
				styles = document.defaultView.getComputedStyle(testNode, "");
			} catch(e) {
				styles = testNode.currentStyle;
			}
			if(styles) {
				var testImg = styles.backgroundImage;
				if ((styles.borderTopColor == styles.borderRightColor) || (testImg != null && (testImg == "none" || testImg == "url(invalid-url:)" ))) {
					document.getElementsByTagName("body")[0].className+=" wpthemeImagesOff";
				}
				document.body.removeChild(testNode);
			}
		});
	}
})();
