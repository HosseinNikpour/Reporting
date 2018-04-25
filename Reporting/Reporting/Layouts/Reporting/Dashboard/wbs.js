var data = [];
$(document).ready(function () {
    $('#areaSelect').hide();
    $('#contractSelect').hide();
    var areas = [], contracts = [],periods=[];

    Promise.all([getContracts(), getAreas(),getWeeklyPeriods()]).then(function (d) {
        var html = '', opNotJari = '';
        areas = d[1].d.results, contracts = d[0].d.results, periods = d[2].d.results;

        var html = '';
        for (let i = 0; i < areas.length; i++) {
            const a = areas[i];
            html += '<option  value="' + a.Id + '">' + a.Title + '</option>'
        }
        $('#areaSelect').html(html);
        html = '';
        for (let i = 0; i < contracts.length; i++) {
            const a = contracts[i];
            html += '<option  value="' + a.Id + '">' + a.Title + '</option>'
        }
        $('#contractSelect').html(html);
        html = '';
        for (let i = 0; i < periods.length; i++) {
            const a = periods[i];
            html += '<option  value="' + a.Id + '">' + a.Title + '</option>'
        }
        $('#periodSelect').html(html);

        $('#btnView').on('click', function () {
            var area = $('#areaSelect').val().toString().replace(',','-');
            var cont = $('#contractSelect').val().toString().replace(',','-');
            var per = $('#periodSelect').val().toString().replace(',','-');
            var type=$('input[name=x]:checked').val();
            $('#pag-loadeDisable').attr('id', 'pag-loade');
            getWbsData(cont, area,per,type).done(function (c) {
                data = [];
                data = JSON.parse(c.d);
                createTableData();


                $('#pag-loade').attr('id', 'pag-loadeDisable');
                $('#page-wrapper').show();
            });
        });

        $('#periodSelect').select2({ dir: "rtl"});
        $('#contractSelect').select2({ dir: "rtl"});
        $('#areaSelect').select2({ dir: "rtl"});
        $('#pag-loade').attr('id', 'pag-loadeDisable');
        



      
    })

$('input:radio[name="x"]').change(function () {
        if (this.value == '1') {
            $('#periodSelect').removeAttr('multiple');
            $('#periodSelect').select2({ dir: "rtl"});
           
        }
      
        else {
            $('#periodSelect').attr('multiple','multiple');
            $('#periodSelect').select2({ dir: "rtl"});
           
        }
    })




    // $('input:radio[name="radAnswer"]').change(function () {
    //     if (this.value == 'area') {
    //         $('#areaSelect').show();
    //         $('#contractSelect').hide();
           
    //     }
    //     else if (this.value == 'contract') {
    //         $('#areaSelect').hide();
    //         $('#contractSelect').show();
           
    //     }
    //     else {
    //         $('#areaSelect').hide();
    //         $('#contractSelect').hide();
    //     }
    // })
    // $('#areaSelect').select2({
    //     containerCss: function (element) {
    //         var style = $(element)[0].style;
    //         return {
    //             display: style.display
    //         };
    //     }
    // })
    // $('#contractSelect').select2({
    //     containerCss: function (element) {
    //         var style = $(element)[0].style;
    //         return {
    //             display: style.display
    //         };
    //     }
    // });




    function createTableData() {
        let html = '',html2 = '',
        sumNet=0,ConstNet=0,leftNet=0,
        sumDrain=0,ConstDrain=0,leftDrain=0,
        sumEqu=0,ConstEqu=0,leftEqu=0,
        sumMaz=0,ConstMaz=0,leftMaz=0,
        sumKhod=0,ConstKhod=0,leftKhod=0;
        for (let i = 0; i < data.length; i++) {
            const e = data[i];
            html += '<tr><td>' + e.MainOperation + '</td><td>' + e.Operation + '</td><td>' + e.SubOperation + '</td><td>' + e.Measurement + '</td><td>' + e.FinalVolume + '</td><td>' + e.Constructed + '</td><td>' + e.Left + '</td></tr>';

            if((e.OperationId=='1'||e.OperationId=='2'||e.OperationId=='3'||e.OperationId=='4')&& e.SubOperationId=='1'&&e.Measurement=='هکتار')
           { 
               sumNet+=e.FinalVolume;
               ConstNet+= e.Constructed ;
               leftNet+=e.Left
           }
           else  if(e.OperationId=='6'&& e.SubOperationId=='1'&&e.Measurement=='هکتار')
           { 
            sumDrain+=e.FinalVolume;
               ConstDrain+= e.Constructed ;
               leftDrain+=e.Left
           }
           else  if(e.OperationId=='7'&& e.SubOperationId=='6'&&e.Measurement=='هکتار')
           { 
               sumEqu+=e.FinalVolume;
               ConstEqu+= e.Constructed ;
               leftEqu+=e.Left
           }
           else  if(e.OperationId=='7'&& e.SubOperationId=='29'&&e.Measurement=='هکتار')
           { 
               sumMaz+=e.FinalVolume;
               ConstMaz+= e.Constructed ;
               leftMaz+=e.Left
           }
           else  if(e.OperationId=='7'&& e.SubOperationId=='27'&&e.Measurement=='هکتار')
           { 
               sumKhod+=e.FinalVolume;
               ConstKhod+= e.Constructed ;
               leftKhod+=e.Left
           }
        }
        $('#wbsTable tbody').html(html);

        html2 += '<tr><td>شبکه فرعی</td><td>' + sumNet+ '</td><td>' + ConstNet+ '</td><td>' +leftNet + '</td></tr>';
        html2 += '<tr><td>زهکش زیر زمینی</td><td>' + sumDrain+ '</td><td>' + ConstDrain+ '</td><td>' +leftDrain + '</td></tr>';
        html2 += '<tr><td>تجهیز و نوسازی</td><td>' + sumEqu+ '</td><td>' + ConstEqu+ '</td><td>' +leftEqu + '</td></tr>';
        if(sumKhod>0)
        html2 += '<tr><td>خود اجرایی (ناخالص)</td><td>' + sumKhod+ '</td><td>' + ConstKhod+ '</td><td>' +leftKhod + '</td></tr>';
        if(sumMaz>0)
        html2 += '<tr><td>شبکه توزیع آب درون مزارع (ناخالص)-اجرا</td><td>' + sumMaz+ '</td><td>' + ConstMaz+ '</td><td>' +leftMaz + '</td></tr>';
        $('#wbsTableShort tbody').html(html2);
    }


})
