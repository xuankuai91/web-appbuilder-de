define([
  'dijit/_WidgetsInTemplateMixin', // Allow use of dijit
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/dom',
  'dojo/dom-construct',
  'dojo/on',
  'jimu/BaseWidgetSetting'
  ], function(
    _WidgetsInTemplateMixin,
    declare,
    lang,
    dom,
    domConstruct,
    on,
    BaseWidgetSetting
  ) {
      var appName = "";
      var widgetList = [];
      var widgetCount = 0;

      return declare([BaseWidgetSetting], {
        baseClass: 'jimu-widget-demo-setting',

        postCreate: function() {
          //the config object is passed in
          this.setConfig();
        },

        moveWidget: function(widgetNumber, direction) { // Edit id and value for elements inside the tr of the widget to be moved or deleted
          dom.byId("widget_" + widgetNumber.toString()).id = "widget_" + (widgetNumber - direction).toString(); // Edit id for tr

          // Edit value and id for step number
          dom.byId("widget_" + widgetNumber.toString() + "_step").value = widgetNumber - direction; // Edit step number
          dom.byId("widget_" + widgetNumber.toString() + "_step").id = "widget_" + (widgetNumber - direction).toString() + "_step"; // Edit id for step input

          // Edit ids for id, name and introduction input
          dom.byId("widget_" + widgetNumber.toString() + "_id").id = "widget_" + (widgetNumber - direction).toString() + "_id";
          dom.byId("widget_" + widgetNumber.toString() + "_name").id = "widget_" + (widgetNumber - direction).toString() + "_name";
          dom.byId("widget_" + widgetNumber.toString() + "_intro").id = "widget_" + (widgetNumber - direction).toString() + "_intro";

          // Edit value and id for delete button
          dom.byId("widget_" + widgetNumber.toString() + "_delete").value = widgetNumber - direction;
          dom.byId("widget_" + widgetNumber.toString() + "_delete").id = "widget_" + (widgetNumber - direction).toString() + "_delete";
        },

        writeWidgetTableRow: function(widgetNumber) { // Construct table row and write step number, widget ID and intro
          var tr = domConstruct.create('tr', { id: "widget_" + widgetNumber.toString() }, this.widgetList); // Construct an empty tr with id: widget_x

          // Construct a td with an input inside to hold step number with id: widget_x_step
          var tdStep = domConstruct.create('td', { class: 'step'}, tr);
          domConstruct.create('input', {
            id: "widget_" + widgetNumber.toString() + "_step",
            value: widgetNumber
          }, tdStep);

          // Construct a td with an input inside to hold widget identifier with id: widget_x_id
          var widgetID = this.config.widgetList[widgetNumber - 1].id;
          var tdWidgetID = domConstruct.create('td', { class: 'widget-id' }, tr);
          domConstruct.create('input', {
            id: "widget_" + widgetNumber.toString() + "_id",
            value: widgetID
          }, tdWidgetID);

          // Construct a td with an input inside to hold widget name with id: widget_x_name
          var widgetName = this.config.widgetList[widgetNumber - 1].name;
          var tdWidgetName = domConstruct.create('td', { class: 'widget-name' }, tr);
          domConstruct.create('input', {
            id: "widget_" + widgetNumber.toString() + "_name",
            value: widgetName
          }, tdWidgetName);

          // Construct a td with an input inside to hold widget introduction with id: widget_x_intro
          var widgetIntro = this.config.widgetList[widgetNumber - 1].intro;
          var tdWidgetIntro = domConstruct.create('td', { class: 'widget-intro' }, tr);
          domConstruct.create('input', {
            id: "widget_" + widgetNumber.toString() + "_intro",
            value: widgetIntro
          }, tdWidgetIntro);
          
          // Construct a td with three buttons to modify widget table
          var tdActions = domConstruct.create('td', { class: 'actions' }, tr);

          // Construct a button to delete widget
          domConstruct.create('button', {
            id: "widget_" + widgetNumber.toString() + "_delete",
            value: widgetNumber,
            innerHTML: "Delete",
            onclick: lang.hitch(this, function(evt) {
              var widgetStep = evt.target.value;
              domConstruct.destroy("widget_" + widgetStep); // Remove the tr of the widget to be deleted

              // Move following widgets up a step
              for (var i = parseInt(widgetStep) + 1; i <= widgetCount; i++) {
                this.moveWidget(i, 1);
              }

              widgetCount--; // Update widget count
              this.config.widgetList.splice(parseInt(widgetStep) - 1, 1); // Update widget list in widget's config.json
            })
          }, tdActions);
        },

        setConfig: function() { // Initialize widget settings dialog
          // Get app ID number and use the app ID number to get app's config.json
          var rootURL = window.location.origin;
          var appID = window.location.href.slice(-1);
          var jsonURL = "/webappbuilder/apps/" + appID + "/config.json";

          // Collect all widgets added to app
          dojo.xhrGet({
            url: jsonURL,
            handleAs: 'json',
            load: function(obj) {
              appName = obj.title;

              for (var i = 0; i < obj.widgetOnScreen.widgets.length; i++) {
                widgetList.push({
                  "id": obj.widgetOnScreen.widgets[i].id,
                  "name": obj.widgetOnScreen.widgets[i].name
                });
              }

              for (var i = 0; i < obj.widgetPool.widgets.length; i++) {
                widgetList.push({
                  "id": obj.widgetPool.widgets[i].id,
                  "name": obj.widgetPool.widgets[i].name
                });
              }
            }
          });

          setTimeout(lang.hitch(this, function() {
            this.appNameText.value = appName; // Auto-fill app name

            // Compile widget identifier and name to create dropdown
            for (var i = 0; i < widgetList.length; i++) {
              if (widgetList[i].name) {
                var widgetID = widgetList[i].id;
                var widgetName = widgetList[i].name;

                for (var j = 0; j < widgetList[i].name.length; j++) {
                  if (j != 0 && widgetList[i].name[j].match(/[A-Z]/)) {
                    widgetName = [widgetList[i].name.slice(0, j), widgetList[i].name.slice(j)].join(" ");
                  }
                }

                var opt = {
                  value: widgetID,
                  innerHTML: widgetName
                };

                domConstruct.create('option', opt, this.widgetSelection);
              }
            }
          }), 250);

          for (var i = 1; i <= this.config.widgetList.length; i++) {
            this.writeWidgetTableRow(i);
          }
        },

        getConfig: function() { // Write to widget's config.json
          this.config.appNameText = this.appNameText.value; // Write app name
          this.config.widgetCount = widgetCount; // Write widget count
          
          // Write widget introduction text
          for (var i = 0; i < widgetCount; i++) {
            this.config.widgetList[i].step = dom.byId("widget_" + (i + 1).toString() + "_step").value;
            this.config.widgetList[i].id = dom.byId("widget_" + (i + 1).toString() + "_id").value;
            this.config.widgetList[i].name = dom.byId("widget_" + (i + 1).toString() + "_name").value;
            this.config.widgetList[i].intro = dom.byId("widget_" + (i + 1).toString() + "_intro").value;
          }

          return this.config;
        },

        onWidgetSelect: function() { // Construct a table row to hold widget info when a widget is selected from dropdown
          widgetCount++; // Update widget count

          // Write widget step, identifier, name, and introduction text
          this.config.widgetList.push({
            'step': widgetCount,
            'id': this.widgetSelection.value,
            'name': this.widgetSelection.options[this.widgetSelection.selectedIndex].innerHTML,
            'intro': ""
          })

          this.writeWidgetTableRow(widgetCount);
          console.log(document.querySelector('[widgetid="widgets_ZoomSlider_Widget_15"]'));
        }
      });
});