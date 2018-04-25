<%@ Assembly Name="$SharePoint.Project.AssemblyFullName$" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="TableWPUserControl.ascx.cs" Inherits="Reporting.TableWP.TableWPUserControl" %>
<asp:Literal ID="Literal1" runat="server"></asp:Literal>

<script src="/_LAYOUTS/15/assets/angular.min.js"></script>
    <script src="/_LAYOUTS/15/assets/angular-touch.js"></script>
    <script src="/_LAYOUTS/15/assets/angular-animate.js"></script>
    <script src="/_LAYOUTS/15/reporting/Assets/grunt-scripts/csv.js"></script>
    <script src="/_LAYOUTS/15/reporting/Assets/grunt-scripts/pdfmake.js"></script>
    <script src="/_LAYOUTS/15/reporting/Assets/grunt-scripts/vfs_fonts.js"></script>
    <script src="/_LAYOUTS/15/reporting/Assets/grunt-scripts/lodash.min.js"></script>
    <script src="/_LAYOUTS/15/reporting/Assets/grunt-scripts/jszip.min.js"></script>
    <script src="/_LAYOUTS/15/reporting/Assets/grunt-scripts/excel-builder.dist.js"></script>

    <script src="/_LAYOUTS/15/assets/moment.js"></script>
    <script src="/_LAYOUTS/15/assets/moment-jalaali.js"></script>


    <link href="/_LAYOUTS/15/reporting/Assets/ui-grid.css" rel="stylesheet" />
    <link href="/_LAYOUTS/15/reporting/Assets/custom-grid.css" rel="stylesheet" />

    <script src="/_LAYOUTS/15/reporting/Assets/ui-grid.js"></script>



<script>
    var app = angular.module('App', ['ngAnimate', 'ngTouch', "ui.grid", 'ui.grid.exporter', 'ui.grid.grouping', 'ui.grid.moveColumns', 'ui.grid.pinning']);
    app.controller('Ctrl', function ($scope, i18nService, uiGridConstants, uiGridGroupingConstants) {


        $scope.pageTitle = pageTitle;
        $scope.orgColumns = columns;


        $scope.columns = angular.copy($scope.orgColumns);

        $scope.gridOptions = {
            data: Data,
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

        //  service.getSpData(spName).then(function (value) {

        //    var myData = JSON.parse(value.data.d);
        //    $scope.gridOptions.data = myData;

        // });

        $scope.changeColumns = function () {
            $scope.columns = angular.copy($scope.orgColumns.filter(function (a) { return a.selected == true }));
            $scope.gridOptions.columnDefs = $scope.columns;
            $scope.toggle = false;
        }
    });
</script>

   <div id="main-warp" ng-app="App" ng-controller="Ctrl">
          <div id="show-colors">
         
        <div class="color-item" id="endOP" > پایان فرایند </div>
        <div class="color-item" id="noop"> موضوعیت ندارد </div>
        <div class="color-item" id="waitop">در انتظار تایید</div>
        <div class="color-item" id="editop">در انتظار ویرایش</div>
        <div class="color-item" id="startop"> ثبت موقت / ایجاد شده </div>
    </div>




    <style>
        #show-colors {
            box-shadow: 0 0 0px rgba(0,0,0,0.2), 0 0 9px rgba(213,213,213,1);
            margin: 0 auto;
            width: 917px;
            background: #f7f7f7;
            padding: 12px;
            min-height: 52px;
        }
        #endOP {
            background: #8bc34a;
            color: white;
            border: solid 1px #71d003;
        }
        #noop {
            background: #808080;
            color: white;
            border: solid 1px #a2a2a2;
        }
        #waitop {
            background: #ffbe00;
            color: black;
            border: solid 1px #ffd34f;
        }
        #startop {
            background: #ff5c4f;
            color: white;
            border: solid 1px #ffafaf;
        }
        #editop {
            background: #21c1f3;
            color: white;
            border: solid 1px #57d7ff;
        }
        .color-item {
            float: right;
            padding: 8px;
            border-radius: 10px;
            width: 148px;
            text-align: center;
            margin: 5px;
        }
    </style>

        <div>
            <div id="grid1" ui-grid="gridOptions" dir="rtl" class="grid"
                ui-grid-pinning
                ui-grid-resize-columns
                ui-grid-move-columns
                ui-grid-grouping
                ui-grid-exporter>
            </div>
        </div>
    </div>

