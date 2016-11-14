/* text content */
// In order to create the diverging bar chart, set the in-state values to negative numbers,
// which means that the axis tick labels have to be overridden (by default they would say -100%, -80%, etc) 
var ticksformatted = ["100%", '80%', '60%', '40%', '20%', '0%', '20%', '40%', '60%', '80%', '100%']

// content for each corresponding data type, using the class as the hash key to make content changes easier and keep naming conventions consistent
var barcontent = {
    'all' : "All markets in New York State obtain the majority of their crime guns from out-of-state, with the exception of Rochester. New York City, with its rigorous permitting requirements for all guns, has the highest percentage of out-of-state guns (87%). New York City is followed by Long Island and the Lower Hudson Valley, with 73% and 70% of guns originating out-of-state, respectively.",
    'gpv' : "When looking only at low time-to-crime guns, one would expect local contributions to increase because a shorter time between purchase and recovery allows less time for a firearm to travel. This is true everywhere except New York City, which had 91% of its low time-to-crime guns originating out-of-state. For low time-to-crime guns, four markets received the majority of guns from out-of-state: New York City (91%), Long Island (58%), the Lower Hudson Valley (53%), and the Capital Region (52%). Rochester’s percentage of out-of-state guns dropped considerably from 44% for all guns to 22% for low time-to-crime guns, suggesting that many Rochester guns purchased with the intent to divert to illegal use originated in New York.",
    
    'handgun' : "If New York State’s strict handgun laws worked to prevent criminals from acquiring handguns, we’d expect to see relatively higher rates of low time-to-crime handguns originating out-of-state. We do. Notably, as compared to low time-to-crime guns generally, Rochester sees a 21% increase in out-of-state handguns to 43%, while Buffalo, Syracuse, and Capital Regions see about a 30% increase in out-of-state contributions from just reviewing low time-to-crime guns. New York City continues to lead the markets with 94% of low time-to-crime handguns originating out-of-state. In short, if you are a criminal operating in New York who wants to obtain a handgun, you are far more likely to get one from an out-of-state source than from here in New York."
  }

var market_list = ["NY State", "NYC", "Long Island", "Lower Hudson Valley", "Capital Region", "Syracuse", "Buffalo", "Rochester"]

