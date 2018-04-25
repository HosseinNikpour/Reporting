var cont, tah, execM, tahY;
$(document).ready(function () {
    $('#areaSelect').hide();
    $('#contractSelect').hide();
    var areas = [], contracts = [], periods = [];

    Promise.all([getContracts(), getAreas(), getWeeklyPeriods()]).then(function (d) {
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
            var area = $('#areaSelect').val().toString();
            var cont = $('#contractSelect').val().toString();
            var type = $('#typeSelect').val().toString();

            projectClick(area, cont, type)

        });

        $('#periodSelect').select2();
        $('#contractSelect').select2();
        $('#areaSelect').select2();
        $('#pag-loade').attr('id', 'pag-loadeDisable');





    })





    function projectClick(area, cont, type) {
        var start = Date.now();
        var millis = 0;
        $('#pag-loadeDisable').attr('id', 'pag-loade');

        var contractID = $(this).val();
        $('#pag-loade').attr('id', 'pag-loadeDisable');
        $('#page-wrapper').show();
        getContractData(cont, area).done(function (c) {
            cont = JSON.parse(c.d);
            createContrcatSection();


        });



        getExecMonthlyData(contractID).done(function (e) {
            execM = JSON.parse(e.d);
            ejraRavandChart('net');
            getTahvilData(contractID).done(function (e) {
                tah = JSON.parse(e.d)[0];
                tahvil('net');
                $('#tahvil1Select').on('change', function () {
                    tahvil(this.value);
                });
                tahvil('net');

            });
        });


        getTahvilByYear(contractID).done(function (e) {
            tahY = JSON.parse(e.d);
            $('#tahvil2Select').on('change', function () {
                tahvilYear(this.value);
            });
            tahvilYear('net');

        });

    }


})
