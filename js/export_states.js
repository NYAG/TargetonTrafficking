/* much thanks to: https://bl.ocks.org/mbostock/9656675*/

var state_stats = {
  51: { "Name" : "Virginia", "Total Guns": "3,249", "Handguns": "3,123", "Trafficking Index": 79, "Percent Exports": "15%", 'id': 51, 'short': "VA",
      "Text" : "Virginia does not require gun buyers or owners to obtain a permit. The state tracks federal policy for background checks, requiring licensed dealers to submit applicants’ information to a state police agency before finalizing the sale.<sup><a href='#VAlaw1FN'>[36]</a></sup> But private sellers are exempt from conducting a background check of purchasers.<sup><a href='#VAlaw1FN'>[37]</a></sup>"},
  
  13: { "Name" : "Georgia", "Total Guns": '2,822', "Handguns": '2,711', "Trafficking Index": 80, "Percent Exports": "13%", 'id': 13,
      "Text": "Private sellers in Georgia are not required to perform background checks, and licensed gun dealers are subject only to the federal requirements. Purchasers with Georgia-issued concealed permits are not obligated to undergo a background check before purchase.<sup><a href='#GAlawFN'>[44]</a></sup> The state does not require individuals to obtain a permit to purchase or possess a firearm." },
  
  42: { "Name" : "Pennsylvania", "Total Guns": "2,843", "Handguns": "2,424", "Trafficking Index": 78, "Percent Exports": "13%", 'id': 42, 
      "Text": "In the Commonwealth of Pennsylvania , there is no requirement in state law to obtain a permit before purchasing any kind of firearm. While the state requires background checks through the state police for sale of handguns by private sellers, this requirement does not extend to long guns including certain shotguns and rifles.<sup><a href='#PAlawFN'>[35]</a></sup>" },
  
  45: { "Name" : "South Carolina", "Total Guns": '2,208', "Handguns": '2,136', "Trafficking Index": 79, "Percent Exports": "11%", 'id': 45,
      "Text" : "South Carolina has no permitting requirements for the purchase of handguns or long guns. Private sellers in South Carolina are not required to administer background checks, and licensed gun dealers are subject only to the federal requirements.<sup><a href='#SClawFN'>[42]</a></sup> Purchasers with South Carolina-issued concealed carry permits are not obligated to undergo a background check before purchase, though they must at the time they apply for the permit.<sup><a href='#SClawFN2'>[43]</a></sup>" },
  
  37: { "Name" : "North Carolina", "Total Guns": '2,453', "Handguns": '2,230', "Trafficking Index": 79, "Percent Exports": "9%", 'id': 37,
      "Text" : "North Carolina law requires handgun purchasers to first obtain a permit from the sheriff of the county in which the purchaser resides.<sup><a href='#NClawFN'>[38]</a></sup> Sheriffs conducting background checks for issuance of a permit must confirm that it is not a violation of state or federal law for the purchaser to buy the gun,<sup><a href='#NClawFN2'>[39]</a></sup> though they are prohibited by state law from examining applicants’ criminal history more than five years before the date of the application.<sup><a href='#NClawFN3'>[40]</a></sup> Unlicensed private sellers are not required to run a background check through the FBI for long gun sales.<sup><a href='#NClawFN4'>[41]</a></sup>" },
  
  12: { "Name" : "Florida", "Total Guns": '3,209', "Handguns": '3,019', "Trafficking Index": 75, "Percent Exports": "8%", 'id': 12,
      "Text" : "Florida does not require individuals to obtain a permit to purchase or possess a firearm and private sellers are not required to conduct background checks on sale. It is a \"point of contact\" state, meaning that federally licensed dealers must contact state law enforcement to conduct federally-mandated background checks on sale. Though purchasers who have a state carry license are exempt from state background checks on purchase, they are not exempt from a required background check by the FBI.<sup><a href='#FLlawFN'>[45]</a></sup>" },
  
  39: { "Name" : "Ohio", "Total Guns": '1,577', "Handguns": '1,442', "Trafficking Index": 77, "Percent Exports": "5%", 'id': 39,
      "Text": "Ohio has no background check provisions beyond that required by federal law. State law contains no permit requirements for handguns or long guns. Purchasers who have obtained a state concealed carry license are exempt from undergoing a background check as a matter of federal law, but are nevertheless subject to a federal NICS background check by their local sheriff as part of the concealed carry application process.<sup><a href='#OHlawFN'>[46]</a></sup>" },
  
  "US": { "Name" : "New York Pipeline", "Total Guns": '18,361', "Handguns": '17,085', "Trafficking Index": 78, 'Percent Exports': '76%', 'id': 0, 
      "Text": "New York's Pipeline, which includes Ohio, supplies a steady stream of guns to New York State. Nearly 35% of all guns and over 43% of all handguns originated in these seven states. In every state's own right, they score poorly on gun safety laws, especially those necessary to prevent illegal diversion. With easy access to New York via I-95 and I-90, gun traffickers tend to obtain guns that begin in these states. As noted, Ohio shares characteristics with the traditional Iron Pipeline states in that it has weak guns safety laws and has easy access to New York via interstate highway. For this reason and since it contributes 3% of all guns and 4% of handguns, we include it in the New York Pipeline."}
}

