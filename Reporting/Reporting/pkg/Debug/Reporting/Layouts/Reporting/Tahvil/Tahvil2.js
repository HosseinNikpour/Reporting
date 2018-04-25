var app = angular.module('App', ['ngTable']);
app.controller('Ctrl', function ($scope, service, $q, NgTableParams) {



    //$scope.cols = [
    //    { field: 'tp_Title', title: 'نام', show: true, sortable: "tp_Title" }, //headerCellClass: $scope.highlightFilteredHeader, aggregationType: uiGridConstants.aggregationTypes.count },
    //    { field: 'tp_RootFolder', title: 'RootFolder', show: true },
    //    { field: 'tp_ServerTemplate', title: 'ServerTemplate', show: true }// filter: { placeholder: 'ends with' }, displayName: 'نام شرکت', grouping: { groupPriority: 0 } }
    //];

    $scope.tableParams = new NgTableParams({
        // initial sort order
        sorting: { tp_Title: "desc" }
    }, {
        getData: function (params) {
            // ajax request to api
            return service.getSpData('doctor').then(function (data) {
                //  params.total(data.inlineCount); // recal. page nav controls
                return JSON.parse(data.data.d);
            });
        }
    });



});