var app = angular.module('App', ['ngAnimate', 'ngTouch', "ui.grid", 'ui.grid.exporter', 'ui.grid.grouping', 'ui.grid.moveColumns', 'ui.grid.pinning']);
app.controller('Ctrl', function ($scope, i18nService, uiGridConstants, uiGridGroupingConstants) {

    Promise.all([getContracts(), getAreas(),getWeeklyPeriods()]).then(function (d) {
        $scope.areas = d[1].d.results;
        $scope.contracts = d[0].d.results;
        $scope.periods = d[2].d.results;

    });

$scope.data = [];
    $scope.columns = [
    { field: 'Area', displayName: 'نام حوزه', width: 200, grouping: { groupPriority: 1 }},
    // { field: 'ContractName', displayName: 'نام پیمان', width: 250, pinnedRight: true },
    {grouping: { groupPriority: 2 },customTreeAggregationFinalizerFn: function (aggregation) { aggregation.rendered = aggregation.value; }, treeAggregationType: 'sum', width: 150, cellFilter: 'number: 0', field: 'MainOperation', displayName: 'عملیات اصلی' },
    {grouping: { groupPriority: 2 },customTreeAggregationFinalizerFn: function (aggregation) { aggregation.rendered = aggregation.value; }, treeAggregationType: 'sum', width: 150, cellFilter: 'number: 0', field: 'Operation', displayName: 'عملیات اجرایی' },
    {grouping: { groupPriority: 2 },customTreeAggregationFinalizerFn: function (aggregation) { aggregation.rendered = aggregation.value; }, treeAggregationType: 'sum', width: 150, cellFilter: 'number: 0', field: 'SubOperation', displayName: 'آیتم' },
    {grouping: { groupPriority: 2 },customTreeAggregationFinalizerFn: function (aggregation) { aggregation.rendered = aggregation.value; }, treeAggregationType: 'sum', width: 150, cellFilter: 'number: 0', field: 'Measurement', displayName: 'واحد' },
    {grouping: { groupPriority: 2 },customTreeAggregationFinalizerFn: function (aggregation) { aggregation.rendered = aggregation.value; }, treeAggregationType: 'sum', width: 150, cellFilter: 'number: 0', field: 'FinalVolume', displayName: 'مقدار کل کار' },
    {grouping: { groupPriority: 2 },customTreeAggregationFinalizerFn: function (aggregation) { aggregation.rendered = aggregation.value; }, treeAggregationType: 'sum', width: 150, cellFilter: 'number: 0', field: 'Constructed', displayName: 'انجام شده' },
    {grouping: { groupPriority: 2 },customTreeAggregationFinalizerFn: function (aggregation) { aggregation.rendered = aggregation.value; }, treeAggregationType: 'sum', width: 150, cellFilter: 'number: 0', field: 'Left', displayName: 'باقی مانده' },
    { field: 'ContractName', displayName: 'نام پیمان', width: 250, pinnedRight: true }];
    
    $scope.gridOptions = {
        data: $scope.data,
        enableSorting: true,

        treeRowHeaderAlwaysVisible: false,
        showColumnFooter: true,
        enableGridMenu: true,
        columnDefs: $scope.columns,
        //export
        exporterCsvFilename: $scope.pageTitle + '.csv',
        exporterPdfDefaultStyle: { fontSize: 9 },
        exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
        exporterPdfHeader: { text: $scope.pageTitle, style: 'headerStyle' },
        exporterPdfFooter: function (currentPage, pageCount) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function (docDefinition) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'A4',
        //   exporterPdfMaxGridWidth: 500,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: $scope.pageTitle + '.xlsx',
        exporterExcelSheetName: 'Sheet1',
        exporterOlderExcelCompatibility: true
        //export
    };
    i18nService.setCurrentLang('fa');
$scope.showData=function()
{
    var area =$scope.selectedArea.toString().replace(',','-');
    var cont = $scope.selectedContract.toString().replace(',','-');
    var per = $scope.selectedPeriod.toString().replace(',','-');
    var type=$scope.selectedType.toString().val();
   
    getWbsData(cont, area,per,type).done(function (c) {
      
        $scope.data = JSON.parse(c.d);
       


    });
}

function createTableData(){
    
}

});