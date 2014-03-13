var aantalItems;
var totalePrijs;

function setTotalePrijs(prijs){
    if(totalePrijs==="")
        totalePrijs = 0;
    else{
        totalePrijs= prijs + totalePrijs;
    }
}

function setAantalItems(aantal){
    if(aantalItems==="")
        aantalItems = 0;
    else{
        aantalItems= aantal + aantalItems;
    }
}

function updateWinkelmand(prijs, aantal){
    setAantalItems(aantal);
    setTotalePrijs(prijs);
}

function winkelmandje() {
    $('#addItem').submit();
    
    var aantal = document.getElementById("addItem").elements.namedItem("aantal").value;
    var prijs = document.getElementById("addItem").elements.namedItem("prijs").value;
    updateWinkelmand(prijs, aantal);
}