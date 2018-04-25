
$(document).ready(function () {
    $('#warp-home').hide();
    // $("#evalModal").iziModal();
    getContracts().done(function (d) {
        var opJari = '', opNotJari = '';

        for (var i = 0; i < d.d.results.length; i++) {
            var c = d.d.results[i];
            if (c.Status == 'جاری')
                opJari += '<option value="' + c.Id + '">' + c.Title + '</option>';
            else
                opNotJari += '<option value="' + c.Id + '">' + c.Title + '</option>';
        }
        $('#contractsSelect').html(' <option value="0">انتخاب</option> <optgroup label="جاری"> ' + opJari + ' </optgroup> <optgroup label="انتقالی">' + opNotJari + ' </optgroup>');
        $('#contractsSelect').on('change', function () {
            if(this.value!=0)
            LoadReport(this.value);
        });
        $('#pag-loade').attr('id', 'pag-loadeDisable');
    })

})


var cont, tah, eva, execM, execO, invo;
var ejraChartPresentage = true;

function LoadReport(contractID) {
    var start = Date.now();
    var millis =0;
    $('#pag-loadeDisable').attr('id', 'pag-loade');
    
    jQuery.when(getContractData(contractID),
        getTahvilData(contractID),
        getEvalData(contractID),
        getExecMonthlyData(contractID),
        getExecOperaData(contractID),
        getInvoiceData(contractID)).then(function (c, t, e, em, eo, i) {
            cont = JSON.parse(c[0].d)[0];//.find((a) => { return a.ContractID == contractID });
            tah = JSON.parse(t[0].d)[0];//.find((a) => { return a.ContractID == contractID });
            eva = JSON.parse(e[0].d);//.find((a) => { return a.ContractID == contractID });
            execM = JSON.parse(em[0].d);//.find((a) => { return a.ContractID == contractID });
            execO = JSON.parse(eo[0].d);//.find((a) => { return a.ContractID == contractID });
            invo = JSON.parse(i[0].d);//.find((a) => { return a.ContractID == contractID });
             millis = Date.now() - start;
             start = Date.now();
             console.log('loadData:'+millis);
            //اطلاعات شناسنامه ای
            createContrcatSection();
            millis = Date.now() - start;
            start = Date.now();
            console.log('شناسنامه:'+millis);
           
            //ساختار شکست
            createWbsTable();
            millis = Date.now() - start;
            start = Date.now();
            console.log('ساختار:'+millis);

            //eval 
            calcEvalSection();
            millis = Date.now() - start;
            start = Date.now();
            console.log('ارزشیابی:'+millis);

            //tahvil
            tahvilTableAndGauge('net');
            $('#tahvilSelectType').on('change', function () {
                tahvilTableAndGauge(this.value);
            });
            millis = Date.now() - start;
            start = Date.now();
            console.log('تحویل:'+millis);

            //ejra
            ejraRavandChart();
            ejraOperationChart();
            millis = Date.now() - start;
            start = Date.now();
            console.log('اجرا:'+millis);

            //Invoice
            invoiceTableAndChart();
            millis = Date.now() - start;
            start = Date.now();
            console.log('صورت:'+millis);

            $('#warp-home').show();
            $('#pag-loade').attr('id', 'pag-loadeDisable');

        });//end promiss



    function createContrcatSection() {
        var sDate = moment(cont.GroundDate),
            eDate = moment(cont.EndDateAllowed);

        $('#contract_title').text(cont.Topic);
        $('#contract_contractor').text(cont.Contractor);
        $('#contract_advisor').text(cont.Consultant);
        $('#contract_manager').text(cont.Manager);
        $('#contract_Area').text(cont.Area);
        $('#contract_sDate').text(sDate.format('jYYYY/jMM/jDD'));
        $('#contract_eDate').text(eDate.format('jYYYY/jMM/jDD'));
        $('#contract_period').text(eDate.diff(sDate, 'days') + ' روز');
        //$('#contract_title1').text("ssss");
    }
}

