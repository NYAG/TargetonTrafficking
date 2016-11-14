gschapters = graphScroll()
    .container(d3.select('body'))
    .graph(d3.selectAll('#scroller'))
    .sections(d3.selectAll('.section_selectors'))
    .on('active', function(i) {
      
      var headers = d3.selectAll('.nextpage_top_button')
      var currentheader = headers.filter(function(d, j) { return j == i; });
      var inactiveheader = headers.filter(function (d, j) { return j != i ;});
      
      currentheader.style('color', '#000').style('font-weight', 'bold')
      inactiveheader.style('color', '#fff').style('font-weight', 'normal')
      currentheader.style('background', '#de2d26')
      inactiveheader.style('background', '#333')
    })