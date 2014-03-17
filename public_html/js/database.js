document.addEventListener("deviceready", onDeviceReady, false);
var giftID;
// PhoneGap is ready
//
function onDeviceReady() {
    console.log("ready");
    var db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);
    db.transaction(populateDB, errorCB, successCB());
}

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

function populateDB(tx) {
    console.log("populateDB");
    tx.executeSql('DROP TABLE IF EXISTS vouchers');
    tx.executeSql('CREATE TABLE IF NOT EXISTS vouchers (giftID unique, supplierName, title_NL, title_FR, decr_NL, decr_FR, brands_NL, brands_FR, exclusion_NL, exclusion_FR, price_inclBTW, serviceFee, isEvoucher, isFixValidDate, Validtxt, mainAfb, detailAfb1, detailAfb2, detailAfb3)');
    xmlParse();

}

function errorCB(err) {
    console.log("Error processing SQL: " + err.code);
}

// Transaction success callback
//
function successCB() {
    db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);
    db.transaction(queryDB, errorCB);

}

function successCB2(i) {
    db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);
    setGiftID(i);
    db.transaction(queryDB2, errorCB);

}

function queryDB(tx) {
    console.log("qyeryDB");
    tx.executeSql('SELECT * FROM vouchers', [], listItems, errorCB);
}

function queryDB2(tx) {
    console.log("qyeryDB2");
    var id = Number(getGiftID());
    tx.executeSql('SELECT * FROM vouchers where giftID="'+id+'"', [], detailItem, errorCB);
}


function querySuccess(tx, results) {
    console.log("querySuccess");
    var len = results.rows.length;
    console.log("Vouchers table: " + len + " rows found.");
    for (var i = 0; i < len; i++) {
        console.log("Row = " + i + " ID = " + results.rows.item(i).giftID + "title = " + results.rows.item(i).title_NL);
    }
}

function xmlParse() {
    $.ajax({
        type: "GET",
        url: "testVoucher.xml",
        dataType: "xml",
        success: function(xml) {
            $(xml).find('voucher').each(function() {
                var voucher = [];
                voucher.push($(this).find("giftID").text());
                voucher.push($(this).find("supplierName").text());
                voucher.push($(this).find("title_NL").text());
                voucher.push($(this).find("title_FR").text());
                voucher.push($(this).find("decr_NL").text());
                voucher.push($(this).find("decr_FR").text());
                voucher.push($(this).find("title_FR").text());
                voucher.push($(this).find("title_FR").text());
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
                console.log(voucher);
                db.transaction(function(tx) {
                    tx.executeSql('INSERT INTO vouchers (giftID, supplierName, title_NL, title_FR, decr_NL, decr_FR, brands_NL, brands_FR, exclusion_NL, exclusion_FR, price_inclBTW, serviceFee, isEvoucher, isFixValidDate, Validtxt, mainAfb, detailAfb1, detailAfb2, detailAfb3) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', voucher);
                });
            });
        }

    }
    );
}

function listItems(tx, results) {

    var len = results.rows.length;

    for (var i = 0; i < len; i++) {
        var id = results.rows.item(i).giftID;
        var imageUrl = results.rows.item(i).mainAfb;
        var titel = results.rows.item(i).title_NL;
        var prijs = results.rows.item(i).price_inclBTW;

        var content =
                '<li><a href = #item onclick="successCB2('+id+')">\n\
            <img src = ' + imageUrl + ' >\n\
            <h2> ' + titel + ' </h2>\n\
            <p> Prijs: &#8364; ' + prijs + ' </p>\n\
            </a></li>';

        
        $('#searchShop').append(content);
        
    }

    var einde = '<li><a href = "#alleBonnen" > Meer... </a></li>';
    $('#searchShop').append(einde);

    $('ul').listview('refresh');
 

}

function detailItem(tx, results) {
    
    var id = results.rows.item(0).giftID;
    var imageUrl = results.rows.item(0).mainAfb;
    var titel = results.rows.item(0).title_NL;
    var prijs = results.rows.item(0).price_inclBTW;
    var omschrijving = results.rows.item(0).decr_NL;

    var content =
            '<ul data-role="listview" data-inset="false" data-icon="false" data-divider-theme=\'b\'>\n\
                    <li data-role="list-divider">\n\
                        <a href="#" data-rel="back" data-icon="mail-reply" data-role="button" data-inline="true" data-mini="true" >Go back</a>\n\
                        <a href="#popupDialog'+id+'" data-rel=\'popup\' data-position-to=\'window\' data-icon="plus" data-role="button" data-inline="true" data-transition=\'pop\' data-mini="true" >Buy this!</a>\n\
                        <a href="#shoppingcart" data-role="button" data-inline="true" data-mini="true" style="float: right;" ><img src="img/icon_shoppingcard.png" alt="winkelmand"/></a>\n\
                    </li>\n\
                    <li id="'+ id +'">\n\
                        <img src="'+ imageUrl + '">\n\
                        <h2>'+ titel + '</h2>\n\
                        <p>Prijs: &#8364;'+ prijs + '</p>\n\
                        <p> '+ omschrijving + '\n\
                        </p>\n\
                    </li>\n\
                </ul>\n\
                <div data-role=\'popup\' id=\'popupDialog'+id+'\' data-theme=\'b\'>\n\
                    <div data-role=\'content\' data-theme=\'b\'>\n\
                        <form id="addItem">\n\
                            <label for="slider2b">How much?</label>\n\
                            <input type="number" name="aantal" value="1"/>\n\
                            <input type="hidden" name="id" value="'+ id +'" />\n\
                        </form>\n\
                        <div class=\'showastabs center nobg\'>\n\
                             <a href="#shop" data-icon="ok" data-iconpos="left" data-role="button" data-inline="true" onclick="winkelmandje()">Add</a>\n\
                            <a href="#" data-rel=\'back\' data-icon="delete" data-iconpos="left" data-role="button" data-inline="true">Cancel</a>\n\
                        </div>\n\
                    </div>\n\
                </div>';
    
    $('#itemContent').html(content).trigger( "create" );
}