function calcEvalSection() {
    var contractorData = eva.filter(function (a) { return a.type2 == 'p' });
    var advisorData = eva.filter(function (a) { return a.type2 == 'm' });
    var aliehData = eva.filter(function (a) { return a.type2 == 'a' });
    var peroids = [], contractorScores = [], advisorScores = [], aliehScores = [], sumAdvisor = [];
    for (var i = 0; i < contractorData.length; i++) {

        peroids.push(contractorData[i].title);
        contractorScores.push(contractorData[i].TotalScore);
        if (advisorData.length > 0) {
            var a = advisorData.find(function (x) { return x.title == contractorData[i].title });
            var b = aliehData.find(function (x) { return x.title == contractorData[i].title });
            aliehScores.push(b ? b.TotalScore : 0);
            advisorScores.push(a ? a.TotalScore : 0);
            sumAdvisor.push(b ? (b.TotalScore + a.TotalScore) / 2 : a.TotalScore);
        }
    }

    $('#contracorEvalScore').text(contractorScores[contractorScores.length - 1]);
    $('#advisorEvalScore').text(sumAdvisor[sumAdvisor.length - 1]);
    $('#lastPeriodEval').text(peroids[peroids.length - 1]);


    var yAxis = { title: 'امتیاز' },
        xAxis = { field: 'Period' },
        series = [{ field: 'Network', name: 'پیمانکار', type: 'line' }, { field: 'Drainage', name: 'مشاور', type: 'line' }, { field: 'Equipped', name: 'نظارت عالیه', type: 'line' }];

    var o = basicColumnOptions(eva, xAxis, series, yAxis, "روند امتیازات ارزشیابی", "", { enable: true }, { multi: true });
    o.xAxis.categories = peroids;
    o.series[0].data = contractorScores;
    o.series[1].data = advisorScores;
    if (aliehData.length > 0)
        o.series[2].data = aliehScores;
    else
        o.series.splice(2, 1);
    Highcharts.chart('evalChart', o);

}


function tahvilTableAndGauge(type) {
    var t_totalSpace, t_execSpace, t_docSpace, t_deliverSpace, t_deliverRemovedSpace, t_deliver2Space;
    switch (type) {
        case 'net':
            t_totalSpace = cont.FinalNetwork;
            t_execSpace = execM[execM.length - 1].NetCum;
            t_docSpace = tah.NetworkDoc;
            t_deliverSpace = tah.NetworkDelivered;
            t_deliverRemovedSpace = tah.NetworkRemove;
            t_deliver2Space = tah.NetworkFinalDeliver;
            break;
        case 'dar':
            t_totalSpace = cont.FinalDrain;
            t_execSpace = execM[execM.length - 1].DrainCum;
            t_docSpace = tah.DraindDoc;
            t_deliverSpace = tah.DrainDelivered;
            t_deliverRemovedSpace = tah.DrainRemove;
            t_deliver2Space = tah.DrainFinalDeliver;
            break;
        case 'equ':
            t_totalSpace = cont.FinalEquipp;
            t_execSpace = execM[execM.length - 1].EquipCum;
            t_docSpace = tah.EquipDoc;
            t_deliverSpace = tah.EquippedDelivered;
            t_deliverRemovedSpace = tah.EquippedRemove;
            t_deliver2Space = tah.EquippedFinalDeliver;
            break;
    }
    $('#t_totalSpace').text(t_totalSpace);
    $('#t_execSpace').text(t_execSpace);
    $('#t_docSpace').text(t_docSpace);
    $('#t_deliverSpace').text(t_deliverSpace);
    $('#t_deliverRemovedSpace').text(t_deliverRemovedSpace);
    $('#t_deliver2Space').text(t_deliver2Space);


    var yAxis2 = { min: 0, max: t_execSpace, title: 'test1' },
        series2 = [{ name: 'ارسال مستندات', y: t_docSpace }, { name: 'تحویل شده', y: t_deliverSpace }, { name: 'رفع نقص شده', y: t_deliverRemovedSpace }];
    var o2 = activityGaugeOptions(yAxis2, series2, 'وضعیت تحویل');
    Highcharts.chart('tahvil1Chart', o2);

}

function createWbsTable() {
    $('#wbs_totalnet').text(cont.FirstNet)
    $('#wbs_totaldar').text(cont.FirstDrain)
    $('#wbs_totalequ').text(cont.FirstEquipp)

    $('#wbs_firstnet').text(cont.FirstNetworkWBS)
    $('#wbs_firstdar').text(cont.FirstDrainWBS)
    $('#wbs_firstequ').text(cont.FirstEquippWBS)

    $('#wbs_finalnet').text(cont.FinalNetwork)
    $('#wbs_finaldar').text(cont.FinalDrain)
    $('#wbs_finalequ').text(cont.FinalEquipp)

}
function ejraRavandChart() {
    var yAxis = { title: 'هکتار' },
        xAxis = { field: 'Period' },
        series = [{ field: 'Network', name: 'شبکه', type: 'column' }, { field: 'Drainage', name: 'زهکش', type: 'column', visible: false }, { field: 'Equipped', name: 'تجهیز', type: 'column', visible: false },
        { field: 'NetCum', name: 'شبکه تجمعی', type: 'line', yAxis: 1 }, { field: 'DrainCum', name: 'زهکش تجمعی', type: 'line', yAxis: 1, visible: false }, { field: 'EquipCum', name: 'تجهیز تجمعی', type: 'line', yAxis: 1, visible: false }];

    var o = basicColumnOptions(execM, xAxis, series, yAxis, "روند پیشرفت", "", { enable: true }, { multi: true });
    o.yAxis = [{ labels: { format: '{value}هکتار' }, title: { text: 'ماهیانه' } },
    {
        labels: { format: '{value}هکتار' }, title: { text: 'تجمعی' },
        opposite: true
    }];
    Highcharts.chart('ejra1Chart', o);
}
function ejraOperationChart() {
    ejraChartPresentage = !ejraChartPresentage;
    var yAxis = { title: ejraChartPresentage ? 'درصد' : 'هکتار' };
    var xAxis = { field: 'Operation' },
        seris = [{ field: 'FinalVolume', name: 'مقدار کل', type: 'column' }, { field: 'Constructed', name: 'اجرا شده', type: 'column' }];//, { field: 'LeftVolume', title: 'LeftVolume', type: 'column' };

    var o = stackingColumnOptions(execO, xAxis, seris, yAxis, "مقدار انجام عملیات ها", "",  { enable: true }, { multi: true }, ejraChartPresentage, 'fixedPlacement');
    Highcharts.chart('ejra2Chart', o);
}

