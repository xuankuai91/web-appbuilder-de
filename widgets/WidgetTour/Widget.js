define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'jimu/BaseWidget',
    'jimu/WidgetManager'
  ], function(
    declare,
    lang,
    BaseWidget,
    WidgetManager
    ) {
        return declare([BaseWidget], {
          baseClass: 'widget-widget-tour',

          name: 'WidgetTour',

          isOpening: false,

          onOpen: function(){
            if(!this.isOpening){
              this.isOpening = true;

              this.initIntro();
              
              setTimeout(lang.hitch(this, function(){
                this.isOpening = false;
                WidgetManager.getInstance().closeWidget(this);
              }), 250);
            }
          },

          initIntro: function(){
            //Display the initial step in the center of the screen since there isn't an element associated with it
            var steps = [{
              intro: "Welcome to the <b>" + this.config.appNameText + "</b> application!<br><br>Here is a quick guide to how to use this web app.<br><br>Click the \"x\" to skip this gude at any time."
            }];

            for (var i = 0; i < this.config.widgetCount; i++) {
              steps.push({
                element: document.querySelector("#" + this.config.widgetList[i].id),
                title: this.config.widgetList[i].name,
                intro: this.config.widgetList[i].intro,
                position: 'bottom'
              });
            }

            introJs().setOptions({
              steps: steps
            }).start();
          }
        });
  });
