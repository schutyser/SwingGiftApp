var aantalItems = 0;
var filledArray = [];
var winkelmandArray = [];
var betalingArray = [];
var emailLever;

//fix header image size
$(window).on('load', function() {
    $(this).trigger('resize');
});

//Getter & Setters

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
    return window.alert("error: Unknow problem. Please restart or contact SwingGift");
}

function getPrijs(id) {
    for (var i = 0; i < filledArray.length; ++i) {
        if (+filledArray[i][0] === +id)
            return filledArray[i][1];
    }
    return window.alert("error: Unknow problem. Please restart or contact SwingGift");
}

function getTotalePrijs() {
    var prijs = 0;
    for (var i = 0; i < filledArray.length; ++i) {
        prijs = (+filledArray[i][1] * +filledArray[i][2]) + +prijs;
    }
    return prijs;
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

//steek Item in het winkelmandje
function updateWinkelmand(id, prijs, aantal) {
    var array = [];
    aantal = checkDuplicate(id, aantal);

    if (+aantal !== 0)
    {
        array.push(id);
        array.push(prijs);
        array.push(aantal);

        fillStorage(array);

    }
}

//Personalisatie van de voucher: thema kiezen
function addTheme() {
    var arrayTheme = [];
    var theme = $('input[name=Thema]:checked', '#themaSelect').val();
    arrayTheme.push(theme);
    setWinkelmandArray(arrayTheme);
    emailLevering();

}

//Personalisatie van de voucher: boodschap kiezen + gegevens ontvanger voucher
function addBoodschap() {
    var arrayBoodschap = getWinkelmandArray();
    var fout = "Sommige verplichte velden zijn niet ingevuld: ";

    var boodschapInhoud = $('#boodschapInhoud').val();
    arrayBoodschap.push(boodschapInhoud);

    var ontvangerVnaam = $('#ontvangerVnaam').val();
    if (ontvangerVnaam === "")
        fout += "voornaam, ";
    arrayBoodschap.push(ontvangerVnaam);

    var ontvangerNaam = $('#ontvangerNaam').val();
    if (ontvangerNaam === "")
        fout += "naam, ";
    arrayBoodschap.push(ontvangerNaam);

    var leveringsdatum = $('#leveringsdatum').val();
    arrayBoodschap.push(leveringsdatum);

    var afhaling = $('input[name=afhaling]:checked', '#boodschapForm').val();
    arrayBoodschap.push(afhaling);
    if (afhaling === "taxipost") {
        var firma = $('#firma').val();
        arrayBoodschap.push(firma);

        var straat = $('#straat').val();
        if (straat === "")
            fout += "straat, ";
        arrayBoodschap.push(straat);

        var nr = $('#nr').val();
        if (nr === "")
            fout += "nr, ";
        arrayBoodschap.push(nr);

        var bus = $('#bus').val();
        arrayBoodschap.push(bus);

        var postcode = $('#postcode').val();
        if (postcode === "")
            fout += "postcode, ";
        arrayBoodschap.push(postcode);

        var gemeente = $('#gemeente').val();
        if (gemeente === "")
            fout += "gemeente.";
        arrayBoodschap.push(gemeente);

        var land = $('#land').val();
        arrayBoodschap.push(land);
    }

    if (emailLever === 1 || emailLever === 2) {
        var ontvangerEmail = $('#ontvangerEmail').val();
        if (ontvangerEmail === "")
            fout += "e-mail, ";
        arrayBoodschap.push(ontvangerEmail);
    }

    if (fout === "Sommige verplichte velden zijn niet ingevuld: ") {
        setWinkelmandArray(arrayBoodschap);
        window.location.href = "#betaalgegevens1";
    }
    else {
        deleteArray(1, 'boodschap');
        $('#errorBoodschap').html("<div class='message error'><i class='icon-exclamation-sign'></i><p>" + fout + "</p></div>");
        window.location.href = "#errorBoodschap";
    }

}

//checken of het een email voucher of/en levering voucher is
function emailLevering() {
    var arrayEvoucher = window.localStorage.getArray("arrayEvoucher");
    var email = "";
    var levering = "";

    for (var i2 = 0; i2 < filledArray.length; i2++) {
        for (var i = 0; i < arrayEvoucher.length; i++) {
            if (+arrayEvoucher[i] === +filledArray[i2][0])
                email = "true";
            else
                levering = "true";
        }
    }
    if (email === "true" && levering === "true") {
        $('#afhalenblok').show();
        $('#emailblok').show();
        emailLever = 1;
    }
    else {
        if (email === "true") {
            $('#afhalenblok').hide();
            $('#emailblok').show();
            emailLever = 2;
        }
        else {
            $('#afhalenblok').show();
            $('#emailblok').hide();
            emailLever = 3;
        }
    }
}


//form opvangen voor het adden van een item
function winkelmandje(id) {
    var aantal = document.getElementById("addItem" + id).elements.namedItem('aantal').value;
    var prijs = document.getElementById("addItem" + id).elements.namedItem('prijs').value;
    updateWinkelmand(id, prijs, aantal);
    successCBEmail();
}

//local storage mogelijk maken om arrays te gebruiken
Storage.prototype.setArray = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key));
};

