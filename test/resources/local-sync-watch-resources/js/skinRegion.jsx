(function(){
   if(!i$.isIE){

   	i$.addOnLoad(function() {
         var sectionElements = document.getElementsByTagName("SECTION");
         for (var i = 0; i < sectionElements.length; i++) {
            if (i$.hasClass(sectionElements[i], "a11yRegionTarget")) {
               var sectionRegionNode = sectionElements[i];
               var tempSpanNode = null;
               var tempSpanNodes = sectionRegionNode.getElementsByTagName("SPAN");
               for (var j = 0; j < tempSpanNodes.length; j++) {
                 if (i$.hasClass(tempSpanNodes[j], "a11yRegionLabel")) {
                     tempSpanNode = tempSpanNodes[j];
                 }
               }
               if (tempSpanNode) {
                  var spanRegionNode = tempSpanNode;
                  var tempParentNode = sectionRegionNode;
                  var regionNodeWindowID = null;
                  // get window id
                 while ((tempParentNode = tempParentNode.parentNode) != null ) {
                   if (i$.hasClass(tempParentNode, "component-control")) {
                       var m = tempParentNode && (tempParentNode.className || "").match(/id-([\S]+)/);
                        regionNodeWindowID = m && m[1];
                        break;
                       }
                  }
                  if (regionNodeWindowID) {
                     var ariaRegionId = "wpRegionId"+regionNodeWindowID;
   
                     spanRegionNode.setAttribute("id", ariaRegionId); 
                     sectionRegionNode.setAttribute("aria-labelledby",ariaRegionId);
                  }
   
               }
            }
         }
      });
   }
})();
