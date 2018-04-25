<%@ Assembly Name="Reporting, Version=1.0.0.0, Culture=neutral, PublicKeyToken=68aac75d6f14d617" %>
<%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> 
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="asp" Namespace="System.Web.UI" Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>
<%@ Import Namespace="Microsoft.SharePoint" %> 
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ChartWPUserControl.ascx.cs" Inherits="Reporting.ChartWP.ChartWPUserControl" %>

<asp:Literal ID="Literal1" runat="server"></asp:Literal>
<script src=https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js></script>
<link href=/_layouts/15/reporting/static/css/app.css rel=stylesheet>
    <div id=app></div>
    <script type=text/javascript src=/_layouts/15/reporting/static/js/manifest.js></script>
    <script type=text/javascript src=/_layouts/15/reporting/static/js/vendor.js></script>
    <script type=text/javascript src=/_layouts/15/reporting/static/js/app.js></script>
