document.addEventListener("deviceready", onDeviceReady, false);

var filledArray = new Array();
var value, keyname, value2, keyname2;

// PhoneGap is ready
//
function onDeviceReady() {
    window.localStorage.setItem("key", "value");
    keyname = window.localStorage.key(i);

    value = window.localStorage.getItem("key");

    window.localStorage.setItem("key2", "value2");

    keyname2 = window.localStorage.key(i);

    value2 = window.localStorage.getItem("key");

    window.localStorage.setArray("arrayKey", filledArray);

}

Storage.prototype.setArray = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key));
};

function showContent() {
    for (i = 0; i < filledArray.length; ++i)
        document.getElementById('testSQL').innerHTML = "Local storage array: " + filledArray[i];

    document.getElementById('testSQL').innerHTML = "Local storage normal: " + window.localStorage.getItem("key") + "var:" + value;

}

function getArray() {
    filledArray = window.localStorage.getArray("arrayKey");
    return filledArray;
}