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
    return "error: Unknow problem. Please restart or contact SwingGift";
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

function updateWinkelmand(id, prijs, aantal, eersteKeer) {
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

        fillStorage(array);

    }
}

function addTheme() {
    var arrayTheme = [];
    console.log(arrayTheme);
    var theme = $('input[name=Thema]:checked', '#themaSelect').val();
    arrayTheme.push(theme);
    console.log(arrayTheme);
    setWinkelmandArray(arrayTheme);
    if (isEmailVoucher(arrayTheme[0])) {
        $('#emailblok').show();
        $('#afhalenblok').hide();
    }
    else {
        $('#afhalenblok').show();
        $('#emailblok').hide();
    }
    console.log(filledArray);
}

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

    if (isEmailVoucher(arrayBoodschap[0])) {
        var ontvangerEmail = $('#ontvangerEmail').val();
        if (ontvangerEmail === "")
            fout += "e-mail, ";
        arrayBoodschap.push(ontvangerEmail);
    }
    else {
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

function isEmailVoucher(id) {
    var arrayEvoucher = window.localStorage.getArray("arrayEvoucher");
    for (var i = 0; i < arrayEvoucher.length; i++) {
        if (+arrayEvoucher[i] === +id)
            return true;
    }
    return false;
}
function winkelmandje(id) {
    console.log('winkelmandje:' + id);
    var aantal = document.getElementById("addItem" + id).elements.namedItem('aantal').value;
    var prijs = document.getElementById("addItem" + id).elements.namedItem('prijs').value;
    updateWinkelmand(id, prijs, aantal);
    successCBEmail();
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


function onDeviceReady1() {
    $.mobile.loading('show');
    //fix header image size
    $(window).on('load', function() {
        $(this).trigger('resize');
    });
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        $.mobile.loading('hide');
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

function changeButton() {
    $("span.winkelmandje").html(getAantalItems());
}

function clearWinkelmandje() {
    window.localStorage.removeItem("arrayKey");
    aantalItems = 0;
    totalePrijs = 0;
    console.log(filledArray);
    filledArray = [];
    changeButton();

}

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
    var content = "<div class='message error'><i class='icon-exclamation-sign'></i><p>Voer een voucher code in </p></div> ";

    if (voucherCode !== "") {
        personalisatiePaginaXML(voucherCode);
    }
    else {
        $('#errorVoucher').html(content);
    }
}

function popupClose(id) {
    $(id).popup("close");
}

function popup(id) {
    $(id).popup("open");
}

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

function addBetaalgegevens2() {
    var betalingArray = getBetaalgegevens();
    var fout = "Sommige verplichte velden zijn niet ingevuld: ";

    var betalingswijze = $('input[name=betalingswijze]:checked', '#BetaalgegevensForm2').val();
    betalingArray.push(betalingswijze);

    var factuur = $('#factuur').attr('checked');
    betalingArray.push(factuur);
    if (factuur === "true") {
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
            fout += "naam:, ";
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
    if (voorwaarden !== "true")
        fout += "gelieve de voorwaarden te accepteren. ";

    if (fout === "Sommige verplichte velden zijn niet ingevuld: ") {
        setBetaalgegevens(betalingArray);
        maakOverzicht(betalingArray);
        window.location.href = "#overzicht";
    }
    else {
        if (factuur !== "true")
            deleteArray(2, 'betaal2');
        else
            deleteArray(13, 'betaal2');
        window.alert(betalingArray);
        $('#errorBoodschap2').html("<div class='message error'><i class='icon-exclamation-sign'></i><p>" + fout + "</p></div>");
        window.location.href = "#errorBoodschap2";
    }

}

function toggleFacDiv() {
    $('#factuurDiv').toggle();
}

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

function arrayEvouchers(tx, results) {
    var arrayEvoucher = [];
    for (var i = 0; i < results.rows.length; i++)
        arrayEvoucher.push(results.rows.item(i).giftID);

    console.log(arrayEvoucher);
    window.localStorage.setArray("arrayEvoucher", arrayEvoucher);
}

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

