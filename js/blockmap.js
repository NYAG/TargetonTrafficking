/* -- Credit: much thanks to: https://bl.ocks.org/mimno/4a904031a566a361f2b1 */

/* ---- GLOBALS ------ */
  var active_blockmap = d3.select(null)

/* svg scaling here and on other all other SVGs via : http://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js 
Needed to address IE-compatibility, because IE hates SVGs */

  var svgblock = d3.select('#blockmap svg')
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 600 500")

  var xScale, yScale, xDomain, yDomain;

  var stateWidth = 40;

  var gap = 2;

  var stateGroup = svgblock.append("g").attr("transform", "translate(20, 20)");

  var stateXScale = d3.scale.linear().domain([0,11]).range([0, 11 * (stateWidth + gap)]);

  var stateYScale = d3.scale.linear().domain([0,7]).range([0, 7 * (stateWidth + gap)]);

  var stateGroups;

  var stateRects;

/* Legend !*/
/* I changed the yOffset for titles in the minified source code by 20px (closer to legend cells). See utils/d3-legend.min.js*/
  var legend_color_block = d3.scale.ordinal()
      .domain(['0-1%', '1-3.5%', '3.5-5%', '5-11%', '11-25%'])
      .range(['#777', '#999', '#fcae91', '#fb6a4a', '#cb181d']);

  svgblock.append('g')
      .attr('class', 'legendOrdinal')
      .attr('transform', 'translate(20, 400)')

  var blockmap_legend = d3.legend.color()
      .shapeWidth(30)
      .shapePadding(5)
      .scale(legend_color_block)
      .orient('horizontal')
      .title('Number of Likely-Trafficked Guns Traced to State')

  svgblock.select('.legendOrdinal')
      .style('class', 'legend')
      .call(blockmap_legend)


/* ------- Data Hard-coded with grid positioning, crime gun count ------- */
  //Note: I changed the grid to push NJ, PA and OH over farther. This brought CT and RI up next to 
  // MA, but that's better than having PA not border NY, which is crazy. Getting the alignment of
  // the East Coast in general (sacrificing CT and RI) is priority, since this report is about New York, the part of the map with the greatest geographic fidelity has to be around NYS.

