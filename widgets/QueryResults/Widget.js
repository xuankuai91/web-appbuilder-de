define([
  'dojo/_base/declare',
  'dojo/dom',
  'dojo/dom-class',
  'jimu/BaseWidget',
  'dojo/domReady!'
  ],
  function(
    declare,
    dom,
    domClass,
    BaseWidget
    ) {
        //To create a widget, you need to derive from BaseWidget.
        return declare([BaseWidget], {
          // Custom Widget code goes here

          //please note that this property is be set by the framework when widget is loaded.
          //templateString: template,

          baseClass: 'jimu-widget-queryresults',
            
          name: 'QueryResults',

          postCreate: function() {
            this.inherited(arguments);
            console.log('postCreate');
          },

          startup: function() {
            this.inherited(arguments);
            // this.mapIdNode.innerHTML = 'map id:' + this.map.id;
            
            this.fetchDataByName('QueryGeometry');

            console.log('startup');
          },

          onReceiveData: function(name, widgetID, data) {
            this.initStats();

            // Create HTML <p> elements that resides in the <th> elements
            var totalAELText = "<p>" + data.aelData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalExoffenderText = "<p>" + data.exoffenderData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalETPSText = "<p>" + data.etpsData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalParoleText = "<p>" + data.paroleData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalReentryText = "<p>" + data.reentryData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalCOText = "<p>" + data.coData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalVRText = "<p>" + data.vrData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalLibraryText = "<p>" + data.libraryData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalJobAdText = "<p>" + data.jobAdData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";

            var totalPopText = "<p>" + data.popData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalFemaleText = "<p>" + data.femaleData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalMaleText = "<p>" + data.maleData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalUnder18Text = "<p>" + data.under18Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var total1824Text = "<p>" + data._1824Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var total2534Text = "<p>" + data._2534Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var total3544Text = "<p>" + data._3544Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var total4554Text = "<p>" + data._4554Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var total5564Text = "<p>" + data._5564Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var total6574Text = "<p>" + data._6574Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalAbove75Text = "<p>" + data.above75Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalNoEnglishText = "<p>" + data.noEnglishData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalNoHSText = "<p>" + data.noHSData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalHSText = "<p>" + data.hsData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalSomeCollegeText = "<p>" + data.someCollegeData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalAssociatesText = "<p>" + data.associatesData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBachelorsText = "<p>" + data.bachelorsData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalPostGradText = "<p>" + data.postGradData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalDisabledText = "<p>" + data.disabledData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalVeteranText = "<p>" + data.veteranData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalUnemployedText = "<p>" + data.unemployedData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalPovertyText = "<p>" + data.povertyData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalPubAssistText = "<p>" + data.pubAssistData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalDisconnYouthText = "<p>" + data.disconnYouthData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            
            var totalBusText = "<p>" + data.busData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBusCOText = "<p>" + data.busCOData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBusIOText = "<p>" + data.busIOData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus11Text = "<p>" + data.bus11Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus21Text = "<p>" + data.bus21Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus22Text = "<p>" + data.bus22Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus23Text = "<p>" + data.bus23Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus3133Text = "<p>" + data.bus3133Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus42Text = "<p>" + data.bus42Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus4445Text = "<p>" + data.bus4445Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus4849Text = "<p>" + data.bus4849Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus51Text = "<p>" + data.bus51Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus52Text = "<p>" + data.bus52Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus53Text = "<p>" + data.bus53Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus54Text = "<p>" + data.bus54Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus55Text = "<p>" + data.bus55Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus56Text = "<p>" + data.bus56Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus61Text = "<p>" + data.bus61Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus62Text = "<p>" + data.bus62Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus71Text = "<p>" + data.bus71Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus72Text = "<p>" + data.bus72Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalBus81Text = "<p>" + data.bus81Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmpText = "<p>" + data.empData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmpCOText = "<p>" + data.empCOData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmpIOText = "<p>" + data.empIOData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp11Text = "<p>" + data.emp11Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp21Text = "<p>" + data.emp21Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp22Text = "<p>" + data.emp22Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp23Text = "<p>" + data.emp23Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp3133Text = "<p>" + data.emp3133Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp42Text = "<p>" + data.emp42Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp4445Text = "<p>" + data.emp4445Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp4849Text = "<p>" + data.emp4849Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp51Text = "<p>" + data.emp51Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp52Text = "<p>" + data.emp52Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp53Text = "<p>" + data.emp53Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp54Text = "<p>" + data.emp54Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp55Text = "<p>" + data.emp55Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp56Text = "<p>" + data.emp56Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp61Text = "<p>" + data.emp61Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp62Text = "<p>" + data.emp62Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp71Text = "<p>" + data.emp71Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp72Text = "<p>" + data.emp72Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";
            var totalEmp81Text = "<p>" + data.emp81Data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</p>";

            // Push <p> elements to the <th> elements
            dom.byId("total_ael").innerHTML = totalAELText;
            dom.byId("total_exoffender").innerHTML = totalExoffenderText;
            dom.byId("total_etps").innerHTML = totalETPSText;
            dom.byId("total_parole").innerHTML = totalParoleText;
            dom.byId("total_reentry").innerHTML = totalReentryText;
            dom.byId("total_co").innerHTML = totalCOText;
            dom.byId("total_vr").innerHTML = totalVRText;
            dom.byId("total_library").innerHTML = totalLibraryText;
            dom.byId("total_job_ad").innerHTML = totalJobAdText;

            dom.byId("total_pop").innerHTML = totalPopText;
            dom.byId("total_female").innerHTML = totalFemaleText;
            dom.byId("total_male").innerHTML = totalMaleText;
            dom.byId("total_under_18").innerHTML = totalUnder18Text;
            dom.byId("total_18_24").innerHTML = total1824Text;
            dom.byId("total_25_34").innerHTML = total2534Text;
            dom.byId("total_35_44").innerHTML = total3544Text;
            dom.byId("total_45_54").innerHTML = total4554Text;
            dom.byId("total_55_64").innerHTML = total5564Text;
            dom.byId("total_65_74").innerHTML = total6574Text;
            dom.byId("total_above_75").innerHTML = totalAbove75Text;
            dom.byId("total_no_english").innerHTML = totalNoEnglishText;
            dom.byId("total_no_hs").innerHTML = totalNoHSText;
            dom.byId("total_hs").innerHTML = totalHSText;
            dom.byId("total_some_college").innerHTML = totalSomeCollegeText;
            dom.byId("total_associates").innerHTML = totalAssociatesText;
            dom.byId("total_bachelors").innerHTML = totalBachelorsText;
            dom.byId("total_post_grad").innerHTML = totalPostGradText;
            dom.byId("total_disabled").innerHTML = totalDisabledText;
            dom.byId("total_veteran").innerHTML = totalVeteranText;
            dom.byId("total_unemployed").innerHTML = totalUnemployedText;
            dom.byId("total_poverty").innerHTML = totalPovertyText;
            dom.byId("total_pub_assist").innerHTML = totalPubAssistText;
            dom.byId("total_disconn_youth").innerHTML = totalDisconnYouthText;

            dom.byId("total_bus").innerHTML = totalBusText;
            dom.byId("total_bus_co").innerHTML = totalBusCOText;
            dom.byId("total_bus_io").innerHTML = totalBusIOText;
            dom.byId("total_bus_11").innerHTML = totalBus11Text;
            dom.byId("total_bus_21").innerHTML = totalBus21Text;
            dom.byId("total_bus_22").innerHTML = totalBus22Text;
            dom.byId("total_bus_23").innerHTML = totalBus23Text;
            dom.byId("total_bus_31_33").innerHTML = totalBus3133Text;
            dom.byId("total_bus_42").innerHTML = totalBus42Text;
            dom.byId("total_bus_44_45").innerHTML = totalBus4445Text;
            dom.byId("total_bus_48_49").innerHTML = totalBus4849Text;
            dom.byId("total_bus_51").innerHTML = totalBus51Text;
            dom.byId("total_bus_52").innerHTML = totalBus52Text;
            dom.byId("total_bus_53").innerHTML = totalBus53Text;
            dom.byId("total_bus_54").innerHTML = totalBus54Text;
            dom.byId("total_bus_55").innerHTML = totalBus55Text;
            dom.byId("total_bus_56").innerHTML = totalBus56Text;
            dom.byId("total_bus_61").innerHTML = totalBus61Text;
            dom.byId("total_bus_62").innerHTML = totalBus62Text;
            dom.byId("total_bus_71").innerHTML = totalBus71Text;
            dom.byId("total_bus_72").innerHTML = totalBus72Text;
            dom.byId("total_bus_81").innerHTML = totalBus81Text;
            dom.byId("total_emp").innerHTML = totalEmpText;
            dom.byId("total_emp_co").innerHTML = totalEmpCOText;
            dom.byId("total_emp_io").innerHTML = totalEmpIOText;
            dom.byId("total_emp_11").innerHTML = totalEmp11Text;
            dom.byId("total_emp_21").innerHTML = totalEmp21Text;
            dom.byId("total_emp_22").innerHTML = totalEmp22Text;
            dom.byId("total_emp_23").innerHTML = totalEmp23Text;
            dom.byId("total_emp_31_33").innerHTML = totalEmp3133Text;
            dom.byId("total_emp_42").innerHTML = totalEmp42Text;
            dom.byId("total_emp_44_45").innerHTML = totalEmp4445Text;
            dom.byId("total_emp_48_49").innerHTML = totalEmp4849Text;
            dom.byId("total_emp_51").innerHTML = totalEmp51Text;
            dom.byId("total_emp_52").innerHTML = totalEmp52Text;
            dom.byId("total_emp_53").innerHTML = totalEmp53Text;
            dom.byId("total_emp_54").innerHTML = totalEmp54Text;
            dom.byId("total_emp_55").innerHTML = totalEmp55Text;
            dom.byId("total_emp_56").innerHTML = totalEmp56Text;
            dom.byId("total_emp_61").innerHTML = totalEmp61Text;
            dom.byId("total_emp_62").innerHTML = totalEmp62Text;
            dom.byId("total_emp_71").innerHTML = totalEmp71Text;
            dom.byId("total_emp_72").innerHTML = totalEmp72Text;
            dom.byId("total_emp_81").innerHTML = totalEmp81Text;

            console.log('onReceiveData');
          },

          initStats: function() { // Initialize the summary counts
            totalAELText = null;
            totalExoffenderText = null;
            totalETPSText = null;
            totalParoleText = null;
            totalReentryText = null;
            totalCOText = null;
            totalVRText = null;
            totalLibraryText = null;
            totalJobAdText = null;

            totalPopText = null;
            totalFemaleText = null;
            totalMaleText = null;
            totalUnder18Text = null;
            total1824Text = null;
            total2534Text = null;
            total3544Text = null;
            total4554Text = null;
            total5564Text = null;
            total6574Text = null;
            totalAbove75Text = null;
            totalNoEnglishText = null;
            total2564Text = null;
            totalNoHSText = null;
            totalHSText = null;
            totalSomeCollegeText = null;
            totalAssociatesText = null;
            totalBachelorsText = null;
            totalPostGradText = null;
            totalDisabledText = null;
            totalVeteranText = null;
            totalUnemployedText = null;
            totalPovertyText = null;
            totalPubAssistText = null;
            totalDisconnYouthText = null;
            
            totalBusText = null;
            totalBusCOText = null;
            totalBusIOText = null;
            totalBus11Text = null;
            totalBus21Text = null;
            totalBus22Text = null;
            totalBus23Text = null;
            totalBus3133Text = null;
            totalBus42Text = null;
            totalBus4445Text = null;
            totalBus4849Text = null;
            totalBus51Text = null;
            totalBus52Text = null;
            totalBus53Text = null;
            totalBus54Text = null;
            totalBus55Text = null;
            totalBus56Text = null;
            totalBus61Text = null;
            totalBus62Text = null;
            totalBus71Text = null;
            totalBus72Text = null;
            totalBus81Text = null;
            totalEmpText = null;
            totalEmpCOText = null;
            totalEmpIOText = null;
            totalEmp11Text = null;
            totalEmp21Text = null;
            totalEmp22Text = null;
            totalEmp23Text = null;
            totalEmp3133Text = null;
            totalEmp42Text = null;
            totalEmp4445Text = null;
            totalEmp4849Text = null;
            totalEmp51Text = null;
            totalEmp52Text = null;
            totalEmp53Text = null;
            totalEmp54Text = null;
            totalEmp55Text = null;
            totalEmp56Text = null;
            totalEmp61Text = null;
            totalEmp62Text = null;
            totalEmp71Text = null;
            totalEmp72Text = null;
            totalEmp81Text = null;
          },

          onTabHeaderClick: function(event) { // Switch tabs based on click event
            var target = event.target || event.srcElement;
            if (target === this.resourceTabItem) {
              this.switchToSearchTab();
            } else if (target === this.demoTabItem) {
              this.switchToDemoTab();
            } else if (target === this.specialTabItem) {
              this.switchToSpecialTab();
            } else {
              this.switchToEmpTab();
            }
          },

          switchToSearchTab: function() { // Switch to Search tab
            domClass.remove(this.demoTabItem, 'selected');
            domClass.remove(this.demoTabView, 'selected');
            domClass.remove(this.specialTabItem, 'selected');
            domClass.remove(this.specialTabView, 'selected');
            domClass.remove(this.empTabItem, 'selected');
            domClass.remove(this.empTabView, 'selected');
            domClass.add(this.resourceTabItem, 'selected');
            domClass.add(this.resourceTabView, 'selected');
          },

          switchToDemoTab: function() { // Switch to Demographics tab
            domClass.remove(this.resourceTabItem, 'selected');
            domClass.remove(this.resourceTabView, 'selected');
            domClass.remove(this.specialTabItem, 'selected');
            domClass.remove(this.specialTabView, 'selected');
            domClass.remove(this.empTabItem, 'selected');
            domClass.remove(this.empTabView, 'selected');
            domClass.add(this.demoTabItem, 'selected');
            domClass.add(this.demoTabView, 'selected');
          },

          switchToSpecialTab: function() { // Switch to Specials tab
            domClass.remove(this.resourceTabItem, 'selected');
            domClass.remove(this.resourceTabView, 'selected');
            domClass.remove(this.demoTabItem, 'selected');
            domClass.remove(this.demoTabView, 'selected');
            domClass.remove(this.empTabItem, 'selected');
            domClass.remove(this.empTabView, 'selected');
            domClass.add(this.specialTabItem, 'selected');
            domClass.add(this.specialTabView, 'selected');
          },

          switchToEmpTab: function() { // Switch to Employments tab
            domClass.remove(this.resourceTabItem, 'selected');
            domClass.remove(this.resourceTabView, 'selected');
            domClass.remove(this.demoTabItem, 'selected');
            domClass.remove(this.demoTabView, 'selected');
            domClass.remove(this.specialTabItem, 'selected');
            domClass.remove(this.specialTabView, 'selected');
            domClass.add(this.empTabItem, 'selected');
            domClass.add(this.empTabView, 'selected');
          },

          onResExportClick: function() { // Export data to CSV file
            var fileName = "resources.xls";
            var dataType = 'application/vnd.ms-excel';
            var tableHTML = document.getElementById("resource_table").outerHTML.replace(/ /g, '%20');

            var downloadLink = document.createElement("a");
            document.body.appendChild(downloadLink);

            if (navigator.msSaveOrOpenBlob) {
              var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
              });

              navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
              downloadLink.href = 'data:' + dataType + ', ' + tableHTML; // Create a link to the file
              downloadLink.download = fileName; // Setting the file name
              downloadLink.click(); // Triggering the function
            }
          },

          onDemoExportClick: function() { // Export data to CSV file
            var fileName = "demographics.xls";
            var dataType = 'application/vnd.ms-excel';
            var tableHTML = document.getElementById("demo_table").outerHTML.replace(/ /g, '%20');

            var downloadLink = document.createElement("a");
            document.body.appendChild(downloadLink);

            if (navigator.msSaveOrOpenBlob) {
              var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
              });

              navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
              downloadLink.href = 'data:' + dataType + ', ' + tableHTML; // Create a link to the file
              downloadLink.download = fileName; // Setting the file name
              downloadLink.click(); // Triggering the function
            }
          },

          onSpecialExportClick: function() { // Export data to CSV file
            var fileName = "specials.xls";
            var dataType = 'application/vnd.ms-excel';
            var tableHTML = document.getElementById("special_table").outerHTML.replace(/ /g, '%20');

            var downloadLink = document.createElement("a");
            document.body.appendChild(downloadLink);

            if (navigator.msSaveOrOpenBlob) {
              var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
              });

              navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
              downloadLink.href = 'data:' + dataType + ', ' + tableHTML; // Create a link to the file
              downloadLink.download = fileName; // Setting the file name
              downloadLink.click(); // Triggering the function
            }
          },

          onEmpExportClick: function() { // Export data to CSV file
            var fileName = "employments.xls";
            var dataType = 'application/vnd.ms-excel';
            var tableHTML = document.getElementById("emp_table").outerHTML.replace(/ /g, '%20');

            var downloadLink = document.createElement("a");
            document.body.appendChild(downloadLink);

            if (navigator.msSaveOrOpenBlob) {
              var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
              });

              navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
              downloadLink.href = 'data:' + dataType + ', ' + tableHTML; // Create a link to the file
              downloadLink.download = fileName; // Setting the file name
              downloadLink.click(); // Triggering the function
            }
          },

          onClearResultsClick: function() { // Clear geometry, popup and results
            dom.byId("total_ael").innerHTML = null;
            dom.byId("total_exoffender").innerHTML = null;
            dom.byId("total_etps").innerHTML = null;
            dom.byId("total_parole").innerHTML = null;
            dom.byId("total_reentry").innerHTML = null;
            dom.byId("total_co").innerHTML = null;
            dom.byId("total_vr").innerHTML = null;
            dom.byId("total_library").innerHTML = null;
            dom.byId("total_job_ad").innerHTML = null;

            dom.byId("total_pop").innerHTML = null;
            dom.byId("total_female").innerHTML = null;
            dom.byId("total_male").innerHTML = null;
            dom.byId("total_under_18").innerHTML = null;
            dom.byId("total_18_24").innerHTML = null;
            dom.byId("total_25_34").innerHTML = null;
            dom.byId("total_35_44").innerHTML = null;
            dom.byId("total_45_54").innerHTML = null;
            dom.byId("total_55_64").innerHTML = null;
            dom.byId("total_65_74").innerHTML = null;
            dom.byId("total_above_75").innerHTML = null;
            dom.byId("total_no_english").innerHTML = null;
            dom.byId("total_no_hs").innerHTML = null;
            dom.byId("total_hs").innerHTML = null;
            dom.byId("total_some_college").innerHTML = null;
            dom.byId("total_associates").innerHTML = null;
            dom.byId("total_bachelors").innerHTML = null;
            dom.byId("total_post_grad").innerHTML = null;
            dom.byId("total_disabled").innerHTML = null;
            dom.byId("total_veteran").innerHTML = null;
            dom.byId("total_unemployed").innerHTML = null;
            dom.byId("total_poverty").innerHTML = null;
            dom.byId("total_pub_assist").innerHTML = null;
            dom.byId("total_disconn_youth").innerHTML = null;

            dom.byId("total_bus").innerHTML = null;
            dom.byId("total_bus_co").innerHTML = null;
            dom.byId("total_bus_io").innerHTML = null;
            dom.byId("total_bus_11").innerHTML = null;
            dom.byId("total_bus_21").innerHTML = null;
            dom.byId("total_bus_22").innerHTML = null;
            dom.byId("total_bus_23").innerHTML = null;
            dom.byId("total_bus_31_33").innerHTML = null;
            dom.byId("total_bus_42").innerHTML = null;
            dom.byId("total_bus_44_45").innerHTML = null;
            dom.byId("total_bus_48_49").innerHTML = null;
            dom.byId("total_bus_51").innerHTML = null;
            dom.byId("total_bus_52").innerHTML = null;
            dom.byId("total_bus_53").innerHTML = null;
            dom.byId("total_bus_54").innerHTML = null;
            dom.byId("total_bus_55").innerHTML = null;
            dom.byId("total_bus_56").innerHTML = null;
            dom.byId("total_bus_61").innerHTML = null;
            dom.byId("total_bus_62").innerHTML = null;
            dom.byId("total_bus_71").innerHTML = null;
            dom.byId("total_bus_72").innerHTML = null;
            dom.byId("total_bus_81").innerHTML = null;
            dom.byId("total_emp").innerHTML = null;
            dom.byId("total_emp_co").innerHTML = null;
            dom.byId("total_emp_io").innerHTML = null;
            dom.byId("total_emp_11").innerHTML = null;
            dom.byId("total_emp_21").innerHTML = null;
            dom.byId("total_emp_22").innerHTML = null;
            dom.byId("total_emp_23").innerHTML = null;
            dom.byId("total_emp_31_33").innerHTML = null;
            dom.byId("total_emp_42").innerHTML = null;
            dom.byId("total_emp_44_45").innerHTML = null;
            dom.byId("total_emp_48_49").innerHTML = null;
            dom.byId("total_emp_51").innerHTML = null;
            dom.byId("total_emp_52").innerHTML = null;
            dom.byId("total_emp_53").innerHTML = null;
            dom.byId("total_emp_54").innerHTML = null;
            dom.byId("total_emp_55").innerHTML = null;
            dom.byId("total_emp_56").innerHTML = null;
            dom.byId("total_emp_61").innerHTML = null;
            dom.byId("total_emp_62").innerHTML = null;
            dom.byId("total_emp_71").innerHTML = null;
            dom.byId("total_emp_72").innerHTML = null;
            dom.byId("total_emp_81").innerHTML = null;

            this.map.graphics.clear();
            this.map.infoWindow.clearFeatures();
          },

          onOpen: function(){
            // Reset tab item's width after the Query Geometry widget has been opened
            var tabItems = document.getElementsByClassName("tab-item");
            for (i = 0; i < tabItems.length; i++) {
              tabItems[i].style.width = '25%';
            }

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