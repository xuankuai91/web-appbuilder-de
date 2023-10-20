### Use Intro.js to Create a Widget Tour Widget in ArcGIS Web AppBuilder (Developer Edition)

1. Download the Intro.js library containing a JavaScript file and a CSS file:
   - *intro.min.js*
   - *introjs.min.css*
   
   Then create a folder named "introjs" to host them.
1. Move the folder containing the library to the *server\apps\[app number]\libs* folder in the ArcGIS Web AppBuilder (Developer Edition) installation on local drive.
1. Add the following two elements to the ```resources.concat([]);``` function in init.js under the *server\apps\[app number]* in the ArcGIS Web AppBuilder (Developer Edition) installation on local drive:
   ```
   window.path + 'libs/introjs/intro.min.js',
   window.path + 'libs/introjs/introjs.min.css'
   ```
   Remember to add a comma before these two lines of code.
1. In the interactive web app editing page of ArcGIS Web AppBuilder (Developer Edition), right click on the widget(s) to be included in widget tour and select *Inspect* to open the browser's developer tool that shows the webpage's HTML.
   ![image](https://github.com/xuankuai91/web-appbuilder-de/assets/22385797/ff7ff89c-c6df-425c-9fd0-07a3acd95c9d)
1. In the HTML view, navigate to the upper-most level of ```<div>``` that houses the widget and copy its ```id```.
   ![Copy_ID](https://github.com/xuankuai91/web-appbuilder-de/assets/22385797/98713fed-950e-4934-a3d1-355a1812e61b)
1. Add the *Widget Tour* widget and click *OK* to the *Configure Widget Tour* dialog.
   ![Add_Widget](https://github.com/xuankuai91/web-appbuilder-de/assets/22385797/a867f0b9-1bf7-43d6-8055-f6b318eaca29)
1. Edit the app title if needed. Then select the widgets to be included in widget tour from the *Select widget* dropdown to populate the widget table below, and paste the ```id``` copied above under *Widget Identifier*. Add necessary instruction texts under *Widget Instruction*, and edit widget names if needed under *Widget Name*. Then click *OK* to finish configuration and add widget to app.
   ![image](https://github.com/xuankuai91/web-appbuilder-de/assets/22385797/a4df3bf8-c262-4c7e-b5c4-bb155ce8f7d6)
1. Fire up the *Widget Tour* widget and test. Make changes if necessary.
   ![Test_Widget](https://github.com/xuankuai91/web-appbuilder-de/assets/22385797/5dd4e828-a8ab-4414-94aa-c264802dd6c4)
