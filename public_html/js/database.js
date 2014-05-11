var giftID;
var eindeNodig;
var orderArray = [];

//Wordt uitgevoerd bij opstarten app
function onDeviceReady() {
    document.addEventListener("deviceready", onDeviceReadyData, false);

    function onDeviceReadyData() {
        var db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);
        db.transaction(populateDB, errorCB, xmlParse);
    }
}

//Getters & Setters
function getGiftID() {
    return giftID;
}

function setGiftID(id) {
    if (id === "")
        id = 0;
    else {
        giftID = id;
    }
}

function getOrdersArray() {
    return orderArray;
}

function setOrdersArray(orderArrayIn) {
    orderArray = orderArrayIn;
}

function geteindeNodig() {
    return eindeNodig;
}

function seteindeNodig(boolean) {
    eindeNodig = boolean;
}

//Aanmaken database voor de geschenkbonnnen
function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS vouchers');
    tx.executeSql('CREATE TABLE IF NOT EXISTS vouchers (giftID unique, supplierName, title_NL, title_FR, decr_NL, decr_FR, brands_NL, brands_FR, exclusion_NL, exclusion_FR, price_inclBTW INT, serviceFee, isEvoucher, isFixValidDate, Validtxt, mainAfb, detailAfb1, detailAfb2, detailAfb3)');

}

//Error message bij database fout
function errorCB(err) {
    window.alert("Error processing SQL: " + err.code + " message: " + err.message);
}

// Transaction success callbacks
function successCB() {
    var db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);
    db.transaction(queryDB, errorCB);
}

function successCBAll() {
    var db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);
    db.transaction(queryDBAll, errorCB);
}

function successCBEmail() {
    var db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);
    db.transaction(queryDBEmail, errorCB);
}

function successCBFilter() {
    var db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);
    db.transaction(queryDBFilter, errorCB);
}

function successCB2(i) {
    var db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);
    setGiftID(i);
    db.transaction(queryDB2, errorCB);

}

function successCB3() {
    var db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);
    db.transaction(queryDB3, errorCB);

}

function successCB4() {
    var db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);
    db.transaction(queryDB4, errorCB);

}

function queryDBEmail(tx) {
    tx.executeSql('SELECT giftID FROM vouchers where isEvoucher="true"', [], arrayEvouchers, errorCB);
}

function queryDB(tx) {
    seteindeNodig("true");
    tx.executeSql('SELECT * FROM vouchers limit 3', [], listItems, errorCB);
}

function queryDBAll(tx) {
    seteindeNodig("false");
    tx.executeSql('SELECT * FROM vouchers', [], listItems, errorCB);
}

function queryDBFilter(tx) {
    seteindeNodig("true");
    var evoucher = window.localStorage.getItem("evoucher");
    var supplierNames = window.localStorage.getArray("supplierName");
    var minPrijs = window.localStorage.getItem("minPrijs");
    var maxPrijs = window.localStorage.getItem("maxPrijs");

    if (evoucher !== "false")
        tx.executeSql('SELECT * FROM vouchers where (price_inclBTW between ' + +minPrijs + ' AND ' + +maxPrijs + ') AND isEvoucher="false" AND supplierName IN (' + supplierNames + ')', [], listItems, errorCB);
    else
        tx.executeSql('SELECT * FROM vouchers where (price_inclBTW between ' + +minPrijs + ' AND ' + +maxPrijs + ') AND supplierName IN (' + supplierNames + ')', [], listItems, errorCB);
}

function queryDB2(tx) {
    var id = Number(getGiftID());
    tx.executeSql('SELECT * FROM vouchers where giftID="' + id + '"', [], detailItem, errorCB);
}

function queryDB3(tx) {
    tx.executeSql('SELECT * FROM vouchers WHERE giftID IN (' + getIds() + ')', [], shoppingCart, errorCB);
}
function queryDB4(tx) {

    tx.executeSql('SELECT DISTINCT supplierName FROM vouchers', [], advancedSearch1, errorCB);
}

