function setType(type) { return { type: type } }
function setTitle(title) { return { text: title } }
function setSubTitle(title) { return { text: title } }
function setxAxis(type, categories) { return { type: type, categories: categories } }
function setyAxis(title) { return { title: { text: title }, min: 0 } }
function setLegend(enabled) { return { enabled: enabled } }
function setPlotOptions(dataLabelsEnabled, dataLabelsFormat) {
    return {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: dataLabelsEnabled,
                format: dataLabelsFormat ? dataLabelsFormat : '{point.y:.0f}'
            }
        }
    }
}
function setTooltip(multi, custom) {
    var headerFormat = '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat = '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:,.0f}</b><br/>',
        footerFormat = '';
    if (multi) {

        headerFormat = '<span style="font-size:10px">{point.key}</span><table>';
        pointFormat = '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y:,.0f}</b></td></tr>';
        footerFormat = '</table>';
    }
    if (custom) {
        headerFormat = custom.headerFormat;
        pointFormat = custom.pointFormat;
        footerFormat = custom.footerFormat;
    }
    return {
        shared: true,
        useHTML: true,

        headerFormat: headerFormat,
        pointFormat: pointFormat,
        footerFormat: footerFormat
    }
}

var colors = ["#64B5F6", "#E57373", "#81C784 ", "#FFD54F", "#9575CD", "#4DD0E1", "#F0B27A", "#F0B27A", "#D35400", "#99FFFF", "#669966", "#F5B041", "#99A3A4", "#FFCCBC", "#9FA8DA"];

Highcharts.setOptions({ lang: { numericSymbols: ['هزار', 'میلیون', 'میلیارد', 'بیلیون', '   بیلیارد'], thousandsSep: ',' } });

function setStatics() {
    var o = {};
    o.credits = {
        enabled: false
    }
    o.colors = colors;
    return o;
}
//all types
function drillDownOptions(Data, groupByField, xAxis, yAxis, title, subTitle, yAxisTitle, seriName, enableLegend, plotDataLabelsEnabled, plotDataLabelsFormat, headerFormat, pointFormat) {
    var o = setStatics();

    o.chart = setType('column');
    o.title = setTitle(title);
    o.subtitle = setSubTitle(subTitle);
    o.xAxis = setxAxis('category');
    o.yAxis = setyAxis(yAxisTitle);
    o.legend = setLegend(enableLegend);
    o.plotOptions = setPlotOptions(plotDataLabelsEnabled, plotDataLabelsFormat)
    o.tooltip = setTooltip(headerFormat, pointFormat);

    var chartData = drillDownData(Data, groupByField, xAxis, yAxis);
    var seri = [{
        name: seriName,
        colorByPoint: true,
        data: []
    }],
        drilSeri = [];
    for (var i = 0; i < chartData.length; i++) {
        seri[0].data.push({ name: chartData[i].title, y: chartData[i].sumNetworkFinal, drilldown: chartData[i].title });
        chartData[i].drill.data = chartData[i].drill.data.sort(sortDesc);
        drilSeri.push(chartData[i].drill);
    }
    o.series = seri;
    o.drilldown = { series: drilSeri };
    return o;
}

function basicColumnOptions(Data, xAxis, seris, yAxis, title, subTitle, legend, toolTip, percentage, drill) {
    var o = setStatics();

    o.title = setTitle(title);
    o.subtitle = setSubTitle(subTitle);

    var seriFileds = [];
    for (var j = 0; j < seris.length; j++) {
        seriFileds.push(seris[j].field);
    }
    var d = columnData(Data, xAxis.field, seriFileds)
    o.xAxis = setxAxis(undefined, d.cat);

    o.yAxis = setyAxis(yAxis.title);
    if (legend)
        o.legend = setLegend(legend.enable);
    o.plotOptions = {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        },
        series: {}
    };
    if (toolTip) {
        if (toolTip.custom)
            o.tooltip = setTooltip(false, custom);
        else
            o.tooltip = setTooltip(true);
    }
    else
        o.tooltip = setTooltip();

    var seri = [];
    for (var i = 0; i < d.yAxisData.length; i++) {

        var ss = Object.assign({}, { data: d.yAxisData[i].data }, seris[i]);

        seri.push(ss);
    }

    if (percentage) {
        // o.plotOptions.column.stacking = 'percent';
        seri = percentageSeri(seri);
    }

    if (drill) {

        o.plotOptions.series = {
            cursor: 'pointer',
            point: {
                events: {
                    click: function () {
                        resetChart(this.category);

                    }
                }
            }
        };

    }



    o.series = seri;

    return o;
}

