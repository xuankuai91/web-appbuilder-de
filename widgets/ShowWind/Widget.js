define([ // Import modules
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'esri/geometry/Point',
  'esri/symbols/PictureMarkerSymbol',
  'esri/SpatialReference',
  'esri/graphic',
  'esri/layers/GraphicsLayer',
  "esri/symbols/Font",
  "esri/symbols/TextSymbol",
  "esri/Color"
  ],

  function( // Call modules
    declare,
    BaseWidget,
    Point,
    PictureMarkerSymbol,
    SpatialReference,
    Graphic,
    GraphicsLayer,
    Font,
    TextSymbol,
    Color
  ) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-showwind',

      //this property is set by the framework when widget is loaded.
      name: 'ShowWind',

      //methods to communication with app container:

      // postCreate: function() {
      //   this.inherited(arguments);
      //   console.log('postCreate');
      // },

      // Define the actions taken after starting up the widget
      startup: function() {
        // this.inherited(arguments);
        // this.mapIdNode.innerHTML = 'map id:' + this.map.id;

        // Create a blank graphic symbol layer and insert it to the web map
        this.graphicSymbolLayer = new GraphicsLayer();
        this.map.addLayer(this.graphicSymbolLayer);

        // Create a blank label layer and insert it to the web map
        this.labelLayer = new GraphicsLayer();
        this.map.addLayer(this.labelLayer);

        console.log('startup');
      },

      createGraphicSymbol: function(spinDegree) { // Create a graphic symbol at a given location
        // Create a location point where the graphic symbol will be placed
        var lat = 30.756713;
        var lon = -91.331775;
        var symbolLocation = new Point(lon, lat, new SpatialReference({ wkid: 4326 }));

        // Style the symbol using an image file
        var symbolURL = this.folderUrl + "images/arrow.png";
        var symbolStyle = new PictureMarkerSymbol({
          "url": symbolURL,
          "width": 100,
          "height": 100,
          "angle": spinDegree
        });

        // Add the graphic symbol to the graphic symbol layer
        var graphicSymbol = new Graphic(symbolLocation, symbolStyle);
        this.graphicSymbolLayer.add(graphicSymbol);
      },

      onWindDirClick: function() { // Respond to the DOJO click event on the HTML button
        var wDir = 360 - Number(document.getElementById("winddirbox").value); // Get input wind direction

        if (wDir > 0 && wDir <= 360) { // Validate the input value and warn invalid values
          this.graphicSymbolLayer.clear(); // Clear any existing graphic symbol layers
          this.createGraphicSymbol(wDir);
          // Must use the keyword "this" to call a custom function
        } else {
          alert("Please enter a number from 0 to 359!");
        }
      },

      createLabel: function(speed) { // Create a label at a given location
        // Create a location point where the label will be placed
        var lat = 30.756713;
        var lon = -91.331775;
        var labelLocation = new Point(lon, lat, new SpatialReference({ wkid: 4326 }));

        // Set the label text and font
        var font = new Font("20px", Font.STYLE_NORMAL, Font.VARIANT_NORMAL, Font.WEIGHT_BOLDER);
        var textLabel = new TextSymbol("Wind Speed: " + speed.toString() + " mph", font);
        textLabel.setOffset(0, 75);
        textLabel.setHaloColor(new Color([255, 255, 255]));
        textLabel.setHaloSize(1);

        // Add the label to the label layer
        var label = new Graphic(labelLocation, textLabel);
        this.labelLayer.add(label);
      },

      onWindSpdClick: function() { // Respond to the DOJO click event on the HTML button
        var wSpeed = Number(document.getElementById("windspeedbox").value); // Get input wind speed

        if (wSpeed >= 0) {
          this.labelLayer.clear();
          this.createLabel(wSpeed);
        } else {
          alert("Please enter a number greater than or equal to 0!");
        }
      },

      // onOpen: function(){
      //   console.log('onOpen');
      // },

      // onClose: function(){
      //   console.log('onClose');
      // },

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }

      //methods to communication between widgets:

    });
  }
);
