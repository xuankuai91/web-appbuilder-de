define([
  'dijit/_WidgetsInTemplateMixin',
  'dijit/form/HorizontalSlider',
  'dijit/layout/BorderContainer',
  'dijit/layout/ContentPane',
  'dijit/layout/TabContainer',
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
  'dojox/charting/action2d/Highlight',
  'dojox/charting/action2d/MoveSlice',
  'dojox/charting/action2d/Tooltip',
  'dojox/charting/Chart2D',
  'dojox/charting/plot2d/Pie',
  'dojox/charting/themes/PrimaryColors',
  'esri/Color',
  'esri/config',
  'esri/geometry/Extent',
  'esri/geometry/normalizeUtils',
  'esri/graphic',
  'esri/graphicsUtils',
  'esri/InfoTemplate',
  'esri/layers/FeatureLayer',
  'esri/map',
  'esri/renderers/SimpleRenderer',
  'esri/SpatialReference',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/tasks/BufferParameters',
  'esri/tasks/GeometryService',
  'esri/tasks/query',
  'jimu/BaseWidget',
  'jimu/dijit/DrawBox',
  'jimu/dijit/Message',
  'jimu/PanelManager',
  'dojo/domReady!'
  ],
  function(
    _WidgetsInTemplateMixin,
    HorizontalSlider,
    BorderContainer,
    ContentPane,
    TabContainer,
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
    Highlight,
    MoveSlice,
    Tooltip,
    Chart2D,
    Pie,
    dojoxTheme,
    Color,
    esriConfig,
    Extent,
    normalizeUtils,
    Graphic,
    graphicsUtils,
    InfoTemplate,
    FeatureLayer,
    Map,
    SimpleRenderer,
    SpatialReference,
    SimpleFillSymbol,
    SimpleLineSymbol,
    SimpleMarkerSymbol,
    BufferParameters,
    GeometryService,
    Query,
    BaseWidget,
    DrawBox,
    Message,
    PanelManager
    ) {
        var queryMode = 'buffer'; // Select among buffer, ZIP Code, or county

        var globalFeature = null; // Define the global feature variable for query
        var globalGeometry = null; // Define the global geometry variable for query
        var globalGraphic = null; // Define the global graphic variable for adding attributes and popup

        // Define the global variables of summary counts
        var totalAEL = 0;
        var totalExoffender = 0;
        var totalETPS = 0;
        var totalParole = 0;
        var totalReentry = 0;
        var totalCO = 0;
        var totalVR = 0;
        var totalLibrary = 0;
        var totalJobAd = 0;

        var totalPop = 0;
        var totalFemale = 0;
        var totalMale = 0;
        var totalUnder18 = 0;
        var total1824 = 0;
        var total2534 = 0;
        var total3544 = 0;
        var total4554 = 0;
        var total5564 = 0;
        var total6574 = 0;
        var totalAbove75 = 0;
        var totalNoEnglish = 0;
        var total2564 = 0;
        var totalNoHS = 0;
        var totalHS = 0;
        var totalSomeCollege = 0;
        var totalAssociates = 0;
        var totalBachelors = 0;
        var totalPostGrad = 0;
        var totalDisabled = 0;
        var totalVeteran = 0;
        var totalUnemployed = 0;
        var totalPoverty = 0;
        var totalPubAssist = 0;
        var totalDisconnYouth = 0;

        var totalBus = 0;
        var totalBusCO = 0;
        var totalBusIO = 0;
        var totalBus11 = 0;
        var totalBus21 = 0;
        var totalBus22 = 0;
        var totalBus23 = 0;
        var totalBus3133 = 0;
        var totalBus42 = 0;
        var totalBus4445 = 0;
        var totalBus4849 = 0;
        var totalBus51 = 0;
        var totalBus52 = 0;
        var totalBus53 = 0;
        var totalBus54 = 0;
        var totalBus55 = 0;
        var totalBus56 = 0;
        var totalBus61 = 0;
        var totalBus62 = 0;
        var totalBus71 = 0;
        var totalBus72 = 0;
        var totalBus81 = 0;
        var totalEmp = 0;
        var totalEmpCO = 0;
        var totalEmpIO = 0;
        var totalEmp11 = 0;
        var totalEmp21 = 0;
        var totalEmp22 = 0;
        var totalEmp23 = 0;
        var totalEmp3133 = 0;
        var totalEmp42 = 0;
        var totalEmp4445 = 0;
        var totalEmp4849 = 0;
        var totalEmp51 = 0;
        var totalEmp52 = 0;
        var totalEmp53 = 0;
        var totalEmp54 = 0;
        var totalEmp55 = 0;
        var totalEmp56 = 0;
        var totalEmp61 = 0;
        var totalEmp62 = 0;
        var totalEmp71 = 0;
        var totalEmp72 = 0;
        var totalEmp81 = 0;

        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget, _WidgetsInTemplateMixin], {
          // Custom Widget code goes here

          //please note that this property is be set by the framework when widget is loaded.
          //templateString: template,

          baseClass: 'jimu-widget-querygeometry',
            
          name: 'QueryGeometry',

          postCreate: function() {
            this.inherited(arguments);
            console.log('postCreate');
          },

          startup: function() {
            this.inherited(arguments);
            // this.mapIdNode.innerHTML = 'map id:' + this.map.id;

            document.getElementById('progress_bar').style.display = 'none';

            parser.parse();

            var slider = new HorizontalSlider({
              name: "slider",
              value: 0,
              minimum: 0,
              maximum: 10,
              discreteValues: 21,
              intermediateChanges: true,
              style: "margin-top:10px;",
              onChange: function(value){
                dom.byId("radius_box").value = value;
              }
            }, "slider").startup();

            esriBundle.toolbars.draw.addPoint = "Click to add a buffer"; // Change the draw box tooltip

            this.onKeyIn();
            this.onDrawBufferClick();
            this.onEnterKeyUp();
            this.onSelectZIPClick();
            this.onSelectChange();
            this.onSelectCountyClick();

            console.log('startup');
          },

          onTabHeaderClick: function(event) { // Switch tabs based on click event
            var target = event.target || event.srcElement;
            if (target === this.bufferTabItem) {
              this.switchToBufferTab();
              esriBundle.toolbars.draw.addPoint = "Click to add a buffer"; // Change the draw box tooltip
              queryMode = 'buffer';
            } else if (target === this.zipTabItem) {
              this.switchToZIPTab();
              esriBundle.toolbars.draw.addPoint = "Click to select a ZIP Code area"; // Change the draw box tooltip
              queryMode = 'zip';
            } else if (target === this.countyTabItem) {
              this.switchToCountyTab();
              esriBundle.toolbars.draw.addPoint = "Click to select a county"; // Change the draw box tooltip
              queryMode = 'county';
            }
          },

          switchToBufferTab: function() { // Switch to Demographics tab
            domClass.remove(this.zipTabItem, 'selected');
            domClass.remove(this.zipTabView, 'selected');
            domClass.remove(this.countyTabItem, 'selected');
            domClass.remove(this.countyTabView, 'selected');
            domClass.add(this.bufferTabItem, 'selected');
            domClass.add(this.bufferTabView, 'selected');

            document.getElementById("query_geometry_btn").style.top = '149px';
            document.getElementsByClassName("progress-bar-container")[0].style.top = '192px';
          },

          switchToZIPTab: function() { // Switch to Specials tab
            domClass.remove(this.bufferTabItem, 'selected');
            domClass.remove(this.bufferTabView, 'selected');
            domClass.remove(this.countyTabItem, 'selected');
            domClass.remove(this.countyTabView, 'selected');
            domClass.add(this.zipTabItem, 'selected');
            domClass.add(this.zipTabView, 'selected');

            document.getElementById("query_geometry_btn").style.top = '125px';
            document.getElementsByClassName("progress-bar-container")[0].style.top = '168px';
          },

          switchToCountyTab: function() { // Switch to Employments tab
            domClass.remove(this.bufferTabItem, 'selected');
            domClass.remove(this.bufferTabView, 'selected');
            domClass.remove(this.zipTabItem, 'selected');
            domClass.remove(this.zipTabView, 'selected');
            domClass.add(this.countyTabItem, 'selected');
            domClass.add(this.countyTabView, 'selected');

            document.getElementById("query_geometry_btn").style.top = '125px';
            document.getElementsByClassName("progress-bar-container")[0].style.top = '168px';
          },
              
          onDrawBufferClick: function() { // Start all functions with clicking on the pin icon
            this.bufferDrawBox.setMap(this.map);
            this.own(on(this.bufferDrawBox, 'DrawEnd', lang.hitch(this, this.createBuffer)));
          },

          onSelectZIPClick: function() { // Start all functions with clicking on the pin icon
            this.zipDrawBox.setMap(this.map);
            this.own(on(this.zipDrawBox, 'DrawEnd', lang.hitch(this, this.selectZIP)));
          },

          onSelectCountyClick: function() { // Start all functions with clicking on the pin icon
            this.countyDrawBox.setMap(this.map);
            this.own(on(this.countyDrawBox, 'DrawEnd', lang.hitch(this, this.selectCounty)));
          },

          onKeyIn: function() { // Set the slider value on keying in number
            on(dom.byId("radius_box"), 'keyup', lang.hitch(this, function(event) {
              var input = document.getElementById("radius_box").value;
              dijit.byId("slider").set('value', input);
            }));
          },

          createBuffer: function(evtObj) { // Draw click event point and buffer
            this.bufferDrawBox.deactivate();
            this.bufferDrawBox.clear(); // Remove the default blue marker symbol of the click event
            globalGeometry = null;
            globalGraphic = null;
            this.map.graphics.clear();

            var geometry = evtObj.geometry;

            symbol = new SimpleMarkerSymbol(
              SimpleMarkerSymbol.STYLE_CIRCLE,
              12,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([0, 255, 255]), 1),
              new Color([0, 255, 255]),
              1
            );

            var graphic = new Graphic(geometry, symbol);
            this.map.graphics.add(graphic);

            // Setup the buffer parameters
            var params = new BufferParameters();
            params.distances = [Number(document.getElementById('radius_box').value)];
            params.outSpatialReference = this.map.spatialReference;
            params.unit = GeometryService.UNIT_STATUTE_MILE;

            // Normalize the geometry
            normalizeUtils.normalizeCentralMeridian([geometry]).then(lang.hitch(this, function(normalizedGeometries) {
              params.geometries = normalizedGeometries;
              esriConfig.defaults.geometryService.buffer(params, lang.hitch(this, this.showBuffer));
            }));
          },

          showBuffer: function(bufferedGeometries) { // Display buffer
            var borderColor = new Color([0, 255, 255]);
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

            this.map.setExtent(graphicsUtils.graphicsExtent([globalGraphic]), true);
          },

          onEnterKeyUp: function() { // Draw selected ZIP Code area on pressing Enter
            globalFeature = null;
            globalGeometry = null;
            globalGraphic = null;
            this.map.graphics.clear();

            on(dom.byId("zip_box"), 'keyup', lang.hitch(this, function(event) {
              var input = document.getElementById("zip_box").value;

              if (event.keyCode === 13) {
                event.preventDefault();

                var query = new Query();
                query.where = "ZCTA5CE10 = '" + input + "'";
                query.outSpatialReference = this.map.spatialReference; // Needed for attribute select
                query.returnGeometry = true;

                this.layer = new FeatureLayer("http://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/11", {
                  mode: FeatureLayer.MODE_ONDEMAND,
                  outFields: ["*"]
                });

                var borderColor = new Color([0, 255, 255]);
                var fillColor = new Color([255, 0, 0, 0.25]);
                var fillSymbol = new SimpleFillSymbol(
                  SimpleFillSymbol.STYLE_SOLID,
                  new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    borderColor, 2
                  ),
                  fillColor
                );

                this.layer.selectFeatures(query, FeatureLayer.SELECTION_NEW);
                this.layer.on("selection-complete", lang.hitch(this, function() {
                  if (this.layer.getSelectedFeatures().length) {
                    globalFeature = this.layer.getSelectedFeatures()[0];
                    globalGeometry = globalFeature.geometry;
                    globalGraphic = new Graphic(globalGeometry, fillSymbol);
                    this.map.graphics.add(globalGraphic);
                    this.map.setExtent(graphicsUtils.graphicsExtent([globalGraphic]), true);
                  } else {
                    new Message({
                      message: "Please query inside the region!"
                    });
                  }
                }));
              }
            }));
          },

          selectZIP: function(evtObj) { // Draw selected ZIP Code area on click event
            this.zipDrawBox.deactivate();
            this.zipDrawBox.clear(); // Remove the default blue marker symbol of the click event
            globalFeature = null;
            globalGeometry = null;
            globalGraphic = null;
            this.map.graphics.clear();

            var geometry = evtObj.geometry;
            var query = new Query();
            query.geometry = geometry;

            this.layer = new FeatureLayer("http://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/11", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            var borderColor = new Color([0, 255, 255]);
            var fillColor = new Color([255, 0, 0, 0.25]);
            var fillSymbol = new SimpleFillSymbol(
              SimpleFillSymbol.STYLE_SOLID,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                borderColor, 2
              ),
              fillColor
            );

            this.layer.selectFeatures(query, FeatureLayer.SELECTION_NEW);
            this.layer.on("selection-complete", lang.hitch(this, function() {
              if (this.layer.getSelectedFeatures().length) {
                globalFeature = this.layer.getSelectedFeatures()[0];
                inputString = globalFeature.attributes["ZCTA5CE10"];
                document.getElementById("zip_box").value = inputString;

                globalGeometry = globalFeature.geometry;
                globalGraphic = new Graphic(globalGeometry, fillSymbol);
                this.map.graphics.add(globalGraphic);
                this.map.setExtent(graphicsUtils.graphicsExtent([globalGraphic]), true);
              } else {
                new Message({
                  message: "Please query inside the region!"
                });
              }
            }));
          },

          onSelectChange: function() { // Draw selected ZIP Code area on changing selection
            globalFeature = null;
            globalGeometry = null;
            globalGraphic = null;
            this.map.graphics.clear();

            on(dom.byId("county_box"), 'change', lang.hitch(this, function(event) {
              var input = document.getElementById("county_box").value;

              var query = new Query();
              query.where = "NAME = '" + input.charAt(0).toUpperCase() + input.slice(1) + " County'";
              query.outSpatialReference = this.map.spatialReference; // Needed for attribute select
              query.returnGeometry = true;

              this.layer = new FeatureLayer("http://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/10", {
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["*"]
              });

              var borderColor = new Color([0, 255, 255]);
              var fillColor = new Color([255, 0, 0, 0.25]);
              var fillSymbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  borderColor, 2
                ),
                fillColor
              );

              this.layer.selectFeatures(query, FeatureLayer.SELECTION_NEW);
              this.layer.on("selection-complete", lang.hitch(this, function() {
                globalFeature = this.layer.getSelectedFeatures()[0];
                globalGeometry = globalFeature.geometry;
                globalGraphic = new Graphic(globalGeometry, fillSymbol);
                this.map.graphics.add(globalGraphic);
                this.map.setExtent(graphicsUtils.graphicsExtent([globalGraphic]), true);
              }));
            }));
          },

          selectCounty: function(evtObj) { // Draw selected county on click event
            this.countyDrawBox.deactivate();
            this.countyDrawBox.clear(); // Remove the default blue marker symbol of the click event
            globalFeature = null;
            globalGeometry = null;
            globalGraphic = null;
            this.map.graphics.clear();

            var geometry = evtObj.geometry;
            var query = new Query();
            query.geometry = geometry;

            this.layer = new FeatureLayer("http://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/10", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            var borderColor = new Color([0, 255, 255]);
            var fillColor = new Color([255, 0, 0, 0.25]);
            var fillSymbol = new SimpleFillSymbol(
              SimpleFillSymbol.STYLE_SOLID,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                borderColor, 2
              ),
              fillColor
            );

            this.layer.selectFeatures(query, FeatureLayer.SELECTION_NEW);
            this.layer.on("selection-complete", lang.hitch(this, function() {
              if (this.layer.getSelectedFeatures().length) {
                globalFeature = this.layer.getSelectedFeatures()[0];
                inputString = globalFeature.attributes["NAME"].substring(0, globalFeature.attributes["NAME"].length - 7).toLowerCase();
                document.getElementById("county_box").value = inputString;

                globalGeometry = globalFeature.geometry;
                globalGraphic = new Graphic(globalGeometry, fillSymbol);
                this.map.graphics.add(globalGraphic);
                this.map.setExtent(graphicsUtils.graphicsExtent([globalGraphic]), true);
              } else {
                new Message({
                  message: "Please query inside the region!"
                });
              }
            }));
          },

          onCalculateClick: function() { // Calculate sums
            this.initStats(); // Initialize the summary counts

            document.getElementById('progress_bar').style.display = 'block'; // Show the progress bar

            this.aelLayer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/1");
            this.exoffenderLayer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/2");
            this.etpsLayer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/3");
            this.paroleLayer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/4");
            this.reentryLayer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/5");
            this.coLayer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/6");
            this.vrLayer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/7");
            this.libraryLayer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/8");

            this.demographyLayer = new FeatureLayer("http://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/11", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            this.employmentLayer = new FeatureLayer("http://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/13", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            })

            this.jobAdLayer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Workforce_Solutions/Disconnected_Youth/MapServer/12", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            var query = new Query();
            query.geometry = globalGeometry;

            // Count the resource locations
            this.aelLayer.queryFeatures(query, function(result) {
              var features = result.features;
              totalAEL = features.length;
            });

            this.exoffenderLayer.queryFeatures(query, function(result) {
              var features = result.features;
              totalExoffender = features.length;
            });

            this.etpsLayer.queryFeatures(query, function(result) {
              var features = result.features;
              totalETPS = features.length;
            });

            this.paroleLayer.queryFeatures(query, function(result) {
              var features = result.features;
              totalParole = features.length;
            });

            this.reentryLayer.queryFeatures(query, function(result) {
              var features = result.features;
              totalReentry = features.length;
            });

            this.coLayer.queryFeatures(query, function(result) {
              var features = result.features;
              totalCO = features.length;
            });

            this.vrLayer.queryFeatures(query, function(result) {
              var features = result.features;
              totalVR = features.length;
            });

            this.libraryLayer.queryFeatures(query, function(result) {
              var features = result.features;
              totalLibrary = features.length;
            });

            if (queryMode === 'buffer') {
              this.demographyLayer.queryFeatures(query, this.summarizeDemoStats);
              this.employmentLayer.queryFeatures(query, this.summarizeEmpStats);
            } else if (queryMode === 'zip') {
              this.summarizeGlobalDemoStats();
              this.employmentLayer.queryFeatures(query, this.summarizeEmpStats);
            } else if (queryMode === 'county') {
              this.summarizeGlobalDemoStats();
              this.summarizeGlobalEmpStats();
            }

            this.jobAdLayer.queryFeatures(query, this.summarizeJobAdStats);

            this.createPopup();

            setTimeout(lang.hitch(this, function() {
              this.publishData({
                aelData: totalAEL,
                exoffenderData: totalExoffender,
                etpsData: totalETPS,
                paroleData: totalParole,
                reentryData: totalReentry,
                coData: totalCO,
                vrData: totalVR,
                libraryData: totalLibrary,
                jobAdData: totalJobAd,
                popData: totalPop,
                femaleData: totalFemale,
                maleData: totalMale,
                under18Data: totalUnder18,
                _1824Data: total1824,
                _2534Data: total2534,
                _3544Data: total3544,
                _4554Data: total4554,
                _5564Data: total5564,
                _6574Data: total6574,
                above75Data: totalAbove75,
                noEnglishData: totalNoEnglish,
                noHSData: totalNoHS,
                hsData: totalHS,
                someCollegeData: totalSomeCollege,
                associatesData: totalAssociates,
                bachelorsData: totalBachelors,
                postGradData: totalPostGrad,
                disabledData: totalDisabled,
                veteranData: totalVeteran,
                unemployedData: totalUnemployed,
                povertyData: totalPoverty,
                pubAssistData: totalPubAssist,
                disconnYouthData: totalDisconnYouth,
                busData: totalBus,
                busCOData: totalBusCO,
                busIOData: totalBusIO,
                bus11Data: totalBus11,
                bus21Data: totalBus21,
                bus22Data: totalBus22,
                bus23Data: totalBus23,
                bus3133Data: totalBus3133,
                bus42Data: totalBus42,
                bus4445Data: totalBus4445,
                bus4849Data: totalBus4849,
                bus51Data: totalBus51,
                bus52Data: totalBus52,
                bus53Data: totalBus53,
                bus54Data: totalBus54,
                bus55Data: totalBus55,
                bus56Data: totalBus56,
                bus61Data: totalBus61,
                bus62Data: totalBus62,
                bus71Data: totalBus71,
                bus72Data: totalBus72,
                bus81Data: totalBus81,
                empData: totalEmp,
                empCOData: totalEmpCO,
                empIOData: totalEmpIO,
                emp11Data: totalEmp11,
                emp21Data: totalEmp21,
                emp22Data: totalEmp22,
                emp23Data: totalEmp23,
                emp3133Data: totalEmp3133,
                emp42Data: totalEmp42,
                emp4445Data: totalEmp4445,
                emp4849Data: totalEmp4849,
                emp51Data: totalEmp51,
                emp52Data: totalEmp52,
                emp53Data: totalEmp53,
                emp54Data: totalEmp54,
                emp55Data: totalEmp55,
                emp56Data: totalEmp56,
                emp61Data: totalEmp61,
                emp62Data: totalEmp62,
                emp71Data: totalEmp71,
                emp72Data: totalEmp72,
                emp81Data: totalEmp81
              });

              domClass.remove(this.showResultsBtn, 'jimu-state-disabled'); // Enable the Show Results button
              document.getElementById('progress_bar').style.display = 'none'; // Re-hide the progress bar
            }), 5000);
          },

          summarizeDemoStats: function(result) { // Summarize population numbers
            var features = result.features;
            var feature;

            // Add up population numbers
            for (var i = 0; i < features.length; i++) {
              feature = features[i];

              totalFemale = totalFemale + feature.attributes['Female'];
              totalMale = totalMale + feature.attributes['Male'];
              totalUnder18 = totalUnder18 + feature.attributes['AgeUnder18'];
              total1824 = total1824 + feature.attributes['Age18_24'];
              total2534 = total2534 + feature.attributes['Age25_34'];
              total3544 = total3544 + feature.attributes['Age35_44'];
              total4554 = total4554 + feature.attributes['Age45_54'];
              total5564 = total5564 + feature.attributes['Age55_64'];
              total6574 = total6574 + feature.attributes['Age65_74'];
              totalAbove75 = totalAbove75 + feature.attributes['AgeAbove75'];
              totalNoEnglish = totalNoEnglish + feature.attributes['NoEnglish'];
              totalNoHS = totalNoHS + feature.attributes['NoHS'];
              totalHS = totalHS + feature.attributes['HS'];
              totalSomeCollege = totalSomeCollege + feature.attributes['SomeCollege'];
              totalAssociates = totalAssociates + feature.attributes['Associates'];
              totalBachelors = totalBachelors + feature.attributes['Bachelors'];
              totalPostGrad = totalPostGrad + feature.attributes['PostGrad'];
              totalDisabled = totalDisabled + feature.attributes['Disability'];
              totalVeteran = totalVeteran + feature.attributes['Veteran'];
              totalUnemployed = totalUnemployed + feature.attributes['Unemp'];
              totalPoverty = totalPoverty + feature.attributes['Poverty'];
              totalPubAssist = totalPubAssist + feature.attributes['PubAssist'];
              totalDisconnYouth = totalDisconnYouth + feature.attributes['DisconnYouth'];

              // Calculate subtotals
              totalPop = totalFemale + totalMale;
              total2564 = totalNoHS + totalHS + totalSomeCollege + totalAssociates + totalBachelors + totalPostGrad;
            }
          },

          summarizeEmpStats: function(result) { // Summarize employment numbers
            var feature;
            var features = result.features;

            // Add up population numbers
            for (var i = 0; i < features.length; i++) {
              feature = features[i];

              totalBus = totalBus + feature.attributes['Bus_All'];
              totalBusCO = totalBusCO + feature.attributes['Bus_CO'];
              totalBusIO = totalBusIO + feature.attributes['Bus_IO'];
              totalBus11 = totalBus11 + feature.attributes['Bus_11'];
              totalBus21 = totalBus21 + feature.attributes['Bus_21'];
              totalBus22 = totalBus22 + feature.attributes['Bus_22'];
              totalBus23 = totalBus23 + feature.attributes['Bus_23'];
              totalBus3133 = totalBus3133 + feature.attributes['Bus_31_33'];
              totalBus42 = totalBus42 + feature.attributes['Bus_42'];
              totalBus4445 = totalBus4445 + feature.attributes['Bus_44_45'];
              totalBus4849 = totalBus4849 + feature.attributes['Bus_48_49'];
              totalBus51 = totalBus51 + feature.attributes['Bus_51'];
              totalBus52 = totalBus52 + feature.attributes['Bus_52'];
              totalBus53 = totalBus53 + feature.attributes['Bus_53'];
              totalBus54 = totalBus54 + feature.attributes['Bus_54'];
              totalBus55 = totalBus55 + feature.attributes['Bus_55'];
              totalBus56 = totalBus56 + feature.attributes['Bus_56'];
              totalBus61 = totalBus61 + feature.attributes['Bus_61'];
              totalBus62 = totalBus62 + feature.attributes['Bus_62'];
              totalBus71 = totalBus71 + feature.attributes['Bus_71'];
              totalBus72 = totalBus72 + feature.attributes['Bus_72'];
              totalBus81 = totalBus81 + feature.attributes['Bus_81'];
              totalEmp = totalEmp + feature.attributes['Emp_All'];
              totalEmpCO = totalEmpCO + feature.attributes['Emp_CO'];
              totalEmpIO = totalEmpIO + feature.attributes['Emp_IO'];
              totalEmp11 = totalEmp11 + feature.attributes['Emp_11'];
              totalEmp21 = totalEmp21 + feature.attributes['Emp_21'];
              totalEmp22 = totalEmp22 + feature.attributes['Emp_22'];
              totalEmp23 = totalEmp23 + feature.attributes['Emp_23'];
              totalEmp3133 = totalEmp3133 + feature.attributes['Emp_31_33'];
              totalEmp42 = totalEmp42 + feature.attributes['Emp_42'];
              totalEmp4445 = totalEmp4445 + feature.attributes['Emp_44_45'];
              totalEmp4849 = totalEmp4849 + feature.attributes['Emp_48_49'];
              totalEmp51 = totalEmp51 + feature.attributes['Emp_51'];
              totalEmp52 = totalEmp52 + feature.attributes['Emp_52'];
              totalEmp53 = totalEmp53 + feature.attributes['Emp_53'];
              totalEmp54 = totalEmp54 + feature.attributes['Emp_54'];
              totalEmp55 = totalEmp55 + feature.attributes['Emp_55'];
              totalEmp56 = totalEmp56 + feature.attributes['Emp_56'];
              totalEmp61 = totalEmp61 + feature.attributes['Emp_61'];
              totalEmp62 = totalEmp62 + feature.attributes['Emp_62'];
              totalEmp71 = totalEmp71 + feature.attributes['Emp_71'];
              totalEmp72 = totalEmp72 + feature.attributes['Emp_72'];
              totalEmp81 = totalEmp81 + feature.attributes['Emp_81'];
            }
          },

          summarizeGlobalDemoStats: function() { // Summarize population numbers directly from the layer
            // Get population count directly from the layer
            totalFemale = globalFeature.attributes['Female'];
            totalMale = globalFeature.attributes['Male'];
            totalUnder18 = globalFeature.attributes['AgeUnder18'];
            total1824 = globalFeature.attributes['Age18_24'];
            total2534 = globalFeature.attributes['Age25_34'];
            total3544 = globalFeature.attributes['Age35_44'];
            total4554 = globalFeature.attributes['Age45_54'];
            total5564 = globalFeature.attributes['Age55_64'];
            total6574 = globalFeature.attributes['Age65_74'];
            totalAbove75 = globalFeature.attributes['AgeAbove75'];
            totalNoEnglish = globalFeature.attributes['NoEnglish'];
            totalNoHS = globalFeature.attributes['NoHS'];
            totalHS = globalFeature.attributes['HS'];
            totalSomeCollege = globalFeature.attributes['SomeCollege'];
            totalAssociates = globalFeature.attributes['Associates'];
            totalBachelors = globalFeature.attributes['Bachelors'];
            totalPostGrad = globalFeature.attributes['PostGrad'];
            totalDisabled = globalFeature.attributes['Disability'];
            totalVeteran = globalFeature.attributes['Veteran'];
            totalUnemployed = globalFeature.attributes['Unemp'];
            totalPoverty = globalFeature.attributes['Poverty'];
            totalPubAssist = globalFeature.attributes['PubAssist'];
            totalDisconnYouth = globalFeature.attributes['DisconnYouth'];

            // Calculate subtotals
            totalPop = totalFemale + totalMale;
            total2564 = totalNoHS + totalHS + totalSomeCollege + totalAssociates + totalBachelors + totalPostGrad;
          },

          summarizeGlobalEmpStats: function() { // Summarize employment numbers directly from the layer
            // Get employment count directly from the layer
            totalBus = globalFeature.attributes['Bus_All'];
            totalBusCO = globalFeature.attributes['Bus_CO'];
            totalBusIO = globalFeature.attributes['Bus_IO'];
            totalBus11 = globalFeature.attributes['Bus_11'];
            totalBus21 = globalFeature.attributes['Bus_21'];
            totalBus22 = globalFeature.attributes['Bus_22'];
            totalBus23 = globalFeature.attributes['Bus_23'];
            totalBus3133 = globalFeature.attributes['Bus_31_33'];
            totalBus42 = globalFeature.attributes['Bus_42'];
            totalBus4445 = globalFeature.attributes['Bus_44_45'];
            totalBus4849 = globalFeature.attributes['Bus_48_49'];
            totalBus51 = globalFeature.attributes['Bus_51'];
            totalBus52 = globalFeature.attributes['Bus_52'];
            totalBus53 = globalFeature.attributes['Bus_53'];
            totalBus54 = globalFeature.attributes['Bus_54'];
            totalBus55 = globalFeature.attributes['Bus_55'];
            totalBus56 = globalFeature.attributes['Bus_56'];
            totalBus61 = globalFeature.attributes['Bus_61'];
            totalBus62 = globalFeature.attributes['Bus_62'];
            totalBus71 = globalFeature.attributes['Bus_71'];
            totalBus72 = globalFeature.attributes['Bus_72'];
            totalBus81 = globalFeature.attributes['Bus_81'];
            totalEmp = globalFeature.attributes['Emp_All'];
            totalEmpCO = globalFeature.attributes['Emp_CO'];
            totalEmpIO = globalFeature.attributes['Emp_IO'];
            totalEmp11 = globalFeature.attributes['Emp_11'];
            totalEmp21 = globalFeature.attributes['Emp_21'];
            totalEmp22 = globalFeature.attributes['Emp_22'];
            totalEmp23 = globalFeature.attributes['Emp_23'];
            totalEmp3133 = globalFeature.attributes['Emp_31_33'];
            totalEmp42 = globalFeature.attributes['Emp_42'];
            totalEmp4445 = globalFeature.attributes['Emp_44_45'];
            totalEmp4849 = globalFeature.attributes['Emp_48_49'];
            totalEmp51 = globalFeature.attributes['Emp_51'];
            totalEmp52 = globalFeature.attributes['Emp_52'];
            totalEmp53 = globalFeature.attributes['Emp_53'];
            totalEmp54 = globalFeature.attributes['Emp_54'];
            totalEmp55 = globalFeature.attributes['Emp_55'];
            totalEmp56 = globalFeature.attributes['Emp_56'];
            totalEmp61 = globalFeature.attributes['Emp_61'];
            totalEmp62 = globalFeature.attributes['Emp_62'];
            totalEmp71 = globalFeature.attributes['Emp_71'];
            totalEmp72 = globalFeature.attributes['Emp_72'];
            totalEmp81 = globalFeature.attributes['Emp_81'];
          },

          summarizeJobAdStats: function(result) { // Summarize job ad numbers
            var feature;
            var features = result.features;

            // Add up population numbers
            for (var i = 0; i < features.length; i++) {
              feature = features[i];
              totalJobAd = totalJobAd + feature.attributes['JobAds'];
            }
          },

          createPopup: function() { // Create popup for buffer geometry
            // Create charts in info template
            var infoTemplate = new InfoTemplate();
            infoTemplate.setTitle("Service area demographics");
            infoTemplate.setContent(function() { // Populate the popup content
              // Make a tab container
              var tabContainer = new TabContainer({
                style: "width:100%;height:244px;",
                tabPosition: 'left-h' 
              }, domConstruct.create("div"));

              // Create popup panes
              // Create the resources tab
              var resContentPane = new ContentPane({
                title: "Resources",
                content: "<b>AEL providers: </b>" + totalAEL + "<br/>" +
                         "<b>Ex-offender resources: </b>" + totalExoffender + "<br/>" +
                         "<b>Gulf coast region ETPS: </b>" + totalETPS + "<br/>" +
                         "<b>Parole offices: </b>" + totalParole + "<br/>" +
                         "<b>Re-entry resources: </b>" + totalReentry + "<br/>" +
                         "<b>Career offices: </b>" + totalCO + "<br/>" +
                         "<b>VR offices: </b>" + totalVR + "<br/>" +
                         "<b>Library: </b>" + totalLibrary + "<br/>" +
                         "<b>Job Ads: </b>" + totalJobAd + "<br/>"
              });

              var genderContentPane = new ContentPane({
                title: "Gender"
              });

              var ageContentPane = new ContentPane({
                title: "Age"
              });

              var eduContentPane = new ContentPane({
                title: "Education"
              });

              var busContentPane = new ContentPane({
                title: "Business"
              });

              var empContentPane = new ContentPane({
                title: "Employee"
              });

              tabContainer.addChild(resContentPane);
              tabContainer.addChild(genderContentPane);
              tabContainer.addChild(ageContentPane);
              tabContainer.addChild(eduContentPane);
              tabContainer.addChild(busContentPane);
              tabContainer.addChild(empContentPane);

              // ********************************************************************
              // Create the chart for demographics by gender
              var c = domConstruct.create("div", {
                id: 'gender_pie_chart'
              }, domConstruct.create("div"));
              var genderChart = new Chart2D(c);
              domClass.add(genderChart, 'chart');

              // Apply a theme to the chart
              genderChart.setTheme(dojoxTheme);
              genderChart.addPlot('default', {
                type: 'Pie',
                radius: 70,
                htmlLabels: true
              });

              tabContainer.watch('selectedChildWidget', function(name, oldVal, newVal) {
                if ( newVal.title === "Gender" ) {
                  genderChart.resize(180, 180);
                }
              });

              // Calculate percentages
              var femalePct = number.round(totalFemale / totalPop * 100, 2);
              var malePct = number.round(totalMale / totalPop * 100, 2);

              genderChart.addSeries('PopulationSplit', [{
                y: femalePct,
                tooltip: femalePct,
                text: "Female"
              }, {
                y: malePct,
                tooltip: malePct,
                text: "Male"
              }]);

              // Highlight the chart and display tooltips when the cursor is over a slice.
              new Highlight(genderChart, 'default');
              new Tooltip(genderChart, 'default');
              new MoveSlice(genderChart, 'default');

              // Set the chart as the pane content
              genderContentPane.set('content', genderChart.node);

              // ********************************************************************
              // Create the chart for demographics by age
              var c = domConstruct.create("div", {
                id: 'age_pie_chart'
              }, domConstruct.create("div"));
              var ageChart = new Chart2D(c);
              domClass.add(ageChart, 'chart');

              // Apply a theme to the chart
              ageChart.setTheme(dojoxTheme);
              ageChart.addPlot('default', {
                type: 'Pie',
                radius: 70,
                htmlLabels: true
              });

              tabContainer.watch('selectedChildWidget', function(name, oldVal, newVal) {
                if ( newVal.title === "Age" ) {
                  ageChart.resize(180, 180);
                }
              });

              // Calculate percentages
              var ageUnder18Pct = number.round(totalUnder18 / totalPop * 100, 2);
              var age1824Pct = number.round(total1824 / totalPop * 100, 2);
              var age2534Pct = number.round(total2534 / totalPop * 100, 2);
              var age3544Pct = number.round(total3544 / totalPop * 100, 2);
              var age4554Pct = number.round(total4554 / totalPop * 100, 2);
              var age5564Pct = number.round(total5564 / totalPop * 100, 2);
              var age6574Pct = number.round(total6574 / totalPop * 100, 2);
              var ageAbove75Pct = number.round(totalAbove75 / totalPop * 100, 2);

              ageChart.addSeries('PopulationSplit', [{
                y: ageUnder18Pct,
                tooltip: ageUnder18Pct,
                text: "Under 18"
              }, {
                y: age1824Pct,
                tooltip: age1824Pct,
                text: "18 - 24"
              }, {
                y: age2534Pct,
                tooltip: age2534Pct,
                text: "25 - 34"
              }, {
                y: age3544Pct,
                tooltip: age3544Pct,
                text: "35 - 44"
              }, {
                y: age4554Pct,
                tooltip: age4554Pct,
                text: "45 - 54"
              }, {
                y: age5564Pct,
                tooltip: age5564Pct,
                text: "55 - 64"
              }, {
                y: age6574Pct,
                tooltip: age6574Pct,
                text: "65 - 74"
              }, {
                y: ageAbove75Pct,
                tooltip: ageAbove75Pct,
                text: "Above 75"
              }]);

              // Highlight the chart and display tooltips when the cursor is over a slice.
              new Highlight(ageChart, 'default');
              new Tooltip(ageChart, 'default');
              new MoveSlice(ageChart, 'default');

              // Set the chart as the pane content
              ageContentPane.set('content', ageChart.node);

              // ********************************************************************
              // Create the chart for demographics by age
              var c = domConstruct.create("div", {
                id: 'age_pie_chart'
              }, domConstruct.create("div"));
              var eduChart = new Chart2D(c);
              domClass.add(eduChart, 'chart');

              // Apply a theme to the chart
              eduChart.setTheme(dojoxTheme);
              eduChart.addPlot('default', {
                type: 'Pie',
                radius: 70,
                htmlLabels: true
              });

              tabContainer.watch('selectedChildWidget', function(name, oldVal, newVal) {
                if ( newVal.title === "Education" ) {
                  eduChart.resize(180, 180);
                }
              });

              // Calculate percentages
              var noHSPct = number.round(totalNoHS / total2564 * 100, 2);
              var HSPct = number.round(totalHS / total2564 * 100, 2);
              var someCollegePct = number.round(totalSomeCollege / total2564 * 100, 2);
              var associatesPct = number.round(totalAssociates / total2564 * 100, 2);
              var bachelorsPct = number.round(totalBachelors / total2564 * 100, 2);
              var postGradPct = number.round(totalPostGrad / total2564 * 100, 2);

              eduChart.addSeries('PopulationSplit', [{
                y: noHSPct,
                tooltip: noHSPct,
                text: "No high school"
              }, {
                y: HSPct,
                tooltip: HSPct,
                text: "High school"
              }, {
                y: someCollegePct,
                tooltip: someCollegePct,
                text: "Some college"
              }, {
                y: associatesPct,
                tooltip: associatesPct,
                text: "Associate's"
              }, {
                y: bachelorsPct,
                tooltip: bachelorsPct,
                text: "Bachelor's"
              }, {
                y: postGradPct,
                tooltip: postGradPct,
                text: "Post graduate"
              }]);

              // Highlight the chart and display tooltips when the cursor is over a slice.
              new Highlight(eduChart, 'default');
              new Tooltip(eduChart, 'default');
              new MoveSlice(eduChart, 'default');

              // Set the chart as the pane content
              eduContentPane.set('content', eduChart.node);

              // ********************************************************************
              // Create the chart for businesses by NAICS sector
              var c = domConstruct.create("div", {
                id: 'bus_pie_chart'
              }, domConstruct.create("div"));
              var busChart = new Chart2D(c);
              domClass.add(busChart, 'chart');

              // Apply a theme to the chart
              busChart.setTheme(dojoxTheme);
              busChart.addPlot('default', {
                type: 'Pie',
                radius: 70,
                htmlLabels: true
              });

              tabContainer.watch('selectedChildWidget', function(name, oldVal, newVal) {
                if ( newVal.title === "Business" ) {
                  busChart.resize(180, 180);
                }
              });

              // Calculate percentages
              var bus11Pct = number.round(totalBus11 / totalBus * 100, 2);
              var bus21Pct = number.round(totalBus21 / totalBus * 100, 2);
              var bus22Pct = number.round(totalBus22 / totalBus * 100, 2);
              var bus23Pct = number.round(totalBus23 / totalBus * 100, 2);
              var bus3133Pct = number.round(totalBus3133 / totalBus * 100, 2);
              var bus42Pct = number.round(totalBus42 / totalBus * 100, 2);
              var bus4445Pct = number.round(totalBus4445 / totalBus * 100, 2);
              var bus4849Pct = number.round(totalBus4849 / totalBus * 100, 2);
              var bus51Pct = number.round(totalBus51 / totalBus * 100, 2);
              var bus52Pct = number.round(totalBus52 / totalBus * 100, 2);
              var bus53Pct = number.round(totalBus53 / totalBus * 100, 2);
              var bus54Pct = number.round(totalBus54 / totalBus * 100, 2);
              var bus55Pct = number.round(totalBus55 / totalBus * 100, 2);
              var bus56Pct = number.round(totalBus56 / totalBus * 100, 2);
              var bus61Pct = number.round(totalBus61 / totalBus * 100, 2);
              var bus62Pct = number.round(totalBus62 / totalBus * 100, 2);
              var bus71Pct = number.round(totalBus71 / totalBus * 100, 2);
              var bus72Pct = number.round(totalBus72 / totalBus * 100, 2);
              var bus81Pct = number.round(totalBus81 / totalBus * 100, 2);
              var busOthersPct = 100 - (bus11Pct + bus21Pct + bus22Pct + bus23Pct + bus3133Pct + bus42Pct + bus4445Pct + bus4849Pct + bus51Pct + bus52Pct + bus53Pct + bus54Pct + bus55Pct + bus56Pct + bus61Pct + bus62Pct + bus71Pct + bus72Pct + bus81Pct);

              busChart.addSeries('PopulationSplit', [{
                y: bus11Pct,
                tooltip: bus11Pct,
                text: "11"
              }, {
                y: bus21Pct,
                tooltip: bus21Pct,
                text: "21"
              }, {
                y: bus22Pct,
                tooltip: bus22Pct,
                text: "22"
              }, {
                y: bus23Pct,
                tooltip: bus23Pct,
                text: "23"
              }, {
                y: bus3133Pct,
                tooltip: bus3133Pct,
                text: "31 - 33"
              }, {
                y: bus42Pct,
                tooltip: bus42Pct,
                text: "42"
              }, {
                y: bus4445Pct,
                tooltip: bus4445Pct,
                text: "44 - 45"
              }, {
                y: bus4849Pct,
                tooltip: bus4849Pct,
                text: "48 - 49"
              }, {
                y: bus51Pct,
                tooltip: bus51Pct,
                text: "51"
              }, {
                y: bus52Pct,
                tooltip: bus52Pct,
                text: "52"
              }, {
                y: bus53Pct,
                tooltip: bus53Pct,
                text: "53"
              }, {
                y: bus54Pct,
                tooltip: bus54Pct,
                text: "54"
              }, {
                y: bus55Pct,
                tooltip: bus55Pct,
                text: "55"
              }, {
                y: bus56Pct,
                tooltip: bus56Pct,
                text: "56"
              }, {
                y: bus61Pct,
                tooltip: bus61Pct,
                text: "61"
              }, {
                y: bus62Pct,
                tooltip: bus62Pct,
                text: "62"
              }, {
                y: bus71Pct,
                tooltip: bus71Pct,
                text: "71"
              }, {
                y: bus72Pct,
                tooltip: bus72Pct,
                text: "72"
              }, {
                y: bus81Pct,
                tooltip: bus81Pct,
                text: "81"
              }, {
                y: busOthersPct,
                tooltip: busOthersPct,
                text: "Others"
              }]);

              // Highlight the chart and display tooltips when the cursor is over a slice.
              new Highlight(busChart, 'default');
              new Tooltip(busChart, 'default');
              new MoveSlice(busChart, 'default');

              // Set the chart as the pane content
              busContentPane.set('content', busChart.node);

              // ********************************************************************
              // Create the chart for employees by NAICS sector
              var c = domConstruct.create("div", {
                id: 'emp_pie_chart'
              }, domConstruct.create("div"));
              var empChart = new Chart2D(c);
              domClass.add(empChart, 'chart');

              // Apply a theme to the chart
              empChart.setTheme(dojoxTheme);
              empChart.addPlot('default', {
                type: 'Pie',
                radius: 70,
                htmlLabels: true
              });

              tabContainer.watch('selectedChildWidget', function(name, oldVal, newVal) {
                if ( newVal.title === "Employee" ) {
                  empChart.resize(180, 180);
                }
              });

              // Calculate percentages
              var emp11Pct = number.round(totalEmp11 / totalEmp * 100, 2);
              var emp21Pct = number.round(totalEmp21 / totalEmp * 100, 2);
              var emp22Pct = number.round(totalEmp22 / totalEmp * 100, 2);
              var emp23Pct = number.round(totalEmp23 / totalEmp * 100, 2);
              var emp3133Pct = number.round(totalEmp3133 / totalEmp * 100, 2);
              var emp42Pct = number.round(totalEmp42 / totalEmp * 100, 2);
              var emp4445Pct = number.round(totalEmp4445 / totalEmp * 100, 2);
              var emp4849Pct = number.round(totalEmp4849 / totalEmp * 100, 2);
              var emp51Pct = number.round(totalEmp51 / totalEmp * 100, 2);
              var emp52Pct = number.round(totalEmp52 / totalEmp * 100, 2);
              var emp53Pct = number.round(totalEmp53 / totalEmp * 100, 2);
              var emp54Pct = number.round(totalEmp54 / totalEmp * 100, 2);
              var emp55Pct = number.round(totalEmp55 / totalEmp * 100, 2);
              var emp56Pct = number.round(totalEmp56 / totalEmp * 100, 2);
              var emp61Pct = number.round(totalEmp61 / totalEmp * 100, 2);
              var emp62Pct = number.round(totalEmp62 / totalEmp * 100, 2);
              var emp71Pct = number.round(totalEmp71 / totalEmp * 100, 2);
              var emp72Pct = number.round(totalEmp72 / totalEmp * 100, 2);
              var emp81Pct = number.round(totalEmp81 / totalEmp * 100, 2);
              var empOthersPct = 100 - (emp11Pct + emp21Pct + emp22Pct + emp23Pct + emp3133Pct + emp42Pct + emp4445Pct + emp4849Pct + emp51Pct + emp52Pct + emp53Pct + emp54Pct + emp55Pct + emp56Pct + emp61Pct + emp62Pct + emp71Pct + emp72Pct + emp81Pct);

              empChart.addSeries('PopulationSplit', [{
                y: emp11Pct,
                tooltip: emp11Pct,
                text: "11"
              }, {
                y: emp21Pct,
                tooltip: emp21Pct,
                text: "21"
              }, {
                y: emp22Pct,
                tooltip: emp22Pct,
                text: "22"
              }, {
                y: emp23Pct,
                tooltip: emp23Pct,
                text: "23"
              }, {
                y: emp3133Pct,
                tooltip: emp3133Pct,
                text: "31 - 33"
              }, {
                y: emp42Pct,
                tooltip: emp42Pct,
                text: "42"
              }, {
                y: emp4445Pct,
                tooltip: emp4445Pct,
                text: "44 - 45"
              }, {
                y: emp4849Pct,
                tooltip: emp4849Pct,
                text: "48 - 49"
              }, {
                y: emp51Pct,
                tooltip: emp51Pct,
                text: "51"
              }, {
                y: emp52Pct,
                tooltip: emp52Pct,
                text: "52"
              }, {
                y: emp53Pct,
                tooltip: emp53Pct,
                text: "53"
              }, {
                y: emp54Pct,
                tooltip: emp54Pct,
                text: "54"
              }, {
                y: emp55Pct,
                tooltip: emp55Pct,
                text: "55"
              }, {
                y: emp56Pct,
                tooltip: emp56Pct,
                text: "56"
              }, {
                y: emp61Pct,
                tooltip: emp61Pct,
                text: "61"
              }, {
                y: emp62Pct,
                tooltip: emp62Pct,
                text: "62"
              }, {
                y: emp71Pct,
                tooltip: emp71Pct,
                text: "71"
              }, {
                y: emp72Pct,
                tooltip: emp72Pct,
                text: "72"
              }, {
                y: emp81Pct,
                tooltip: emp81Pct,
                text: "81"
              }, {
                y: empOthersPct,
                tooltip: empOthersPct,
                text: "Others"
              }]);

              // Highlight the chart and display tooltips when the cursor is over a slice.
              new Highlight(empChart, 'default');
              new Tooltip(empChart, 'default');
              new MoveSlice(empChart, 'default');

              // Set the chart as the pane content
              empContentPane.set('content', empChart.node);

              return tabContainer.domNode;
            });

            globalGraphic.setInfoTemplate(infoTemplate);
          },

          initStats: function() { // Initialize the summary counts
            totalAEL = 0;
            totalExoffender = 0;
            totalETPS = 0;
            totalParole = 0;
            totalReentry = 0;
            totalCO = 0;
            totalVR = 0;
            totalLibrary = 0;
            totalJobAd = 0;

            totalPop = 0;
            totalFemale = 0;
            totalMale = 0;
            totalUnder18 = 0;
            total1824 = 0;
            total2534 = 0;
            total3544 = 0;
            total4554 = 0;
            total5564 = 0;
            total6574 = 0;
            totalAbove75 = 0;
            totalNoEnglish = 0;
            total2564 = 0;
            totalNoHS = 0;
            totalHS = 0;
            totalSomeCollege = 0;
            totalAssociates = 0;
            totalBachelors = 0;
            totalPostGrad = 0;
            totalDisabled = 0;
            totalVeteran = 0;
            totalUnemployed = 0;
            totalPoverty = 0;
            totalPubAssist = 0;
            totalDisconnYouth = 0;
            
            totalBus = 0;
            totalBusCO = 0;
            totalBusIO = 0;
            totalBus11 = 0;
            totalBus21 = 0;
            totalBus22 = 0;
            totalBus23 = 0;
            totalBus3133 = 0;
            totalBus42 = 0;
            totalBus4445 = 0;
            totalBus4849 = 0;
            totalBus51 = 0;
            totalBus52 = 0;
            totalBus53 = 0;
            totalBus54 = 0;
            totalBus55 = 0;
            totalBus56 = 0;
            totalBus61 = 0;
            totalBus62 = 0;
            totalBus71 = 0;
            totalBus72 = 0;
            totalBus81 = 0;
            totalEmp = 0;
            totalEmpCO = 0;
            totalEmpIO = 0;
            totalEmp11 = 0;
            totalEmp21 = 0;
            totalEmp22 = 0;
            totalEmp23 = 0;
            totalEmp3133 = 0;
            totalEmp42 = 0;
            totalEmp4445 = 0;
            totalEmp4849 = 0;
            totalEmp51 = 0;
            totalEmp52 = 0;
            totalEmp53 = 0;
            totalEmp54 = 0;
            totalEmp55 = 0;
            totalEmp56 = 0;
            totalEmp61 = 0;
            totalEmp62 = 0;
            totalEmp71 = 0;
            totalEmp72 = 0;
            totalEmp81 = 0;
          },

          onShowResultsClick: function() { // Close the Query Geometry widget and open the Query Results widget
            if (!domClass.contains(this.showResultsBtn, 'jimu-state-disabled')) {
              var pm = PanelManager.getInstance();
              pm.closePanel(pm.activePanel);
              pm.showPanel(this.appConfig.widgetOnScreen.widgets[6]);
            }
          },

          onOpen: function(){
            // Reset tab item's width after the Query Results widget has been opened
            var tabItems = document.getElementsByClassName("tab-item");
            for (i = 0; i < tabItems.length; i++) {
              tabItems[i].style.width = '33.33%';
            }

            console.log('onOpen');
          },

          onClose: function(){
            domClass.add(this.showResultsBtn, 'jimu-state-disabled'); // Re-disable the Show Results button

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
