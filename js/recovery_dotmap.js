/* much thanks to: https://bl.ocks.org/mbostock/4707858 */

/* ==================== GLOBALS ================ */
  //_point and _recoverymap suffixes to variable names are a namespacing overlap protection.

var width_recoverymap = 600,
    height_recoverymap = 400;

var projection_recoverymap = d3.geo.albersUsa()
      .scale(1000)
      .translate([width_recoverymap/2, height_recoverymap/2 ]);

var path_recoverymap = d3.geo.path()
    .projection(projection_recoverymap);

var svg_recoverymap = d3.select('#recoverymap svg')
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 400");
var g_recoverymap = svg_recoverymap.append("g");

//Creating zoom function for button clicks
//Zoom is not triggered by clicks on dots or county shapes
var zoom_point = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed_point);

// text below the map is dynamic based on which "market" is active on the map.
  var para1txt = "90% of all crime guns in New York were recovered from these seven markets. These areas also accounted for 90% or more of all handgun recoveries, low time-to-crime guns, low time-to-crime handguns, and likely-trafficked guns. Of the 47,403 guns recovered from these markets, over three quarters (36,468) were handguns. Of the 27,755 guns with time-to-crime and source state information, 19% (5,218) were low time-to-crime guns and 34% (9,309) were probably purchased to be illegally diverted while 21% (5,793) were likely- trafficked."

  var albtxt = "Capital Region law enforcement recovered 1,872 firearms during the five-year period (4% of all recoveries), making it the smallest of the seven regions. This market has the second highest trafficking index in the State (72) and the fourth largest percentage of trafficked guns. The Capital Region has the fourth largest percentage of out-of-state recoveries, with 67% of firearms originating outside New York. Of Capital Region recoveries, approximately 68% were handguns, with higher percentages of rifles (19%) and shotguns (12%) than the regions to the south. Among low time-to-crime guns, 60% were handguns, 26% were rifles, and 14% were shotguns. Approximately 21% of recoveries (211) with a known date of purchase were low time-to-crime. Zip codes in Albany (12206, 12202), Troy (12180), and East Greenbush (12061) contributed over 45% of total recoveries in the market (846 guns). These four zip codes had a greater percentage of out-of-state guns (75%) than the market average (67%"
  
  var nyctxt = "The five counties of New York City represented nearly half of all of New York’s crime gun recoveries (49%) and low time-to-crime recoveries (49%). New York City leads the rest of the State in the number and proportion of total guns that were handguns, originated out-of-state, and were likely-trafficked. The vast majority (86%) of New York City’s recovered guns were handguns, besting the statewide average of 75% by more than 10%. Likely due to its strict gun laws – the City requires permits for handguns <em>and</em> long guns – New York City leads other markets with 87% of all gun and 92% of handgun recoveries originating out-of-state. With an average trafficking index of 75, about 26% of NYC’s recoveries (4,216 guns) were likely-trafficked. "
  
  var litxt = "Nassau and Suffolk Counties combine to make the third largest crime gun market in the State with 4,844 recoveries or just over 9% of all recoveries. Long Island is the second largest market for handguns (3,881), and has the second largest percentages of handguns (80%), guns originating out-of-state (73%) and likely-trafficked guns (17%). Two zip codes (11550 in Hempstead and 11553 in Uniondale) accounted for almost 15% (672) of the region's recoveries and had a much higher percentage of handguns (91%) and of out-of-state recoveries (85%) than the market average."
  
  var hvtxt = "The six counties comprising the Lower-Hudson Valley together had 2,830 recoveries or 5% of New York State recoveries. For its size, the Lower-Hudson Valley exhibits very similar characteristics to those recovered by law enforcement to the south in New York City. This market has the third largest proportion of recoveries that were handguns (78%) and likely-trafficked guns (16%). Approximately 70% of crime guns in this region originated outside New York State, just below statewide average. At 72, the Lower-Hudson Valley has the third highest average trafficking index of any market in the State. Just three zip codes in this region accounted for 1,113 recoveries, or almost 40% of the region. These zip codes, 10701 in Yonkers (427), 12550 in Newburgh (407) and 12601 in Poughkeepsie (279) each fall along I-87."
  
  var buffalotxt = "As the second largest market for crime guns in New York State, Buffalo and neighboring Niagara Falls (Erie and Niagara Counties) together recovered 5,255 crime guns or 10% of statewide recoveries. Buffalo also has the second highest number of low time-to-crime recoveries (605) and likely-trafficked guns (424). Buffalo recovered 3,076 handguns, making it the third largest market for handguns in the State, with handguns making up 59% of recoveries in the market.  Erie County showed a high per capita recovery rate of 82 guns per 100,000 residents, with Niagara lower at 58 per 100,000. Five zip codes (14215, 14211, 14213, 14207, 14212) accounted for almost 50% of the region's recoveries, or 2,476 guns. These recoveries were located in or around the City of Buffalo and had a slightly higher average out-of-state percentage than the rest of the market."
  
  var syrtxt = 'Law enforcement recovered 2,267 guns in the area around Syracuse (Onondaga County). Nestled just south of I-90 (the New York State Thruway), which runs east to Albany and West to Buffalo, approximately 60% of the region’s guns originated in a state other than New York and 13% of guns with a known source state and purchase date were likely-trafficked. 10% of recoveries in the region were low time-to-crime guns. 65% of recoveries were handguns – lower than the statewide average – with an increase in long-barrel firearms, like rifles (18%) and shotguns (17%). A quarter of the guns in this region were recovered from two zip codes - 13204 and 13205.'
  
  var roctxt = "Rochester-area (Monroe County) law enforcement recovered 4,536 crime guns or 9% of all recoveries in the State. Rochester is unique among the markets with the highest percentage of low time-to-crime guns, the lowest percentage of guns originating out-of-state, and the lowest percentage of handguns compared to the State average. The market leads the State in the percentage of guns (23%) that are low time-to-crime. Only 44% of crime guns originated outside New York State – almost 30 points below the statewide average. And only 54% of Rochester’s crime guns were handguns, with shotguns and rifles making up 25% and 20% of recoveries, respectively. Monroe County had by far the highest per capita recovery rate by county of any market jurisdiction, with approximately 101 recoveries for every 100,000 people. Just one zip code in Rochester (14621) accounted for 22% of recoveries in the region. Two additional zip codes (14611 and 14609) contributed another 21% of recoveries."