function stackingColumnOptions(Data, xAxis, seris, yAxis, title, subTitle, legend, toolTip, percentage, type, drill) {
    var o = basicColumnOptions(Data, xAxis, seris, yAxis, title, subTitle, legend, toolTip, percentage, drill);
    if (type == 'fixedPlacement') {

        var paddings = [0.20, 0.30, 0.40, 0.50];
        for (var i = 0; i < seris.length; i++) {
            o.series[i].pointPadding = paddings[i];
            //  padding = parseFloat(padding.toFixed(2)) + 0.10;
        }
        o.plotOptions = {
            column: {
                grouping: false,
                shadow: false,
                borderWidth: 0
            }
        }
    }
    else if (type == 'stacking')
        o.plotOptions.column.stacking = 'normal';

    return o;
}

function pieOptions( title, subTitle, toolTip,series) {
    var o = setStatics();
    o.chart = {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    };
    o.title = setTitle(title);

    o.plotOptions = {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    }


    if (toolTip) {
        if (toolTip.custom)
            o.tooltip = setTooltip(false, toolTip.custom);
        else
            o.tooltip = setTooltip(true);
    }
    else
        o.tooltip = setTooltip();

        


    o.series = [{
        name: '',
        colorByPoint: true,
        data:series
    }];
    o.responsive = {
        rules: [{
            condition: {
                maxWidth: 400
            },
            chartOptions: {
                series: [{
                    id: 'versions',
                    dataLabels: {
                        enabled: false
                    }
                }]
            }
        }]
    }

    return o;
}
function donutOptions(series, title, subTitle, toolTip) {
    var o = setStatics();
    o.chart = {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
    };
    o.title = setTitle(title);
    // o.subtitle = setSubTitle(subTitle);
    //o.yAxis = setyAxis(title);
    o.plotOptions = {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -25,
                style: {
                    fontWeight: '12px',
                    color: 'white'
                }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%']
        }
    };

    if (toolTip) {
        if (toolTip.custom)
            o.tooltip = setTooltip(false, custom);
        else
            o.tooltip = setTooltip(true);
    }
    else
        o.tooltip = { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' };
    o.series = series;
    o.responsive = {
        rules: [{
            condition: {
                maxWidth: 400
            },
            chartOptions: {
                series: [{
                    id: 'versions',
                    dataLabels: {
                        enabled: false
                    }
                }]
            }
        }]
    }

    return o;
}
function gaugeOptions(yAxis, series) {
    var o = setStatics();

    o.chart = { type: 'solidgauge' };

    o.title = null;

    o.pane = {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    };

    o.tooltip = { enabled: false };

    o.yAxis = {
        stops: [
            [0.4, '#DF5353'], // red  
            [0.7, '#DDDF0D'], // yellow
            [0.8, '#55BF3B'] // green
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: { y: -70 },
        labels: { y: 16 },
        min: yAxis.min,
        max: yAxis.max,
        title: {
            text: yAxis.title
        }
    };

    o.plotOptions = {
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    };
    o.credits = {
        enabled: false
    }

    o.series = [];

    for (var i = 0; i < series.length; i++) {
        o.series.push({
            name: series[i].name,
            data: series[i].data,
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                    '<span style="font-size:12px;color:silver">' + series[i].valueSuffix + '</span></div>'
            },
            tooltip: {
                valueSuffix: series[i].valueSuffix
            }
        })
    }
    return o;
}

