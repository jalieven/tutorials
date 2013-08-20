var tutorial = angular.module('tutorial', []);

tutorial.controller('FilterController', function ($scope) {

    d3.json("data/air_data.json", function (json) {
        airData = crossfilter(json.data);
        // calculate some totals
        var tupleCount = airData.groupAll().reduceCount().value();
        var totalAmount = airData.groupAll().reduceSum(function(fact) { return fact.a; }).value();
        console.log('Total tuples: ' + tupleCount);
        console.log('Total of all amounts: ' + totalAmount);
        // now filter on year
        var yearDimension = airData.dimension(function(d) { return d.y; });
        yearDimension.filter(2009);
        var tupleCount2009 = airData.groupAll().reduceCount().value();
        var totalAmount2009 = airData.groupAll().reduceSum(function(fact) { return fact.a; }).value();
        console.log('Total tuples for 2009: ' + tupleCount2009);
        console.log('Total of all amounts for 2009: ' + totalAmount2009);
        // now filter by sub(stance), m(unicipality) and y(ear) and group by s(ector)
        yearDimension.filter(2010);
        var substanceDimension = airData.dimension(function(d) { return d.sub; });
        substanceDimension.filter("CO");
        var municipalityDimension = airData.dimension(function(d) { return d.m; });
        municipalityDimension.filter("AALST");
        var allFiltered = municipalityDimension.top(Infinity);
        console.log('Filtered tuple count: ' + allFiltered.length);
        var tupleCount2010COAalst = airData.groupAll().reduceCount().value();
        console.log('Total tuples for 2010 and CO in Aalst: ' + tupleCount2010COAalst);
        // now only filter by sub(stance), m(unicipality) and sum the amount grouped by y(ear)
        yearDimension.filterAll();
        var barYearResults = yearDimension.group().reduceSum(function(fact) { return fact.a; }).all();
    });


});