function invoiceTableAndChart() {

    var invoiceConsultantData = invo.filter(function (x) { return x.Type == 'InvoiceConsultant' });
    var invoiceData = invo.filter(function (x) { return x.Type == 'Invoice' });
    var adjustmentData = invo.filter(function (x) { return x.Type == 'Adjustment' });

    $('#price_firstnet').text(addCommas(cont.FirstCostNet, 0))
    $('#price_firstdar').text(addCommas(cont.FirstCostDrain, 0))
    $('#price_firstequ').text(addCommas(cont.FirstCostEquipp, 0))

    $('#price_finalnet').text(addCommas(cont.FinalCostNet, 0))
    $('#price_finaldar').text(addCommas(cont.FinalCostDrain, 0))
    $('#price_finalequ').text(addCommas(cont.FinalCostEquipp, 0))

    if(invoiceData.length>0)    {
    $('#inv_title').text(invoiceData[invoiceData.length - 1].title)
    $('#inv_sDate').text(moment(invoiceData[invoiceData.length - 1].StartDate).format('jYYYY/jMM/jDD'))
    $('#inv_eDate').text(moment(invoiceData[invoiceData.length - 1].EndDate).format('jYYYY/jMM/jDD'))
    $('#inv_networkCM').text(addCommas(invoiceData[invoiceData.length - 1].NetworkCM, 0))
    $('#inv_equippedCM').text(addCommas(invoiceData[invoiceData.length - 1].EquippedCM, 0))
    $('#inv_totalPrice').text(addCommas(invoiceData[invoiceData.length - 1].NetworkCM + invoiceData[invoiceData.length - 1].EquippedCM, 0))
    }
    if(invoiceConsultantData.length>0)    {
    $('#invC_title').text(invoiceConsultantData[invoiceConsultantData.length - 1].title)
    $('#invC_sDate').text(moment(invoiceConsultantData[invoiceConsultantData.length - 1].StartDate).format('jYYYY/jMM/jDD'))
    $('#invC_eDate').text(moment(invoiceConsultantData[invoiceConsultantData.length - 1].EndDate).format('jYYYY/jMM/jDD'))
    $('#invC_networkCM').text(addCommas(invoiceConsultantData[invoiceConsultantData.length - 1].NetworkCM, 0))
    }
if(adjustmentData.length>0)
{
    $('#adj_title').text(adjustmentData[adjustmentData.length - 1].title)
    $('#adj_sDate').text(moment(adjustmentData[adjustmentData.length - 1].StartDate).format('jYYYY/jMM/jDD'))
    $('#adj_eDate').text(moment(adjustmentData[adjustmentData.length - 1].EndDate).format('jYYYY/jMM/jDD'))
    $('#adj_networkCM').text(addCommas(adjustmentData[adjustmentData.length - 1].NetworkCM, 0))
    $('#adj_equippedCM').text(addCommas(adjustmentData[adjustmentData.length - 1].EquippedCM, 0))
    $('#adj_totalPrice').text(addCommas(adjustmentData[adjustmentData.length - 1].NetworkCM + adjustmentData[adjustmentData.length - 1].EquippedCM, 0))

}

   var xxx= convertInvoiceMonthly(invoiceData,invoiceConsultantData,adjustmentData);

   var yAxis = { title:  'ریال' };
   var xAxis = { field: 'Operation' },
       seris = [{ field: 'FinalVolume', name: 'صورت وضعیت پیمانکار', type: 'column' }, { field: 'Constructed', name: 'صورت وضعیت مشاور', type: 'column' }];//, { field: 'LeftVolume', title: 'LeftVolume', type: 'column' };

   var o = stackingColumnOptions([], xAxis, seris, yAxis, "مقدار انجام عملیات ها", "",  { enable: true }, { multi: true }, false, 'stacking');
   o.xAxis.categories=xxx.periods;
   o.series.push({data:xxx.invoiceMonthly, name: 'صورت وضعیت پیمانکار', type: 'column' });
   o.series.push({data:xxx.invoiceCMonthly, name: 'صورت وضعیت مشاور', type: 'column' });
   Highcharts.chart('invoiceChart', o);


   console.log(xxx);

}

