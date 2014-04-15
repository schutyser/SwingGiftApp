document.addEventListener("deviceready", onDeviceReady, false);

var aantalItems = 0;
var totalePrijs = 0;
var filledArray = [];
var winkelmandArray = [];
var betalingArray = [];

function setWinkelmandArray(array) {
    winkelmandArray = array;
}

function getWinkelmandArray() {
    return winkelmandArray;
}

function setBetaalgegevens(array) {
    betalingArray = array;
}

function getBetaalgegevens() {
    return betalingArray;
}

function getAantalItems() {
    var items = 0;
    for (var i = 0; i < filledArray.length; ++i) {
        items = +filledArray[i][2] + +items;
    }
    aantalItems = items;
    return aantalItems;
}

function getAantalItem(id) {
    for (var i = 0; i < filledArray.length; ++i) {
        if (+filledArray[i][0] === +id)
            return filledArray[i][2];
    }
    return "error";
}

function getTotalePrijs() {
    var prijs = 0;
    for (var i = 0; i < filledArray.length; ++i) {
        prijs = (+filledArray[i][1] * +filledArray[i][2]) + +prijs;
    }
    totalePrijs = prijs;
    return totalePrijs;
}

function getIds() {
    var ids = [];
    for (var i = 0; i < filledArray.length; ++i) {
        ids.push('\'' + filledArray[i][0] + '\'');
    }
    return ids;
}

function getSuppliers() {
    var supplierNameArray = [];
    var supplierName = $("#search1 input:checkbox:checked").map(function() {
        return $(this).val();
    }).get();
    for (var i = 0; i < supplierName.length; ++i) {
        supplierNameArray.push('\"' + supplierName[i] + '\"');
    }

    var evoucher = document.getElementById("evoucher").checked;

    var minPrijs = document.getElementById("minprijsID").value;
    var maxPrijs = document.getElementById("maxprijsID").value;

    window.localStorage.setArray("supplierName", supplierNameArray);
    window.localStorage.setItem("evoucher", evoucher);
    window.localStorage.setItem("minPrijs", minPrijs);
    window.localStorage.setItem("maxPrijs", maxPrijs);

    successCBFilter();
}

function updateWinkelmand(id, prijs, aantal) {
    var array = [];
    console.log("aantal b4 dup" + aantal);
    aantal = checkDuplicate(id, aantal);
    console.log("aantal na dup" + aantal);

    if (+aantal !== 0)
    {

        console.log("id: " + id + " prijs: " + prijs + " aantal: " + aantal);

        array.push(id);
        array.push(prijs);
        array.push(aantal);

        setWinkelmandArray(array);
    }
}

function addTheme() {
    var arrayTheme = getWinkelmandArray();
    var theme = $('input[name=Thema]:checked', '#themaSelect').val();
    arrayTheme.push(theme);
    console.log(arrayTheme);
    setWinkelmandArray(arrayTheme);
}

function addBoodschap() {
    var arrayBoodschap = getWinkelmandArray();

    var boodschapInhoud = $('#boodschapInhoud').val();
    arrayBoodschap.push(boodschapInhoud);

    var ontvangerVnaam = $('#ontvangerVnaam').val();
    arrayBoodschap.push(ontvangerVnaam);

    var ontvangerNaam = $('#ontvangerNaam').val();
    arrayBoodschap.push(ontvangerNaam);

    var afhaling = $('input[name=afhaling]:checked', '#boodschapForm').val();
    arrayBoodschap.push(afhaling);
    if (afhaling === "taxipost") {
        var firma = $('#firma').val();
        arrayBoodschap.push(firma);

        var straat = $('#straat').val();
        arrayBoodschap.push(straat);

        var nr = $('#nr').val();
        arrayBoodschap.push(nr);

        var bus = $('#bus').val();
        arrayBoodschap.push(bus);

        var postcode = $('#postcode').val();
        arrayBoodschap.push(postcode);

        var gemeente = $('#gemeente').val();
        arrayBoodschap.push(gemeente);

        var land = $('#land').val();
        arrayBoodschap.push(land);
    }




    console.log(arrayBoodschap);
    setWinkelmandArray(arrayBoodschap);
    fillStorage(arrayBoodschap);
}

function winkelmandje(id) {
    console.log('winkelmandje:' + id);
    var aantal = document.getElementById("addItem" + id).elements.namedItem('aantal').value;
    var prijs = document.getElementById("addItem" + id).elements.namedItem('prijs').value;
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
    changeButton();
}

