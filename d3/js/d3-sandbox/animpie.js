var diffuse_lucht = [
    {'id': 1, 'year': 2009, 'municipality': 'Haaltert', 'substance': 'NH3', 'amount': 205.23},
    {'id': 2, 'year': 2009, 'municipality': 'Haaltert', 'substance': 'ASBESTOS', 'amount': 5.45},
    {'id': 3, 'year': 2009, 'municipality': 'Gent', 'substance': 'NH3', 'amount': 185.2},
    {'id': 4, 'year': 2009, 'municipality': 'Gent', 'substance': 'ASBESTOS', 'amount': 100.85},
    {'id': 5, 'year': 2009, 'municipality': 'Aalst', 'substance': 'NH3', 'amount': 105.25},
    {'id': 6, 'year': 2009, 'municipality': 'Aalst', 'substance': 'ASBESTOS', 'amount': 5.25},
    {'id': 7, 'year': 2009, 'municipality': 'Antwerpen', 'substance': 'NH3', 'amount': 125.01},
    {'id': 8, 'year': 2009, 'municipality': 'Antwerpen', 'substance': 'ASBESTOS', 'amount': 105.25},
    {'id': 9, 'year': 2010, 'municipality': 'Haaltert', 'substance': 'NH3', 'amount': 85.23},
    {'id': 10, 'year': 2010, 'municipality': 'Haaltert', 'substance': 'ASBESTOS', 'amount': 7.45},
    {'id': 11, 'year': 2010, 'municipality': 'Gent', 'substance': 'NH3', 'amount': 10745.2},
    {'id': 12, 'year': 2010, 'municipality': 'Gent', 'substance': 'ASBESTOS', 'amount': 200.85},
    {'id': 13, 'year': 2010, 'municipality': 'Aalst', 'substance': 'NH3', 'amount': 155.27},
    {'id': 14, 'year': 2010, 'municipality': 'Aalst', 'substance': 'ASBESTOS', 'amount': 5.77},
    {'id': 15, 'year': 2010, 'municipality': 'Antwerpen', 'substance': 'NH3', 'amount': 4005.41},
    {'id': 16, 'year': 2010, 'municipality': 'Antwerpen', 'substance': 'ASBESTOS', 'amount': 104.20},
    {'id': 17, 'year': 2011, 'municipality': 'Haaltert', 'substance': 'NH3', 'amount': 125.23},
    {'id': 18, 'year': 2011, 'municipality': 'Haaltert', 'substance': 'ASBESTOS', 'amount': 7.45},
    {'id': 19, 'year': 2011, 'municipality': 'Gent', 'substance': 'NH3', 'amount': 45.3},
    {'id': 20, 'year': 2011, 'municipality': 'Gent', 'substance': 'ASBESTOS', 'amount': 2.85},
    {'id': 21, 'year': 2011, 'municipality': 'Aalst', 'substance': 'NH3', 'amount': 15.24},
    {'id': 22, 'year': 2011, 'municipality': 'Aalst', 'substance': 'ASBESTOS', 'amount': 5.77},
    {'id': 23, 'year': 2011, 'municipality': 'Antwerpen', 'substance': 'NH3', 'amount': 405.45},
    {'id': 24, 'year': 2011, 'municipality': 'Antwerpen', 'substance': 'ASBESTOS', 'amount': 4.24}
];

var mapped_diffuse_lucht = d3.nest()
    .key(function (d) {
        return d.year;
    }).sortKeys(d3.ascending)
    .key(function (d) {
        return d.substance;
    }).sortKeys(d3.ascending)
    .map(diffuse_lucht, d3.map);

var nh3_2009 = mapped_diffuse_lucht.get(2009).get('NH3');
nh3_2009 = addPercentages(nh3_2009);

function addPercentages(d3Map) {
    var total = 0;
    d3Map.forEach(function (d) {
        total += d.amount;
    });

    d3Map.forEach(function (d) {
        d.percentage = ((d.amount / total) * 100).toFixed(2);
        d.label = d.municipality;
        d.value = d.amount;
    });
    return d3Map;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.category20();

var pie = d3.layout.pie()
    .value(function (d) {
        return d.value;
    })
    .sort(null);

var arc = d3.svg.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 20);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var path = svg.selectAll("path");


function change(data) {

    var data0 = path.data(),
        data1 = pie(data);

    path = path.data(data1, key);

    path.enter()
        .append("path")
        .each(function (d, i) {
            this._current = findNeighborArc(i, data0, data1, key) || d;
        })
        .attr("fill", function (d) {
            return color(d.data.label);
        })
        .append("title")
        .text(function (d) {
            return d.data.label + ': ' + d.data.percentage + "% (amount: " + d.data.value + ")";
        });

    function angle(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        return a > 90 ? a - 180 : a;
    }

    path.exit()
        .datum(function (d, i) {
            return findNeighborArc(i, data1, data0, key) || d;
        })
        .transition()
        .duration(750)
        .attrTween("d", arcTween)
        .text(function (d) {
            return d.data.label + ': ' + d.data.percentage + "% (amount: " + d.data.value + ")";
        })
        .remove();

    path.transition()
        .duration(750)
        .attrTween("d", arcTween);

    path.select("title").text(function (d) {
        return d.data.label + ': ' + d.data.percentage + "% (amount: " + d.data.value + ")";
    });

    path.on("mouseover", function (d) {
//        alert(d.data.label);
    });
}

function key(d) {
    return d.data.label;
}

function type(d) {
    d.value = +d.value;
    return d;
}

function findNeighborArc(i, data0, data1, key) {
    var d;
    return (d = findPreceding(i, data0, data1, key)) ? {startAngle: d.endAngle, endAngle: d.endAngle}
        : (d = findFollowing(i, data0, data1, key)) ? {startAngle: d.startAngle, endAngle: d.startAngle}
        : null;
}

// Find the element in data0 that joins the highest preceding element in data1.
function findPreceding(i, data0, data1, key) {
    var m = data0.length;
    while (--i >= 0) {
        var k = key(data1[i]);
        for (var j = 0; j < m; ++j) {
            if (key(data0[j]) === k) return data0[j];
        }
    }
}

// Find the element in data0 that joins the lowest following element in data1.
function findFollowing(i, data0, data1, key) {
    var n = data1.length, m = data0.length;
    while (++i < n) {
        var k = key(data1[i]);
        for (var j = 0; j < m; ++j) {
            if (key(data0[j]) === k) return data0[j];
        }
    }
}

function arcTween(d) {
    var i = d3.interpolate(this._current, d);
    this._current = i(0);
    return function (t) {
        return arc(i(t));
    };
}

$("#years").change(function () {
    $("select option:selected").each(function () {
        var year = $(this).text();
        var substance = $('input:radio[name=substance]:checked').val();
        change(addPercentages(mapped_diffuse_lucht.get(year).get(substance)));
    });
})

$("input:radio[name=substance]").change(function () {
    var substance = $('input:radio[name=substance]:checked').val();
    $("select option:selected").each(function () {
        var year = $(this).text();
        change(addPercentages(mapped_diffuse_lucht.get(year).get(substance)));
    });
})

change(nh3_2009);


