var app = angular.module('App', ['ngAnimate', 'ngTouch',"ui.grid", 'ui.grid.exporter', 'ui.grid.grouping', 'ui.grid.moveColumns']);
app.controller('Ctrl', function ($scope, service, $q, i18nService, uiGridConstants, uiGridGroupingConstants) {



    $scope.orgColumns = [
        { field: 'tp_Title', displayName: 'نام' },
        { field: 'tp_RootFolder', displayName: 'RootFolder' },
        { field: 'tp_ServerTemplate', displayName: 'ServerTemplate' }
   ];


    $scope.columns = angular.copy($scope.orgColumns);

    $scope.gridOptions = {
        data: [],
        //  enableFiltering: true, showColumnFooter: true,
        enableGridMenu: true,
        columnDefs: $scope.columns,
        //export
        exporterCsvFilename: 'myFile.csv',
        exporterPdfDefaultStyle: { fontSize: 9 },
        exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'red' },
        exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
        exporterPdfFooter: function (currentPage, pageCount) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function (docDefinition) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
            return docDefinition;
        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 500,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'myFile.xlsx',
        exporterExcelSheetName: 'Sheet1',
         //export
    };
    i18nService.setCurrentLang('fa');

    service.getSpData('doctor').then(function (value) {

        var myData = JSON.parse(value.data.d);
        $scope.gridOptions.data = myData;

    });

    $scope.changeColumns = function () {
        $scope.columns = angular.copy($scope.orgColumns.filter(function (a) { return a.selected == true }));
        $scope.gridOptions.columnDefs = $scope.columns;
    }
});