var tutorial = angular.module('tutorial', ['arcTween', 'pieChart', 'animPieChart']);

tutorial.controller('ChartController', function ($scope) {
//    $scope.data = [
//        {"label": "one", "value": 20},
//        {"label": "two", "value": 50},
//        {"label": "three", "value": 40},
//        {"label": "four", "value": 20},
//        {"label": "five", "value": 10},
//        {"label": "six", "value": 50},
//        {"label": "seven", "value": 30},
//        {"label": "eight", "value": 40}
//    ];
//
//    var updateChartData = function () {
//        $scope.data = [
//            {"label": "one", "value": Math.random() * 100},
//            {"label": "two", "value": Math.random() * 100},
//            {"label": "three", "value": Math.random() * 100},
//            {"label": "four", "value": Math.random() * 100},
//            {"label": "five", "value": Math.random() * 100},
//            {"label": "six", "value": Math.random() * 100},
//            {"label": "seven", "value": Math.random() * 100},
//            {"label": "eight", "value": Math.random() * 100}
//        ];
//        $scope.$apply();
//    };
//
//    setInterval(updateChartData, 2000);


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

    nh3_2009 = addPercentages(nh3_2009);
    $scope.data = nh3_2009;
});