// information for the side-bar stats and text below map.
var market_stats = {
  "NYS" : { 'Name': "New York State", 'Total Guns' : '52,915', 'Percent OOS' : '74%', 'Trafficking Index' : '73', 'Handguns' : '39,491', "TEXT": para1txt},
  'NYC': { 'Name' : "New York City", 'Total Guns' : '25,799', 'Percent OOS' : '87%', 'Trafficking Index' : '75', 'Handguns' : '22,119', "TEXT": nyctxt},
  'Long Island': { 'Name' : "Long Island", 'Total Guns' : '4,844', 'Percent OOS' : '73%', 'Trafficking Index' : '70', 'Handguns' : '3,881', "TEXT": litxt},
  'Hudson Valley': { 'Name' : 'Lower Hudson Valley', 'Total Guns' : '2,830', 'Percent OOS' : '70%', 'Trafficking Index' : '72', 'Handguns' : '2,202', "TEXT": hvtxt},
  'Albany': { 'Name' : "Albany", 'Total Guns' : '1,872', 'Percent OOS' : '67%', 'Trafficking Index' : '72', 'Handguns' : '1,267', "TEXT": albtxt},
  'Syracuse': { 'Name' : 'Syracuse', 'Total Guns' : '2,267', 'Percent OOS' : '60%', 'Trafficking Index' : '70', 'Handguns' : '1,465', "TEXT": syrtxt},
  'Rochester': { 'Name' : 'Rochester','Total Guns' : '4,536', 'Percent OOS' : '44%', 'Trafficking Index' : '69', 'Handguns' : '2,458', "TEXT": roctxt},
  'Buffalo': { 'Name': 'Buffalo', 'Total Guns' : '5,255', 'Percent OOS' : '58%', 'Trafficking Index' : '70', 'Handguns' : '3,076', "TEXT": buffalotxt},
}