//Ophalen van de geschenkbonnen door de webservice op te roepen
function xmlParse() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://ws.swinggift.com/SGServices.asmx?op=GetVouchers', true);

    // build SOAP request
    var sr =
            '<?xml version="1.0" encoding="UTF-8"?>' +
            '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://tempuri.org/">' +
            '<SOAP-ENV:Body>' +
            '<ns1:GetVouchers>' +
            '<ns1:logoncode>THIJS123</ns1:logoncode>' +
            '</ns1:GetVouchers>' +
            '</SOAP-ENV:Body>' +
            '</SOAP-ENV:Envelope>';

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', "text/xml; charset=\"utf-8\"");
    xmlhttp.setRequestHeader('SOAPAction', 'http://tempuri.org/GetVouchers');
    xmlhttp.setRequestHeader("Accept", "application/xml", "text/xml", "\*/\*");

    xmlhttp.send(sr);
    // send request
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                vouchers(xmlhttp.responseText);
            }
        }
    };

    function vouchers(xml) {
        var db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);

        $(xml).find('Vouchers').each(function() {
            var voucher = [];
            voucher.push($(this).find("giftID").text());
            voucher.push($(this).find("supplierName").text());
            voucher.push($(this).find("title_NL").text());
            voucher.push($(this).find("title_FR").text());
            voucher.push($(this).find("descr_NL").text());
            voucher.push($(this).find("descr_FR").text());
            voucher.push($(this).find("brands_NL").text());
            voucher.push($(this).find("brands_FR").text());
            voucher.push($(this).find("exclusion_NL").text());
            voucher.push($(this).find("exclusion_FR").text());
            voucher.push($(this).find("price_inclBTW").text());
            voucher.push($(this).find("serviceFee").text());
            voucher.push($(this).find("isEvoucher").text());
            voucher.push($(this).find("isFixValidDate").text());
            voucher.push($(this).find("Validtxt").text());
            voucher.push($(this).find("mainAfb").text());
            voucher.push($(this).find("detailAfb1").text());
            voucher.push($(this).find("detailAfb2").text());
            voucher.push($(this).find("detailAfb3").text());

            db.transaction(function(tx) {
                tx.executeSql('INSERT INTO vouchers (giftID, supplierName, title_NL, title_FR, decr_NL, decr_FR, brands_NL, brands_FR, exclusion_NL, exclusion_FR, price_inclBTW, serviceFee, isEvoucher, isFixValidDate, Validtxt, mainAfb, detailAfb1, detailAfb2, detailAfb3) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', voucher);
            });
            successCB();
        });
    }
}

//Het aanmaken van de shop (items dynamisch vullen)
function listItems(tx, results) {
    var len = results.rows.length;
    var content = "";

    var begin1;

    if (geteindeNodig() === "true")
        begin1 = "";
    else {
        begin1 = "<ul id='searchShopList' data-role=\"listview\"  data-filter=\"true\" data-filer-placeholder=\"Zoek een geschenk ...\" data-filter-theme='b'>";
    }

    var begin2 = '<li data-role = "list-divider" >\n\
            <a href = "#panel" data-role ="button" data-inline = "true" data-mini = "true" onclick="successCB4()" style = "margin-top: -10px;"> Advanced search...\n\
                        </a><br/>\n\
                    </li>\n\
                    <li data-role = "list-divider" >AANGEBODEN CADEAUBONNEN </li>';

    for (var i = 0; i < len; i++) {
        var id = results.rows.item(i).giftID;
        var imageUrl = results.rows.item(i).mainAfb;
        var titel = results.rows.item(i).title_NL;
        var prijs = results.rows.item(i).price_inclBTW;
        
        if(prijs === 0)
            prijs += " (zelf te kiezen bedrag)";

        var con =
                '<li><a href = #item onclick="successCB2(' + id + ')">\n\
            <img src = ' + imageUrl + ' >\n\
            <h2> ' + titel + ' </h2>\n\
            <p> Prijs: &#8364; ' + prijs + ' </p>\n\
            </a></li>';

        content = content + con;

    }

    var einde;
    if (geteindeNodig() === "true")
        einde = '<li><a href = "#shop" onclick="successCBAll()"> Toon alle bonnen... </a></li></ul>';
    else
        einde = "";

    $('#searchShopList').html(begin1 + begin2 + content + einde).trigger('create');

    if ($('#searchShopList').hasClass('ui-listview')) {
        $('#searchShopList').listview('refresh');
    }
    else {
        $('#searchShopList').trigger('submit');
    }

}

