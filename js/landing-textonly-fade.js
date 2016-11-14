/* ============= much thanks to: https://bl.ocks.org/mbostock/d8b1e0a25467e6034bb9, 
adjusted to use svg rather than canvas ================ */

/* ============================ SETUP ====================== */

var fade_time = 1300;

var introTimeout;

function stopTransitions() {
  clearTimeout(introTimeout);
};

var intro1_text = '<span style="opacity: 0;">In the United States, virtually all firearms <span style="color: #de2d26">begin as legal weapons</span>, but when they are diverted to criminal use and recovered by law enforcement, they <span style="color: #de2d26">become crime guns</span>.</span>'
    //2
    what_we_learned_text = '<span style="opacity: 0;">Here\'s what we discovered about these dangerous firearms in New York.</span>',
    //3
    intro5_text = '<span style="opacity: 0;">New York law enforcement recovered <span style="color: #de2d26">52,915 crime guns</span> between 2010-2015.</span>',
    //4
    market_text_dot = '<span style="opacity: 0;">About <span style="color: #de2d26">90%</span> of these guns were recovered in <span style="color: #de2d26">seven markets</span>:<br /><br />New York City, Long Island, Lower Hudson Valley, Capital Region, Syracuse, Rochester and Buffalo.</span>',
    //5
    handguns_text_dot = '<span style="opacity: 0;">About <span style="color: #de2d26">75%</span> of all recovered guns were <span style="color: #de2d26">handguns</span>, the weapon of choice for violent criminals.</span>',
    //6
    oos_text_dot = '<span style="opacity: 0;">Only <span style="color: #de2d26">14%</span> of handguns originated <span style="color: #de2d26">in New York</span>.<br /><br/>But an alarming <span style="color: #de2d26">86%</span> of handguns were originally purchased <span style="color: #de2d26">out-of-state</span> and brought to New York before being used in a crime.</span>',
    //7
    ironpipeline_text_dot = '<span style="opacity: 0;">Most of these guns began in just six states with <span style="color: #de2d26">weak gun laws</span> – the states along I-95 that make up the Iron Pipeline.</span>',
    //8
    traffic_text = '<span style="opacity: 0;">Iron Pipeline states were responsible for <span style="color: #de2d26">70%</span> of the handguns that we identified as <span style="color: #de2d26">recently trafficked</span> into New York.</span>',
    //9
    critics_text = '<span style="opacity: 0;">Critics of gun regulations often say that criminals don’t obey the law, so why bother?</span>'
    //10
    bgchecks_text = '<span style="opacity: 0;">The data refutes that argument. It shows that <span style="color: #de2d26">New York\'s laws</span> requiring universal background checks and permits for handguns <span style="color: #de2d26">are working</span> to keep criminals from purchasing these weapons within the State.</span>',
    //11
    federallaw_text = '<span style="opacity: 0;">But with ready access to guns in <span style="color: #de2d26">states without requirements</span> for handgun licenses or background checks on private sales, gun <span style="color: #de2d26">traffickers easily purchase and import guns</span> into New York. As a result, more than one in two recoveries is an out-of-state handgun.</span>',

    //12
    motivation_text = '<span style="opacity: 0;"><span style="color: #de2d26">Armed with data</span> on crime guns, law enforcement can identify the most dangerous guns on our streets and better determine the laws and strategies needed to <span style="color: #de2d26">combat gun violence</span>.</span>';

/* =================== SECTION FUNCTIONS =================== */

function text_transition(text) {
  d3.selectAll("#target_row h1")
    .remove()
  d3.select('#target_row')
      .append("h1")
        .style('color', '#000')
        .style('margin-top', '10%')
        .attr('class', 'mobile-title-scale')
        .html(text)
    d3.selectAll('#target_row span')
      .transition()
          .duration(fade_time)
          .style('opacity', '1')
};

function intro_1() {
  d3.selectAll("#target_row h1")
      .style('opacity', '0')
    .remove()

  d3.select('#target_row img')
      .style('opacity', '0')
      .attr('width', '0%')

  setTimeout(function(){
    d3.selectAll("#target_row h1")
      .remove()
    d3.select('#target_row')
      .append("h1")
        .style('margin-top', '10%')
        .style('color', '#000')
        .attr('class', 'mobile-title-scale')
        .html(intro1_text)
    d3.selectAll('#target_row span')
      .style('opacity', '1')
  }, 500)
};