/* =================== DATA ==================== */

 d3.csv("data/Lacey Data/2. Recoveries for Dot Map-small.csv", function(error, data){
    if (error) throw error;
    d3.json('data/albers_us.json', function(error, us) {
          if (error) throw error;
          var states_point = topojson.feature(us, us.objects.states),
              state_point = states_point.features.filter(function(d) { return d.id === 36; })[0];
              allcounties_point = topojson.feature(us, us.objects.counties),
              nycounties_point = allcounties_point.features.filter(function(d) { return d.id >= 36000 & d.id < 37000 ;});

          projection_recoverymap
              .scale(1)
              .translate([0, 0]);
          //This centers the map on NYS and zooms to a level that wil fill the SVG shape with the bounding box for NYS. GeoJSON for the rest of the country is underlying in the file, but hidden from view.
          var b_point = path_recoverymap.bounds(state_point),
              s_point = .95 / Math.max((b_point[1][0] - b_point[0][0]) / width_recoverymap, (b_point[1][1] - b_point[0][1]) / height_recoverymap),
              t_point = [(width_recoverymap - s_point * (b_point[1][0] + b_point[0][0])) / 2, 
                        (height_recoverymap - s_point * (b_point[1][1] + b_point[0][1])) / 2];
          projection_recoverymap
              .scale(s_point)
              .translate(t_point);

          //Drawing the county shapes
          g_recoverymap.selectAll('path')
              .data(nycounties_point)
            .enter().append("path")
              .attr("d", path_recoverymap)
              .attr('class', 'feature')
              .attr('id', function(d) { return String(d.id) })
              .on("click", clicked_pointmap)
              .style('fill','#000');
          //Drawing the lines between counties.
          g_recoverymap.append('path')
              .datum(topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b & a.id < 37000 & a.id >= 36000; } )) // Captures only NY counties.
              .attr('class', 'mesh') //County border lines
              .attr('d', path_recoverymap);
          //Drawing a dot for each NY zipcode with at least one recovered crime gun. The lat/long for the centroid of each zipcode is in the data file.
          g_recoverymap.selectAll('circle')
              .data(data)
              .enter().append('circle')
              .attr('cx', function(d) {
                return projection_recoverymap([d.lng, d.lat])[0];
              })
              .attr('cy', function(d) {
                return projection_recoverymap([d.lng, d.lat])[1];
              })
              .attr('r', function(d) { //Recovery count bins were calculated using Jenks breaks
                  rad = 0 //Dot radius sizes, however, were done manually to optimize visibility into size differences.
                  if (d.recovery_count > 0 && d.recovery_count < 39) {
                    rad = 1.25
                  }
                  else if (d.recovery_count >= 39 && d.recovery_count < 120) {
                    rad = 3
                  }
                  else if (d.recovery_count >= 120 && d.recovery_count < 252) {
                    rad = 4
                  }
                  else if (d.recovery_count >= 252 && d.recovery_count < 492) {
                    rad = 5
                  }
                  else if (d.recovery_count >= 492) {
                    rad = 8
                  }
                  else {
                    rad = null
                  }
                  return rad
              })
              .style('fill', '#de2d26')
              .style('opacity','1');
    reset_pointmap(); //Draw all parts of map
    });
});

