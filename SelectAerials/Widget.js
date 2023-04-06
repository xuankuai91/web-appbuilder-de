define([
  'dijit/_WidgetsInTemplateMixin', // Allow use of dijit
  'dijit/ProgressBar',
  'dojo/_base/array',
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/dom',
  'dojo/dom-class',
  'dojo/dom-construct',
  'dojo/i18n!esri/nls/jsapi',
  'dojo/number',
  'dojo/on',
  'dojo/parser',
  'esri/Color',
  'esri/geometry/Extent',
  'esri/geometry/normalizeUtils',
  'esri/graphic',
  'esri/graphicsUtils',
  'esri/layers/FeatureLayer',
  'esri/map',
  'esri/geometry/Point',
  'esri/SpatialReference',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/tasks/query',
  'esri/tasks/RelationshipQuery',
  'jimu/BaseWidget',
  'jimu/dijit/DrawBox',
  'jimu/dijit/Message',
  'jimu/PanelManager',
  'dojo/domReady!'
  ],
  function(
    _WidgetsInTemplateMixin,
    ProgressBar,
    array,
    declare,
    lang,
    dom,
    domClass,
    domConstruct,
    esriBundle,
    number,
    on,
    parser,
    Color,
    Extent,
    normalizeUtils,
    Graphic,
    graphicsUtils,
    FeatureLayer,
    Map,
    Point,
    SpatialReference,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    Query,
    RelationshipQuery,
    BaseWidget,
    DrawBox,
    Message,
    PanelManager
    ) {
        var product = ''; // Store product name
        var mode = 'select'; // Store selection mode
        var layerDict = {}; // Store layer name (county/tile) and its corresponding layer
        var globalGeometry = null; // Store the geometry from address selection
        var globalTileID = ''; // Store the tile ID queried by selected address

        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget, _WidgetsInTemplateMixin], {
          // Custom Widget code goes here

          //please note that this property is be set by the framework when widget is loaded.
          //templateString: template,

          baseClass: 'jimu-widget-selectaerials',
            
          name: 'SelectAerials',

          postCreate: function() {
            this.inherited(arguments);
            console.log('postCreate');
          },

          startup: function() {
            // Access map
            this.inherited(arguments);
            // this.mapIdNode.innerHTML = 'map id:' + this.map.id;

            parser.parse();

            dom.byId('progress_bar').style.display = 'none';

            // Switch to the "Add Layer" tab if a layer is added to the map
            if (this.map.layerIds.length === 5 && this.map.graphicsLayerIds.length === 2) { // Detect if an layer is already added to the map
              this.switchToAddTab();
            }

            this.onProductSelect();

            console.log('startup');
          },

          initializePanel: function() {
            dom.byId("product_box").value = "default";
            dom.byId("coverage_box").value = "default";
            dom.byId("county_box").value = "default";
            dom.byId("sub_layer_box").value = "default";
            dom.byId('progress_bar').style.display = 'none';
          },

          switchToSelectTab: function() { // Switch to Select Tile tab
            domClass.remove(this.drawTabItem, 'selected');
            domClass.remove(this.drawTabView, 'selected');
            domClass.remove(this.addTabItem, 'selected');
            domClass.remove(this.addTabView, 'selected');
            domClass.add(this.selectTabItem, 'selected');
            domClass.add(this.selectTabView, 'selected');

            mode = 'select';
          },

          switchToUseTab: function() { // Switch to Select Tile tab
            domClass.remove(this.selectTabItem, 'selected');
            domClass.remove(this.selectTabView, 'selected');
            domClass.remove(this.drawTabItem, 'selected');
            domClass.remove(this.drawTabView, 'selected');
            domClass.remove(this.addTabItem, 'selected');
            domClass.remove(this.addTabView, 'selected');
            domClass.add(this.useTabItem, 'selected');
            domClass.add(this.useTabView, 'selected');

            mode = 'use';
          },

          switchToDrawTab: function() { // Switch to Draw Shape tab
            domClass.remove(this.selectTabItem, 'selected');
            domClass.remove(this.selectTabView, 'selected');
            domClass.remove(this.addTabItem, 'selected');
            domClass.remove(this.addTabView, 'selected');
            domClass.add(this.drawTabItem, 'selected');
            domClass.add(this.drawTabView, 'selected');

            mode = 'draw';

            // Initialize draw boxes
            this.drawBox.geoTypes = ['POINT', 'POLYLINE', 'EXTENT', 'POLYGON'];
            this.drawBox._initTypes();
          },

          switchToAddTab: function() { // Switch to Add Layer tab
            domClass.remove(this.selectTabItem, 'selected');
            domClass.remove(this.selectTabView, 'selected');
            domClass.remove(this.drawTabItem, 'selected');
            domClass.remove(this.drawTabView, 'selected');
            domClass.add(this.addTabItem, 'selected');
            domClass.add(this.addTabView, 'selected');

            mode = 'add';

            if (this.map.layerIds.length <= 4 && this.map.graphicsLayerIds.length <= 1) { // Close the widget and open the Add Data widget if an layer is not already added to the map
              new Message({
                message: "Please use the Add Data widget to add a layer to the map!"
              });

              var pm = PanelManager.getInstance();
              pm.closePanel(pm.activePanel);
              pm.showPanel(this.appConfig.widgetOnScreen.widgets[5]);
            } else if (this.map.layerIds.length === 5) {
              var addedLayer = this.map.getLayer(this.map.layerIds[4]);
              var layerCount = addedLayer.layerInfos.length;

              for (var i = 0; i < layerCount; i++) { // Determine if sub layers exist if an layer is already added to the map
                var subLayer = addedLayer.layerInfos[i];

                if (!subLayer.subLayerIds) {
                  var subLayerName = subLayer.name;
                  var subLayerURL = addedLayer.url + "/" + i.toString();
                  
                  domConstruct.create("option", { // Add sub layers to a dropdown if they exist
                    value: subLayerURL,
                    innerHTML: subLayerName,
                    defaultSelected: false,
                    selected: false
                  }, this.subLayerSelectionBox);
                }
              }
            }
          },

          onTabHeaderClick: function(event) { // Switch tabs based on click event
            this.clearGraphics();
            this.initializePanel();

            var target = event.target || event.srcElement;

            if (target === this.selectTabItem) {
              this.switchToSelectTab();
            } else if (target === this.drawTabItem) {
              this.switchToDrawTab();
            } else if (target === this.addTabItem) {
              this.switchToAddTab();
            }
          },

          onProductSelect: function() { // Select product
            on(dom.byId("product_box"), 'change', lang.hitch(this, function() {
              product = dom.byId("product_box").value;
              
              if (mode === 'select') {
                dom.byId("coverage_box").disabled = false; // Enable the coverage area selection
                
                this.onCoverageSelect();
                this.onEnterKeyUp();
                this.onXClick();
              } else if (mode === 'use') {
                this.onAddressSelect();
              } else if (mode === 'draw') {
                this.onDraw();
              } else if (mode === 'add') {
                this.onLayerSelect();
              }
            }));
          },

          clearGraphics: function() { // Clear graphics and other information of tiles
            this.map.graphics.clear();

            for (var key in layerDict) {
              tag = dom.byId(key);

              if (tag) {
                tag.remove();
              }
            }

            layerDict = {};
          },

          zoomToAllSelectedTiles: function() { // Center and zoom to all selected tiles
            var coverage = dom.byId("coverage_box").value;

            if (coverage === "Tile") {
              var timeout = 250;
            } else {
              var timeout = 2500;
            }

            setTimeout(lang.hitch(this, function() {
              var mapGraphics = this.map.graphics.graphics;
              this.map.setExtent(graphicsUtils.graphicsExtent(mapGraphics), true);

              dom.byId('progress_bar').style.display = 'none';

              domClass.remove(this.submitBtn, 'jimu-state-disabled'); // Enable the Submit button
            }), timeout);
          },

          drawTiles: function(query) { // Draw tile
            this.layer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Imagery/Aerial_Selection/MapServer/3", {
              mode: FeatureLayer.MODE_SELECTION,
              outFields: ["*"]
            });

            var fillColor0 = new Color([255, 0, 0, 0.25]);
            var fillSymbol0 = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, fillColor0);

            var fillColor1 = new Color([0, 255, 0, 0.25]);
            var fillSymbol1 = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, fillColor1);

            this.layer.queryFeatures(query, lang.hitch(this, function(featureSet) {
              var featureCount = featureSet.features.length;

              if (featureCount) {
                for (var i = 0; i < featureCount; i++) {
                  var feature = featureSet.features[i];
                  var geometry = feature.geometry;

                  var tileID = feature.attributes['Grid_ID'];

                  if (!layerDict[tileID]) {
                    var hasProduct = feature.attributes[product];

                    layerDict[tileID] = {
                      graphic: {},
                      hasProduct: ''
                    };

                    // Draw tile green if there is product or red if there is not
                    if (hasProduct === "Y") {
                      var graphic = new Graphic(geometry, fillSymbol1);

                      layerDict[tileID].graphic = graphic;
                      layerDict[tileID].hasProduct = hasProduct;
                    } else if (hasProduct === "N") {
                      var graphic = new Graphic(geometry, fillSymbol0);
                      
                      layerDict[tileID].graphic = graphic;
                      layerDict[tileID].hasProduct = hasProduct;
                    }

                    this.map.graphics.add(graphic);
                  }
                }
              }

              globalTileID = tileID;
            }));
          },

          onCoverageSelect: function() { // Select kind of coverage area
            on(dom.byId("coverage_box"), 'change', lang.hitch(this, function() {
              this.clearGraphics();
              dom.byId("county_box").value = "default";

              var coverageType = dom.byId("coverage_box").value;

              if (coverageType === 'Full Extent') {
                domClass.add(this.countySelection, 'hidden');
                domClass.add(this.tileSelection, 'hidden');

                domClass.add(this.submitBtn, 'jimu-state-disabled'); // Disable the Submit button
              } else if (coverageType === 'County') { // Show the county selection
                domClass.remove(this.countySelection, 'hidden');
                domClass.add(this.tileSelection, 'hidden');

                domClass.add(this.submitBtn, 'jimu-state-disabled'); // Disable the Submit button
                
                this.onCountySelect();
              } else if (coverageType === 'Tile') { // Show the tile input box
                domClass.remove(this.tileSelection, 'hidden');
                domClass.add(this.countySelection, 'hidden');

                if (globalGeometry.x != 0 || globalGeometry.y != 0) {
                  domClass.remove(this.useAddressBtn, 'jimu-state-disabled'); // Enable the Use Address button
                }

                domClass.add(this.submitBtn, 'jimu-state-disabled'); // Disable the Submit button
              } else if (coverageType === 'County + Tile') { // Show the county selection and the tile input box
                domClass.remove(this.countySelection, 'hidden');
                domClass.remove(this.tileSelection, 'hidden');

                if (globalGeometry.x != 0 || globalGeometry.y != 0) {
                  domClass.remove(this.useAddressBtn, 'jimu-state-disabled'); // Enable the Use Address button
                }

                domClass.add(this.submitBtn, 'jimu-state-disabled'); // Disable the Submit button

                this.onCountySelect();
              }
            }));
          },

          onCountySelect: function() { // Draw county when selected
            on(dom.byId("county_box"), 'change', lang.hitch(this, function() {
              this.clearGraphics();
              dom.byId('progress_bar').style.display = 'block';

              var input = dom.byId("county_box").value;

              this.layer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Imagery/Aerial_Selection/MapServer/1", {
                mode: FeatureLayer.MODE_SELECTION,
                outFields: ["NAME"]
              });

              var borderColor = new Color([0, 255, 255]);
              var fillSymbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_NULL,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, borderColor, 4)
              );

              var query = new Query();

              if (input === "fort bend") {
                var countySQL = "NAME = 'Fort Bend County'";
              } else {
                var countySQL = "NAME = '" + input.charAt(0).toUpperCase() + input.slice(1) + " County'";
              }
              
              query.where = countySQL;
              query.outSpatialReference = this.map.spatialReference; // Needed for attribute select
              query.returnGeometry = true;

              this.layer.queryFeatures(query, lang.hitch(this, function(featureSet) {
                if (featureSet.features.length) {
                  var feature = featureSet.features[0];
                  var geometry = feature.geometry;
                  var graphic = new Graphic(geometry, fillSymbol);

                  this.map.graphics.add(graphic);

                  var query = new Query();
                  query.geometry = geometry;
                  query.outSpatialReference = this.map.spatialReference; // Needed for attribute select
                  query.returnGeometry = true;

                  this.drawTiles(query);
                }
              }));

              this.zoomToAllSelectedTiles();
            }));
          },

          onEnterKeyUp: function() { // Draw selected tile when pressing Enter
            on(dom.byId("tile_box"), 'keyup', lang.hitch(this, function(event) {

              var input = dom.byId("tile_box").value;

              if (event.keyCode === 13) {
                if (!layerDict[input]) {
                  event.preventDefault();
                  dom.byId('progress_bar').style.display = 'block';

                  var query = new Query();
                  query.where = "Grid_ID = '" + input + "'";
                  query.outSpatialReference = this.map.spatialReference; // Needed for attribute select
                  query.returnGeometry = true;

                  this.drawTiles(query);

                  // Add a tag displaying the selected tile
                  domConstruct.place("<div id=\"" + input + "\" class=\"tile-selection\"><p>" + input + "</p><button class=\"x\" type=\"button\" value=\"" + input + "\"><p class=\"x\">&#10005</p></button></div>", "tile_box", "before");
                  dom.byId("tile_box").value = ""; // Clear input after tile is displayed

                  this.zoomToAllSelectedTiles();
                } else {
                  new Message({
                    message: "Tile " + input + " is already selected!"
                  });
                }
              }
            }));
          },

          eraseTile: function(tileID) { // Erase tile when the tag is unselected
            var tileLayer = layerDict[tileID].graphic;
            this.map.graphics.remove(tileLayer);

            delete layerDict[tileID]; // "delete tileLayer" will not work

            if (Object.keys(layerDict).length > 0) {
              this.zoomToAllSelectedTiles();
            }
          },

          onXClick: function() { // Remove tag and deselect the corresponding tile when clicking "x"
            on(dom.byId("tile_input"), 'click', lang.hitch(this, function(event) {
              if (event.target.className === "x") { // Execute only if clicked on the "x"
                dom.byId('progress_bar').style.display = 'block';

                tileID = event.target.parentElement.value; // ID of the tile to be deselected
                this.eraseTile(tileID)

                tagID = tileID;
                tag = dom.byId(tagID);
                tag.remove();
              }
            }));
          },

          onUseAddressClick: function() { // Use the address specified in the Search widget to query tile
            dom.byId('progress_bar').style.display = 'block';

            var query = new Query();
            query.geometry = globalGeometry;
            query.outSpatialReference = this.map.spatialReference; // Needed for attribute select
            query.returnGeometry = true;

            this.drawTiles(query);

            setTimeout(lang.hitch(this, function() {
              // Add a tag displaying the selected tile
              domConstruct.place("<div id=\"" + globalTileID + "\" class=\"tile-selection\"><p>" + globalTileID + "</p><button class=\"x\" type=\"button\" value=\"" + globalTileID + "\"><p class=\"x\">&#10005</p></button></div>", "tile_box", "before");
            }), 250);

            this.zoomToAllSelectedTiles();
          },

          onUseLocationClick: function() { // Use the current location to query tile
            dom.byId('progress_bar').style.display = 'block';

            navigator.geolocation.getCurrentPosition(lang.hitch(this, function(position) {
              var x = position.coords.longitude;
              var y = position.coords.latitude;
              var spatialReference = new SpatialReference({wkid: 4326});
              globalGeometry = new Point(x, y, spatialReference);

              var query = new Query();
              query.geometry = globalGeometry;
              query.outSpatialReference = this.map.spatialReference; // Needed for attribute select
              query.returnGeometry = true;

              this.drawTiles(query);

              setTimeout(lang.hitch(this, function() {
                // Add a tag displaying the selected tile
                domConstruct.place("<div id=\"" + globalTileID + "\" class=\"tile-selection\"><p>" + globalTileID + "</p><button class=\"x\" type=\"button\" value=\"" + globalTileID + "\"><p class=\"x\">&#10005</p></button></div>", "tile_box", "before");
              }), 250);
            }));

            this.zoomToAllSelectedTiles();
          },

          onDraw: function() { // Draw shape on map and clear previous selections
            this.drawBox.setMap(this.map);
            this.own(on(this.drawBox, 'DrawEnd', lang.hitch(this, this.selectTiles)));
          },

          selectTiles: function(shape) { // Query tiles using shape drawn on map
            this.clearGraphics();
            dom.byId('progress_bar').style.display = 'block';
            
            this.drawBox.deactivate();
            this.drawBox.clear();

            var borderColor = new Color([0, 255, 255]);
            var fillSymbol = new SimpleFillSymbol(
              SimpleFillSymbol.STYLE_NULL,
              new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, borderColor, 4)
            );

            var geometry = shape.geometry;
            var graphic = new Graphic(geometry, fillSymbol);

            this.map.graphics.add(graphic);

            var query = new Query();
            query.geometry = geometry;

            this.drawTiles(query);
            this.zoomToAllSelectedTiles();
          },

          onSubLayerSelect: function() { // Use the selected sub layer to query tiles
            on(dom.byId("sub_layer_box"), 'change', lang.hitch(this, function() {
              dom.byId('progress_bar').style.display = 'block';

              this.map.getLayer(this.map.layerIds[4]).hide();

              var layerName = dom.byId("sub_layer_box").innerHTML;
              var url = dom.byId("sub_layer_box").value;
              
              this.layer = new FeatureLayer(url, {
                mode: FeatureLayer.MODE_SELECTION,
                outFields: ["*"]
              });

              var borderColor = new Color([0, 255, 255]);
              var fillSymbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_NULL,
                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, borderColor, 4)
              );

              var query = new Query();

              query.where = "1 = 1";
              query.outSpatialReference = this.map.spatialReference; // Needed for attribute select
              query.returnGeometry = true;

              this.layer.queryFeatures(query, lang.hitch(this, function(featureSet) {
                var featureCount = featureSet.features.length;

                for (var i = 0; i < featureCount; i++) {
                  var feature = featureSet.features[i];
                  var geometry = feature.geometry;
                  var graphic = new Graphic(geometry, fillSymbol);

                  this.map.graphics.add(graphic);

                  var query = new Query();
                  query.geometry = geometry;
                  query.outSpatialReference = this.map.spatialReference; // Needed for attribute select
                  query.returnGeometry = true;

                  this.drawTiles(query);
                }
              }));

              this.zoomToAllSelectedTiles();
            }));
          },

          onLayerSelect: function() { // Use the layer selected to query tiles
            if (this.map.layerIds.length === 5) {
              domClass.remove(this.subLayerSelection, 'hidden');

              this.onSubLayerSelect();
            } else if (this.map.graphicsLayerIds.length === 2) {
              dom.byId('progress_bar').style.display = 'block';

              var addedLayer = this.map.getLayer(this.map.graphicsLayerIds[1]);
              var featureCount = addedLayer.graphics.length;

              for (var i = 0; i < featureCount; i++) {
                var geometry = addedLayer.graphics[i].geometry;

                var query = new Query();
                query.geometry = geometry;
                query.outSpatialReference = this.map.spatialReference; // Needed for attribute select
                query.returnGeometry = true;

                this.drawTiles(query);
                this.zoomToAllSelectedTiles();
              }
            }
          },

          onSubmitClick: function() { // Generate a list of tiles available for sale when clicking the Submit button
            var tileIDList = [];

            for (var key in layerDict) {
              if (layerDict[key].hasProduct === 'Y') {
                tileIDList.push(key);
              }
            }

            var tileIDText = "Among your selected tiles, the product you selected is available for the following:\n";

            for (var i = 0; i < tileIDList.length; i++) {
              tileIDText += "\n\u2022" + tileIDList[i];
            }

            tileIDText += "\n\nPlease use this list as a reference when creating your order by tile."

            new Message({
              message: tileIDText
            });
          },

          onOpen: function(){
            globalGeometry = this.map.graphics.graphics[0].geometry; // Get the layer already added to the map (from the Add Data or Search widgets) before opening widget

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