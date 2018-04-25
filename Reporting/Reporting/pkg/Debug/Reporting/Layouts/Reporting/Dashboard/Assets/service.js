var restConreacts = ''

function serverCall(url, data) {
    return jQuery.ajax({
        url: url,
        type: data ? "POST" : 'GET',
        headers: {
            "accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose"
        },
        data: data ? JSON.stringify(data) : undefined
    })
}


function getSP(data) {
    return serverCall("/_layouts/15/Reporting/service.aspx/getSpData", data)
}


function getContracts() {
    return serverCall("/_api/web/lists(guid'0179B06A-7CE9-42C1-8273-8F2B9CBB9FD2')/items?$select=Id,Title,Status,AreaId&$Top=300")
}
function getAreas() {
    return serverCall("/_api/web/lists(guid'37DC9EF1-5685-4BFC-B3EB-A3931D43DB1A')/items?$select=Id,Title")
}
function getWeeklyPeriods() {
    return serverCall("/_api/web/lists(guid'0198EDEB-A03D-4D0F-B611-622F54DA83F5')/items?$select=Id,Title")
}
function getContractData(contractID, areaID) {
    if (areaID)
        return getSP({ spName: 'GetDashboardData,' + areaID + ',null' });
    return getSP({ spName: 'GetDashboardData,null,' + contractID })
}

function getAreaReport(areaID)
{
    
    return getSP({ spName: 'GetAreaReport,' + areaID  });
    

}
function getTahvilData(contractID, areaID) {
    if (areaID)
        return getSP({ spName: 'GetValuseData,' + areaID + ',null,null,null' });

    return getSP({ spName: 'GetValuseData,null,' + contractID + ',null,null' })
}
function getTahvilByYear(contractID, areaID) {
    if (areaID)
        return getSP({ spName: 'GetTemporaryDashbord,' + areaID + ',null' });

    return getSP({ spName: 'GetTemporaryDashbord,null,' + contractID + '' })
}
function getEvalData(contractID, areaID) {
    if (areaID)
        return getSP({ spName: 'GetEvaluationDashboard,' + areaID + ',null' });
    return getSP({ spName: 'GetEvaluationDashboard,null,' + contractID })

}
function getExecMonthlyData(contractID, areaID) {
    if (areaID)
        return getSP({ spName: 'GetWeeklyOperation,' + areaID + ',null,null,1' });

    return getSP({ spName: 'GetWeeklyOperation,null,' + contractID + ',null,2' })
}
function getExecOperaData(contractID, areaID) {
    if (areaID)
        return getSP({ spName: 'GetWeeklyOperationDashboard,' + areaID + ',null' });

    return getSP({ spName: 'GetWeeklyOperationDashboard,null,' + contractID })
}
function getInvoiceData(contractID, areaID) {
    if (areaID)
        return getSP({ spName: 'GetInvoiceDashboard,' + areaID + ',null' });
    return getSP({ spName: 'GetInvoiceDashboard,null,' + contractID + '' })

}
function getExtendedData(contractID, areaID) {
    if (areaID)
        return getSP({ spName: 'GetExtendedTime,' + areaID + ',null' });
    return getSP({ spName: 'GetExtendedTime,null,' + contractID + '' })

}
function getValuesChanges(contractID, areaID) {
    if (areaID)
        return getSP({ spName: 'GetValuesChanges,' + areaID + ',null' });
    return getSP({ spName: 'GetValuesChanges,null,' + contractID + '' })

}
function getWbsData(contractID, areaID,per,type) {
    var p=per?per:'null';
    if (areaID.length>0)
        return getSP({ spName: 'GetAllOperations,' + areaID + ',null,'+p+','+type });
    else if (contractID.length>0)
        return getSP({ spName: 'GetAllOperations,null,' + contractID + ','+p+','+type })
    return getSP({ spName: 'GetAllOperations,null,null,'+p+','+type})
}