function start_over() {
  if (currentSlide == 12) {
    d3.selectAll('#target span')
        .style('opacity', '0')
    d3.selectAll('#target h1')
        .style('font-size', '0px')
        .style('padding', '0px')
        .style('margin', '0px');
    setTimeout(function() {
      d3.select('#target_row img')
        .attr('width', '100%')
      .transition()
        .duration(750)
        .style('opacity', '1');

      d3.select('#target_row')
        .append('h1')
        .html('Click anywhere to advance')
        .attr('id', 'click-anywhere')
        .style('opacity', '0')
      .transition()
        .duration(750)
        .style('opacity', '1');

      currentSlide = null;
    }, 500)
  }
  else {
    d3.select('#target_row h1')
        .style('opacity', '0')
      .remove()
    
    setTimeout(function() {
      d3.select('#target_row img')
        .attr('width', '100%')
      .transition()
        .duration(750)
        .style('opacity', '1');
      currentSlide = null;

      d3.select('#target_row')
        .append('h1')
        .html('Click anywhere to advance')
        .attr('id', 'click-anywhere')
        .style('opacity', '0')
      .transition()
        .duration(750)
        .style('opacity', '1');

    }, 250) //it's the strangest thing: there has to be some delay before setting the current slide, or else it won't reset!
  };
  currentSlide = null;
};

// button 2 -- intro text 5
function all_guns() {
    text_transition(intro5_text);
};

function what_we_learned() {
  text_transition(what_we_learned_text);
};

// button 3 -- moving target
function market_guns_dot() {
  text_transition(market_text_dot);
};

// button 4 -- moving target 2
function handguns_dot() {
    text_transition(handguns_text_dot);
};

//button 5 -- moving target 3
function oos_guns_dot() {
  text_transition(oos_text_dot);
};

//button 6 -- moving target 4
function ironpipeline() {
  text_transition(ironpipeline_text_dot);
};

//button 7 -- moving target 5
function traffickedonly() {
  text_transition(traffic_text);
};

function critics() {
  text_transition(critics_text)
}

function bgchecks() {
  text_transition(bgchecks_text);
};

function federallaw() {
  text_transition(federallaw_text);
}

function motivation() {
  text_transition(motivation_text);
};

function motivation_back() {
  d3.selectAll('#target span')
    .transition()
      .duration(fade_time)
      .style('opacity', '0')
  d3.selectAll('#target h1')
    .transition()
      .delay(fade_time)
      .style('font-size', '0px')
      .style('padding', '0px')
      .style('margin', '0px');
  setTimeout(function() {
    text_transition(motivation_text);
  }, fade_time*2)
}

function readmore() {
  d3.selectAll("#target_row h1")
      .transition()
        .duration(fade_time)
        .style('opacity', '0')
        .remove()

  setTimeout(function() {
    d3.selectAll('#target h1')
      .style('font-size', '40px')
      .style('padding-top', '50px')
      .style('padding-bottom', '10px')
      .style('margin-bottom', '20px');

    d3.select('#startreport')
        .style('text-align', 'center')
      .transition()
        .duration(fade_time)
        .style('opacity', '1')

    d3.select('#or')
        .style('text-align', 'center')
        .style('color', '#333')
      .transition()
        .delay(fade_time)
      .transition()
        .duration(fade_time)
        .style('opacity', '1')

    d3.select('#seedata')
        .style('text-align', 'center')
      .transition()
        .delay(fade_time*2)
      .transition()
        .duration(fade_time)
        .style('opacity', '1')
  }, fade_time)
}