//Detail pagina van een geschenkbon opmaken
function detailItem(tx, results) {
    var id = results.rows.item(0).giftID;
    var imageUrl = results.rows.item(0).mainAfb;
    var titel = results.rows.item(0).title_NL;
    var prijs = results.rows.item(0).price_inclBTW;
    var omschrijving = results.rows.item(0).decr_NL;
    var email = results.rows.item(0).isEvoucher;
    var emailContent;
    var prijsInfo = "";
    var typePrijs = "hidden";

    if (prijs === 0) {
        prijsInfo = "(zelf te kiezen bedrag)";
        typePrijs = "number";
    }

    if (email === "true")
        emailContent = "Deze bon wordt via mail opgestuurd!";
    else
        emailContent = "Deze bon kan opgestuurd worden via Taxipost of opgehaald worden op ons kantoor!";

    var content =
            '<ul data-role="listview" data-inset="false" data-icon="false" data-divider-theme=\'b\'>\n\
                    <li data-role="list-divider">\n\
                        <a href="#" data-rel="back" data-icon="mail-reply" data-role="button" data-inline="true" data-mini="true" >Go back</a>\n\
                        <a href="#popupDialog' + id + '" data-rel=\'popup\' data-position-to=\'window\' data-icon="plus" data-role="button" data-inline="true" data-transition=\'pop\' data-mini="true" >Buy this!</a>\n\
                        <a href="#shoppingcart" data-role="button" data-inline="true" data-mini="true" onclick="successCB3()" style="float: right;" ><img src="img/icon_shoppingcard.png" alt="winkelmand"/><strong><span class="winkelmandje"></span></strong></a>\n\
                    </li>\n\
                    <li id="' + id + '">\n\
                        <img src="' + imageUrl + '">\n\
                        <h2>' + titel + '</h2>\n\
                        <p>Prijs: &#8364;' + prijs + prijsInfo + '</p>\n\
                        <p> ' + omschrijving + '</p>\n\
                        <p>' + emailContent + '</p>\n\
                    </li>\n\
                </ul>\n\
                <div data-role=\'popup\' id=\'popupDialog' + id + '\' data-theme=\'b\'>\n\
                    <div id="change" data-role=\'content\' data-theme=\'b\'>\n\
                        <form id="addItem' + id + '">\n\
                            <label>How many?</label>\n\
                            <input id="aantalLabel' + id + '" type="number" name="aantal" value="1"/>\n\
                            <input id="idInput" type="hidden" name="id" value="' + id + '" />\n\
                            <input id="prijsLabel' + id + '" type="' + typePrijs + '" name="prijs" value="' + prijs + '" />\n\
                            <input id="email' + id + '" type="hidden" name="email" value="' + email + '" />\n\
                            <label  name="prijs">Totale prijs: &#8364;<span id="prijsCalcu' + id + '">' + prijs + '</span></label> \n\
                        </form>\n\
                        <div>\n\
                        <a href="#shop" data-icon="ok" data-iconpos="left" data-role="button" data-inline="true" onclick="winkelmandje(' + id + prijs + ')">Add</a>\n\
                            <a href="#" data-rel=\'back\' data-icon="delete" data-iconpos="left" data-role="button" data-inline="true">Cancel</a>\n\
                        </div>\n\
                    </div>\n\
                </div>';

    $('#itemContent').html(content).trigger("create");

    $(document).on('change', '#change', function() {
        var aantal = $('#aantalLabel' + id + '').val();
        var prijs = $('#prijsLabel' + id + '').val();
        if (+aantal <= 0)
            aantal = 1;
        calcPrijs(aantal, prijs);
    });

    function calcPrijs(aantal, prijs) {
        $('#prijsCalcu' + id + '').text(aantal * prijs);
    }
}

