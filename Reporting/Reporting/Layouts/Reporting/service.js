app.factory('service', function ($q, $http) {


    var listIds = {
        Contracts: '548C9C76-AAC3-404D-A24A-20BCD884A31B',
        Area: 'ED446117-357B-4A3C-95D1-532E54879ABA'
    }

    function serverCall(address, param) {
        return $http({
            method: param ? 'POST' : 'GET',
            url: address,
            headers: {
                "Accept": "application/json; odata=verbose",
          //      "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "content-type": "application/json; odata=verbose"
            },

            data: JSON.stringify(param)
        });
    }


    function getAreas() {
        return serverCall("/_api/web/lists(guid'" + listIds.Area + "')/items?$select=Title,Id");
    }

    function getContracts() {
        var url = "/_api/web/lists(guid'" + listIds.Contracts + "')/items?$select=Id,Title,ContractType,AreaId&$Top=300";
        //  url = id ? url + "?$filter=Id eq " + id : url + "?$filter=Status eq 'جاری'";
        return serverCall(url);
    }


    function getSpData(spName) {
        var url = "/_layouts/15/Reporting/tahvil/tahvil.aspx/getSpData";
        return serverCall(url, {spName:spName});
    }

    return {
        getAreas: getAreas,
        getContracts: getContracts,
        getSpData: getSpData

    };

});