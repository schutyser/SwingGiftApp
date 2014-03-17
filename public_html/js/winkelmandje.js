document.addEventListener("deviceready", onDeviceReady, false);

var aantalItems;
var totalePrijs;
var filledArray = [];

function setTotalePrijs(prijs) {
    if (totalePrijs === "")
        totalePrijs = 0;
    else {
        totalePrijs = prijs + totalePrijs;
    }
}

function setAantalItems(aantal) {
    if (aantalItems === "")
        aantalItems = 0;
    else {
        aantalItems = aantal + aantalItems;
    }
}

function getTotalePrijs() {
    aantalItems = window.localStorage.getItem("aantalItems");
}

function getAantalItems() {
    totalePrijs = window.localStorage.getItem("totalePrijs");
}


function updateWinkelmand(id, prijs, aantal) {
    var array = [];

    array.push(id);
    array.push(prijs);
    array.push(aantal);

    setAantalItems(aantal);
    setTotalePrijs(prijs);
    fillStorage(array);
}

function winkelmandje() {
    $('#addItem').submit();

    var id = document.getElementById("addItem").elements.namedItem("id").value;
    var aantal = document.getElementById("addItem").elements.namedItem("aantal").value;
    var prijs = document.getElementById("addItem").elements.namedItem("prijs").value;
    updateWinkelmand(id, prijs, aantal);
}

Storage.prototype.setArray = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key));
};

function fillStorage(array) {
    filledArray.push(array);
    window.localStorage.setArray("arrayKey", filledArray);
    window.localStorage.setItem("aantalItems", aantalItems);
    window.localStorage.setItem("totalePrijs", totalePrijs);
}

function readArray() {
    filledArray = window.localStorage.getArray("arrayKey");
}

function test(){
    updateWinkelmand(1,20,1);
    updateWinkelmand(2,25,4);
    updateWinkelmand(3,30,2);
    
}

function onDeviceReady() {
    console.log("ready: localstorage test");
    test();
    
    console.log(filledArray.toString());
    
    for (i = 0; i < filledArray.length; ++i)
    console.log("Local storage winkelmandje item: " + i + ": " + filledArray[i]);
}