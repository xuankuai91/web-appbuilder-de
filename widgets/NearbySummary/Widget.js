define([
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'dijit/_WidgetsInTemplateMixin',
  "dojo/dom",
  "dojo/_base/array",
  "dojo/parser",
  "dojo/on",
  "dojo/_base/lang",
  "esri/Color",
  "esri/config",
  "esri/map",
  "esri/graphic",
  "esri/geometry/normalizeUtils",
  "esri/tasks/GeometryService",
  "esri/tasks/BufferParameters",
  "jimu/dijit/DrawBox",
  "esri/layers/FeatureLayer",
  "esri/renderers/SimpleRenderer",
  "esri/tasks/query",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/geometry/Extent",
  "esri/InfoTemplate",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "dijit/form/Button",
  "dojo/domReady!"
  ],
  function(
    declare,
    BaseWidget,
    _WidgetsInTemplateMixin,
    dom,
    array,
    parser,
    on,
    lang,
    Color,
    esriConfig,
    Map,
    Graphic,
    normalizeUtils,
    GeometryService,
    BufferParameters,
    DrawBox,
    FeatureLayer,
    SimpleRenderer,
    Query,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    SimpleFillSymbol,
    Extent,
    InfoTemplate
    ) {
        var globalGeometry = null; // Define the global geometry variable for query
        var globalGraphic = null; // Define the global graphic variable for adding attributes and popup

        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget, _WidgetsInTemplateMixin], {
          // Custom Widget code goes here

          //please note that this property is be set by the framework when widget is loaded.
          //templateString: template,

          baseClass: 'jimu-widget-nearbysummary',
            
          name: 'NearbySummary',

          postCreate: function() {
            this.inherited(arguments);
            console.log('postCreate');
          },

          startup: function() {
            // this.inherited(arguments);
            // this.mapIdNode.innerHTML = 'map id:' + this.map.id;
            
            this.onDrawBufferClick();

            console.log('startup');
          },
              
          onDrawBufferClick: function() { // Start all functions with clicking on the pin icon
            this.drawBox.setMap(this.map);
            this.own(on(this.drawBox, 'DrawEnd', lang.hitch(this, this.createBuffer)));
          },

          createBuffer: function(evtObj) { // Draw click event point and buffer
            this.drawBox.deactivate();
            var geometry = evtObj.geometry;
            symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 12, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 255]), 1), new Color([0, 255, 255]), 1);
            var graphic = new Graphic(geometry, symbol);
            this.map.graphics.add(graphic);
            this.drawBox.clear(); // Return the pin button to unpushed status

            // Setup the buffer parameters
            var params = new BufferParameters();
            params.distances = [Number(document.getElementById("radius_box").value)];
            params.outSpatialReference = this.map.spatialReference;
            params.unit = GeometryService.UNIT_STATUTE_MILE;

            this.map.centerAndZoom(evtObj.geometry, 12); // Center and zoom in the map on click

            // Normalize the geometry
            normalizeUtils.normalizeCentralMeridian([geometry]).then(lang.hitch(this, function(normalizedGeometries) {
              // var normalizedGeometry = normalizedGeometries[0];
              // params.geometries = [normalizedGeometry];
              params.geometries = normalizedGeometries;
              esriConfig.defaults.geometryService.buffer(params, lang.hitch(this, this.showBuffer));
            }));
          },

          showBuffer: function(bufferedGeometries) { // Display buffer
            var borderColor = new Color([0, 255, 255, 0.75]);
            var fillColor = new Color([255, 0, 0, 0.25]);
            var symbol = new SimpleFillSymbol(
              SimpleFillSymbol.STYLE_SOLID,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                borderColor, 2
              ),
              fillColor
            );

            array.forEach(bufferedGeometries, lang.hitch(this, function(geometry) {
              globalGraphic = new Graphic(geometry, symbol);
              this.map.graphics.add(globalGraphic);

              globalGeometry = geometry; // Pass the buffer geometry to the global geometry variable for use to query in another function
            }));
          },

          onShowResultsClick: function() { // Show summary figures
            this.demographyLayer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Workforce_Solutions_Offices_Demographics/MapServer/22",
              {
                outFields: ["*"]
              });
            
            // Set layer symbol to invisible
            var nullSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE);
            this.demographyLayer.setRenderer(new SimpleRenderer(nullSymbol));

            this.map.addLayer(this.demographyLayer);

            var query = new Query();
            query.geometry = globalGeometry;
            this.demographyLayer.queryFeatures(query, this.summarizeStats);
          },

          summarizeStats: function(result) { // Summarize population numbers
            var feature;
            var features = result.features;

            var totalPop = 0;
            var totalAsian = 0;
            var totalBlack = 0;
            var totalHispanic = 0;
            var totalWhite = 0;
            var totalOther = 0;
            var totalHouseholds = 0;
            var totalHousingUnits = 0;

            for (var i = 0; i < features.length; i++) {
              feature = features[i];
              totalPop = totalPop + feature.attributes["Tot_Pop"];
              totalAsian = totalAsian + feature.attributes["Asian"];
              totalBlack = totalBlack + feature.attributes["Black"];
              totalHispanic = totalHispanic + feature.attributes["Hispanic"];
              totalWhite = totalWhite + feature.attributes["White"];
              totalOther = totalOther + feature.attributes["Other"];
              totalHouseholds = totalHouseholds + feature.attributes["Households"];
              totalHousingUnits = totalHousingUnits + feature.attributes["Housing_Un"];
            }

            // Create HTML <p> elements that resides in the <th> elements
            var totalPopText = "<p>" + totalPop.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalAsianText = "<p>" + totalAsian.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBlackText = "<p>" + totalBlack.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalHispanicText = "<p>" + totalHispanic.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalWhiteText = "<p>" + totalWhite.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalOtherText = "<p>" + totalOther.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalHouseholdsText = "<p>" + totalHouseholds.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalHousingUnitsText = "<p>" + totalHousingUnits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";

            // Push <p> elements to the <th> elements
            dom.byId("total_pop").innerHTML = totalPopText;
            dom.byId("total_asian").innerHTML = totalAsianText;
            dom.byId("total_black").innerHTML = totalBlackText;
            dom.byId("total_hispanic").innerHTML = totalHispanicText;
            dom.byId("total_white").innerHTML = totalWhiteText;
            dom.byId("total_other").innerHTML = totalOtherText;
            dom.byId("total_households").innerHTML = totalHouseholdsText;
            dom.byId("total_housing_units").innerHTML = totalHousingUnitsText;

            // Set attributes for buffer
            var bufferAttributes = {
              population: totalPopText,
              asian: totalAsianText,
              black: totalBlackText,
              hispanic: totalHispanicText,
              white: totalWhiteText,
              others: totalOtherText,
              households: totalHouseholdsText,
              housingUnits: totalHousingUnitsText
            };

            globalGraphic.setAttributes(bufferAttributes);

            var infoTemplate = new InfoTemplate();
            infoTemplate.setTitle("Service area demographics");
            infoTemplate.setContent(
              "<b>Population: </b>${population}<br/>" +
              "<b>Asian: </b>${asian}<br/>" +
              "<b>Black: </b>${black}<br/>" +
              "<b>Hispanic: </b>${hispanic}<br/>" +
              "<b>White: </b>${white}<br/>" +
              "<b>Others: </b>${others}<br/>" +
              "<b>Households: </b>${households}<br/>" +
              "<b>Housing units: </b>${housingUnits}"
              );

            globalGraphic.setInfoTemplate(infoTemplate);
          },
              
          onClearResultsClick: function() { // Clear buffers
            this.map.graphics.clear();
          },

          onOpen: function(){
            this.getPanel().resize({h:491}); // Set widget panel height
            console.log('onOpen');
          },

          onClose: function(){
            console.log('onClose');
          },

          onMinimize: function(){
            console.log('onMinimize');
          },

          onMaximize: function(){
            console.log('onMaximize');
          },

          onSignIn: function(credential){
            /* jshint unused:false*/
            console.log('onSignIn');
          },

          onSignOut: function(){
            console.log('onSignOut');
          }
        });
});