//winkelmandje items opslaan in local storage
function fillStorage(array) {
    filledArray.push(array);
    window.localStorage.setArray("arrayKey", filledArray);
    changeButton();
}

//local storage array voor winkelmandjes ophalen
function readArray() {
    if (window.localStorage.getArray("arrayKey") !== null)
        return window.localStorage.getArray("arrayKey");
    else
        return array = [];
}

//functie die wordt uitgevoerd bij het opstarten van de applicatie
function onDeviceReady1() {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        filledArray = readArray();
        changeButton();

        document.addEventListener("backbutton", function(e) {
            if ($.mobile.activePage.is('#index')) {
                e.preventDefault();
                navigator.app.exitApp();
            }
            else {
                if ($.mobile.activePage.is('#boodschap')) {
                    deleteArray(1, 'thema');
                    navigator.app.backHistory();
                }
                else {
                    if ($.mobile.activePage.is('#betaalgegevens1')) {
                        deleteArray(1, 'boodschap');
                        navigator.app.backHistory();
                    }
                    else {
                        if ($.mobile.activePage.is('#betaalgegevens2')) {
                            deleteArray(4, 'betaal1');
                            navigator.app.backHistory();
                        }
                        else {
                            if ($.mobile.activePage.is('#overzicht')) {
                                $.mobile.changePage('#shoppingcart');
                            }
                            else
                                navigator.app.backHistory();
                        }
                    }
                }
            }
        }, false);
    }
}

//update nummer van hoeveelheid items in winkelmandje
function changeButton() {
    $("span.winkelmandje").html(getAantalItems());
}

//winkelmandje leegmaken
function clearWinkelmandje() {
    window.localStorage.removeItem("arrayKey");
    aantalItems = 0;
    console.log(filledArray);
    filledArray = [];
    changeButton();

}

//kijken of het item al in het winkelmandje zit, zoja als 1 item aanzien en aantal verhogen
function checkDuplicate(id, aantal) {
    for (var i = 0; i < filledArray.length; ++i) {
        if (+filledArray[i][0] === +id) {
            var num = filledArray[i][2];
            var aantal1 = +num + +aantal;
            filledArray.splice(i, 1);
            return aantal1;
        }
    }
    console.log("no dup" + aantal);
    return aantal;
}

//Item uit winkelmandje verwijderen
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

//Vouchercode opvangen en webservice oproepen om code te controleren
function voucher() {
    var voucherCode = document.getElementById("voucherCode").value;
    var content = "<div class='message error'><i class='icon-exclamation-sign'></i><p>Voer een voucher code in </p></div> ";

    if (voucherCode !== "") {
        personalisatiePaginaXML(voucherCode);
    }
    else {
        $('#errorVoucher').html(content);
    }
}

//popup venster sluiten
function popupClose(id) {
    $(id).popup("close");
}

//popup venster openen
function popup(id) {
    $(id).popup("open");
}

//betaalgegevens opvangen en valideren
function addBetaalgegevens1() {
    var fout = "Sommige verplichte velden zijn niet ingevuld: ";
    var betalingArray = [];

    var voornaam = $('#voornaam').val();
    if (voornaam === "")
        fout += "voornaam, ";
    betalingArray.push(voornaam);

    var naam = $('#naam').val();
    if (naam === "")
        fout += "naam, ";
    betalingArray.push(naam);

    var email = $('#email').val();
    if (email === "")
        fout += "e-mail, ";
    betalingArray.push(email);

    var telefoon = $('#telefoon').val();
    if (telefoon === "")
        fout += "telefoon. ";
    betalingArray.push(telefoon);

    if (fout === "Sommige verplichte velden zijn niet ingevuld: ") {
        setBetaalgegevens(betalingArray);
        window.location.href = "#betaalgegevens2";
    }
    else {
        deleteArray(4, 'betaal1');
        $('#errorBoodschap1').html("<div class='message error'><i class='icon-exclamation-sign'></i><p>" + fout + "</p></div>");
        window.location.href = "#errorBoodschap1";
    }
}