//Re-centering and resetting the zoom extent
function zoomed_point() {
  g_recoverymap.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

//Redraws the base map (all of NYS).
function reset_pointmap() {
  g_recoverymap.selectAll('circle')
      .attr('r', function(d) {
        rad = 0
        if (d.recovery_count > 0 && d.recovery_count < 39) {
          rad = 1.25
        }
        else if (d.recovery_count >= 39 && d.recovery_count < 120) {
          rad = 3
        }
        else if (d.recovery_count >= 120 && d.recovery_count < 252) {
          rad = 4
        }
        else if (d.recovery_count >= 252 && d.recovery_count < 492) {
          rad = 5
        }
        else if (d.recovery_count >= 492) {
          rad = 8
        }
        else {
          rad = null
        }
        return rad
    })
    .style('fill', '#de2d26')

  g_recoverymap.selectAll('.mesh')
      .style('stroke-width', '1.5')
  svg_recoverymap.transition()
      .duration(750)
      .call(zoom_point.translate([0, 0]).scale(1).event);

  toggle_markettext('NYS')
};

//Some work to be done here to merge the functions for the button toggles with the function for the county clicks. 
//This drives the change in the text an the circle fill when a user clicks on a market county
function clicked_pointmap(d) {
  if (d.id == 36061 | d.id == 36047 | d.id == 36081 | d.id == 36085 | d.id == 36005) {
    toggle_markettext('NYC')
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) {
        return d.id == 36061 | d.id == 36047 | d.id == 36081 | d.id == 36085 | d.id == 36005 ? '#de2d26' : '#666'
      })
  }
  else if (d.id == 36103 | d.id == 36059) {
    toggle_markettext('Long Island')
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) { 
        return d.id == 36103 | d.id == 36059 ? '#de2d26' : '#666'
      })
  }
  else if (d.id == 36027 | d.id == 36071 | d.id == 36079 | d.id == 36087 | d.id == 36119 | d.id == 36111) {
    toggle_markettext('Hudson Valley')
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) { 
        return d.id == 36027 | d.id == 36071 | d.id == 36079 | d.id == 36087 | d.id == 36119 | d.id == 36111 ? '#de2d26' : '#666'
      })
  }
  else if (d.id == 36001 | d.id == 36083 | d.id == 36091 | d.id == 36093) {
    toggle_markettext('Albany')
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) { 
        return d.id == 36001 | d.id == 36083 | d.id == 36091 | d.id == 36093 ? '#de2d26' : '#666'
      })
  }
  else if (d.id == 36067) {
    toggle_markettext('Syracuse')
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) { 
        return d.id == 36067 ? '#de2d26' : '#666'
      })
  }
  else if (d.id == 36055) {
    toggle_markettext('Rochester')
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) { 
        return d.id == 36055 ? '#de2d26' : '#666'
      })
  }
  else if (d.id == 36029 | d.id == 36063) {
    toggle_markettext('Buffalo')
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) { 
        return d.id == 36029 | d.id == 36063 ? '#de2d26' : '#666'
      })
  }
  else {
    toggle_markettext('NYS')
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', "#de2d26")
  }
}

//Changes the dynamic content in each content element
function toggle_markettext(marketname) {
  d3.select('#dyntext')
      .html(market_stats[marketname]["TEXT"])
    d3.select('#dyn_total_guns')
      .html(market_stats[marketname]['Total Guns'])
    d3.select('#dyn_prct_oos')
      .html(market_stats[marketname]['Percent OOS'])
    d3.select('#dyn_traffic_ix')
      .html(market_stats[marketname]['Trafficking Index'])
    d3.select('#dyn_handguns')
      .html(market_stats[marketname]['Handguns'])
    d3.select('#dyn_cityname')
      .html(market_stats[marketname]['Name'])

  if (marketname != 'NYS') {
    d3.select('#NYSpointsbutton').style("background", 'none');
  }
  else {
    d3.select('#NYSpointsbutton').style("background", '#aaa')
  }
}

