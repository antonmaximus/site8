/******************************************************************************
*** CAROUSEL 
*** Author:    Anton Agana
***
*** User can call `CAROUSEL.carousel` to create carousel-like framework.
*** Input parameter is a single object with values for the following properties:
***
*** divId:     Required. String. ID of the div on the HTML page where carousel 
***              will be created.
*** jsonPath:  Required if flickrTag property is undefined. String. Path to the JSON file.
*** flickrTag: Optional. String. This is the initial tag on querying photos from
***              the Flickr API.
*** tranTime:  Optional. Integer. This is the transition time between 
***              carousel slides. The default is 1800 ms. 
*** width:     Optional. Integer. User can configure carousel width. Default is 400px.
*** height:    Optional. Integer. User can configure carousel height. Default is 300px.
*** bg:        Optional. String. User can configure carousel's background-color. 
***              Default is white.
***
*** Example Usage:
*** var carousel = new CAROUSEL.Carousel({ divId: 'carouselA', jsonPath: './file.json'});
******************************************************************************/

var CAROUSEL = (function(globals, prev) {
  'use strict';
  // Dependencies and Imports
  var HELPERFUNCTIONS = globals.HELPERFUNCTIONS || {};
  var HELPERFUNCTIONSFLICKR = globals.HELPERFUNCTIONSFLICKR || {};
  var CAROUSELVIEW = globals.CAROUSELVIEW || {};

  // Exports
  var CAROUSEL = prev || {};
  CAROUSEL.Carousel = Carousel;
   

  //Class 
  function Carousel (input) {
    // Initialize variables
    this.carousel = document.getElementById(input.divId);
    this.id = input.divId;
    this.images = [];
    this.options = {
      w: input.width || 400, //width
      h: input.height || 300, //height
      bg : input.backgroundColor,
      time: Math.abs(input.tranTime) || 1800,
      download: (input.download === 'false') ? false : true
    };
    this.options.viewMode = this.options.w >= this.options.h ? 'landscape' : 'portrait';


    var self = this;

    if(input.flickrTag) { // If truthy 
      HELPERFUNCTIONSFLICKR.handleFlickrRequest(input.flickrTag, function(arr) {
        CAROUSELVIEW.renderImagesAndNavigation(arr, self);  
      });
    } else {
      HELPERFUNCTIONS.loadJsonViaAjax(input.jsonPath, function(data) { 
        CAROUSELVIEW.renderImagesAndNavigation(data.items, self);
      });
    }
  }

  return CAROUSEL;
})(this, CAROUSEL);

