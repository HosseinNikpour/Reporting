
function drillDownData(data, groupByField, xAxis, yAxis, sort) {
    var returnArr = [];
    var query = ' for (var i = 0; i < data.length; i++) {' +
               '      var a = returnArr.find(function (x) { return x.title == data[i].' + groupByField + ' });' +
               '      if (a)' +
               '          {a.sum' + yAxis + ' += data[i].' + yAxis + ';' +
               '           a.drill.data.push([data[i].' + xAxis + ',data[i].' + yAxis + ']);}' +
               '      else' +
               '          returnArr.push({ title: data[i].' + groupByField + ', sum' + yAxis + ': data[i].' + yAxis + ' , drill: { name: data[i].' + groupByField + ', id: data[i].' + groupByField + ', data: [[data[i].' + xAxis + ',data[i].' + yAxis + ']] } })' +
               '  }'
    eval(query);
    if (sort == 1)
        return returnArr.sort(dynamicSort("sum" + yAxis));
    else if (sort == 1)
        return returnArr.sort(dynamicSort("-sum" + yAxis));
    return returnArr;
}


function columnData(data, catField, yAxis) {

    var catArr = [], yAxisData = []
    var out = { cat: catArr };
    var q1 = '', q2 = '', q3 = '', outStr = '';
    for (var z = 0; z < yAxis.length; z++) {
        q1 += 'var yAxis' + z + ' = []; ';
        q2 += 'if(! yAxisData[' + z + '])  yAxisData.push({dynamicField:undefined,data:[]}); yAxisData[' + z + '].data.push(data[i].' + yAxis[z] + ') ;';
        q3 += 'yAxisData[' + z + '].data[index] += data[i].' + yAxis[z] + ';';

    }
    
    var query = q1 +
              ' for (var i = 0; i < data.length; i++) {' +
              '     var index = catArr.indexOf(data[i].' + catField + ');' +
              '     if (index == -1) {' +
              '         catArr.push(data[i].' + catField + ');' +
                         q2 +
              '     }' +
              '     else {' +
                          q3 +
              '     }' +
              ' } ';

 //   console.log(query)
    eval(query);
    out.yAxisData = yAxisData;
    return out;
}

function columnDataDynamic(data, catField, yAxis, dynamicField) {

    var catArr = [], yAxisData = [], dynamicFields = [];


    var qq = '      for (var h = 0; h < data.length; h++) {' +
            '          if (dynamicFields.indexOf(data[h].' + yAxis + ')==-1) {' +
            '              dynamicFields.push(data[h].' + yAxis + ');' +
            '          }' +
            '      }';
    eval(qq);



    var out = { cat: catArr };
    var q1 = '', q2 = '', q3 = '', outStr = '';
    for (var y = 0; y < dynamicFields.length; y++) {
        for (var z = 0; z < yAxis.length; z++) {
            q1 += 'var yAxis' + z + ' = []; ';
            q2 += 'if(! yAxisData[' + z + '] ||! yAxisData[' + z + '].dynamicField!=' + dynamicFields[y] + ')  yAxisData.push({dynamicField:' + dynamicFields[y] + ', data:[]); '+
                  'yAxisData[' + z + '].data.push(data[i].' + yAxis[z] + ') ;';
            q3 += 'yAxisData[' + z + '].data[index] += data[i].' + yAxis[z] + ';';

        }
    }
    var query = q1 +
              ' for (var i = 0; i < data.length; i++) {' +
              '     var index = catArr.indexOf(data[i].' + catField + ');' +
              '     if (index == -1) {' +
              '         catArr.push(data[i].' + catField + ');' +
                         q2 +
              '     }' +
              '     else {' +
                          q3 +
              '     }' +
              ' } ';

    console.log(query);
    eval(query);
    out.yAxisData = yAxisData;
    return out;
}

function getPivotArray(dataArray, rowIndex, colIndex, dataIndex) {
   
    var result = {}, ret = [];
    var newCols = [];
    for (var i = 0; i < dataArray.length; i++) {

        if (!result[dataArray[i][rowIndex]]) {
            result[dataArray[i][rowIndex]] = {};
        }
        result[dataArray[i][rowIndex]][dataArray[i][colIndex]] = dataArray[i][dataIndex];

        //To get column names
        if (newCols.indexOf(dataArray[i][colIndex]) == -1) {
            newCols.push(dataArray[i][colIndex]);
        }
    }

    newCols.sort();
    var item = [];

    //Add Header Row
    item.push('Item');
    item.push.apply(item, newCols);
    ret.push(item);

    //Add content 
    for (var key in result) {
        item = [];
        item.push(key);
        for (var i = 0; i < newCols.length; i++) {
            item.push(result[key][newCols[i]] || "-");
        }
        ret.push(item);
    }
    return ret;
}

function convertInvoiceMonthly(invoice,invoiceC,adjustment){
    var invoiceArray=[],invoiceTajamoeArray=[],invoiceCArray=[],periods=[],invoiceMonthly=[],invoiceCMonthly=[],invoiceMonthlyTajamoe=[];
    invoiceTajamoeArray=invoice;
    for (let i = 0; i < invoice.length; i++) {
        var p=0;
        if(i==0)
         p=(invoice[0].NetworkCM+invoice[0].EquippedCM);
         else
         p=(invoice[i].NetworkCM+invoice[i].EquippedCM)-(invoice[i-1].NetworkCM+invoice[i-1].EquippedCM);

       var datesArray=getDates(invoice[i].StartDate,invoice[i].EndDate,p);
       invoiceArray=invoiceArray.concat(datesArray);
    }
    for (let i = 0; i < invoiceC.length; i++) {
        var datesArray=getDates(invoiceC[i].StartDate,invoiceC[i].EndDate,invoiceC[i].NetworkCM);
        invoiceCArray= invoiceCArray.concat(datesArray);
     }

     var periods=[];
     for (let i = 0; i < invoiceArray.length; i++) {
         var m=invoiceArray[i].date.format('jYY/jMM');
        if(periods.indexOf(m)==-1) 
            periods.push(m);
     }
     for (let i = 0; i < invoiceCArray.length; i++) {
        var m=invoiceCArray[i].date.format('jYY/jMM');
       if(periods.indexOf(m)==-1) 
           periods.push(m);
    }

    periods.sort();
   for (let i = 0; i < periods.length; i++) {
       var sumInv=0,sumInvC=0;
     var temp1= invoiceArray.filter(function(x){return x.date.format('jYY/jMM')==periods[i] });    
        for (let j = 0; j < temp1.length; j++) {
            sumInv+=temp1[j].price;          
        }
        
       // invoiceMonthlyTajamoe.push(sumInv);
       // if(i==0)
            invoiceMonthly.push(sumInv);
       // else
         //   invoiceMonthly.push(sumInv-invoiceMonthlyTajamoe[i-1]);    

        var temp2= invoiceCArray.filter(function(x){return x.date.format('jYY/jMM')==periods[i] });    
        for (let j = 0; j < temp2.length; j++) {
            sumInvC+=temp2[j].price;          
        }
        invoiceCMonthly.push(sumInvC)
   }



   return{periods:periods,invoiceMonthly:invoiceMonthly,invoiceCMonthly:invoiceCMonthly,invoiceMonthlyTajamoe:invoiceMonthlyTajamoe};
}

function getDates(startDate, stopDate,totalPrice) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    var diff=stopDate.diff(currentDate,'days')+1;
    while (currentDate <= stopDate) {
        dateArray.push({date: moment(currentDate),price: totalPrice/diff});
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}

