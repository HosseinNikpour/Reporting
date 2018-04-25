using System;
using System.ComponentModel;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;

namespace Reporting.ChartWP
{
    [ToolboxItemAttribute(false)]
    public class ChartWP : WebPart
    {
        
    private const string _ascxPath = "~/_CONTROLTEMPLATES/15/Reporting/ChartWP/ChartWPUserControl.ascx";
    public string address;
    public string chart_title;
    public string chart_type;
    public string datasource;
    public string filter_items;
    public string legend;
    public string sub_title;
    public string x_Axis;
    public string y_Axis;
    public string y_Axis_Title;

    // Methods
    protected override void CreateChildControls()
    {
        ChartWPUserControl child = this.Page.LoadControl("~/_CONTROLTEMPLATES/15/Reporting/ChartWP/ChartWPUserControl.ascx") as ChartWPUserControl;
        child.webPart = this;
        this.Controls.Add(child);
    }

    // Properties
    [WebDescription(""), Personalizable(PersonalizationScope.Shared), WebDisplayName("آدرس"), DefaultValue(""), Category("تنظیمات دیتاسورس"), WebBrowsable(true)]
    public string Address
    {
        get{  
           return this.address;
        }
        set {
            this.address = value;
        }
    }

    [Category("محورها"), DefaultValue(""), WebBrowsable(true), WebDisplayName(" عنوان نمودار"), WebDescription(""), Personalizable(PersonalizationScope.Shared)]
    public string Chart_Title
    {
        get {
            return this.chart_title;
        }
        set {
            this.chart_title = value;
        }
    }

    [WebBrowsable(true), WebDisplayName("نوع چارت"), WebDescription(""), Personalizable(PersonalizationScope.Shared), Category("محورها"), DefaultValue("")]
    public string Chart_type
    {
        get {
           return this.chart_type;
        }
        set {
            this.chart_type = value;
        }
    }

    [Category("تنظیمات دیتاسورس"), WebBrowsable(true), WebDisplayName("نوع دیتاسورس"), DefaultValue(""), WebDescription(""), Personalizable(PersonalizationScope.Shared)]
    public string Datasource
    {
        get {
           return this.datasource;
        }
        set { 
            this.datasource = value;
        }
    }

    [WebDescription(""), DefaultValue(""), WebDisplayName("فیلترها"), WebBrowsable(true), Personalizable(PersonalizationScope.Shared), Category("محورها")]
    public string Filter_Items
    {
        get {
          return  this.filter_items;
        }
        set { 
            this.filter_items = value;
        }
    }

    [DefaultValue(""), WebDisplayName("legend"), WebBrowsable(true), WebDescription(""), Personalizable(PersonalizationScope.Shared), Category("محورها")]
    public string Legend
    {
        get{
           return this.legend;
        }
        set { 
            this.legend = value;
        }
    }

    [WebBrowsable(true), WebDisplayName(" عنوان فرعی"), WebDescription(""), Personalizable(PersonalizationScope.Shared), Category("محورها"), DefaultValue("")]
    public string Sub_Title
    {
        get{
           return this.sub_title;
        }
        set { 
            this.sub_title = value;
        }
    }

    [WebDisplayName("محور X"), DefaultValue(""), WebBrowsable(true), WebDescription(""), Personalizable(PersonalizationScope.Shared), Category("محورها")]
    public string X_Axis
    {
        get {
           return this.x_Axis;
        }
        set{
            this.x_Axis = value;
        }
    }

    [DefaultValue(""), WebBrowsable(true), WebDisplayName("محور Y"), WebDescription(""), Personalizable(PersonalizationScope.Shared), Category("محورها")]
    public string Y_Axis
    {
        get {
          return  this.y_Axis;
        }
        set {
           this.y_Axis = value;
        }
    }

    [Category("محورها"), DefaultValue(""), WebBrowsable(true), WebDisplayName("محور Y"), WebDescription(""), Personalizable(PersonalizationScope.Shared)]
    public string Y_Axis_Title
    {
        get { 
           return this.y_Axis_Title;
        }
        set
        {
            this.y_Axis_Title = value;
        }
    }

       
    }
}
