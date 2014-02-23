var d3dash = window.d3dash || {};
  window.d3dash = d3dash;

  //***Start setup.js

  d3dash.models = {};

  d3dash.uuid = function()
  {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }


  d3dash.dashboard = function(selection) {
    var width = 1280
      , height = 1024
      , margin = {top: 2, right: 0, bottom: 2, left: 0}
      , components = []
      , placed_components = []
      , canvas
      , x=0
      , y=0 ;


  var current_x 
    , current_y
    , next_y
    , available_width 
    , available_height;

    function dashboard() {

        if(canvas == null)
        {
          canvas = d3.select(selection)
          .append("svg")
          .attr("height", height)
          .attr("width", width );
        }

        for (var i=0; i<components.length; i++)
        { 
            if (components[i].toCanvas) {
            components[i].toCanvas(canvas);
        } else components[i](canvas);
        }

        for (var i=0; i<placed_components.length; i++)
        { 

          c = placed_components[i]

          c.x(null)
          c.y(null)

          //Figure out position

          if(current_x == null)
          {
            calculate_space();
          }
      
          //IF we haven't set the width, set it to the full width of the table
          //Otherwise, could have it calculate width here...

          //Assume width can be determined ahead of time...
          //Figure out x/y here
          //Render the chart
          //Then figure out height and update 

          if(c.width() == null)
          {

            c.width(width - margin.left - margin.right);
          }

          if(c.width() <= available_width)
          {
            c.x(current_x);
            c.y(current_y);

            available_width -= c.width();
            current_x += c.width();
            
            
          }
          else
          {
            c.x(margin.left);
            c.y(next_y);
            current_y = next_y;
            current_x = margin.left + c.width();
            next_y = -1
            available_width = width - margin.left - margin.right - c.width();
            

          }


          if (c.toCanvas){
          c.toCanvas(canvas);}
          else c(canvas);

          c_height = c.height() || c.actual_height()

          if(next_y == -1)
          {
            next_y = current_y + c_height;
            available_height = height - margin.top -margin.bottom - current_y
          }
          else if(current_y + c_height > next_y)
          {
            next_y = current_y + c_height
          }


          
        }
        current_x = null
        return dashboard;
    }
      

    // Private Methods

    var calculate_space = function()
    {
        current_x = margin.left;
        current_y =margin.top;
        next_y = margin.top;
        available_width = width - margin.left - margin.right;
        available_height = height - margin.top - margin.bottom;
    }
    



    // Expose Public Variables
    dashboard.margin = function(_) {
      if (!arguments.length) return margin;
      margin.top    = typeof _.top    != 'undefined' ? _.top    : margin.top;
      margin.right  = typeof _.right  != 'undefined' ? _.right  : margin.right;
      margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
      margin.left   = typeof _.left   != 'undefined' ? _.left   : margin.left;
      return dashboard;
    };



    dashboard.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return dashboard;
    };

    dashboard.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return dashboard;
    };

    dashboard.place_component = function(component) {


      component.x(null)
      component.y(null)

      placed_components.push(component)
      return dashboard
    };

    dashboard.add_component = function(component) {
      components.push(component)
      return dashboard
    };

    /* Public methods for dashboard building */


    dashboard.canvas = function() {
      if (!arguments.length){
        if(canvas == null)
        {
          canvas = d3.select(selection)
          .append("svg")
          .attr("height", height )
          .attr("width", width );
        }
        return canvas;
      }

    };



    return dashboard;
  };
