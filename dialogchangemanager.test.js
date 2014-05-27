module("DialogChangeManager", {
	setup: function() {
		// Initializer for test cases here:
		this.changeManager = new dialogChangeManager();
	},
	teardown: function() {
		// Code to execute after each test here:
	}
});

/* CHANGES */
test("Check for Changes", function () {
    var isDirty = null;

    isDirty = this.changeManager.isDirty();
    equal(isDirty, false, "Check for changes when NOT initialized.");

    this.changeManager.initialize("container");
    isDirty = this.changeManager.isDirty();
    equal(isDirty, false, "Check for changes when initialized and nothing changed.");

    // Check for changes in NUMBER input control.
    var numberElement = document.getElementById("num-text");
    isDirty = this.changeManager.isDirty();
    equal(isDirty, false, "Number input element before change.");

    changeInputElementValue(numberElement, 1);
    
    isDirty = this.changeManager.isDirty();
    equal(isDirty, true, "Number input element changed and change detected.");
    this.changeManager.reset();

    // Check for changes in SELECT element.
    var titleElement = document.getElementById("sel-title");
    isDirty = this.changeManager.isDirty();
    equal(isDirty, false, "Select input element before changed.");

    changeInputElementValue(titleElement, "Mr");

    isDirty = this.changeManager.isDirty();
    equal(isDirty, true, "Select input element changed and change detected.");
    this.changeManager.reset();

    // Check for changes in TEXT input element.
    var nameElement = document.getElementById("txt-fullname");
    isDirty = this.changeManager.isDirty();
    equal(isDirty, false, "Text input element before changed.");

    changeInputElementValue(nameElement, "John Doe");

    isDirty = this.changeManager.isDirty();
    equal(isDirty, true, "Text input element changed and change detected.");
    this.changeManager.reset();
    
    // Check for changes in EMAIL input element.
    var emailElement = document.getElementById("txt-email");
    isDirty = this.changeManager.isDirty();
    equal(isDirty, false, "Email input element before changed.");

    changeInputElementValue(emailElement, "email@email.com");

    isDirty = this.changeManager.isDirty();
    equal(isDirty, true, "Email input element changed and change detected.");
    this.changeManager.reset();

    // Check for changes in URL input element.
    var urlElement = document.getElementById("txt-url");
    isDirty = this.changeManager.isDirty();
    equal(isDirty, false, "URL input element before changed.");

    changeInputElementValue(urlElement, "https://somewhere.url.com");

    isDirty = this.changeManager.isDirty();
    equal(isDirty, true, "URL input element changed and change detected.");
    this.changeManager.reset();

    // Check for checkbox changes.
    var checkOne = document.getElementById("chk-check1");
    var checkTwo = document.getElementById("chk-check2");
    checkOne.defaultChecked = true;
    isDirty = this.changeManager.isDirty();
    equal(isDirty, false, "Checkbox input before changes.");

    changeCheckboxElementValue(checkOne, false);
    changeCheckboxElementValue(checkTwo, true);

    isDirty = this.changeManager.isDirty();
    equal(isDirty, true, "Checkbox input elements changed and change detected.");

    this.changeManager.reset();

    isDefaultChecked = checkOne.defaultChecked;
    equal(isDefaultChecked, true, "Check default checked for checkbox AFTER reset.");

    // Check for changes in RANGE input element.
    var rangeElement = document.getElementById("rng-distance");
    var rangeValueBefore = rangeElement.value;

    isDirty = this.changeManager.isDirty();
    equal(isDirty, false, "Range input element before changed.");

    changeInputElementValue(rangeElement, "100");

    isDirty = this.changeManager.isDirty();
    equal(isDirty, true, "Range input element changed and change detected.");

    notEqual(rangeValueBefore, rangeElement.value, "Comparing range value before change with new change.");

    this.changeManager.reset();

    // Check for changes in TextArea element.
    var notesElement = document.getElementById("txt-notes");
    isDirty = this.changeManager.isDirty();
    equal(isDirty, false, "TextArea element before changed.");

    changeInputElementValue(notesElement, "Some Note");

    isDirty = this.changeManager.isDirty();
    equal(isDirty, true, "TextArea element changed and change detected.");
    this.changeManager.reset();

    // Check for changes in Password element.
    var passwordElement = document.getElementById("pwd-password");
    isDirty = this.changeManager.isDirty();
    equal(isDirty, false, "Password element before changed.");

    changeInputElementValue(passwordElement, "SecretPassword");

    isDirty = this.changeManager.isDirty();
    equal(isDirty, true, "Password element changed and change detected.");
    this.changeManager.reset();

    // Check for radio option changes.
    var radio1 = document.getElementById("opt-optiona");
    var radio2 = document.getElementById("opt-option2");
    radio1.defaultChecked = true;
    radio2.checked = false;

    isDirty = this.changeManager.isDirty();
    equal(isDirty, false, "Radio input before changes.");

    changeRadioElementValue(radio1, false);
    changeRadioElementValue(radio2, true);

    isDirty = this.changeManager.isDirty();
    equal(isDirty, true, "Radio input elements changed and change detected.");

    this.changeManager.reset();

    isDefaultChecked = radio1.defaultChecked;
    equal(isDefaultChecked, true, "Radio default checked for checkbox AFTER reset.");

    this.changeManager.reset();
});

