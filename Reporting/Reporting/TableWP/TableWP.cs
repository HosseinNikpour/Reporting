using System;
using System.ComponentModel;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using Microsoft.SharePoint;
using Microsoft.SharePoint.WebControls;

namespace Reporting.TableWP
{
    [ToolboxItemAttribute(false)]
    public class TableWP : WebPart
    {
        // Visual Studio might automatically update this path when you change the Visual Web Part project item.
         private const string _ascxPath = "~/_CONTROLTEMPLATES/15/Reporting/TableWP/TableWPUserControl.ascx";
    public string columns;
    public string spName;

    // Methods
    protected override void CreateChildControls()
    {
        TableWPUserControl child = this.Page.LoadControl("~/_CONTROLTEMPLATES/15/Reporting/TableWP/TableWPUserControl.ascx") as TableWPUserControl;
        child.webPart = this;
        this.Controls.Add(child);
    }

    // Properties
    [DefaultValue(""), Category("تنظیمات جدول"), WebBrowsable(true), WebDisplayName("فیلد ها"), WebDescription(""), Personalizable(PersonalizationScope.Shared)]
    public string Columns
    {
        get{
           return this.columns;
        }
        set {
            this.columns = value;
        }
    }

    [Category("تنظیمات جدول"), WebDisplayName("اسم Sp"), WebBrowsable(true), WebDescription(""), Personalizable(PersonalizationScope.Shared), DefaultValue("")]
    public string SpName
    {
        get {
           return this.spName;
        }
        set
        {
            this.spName = value;
        }
    }

    }
}
