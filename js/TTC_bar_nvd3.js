
d3.json('data/bardata.json', function(error, bardata) {
    if (error) throw error;

    nv.addGraph(function() {
        var barchart = nv.models.discreteBarChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .staggerLabels(true)
            .showValues(false)
            .duration(250)
            .tooltipContent(function(key, label, value, graph) {
              return "Years to Crime: " + label + "<br /><hr></hr>Number of recoveries: " + value + "<hr></hr>"
            })
            ;

        barchart.yAxis
            .tickFormat(d3.format(',.0d'))
            .axisLabel('Count of Recovered Guns')
        barchart.xAxis
            .axisLabel('Years Since Last Recorded Sale')

        d3.select('#TTC_bar_chart svg')
            .datum(bardata)
            .call(barchart);
        nv.utils.windowResize(barchart.update);
        return barchart;
    });
})