function readArray() {
    if (window.localStorage.getArray("arrayKey") !== null)
        return window.localStorage.getArray("arrayKey");
    else
        return array = [];
}

function test() {
    updateWinkelmand(1, 20, 1);
    updateWinkelmand(2, 25, 4);
    updateWinkelmand(3, 30, 2);

}

function onDeviceReady() {
    filledArray = readArray();
    console.log(filledArray);
    changeButton();
    console.log("local array: " + readArray());
    console.log("ready: localstorage test");
    console.log(filledArray.toString());
    for (i = 0; i < filledArray.length; ++i)
        console.log("Local storage winkelmandje item: " + i + ": " + filledArray[i]);
}

function changeButton() {
    $("span.winkelmandje").html(getAantalItems());
}

function clearWinkelmandje() {
    console.log("clearing winkelmandje ...")
    window.localStorage.clear();
    aantalItems = 0;
    totalePrijs = 0;
    filledArray = [];
    changeButton();
}

function checkDuplicate(id, aantal) {
    for (var i = 0; i < filledArray.length; ++i) {
        if (+filledArray[i][0] === +id) {
            console.log("duplicate:" + id);
            var num = filledArray[i][2];
            var aantal1 = +num + +aantal;
            console.log("array b4 splice: " + filledArray);
            filledArray.splice(i, 1);
            console.log("array after splice: " + filledArray);
            return aantal1;
        }
    }
    console.log("no dup" + aantal);
    return aantal;
}

function deleteItem(id) {
    console.log("delete item:" + id);
    for (var i = 0; i < filledArray.length; ++i) {
        if (+filledArray[i][0] === +id) {
            filledArray.splice(i, 1);
            changeButton();
            successCB3();
        }
    }
}

function voucher() {
    var voucherCode = document.getElementById("voucherCode").value;
    console.log('voucher:' + voucherCode);
    if (voucherCode !== "") {
        personalisatiePaginaXML(voucherCode);
        window.location.href = "#personalisatie";
        $('#errorVoucher').html("");
    }
    else {
        var content = "<div class='message error'><i class='icon-exclamation-sign'></i><p>Voer een (geldige) voucher code in.</p></div>";
        $('#errorVoucher').html(content);
    }
}

function popupClose(id) {
    $(id).popup("close");
    console.log(document.getElementById("taxipost").checked);
    document.getElementById("taxipost").checked = false;
    document.getElementById("afhalen").checked = true;
    $("#taxipost").checkboxradio('refresh');
    $("#afhalen").checkboxradio('refresh');
}

function popupCheck(id) {
    $(id).popup("close");
}

function popup(id) {
    $(id).popup("open");
}

function addBetaalgegevens1() {

    var betalingArray = getBetaalgegevens();

    var voornaam = $('#voornaam').val();
    betalingArray.push(voornaam);

    var naam = $('#naam').val();
    betalingArray.push(naam);

    var email = $('#email').val();
    betalingArray.push(email);

    var telefoon = $('#telefoon').val();
    betalingArray.push(telefoon);
}

function addBetaalgegevens2() {
    var betalingArray = getBetaalgegevens();

    var betalingswijze = $('input[name=betalingswijze]:checked', '#BetaalgegevensForm2').val();
    betalingArray.push(betalingswijze);

    var factuur = $('#factuur').attr('checked');
    betalingArray.push(factuur);
    if (factuur === "true") {
        var firmaFac = $('#firmaFac').val();
        betalingArray.push(firmaFac);

        var btwFac = $('#btwFac').val();
        betalingArray.push(btwFac);

        var voornaamFac = $('#voornaamFac').val();
        betalingArray.push(voornaamFac);
        
        var naamFac = $('#naamFac').val();
        betalingArray.push(naamFac);
        
        var straatFac = $('#straatFac').val();
        betalingArray.push(straatFac);
        
        var nrFac = $('#nrFac').val();
        betalingArray.push(nrFac);
        
        var busFac = $('#busFac').val();
        betalingArray.push(busFac);
        
        var postCodeFac = $('#postCodeFac').val();
        betalingArray.push(postCodeFac);
        
        var gemeenteFac = $('#gemeenteFac').val();
        betalingArray.push(gemeenteFac);
        
        var landFac = $('#landFac').val();
        betalingArray.push(landFac);
        
        var referentieFac = $('#referentieFac').val();
        betalingArray.push(referentieFac);
    }
}

function toggleFacDiv() {
    $('#factuurDiv').toggle();
}
