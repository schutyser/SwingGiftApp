document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
//
function onDeviceReady() {
    console.log("ready");
    var db = window.openDatabase("voucher", "1.0", "Voucher database", 1000000);
    db.transaction(populateDB, errorCB, successCB());
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

function queryDB(tx) {
    console.log("qyeryDB");
    tx.executeSql('SELECT giftID, title_NL FROM vouchers', [], querySuccess, errorCB);
}


function querySuccess(tx, results) {
    console.log("querySuccess");
    var len = results.rows.length;
    document.getElementById('testSQL').innerHTML = "Vouchers table: " + len + " rows found.";
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
