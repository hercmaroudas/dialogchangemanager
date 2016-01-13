// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// Create Author: Heracles Maroudas
// Create Date  : 20/05/2014
// Description  : Monitors for changes in all editable child controls of a given element and determines if any of the values have changed since initialization. 
// Notes        :
// --------------------------------------------------------------------------------------------------------------------------------------------------------------
// 1.] For options that have a checked item by default ensure you use defaultChecked to check the opion you wish to check as the default. E.G. when loading a 
//     dialog (initialize) use defaultChecked property instead of checked to check an option or check to track changes made.
function dialogChangeManager() {

    var rootElementId = undefined;            // String()
    var defaultElements = undefined;          // { }
    var changedElements = undefined;          // { }
    var inputElements = undefined;            // { }
    var changedElementCollection = undefined; // dialogChangedElementCollection()

    // Initialzes this manager for the first time. Always call this when opening your dialog.
    this.initialize = function (elementid) {
        if (typeof elementid != "string")
            throw new Error("Parameter 'elementId' must be a string type and a valid HTML element id.");

        changedElementCollection = new dialogChangedElementCollection();
        rootElementId = elementid;
        defaultElements = undefined;
        changedElements = undefined;
        inputElements = undefined;
        _initialize(elementid);
    }

    // Determines from the element provided if any input values have changed.
    this.isDirty = function () {
        if (changedElements == undefined)
            return false;
        if (Object.keys(changedElements).length <= 0)
            return false;

        // Loop through changed controls and get their values to compare against original values.
        for (var key in changedElements) {
            // Get the value from the main original control array containing all the control values and if the value have changed we know the user has modified something.
            var originalvalue = defaultElements[key];
            var changedvalue = changedElements[key];
            if (originalvalue != changedvalue)
                return true;
        }
    }

    // Get the default input elements contained within the element object provided in initialize.
    this.inputElements = function () {
        if (String.isNullOrEmpty(rootElementId))
            throw new Error("Document has not been initialized.");

        var rootElement = document.getElementById(rootElementId);
        enumerateChildElements(rootElement);

        return inputElements == undefined ? undefined : inputElements;
    }

    // Gets a collection of all changed element id's their default and new values. 
    this.changedElements = function () {
        changedElementCollection = new dialogChangedElementCollection();
        // Loop through changed controls and get their values to compare against original values.
        for (var key in changedElements) {
            // Get the value from the main original control array containing all the control values and if the value have changed we know the user has modified something.
            var originalvalue = defaultElements[key];
            var changedvalue = changedElements[key];
            if (originalvalue != changedvalue) {
                var changedElement = new dialogChangedElement(key, originalvalue, changedvalue);
                changedElementCollection.add(changedElement);
            }
        }
        return changedElementCollection.changedItems;
    }

    // Reset all elements to have their default values as when initialize was called. The document is initialized again after all values have been reset.
    this.reset = function () {
        if (String.isNullOrEmpty(rootElementId))
            throw new Error("Document has not been initialized.");

        var changedElements = this.changedElements();
        for (var changesCount = 0; changesCount < Object.keys(changedElements).length; changesCount++) {
            var changedElement = changedElements[changesCount];
            var element = getElement(changedElement.elementId);
            var elementType = element.type;
            // Handle radio buttons by setting back to default checked item.
            if (elementType == undefined) {
                for (var optionCount = 0; optionCount < element.length; optionCount++) {
                    element[optionCount].checked = element[optionCount].defaultChecked;
                }
            }
            else {
                switch (elementType.toLowerCase()) {
                    case "checkbox":
                        element.checked = changedElement.originalValue; // or defaultChecked.
                        break;
                    default:
                        element.value = changedElement.originalValue;
                        break;
                }
            }
        }
        this.initialize(rootElementId);
    }

    // Gets the element iether by name or id. (Can only be one of the two because this is how we stored them).
    var getElement = function (uniqueKey) {
        // Try get element by id.
        var element = document.getElementById(uniqueKey);

        // try get element by name.
        if (element == null)
            element = document.getElementsByName(uniqueKey);

        return element;
    }

    // Recurse through element provided and get all input controls.
    var _initialize = function (elementid) {
        // Add default values on controls if they dont exist.
        document.querySelector('#' + elementid).addEventListener('focus', function (event) {
            var element = event.target;
            var elementType = element.type.toLowerCase();
            switch (elementType) {
                case "text":
                case "textarea":
                case "email":
                case "number":
                case "range":
                case "url":
                case "password":
                case "checkbox":
                case "radio":
                case "select-one":
                    // Add default value to the array of default controls.
                    var uniquekey = getElementUniqueKey(element);
                    addDefaultControlAndValueToArray(uniquekey, element);
                    break;
                default:
                    break
            }
        },
        true);

        // Get all child controls within the container specified.
        document.querySelector('#' + elementid).addEventListener('change', function (event) {
            // Event fired here for every element contained within element specified in parameter.
            var element = event.target;
            var elementType = element.type.toLowerCase();
            var elementValue = undefined;
            switch (elementType) {
                case "text":
                case "textarea":
                case "email":
                case "number":
                case "range":
                case "url":
                case "password":
                    addChangedControlToArray(element, element.value);
                    break;
                case "select-one":
                    addChangedControlToArray(element, element.options[element.selectedIndex].value);
                    break;
                case "checkbox":
                    addChangedControlToArray(element, element.checked);
                    break;
                case "radio":
                    addChangedControlToArray(element, element.checked);
                    break;
                default:
                    break
            }
        },
        true);
    }

    // Adds a control to the array specified. The array is an associative array with key value pairs.
    var addChangedControlToArray = function (element, elementvalue) {
        // try get the element id from the element, if not try get the name.
        var uniquekey = getElementUniqueKey(element);
        if (uniquekey == undefined)
            // No unique id so we cannot track changes on current element.
            return;

        if (changedElements == undefined)
            changedElements = {};

        switch (element.type) {
            case "radio":
                newValueForRadio(element, changedElements, uniquekey);
                break;
            default:
                changedElements[uniquekey] = elementvalue;
                break;
        }
    }

    // Set a new value for the radio control.
    var newValueForRadio = function (element, array, uniqueKey) {
        // If radio doesn't belong to a group add using the id.
        if (String.isNullOrEmpty(element.name)) {
            array[uniqueKey] = element.checked;
        }
        else {
            // For radio elements set unique key by name.
            uniqueKey = element.name;
            array[uniqueKey] = tryGetValueForRadio(element);
        }
    }

    // Attempt to get a unique key for the element to monitor for changes.
    var getElementUniqueKey = function (element) {
        // Try get the element id from the element, if not try get the name.
        if (!String.isNullOrEmpty(element.id))
            return element.id;

        if (!String.isNullOrEmpty(element.name))
            return element.name;

        return undefined;
    }

    // Add control thats event was fired and its default value.
    var addDefaultControlAndValueToArray = function (uniqueKey, element) {
        if (defaultElements == undefined)
            defaultElements = {};

        // Control 'default' and value can only be added once. This is the value we will compare against later.
        if (defaultElements[uniqueKey] == null) {
            switch (element.type) {
                case "select-one":
                    setDefaultValueForSelect(element, defaultElements, uniqueKey);
                    break;
                case "radio":
                    setDefaultValueForRadio(element, defaultElements, uniqueKey);
                    break;
                case "checkbox":
                    setDefaultValueForCheckbox(element, defaultElements, uniqueKey);
                    break;
                default:
                    setDefaultValueForOtherElement(element, defaultElements, uniqueKey);
                    break;
            }
        }
    }

    // Set the default selected text from a select element.
    var setDefaultValueForSelect = function (element, array, uniqueKey) {
        for (var optionCount = 0; optionCount < element.length; optionCount++) {
            // Get current option in loop and check to see if the default value was checked.
            var currentOption = element[optionCount];
            if (currentOption.defaultSelected) {
                // Get the default checked value.
                array[uniqueKey] = element[optionCount].text;
                return;
            }
        }
        // Return the current selected text if no defaults were selected.
        if (element.selectedIndex >= 0)
            array[uniqueKey] = element.options[element.selectedIndex].text;
        else
            array[uniqueKey] = "";
    }

    // Set the default checked value for a group of radio buttons. If the group does not exist use the id.
    var setDefaultValueForRadio = function (element, array, uniqueKey) {
        // If radio doesn't belong to a group add using the id.
        if (String.isNullOrEmpty(element.name)) {
            array[uniqueKey] = elemen.checked;
        }
        else {
            // For radio elements set unique key by name.
            uniqueKey = element.name;
            var optionsByName = document.getElementsByName(uniqueKey);
            for (var optionCount = 0; optionCount < optionsByName.length; optionCount++) {
                var currentOption = optionsByName[optionCount];
                if (currentOption.defaultChecked) {
                    array[uniqueKey] = tryGetValueForRadio(currentOption);
                    return;
                }
            }
            // No radio has a default check so set the current radio group to empty.
            array[uniqueKey] = "";
        }
    }

    // Try get the label for the radio element, failing that the value, and lastly failing that the id. (all elements must have an id at least to be evaluated).
    var tryGetValueForRadio = function (element) {
        var radioLabel = element.nextSibling.nodeValue;
        if (!String.isNullOrEmpty(radioLabel)) {
            return radioLabel.trim();
        }
        else if (!String.isNullOrEmpty(element.value)) {
            return element.value.trim();
        }
        else {
            return element.id;
        }
    }

    // Set the default checked value of a checkbox element.
    var setDefaultValueForCheckbox = function (element, array, uniqueKey) {
        // Return the default value loaded for the checkbox or current value.
        if (element.defaultChecked)
            array[uniqueKey] = element.defaultChecked;
        else
            array[uniqueKey] = element.checked;
    }

    // Set a default value for the element. If defaultValue is not found get the current value.
    var setDefaultValueForOtherElement = function (element, array, uniqueKey) {
        // If a default value has not been asigned then add the value as the default.
        if (element.defaultValue == undefined || element.defaultValue.toString().trim() == "")
            array[uniqueKey] = element.value;
        else
            array[uniqueKey] = element.defaultValue;
    }

    // Enumerate through element tree and get all input elements. Elements without an id or name do not get added.
    var enumerateChildElements = function (element) {
        if (element != null && element.hasChildNodes()) {
            // recursing through the element tree and get required values from the current html element.
            addInputElementToArray(element);
            for (var i = 0; i < element.children.length; i++) {
                var newelement = element.children[i];
                // Recurse and get all child controls of controls.
                enumerateChildElements(newelement);
            }
        }
        else {
            // no children found on element so enumerate current element without recursing through the tree.
            addInputElementToArray(element);
        }
    }

    // Adds input type element controls using their id or name as a key and the entire control as the value.
    var addInputElementToArray = function (element) {
        var uniqueId = getElementUniqueKey(element);
        if (String.isNullOrEmpty(uniqueId))
            return;

        if (inputElements == undefined)
            inputElements = {};

        // Add input type controls only to input element array.
        switch (element.type) {
            case "text":
            case "textarea":
            case "email":
            case "number":
            case "range":
            case "url":
            case "password":
            case "checkbox":
            case "radio":
            case "select-one":
                inputElements[uniqueId] = element;
                break;
            default:

        }
    }

    // Add function to check for null or empty string value.
    String.isNullOrEmpty = function (value) {
        return (value == undefined || value.toString().trim === "");
    };
}

// Represents an element contained within the root element in dialogChangeManager thats value has been changed by an end user.
function dialogChangedElement(elementId, originalValue, newValue) {
    this.elementId = elementId;
    this.newValue = newValue;
    this.originalValue = originalValue;
    // Ensure that the following properties are members of the instantiating object.
    dialogChangedElement.prototype.hasOwnProperty = function (value) {
        return "elementId" == value ||
               "originalValue" == value ||
               "newValue" == value;
    }
}

// Is a collection of dialogChangedElements contained in an array [changedItems].
function dialogChangedElementCollection() {
    this.changedItems = [];
    // Adds a change element containing the element id, original value and new value of an element whos value has changed within dialogChangeManager().
    this.add = function (changedElement) {
        if (typeof changedElement === "object" &&
            changedElement.hasOwnProperty("elementId") &&
            changedElement.hasOwnProperty("originalValue") &&
            changedElement.hasOwnProperty("newValue")) {
            this.changedItems.push(changedElement);
        }
        else
            throw new Error("changedElement must be of type dialogChangedElement().");
    }
}
