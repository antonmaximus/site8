/******************************************************************************
*** CAROUSELVIEW 
*** Author:    Anton Agana
***
*** Takes care of rendering markup components.
******************************************************************************/

var CAROUSELVIEW = (function(globals, prev) {
  'use strict';
  // Dependencies and Imports
  var CAROUSELCONTROLLER = globals.CAROUSELCONTROLLER || {};
  // Exports
  var CAROUSELVIEW = prev || {};
  CAROUSELVIEW.renderImagesAndNavigation = renderImagesAndNavigation;
   

  // Loads images and listeners to carousel
  function renderImagesAndNavigation(dataArray, obj) {
    // Make copy
    obj.images = dataArray.slice();

    addImages(obj);
    addNavigation(obj);
  }


  function addNavigation (obj) {
    var navigation = document.createElement('div'),
      rightChev = document.createElement('div'),
      leftChev = document.createElement('div'),
      download = document.createElement('a'),
      pause = document.createElement('a');

    // Enable CSS classes
    navigation.className = 'navigation';
    rightChev.className = 'chevron rightChev';
    leftChev.className = 'chevron leftChev';
    download.className = 'download';
    pause.className = 'pause';

    rightChev.dataset.step = -(obj.options.w);
    leftChev.dataset.step = obj.options.w;
    obj.carousel.dataset.autoStep = -(obj.options.w);
    obj.carousel.dataset.time = obj.options.time;
    download.download = true;

    navigation.appendChild(leftChev);
    navigation.appendChild(rightChev);
    if (obj.options.download)
      navigation.appendChild(download);
    navigation.appendChild(pause);

    // 'afterbegin' -- Just inside the element, before its first child.
    obj.carousel.insertAdjacentHTML('afterbegin', navigation.outerHTML);   

    // Add listener
    obj.carousel.addEventListener("click", carouselClickHandler, false);

    CAROUSELCONTROLLER.autoMove(obj.carousel);
  }

  function addImages(obj) {
    var viewport = document.createElement('div'),
        filmstrip = document.createElement('ul');

    // Enable CSS classes
    obj.carousel.className = 'carousel';
    viewport.className = 'viewport';
    filmstrip.className = 'filmstrip';

    if(obj.options.bg) {
      viewport.style.backgroundColor = obj.options.bg;
    }

    // Carousel and Filmstrip dimensions vary by user input
    obj.carousel.style.width = obj.options.w + 'px';
    obj.carousel.style.height = obj.options.h + 'px';
    filmstrip.style.width = (obj.options.w * obj.images.length) + 'px';

    // Store data attributes for navigation
    filmstrip.dataset.totalWidth = obj.options.w * obj.images.length; 
    obj.carousel.dataset.viewingWidth = obj.options.w;

    obj.images.forEach( function(elem) {
      var li = document.createElement("li"),
        img = document.createElement("img");

      // Store li style
      li.style.width = obj.options.w + 'px';

      // Store img attributes and style
      img.src = elem.path;
      img.alt = elem.title;
      img.title = elem.title;
      img.onload = function() {
        if(obj.options.viewMode == 'landscape') {
          if (this.height >  obj.options.h)  //If img height is taller than viewport height
            this.style.height = '100%'; 
          else 
            this.parentNode.style.lineHeight = obj.options.h + 'px';  

          if(this.width > obj.options.w) { //Well, in case the width is still bigger...
            this.parentNode.style.lineHeight = obj.options.h + 'px';   
            this.style.height = '';
            this.style.width = '100%'; 
          }
        } 
        else { //portrait
          if(this.height >  obj.options.h)  //If img height is taller than viewport height
            this.style.height = '100%'; 
          else {
            this.parentNode.style.lineHeight = obj.options.h + 'px';   
            if (this.width > obj.options.w) // If img is wider than viewport
              this.style.width = '100%'; 
          }
        }
      };

      li.appendChild(img);
      filmstrip.appendChild(li);
    });

    viewport.appendChild(filmstrip);
    obj.carousel.appendChild(viewport);   
  }

  // Identifies mouse  click on navigation and download links
  function carouselClickHandler(e) {
    var target =  e.target || e.srcElement; //Firefox doesn't like srcElement
    var className = target.className;

    if(className.indexOf('chevron') > -1) {
      CAROUSELCONTROLLER.moveCarouselByStep(this, Number(target.dataset.step));
      CAROUSELCONTROLLER.stopCarousel(this);
      CAROUSELCONTROLLER.autoMove(this);
    } else if (className.indexOf('download') > -1) {
      CAROUSELCONTROLLER.downloadVisiblePhotoHandler(this, target);
    } else if (className.indexOf('pause') > -1) {
      CAROUSELCONTROLLER.pauseButtonHandler(this, target);
    }
  }

  return CAROUSELVIEW;
})(this, CAROUSELVIEW);