//Transition slide show next/prev
  'use strict';

  // List of all the transitions in order they need to appear
  var transitionArray = [
    intro_1,
    what_we_learned,
    all_guns,
    market_guns_dot,
    handguns_dot,
    oos_guns_dot,
    ironpipeline,
    traffickedonly,
    critics,
    bgchecks,
    federallaw,
    motivation,
    readmore
  ];

  var motivation_back;

  // always start the page at Slide null (Unless you start it at slide 0 automatically again...)
  var currentSlide = null;

  // So whenever someone clicks a number higher than one, it loads one first, and then loads the actual slide you clicked after 1500ms
  // Then sets currentSlide equal to the value of the button you clicked -1. becuase arrays are 0-based.
  $('.introtoggles[onclick]').each(function(){
    $(this).data('onclick', this.onclick);

    this.onclick = function(event) {
      var $this = $(this);

      // Override the onclick="" function in case you haven't started currentSlide === null and you clicked on anything other than #1
      if((currentSlide === null) && ($this.val() !== "1")) {
        // Start the first slide, to load the dots
        transitionArray[0]();
        stopTransitions();

        // set current Slide to 0;
        currentSlide = 0;

        // Trigger a re-click of the non #1, non next/prev option you clicked, to load that data.
        setTimeout(function(){$this.trigger('click');},1500);
      }
      // User already clicked next, or #1, so let's continue with the regularly scheduled program
      else {
        $this.data('onclick').call(this, event || window.event);

        // set currentSlide so that next/prev still works. -1 again becuase Arrays are 0-based
        currentSlide = $this.val() - 1;
      }

      // Set the disabled attribute of the prev/next buttons depending on whether you are at the beginning, end, or middle
      if ($this.val() === "12") {
        $('.next-slide').attr('disabled', 'disabled');
        $('.prev-slide').removeAttr('disabled');
      }
      else if ($this.val() === "1") {
        $('.next-slide').removeAttr('disabled');
        $('.prev-slide').attr('disabled', 'disabled');
      }
      else {
        $('.next-slide').removeAttr('disabled');
        $('.prev-slide').removeAttr('disabled');
      }
    };
  });

  // When you click the previous slide element, go back one unless you haven't started yet.
  $('body').on('click', '.prev-slide', function(e){
    // Only run this if you have already clicked Next once.
    if (currentSlide !== null) {
      // decrement the currentSlide and then run checks on it
      currentSlide--;

      // We are at the beginning or earlier
      if (currentSlide <= 0) {
        // set it to 0 as failsafe
        currentSlide = 0;

        // disable the prev button, we're at the beginning
        $('.prev-slide').attr('disabled', 'hidden');
      }

      // Always run the slide when we click prev, as we dont want to
      transitionArray[currentSlide](0,0);
      stopTransitions();

      // We clicked Prev, so make sure next is clickable
      $('.next-slide').removeAttr('disabled');
    }
    // You didn't click anything, so Prev should not do anything, prevent the default.
    else {
      e.preventDefault();
    };

    if (currentSlide == 12 ) {
        transitionArray[11] = motivation_back
      }
    else {
        transitionArray[11] = motivation
      }
  });

  // When you click the Next Slide Button
  $('body').on('click', '.next-slide', function(e){
    // If nothing has happened yet, first page load
    if (currentSlide === null) {
      // Set to 0, also a non null value
      currentSlide = 0;

      // Transition to the first slide "0"
      transitionArray[currentSlide](0,0);
    }
    // We're in a non first action
    else {
      // Increment the slide counter to run a check later
      currentSlide++;

      // We always show the prev button when we click next, and not on the first slide
      $('.prev-slide').removeAttr('disabled');

      // We're at the last slide, disable clicking next again
      if (currentSlide === transitionArray.length -1) {
        $('.next-slide').attr('disabled', 'disabled');
      }

      // Catch in case we increment too high
      if (currentSlide > transitionArray.length - 1) {
        // stop the action
        e.preventDefault();
        // reset current slide to max array length
        currentSlide = transitionArray.length - 1;
      }
      // We're not too high, and not the first time
      else {
        // Transition to the slide we have incremented to
        transitionArray[currentSlide](0,0);
        stopTransitions();
      }
    };
    if (currentSlide == 12 ) {
        transitionArray[11] = motivation_back
      }
    else {
        transitionArray[11] = motivation
      }
  });

//CLICK ANYWHERE FUNCTIONALITY -- clone of click next/prev with some changes
  $('body').on('click', '#target_container', function(e){
    // If nothing has happened yet, first page load
    if (currentSlide === null) {
      // Set to 0, also a non null value
      currentSlide = 0;

      // Transition to the first slide "0"
      transitionArray[currentSlide](0,0);
    }
    // We're in a non first action
    else {
      // Increment the slide counter to run a check later
      currentSlide++;

      // We always show the prev button when we click next, and not on the first slide
      $('.prev-slide').removeAttr('disabled');

      // We're at the last slide, disable clicking next again
      if (currentSlide === transitionArray.length -1) {
        $('.next-slide').attr('disabled', 'disabled');
      }

      // Catch in case we increment too high
      if (currentSlide > transitionArray.length - 1) {
        // stop the action
        e.preventDefault();
        // reset current slide to max array length
        currentSlide = transitionArray.length - 1;
      }
      // We're not too high, and not the first time
      else {
        // Transition to the slide we have incremented to
        transitionArray[currentSlide](0,0);
        stopTransitions();
      }
    };

    if (currentSlide == 12 ) {
        transitionArray[11] = motivation_back
      }
    else {
        transitionArray[11] = motivation
      }
  });
//END CLICK ANYWHERE


