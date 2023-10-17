define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/dom',
  'dojo/dom-class',
  'dojo/on',
  'dojo/text!./templates/CityCouncilSD.html',
  'esri/Color',
  'esri/graphic',
  'esri/graphicsUtils',
  'esri/layers/FeatureLayer',
  'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/tasks/query',
  'jimu/BaseWidget',
  'jimu/dijit/Message',
  'jimu/PanelManager',
  'dojo/domReady!'
  ],
  function(
    declare,
    lang,
    dom,
    domClass,
    on,
    cityCouncilSDTemplate,
    Color,
    Graphic,
    GraphicsUtils,
    FeatureLayer,
    SimpleFillSymbol,
    SimpleLineSymbol,
    Query,
    BaseWidget,
    Message,
    PanelManager
    ) {
        // Define the global variables of district geometries
        var usCongressGeometry = null;
        var txSenateGeometry = null;
        var txHouseGeometry = null;
        var countyJudgeGeometry = null;
        var countyCommGeometry = null;
        var cityMayorGeometry = null;
        var cityCouncilGeometry = null;
        var schoolDistGeometry = null;
        var trusteeDistGeometry = null;

        var currentLayerID = null;

        // Define the global variables of page numbers
        var cityCouncilALPageTotal = 0;
        var cityCouncilALPageCurrent = 1;

        var schoolDistALPageTotal = 0;
        var schoolDistALPageCurrent = 1;

        // Define the array for exporting a spreadsheet of elected officials
        var rows = [
          ["Elected Official", "District", "Name", "Term", "Webpage\n"],
          ["U.S. Senator", "U.S. Senate", "Ted Cruz", "1/3/2025", "https://www.cruz.senate.gov/\n"],
          ["U.S. Senator", "U.S. Senate", "John Cornyn", "1/3/2027", "https://www.cornyn.senate.gov/\n"]
        ];

        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
          // Custom Widget code goes here

          //please note that this property is be set by the framework when widget is loaded.
          //templateString: template,

          baseClass: 'jimu-widget-queryElectedofficials',
            
          name: 'QueryElectedOfficials',

          templateString: cityCouncilSDTemplate,

          postCreate: function() {
            this.inherited(arguments);
            on(this.tabView, "click", lang.hitch(this, this.toggleLayer)); // DO NOT directly use arguments in event handler (it will run without a triggered event), use .bind() instead

            console.log('postCreate');
          },

          startup: function() {
            this.inherited(arguments);
            // this.mapIdNode.innerHTML = 'map id:' + this.map.id;

            console.log('startup');
          },

          switchToFedTab: function() { // Switch to Federal tab
            domClass.remove(this.stateTabItem, 'selected');
            domClass.remove(this.stateTabView, 'selected');
            domClass.remove(this.countyTabItem, 'selected');
            domClass.remove(this.countyTabView, 'selected');
            domClass.remove(this.cityTabItem, 'selected');
            domClass.remove(this.cityTabView, 'selected');
            domClass.remove(this.othersTabItem, 'selected');
            domClass.remove(this.othersTabView, 'selected');
            domClass.add(this.fedTabItem, 'selected');
            domClass.add(this.fedTabView, 'selected');
          },

          switchToStateTab: function() { // Switch to State tab
            domClass.remove(this.fedTabItem, 'selected');
            domClass.remove(this.fedTabView, 'selected');
            domClass.remove(this.countyTabItem, 'selected');
            domClass.remove(this.countyTabView, 'selected');
            domClass.remove(this.cityTabItem, 'selected');
            domClass.remove(this.cityTabView, 'selected');
            domClass.remove(this.othersTabItem, 'selected');
            domClass.remove(this.othersTabView, 'selected');
            domClass.add(this.stateTabItem, 'selected');
            domClass.add(this.stateTabView, 'selected');
          },

          switchToCountyTab: function() { // Switch to County tab
            domClass.remove(this.fedTabItem, 'selected');
            domClass.remove(this.fedTabView, 'selected');
            domClass.remove(this.stateTabItem, 'selected');
            domClass.remove(this.stateTabView, 'selected');
            domClass.remove(this.cityTabItem, 'selected');
            domClass.remove(this.cityTabView, 'selected');
            domClass.remove(this.othersTabItem, 'selected');
            domClass.remove(this.othersTabView, 'selected');
            domClass.add(this.countyTabItem, 'selected');
            domClass.add(this.countyTabView, 'selected');
          },

          switchToCityTab: function() { // Switch to City tab
            domClass.remove(this.fedTabItem, 'selected');
            domClass.remove(this.fedTabView, 'selected');
            domClass.remove(this.stateTabItem, 'selected');
            domClass.remove(this.stateTabView, 'selected');
            domClass.remove(this.countyTabItem, 'selected');
            domClass.remove(this.countyTabView, 'selected');
            domClass.remove(this.othersTabItem, 'selected');
            domClass.remove(this.othersTabView, 'selected');
            domClass.add(this.cityTabItem, 'selected');
            domClass.add(this.cityTabView, 'selected');
          },

          switchToOthersTab: function() { // Switch to Others tab
            domClass.remove(this.fedTabItem, 'selected');
            domClass.remove(this.fedTabView, 'selected');
            domClass.remove(this.stateTabItem, 'selected');
            domClass.remove(this.stateTabView, 'selected');
            domClass.remove(this.countyTabItem, 'selected');
            domClass.remove(this.countyTabView, 'selected');
            domClass.remove(this.cityTabItem, 'selected');
            domClass.remove(this.cityTabView, 'selected');
            domClass.add(this.othersTabItem, 'selected');
            domClass.add(this.othersTabView, 'selected');
          },

          onTabHeaderClick: function(event) { // Switch tabs based on click event
            var target = event.target || event.srcElement;

            if (target === this.fedTabItem) {
              this.switchToFedTab();
            } else if (target === this.stateTabItem) {
              this.switchToStateTab();
            } else if (target === this.countyTabItem) {
              this.switchToCountyTab();
            } else if (target === this.cityTabItem) {
              this.switchToCityTab();
            } else if (target === this.othersTabItem) {
              this.switchToOthersTab();
            }
          },

          modifyURL: function(url) { // Add HTTP prefix to unsecured URL
            if (url) {
              if (url.substring(0, 8) != "https://") {
                url = "http://" + url
                return url;
              } else {
                return url;
              }
            }
          },

          queryUSCongress: function(query) { // Query elected US Congressperson
            this.layer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Open_Data/Boundaries/MapServer/14", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            this.layer.queryFeatures(query, lang.hitch(this, function(result) {
              var feature = result.features[0];
              usCongressGeometry = feature.geometry;

              var district = feature.attributes["DISTRICT"];
              var name = feature.attributes["REPRESENTATIVE"];
              var website = this.modifyURL(feature.attributes["WEBSITE"]);

              this.usCongressRepDist.innerHTML += district;
              this.usCongressRepName.innerHTML += name;
              this.usCongressRepLink.href = website;

              rows.push(["U.S. Congress Representative", "U.S Congressional District " + district, name, "1/3/2023", website + "\n"]);
            }));
          },

          queryTXSenate: function(query) { // Query elected Texas State Senator
            this.layer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Open_Data/Boundaries/MapServer/13", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            this.layer.queryFeatures(query, lang.hitch(this, function(result) {
              var feature = result.features[0];
              txSenateGeometry = feature.geometry;

              var district = feature.attributes["DISTRICT"];
              var name = feature.attributes["REPRESENTATIVE"];
              var webpage = this.modifyURL(feature.attributes["WEBPAGE"]);

              this.txSenatorDist.innerHTML += district;
              this.txSenatorName.innerHTML += name;
              this.txSenatorLink.href = webpage;

              rows.push(["Texas Senator", "Texas Senate District " + district, name, "1/9/2023", webpage + "\n"]);
            }));
          },

          queryTXHouse: function(query) { // Query elected Texas House Representative
            this.layer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Open_Data/Boundaries/MapServer/12", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            this.layer.queryFeatures(query, lang.hitch(this, function(result) {
              var feature = result.features[0];
              txHouseGeometry = feature.geometry;

              var district = feature.attributes["DISTRICT"];
              var name = feature.attributes["REPRESENTATIVE"];
              var webpage = this.modifyURL(feature.attributes["WEBPAGE"]);

              this.txHouseRepDist.innerHTML += district;
              this.txHouseRepName.innerHTML += name;
              this.txHouseRepLink.href = webpage;

              rows.push(["Texas House Representative", "Texas House District " + district, name, "1/9/2023", webpage + "\n"]);
            }));
          },

          queryCountyJudge: function(query) { // Query elected county judge
            this.layer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Open_Data/Boundaries/MapServer/4", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            this.layer.queryFeatures(query, lang.hitch(this, function(result) {
              var feature = result.features[0];
              countyJudgeGeometry = feature.geometry;

              var county = feature.attributes["NAME"];
              var judge = feature.attributes["JUDGE"];
              var webpage = this.modifyURL(feature.attributes["WEBPAGE"]);

              var date = new Date(feature.attributes["TERM"] + 21600000);
              var month = date.getMonth() + 1;
              var day = date.getDate();
              var year = date.getFullYear();
              var term = month + "/" + day + "/" + year

              this.countyJudgeCounty.innerHTML += county;
              this.countyJudgeName.innerHTML += judge;
              this.countyJudgeTerm.innerHTML += term;
              this.countyJudgeLink.href = webpage;

              rows.push(["County Judge", county, judge, term, webpage + "\n"]);
            }));
          },

          queryCountyComm: function(query) { // Query elected county commissioners
            this.layer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Open_Data/Boundaries/MapServer/1", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            this.layer.queryFeatures(query, lang.hitch(this, function(result) {
              var feature = result.features[0];
              countyCommGeometry = feature.geometry;

              var county = feature.attributes["County"];
              var precinct = feature.attributes["Precinct"];
              var commissioner = feature.attributes["Commission"];
              var webpage = this.modifyURL(feature.attributes["WEBPAGE"]);

              var date = new Date(feature.attributes["TERM"] + 21600000);
              var month = date.getMonth() + 1;
              var day = date.getDate();
              var year = date.getFullYear();
              var term = month + "/" + day + "/" + year

              this.countyCommCounty.innerHTML += county;
              this.countyCommPrecinct.innerHTML += precinct;
              this.countyCommName.innerHTML += commissioner;
              this.countyCommTerm.innerHTML += term;
              this.countyCommLink.href = webpage;

              rows.push(["County Commissioner", county + " County District " + precinct, commissioner, term, webpage + "\n"]);
            }));
          },

          queryCityMayor: function(query) { // Query elected city mayor
            this.layer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Open_Data/Boundaries/MapServer/0", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            query.where = "CLASSFP = 'C1'";

            this.layer.queryFeatures(query, lang.hitch(this, function(result) {
              var feature = result.features[0];

              if (feature) {
                cityMayorGeometry = feature.geometry;

                var city = feature.attributes["NAME"];
                var mayor = feature.attributes["MAYOR"];
                var webpage = this.modifyURL(feature.attributes["WEBPAGE"]);

                var date = new Date(feature.attributes["TERM"] + 21600000);
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var year = date.getFullYear();
                var term = month + "/" + day + "/" + year

                this.cityMayorCity.innerHTML += city;
                this.cityMayorToggle.disabled = false;
                this.cityMayorName.innerHTML += mayor;
                this.cityMayorTerm.innerHTML += term;
                this.cityMayorLink.href = webpage;
                this.cityMayorLink.style.pointerEvents = 'auto';

                this.cityCouncilCity.innerHTML += city;

                rows.push(["City Mayor", "City of " + city, mayor, term, webpage + "\n"]);
              } else {
                this.cityMayorCity.innerHTML += "Location not within any city";
                this.cityMayorToggle.disabled = true;
                this.cityMayorName.innerHTML += "Location not within any city";
                this.cityMayorTerm.innerHTML += "Location not within any city";
                this.cityMayorLink.style.pointerEvents = 'none';

                this.cityCouncilCity.innerHTML += "Location not within any city";
              }
            }));

            query.where = null;
          },

          queryCityCouncilSD: function(query) { // Query elected city council member representing a city council district
            this.layer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Open_Data/Boundaries/MapServer/15", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            this.layer.queryFeatures(query, lang.hitch(this, function(result) {
              var feature = result.features[0];

              if (feature) {
                cityCouncilGeometry = feature.geometry;

                var city = feature.attributes["CITY"];
                var district = feature.attributes["DISTRICT"];
                var member = feature.attributes["MEMBER"];
                var webpage = this.modifyURL(feature.attributes["WEBPAGE"]);

                var date = new Date(feature.attributes["TERM"] + 21600000);
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var year = date.getFullYear();
                var term = month + "/" + day + "/" + year

                this.cityCouncilSD.style.display = 'block';

                this.cityCouncilSDDist.innerHTML += district;
                this.cityCouncilSDName.innerHTML += member;
                this.cityCouncilSDTerm.innerHTML += term;
                this.cityCouncilSDLink.href = webpage;

                rows.push(["City Council Member (Single District)", "City of " + city + " Distcit " + district, member, term, webpage + "\n"]);
              }
            }));
          },

          queryCityCouncilAL: function(query) { // Query elected city council members representing city at-large
            this.layer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Open_Data/Boundaries/MapServer/0", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            query.where = "CLASSFP = 'C1'";

            this.layer.queryFeatures(query, lang.hitch(this, function(result) {
              var feature = result.features[0];

              if (feature) {
                if (feature.attributes["ATLARGE1"]) {
                  this.cityCouncilAL.innerHTML += "<h5 class='jimu-widget-note'>At-Large<sup>(<span style=\"cursor:pointer;text-decoration:underline\" title=\"Representing the entire city\">?</span>)</sup> Members</h5>";

                  for (var i = 1; i < 8; i++) {
                    var member = feature.attributes["ATLARGE" + i.toString()];

                    if (member) {
                      var webpage = this.modifyURL(feature.attributes["WEBPAGE" + i.toString()]);

                      var date = new Date(feature.attributes["TERM" + i.toString()] + 21600000);
                      var month = date.getMonth() + 1;
                      var day = date.getDate();
                      var year = date.getFullYear();
                      var term = month + "/" + day + "/" + year

                      this.cityCouncilAL.innerHTML += "<div id='cityCouncilAL" + i.toString() + "' class='at-large-info'></div>";
                      document.getElementById("cityCouncilAL" + i.toString()).innerHTML += "<p class='jimu-widget' id='cityCouncilAL" + i.toString() + "Name'>Name: </p>";
                      document.getElementById("cityCouncilAL" + i.toString()).innerHTML += "<p class='jimu-widget' id='cityCouncilAL" + i.toString() + "Term'>Term: </p>";
                      document.getElementById("cityCouncilAL" + i.toString()).innerHTML += "<p class='jimu-widget'>More information: <a id='cityCouncilAL" + i.toString() + "Link' target='_blank'>Click here</a></p>"

                      document.getElementById("cityCouncilAL" + i.toString() + "Name").innerHTML += member;
                      document.getElementById("cityCouncilAL" + i.toString() + "Term").innerHTML += term;
                      document.getElementById("cityCouncilAL" + i.toString() + "Link").href = webpage;

                      var city = feature.attributes["NAME"];
                      rows.push(["City Council Member (At-Large)", "City of " + city, member, term, webpage + "\n"]);

                      cityCouncilALPageTotal = i;
                    }
                  }

                  domClass.add(document.getElementById("cityCouncilAL1"), 'selected');

                  this.cityCouncilPageControl.style.display = 'block';
                  this.cityCouncilTotalPage.innerHTML = cityCouncilALPageTotal.toString();
                }
              }
            }));

            query.where = null;
          },

          querySchoolDistSD: function(query) { // Query elected school district trustee representing a trustee district
            this.layer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Open_Data/Boundaries/MapServer/17", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            this.layer.queryFeatures(query, lang.hitch(this, function(result) {
              var feature = result.features[0];

              if (feature) {
                trusteeDistGeometry = feature.geometry;

                var isd = feature.attributes["ISD"];
                var district = feature.attributes["DISTRICT"];
                var trustee = feature.attributes["TRUSTEE"];
                var webpage = this.modifyURL(feature.attributes["WEBPAGE"]);

                var date = new Date(feature.attributes["TERM"] + 21600000);
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var year = date.getFullYear();
                var term = month + "/" + day + "/" + year

                this.schoolDistSD.style.display = 'block';

                this.schoolDistSDDist.innerHTML += district;
                this.schoolDistSDName.innerHTML += trustee;
                this.schoolDistSDTerm.innerHTML += term;
                this.schoolDistSDLink.href = webpage;

                rows.push(["School District Trustee (Single District)", isd + " District " + district, trustee, term, webpage + "\n"]);
              }
            }));
          },

          querySchoolDistAL: function(query) { // Query elected school district trustee representing school district at-large
            this.layer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Open_Data/Boundaries/MapServer/16", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            this.layer.queryFeatures(query, lang.hitch(this, function(result) {
              var feature = result.features[0];

              if (feature) {
                schoolDistGeometry = feature.geometry;

                var district = feature.attributes["NAME"];
                this.schoolDist.innerHTML += district;

                if (feature.attributes["TRUSTEE1"]) {
                  this.schoolDistAL.innerHTML += "<h5 class='jimu-widget-note'>At-Large<sup>(<span style=\"cursor:pointer;text-decoration:underline\" title=\"Representing the entire school district\">?</span>)</sup> Members</h5>";

                  for (var i = 1; i < 10; i++) {
                    var trustee = feature.attributes["TRUSTEE" + i.toString()];
                    var webpage = this.modifyURL(feature.attributes["WEBPAGE" + i.toString()]);

                    var date = new Date(feature.attributes["TERM" + i.toString()] + 21600000);
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var year = date.getFullYear();
                    var term = month + "/" + day + "/" + year

                    if (trustee) {
                      this.schoolDistAL.innerHTML += "<div id='schoolDistAL" + i.toString() + "' class='at-large-info'></div>";
                      document.getElementById("schoolDistAL" + i.toString()).innerHTML += "<p class='jimu-widget' id='schoolDistAL" + i.toString() + "Name'>Name: </p>";
                      document.getElementById("schoolDistAL" + i.toString()).innerHTML += "<p class='jimu-widget' id='schoolDistAL" + i.toString() + "Term'>Term: </p>";
                      document.getElementById("schoolDistAL" + i.toString()).innerHTML += "<p class='jimu-widget'>More information: <a id='schoolDistAL" + i.toString() + "Link' target='_blank'>Click here</a></p>"

                      document.getElementById("schoolDistAL" + i.toString() + "Name").innerHTML += trustee;
                      document.getElementById("schoolDistAL" + i.toString() + "Term").innerHTML += term;
                      document.getElementById("schoolDistAL" + i.toString() + "Link").href = webpage;

                      rows.push(["School Board Trustee (At-Large)", district, trustee, term, webpage + "\n"]);

                      schoolDistALPageTotal = i;
                    }
                  }

                  domClass.add(document.getElementById("schoolDistAL1"), 'selected');

                  this.schoolDistPageControl.style.display = 'block';
                  this.schoolDistTotalPage.innerHTML = schoolDistALPageTotal.toString();
                }
              }
            }));
          },

          queryElectedOfficials: function() { // Run all queries
            geometry = this.map.graphics.graphics[1].geometry;

            var query = new Query();
            query.geometry = geometry;

            this.layer = new FeatureLayer("https://gis.h-gac.com/arcgis/rest/services/Open_Data/Boundaries/MapServer/5", {
              mode: FeatureLayer.MODE_ONDEMAND,
              outFields: ["*"]
            });

            this.layer.selectFeatures(query, FeatureLayer.SELECTION_NEW);
            this.layer.on("selection-complete", lang.hitch(this, function() {
              if (this.layer.getSelectedFeatures().length) {
                this.queryUSCongress(query);
                rows.push(["Governer", "State of Texas", "Greg Abbot", "1/17/2023", "https://gov.texas.gov/\n"]);
                this.queryTXSenate(query);
                this.queryTXHouse(query);
                this.queryCountyComm(query);
                this.queryCountyJudge(query);
                this.queryCityMayor(query);
                this.queryCityCouncilSD(query);
                this.queryCityCouncilAL(query);
                this.querySchoolDistSD(query);
                this.querySchoolDistAL(query);
              } else {
                var pm = PanelManager.getInstance();
                pm.closePanel(pm.panels[0]);

                new Message({
                  message: "Please query inside the region!"
                });
              }
            }));
          },

          drawLayer: function(layerID) { // Draw boundaries
            currentLayerID = layerID;
            document.getElementById(layerID).innerText = "Hide boundary";

            var geometryDict = {
              "usCongressRepToggle": usCongressGeometry,
              "txSenatorToggle": txSenateGeometry,
              "txHouseRepToggle": txHouseGeometry,
              "countyJudgeToggle": countyJudgeGeometry,
              "countyCommToggle": countyCommGeometry,
              "cityMayorToggle": cityMayorGeometry,
              "cityCouncilToggle": cityCouncilGeometry,
              "schoolDistToggle": schoolDistGeometry,
              "trusteeDistToggle": trusteeDistGeometry
            };

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

            var graphic = new Graphic(geometryDict[layerID], fillSymbol);

            this.map.graphics.add(graphic);
            this.map.setExtent(GraphicsUtils.graphicsExtent([graphic]), true);
          },

          toggleLayer: function(event) { // Toogle boundaries when Show boundary button is clicked
            if (event.target.className === "toggle-button") {
              var layerID = event.target.id;

              var currentLayer = this.map.graphics.graphics[2];
              if (currentLayer) {
                document.getElementById(currentLayerID).innerText = "Show boundary";
                this.map.graphics.remove(currentLayer);

                if (layerID !== currentLayerID) {
                  this.drawLayer(layerID);
                }
              } else {
                this.drawLayer(layerID);
              }
            }
          },

          onCityCouncilPrevPageClick: function() { // Show previous city council member
            domClass.remove(document.getElementById("cityCouncilAL" + cityCouncilALPageCurrent.toString()), 'selected');

            if (cityCouncilALPageCurrent >= 1 && cityCouncilALPageCurrent <= cityCouncilALPageTotal) {
              cityCouncilALPageCurrent -= 1;

              this.cityCouncilCurrentPage.innerHTML = cityCouncilALPageCurrent.toString();
              domClass.add(document.getElementById("cityCouncilAL" + cityCouncilALPageCurrent.toString()), 'selected');
            }

            if (cityCouncilALPageCurrent === 1) {
              this.cityCouncilPrevPage.disabled = true;
            }

            if (cityCouncilALPageCurrent < cityCouncilALPageTotal) {
              this.cityCouncilNextPage.disabled = false;
            }
          },

          onCityCouncilNextPageClick: function() { // Show next city council member
            domClass.remove(document.getElementById("cityCouncilAL" + cityCouncilALPageCurrent.toString()), 'selected');

            if (cityCouncilALPageCurrent <= cityCouncilALPageTotal) {
              cityCouncilALPageCurrent += 1;

              this.cityCouncilCurrentPage.innerHTML = cityCouncilALPageCurrent.toString();
              domClass.add(document.getElementById("cityCouncilAL" + cityCouncilALPageCurrent.toString()), 'selected');
            }

            if (cityCouncilALPageCurrent > 1) {
              this.cityCouncilPrevPage.disabled = false;
            }

            if (cityCouncilALPageCurrent === cityCouncilALPageTotal) {
              this.cityCouncilNextPage.disabled = true;
            }
          },

          onSchoolDistPrevPageClick: function() { // Show previous school district trustee
            domClass.remove(document.getElementById("schoolDistAL" + schoolDistALPageCurrent.toString()), 'selected');

            if (schoolDistALPageCurrent >= 1 && schoolDistALPageCurrent <= schoolDistALPageTotal) {
              schoolDistALPageCurrent -= 1;

              this.schoolDistCurrentPage.innerHTML = schoolDistALPageCurrent.toString();
              domClass.add(document.getElementById("schoolDistAL" + schoolDistALPageCurrent.toString()), 'selected');
            }

            if (schoolDistALPageCurrent === 1) {
              this.schoolDistPrevPage.disabled = true;
            }

            if (schoolDistALPageCurrent < schoolDistALPageTotal) {
              this.schoolDistNextPage.disabled = false;
            }
          },

          onSchoolDistNextPageClick: function() { // Show next school district trustee
            domClass.remove(document.getElementById("schoolDistAL" + schoolDistALPageCurrent.toString()), 'selected');

            if (schoolDistALPageCurrent <= schoolDistALPageTotal) {
              schoolDistALPageCurrent += 1;

              this.schoolDistCurrentPage.innerHTML = schoolDistALPageCurrent.toString();
              domClass.add(document.getElementById("schoolDistAL" + schoolDistALPageCurrent.toString()), 'selected');
            }

            if (schoolDistALPageCurrent > 1) {
              this.schoolDistPrevPage.disabled = false;
            }

            if (schoolDistALPageCurrent === schoolDistALPageTotal) {
              this.schoolDistNextPage.disabled = true;
            }
          },

          onExportClick: function() { // Export queried elected officials to a CSV spreadsheet
            var file = "officials.csv";
            var blob = new Blob(rows, { type: 'text/csv;charset=UFT-8;' });
            var link = document.createElement('a');

            if (link.download !== undefined) {
              var url = URL.createObjectURL(blob);

              link.setAttribute('href', url);
              link.setAttribute('download', file);
              link.style.visibility = 'hidden';

              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          },

          onOpen: function() { // Force close panel and show reminder if no address is selected
            if (this.map.graphics.graphics.length === 1) {
              var pm = PanelManager.getInstance();
              pm.closePanel(pm.panels[0]);

              new Message({
                message: "Please search an address first!"
              });
            } else {
              this.queryElectedOfficials();
            }

            console.log('onOpen');
          },

          onClose: function() { // Clear all graphics and information when panel is closed
            if (this.map.graphics.graphics.length === 2) {
              this.map.graphics.remove(this.map.graphics.graphics[1]);
            } else if (this.map.graphics.graphics.length === 3) {
              this.map.graphics.remove(this.map.graphics.graphics[2]);
            }

            this.switchToFedTab();
            if (currentLayerID) {
              document.getElementById(currentLayerID).innerText = "Show boundary";
            }

            this.usCongressRepDist.innerHTML = "District: ";
            this.usCongressRepName.innerHTML = "Name: ";
            this.usCongressRepLink.href = null;

            this.txSenatorDist.innerHTML = "District: ";
            this.txSenatorName.innerHTML = "Name: ";
            this.txSenatorLink.href = null;

            this.txHouseRepDist.innerHTML = "District: ";
            this.txHouseRepName.innerHTML = "Name: ";
            this.txHouseRepLink.href = null;

            this.countyJudgeCounty.innerHTML = "County: ";
            this.countyJudgeName.innerHTML = "Name: ";
            this.countyJudgeTerm.innerHTML = "Term: ";
            this.countyJudgeLink.href = null;

            this.countyCommCounty.innerHTML = "County: ";
            this.countyCommPrecinct.innerHTML = "Precinct: "
            this.countyCommName.innerHTML = "Name: ";
            this.countyCommTerm.innerHTML = "Term: ";
            this.countyCommLink.href = null;

            this.cityMayorCity.innerHTML = "City: ";
            this.cityMayorName.innerHTML = "Name: ";
            this.cityMayorTerm.innerHTML = "Term: ";
            this.cityMayorLink.href = null;

            this.cityCouncilCity.innerHTML = "City: ";

            this.cityCouncilSDDist.innerHTML = "District: "
            this.cityCouncilSDName.innerHTML = "Name: ";
            this.cityCouncilSDTerm.innerHTML = "Term: ";
            this.cityCouncilSDLink.href = null;

            this.cityCouncilAL.innerHTML = "";

            cityCouncilALPageTotal = 0;
            cityCouncilALPageCurrent = 1;
            this.cityCouncilCurrentPage.innerHTML = "1";
            this.cityCouncilPrevPage.disabled = true;
            this.cityCouncilNextPage.disabled = false;

            this.schoolDist.innerHTML = "School District: ";

            this.schoolDistAL.innerHTML = "";

            schoolDistALPageTotal = 0;
            schoolDistALPageCurrent = 1;
            this.schoolDistCurrentPage.innerHTML = "1";
            this.schoolDistPrevPage.disabled = true;
            this.schoolDistNextPage.disabled = false;

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