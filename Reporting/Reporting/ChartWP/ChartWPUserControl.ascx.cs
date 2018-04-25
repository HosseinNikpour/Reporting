using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;

namespace Reporting.ChartWP
{
    public partial class ChartWPUserControl : UserControl
    {
      
    // Fields
    protected Literal Literal1;

    // Methods
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!base.IsPostBack)
        {
            this.Literal1.Text = "<script>window.CHART_TYPE='" + this.webPart.Chart_type + "' ;window.FILTER_ITEMS=" + this.webPart.Filter_Items + " ;window.TITLE='" + this.webPart.Chart_Title + "' ;window.SUB_TITLE='" + this.webPart.Sub_Title + "' ;window.ADDRESS='" + this.webPart.Address + "' ;window.Y_AXIS=" + this.webPart.Y_Axis + ";window.Y_AXIS_TITLE= '" + this.webPart.Y_Axis_Title + "' ;window.X_AXIS= '" + this.webPart.X_Axis + "' ;window.DATA_SOURCE= '" + this.webPart.Datasource + "' ;window.LEGEND= '" + this.webPart.Legend + "'</script>";
        }
    }

    // Properties
    public Reporting.ChartWP.ChartWP webPart { get; set; }
   }

}
