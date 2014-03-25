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

function successCB3() {
    db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);
    db.transaction(queryDB3, errorCB);

}

function queryDB(tx) {
    console.log("qyeryDB");
    tx.executeSql('SELECT * FROM vouchers', [], listItems, errorCB);
}

function queryDB2(tx) {
    console.log("qyeryDB2");
    var id = Number(getGiftID());
    tx.executeSql('SELECT * FROM vouchers where giftID="' + id + '"', [], detailItem, errorCB);
}

function queryDB3(tx) {
    tx.executeSql('SELECT * FROM vouchers WHERE giftID IN (' + getIds() + ')', [], shoppingCart, errorCB);
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
                '<li><a href = #item onclick="successCB2(' + id + ')">\n\
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
                        <a href="#popupDialog' + id + '" data-rel=\'popup\' data-position-to=\'window\' data-icon="plus" data-role="button" data-inline="true" data-transition=\'pop\' data-mini="true" >Buy this!</a>\n\
                        <a href="#shoppingcart" data-role="button" data-inline="true" data-mini="true" style="float: right;" ><img src="img/icon_shoppingcard.png" alt="winkelmand"/></a>\n\
                    </li>\n\
                    <li id="' + id + '">\n\
                        <img src="' + imageUrl + '">\n\
                        <h2>' + titel + '</h2>\n\
                        <p>Prijs: &#8364;' + prijs + '</p>\n\
                        <p> ' + omschrijving + '\n\
                        </p>\n\
                    </li>\n\
                </ul>\n\
                <div data-role=\'popup\' id=\'popupDialog' + id + '\' data-theme=\'b\'>\n\
                    <div id="change" data-role=\'content\' data-theme=\'b\'>\n\
                        <form id="addItem' + id + '">\n\
                            <label>How many?</label>\n\
                            <input id="aantalLabel' + id + '" type="number" name="aantal" value="1"/>\n\
                            <input id="idInput" type="hidden" name="id" value="' + id + '" />\n\
                            <input id="prijsLabel' + id + '" type="hidden" name="prijs" value="' + prijs + '" />\n\
                            <label  name="prijs">Totale prijs: &#8364;<span id="prijsCalcu' + id + '">' + prijs + '</span></label> \n\
                        </form>\n\
                        <div>\n\
                        <a href="#shop" data-icon="ok" data-iconpos="left" data-role="button" data-inline="true" onclick="winkelmandje(' + id + ')">Add</a>\n\
                            <a href="#" data-rel=\'back\' data-icon="delete" data-iconpos="left" data-role="button" data-inline="true">Cancel</a>\n\
                        </div>\n\
                    </div>\n\
                </div>';

    $('#itemContent').html(content).trigger("create");

    $(document).on('change', '#change', function() {
        console.log("change fuctie");
        var aantal = $('#aantalLabel' + id + '').val();
        var prijs = $('#prijsLabel' + id + '').val();
        calcPrijs(aantal, prijs);
    });


    function calcPrijs(aantal, prijs) {
        console.log(aantal + prijs);
        $('#prijsCalcu' + id + '').text(aantal * prijs);
    }
    ;
}

function shoppingCart(tx, results) {
    var totaleprijs = 0;
    console.log("winkemand items toevoegen");

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
            var prijs = results.rows.item(i).price_inclBTW;
            var aantal = getAantalItem(id);
            
            var con =
                    '<li id="' + id + '">\n\
                        <h2>' + titel + ' <a href="#" onclick="deleteItem(' + id + ')" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right" style="float:right;"></a>\n\
                        <span style="float: right;">\n\
                        <input id="aantalItem' + id + '" type="number" name="aantal" min=1 value="'+aantal+'" style="width: 3rem;"/>x \n\
                        &#8364; ' + prijs + '</span></h2>\n\
                    </li>';
            
            content2 += con;
            totaleprijs += +prijs * +aantal;
        }
    }

    var content3 = '<li data-role="list-divider" style="text-align: right;">\n\
                        Totale prijs: &#8364; ' + totaleprijs + '\n\
                    </li>\n\
                    <li>\n\
                        <a href="#betaalgegevens" data-role="button" data-icon="truck">Complete order</a>\n\
                    </li></ul>';


    $('#shoppingContent').html(content1 + content2 + content3).trigger("create");
    
    $(document).on('change', "#aantalItem"+id, function() {
                console.log("change aantalitem" + $('#aantalItem' + id + '').val());
                var a = $('#aantalItem' + id + '').val();
                var a2 = getAantalItem(id);
                var aantalNieuw =  +a - +a2;
                console.log("change aantalNieuw" + aantalNieuw);
                updateWinkelmand(id, prijs, aantalNieuw);
                successCB3();
            });
}
