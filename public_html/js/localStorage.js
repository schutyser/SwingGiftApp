document.addEventListener("deviceready", onDeviceReady, false);

var filledArray = new Array();

// PhoneGap is ready
//
function onDeviceReady() {
    window.localStorage.setItem("key", "value");
    var keyname = window.localStorage.key(i);
    // keyname is now equal to "key"
    var value = window.localStorage.getItem("key");
    // value is now equal to "value"
    window.localStorage.removeItem("key");
    window.localStorage.setItem("key2", "value2");
    window.localStorage.clear();
    // localStorage is now empty
    window.localStorage.setArray("arrayKey", filledArray);
    filledArray = window.localStorage.getArray("arrayKey");
}

Storage.prototype.setArray = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key));
};