function activityGaugeOptions(yAxis, series, title) {
    var o = setStatics();

    o.chart = {
        type: 'solidgauge', height: '110%',
        events: {
            render: renderIcons
        }
    };

    o.title = { text: title, style: { fontSize: '24px' } };



    o.tooltip = {
        useHTML: true,
        borderWidth: 0,
        backgroundColor: 'none',
        shadow: false,
        style: {
            fontSize: '13px'
        },
        pointFormat: '<div style="direction: ltr;text-align:center"><span>{series.name}</span><br> <span style="font-size:3em; color: {point.color}; font-weight: bold;font-family:yekanNumber">{point.y}</span></div>',
        positioner: function (labelWidth) {
            return {
                x: (this.chart.chartWidth - labelWidth) / 2,
                y: (this.chart.plotHeight / 2) + 15
            };
        }
    };

    o.yAxis = {
        lineWidth: 0,
        tickPositions: [],
        min: yAxis.min,
        max: yAxis.max

    };

    o.plotOptions = {
        solidgauge: {
            dataLabels: {
                enabled: false
            },
            linecap: 'round',
            stickyTracking: false,
            rounded: true
        }
    };

    o.pane = {
        startAngle: 0,
        endAngle: 360,
        background: []
    };
    o.series = [];
    var num = 112;
    for (var i = 0; i < series.length; i++) {
        o.series.push({
            name: series[i].name,
            data: [{
                color: colors[i],//Highcharts.getOptions().colors[i],
                y: series[i].y,
                radius: num + '%', innerRadius: (num - 24) + '%'
            }],
            //showInLegend: true
        });
        o.pane.background.push({ // Track for Move
            outerRadius: num + '%',
            innerRadius: (num - 24) + '%',
            backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[i])
                .setOpacity(0.3)
                .get(),
            borderWidth: 0
        });
        num -= 25;
    }




    return o;
}

//functions
function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function sort(a, b) {
    if (a[1] < b[1]) return -1;
    if (a[1] > b[1]) return 1;
    return 0;
}
function sortDesc(a, b) {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
}

function percentageSeri(seri) {
    for (var i = 0; i < seri.length; i++) {
        seri[i].dataOrg = JSON.parse(JSON.stringify(seri[i].data));
        for (var j = 0; j < seri[i].data.length; j++) {
            if (i == 0)
                seri[i].data[j] = 100;
            else
                seri[i].data[j] = seri[i].dataOrg[j] / seri[i - 1].dataOrg[j] * 100;
        }
    }

    return seri;
}


function renderIcons() {

    // Move icon
    if (!this.series[0].icon) {
        this.series[0].icon = this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8])
            .attr({
                'stroke': '#ffffff',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': 2,
                'zIndex': 10
            })
            .add(this.series[2].group);
    }
    this.series[0].icon.translate(
        this.chartWidth / 2 - 10,
        this.plotHeight / 2 - this.series[0].points[0].shapeArgs.innerR -
        (this.series[0].points[0].shapeArgs.r - this.series[0].points[0].shapeArgs.innerR) / 2
    );

    // Exercise icon
    if (!this.series[1].icon) {
        this.series[1].icon = this.renderer.path(
            ['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8,
                'M', 8, -8, 'L', 16, 0, 8, 8]
        )
            .attr({
                'stroke': '#ffffff',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': 2,
                'zIndex': 10
            })
            .add(this.series[2].group);
    }
    this.series[1].icon.translate(
        this.chartWidth / 2 - 10,
        this.plotHeight / 2 - this.series[1].points[0].shapeArgs.innerR -
        (this.series[1].points[0].shapeArgs.r - this.series[1].points[0].shapeArgs.innerR) / 2
    );

    // Stand icon
    if (!this.series[2].icon) {
        this.series[2].icon = this.renderer.path(['M', 0, 8, 'L', 0, -8, 'M', -8, 0, 'L', 0, -8, 8, 0])
            .attr({
                'stroke': '#ffffff',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'stroke-width': 2,
                'zIndex': 10
            })
            .add(this.series[2].group);
    }

    this.series[2].icon.translate(
        this.chartWidth / 2 - 10,
        this.plotHeight / 2 - this.series[2].points[0].shapeArgs.innerR -
        (this.series[2].points[0].shapeArgs.r - this.series[2].points[0].shapeArgs.innerR) / 2
    );
}