// GLOBALS //
  //_export_states suffix on variable names is to prevent namespace overlap

var width_export_states = 600,
    height_export_states = 400,
    active = d3.select(null);

var projection_export_states = d3.geo.albersUsa()
    .scale(800)
    .translate([width_export_states / 2, height_export_states / 2]);

var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var path_export_states = d3.geo.path()
    .projection(projection_export_states);

var svg_export_states = d3.select("#export_states svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 400")
    .on("click", stopped, true);

var g_export_states = svg_export_states.append("g");

d3.json("data/albers_us.json", function(error, us) {
    if (error) throw error;

    g_export_states.selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
        .attr("d", path_export_states)
        .attr("class", "export_states_feature")
        .on("click", clicked)
        .style('fill', function(d) {
            if (d.id == 51 | d.id == 13 | d.id == 42 | d.id == 45 | d.id == 37 | d.id == 12 | d.id == 39) {
              return '#de2d26'
            }
            else {
              return '#333' 
            }
        });

    g_export_states.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "export_states_mesh")
        .attr("d", path_export_states);

    reset_export_states(); //initializing default map (full US)
});


//zoomy behaviour and dynamic text/sidebar content based on clicking on a state shape in SVG
function clicked(d) {
    if (active.node() === this) return reset_export_states();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path_export_states.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width_export_states, dy / height_export_states))),
        translate = [width_export_states / 2 - scale * x, height_export_states / 2 - scale * y];

    svg_export_states.transition()
        .duration(750)
        .call(zoom.translate(translate).scale(scale).event);

    if (d.id == 51 | d.id == 13 | d.id == 42 | d.id == 45 | d.id == 37 | d.id == 12 | d.id == 39) {
      toggle_state_text(d.id)
      svg_export_states.selectAll('path').style('opacity', function(e) { return e.id==d.id ? '1': '0.45' })
    }
    else {
      toggle_state_text('US')
      svg_export_states.selectAll('path').style('opacity', '1')
    }
}

//go back to full US zoom extent
function reset_export_states() {
  active.classed("active", false);
  active = d3.select(null);

  toggle_state_text("US");
  svg_export_states.transition()
      .duration(750)
      .call(zoom.translate([0, 0]).scale(1).event);
  svg_export_states.selectAll('path')
      .style('opacity', '1')
}

function zoomed() {
  g_export_states.style("stroke-width", 1.5 / d3.event.scale + "px");
  g_export_states.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

// separate state toggle function for when a button above the map is clicked, because of the difficulty in consolidating a click on the geojson object and a non-shape input. There's DRY-ing up potential here.
function toggle_state(state) {
  fipsid = state_stats[state]['id']
  state_obj = g_export_states.selectAll('path').data().filter(function(d) { return d.id === fipsid; })[0]

  var bounds = path_export_states.bounds(state_obj),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width_export_states, dy / height_export_states))),
      translate = [width_export_states / 2 - scale * x, height_export_states / 2 - scale * y];

  svg_export_states.transition()
      .duration(750)
      .call(zoom.translate(translate).scale(scale).event);
  toggle_state_text(state)

  svg_export_states.selectAll('path').style('opacity', function(e) { return e.id== state_obj.id ? '1': '0.45' })

  if (state != 'US') {
    d3.select('#US_button').style("background", 'none');
  }
  else {
    d3.select('#US_button').style("background", '#aaa')
  }
}

function toggle_state_text(state) {
    d3.select('#export_states_name')
      .html(state_stats[state]['Name'])
    d3.select('#export_states_prctguns')
      .html(state_stats[state]['Percent Exports'])
    d3.select('#export_states_numguns')
      .html(state_stats[state]['Total Guns'])
    d3.select('#export_states_numhandguns')
      .html(state_stats[state]['Handguns'])
    d3.select('#export_states_ix')
      .html(state_stats[state]['Trafficking Index'])
    d3.select('#export_states_dyntext')
      .html(state_stats[state]['Text'])
}

function init_US_button(callback) {
    d3.select('#US_button').style("background", '#aaa');
  };

svg_export_states
  .call(zoom)
  .call(zoom.event)

init_US_button();