//Winkelmand pagina opmaken
function shoppingCart(tx, results) {
    var creditContent = "";
    var credit = localStorage.getItem("credit");
    var totaleprijs = getTotalePrijs();
    
    if (+credit !== 0) {
        creditContent = "Korting via voucher(s): &#8364; " + credit;
        totaleprijs = +totaleprijs - +credit;
    }

    var content1 =
            '<ul id="shoppingcartList" data-role="listview">\n\
                    <li data-role="list-divider">\n\
                        <a href="#" data-rel="back" data-icon="mail-reply" data-role="button" data-inline="true" data-mini="true" >Go back</a>\n\
                        <a href="#shop" data-role="button" data-inline="true" data-mini="true" data-icon="trash" style="float: right;" onclick="clearWinkelmandje()">Clear all items</a>\n\
                    </li>\n\
                    <li data-role="list-divider">\n\
                        Shopping cart items:\n\
                    </li>';

    var len = results.rows.length;
    var content2 = "";
    if (len === 0) {
        content2 = '<li>\n\
                        Geen items toegevoegd.\n\
                    </li>';
    }
    else {
        for (var i = 0; i < len; i++) {
            var id = results.rows.item(i).giftID;
            var titel = results.rows.item(i).title_NL;
            var prijs = getPrijs(id);
            var aantal = getAantalItem(id);

            var con =
                    '<li id="' + id + '">\n\
                        <h2>' + titel + ' <a href="#" onclick="deleteItem(' + id + ');" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right" style="float:right;"></a>\n\
                        <span style="float: right;">\n\
                        <input id="aantalItem' + id + '" type="number" name="aantal" min=1 value="' + aantal + '" style="width: 3rem;"/>\n\
                        x &#8364; ' + prijs + '</span></h2>\n\
                    </li>';

            content2 += con;
        }
    }

    var content3 = "";
    if (len === 0) {
        content3 = '<li>\n\
                        <a href="#shop" data-role="button" data-icon="gift">Go shopping now!</a>\n\
                    </li></ul>';
    }
    else {
        content3 = '<li data-role="list-divider" style="text-align: right;">\n\
                        ' + creditContent + '\n\
                    </li>\n\
                    <li data-role="list-divider" style="text-align: right;">\n\
                        Totale prijs: &#8364; ' + totaleprijs + '\n\
                    </li>\n\
                    <li>\n\
                        <a href="#thema" data-role="button" data-icon="truck">Complete order</a>\n\
                    </li></ul> <p>*Eventuele verzendingskosten niet inbegrepen.</p>';
    }


    $('#shoppingContent').html(content1 + content2 + content3).trigger("create");

    $(document).on('change', "#aantalItem" + id, function() {
        var a = $('#aantalItem' + id + '').val();
        var a2 = getAantalItem(id);
        if (+a <= 0)
            a = 1;
        if (a !== a2) {
            var aantalNieuw = +a - +a2;
            updateWinkelmand(id, prijs, aantalNieuw, 0);
            successCB3();
        }
    });
}

//Zoek pagina aanmaken
function advancedSearch1(tx, results) {

    var len = results.rows.length;
    var content = '<fieldset data-role = "controlgroup" ><legend>Leverancier</legend></br>';
    for (var i = 0; i < len; i++) {
        var leverancier = results.rows.item(i).supplierName;
        var con =
                '<label for="' + leverancier + '">' + leverancier + '</label>\n\
                <input type="checkbox" name="leverancier" id="' + leverancier + '" checked="" value="' + leverancier + '">';

        content = content + con;
    }
    content = content + '</fieldset>';

    $('#search1').html(content).trigger("create");
}