// We want the dots and the county borders to re-draw when the map is zoomed, so that
// the recovery volume in high-density areas are more visible; otherwise the dots completely
// overlap. Redrawing the county lines is purely aesthetic. 
function market_zoom(FIPScode, market_scale) {
  d = g_recoverymap.selectAll('path').data().filter(function(d) { return d.id === FIPScode});

    var bounds_pointt = path_recoverymap.bounds(d[0]),
      dx_pointt = bounds_pointt[1][0] - bounds_pointt[0][0],
      dy_pointt = bounds_pointt[1][1] - bounds_pointt[0][1],
      x_pointt = (bounds_pointt[0][0] + bounds_pointt[1][0]) / 2,
      y_pointt = (bounds_pointt[0][1] + bounds_pointt[1][1]) / 2,
      scale_pointt = market_scale / Math.max(dx_pointt / width_recoverymap, dy_pointt / height_recoverymap),
      translate_pointt = [width_recoverymap / 2 - scale_pointt * x_pointt, height_recoverymap / 2 - scale_pointt * y_pointt];

    g_recoverymap.selectAll('circle')
      .attr('r', function(d) {
          rad = 0
          if (d.recovery_count > 0 && d.recovery_count < 39) {
            rad = 1.25/5
          }
          else if (d.recovery_count >= 39 && d.recovery_count < 120) {
            rad = 3/5
          }
          else if (d.recovery_count >= 120 && d.recovery_count < 252) {
            rad = 4/5
          }
          else if (d.recovery_count >= 252 && d.recovery_count < 492) {
            rad = 5/5
          }
          else if (d.recovery_count >= 492) {
            rad = 8/5
          }
          else {
            rad = null
          }
          return rad
      })
      .attr('stroke-width', '.05px');

    // styling for the lines between counties
    g_recoverymap.selectAll('.mesh')
      .style('stroke-width', '0.5');

    svg_recoverymap.transition()
      .duration(750)
      .call(zoom_point.translate(translate_pointt).scale(scale_pointt).event)
       ;
}

// Functions to trigger map behavior when the toggle buttons above the map are clicked
function toggle_NYCpoint() {    
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) {
        return d.id == 36061 | d.id == 36047 | d.id == 36081 | d.id == 36085 | d.id == 36005 ? '#de2d26' : '#666'
      })
    toggle_markettext('NYC')
    market_zoom(36061, .25)
};

function toggle_LIpoint() {
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) { 
        return d.id == 36103 | d.id == 36059 ? '#de2d26' : '#666'
      })
    toggle_markettext('Long Island')
    market_zoom(36103, .68)
};

function toggle_Hudsonpoint() {
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) { 
        return d.id == 36027 | d.id == 36071 | d.id == 36079 | d.id == 36087 | d.id == 36119 | d.id == 36111 ? '#de2d26' : '#666'
      })
    toggle_markettext('Hudson Valley')
    market_zoom(36079, .21)
};

function toggle_Albanypoint() {
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) { 
        return d.id == 36001 | d.id == 36083 | d.id == 36091 | d.id == 36093 ? '#de2d26' : '#666'
      })
    toggle_markettext('Albany')
    market_zoom(36083, .6)
};

function toggle_Syracusepoint() {
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) { 
        return d.id == 36067 ? '#de2d26' : '#666'
      })
    toggle_markettext('Syracuse')
    market_zoom(36067, .63)
};

function toggle_Rochesterpoint() {
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) { 
        return d.id == 36055 ? '#de2d26' : '#666'
      })
    toggle_markettext('Rochester')
    market_zoom(36055, .5);
};

function toggle_Buffalopoint() {
    var circles = g_recoverymap.selectAll('circle')
      .style('fill', function(d) { 
        return d.id == 36029 | d.id == 36063 ? '#de2d26' : '#666'
      })
    toggle_markettext('Buffalo')
    market_zoom(36029, .63)
};

//Because the map is populated with the NYS information, set the button as pre-clicked
function init_NYS_point_button(callback) {
    d3.select('#NYSpointsbutton').style("background", '#aaa');
  };

svg_recoverymap
  .call(zoom_point)
  .call(zoom_point.event)

init_NYS_point_button();