var stateGrid = {
      "ME" : { "state": "ME", "row": 0, "col": 11,"nys_prct": 2, "erie_prct": 0.5, "monroe_prct": 0, "onondaga_prct": 1, "nyc_prct": 2, "albany_prct": 3, "longisland_prct": 1, "hudson_prct": 1 },
      
      "WI" : { "state": "WI", "row": 1, "col": 5, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 1, "longisland_prct": 0, "hudson_prct": 0 },
      
      "VT" : { "state": "VT", "row": 1, "col": 9, "nys_prct": 2, "erie_prct": 0, "monroe_prct": 1, "onondaga_prct": 1, "nyc_prct": 2, "albany_prct": 16, "longisland_prct": 0, "hudson_prct": 2 },

      "NH" : { "state": "NH", "row": 1, "col": 10,"nys_prct": 1, "erie_prct": 0, "monroe_prct": 1, "onondaga_prct": 1, "nyc_prct": 1, "albany_prct": 3, "longisland_prct": 1, "hudson_prct": 0 },

      "WA" : { "state": "WA", "row": 2, "col": 0, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 2, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 2, "hudson_prct": 0 },

      "ID" : { "state": "ID", "row": 2, "col": 1, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 2, "nyc_prct": 0, "albany_prct": 1, "longisland_prct": 0, "hudson_prct": 0 },

      "MT" : { "state": "MT", "row": 2, "col": 2, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 0, "hudson_prct": 0 },

      "ND" : { "state": "ND", "row": 2, "col": 3, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 0, "hudson_prct": 0 },

      "MN" : { "state": "MN", "row": 2, "col": 4, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 1, "nyc_prct": 0, "albany_prct": 1, "longisland_prct": 0, "hudson_prct": 0 },

      "IL" : { "state": "IL", "row": 2, "col": 5, "nys_prct": 0, "erie_prct": 1, "monroe_prct": 0, "onondaga_prct": 2, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 0, "hudson_prct": 0 },

      "MI" : { "state": "MI", "row": 2, "col": 6, "nys_prct": 0, "erie_prct": 1, "monroe_prct": 1, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 1, "hudson_prct": 1 },

      "NY" : { "state": "NY", "row": 2, "col": 8, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 1, "onondaga_prct": 1, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 3, "hudson_prct": 0, "forcolor": -1 },

      "MA" : { "state": "MA", "row": 2, "col": 10,"nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 1, "nyc_prct": 0, "albany_prct": 1, "longisland_prct": 0, "hudson_prct": 0 },

      "OR" : { "state": "OR", "row": 3, "col": 1, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 1, "longisland_prct": 1, "hudson_prct": 0 },

      "NV" : { "state": "NV", "row": 3, "col": 2, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 1, "longisland_prct": 0, "hudson_prct": 0 },

      "WY" : { "state": "WY", "row": 3, "col": 3, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 0, "hudson_prct": 0 },

      "SD" : { "state": "SD", "row": 3, "col": 4, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 0, "hudson_prct": 0 },

      "IA" : { "state": "IA", "row": 3, "col": 5, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 1, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 0, "hudson_prct": 0 },

      "IN" : { "state": "IN", "row": 3, "col": 6, "nys_prct": 1, "erie_prct": 1, "monroe_prct": 3, "onondaga_prct": 2, "nyc_prct": 1, "albany_prct": 1, "longisland_prct": 1, "hudson_prct": 1 },

      "OH" : { "state": "OH", "row": 3, "col": 7, "nys_prct": 5, "erie_prct": 19, "monroe_prct": 5, "onondaga_prct": 6, "nyc_prct": 5, "albany_prct": 4, "longisland_prct": 1, "hudson_prct": 5 },

      "PA" : { "state": "PA", "row": 3, "col": 8, "nys_prct": 13, "erie_prct": 17, "monroe_prct": 11, "onondaga_prct": 6, "nyc_prct": 13, "albany_prct": 6, "longisland_prct": 6, "hudson_prct": 16 },

      "NJ" : { "state": "NJ", "row": 3, "col": 9, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 1, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 1, "hudson_prct": 1 },

      "CT" : { "state": "CT", "row": 2, "col": 9, "nys_prct": 1, "erie_prct": 0, "monroe_prct": 1, "onondaga_prct": 0, "nyc_prct": 1, "albany_prct": 2, "longisland_prct": 1, "hudson_prct": 1 },

      "RI" : { "state": "RI", "row": 2, "col": 11,"nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 3, "longisland_prct": 0, "hudson_prct": 0 },

      "CA" : { "state": "CA", "row": 4, "col": 2, "nys_prct": 0, "erie_prct": 1, "monroe_prct": 0, "onondaga_prct":  1, "nyc_prct": 0, "albany_prct": 1, "longisland_prct": 1, "hudson_prct": 1 },

      "UT" : { "state": "UT", "row": 4, "col": 3, "nys_prct": 0, "erie_prct": 1, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 1, "hudson_prct": 0 },

      "CO" : { "state": "CO", "row": 4, "col": 4, "nys_prct": 1, "erie_prct": 1, "monroe_prct": 3, "onondaga_prct": 1, "nyc_prct": 0, "albany_prct": 1, "longisland_prct": 1, "hudson_prct": 0 },

      "NE" : { "state": "NE", "row": 5, "col": 4, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 0, "hudson_prct": 0 },

      "MO" : { "state": "MO", "row": 4, "col": 5, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 1, "longisland_prct": 1, "hudson_prct": 0 },

      "KY" : { "state": "KY", "row": 4, "col": 6, "nys_prct": 1, "erie_prct": 1, "monroe_prct": 2, "onondaga_prct": 1, "nyc_prct": 1, "albany_prct": 2, "longisland_prct": 2, "hudson_prct": 1 },

      "WV" : { "state": "WV", "row": 4, "col": 7, "nys_prct": 2, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 2, "albany_prct": 1, "longisland_prct": 0, "hudson_prct": 0 },

      "VA" : { "state": "VA", "row": 4, "col": 8, "nys_prct": 15, "erie_prct": 4, "monroe_prct": 3, "onondaga_prct": 7, "nyc_prct": 19, "albany_prct": 6, "longisland_prct": 13, "hudson_prct": 12 },
      
      "MD" : { "state": "MD", "row": 4, "col": 9, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 1, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 1, "longisland_prct": 1, "hudson_prct": 1 },
      
      "DE" : { "state": "DE", "row": 4, "col": 10,"nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 1, "hudson_prct": 0 },
      
      "AZ" : { "state": "AZ", "row": 5, "col": 2, "nys_prct": 1, "erie_prct": 0, "monroe_prct": 2, "onondaga_prct": 1, "nyc_prct": 1, "albany_prct": 1, "longisland_prct": 1, "hudson_prct": 0 },
      
      "NM" : { "state": "NM", "row": 5, "col": 3, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 1, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 0, "hudson_prct": 0 },
      
      "KS" : { "state": "KS", "row": 5, "col": 5, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 1, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 0, "hudson_prct": 0 },
      
      "AR" : { "state": "AR", "row": 5, "col": 6, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 3, "onondaga_prct": 2, "nyc_prct": 0, "albany_prct": 1, "longisland_prct": 0, "hudson_prct": 0 },
      
      "TN" : { "state": "TN", "row": 5, "col": 7, "nys_prct": 1, "erie_prct": 1, "monroe_prct": 2, "onondaga_prct": 3, "nyc_prct": 1, "albany_prct": 2, "longisland_prct": 3, "hudson_prct": 2 },

      "NC" : { "state": "NC", "row": 5, "col": 8, "nys_prct": 9, "erie_prct": 6, "monroe_prct": 9, "onondaga_prct": 6, "nyc_prct": 10, "albany_prct": 11, "longisland_prct": 10, "hudson_prct": 10 },
      
      "SC" : { "state": "SC", "row": 6, "col": 8, "nys_prct": 11, "erie_prct": 4, "monroe_prct": 7, "onondaga_prct": 9, "nyc_prct": 13, "albany_prct": 6, "longisland_prct": 10, "hudson_prct": 7 },
      
      "OK" : { "state": "OK", "row": 6, "col": 4, "nys_prct": 0, "erie_prct": 1, "monroe_prct": 1, "onondaga_prct": 2, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 2, "hudson_prct": 0 },
      
      "LA" : { "state": "LA", "row": 6, "col": 5, "nys_prct": 1, "erie_prct": 1, "monroe_prct": 0, "onondaga_prct": 1, "nyc_prct": 1, "albany_prct": 0, "longisland_prct": 1, "hudson_prct": 1 },

      "MS" : { "state": "MS", "row": 6, "col": 6, "nys_prct": 0, "erie_prct": 1, "monroe_prct": 0, "onondaga_prct": 1, "nyc_prct": 0, "albany_prct": 1, "longisland_prct": 1, "hudson_prct": 2 },

      "AL" : { "state": "AL", "row": 6, "col": 7, "nys_prct": 3, "erie_prct": 6, "monroe_prct": 7, "onondaga_prct": 4, "nyc_prct": 2, "albany_prct": 4, "longisland_prct": 5, "hudson_prct": 2 },

      "GA" : { "state": "GA", "row": 7, "col": 8, "nys_prct": 13, "erie_prct": 18, "monroe_prct": 20, "onondaga_prct": 25, "nyc_prct": 13, "albany_prct": 6, "longisland_prct": 12, "hudson_prct": 12 },

      "HI" : { "state": "HI", "row": 7, "col": 0, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 0, "nyc_prct": 0, "albany_prct": 0, "longisland_prct": 0.3, "hudson_prct": 0 },

      "AK" : { "state": "AK", "row": 7, "col": 1, "nys_prct": 0, "erie_prct": 0, "monroe_prct": 0, "onondaga_prct": 1, "nyc_prct": 0, "albany_prct": 2, "longisland_prct": 0, "hudson_prct": 0 },

      "TX" : { "state": "TX", "row": 7, "col": 4, "nys_prct": 2, "erie_prct": 3, "monroe_prct": 1, "onondaga_prct": 2, "nyc_prct": 2, "albany_prct": 2, "longisland_prct": 2, "hudson_prct": 2 },

      "FL" : { "state": "FL", "row": 8, "col": 9, "nys_prct": 8, "erie_prct": 6, "monroe_prct": 15, "onondaga_prct": 9, "nyc_prct": 7, "albany_prct": 8, "longisland_prct": 16, "hudson_prct": 13 }
};


// The text below the map is dynamic based on the toggle button that is clicked.
var market_text_block = {
  "albany_prct": {"Name": "Capital Region", "Text": "The Capital Region – which recovered only 160 likely-trafficked in the five years of data – breaks from the pattern of other markets, and includes guns from nearby Vermont (16%) at the top of its source states. 94% of guns that were likely-trafficked to the Capital Region were handguns."},
  "hudson_prct": {"Name": "Lower-Hudson Valley", "Text": "Lower-Hudson Valley gets most of its likely-trafficked guns from Pipeline states. The Lower-Hudson Valley follows a pattern similar to the rest of the State, with Pennsylvania (16%), Florida (13%), Virginia (12%), and Georgia (12%) topping the list of source states. 96% of guns that were likely-trafficked to the Lower-Hudson Valley were handguns."},
  "longisland_prct": {"Name": "Long Island", "Text": "Long Island shows a pattern similar to neighboring New York City for its 396 likely-trafficked guns. However, Florida tops the list of source states, with 16% of recoveries followed by Virginia (13%) and Georgia (12%). 92% of guns that were likely-trafficked to Long Island were handguns." },
  "nyc_prct": {"Name": "New York City", "Text": "New York City has the highest concentration of likely-trafficked guns – 4,216 – from pipeline states. Virginia leads as a source state, with 19% of recoveries, followed by Pennsylvania (13%) and Georgia (13%). Almost all guns were handguns – only 172 were not."},
  "onondaga_prct": {"Name": "Syracuse", "Text": "Syracuse saw 25% of likely-trafficked guns originate in Georgia. The remaining pipeline states contributed an additional 36% of recoveries, and Ohio another 6%. 91% of guns that were likely-trafficked to Syracuse were handguns." },
  "erie_prct": {"Name": "Buffalo", "Text": "The Pipeline reaches as far west in New York as Buffalo-Niagara. Of its 424 likely-trafficked guns, the biggest out-of-state supplier is nearby Ohio with 19%. Following Ohio was Georgia and Pennsylvania, with 18% and 17% respectively. 94% of guns that were likely-trafficked to Buffalo were handguns."},
  "monroe_prct": {"Name": "Rochester", "Text": "Rochester, with 165 likely-trafficked guns and the largest percentage of in-state gun contribution, still gets its likely-trafficked guns from Pipeline states. The same source states top the list – Georgia (20%), Florida (15%), and Pennsylvania (11%). Rochester had the lowest proportion of guns that were handguns, with 87%."},
  "nys_prct": {"Name": "New York State", "Text": "70% of likely-trafficked guns recovered in New York originated in Iron Pipeline states. Approximately 95% of these guns were handguns. Virginia (15%), Georgia (13%), and Pennsylvania (13%) were the top three source states for out-of-state likely-trafficked guns."}
};

/* ----- Creating the color threshold scale for the block fill ----- */
var color_block = d3.scale.threshold()
    .domain([0, 0.93, 3.5, 5.37, 10.97, 25.4]) //Bins were determined using Jenks Breaks
    .range(['#222', '#777', '#999', '#fcae91', '#fb6a4a', '#cb181d']);


/* ---- =========== DRAW THE BLOCKS ====== ----- */
  function drawblocks(market) {
    var stateGroup = svgblock.append("g").attr("transform", "translate(20, 20)");

    var stateIDs_draw = Object.getOwnPropertyNames(stateGrid);

    stateGroups = stateGroup.selectAll("g").data(stateIDs_draw)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" + stateXScale(stateGrid[d].col) + "," + stateYScale(stateGrid[d].row) + ")"; });

    stateRects = stateGroups.append("rect")
        .attr("width", stateWidth).attr("height", stateWidth)
        .style("fill", function(d) { return stateGrid[d].forcolor ? '#222' : color_block(stateGrid[d][market]) } )
        .style('stroke', 'none')
        .style('border', 'none');

    var blocktip = d3.tip()
      .attr('class', 'd3-tip')
      //note: changing the opacity requires going into the d3.tip library itself: js/utils/d3.tip.js. Default is opacity = 1. See line 57
      .html(function(d) {
        return "<span style='font-size:24px; color: #cb181d;'>" + stateGrid[d][market] + "%</span> of " + market_text_block[market]["Name"] + "'s likely-trafficked<br />crime guns come from " + d
      })
    stateGroups.call(blocktip);  

    stateGroups.append("text")
        .style("font-size", "13px")
          //setting to the header font family
        .style("font-family", "Titillium Web, Tahoma, Arial, sans-serif")
        .style("pointer-events", "none")
        .style('fill', function(d) { return stateGrid[d].forcolor ? '#eee' : '#000'}) //"NY" label on NYS block has to be white, not black.
        .attr("x", stateWidth / 3.5) //these are fuzzy measurements, not pixel-perfect, especially because font is not mon-spaced.
        .attr("y", stateWidth / 1.7)
        .text(function (d) { return d; });

    d3.select('#dynamicblockmap')
        .html(market_text_block[market]['Text'])

    stateGroups.selectAll('rect')
        .on('mouseover', blocktip.show)
        .on('mouseout', blocktip.hide);
  };

/*  =============================== TOGGLE BUTTONS BETWEEN MARKET BLOCKS ========================== */

function toggle_block(market) {
  stateGroups.selectAll('text').remove();
  stateGroups.selectAll('rect').remove();

  //redraws the blocks in the new color scale based on the percentages for that particular market.
  drawblocks(market);

  if (market != 'nys_prct') {
    d3.select('#NYS_button').style("background", 'none');
  }
  else {
    d3.select('#NYS_button').style("background", '#aaa')
  }
}

// this makes sure that the "All NY State" button appears to be clicked on load, since that's what's drawn. But that requires the inelegant logic above to un-"click" that button when selecting others. Maybe not worth all the trouble.
function init_NYS_button(callback) {
    d3.select('#NYS_button').style("background", '#aaa');
  };

drawblocks('nys_prct')
init_NYS_button()