<%@ Assembly Name="Reporting, Version=1.0.0.0, Culture=neutral, PublicKeyToken=3812add2c8ff5457" %>
<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Tahvil.aspx.cs" Inherits="Reporting.Layouts.Reporting.Tahvil.Tahvil" DynamicMasterPageFile="~masterurl/default.master" %>

<asp:Content ID="PageHead" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">

    
    <script src="/_LAYOUTS/15/assets/angular.min.js"></script>
    <script src="/_LAYOUTS/15/assets/angular-touch.js"></script>
    <script src="/_LAYOUTS/15/assets/angular-animate.js"></script>
    <script src="../Assets/grunt-scripts/csv.js"></script>
    <script src="../Assets/grunt-scripts/pdfmake.js"></script>
    <script src="../Assets/grunt-scripts/vfs_fonts.js"></script>
    <script src="../Assets/grunt-scripts/lodash.min.js"></script>
    <script src="../Assets/grunt-scripts/jszip.min.js"></script>
    <script src="../Assets/grunt-scripts/excel-builder.dist.js"></script>

    <script src="/_LAYOUTS/15/assets/moment.js"></script>
    <script src="/_LAYOUTS/15/assets/moment-jalaali.js"></script>


    <link href="../Assets/ui-grid.css" rel="stylesheet" />
    <link href="../Assets/custom-grid.css" rel="stylesheet" />

    <script src="../Assets/ui-grid.js"></script>

    <script src="Tahvil.js"></script>
    <script src="../service.js"></script>
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div id="main-warp" ng-app="App" ng-controller="Ctrl">
        <div id="top-button">

                    	<button class="button" type="button" value="نمایش"  id="toggleMessage" ng-click="toggle=!toggle">  نمایش  </button>   

        </div>
        <div class="head-box" ng-show="toggle"  >
            <label ng-repeat="c in orgColumns">
                <input type="checkbox" ng-model="c.selected" ng-value="c.field">
                {{c.displayName}}
            </label>

            <input class="button" type="button" value="اعمال" ng-click="changeColumns()" />
        </div>
        <div  >
            <div id="grid1" ui-grid="gridOptions" dir="rtl" class="grid"
                ui-grid-pinning
                ui-grid-resize-columns
                ui-grid-move-columns
                ui-grid-grouping
                ui-grid-exporter>
            </div>
        </div>
    </div>
</asp:Content>

<asp:Content ID="PageTitle" ContentPlaceHolderID="PlaceHolderPageTitle" runat="server">
  گزارش تحویل
</asp:Content>

<asp:Content ID="PageTitleInTitleArea" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
     گزارش تحویل
</asp:Content>
