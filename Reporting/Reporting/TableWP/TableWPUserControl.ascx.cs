﻿using System;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using Newtonsoft.Json;
using Microsoft.SharePoint;
using System.DirectoryServices.AccountManagement;
using Microsoft.SharePoint.Utilities;
namespace Reporting.TableWP
{
    public partial class TableWPUserControl : UserControl
    {
      
    // Fields
    protected Literal Literal1;

    // Methods
    private object getSpData(string spName)
    {
        SPQuery query;
        SPWeb web = SPContext.Current.Web;
        string[] strArray = spName.Split(new char[] { ',' });
        object[] parameterValues = new object[strArray.Length - 1];
        string sPName = strArray[0].ToString();


        SPUser currentUser = web.CurrentUser;

        var domainName = "jnasr";
       // var domainName = "nasr2";
        string str = "";
        var queryUser = "nasr\\SPS_Farm_Prd";
        //var queryUser = "nasr2\\spadmin";
        var queryUserPassword = "rnk@Qk7fqH";
       // var queryUserPassword = "Nsr!dm$n!Sp";
        var principalContext = new PrincipalContext(ContextType.Domain, domainName, queryUser, queryUserPassword);

        GroupPrincipal managerPrincipal = GroupPrincipal.FindByIdentity(principalContext, "Epm-managers");
        GroupPrincipal directorPrincipal = GroupPrincipal.FindByIdentity(principalContext, "Epm-Directors_pmis");
        GroupPrincipal contractorPrincipal = GroupPrincipal.FindByIdentity(principalContext, "Epm-contractors");
        GroupPrincipal engineerPrincipal = GroupPrincipal.FindByIdentity(principalContext, "Epm-engineers");

        UserPrincipal user = UserPrincipal.FindByIdentity(principalContext, currentUser.LoginName);
        string userdomain = currentUser.LoginName.Split('|')[1].Split('\\')[0];
        if (strArray[1].ToString().ToUpper() == "NULL")
        {
            if (userdomain!="nasr" &&( user.IsMemberOf(managerPrincipal) || user.IsMemberOf(directorPrincipal)))
            {
                query = new SPQuery();
                SPListItem item = SPContext.Current.Web.GetList("/Lists/Areas").Items[0];
                parameterValues[0] = item.ID;
            }
            else
            {
                parameterValues[0] = DBNull.Value;
            }
        }
        else
        {
            parameterValues[0] = int.Parse(strArray[1].ToString());
        }
        if (strArray[2].ToString().ToUpper() == "NULL")
        {
            if (userdomain!="nasr" &&(user.IsMemberOf(contractorPrincipal) || user.IsMemberOf(engineerPrincipal)))
            {

                query = new SPQuery();
                SPListItem item2 = SPContext.Current.Web.GetList("/Lists/Contracts").Items[0];
                parameterValues[1] = item2.ID;
            }
            else
            {
                parameterValues[1] = DBNull.Value;
            }
        }
        else
        {
            parameterValues[0] = int.Parse(strArray[1].ToString());
        }
       
        if (strArray.Length > 3)
        {
            for (int i = 3; i < strArray.Length; i++)
            {
                if (strArray[i].ToString().ToUpper() == "NULL")
                {
                    parameterValues[i - 1] = DBNull.Value;
                }
                else
                {
                    int result = 0;
                    if (int.TryParse(strArray[i].ToString(), out result))
                    {
                        parameterValues[i - 1] = result;
                    }
                    else
                    {
                        parameterValues[i - 1] = strArray[i].ToString();
                    }
                }
            }
        }
        DataAccessBase base2 = new DataAccessBase();
        return JsonConvert.SerializeObject(base2.ReaderSp(sPName, parameterValues));
    }

    private bool IsMemberOfGroup(SPWeb web, string groupName)
    {
        bool flag = false;
        bool isMemberOfGroup = false;
        string siteUrl = web.Site.Url;
        SPSecurity.RunWithElevatedPrivileges(delegate {
            using (SPSite site = new SPSite(siteUrl))
            {
                using (SPWeb web1 = site.OpenWeb())
                {
                    SPPrincipalInfo[] infoArray = SPUtility.GetPrincipalsInGroup(web1, groupName, 0x3e8, out flag);
                    foreach (SPPrincipalInfo info in infoArray)
                    {
                        if (info.LoginName == web.CurrentUser.LoginName)
                        {
                            isMemberOfGroup = true;
                            return;
                        }
                    }
                }
            }
        });
        return isMemberOfGroup;
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!base.IsPostBack)
        {
            try
            {
                this.Literal1.Text = string.Concat(new object[] { "<script>var columns=", this.webPart.Columns, " ;var Data=", this.getSpData(this.webPart.SpName), " ;var pageTitle='", this.webPart.Title, "'</script>" });
            }
            catch (Exception exception)
            {
                this.Literal1.Text = "<script>console.log('error:'" + exception.Message + ") ;</script>";
            }
        }
    }

    // Properties
    public Reporting.TableWP.TableWP webPart { get; set; }
     }


}
