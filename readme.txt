Description:
=============
dialogchangemanager.js monitors for changes in input controls contained within an element (elementId) in initialize. Once the 
initialize has been called, all input controls contained within the element provided are monitored for changes.

Currently Implemented and Supported Controls:
"text"
"textarea"
"email"
"number"
"range"
"url"
"password"
"checkbox"
"radio"
"select-one"

Basic Use:
=============
See Demo.html. Double click to open the file. (An internet connection is required for JQuery CDN).

1. Add any values to the input controls to add default values or leave them empty. Emulate data when dialog loads.
2. Click on "Open Dialog" to emulate opening a dialog with default values.
3. Click on "Any Changes?". You should see an alert that says no changes. 
4. Make changes to elements.
5. Click on "Any Changes?". You should see an alert that says there were changes made. 
6. Click on "Get Changes". A list will show you all the changes that were made. Including before and after changes.
7. Click on reset. This should reset all controls to their defaults to before any changes were made.

Todo:
=============
<N/A>
 
Unit Tests
=============
See dialogchangemanager.test.js on how to use dialogchangemanager.js. Open QunitTests.html to run the tests. Unit testing has 
been created using JQuery QUnit found here http://qunitjs.com/.