/* ---- Globals ---- */

  var width_barall = 660,
      height_barall = 330;

  var svg_barall = d3.select('#barall svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + width_barall + " " + height_barall + "");

  var g_barall = svg_barall.append('g').attr('class', 'init_draw').attr('height', height_barall).attr('width', width_barall)

  var g_barneg = svg_barall.append('g').attr('class', 'init_neg').attr('height', height_barall).attr('width', width_barall)

  var x_barall = d3.scale.linear()
    .range([0, width_barall]);

  var y_barall = d3.scale.ordinal()
    .rangeRoundBands([0, height_barall], .2);

  var xAxis_barall = d3.svg.axis()
    .scale(x_barall)
    .orient('top')
    .tickFormat(function(d, i) { return ticksformatted[i] })
    ;

function unclick_allguns_button() {
  d3.select('#allguns_button').style("background", 'none');
}


/* ------------------------ DRAW ------------------------------------- */

function drawaxis() {
    var g_baraxis = svg_barall.append('g').attr('class', 'axis_draw').attr('height', height_barall).attr('width', width_barall)

    x_barall.domain([-105, 105]) //domain has to go a little over 100, otherwise 100% ticks get cut off at large window sizes.
    y_barall.domain(market_list);// if I do the market list at least I only have to re-read the CSV when clicking the bar info.

    g_baraxis.append('g')
        .attr('class', 'x_barall baraxis')
        .attr('transform', 'translate(0, -5)')
        .style('stroke-width', '2px')
        .call(xAxis_barall)
      .append('text')
        .attr('x', 0)
        .attr('y', -25)
        .attr('font-size', '14px')
        .text('Percentage of guns bought in-state');

    g_baraxis.selectAll('.x_barall')
      .append('text')
        .attr('x', 420)
        .attr('y', -25)
        .attr('font-size', '14px')
        .text('Percentage of guns bought out-of-state');

    g_baraxis.append('g')
        .attr('class', 'y_barall baraxis')
      .append('line')
        .attr('x1', x_barall(0))
        .attr('x2', x_barall(0))
        .attr('y1', -5)
        .attr('y2', height_barall);

    g_baraxis.selectAll('.bartext')
      .data(d3.range(8)) //loop through the list of market names
      .enter().append('text')
      .attr('class', 'bartext')
      .attr('text-anchor', 'start')
      .attr('x', x_barall(2))
      .attr('y', function(d) { return y_barall(market_list[d]) + 20})
      .text(function(d) { return market_list[d]})
}

function drawbars(col1, col2, inclass) {
  d3.csv('data/diverging_instate_oos.csv', function (error, data) {
    if (error) throw error;
    x_barall.domain([-105, 105])
    y_barall.domain(data.map(function(d) { return d.Market }));

    //the rectangles, when drawn, get a class depending on what bucket they belong to, so that they can be removed specifically, rather than removing all rect or all g. This allows for better transition.
    g_barall.selectAll('g')
        .data(data)
      .enter().append('rect')
        .attr('class', inclass)
        .style('opacity', 0)
        .style('fill', '#fc8d59')
        .attr('x', function(d) { return x_barall(Math.min(0, d[col1])) }) //in-state column data
        .attr('y', function(d) { return y_barall(d.Market) })
        .attr('width', function(d) { return Math.abs(x_barall(d[col1]) - x_barall(0)) })
        .attr('height', y_barall.rangeBand())
        .transition()
          .duration(700)
          .style('opacity', 1)

    g_barneg.selectAll('g')// this has to be select g instead of rect or else it won't allow the simultaneous draw and remove of bars.
        .data(data)
      .enter().append('rect')
        .attr('class', inclass)
        .style('opacity', 0)
        .style('fill', '#de2d26')
        .attr('x', function(d) { return x_barall(Math.min(0, d[col2])) }) // out-of-state column data.
        .attr('y', function(d) { return y_barall(d.Market) })
        .attr('width', function(d) { return Math.abs(x_barall(d[col2]) - x_barall(0)) })
        .attr('height', y_barall.rangeBand())
        .transition()
          .duration(700)
          .style('opacity', 1)

    // text below bar chart is dynamic, depending on which button above the chart is clicked.
    d3.select('#dynamicdivergingbar')
      .html(barcontent[inclass]) //class name of bars is also used as the key for dynamic text
    svg_barall.selectAll('rect')
      .style('stroke', function(d) { return d.Market == 'NYS' ? '#000' : 'none' })
      .style('stroke-width', function(d) { return d.Market == 'NYS' ? '1.5px' : 'none'})
  }) //makes the bar for the state as a whole more obvious.
};

//the bars that are currently drawn could be one of two other classes, because there are three buttons total. This selects both classes and removes them (there is no cost for selecting the class that doesn't exist on the svg)
function removebars(class1, class2) {
    svg_barall.selectAll(class1)
      .transition()
        .duration(700)
        .style('opacity', 0)
        .remove();
    svg_barall.selectAll(class2)
      .transition()
        .duration(700)
        .style('opacity', 0)
        .remove();
}

function toggle_allguns() {
  d3.select('#allguns_button').style('background', '#aaa');
  removebars('.gpv', '.handgun');
  drawbars('In_State', 'Out_of_State', 'all')
};

function toggle_highttc() {
  unclick_allguns_button(); //making sure the initial click is cleared.
  removebars('.all', '.handgun');
  drawbars('In_stateGPV', 'Out_of_StateGPV', 'gpv')
};

function toggle_handguns() {
  unclick_allguns_button();
  removebars('.gpv', '.all')
  drawbars('In_StateGPVHandgun', 'Out_of_StateGPVHandgun', 'handgun')
};

//Call the initializing functions on the svg.
svg_barall
  .call(drawaxis)
  .call(toggle_allguns)
