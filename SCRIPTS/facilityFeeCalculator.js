var totalFe = 5;
var totalNf = 10;
var totalCat = 1;
var fePricePerGt = 0;
var nfPricePerLb = 0;
var catPricePerCount = 0;

//Region Variables - THIS IS WHAT YOU CHANGE - based on current rates
var regions = {
    NE: {
        fePricePerGt: 5,
        nfPricePerLb: 0.01,
        catPricePerCount: 1,
    },
    SW: {
        fePricePerGt: 10,
        nfPricePerLb: 0.01,
        catPricePerCount: 1,
    },
    WC: {
        fePricePerGt: 4,
        nfPricePerLb: 0.01,
        catPricePerCount: 1,
    },
    "WN US": {
        fePricePerGt: 4,
        nfPricePerLb: 0.01,
        catPricePerCount: 1,
    },
    "WN CAN": {
        fePricePerGt: 4,
        nfPricePerLb: 0.01,
        catPricePerCount: 1,
    },
    "SEC & PR": {
        fePricePerGt: 3,
        nfPricePerLb: 0.01,
        catPricePerCount: 1,
    },
    HI: {
        fePricePerGt: 0,
        nfPricePerLb: 0.01,
        catPricePerCount: 1,
    },
    SC: {
        fePricePerGt: 0,
        nfPricePerLb: 0.01,
        catPricePerCount: 1,
    },
};

$(document).ready(function () {
    redraw();
    drawRegionDropdown();
    $("#regionSelection").change(function () {
        clearCalc();
    });
});

function redraw() {
    drawFER();
    drawNFR();
    drawCat();
    clearCalc();
}

function clearCalc() {
    $("#totalFeWeightLbs").text("");
    $("#totalFeWeightGt").text("");
    $("#feTotalFee").text("");
    $("#totalNfWeightLbs").text("");
    $("#nfTotalFee").text("");
    $("#totalCatCount").text("");
    $("#catTotalFee").text("");
}

function setPrices() {
    fePricePerGt =
        regions[$("#regionSelection").find(":selected").text()]["fePricePerGt"];
    nfPricePerLb =
        regions[$("#regionSelection").find(":selected").text()]["nfPricePerLb"];
    catPricePerCount =
        regions[$("#regionSelection").find(":selected").text()][
            "catPricePerCount"
        ];
}

function calcFe() {
    try {
        setPrices();
        let total = 0;
        for (let i = 1; i < totalFe + 1; i++) {
            total += parseVal("#ferrWeight" + i);
        }
        $("#totalFeWeightLbs").text(total);
        let gt = total / 2240;
        $("#totalFeWeightGt").text(gt.toFixed(2));
        let feFee = gt * fePricePerGt;
        $("#feTotalFee").text("$" + feFee.toFixed(2));
    } catch (error) {
        console.error(error);
    }
}

function calcNf() {
    try {
        setPrices();
        let total = 0;
        for (let i = 1; i < totalNf + 1; i++) {
            total += parseVal("#nfWeight" + i);
        }
        $("#totalNfWeightLbs").text(total);
        let nfFee = total * nfPricePerLb;
        $("#nfTotalFee").text("$" + nfFee.toFixed(2));
    } catch (error) {
        console.error(error);
    }
}

function calcCat() {
    try {
        setPrices();
        let total = 0;
        for (let i = 1; i < totalCat + 1; i++) {
            total += parseVal("#catCount" + i);
        }
        $("#totalCatCount").text(total);
        let catFee = total * catPricePerCount;
        $("#catTotalFee").text("$" + catFee.toFixed(2));
    } catch (error) {
        console.error(error);
    }
}

function drawFER() {
    $("#feBlock").empty();
    for (let i = 1; i < totalFe + 1; i++) {
        $("#feBlock").append(
            "<label for='ferrWeight" +
                i +
                "'>Enter Weight in Lbs (FE Material " +
                i +
                ")</label>" +
                "<input type='number' id='ferrWeight" +
                i +
                "' name='ferrWeight" +
                i +
                "' min='0'><br>"
        );
    }
}

function drawNFR() {
    $("#nfBlock").empty();
    for (let i = 1; i < totalNf + 1; i++) {
        $("#nfBlock").append(
            "<label for='nfWeight" +
                i +
                "'>Enter Weight in Lbs (NF Material " +
                i +
                ")</label>" +
                "<input type='number' id='nfWeight" +
                i +
                "' name='nfWeight" +
                i +
                "' min='0'><br>"
        );
    }
}

function drawCat() {
    $("#catBlock").empty();
    for (let i = 1; i < totalCat + 1; i++) {
        $("#catBlock").append(
            "<label for='catCount" +
                i +
                "'>Enter Count (Cat Type " +
                i +
                ")</label>" +
                "<input type='number' id='catCount" +
                i +
                "' name='catCount" +
                i +
                "' min='0'><br>"
        );
    }
}

function drawRegionDropdown() {
    let keys = Object.keys(regions);
    for (let i = 0; i < keys.length; i++) {
        $("#regionSelection").append(
            $("<option>", {
                value: keys[i],
                text: keys[i],
            })
        );
    }
}

function parseVal(x) {
    return parseNum($(x).val());
}

function parseNum(x) {
    try {
        let y = parseInt(x);
        return Number.isNaN(y) ? 0 : y;
    } catch (error) {
        console.log(error);
        return 0;
    }
}
