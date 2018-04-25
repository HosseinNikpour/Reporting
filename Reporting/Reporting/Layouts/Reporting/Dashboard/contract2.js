var cont, tah, eva, execM, execO, invo, tahY;
$(document).ready(function () {
    $('#page-wrapper').hide();
    var areas = [], contracts = [];
    // $("#evalModal").iziModal();
    Promise.all([getContracts(), getAreas()]).then(function (d) {
        var html = '', opNotJari = '';
        areas = d[1].d.results, contracts = d[0].d.results;

        createConreactsBox();
    })

    $('#searchText').on('input', function () {
        createConreactsBox($(this).val());
    })


    function createConreactsBox(txt) {
        var html = ''
        html += '<ul class="fahter" >';
        var myContracts = contracts;
        if (txt)
            myContracts = contracts.filter(function (x) { return x.Title.indexOf(txt) != -1 });
        for (var i = 0; i < areas.length; i++) {
            var a = areas[i];
            html += '<li type="area" value="' + a.Id + '">' + a.Title + '</li><ul class="child">'
            var filterContrats = myContracts.filter(function (x) { return x.AreaId == a.Id });
            for (var j = 0; j < filterContrats.length; j++) {
                var c = filterContrats[j];
                html += '<li type="contract" value="' + c.Id + '" class="projects">' + c.Title + '</li>'
            }
            html += '</ul>'

        }
        html += '</ul>'
        $('#contractsBox').html(html);

        $('#pag-loade').attr('id', 'pag-loadeDisable');


        $('.projects').on('click', projectClick)
    }
    function projectClick() {
        var start = Date.now();
        var millis = 0;
        $('#pag-loadeDisable').attr('id', 'pag-loade');
        var contractID = $(this).val();

        jQuery.when(getContractData(contractID),
         getInvoiceData(contractID),getExtendedData(contractID),getValuesChanges(contractID)).done(function (c,i,e,v) {
             cont = JSON.parse(c[0].d)[0];
             invo=JSON.parse(i[0].d);
             extended=JSON.parse(e[0].d)[0];
             changeed=JSON.parse(v[0].d)[0];
             createContrcatSection();
             invoiceTableAndChart();
             extendedDataSection();
             changeValueSection();
            millis = Date.now() - start;
            start = Date.now();
            console.log('شناسنامه:' + millis);

            createWbsTable();
            millis = Date.now() - start;
            start = Date.now();
            console.log('ساختار:' + millis);

            $('#pag-loade').attr('id', 'pag-loadeDisable');
            $('#page-wrapper').show();
        });

        getEvalData(contractID).done(function (e) {
            eva = JSON.parse(e.d);
            calcEvalSection();
            millis = Date.now() - start;
            start = Date.now();
            console.log('ارزشیابی:' + millis);
        });

        getExecMonthlyData(contractID).done(function (e) {
            execM = JSON.parse(e.d);
            $('#ejraSelect').on('change', function () {
                ejraRavandChart(this.value);
            });
            ejraRavandChart('net');

            millis = Date.now() - start;
            start = Date.now();
            console.log('  ماهیانه اجرا:' + millis);
            getTahvilData(contractID).done(function (e) {
                tah = JSON.parse(e.d)[0];
                tahvil('net');
                $('#tahvil1Select').on('change', function () {
                    tahvil(this.value);
                });
                tahvil('net');

                millis = Date.now() - start;
                start = Date.now();
                console.log('تحویل:' + millis);
            });
        });

        getExecOperaData(contractID).done(function (e) {
            execO = JSON.parse(e.d);
            ejraOperationChart();
            millis = Date.now() - start;
            start = Date.now();
            console.log(' نوع اجرا:' + millis);
        });
        getTahvilByYear(contractID).done(function (e) {
            tahY = JSON.parse(e.d);
            $('#tahvil2Select').on('change', function () {
                tahvilYear(this.value);
            });
            tahvilYear('net');
            millis = Date.now() - start;
            start = Date.now();
            console.log('tah2:' + millis);
        });

    }
    function  extendedDataSection(){
        $('#ext_Counter').text(extended.Counter)
        $('#ext_ExtendedDuration').text(extended.ExtendedDuration)
        $('#ext_DateNotification').text(moment(extended.DateNotification).format('jYYYY/jMM/jDD'))
    }
    function  changeValueSection(){
        $('#chv_LastNumber').text(changeed.LastNumber)
        $('#chv_DateDelivery').text(moment(changeed.DateDelivery).format('jYYYY/jMM/jDD'))
        $('#chv_IncreasedPercent').text(changeed.IncreasedPercent);
        $('#chv_DecreasedPercent').text(changeed.DecreasedPercent);
        $('#chv_NewWorkPercent').text(changeed.NewWorkPercent);
        $('#chv_ValueChangePrice').text(changeed.ValueChangePrice);
    }
    function invoiceTableAndChart() {

        var invoiceConsultantData = invo.filter(function (x) { return x.Type == 'InvoiceConsultant' });
        var invoiceData = invo.filter(function (x) { return x.Type == 'Invoice' });
        var adjustmentData = invo.filter(function (x) { return x.Type == 'Adjustment' });

        //$('#price_firstnet').text(addCommas(cont.FirstCostNet, 0))
        //$('#price_firstdar').text(addCommas(cont.FirstCostDrain, 0))
        //$('#price_firstequ').text(addCommas(cont.FirstCostEquipp, 0))

        //$('#price_finalnet').text(addCommas(cont.FinalCostNet, 0))
        //$('#price_finaldar').text(addCommas(cont.FinalCostDrain, 0))
        //$('#price_finalequ').text(addCommas(cont.FinalCostEquipp, 0))

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

     //   var xxx= convertInvoiceMonthly(invoiceData,invoiceConsultantData,adjustmentData);

        //var yAxis = { title:  'ریال' };
        //var xAxis = { field: 'Operation' },
        //    seris = [{ field: 'FinalVolume', name: 'صورت وضعیت پیمانکار', type: 'column' }, { field: 'Constructed', name: 'صورت وضعیت مشاور', type: 'column' }];//, { field: 'LeftVolume', title: 'LeftVolume', type: 'column' };

        //var o = stackingColumnOptions([], xAxis, seris, yAxis, "مقدار انجام عملیات ها", "",  { enable: true }, { multi: true }, false, 'stacking');
        //o.xAxis.categories=xxx.periods;
        //o.series.push({data:xxx.invoiceMonthly, name: 'صورت وضعیت پیمانکار', type: 'column' });
        //o.series.push({data:xxx.invoiceCMonthly, name: 'صورت وضعیت مشاور', type: 'column' });
        //Highcharts.chart('invoiceChart', o);


        //console.log(xxx);

    }


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
        $('#contract_type').text(cont.ContractType);
    }
    function createWbsTable() {
        $('#wbs_totalnet').text(addCommas(cont.FirstNet, 0))
        $('#wbs_totaldar').text(addCommas(cont.FirstDrain, 0))
        $('#wbs_totalequ').text(addCommas(cont.FirstEquipp, 0))

        $('#wbs_firstnet').text(addCommas(cont.FirstNetworkWBS, 0))
        $('#wbs_firstdar').text(addCommas(cont.FirstDrainWBS, 0))
        $('#wbs_firstequ').text(addCommas(cont.FirstEquippWBS, 0))

        $('#wbs_finalnet').text(addCommas(cont.FinalNetwork, 0))
        $('#wbs_finaldar').text(addCommas(cont.FinalDrain, 0))
        $('#wbs_finalequ').text(addCommas(cont.FinalEquipp, 0))

    }
    function calcEvalSection() {
        var contractorData = eva.filter(function (a) { return a.type2 == 'p' });
        var advisorData = eva.filter(function (a) { return a.type2 == 'm' });
        var aliehData = eva.filter(function (a) { return a.type2 == 'a' });
        var peroids = [], contractorScores = [], advisorScores = [], aliehScores = [], sumAdvisor = [],
            contractorRanks = [], advisorRanks = [], aliehRanks = [], sumAdvisorRanks = [];
        for (var i = 0; i < contractorData.length; i++) {

            peroids.push(contractorData[i].title);
            contractorScores.push(contractorData[i].TotalScore);
            contractorRanks.push(contractorData[i].Rank);
            if (advisorData.length > 0) {
                var a = advisorData.find(function (x) { return x.title == contractorData[i].title });
                var b = aliehData.find(function (x) { return x.title == contractorData[i].title });
                aliehScores.push(b ? b.TotalScore : 0);
                advisorScores.push(a ? a.TotalScore : 0);
                sumAdvisor.push(b ? (b.TotalScore + a.TotalScore) / 2 : a.TotalScore);

                aliehRanks.push(b ? b.Rank : 0);
                advisorRanks.push(a ? a.Rank : 0);
                sumAdvisorRanks.push(b ? (b.Rank + a.Rank) / 2 : a.Rank);
            }
        }

        // $('#contracorEvalScore').text(addCommas(contractorScores[contractorScores.length - 2], 1));
        // $('#advisorEvalScore').text(addCommas(sumAdvisor[sumAdvisor.length - 2], 1));
        // $('#lastPeriodEval').text(peroids[peroids.length - 2], 1);
        // $('#contracorEvalRank').text(addCommas(contractorRanks[contractorRanks.length - 2], 1));
        // $('#advisorEvalRank').text(addCommas(sumAdvisorRanks[sumAdvisorRanks.length - 2], 1));
        //$('#lastPeriodEval').text(peroids[peroids.length - 1]);


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
        Highcharts.chart('eval1Chart', o);



        var yAxis2 = { title: 'رنکینگ' },
            xAxis2 = { field: 'Period' },
            series2 = [{ field: 'Network', name: 'پیمانکار', type: 'line' }, { field: 'Drainage', name: 'مشاور', type: 'line' }, { field: 'Equipped', name: 'نظارت عالیه', type: 'line' }];

        var o2 = basicColumnOptions(eva, xAxis2, series2, yAxis2, "روند رنکینگ امتیازات ارزشیابی", "", { enable: true }, { multi: true });
        o2.xAxis.categories = peroids;
        o2.yAxis.reversed = true;
        o2.series[0].data = contractorRanks;
        o2.series[1].data = advisorRanks;
        if (aliehData.length > 0)
            o2.series[2].data = aliehRanks;
        else
            o2.series.splice(2, 1);
        Highcharts.chart('eval2Chart', o2);
    }
    function ejraRavandChart(type) {
        var yAxis = { title: 'هکتار' },
            xAxis = { field: 'Period' }, series = [];
        // series = [{ field: 'Network', name: 'شبکه', type: 'column' }, { field: 'Drainage', name: 'زهکش', type: 'column', visible: false }, { field: 'Equipped', name: 'تجهیز', type: 'column', visible: false },
        // { field: 'NetCum', name: 'شبکه تجمعی', type: 'line', yAxis: 1 }, { field: 'DrainCum', name: 'زهکش تجمعی', type: 'line', yAxis: 1, visible: false }, { field: 'EquipCum', name: 'تجهیز تجمعی', type: 'line', yAxis: 1, visible: false }];
        if (type == 'net')
            series = [{ field: 'Network', name: 'انجام شده', type: 'column' }, { field: 'NetworkV2', name: 'برنامه2', type: 'column' }, { field: 'NetworkV1', name: 'برنامه1', type: 'column', visible: false },
            { field: 'NetCum', name: 'انجام شده تجمعی', type: 'line', yAxis: 1 }, { field: 'NetworkCumV2', name: 'برنامه2 تجمعی', type: 'line', yAxis: 1 }, { field: 'NetworkCumV1', name: 'برنامه1 تجمعی', type: 'line', yAxis: 1, visible: false }];
        else if (type == 'dar')
            series = [{ field: 'Drainage', name: 'انجام شده', type: 'column' }, { field: 'DrainV2', name: 'برنامه2', type: 'column' }, { field: 'DrainV1', name: 'برنامه1', type: 'column', visible: false },
            { field: 'DrainCum', name: 'انجام شده تجمعی', type: 'line', yAxis: 1 }, { field: 'DrainCumV2', name: 'برنامه2 تجمعی', type: 'line', yAxis: 1 }, { field: 'DrainCumV1', name: 'برنامه1 تجمعی', type: 'line', yAxis: 1, visible: false }];
        else if (type == 'equ')
            series = [{ field: 'Equipped', name: 'انجام شده', type: 'column' }, { field: 'EquipV2', name: 'برنامه2', type: 'column' }, { field: 'EquipV1', name: 'برنامه1', type: 'column', visible: false },
            { field: 'EquipCum', name: 'انجام شده تجمعی', type: 'line', yAxis: 1 }, { field: 'EquipCumV2', name: 'برنامه2 تجمعی', type: 'line', yAxis: 1 }, { field: 'EquipCumV1', name: 'برنامه1 تجمعی', type: 'line', yAxis: 1, visible: false }];


        var o = basicColumnOptions(execM, xAxis, series, yAxis, "روند پیشرفت", "", { enable: true }, { multi: true });
        o.yAxis = [{ labels: { format: '{value}هکتار' }, title: { text: 'ماهیانه' } },
        {
            labels: { format: '{value}هکتار' }, title: { text: 'تجمعی' },
            opposite: true
        }];
        o.series[4].data = o.series[4].data.map((a) => { return a + o.series[0].data[0] });
        o.series[5].data = o.series[5].data.map((a) => { return a + o.series[0].data[0] });
        o.series[0].data[0] = o.series[0].data.length > 1 ? null : o.series[0].data[0];
        o.series[1].data[0] = o.series[1].data.length > 1 ? null : o.series[1].data[0];
        o.series[2].data[0] = o.series[2].data.length > 1 ? null : o.series[2].data[0];

        Highcharts.chart('ejra1Chart', o);
    }
    function ejraOperationChart() {
        if (cont) {
            var html = '';
            var total1 = 0, total2 = 0, total3 = 0, total4 = 0, total7 = 0, total6 = 0,
                left1 = 0, left2 = 0, left3 = 0, left4 = 0, left7 = 0, left6 = 0,
                doit1 = 0, doit2 = 0, doit3 = 0, doit4 = 0, doit7 = 0, doit6 = 0,
                leftP1 = 0, leftP2 = 0, leftP3 = 0, leftP4 = 0, leftP7 = 0, leftP6 = 0,
                doitP1 = 0, doitP2 = 0, doitP3 = 0, doitP4 = 0, doitP7 = 0, doitP6 = 0,
                percentFromTotal1 = 0, percentFromTotal2 = 0, percentFromTotal3 = 0, percentFromTotal4 = 0;

            for (var i = 0; i < execO.length; i++) {
                var a = execO[i];
                if (a.OperationID == 1)// درجا
                {
                    total1 = addCommas(a.FinalVolume, 0);
                    doit1 = addCommas(a.Constructed, 0);
                    left1 = addCommas(a.Left, 0);
                    doitP1 = addCommas(a.Constructed / a.FinalVolume * 100, 1);
                    leftP1 = addCommas(a.Left / a.FinalVolume * 100, 1);
                    percentFromTotal1 = addCommas((a.FinalVolume / cont.FinalNetwork * 100), 1);
                }
                else if (a.OperationID == 2)// کانالت
                {
                    total2 = addCommas(a.FinalVolume, 0);
                    doit2 = addCommas(a.Constructed, 0);
                    left2 = addCommas(a.Left, 0);
                    doitP2 = addCommas(a.Constructed / a.FinalVolume * 100, 1);
                    leftP2 = addCommas(a.Left / a.FinalVolume * 100, 1);
                    percentFromTotal2 = addCommas((a.FinalVolume / cont.FinalNetwork * 100), 1);
                }
                else if (a.OperationID == 3)// کم فشار
                {
                    total3 = addCommas(a.FinalVolume, 0);
                    doit3 = addCommas(a.Constructed, 0);
                    left3 = addCommas(a.Left, 0);
                    doitP3 = addCommas(a.Constructed / a.FinalVolume * 100, 1);
                    leftP3 = addCommas(a.Left / a.FinalVolume * 100, 1);
                    percentFromTotal3 = addCommas((a.FinalVolume / cont.FinalNetwork * 100), 1);
                }
                else if (a.OperationID == 4)// تحت فشار
                {
                    total4 = addCommas(a.FinalVolume, 0);
                    doit4 = addCommas(a.Constructed, 0);
                    left4 = addCommas(a.Left, 0);
                    doitP4 = addCommas(a.Constructed / a.FinalVolume * 100, 1);
                    leftP4 = addCommas(a.Left / a.FinalVolume * 100, 1);
                    percentFromTotal4 = addCommas((a.FinalVolume / cont.FinalNetwork * 100), 1);
                }
                else if (a.OperationID == 6)// زهکش
                {
                    total6 = addCommas(a.FinalVolume, 0);
                    doit6 = addCommas(a.Constructed, 0);
                    left6 = addCommas(a.Left, 0);
                    doitP6 = addCommas(a.Constructed / a.FinalVolume * 100, 1);
                    leftP6 = addCommas(a.Left / a.FinalVolume * 100, 1);
                }
                else if (a.OperationID == 7)// تجهیز
                {
                    total7 = addCommas(a.FinalVolume, 0);
                    doit7 = addCommas(a.Constructed, 0);
                    left7 = addCommas(a.Left, 0);
                    doitP7 = addCommas(a.Constructed / a.FinalVolume * 100, 1);
                    leftP7 = addCommas(a.Left / a.FinalVolume * 100, 1);
                }
            }

            html += '<tr><td> مقدار کل</td><td>' + total1 + '</td><td>' + total2 + '</td><td>' + total3 + '</td><td>' + total4 + '</td><td>' + total6 + '</td><td>' + total7 + '</td></tr>';
            html += '<tr><td>انجام شده</td><td>' + doit1 + '</td><td>' + doit2 + '</td><td>' + doit3 + '</td><td>' + doit4 + '</td><td>' + doit6 + '</td><td>' + doit7 + '</td></tr>';
            html += '<tr><td>درصد انجام شده</td><td>' + doitP1 + '</td><td>' + doitP2 + '</td><td>' + doitP3 + '</td><td>' + doitP4 + '</td><td>' + doitP6 + '</td><td>' + doitP7 + '</td></tr>';
            html += '<tr><td>باقی مانده</td><td>' + left1 + '</td><td>' + left2 + '</td><td>' + left3 + '</td><td>' + left4 + '</td><td>' + left6 + '</td><td>' + left7 + '</td></tr>';
            html += '<tr><td>درصد باقی مانده</td><td>' + leftP1 + '</td><td>' + leftP2 + '</td><td>' + leftP3 + '</td><td>' + leftP4 + '</td><td>' + leftP6 + '</td><td>' + leftP7 + '</td></tr>';
            html += '<tr><td>سهم از کل</td><td>' + percentFromTotal1 + '</td><td>' + percentFromTotal2 + '</td><td>' + percentFromTotal3 + '</td><td>' + percentFromTotal4 + '</td><td>---</td><td>---</td></tr>';


            $('#ejraTable tbody').html(html);
        }
        else
            setTimeout(ejraOperationChart, 500);
    }
    function tahvil(type) {
        var t_totalSpace, t_execSpace, t_readySpace, t_docSpace, t_deliverSpace, t_deliverWithoutSpace, t_deliverRemovedSpace, t_deliver2Space;
        switch (type) {
            case 'net':
                t_totalSpace = cont.FinalNetwork;
                t_execSpace = execM[execM.length - 1].NetCum;
                t_readySpace = tah.ReadyNetwork;
                t_docSpace = tah.NetworkDoc;
                t_deliverSpace = tah.NetworkDelivered;
                t_deliverRemovedSpace = tah.NetworkRemove;
                t_deliverWithoutSpace = tah.NetworkDelivered3;
                t_deliver2Space = tah.NetworkFinalDeliver;
                break;
            case 'dar':
                t_totalSpace = cont.FinalDrain;
                t_execSpace = execM[execM.length - 1].DrainCum;
                t_readySpace = tah.ReadyDrainage;
                t_docSpace = tah.DraindDoc;
                t_deliverSpace = tah.DrainDelivered;
                t_deliverRemovedSpace = tah.DrainRemove;
                t_deliverWithoutSpace = tah.DrainDelivered3;
                t_deliver2Space = tah.DrainFinalDeliver;
                break;
            case 'equ':
                t_totalSpace = cont.FinalEquipp;
                t_execSpace = execM[execM.length - 1].EquipCum;
                t_readySpace = tah.ReadyEquipped;
                t_docSpace = tah.EquipDoc;
                t_deliverSpace = tah.EquippedDelivered;
                t_deliverRemovedSpace = tah.EquippedRemove;
                t_deliverWithoutSpace = tah.EquippedDelivered3;
                t_deliver2Space = tah.EquippedFinalDeliver;
                break;
        }
        // $('#t_totalSpace').text(t_totalSpace);
        // $('#t_execSpace').text(t_execSpace);
        // $('#t_docSpace').text(t_docSpace);
        // $('#t_deliverSpace').text(t_deliverSpace);
        // $('#t_deliverRemovedSpace').text(t_deliverRemovedSpace);
        // $('#t_deliver2Space').text(t_deliver2Space);


        var yAxis = { title: 'هكتار' };
        var o = basicColumnOptions([], {}, [], yAxis, "وضعیت تحویل", "", { enable: true }, { multi: false });
        o.xAxis.categories = ['سطح کل', ' اجراشده', ' قابل بهره برداری', 'ارسال مستندات', 'تحویل شده', 'رفع نقص شده', 'تحویل قطعی'];
        o.series = [{ name: 'تحويل', type: 'column', colorByPoint: true,data: [t_totalSpace, t_execSpace, t_readySpace, t_docSpace, t_deliverSpace, t_deliverRemovedSpace + t_deliverWithoutSpace, t_deliver2Space] }];
        //var o2 = activityGaugeOptions(yAxis2, series2, 'وضعیت تحویل');
        Highcharts.chart('tahvil1Chart', o);



        // var series2 = [{
        //     type: 'pie',
        //     name: 'سطح',
        //     innerSize: '50%',
        //     data: [
        //         { name: ' سطح تحویل شده', y: t_deliverSpace },
        //         { name: 'تحویل نشده', y: t_totalSpace - t_deliverSpace }]
        // }];
        // var o2 = donutOptions(series2, " ", "");
        // Highcharts.chart('tahvil2Chart', o2);

        // var series3 = [{
        //     type: 'pie',
        //     name: '',
        //     innerSize: '50%',
        //     data: [{ name: 'سطح رفع نقص شده', y: t_deliverRemovedSpace },
        //     { name: 'تحویل بدون نقص', y: t_deliverWithoutSpace },
        //     { name: 'رفع نقص نشده', y: t_deliverSpace - t_deliverRemovedSpace + t_deliverWithoutSpace }]
        // }];
        // var o3 = donutOptions(series3, "", "", { multi: false });
        // Highcharts.chart('tahvil3Chart', o3);
        // var series = [{
        //     name: 'سطح تحویل', size: '60%', data: [{ name: 'رفع نقص شده', y: t_deliverRemovedSpace, color: Highcharts.Color(colors[0]).brighten(0.1).get() },
        //     { name: 'بدون نقص', y: t_deliverWithoutSpace, color: Highcharts.Color(colors[0]).brighten(0.2).get() },
        //     { name: 'رفع نقص نشده', y: t_deliverSpace - t_deliverRemovedSpace + t_deliverWithoutSpace, color: Highcharts.Color(colors[0]).brighten(0.3).get() },
        //     { name: 'تحویل نشده', y: t_totalSpace - t_deliverSpace, color: colors[1],color: Highcharts.Color(colors[1]).brighten(0.3).get() }]
        // },
        // { name: 'سطح تحویل', size: '80%', innerSize: '60%', data: [{ name: 'تحویل شده', y: t_deliverSpace, color: colors[0] }, { name: 'تحویل نشده', y: t_totalSpace - t_deliverSpace, color: colors[1] }] }];

        // var o2 = pieColumnOptions(series, "", "", { multi: false });

        // Highcharts.chart('tahvil2Chart', o2);

    }

    function tahvilYear(type) {

        var seri = [];
        for (let i = 0; i < tahY.length; i++) {
            const e = tahY[i];
            switch (type) {
                case 'net':
                    seri.push({ name: e.Year, y: e.NetDeliveryLevel });
                    break;
                case 'dar':
                    seri.push({ name: e.Year, y: e.DrainageDeliverylevel });
                    break;
                case 'equ':
                    seri.push({ name: e.Year, y: e.EquippedDeliverylevel });
                    break;
            }
        }
        var o = pieOptions('', '', { custom: { pointFormat: ' سطح : <b>{point.y}</b><br/> درصد : <b>{point.percentage:.1f}</b>' } }, seri)
        Highcharts.chart('tahvil2Chart', o);
    }
})