//betaalgegevens opvangen en valideren (deel2)
function addBetaalgegevens2() {
    var betalingArray = getBetaalgegevens();
    var fout = "Sommige verplichte velden zijn niet ingevuld: ";

    var betalingswijze = $('input[name=betalingswijze]:checked', '#BetaalgegevensForm2').val();
    betalingArray.push(betalingswijze);

    if (document.getElementById('factuur').checked) {
        var firmaFac = $('#firmaFac').val();
        if (firmaFac === "")
            fout += "firma, ";
        betalingArray.push(firmaFac);

        var btwFac = $('#btwFac').val();
        if (btwFac === "")
            fout += "BTW-nummer, ";
        betalingArray.push(btwFac);

        var voornaamFac = $('#voornaamFac').val();
        if (voornaamFac === "")
            fout += "voornaam, ";
        betalingArray.push(voornaamFac);

        var naamFac = $('#naamFac').val();
        if (naamFac === "")
            fout += "naam, ";
        betalingArray.push(naamFac);

        var straatFac = $('#straatFac').val();
        if (straatFac === "")
            fout += "straat, ";
        betalingArray.push(straatFac);

        var nrFac = $('#nrFac').val();
        if (nrFac === "")
            fout += "nr, ";
        betalingArray.push(nrFac);

        var busFac = $('#busFac').val();
        betalingArray.push(busFac);

        var postCodeFac = $('#postCodeFac').val();
        if (postCodeFac === "")
            fout += "postcode, ";
        betalingArray.push(postCodeFac);

        var gemeenteFac = $('#gemeenteFac').val();
        if (gemeenteFac === "")
            fout += "gemeente, ";
        betalingArray.push(gemeenteFac);

        var landFac = $('#landFac').val();
        betalingArray.push(landFac);

        var referentieFac = $('#referentieFac').val();
        betalingArray.push(referentieFac);
    }

    var voorwaarden = $('#voorwaarden').attr('checked');
    if (voorwaarden !== "checked")
        fout += "gelieve de voorwaarden te accepteren. ";

    if (fout === "Sommige verplichte velden zijn niet ingevuld: ") {
        setBetaalgegevens(betalingArray);
        maakOverzicht(betalingArray);
        window.location.href = "#overzicht";
    }
    else {
        if (factuur !== "checked")
            deleteArray(1, 'betaal2');
        else
            deleteArray(12, 'betaal2');
        $('#errorBoodschap2').html("<div class='message error'><i class='icon-exclamation-sign'></i><p>" + fout + "</p></div>");
        window.location.href = "#errorBoodschap2";
    }

}

//factuur formulier tonen/verbergen
function toggleFacDiv() {
    $('#factuurDiv').toggle();
}

//gegevens uit winkelmandarray/betaalgegevensarray verwijderen
function deleteArray(number, arrayName) {
    var arrayToDelete = [];
    var numberTotal;
    if (arrayName === 'thema') {
        arrayToDelete = getWinkelmandArray();
        numberTotal = arrayToDelete.length - number;
        arrayToDelete.splice(numberTotal, number);
        setWinkelmandArray(arrayToDelete);
    }
    else {
        if (arrayName === 'boodschap') {
            arrayToDelete = getWinkelmandArray();
            numberTotal = arrayToDelete.length - number;
            arrayToDelete.splice(number, numberTotal);
            setWinkelmandArray(arrayToDelete);
        } else {
            arrayToDelete = getBetaalgegevens();
            numberTotal = arrayToDelete.length - number;
            arrayToDelete.splice(numberTotal, number);
            setBetaalgegevens(arrayToDelete);
        }
    }
}

//personalisatie doormiddel van foto
function Neemfoto() {
    if (!navigator.camera) {
        window.alert("Camera API not supported", "Error");
        return;
    }
    var options = {quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: 1, // 0:Photo Library, 1=Camera, 2=Saved Photo Album
        encodingType: 0     // 0=JPG 1=PNG
    };

    navigator.camera.getPicture(
            function(imageData) {
                $('#cameraPic').show().attr('src', "data:image/jpeg;base64," + imageData);
            },
            function() {
                window.alert('Error taking picture', 'Error');
            },
            options);
}

function addOrder(orderID) {
    var orders = [];
    if (window.localStorage.getArray("orders") !== null)
        orders = window.localStorage.getArray("orders");
    orders.push(orderID);
    window.localStorage.setArray("orders", orders);
    ordersFill();
}