//Vouchercode checken via webservice en indien nodig doorverwijzen naar personalisatie pagina
function personalisatiePaginaXML(voucherCode) {
    var errorCode = "";
    var pers = [];
    var credit;


    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://ws.swinggift.com/SGServices.asmx?op=ChecksCode', true);

    // build SOAP request
    var sr =
            '<?xml version="1.0" encoding="UTF-8"?>' +
            '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://tempuri.org/">' +
            '<SOAP-ENV:Body>' +
            '<ChecksCode xmlns="http://tempuri.org/">' +
            '<ns1:logoncode>THIJS123</ns1:logoncode>' +
            '<SGVouchercode>' + voucherCode + '</SGVouchercode>' +
            '</ChecksCode>' +
            '</SOAP-ENV:Body>' +
            '</SOAP-ENV:Envelope>';

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', "text/xml; charset=\"utf-8\"");
    xmlhttp.setRequestHeader('SOAPAction', 'http://tempuri.org/ChecksCode');
    xmlhttp.setRequestHeader("Accept", "application/xml", "text/xml", "\*/\*");

    xmlhttp.send(sr);
    // send request
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                var error = personalisatie(xmlhttp.responseText);
                var content = "<div class='message error'><i class='icon-exclamation-sign'></i><p>Voer een (geldige) voucher code in : ";
                var einde = "</p></div>";

                if (error === "OK") {
                    if (checkDuplicate(voucherCode)) {
                        setCredit(credit);
                        if (pers[3] !== "" && pers[5] !== "") {
                            maakPersPagina(pers);
                            window.location.href = "#personalisatie";
                            $('#errorVoucher').html("");
                        }
                        else
                            $('#errorVoucher').html("<div class='message success'><i class='icon-ok'></i><p>De vouchercode is succesvol toegevoegd en zal bij de betaling verrekend worden.</p></div>");
                    }
                    else
                        $('#errorVoucher').html("<div class='message error'><i class='icon-exclamation-sign'></i><p>Deze voucher code is al geregistreerd op uw device.</p></div>");
                }
                else {
                    $('#errorVoucher').html(content + error + einde);
                }
            }
        }
    }
    ;
    function personalisatie(xml) {
        errorCode = $(xml).find("ErrorMessage").find("errorMessage").text();
        pers.push($(xml).find("levering_contactnaam").text());
        pers.push($(xml).find("logo").text());
        pers.push($(xml).find("TitelNL").text());
        pers.push($(xml).find("VideoNL").text());
        pers.push($(xml).find("TitelNL").text());
        pers.push($(xml).find("Perso").text());
        credit = $(xml).find("value").text();
        return errorCode;
    }

    function checkDuplicate(voucherCode) {
        var voucherCodeArray = [];
        if (window.localStorage.getArray("voucherCodeArray") !== null) {
            voucherCodeArray = window.localStorage.getArray("voucherCodeArray");
            for (var i = 0; i < voucherCodeArray.length; ++i) {
                if (voucherCodeArray[i] === voucherCode) {
                    return false;
                }
            }
        }
        voucherCodeArray.push(voucherCode);
        window.localStorage.setArray("voucherCodeArray", voucherCodeArray);
        return true;
    }
}

//Voucher waarde opslaan
function setCredit(c) {
    if (window.localStorage.getItem("credit", c) !== null) {
        var cc = window.localStorage.getItem("credit", c);
        c = +c + +cc;
    }
    window.localStorage.setItem("credit", c);
}