/*  Changed Collection */
test("Changed Elements", function () {
    this.changeManager.initialize("container");

    var numberElement = document.getElementById("num-text");
    changeInputElementValue(numberElement, 1);

    var titleElement = document.getElementById("sel-title");
    changeInputElementValue(titleElement, "Mr");

    var titleElement = document.getElementById("sel-title");
    changeInputElementValue(titleElement, "Mr");

    var nameElement = document.getElementById("txt-fullname");
    changeInputElementValue(nameElement, "John Doe");

    var emailElement = document.getElementById("txt-email");
    changeInputElementValue(emailElement, "email@email.com");

    var urlElement = document.getElementById("txt-url");
    changeInputElementValue(urlElement, "https://somewhere.url.com");

    var checkOne = document.getElementById("chk-check1");
    var checkTwo = document.getElementById("chk-check2");
    changeCheckboxElementValue(checkOne, false);
    changeCheckboxElementValue(checkTwo, true);

    var rangeElement = document.getElementById("rng-distance");
    changeInputElementValue(rangeElement, "100");

    var notesElement = document.getElementById("txt-notes");
    changeInputElementValue(notesElement, "Some Note");
    var passwordElement = document.getElementById("pwd-password");
    changeInputElementValue(passwordElement, "SecretPassword");

    var radio1 = document.getElementById("opt-optiona");
    var radio2 = document.getElementById("opt-option2");
    changeRadioElementValue(radio1, false);
    changeRadioElementValue(radio2, true);

    var changedElementArray = this.changeManager.changedElements();
    var changedElementCount = Object.keys(changedElementArray).length;
    equal(changedElementCount, 11, "Eleven changed elements counted as expected.");
});

/* Input Controls */
test("Get Input Controls", function () {
	this.changeManager.initialize("container");
	var inputControlCount = Object.keys(this.changeManager.inputElements()).length;
	equal(inputControlCount, 15, "Fifteen nested input controls found as expected.");
});

/* ERROR HANDLING */
test("Non String Instantiation", function () {
    throws(function () {
        var containerElement = document.getElementById("container");
        this.changeManager.initialize(containerElement);
    },
    Error, "Parameter 'elementId' must be a string type and a valid HTML element id.")
});


test("Get Input Controls without Initializing", function () {
    throws(function () {
        // Have not initialized document so should throw exception.
        var inputControls = this.changeManager.inputElements();
    },
    Error, "Document has not been initialized.")
});

test("Reset without Initializing", function () {
    throws(function () {
        // Have not initialized document so should throw exception.
        var inputControls = this.changeManager.reset();
    },
    Error, "Document has not been initialized.")
});

test("Create dialogChangedElementCollection() with Incorrect Type", function () {
    throws(function () {
        var createdObject = new dialogChangedElementCollection();
        createdObject.add("something");
    },
    Error, "changedElement must be of type dialogChangedElement().")
});


/* Test Helpers */
var changeInputElementValue = function (element, newValue) {
    this.focusEvent = new Event('focus');
    this.changeEvent = new Event('change');
    element.dispatchEvent(focusEvent);
    element.value = newValue;
    element.dispatchEvent(changeEvent);
}

var changeCheckboxElementValue = function (element, newValue) {
    this.focusEvent = new Event('focus');
    this.changeEvent = new Event('change');
    element.dispatchEvent(focusEvent);
    element.checked = newValue;
    element.dispatchEvent(changeEvent);
}

var changeRadioElementValue = function (element, newValue) {
    this.focusEvent = new Event('focus');
    this.changeEvent = new Event('change');
    element.dispatchEvent(focusEvent);
    element.checked = newValue;
    element.dispatchEvent(changeEvent);
}
