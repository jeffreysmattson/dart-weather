/**
 * @file 
 * Gets the weather JSON from Yahoo and updates the block
 *
 * Once it gets the object if parses out the needed data
 * Inserts it into the proper elements.
 */

(function($){
  "use strict";
    
  $(document).ready(function(){
    weather_js.init();
  });

  var weather_js = {

    title : '',
    temp  : '',
    text  : '',
    scale : '&#8457;',
    more  : '',
    results : true,

    /*
     * Initialize the object
     */
    init: function(){
      this.addListeners();
    },

    /*
     * Ajax request to get JSON weather object.
     *
     * Set zip code to Hanover, NH if none provided.
     *
     * @return string on error
     */
    getWeatherData : function(zip = '03755'){

      /* No funny business */
      zip = zip.replace(/\D/g,'');
      
      var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20item%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text=%27'+zip+'%27)&format=json';
      $.ajax({
        dataType: "json",
        url: url,
        success: function(data) {
          weather_js.results = data.query.results;
          if(weather_js.results != null){
            weather_js.title = weather_js.results.channel.item.title;
            weather_js.temp  = weather_js.results.channel.item.condition.temp;
            weather_js.text  = weather_js.results.channel.item.condition.text;
            weather_js.more  = weather_js.results.channel.item.link.split('/*')[1];
            return;
          } else {
            weather_js.clearWeatherHtml();
            $('#js_weatherResultsTitle').html('Sorry, no results for that ZIP code.');
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          weather_js.clearWeatherHtml();
          $('#js_weatherResultsTitle').html('Sorry, no results for that ZIP code.');
        },
        complete: function(jqXHR, textStatus){
          if(textStatus == 'success' && weather_js.results != null){
            weather_js.insertWeatherHtml();
          }
        },
      });
    },

    /*
     * Add click listener to the get weather button
     *
     * @return void
     */
    addListeners : function(){
      $('#getWeatherButton').on('click', function(e){
        var zipCode = $('#zipCode').val();
        weather_js.getWeatherData(zipCode);
      });

      /* Submit on return key as well */
      $('input#zipCode').keypress(function (e) {
        if (e.which == 13) {
          var zipCode = $('#zipCode').val();
          weather_js.getWeatherData(zipCode);
        }
       });
    },

    /*
     * Insert the weather data into spans
     *
     * @return void
     */
    insertWeatherHtml : function(){
      $('#js_weatherResultsTitle').html(weather_js.title);
      $('#js_weatherResultsTemp').html(weather_js.temp + ' ' + weather_js.scale);
      $('#js_weatherResultsText').html(weather_js.text);
      $('#js_weatherResultsLink').html('<a href="'+weather_js.more+'" target="_blank">more</a>');
    },

    /*
     * Clear all weather data
     *
     * @return void
     */
    clearWeatherHtml : function(){
      $('#js_weatherResultsTitle').html('');
      $('#js_weatherResultsTemp').html('');
      $('#js_weatherResultsText').html('');
      $('#js_weatherResultsLink').html('');
    }
  }
})(jQuery);