//Persoonlijke pagina van het bedrijf gekoppeld aan een voucher
function maakPersPagina(pers) {
    var contentList;
    var header = '<div data-role="header" id="headerPers"  data-position="fixed" data-tap-toggle="false" data-theme=\'b\'>\n\
                <h1>' + pers[0] + '</h1>\n\
                <a href="index.html"><img src="' + pers[1] + '" class="autoresize" alt="swingGiftLogo"/> </a>\n\
                <a href="#info" data-icon="info" data-role="button">Info</a></div>';
    if (pers[3] !== "") {
        contentList = '<div data-role="content" data-theme=\'b\'>\n\
                <ul data-role="listview" data-inset="false" data-icon="false" data-divider-theme="b">\n\
                <li data-role="list-divider">\n\
                        ' + pers[2] + '\n\
                    </li>\n\
                    <li>\n\
                        <div class="wrapper">\n\
                            <div class="h_iframe">\n\
                                <img class="ratio" src="img/ratioVideo.gif" alt="ratio"/>\n\
                                <iframe src="' + pers[3] + '" frameborder="0" allowfullscreen></iframe>\n\
                            </div>\n\
                        </div>\n\
                    </li>\n\
                    <li>\n\
                        <div data-role=\'collapsible\' data-content-theme=\'b\'>\n\
                            <h4>' + pers[4] + '</h4>\n\
                            <div>' + pers[5] + '</div>\n\
                        </div></li><li>\n\
                        <a href="#shop" data-icon="check" data-role="button" >Let\'s start shopping!</a>\n\
                    </li></ul>';
    }
    else {
        contentList = '<div data-role="content" data-theme=\'b\'>\n\
                <ul data-role="listview" id="listPers" data-inset="false" data-icon="false" data-divider-theme="b">\n\
                <li data-role="list-divider">\n\
                        ' + pers[2] + '\n\
                    </li>\n\
                    <li>\n\
                            <h4>' + pers[4] + '</h4>\n\
                            <p>' + pers[5] + '</p>\n\
                        </li><li>\n\
                        <a href="#shop" data-icon="check" data-role="button" >Let\'s start shopping!</a>\n\
                    </li></ul>';
    }
    var footer =
            '<div data-position="fixed" data-tap-toggle="false" data-role="footer" data-theme=\'b\'>\n\
                <div data-role="navbar">\n\
                    <ul>\n\
                        <li><a href="#shop" data-icon="gift">Shop</a></li>\n\
                        <li><a href="#index" data-icon="home">Home</a></li>\n\
                        <li><a href="#voucher" data-icon="barcode">Voucher</a></li> \n\
                    </ul>\n\
                </div>\n\
            </div>';
    $('#personalisatie').html(header + contentList + footer).trigger("pagecreate");
}

//Overzicht opmaken van de aankoop
function maakOverzicht(betalingArray) {
    var winkelmandArray = getWinkelmandArray();
    var thema = winkelmandArray[0];
    var boodschap = winkelmandArray[1];
    var voornaam = winkelmandArray[2];
    var naam = winkelmandArray[3];
    var leveringsdatum = winkelmandArray[4];
    if (leveringsdatum !== "")
        leveringsdatum = " op " + leveringsdatum;
    var voornaamBetaling = betalingArray[0];
    var naamBetaling = betalingArray[1];
    var emailBetaling = betalingArray[2];
    var telefoon = betalingArray[3];
    var betalingSoort = betalingArray[4];

    var totaleprijs = getTotalePrijs();
    var transport;
    var transportKost = 0;
    if (winkelmandArray[5] === "afhalen")
        transport = "U heeft gekozen om uw bon op te halen bij SwingGroup";
    else {
        var land = winkelmandArray[11];
        if (land === "belgie")
            transportKost = 5.95;
        else {
            if (land === "nederland")
                transportKost = 8.95;
            else {
                if (land === "duitsland" || land === "frankrijk")
                    transportKost = 10.95;
                else
                    transportKost = 9.95;
            }

        }
        transport = "U heeft gekozen om uw bon op te sturen via Taxipost (+ €" + transportKost + ")";
    }
    $('#themaContent').html(thema);
    $('#boodschapContent').html(boodschap);
    $('#voornaamContent').html(voornaam);
    $('#naamContent').html(naam);
    $('#leveringsdatumContent').html(leveringsdatum);
    $('#voornaamBetaling').html(voornaamBetaling);
    $('#naamBetaling').html(naamBetaling);
    $('#emailBetaling').html(emailBetaling);
    $('#tel').html(telefoon);
    $('#transportContent').html(transport);
    $('#betalingskeuze').html(betalingSoort);
    $('#prijsOverzicht').html(+totaleprijs + +transportKost);

    setOrdersArray(betalingArray);
}

//Order plaatsen via webservice & Ogone activeren indien nodig
function orderPlaatsen() {
    var orderArray = getOrdersArray();
    var winkelArray = getWinkelmandArray();

    var voornaamBetaling = orderArray[0];
    var naamBetaling = orderArray[1];
    var email = orderArray[2];
    var telefoon = orderArray[3];
    var betalingSoort = orderArray[4];
    var companyName = "";
    var street = "";
    var nr = "";
    var bus = "";
    var postcode = "";
    var plaats = "";
    var land = "";

    if (emailLever !== 2 && winkelArray[4] === "taxipost") {
        companyName = winkelArray[5];
        street = winkelArray[6];
        nr = winkelArray[7];
        bus = winkelArray[8];
        postcode = winkelArray[9];
        plaats = winkelArray[10];
        land = winkelArray[11];
    }

    var languageID = 1;

    var ordersArrayXML =
            '<Orders>' +
            '<languageID>' + languageID + '</languageID>' +
            '<firstname>' + voornaamBetaling + '</firstname>' +
            '<name>' + naamBetaling + '</name>' +
            '<email>' + email + '</email>' +
            '<telefoon>' + telefoon + '</telefoon>' +
            '<companyName>' + companyName + '</companyName>' +
            '<street>' + street + '</street>' +
            '<nr>' + nr + '</nr>' +
            '<bus>' + bus + '</bus>' +
            '<postcode>' + postcode + '</postcode>' +
            '<plaats>' + plaats + '</plaats>' +
            '<countryID>' + land + '</countryID>' +
            '<isTest>true</isTest>' +
            '</Orders>';

    for (var i = 0; i < filledArray.length; ++i) {
        var giftID = filledArray[i][0];
        var price_inclBTW = filledArray[i][1];
        var quantity = filledArray[i][2];

        var OrderdetailsArray =
                '<Orderdetails>' +
                '<giftID>' + giftID + '</giftID>' +
                '<quantity>' + quantity + '</quantity>' +
                '<languageID>' + languageID + '</languageID>' +
                '<price_incl>' + price_inclBTW + '</price_incl>' +
                '</Orderdetails>';

        ordersArrayXML += OrderdetailsArray;
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://ws.swinggift.com/SGServices.asmx?op=PlacingOrder', true);

    // build SOAP request
    var sr =
            '<?xml version="1.0" encoding="UTF-8"?>' +
            '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://tempuri.org/">' +
            '<SOAP-ENV:Body>' +
            '<PlacingOrder  xmlns="http://tempuri.org/">' +
            '<ns1:logoncode>THIJS123</ns1:logoncode>' +
            '<MyOrders>' + ordersArrayXML + '</MyOrders>' +
            '</PlacingOrder >' +
            '</SOAP-ENV:Body>' +
            '</SOAP-ENV:Envelope>';

    // Send the POST request
    xmlhttp.setRequestHeader('Content-Type', "text/xml; charset=\"utf-8\"");
    xmlhttp.setRequestHeader('SOAPAction', 'http://tempuri.org/PlacingOrder');
    xmlhttp.setRequestHeader("Accept", "application/xml", "text/xml", "\*/\*");

    xmlhttp.send(sr);
    // send request
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                var response = xmlhttp.responseText;

                var orderID = $(response).find("OrderID").text();
                var totalprice_inclBTW = $(response).find("OrderID").text();

                var errorCode = $(response).find("errorCode").text();

                if (betalingSoort === "Online") {
                    ogone(orderArray, orderID, totalprice_inclBTW);
                }
                else {
                    $('#overschrijvingContent').html("<p>Gelieve €" + totalprice_inclBTW + " over te schrijven naar XXXXX. <br/> Uw order nummer is " + orderID + " <br/> Na overschrijving verzenden wij uw order! Begunstigde rekening: 738-0216946-76 Begunstigde IBAN: BE91 7380 2169 4676 Begunstigde BIC: KREDBEBB Begunstigde naam: SwingGroup</p>").trigger("create");
                    $.mobile.changePage('#overschrijving1');
                }
            }
        }
    };

}

function ogone(orderArray, id, totalprice_inclBTW) {
    var prijs = 1500;
    var naamBetaling = orderArray[1];
    var email = orderArray[2];
    var telefoonNummer = orderArray[3];
    var sha1 = "Test123Test123Test123";
    var taal = "nl_NL";
    var orderID = "test123";
    var sha = 'AMOUNT=' + prijs + sha1 + 'CURRENCY=EUR' + sha1 +
            'LANGUAGE=' + taal + sha1 + 'ORDERID=' + orderID + sha1 +
            'PSPID=QCSREW' + sha1;

    var ogoneForm =
            '<form method="post" action="https://secure.ogone.com/ncol/test/orderstandard.asp" id="ogoneForm" name="ogoneForm">' +
            '<!-- Algemene parameters -->' +
            '<input type="hidden" name="PSPID" value="QCSREW">' +
            '<input type="hidden" name="ORDERID" value="' + orderID + '">' +
            '<input type="hidden" name="AMOUNT" value="' + prijs + '">' +
            '<input type="hidden" name="CURRENCY" value="EUR">' +
            '<input type="hidden" name="LANGUAGE" value="' + taal + '">' +
            '<!--optional -->' +
            '<input type="hidden" name="CN" value="' + naamBetaling + '">' +
            '<input type="hidden" name="EMAIL" value="' + email + '">' +
            '<input type="hidden" name="OWNERTELNO" value="' + telefoonNummer + '">' +
            '<input type="hidden" name="COM" value="">' +
            '<!-- controle voor de betaling: zie Beveiliging: Controle voor de betaling -->' +
            '<input type="hidden" name="SHASIGN" value="' + SHA1(sha) + '">' +
            '<!-- layout informatie: zie “Look and feel” van de betaalpagina -->' +
            '<input type="hidden" name="TP" value="PaymentPage_1_iPhone.htm">' +
            '<input type="hidden" name="TITLE" value="SwingGift payment">' +
            '<input type="hidden" name="BGCOLOR" value="#FFFFFF">' +
            '<input type="hidden" name="TXTCOLOR" value="#666666">' +
            '<input type="hidden" name="TBLBGCOLOR" value="orange">' +
            '<input type="hidden" name="TBLTXTCOLOR" value="#FFFFFF">' +
            '<input type="hidden" name="HDTBLBGCOLOR" value="orange">' +
            '<input type="hidden" name="HDTBLTXTCOLOR" value="#FFFFFF">' +
            '<input type="hidden" name="HDFONTTYPE" value="">' +
            '<input type="hidden" name="BUTTONBGCOLOR" value="orange">' +
            '<input type="hidden" name="BUTTONTXTCOLOR" value="#FFFFFF">' +
            '<input type="hidden" name="FONTTYPE" value="">' +
            '<!-- feedback na de betaling: zie Transactie feedback naar de klant -->' +
            '<input type="hidden" name="HOMEURL" value="SwingGiftApp://index.html">' +
            '<input type="hidden" name="ACCEPTURL" value="SwingGiftApp/index.html">' +
            '<input type="hidden" name="DECLINEURL" value="SwingGiftApp/index.html">' +
            '<input type="hidden" name="EXCEPTIONURL" value="SwingGiftApp/index.html">' +
            '<input type="hidden" name="CANCELURL" value="SwingGiftApp/index.html">' +
            '</form>';

    $('#ogone').html(ogoneForm).trigger("create");
    document.getElementById('ogoneForm').submit();

}


//Alle evouchers in een array steken
function arrayEvouchers(tx, results) {
    var arrayEvoucher = [];
    for (var i = 0; i < results.rows.length; i++)
        arrayEvoucher.push(results.rows.item(i).giftID);

    window.localStorage.setArray("arrayEvoucher", arrayEvoucher);
}