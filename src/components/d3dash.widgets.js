
function Widget() {
// Constructor
    self = this;
    this._margin = {
        top: 2,
        right: 5,
        bottom: 2,
        left: 5
    };
    this._width = 25;
    this._height = 25;
    this._canvas;
    this._xScale;
    this._x = 0;
    this._y = 0;
    this._dataset = [];
    this._color = "#DDD";
    this._tooltip;
    this._align = "left";
    this._clipping = true;
    this._strokeWidth = 1;
    this._strokeColor = "magenta";
    this._colorScale = d3.scale.category20();
    this._colorValue = function(d, i) {
        return self._colorScale(i)
    }

}
;

//Public Properties


Widget.prototype._getValue = function(d) {
    return d;
};
Widget.prototype._getData = function(d) {
    return d;
};

Widget.prototype._getPosition = function(d, i) {
    return i;
};

Widget.prototype._onRedraw = function(_canvas) {
    _canvas.remove();
};

//Public Methods


Widget.prototype.width = function(_) {
    if (!arguments.length)
        return this._width;
    this._width = _;
    return this;
};


Widget.prototype.height = function(_) {
    if (!arguments.length)
        return this._height;
    this._height = _;
    return this;
};

Widget.prototype.x = function(_) {
    if (!arguments.length)
        return this._x;
    this._x = _;
    return this;
};

Widget.prototype.y = function(_) {
    if (!arguments.length)
        return this._y;
    this._y = _;
    return this;
};

Widget.prototype.xScale = function(_) {
    if (!arguments.length)
        return this._xScale;
    this._xScale = _;
    return this;
};

Widget.prototype.yScale = function(_) {
    if (!arguments.length)
        return this._yScale;
    this._yScale = _;
    return this;
};


Widget.prototype.color = function(_) {
    if (!arguments.length)
        return this._color;
    this._color = _;
    return this;
};


Widget.prototype.canvas = function(_) {
    if (!arguments.length)
        return this._canvas;
    this._canvas = _;
    return this;
};

Widget.prototype.margin = function(_) {
    if (!arguments.length)
        return this._margin;
    this._margin.top = typeof _.top != 'undefined' ? _.top : this._margin.top;
    this._margin.right = typeof _.right != 'undefined' ? _.right : this._margin.right;
    this._margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : this._margin.bottom;
    this._margin.left = typeof _.left != 'undefined' ? _.left : this._margin.left;
    return this;
};

Widget.prototype.onRedraw = function(_) {
    if (!arguments.length)
        return this._onRedraw;
    this._onRedraw = _;
    return this;
};

Widget.prototype.tooltip = function(_) {
    if (!arguments.length)
        return this._tooltip;
    this._tooltip = _;
    return this;
};

Widget.prototype.dataset = function(_) {
    if (!arguments.length)
        return this._dataset;
    this._dataset = _;
    return this;
}

Widget.prototype.getData = function(_) {
    if (!arguments.length)
        return this._getData;
    this._getData = _;
    return this;
};

Widget.prototype.getValue = function(_) {
    if (!arguments.length)
        return this._getValue;
    this._getValue = _;
    return this;
};

Widget.prototype.getPosition = function(_) {
    if (!arguments.length)
        return this._getPosition;
    this._getPosition = _;
    return this;
};


Widget.prototype.colorValue = function(_) {
    if (!arguments.length)
        return this._colorValue;
    this._colorValue = _;
    return this;
};


Widget.prototype.colorScale = function(_) {
    if (!arguments.length)
        return this._colorScale;
    this._colorScale = _;
    return this;
};

Widget.prototype.toCanvas = function() {
// to be extended in child classes, provides basic init
    if (this._canvas != null)
    {
        this._onRedraw(this._canvas);
    }
    this._canvas = this.parentCanvas.append("g");
};

Widget.prototype.align = function(_) {
    if (!arguments.length)
        return this._align;
    this._align = _;
    return this;
};

Widget.prototype.clipping = function(_) {
    if (!arguments.length)
        return this._clipping;
    this._clipping = _;
    return this;
};

Widget.prototype.strokeWidth = function(_) {
    if (!arguments.length)
        return this._strokeWidth;
    this._strokeWidth = _;
    return this;
};

// backwards compat

Widget.prototype.stroke_width = function(_) {
    if (!arguments.length)
        return this._strokeWidth;
    this._strokeWidth = _;
    return this;
};

Widget.prototype.strokeColor = function(_) {
    if (!arguments.length)
        return this._strokeColor;
    this._strokeColor = _;
    return this;
};



function Canvas() {
    Widget.call(this);
    this._id;
    this._align = "left";
}

Canvas.prototype = new Widget();

Canvas.prototype.constructor = Canvas;

Canvas.prototype.toCanvas = function(parentCanvas) {

    this._id = "clip" + d3dash.uuid();

    if (this._canvas != null)
    {
        this._onRedraw(this._canvas);
    }

    this._canvas = parentCanvas.append("g");


    //If the height was not specified and hasn't been calcuated yet, we need to do it now.
    if (this._height == null)
    {
        this.height();
    }

    topCanvas = parentCanvas.append("g").attr("id", "canvas_" + this._id + "_parent")

    this._canvas = topCanvas.append("g").attr("id", "canvas_" + this._id);

    this._canvas.append("defs").append("clipPath").attr("id", "clip_" + this._id)
            .append("rect")
            .attr("width", this._width)
            .attr("height", this._height)
            .attr("x", 0)
            .attr("y", 0)


    this._canvas.attr("clip-path", "url(#" + "clip_" + this._id + ")")

}

Canvas.prototype.start_x = function() {
    return this._x + this._margin.left;
};

Canvas.prototype.start_y = function() {
    return this._y + this._margin.top;

};


Canvas.prototype.available_height = function() {
    return this._height - this._margin.top - this._margin.bottom;
};

Canvas.prototype.available_width = function() {
    return this._width - this._margin.left - this._margin.right;
};

Canvas.prototype.id = function() {
    return "#canvas_" + this._id;

};

function Tooltip() {
    Widget.call(this);
    this._rendered = false;
    this._visible = false;
    this._content;
}

Tooltip.prototype = new Widget();

Tooltip.prototype.constructor = Tooltip;

Tooltip.prototype.rendered = function(_) {
    if (!arguments.length)
        return this._rendered;
    this._rendered = _;
    return this;
};

Tooltip.prototype.visible = function(_) {
    if (!arguments.length)
        return this._visible;
    this._visible = _;
    return this;
};

Tooltip.prototype.content = function(_) {
    if (!arguments.length)
        return this._content;
    this._content = _;
    return this;
};

Tooltip.prototype.toCanvas = function(parentCanvas) {
    self = this;
    parentCanvas
            .on("click", function(data) {
                if (self._visible)
                {
                    self._canvas.attr("visibility", "hidden")
                    self._visible = false
                }
                else
                {
                    if (self._canvas != null)
                    {
                        self._onRedraw(self._canvas)

                    }
                    self._canvas = d3.select("svg").append("g").attr("class", "tooltip")

                    if (self._content)
                    {
                        self._content.dataset(data)
                        self._content.x(self._margin.left)
                        self._content.y(self._margin.top)
                        self._content.toCanvas(self._canvas.append("g").attr("class", "tooltip_canvas"))





                        container = self._canvas.insert("rect", ":first-child")
                                .attr("x", 0)
                                .attr("y", 0)
                                .attr("width", self._content.width() + self._margin.left + self._margin.right)
                                .attr("height", (self._content.height() || self._content.actual_height()) + self._margin.top + self._margin.bottom)
                                .attr("rx", 10)
                                .attr("ry", 10)
                                .attr("stroke", "#666")
                                .attr("stroke-width", "2")
                                .attr("fill", "#fff")
                    }


                    if ('actual_height' in self._content)
                    {

                        container.attr("height", self._content.actual_height() + self._margin.top + self._margin.bottom)
                    }


                    self._canvas.attr("visibility", null)
                    self._canvas.attr("transform", "translate(" + d3.event.pageX + "," + d3.event.pageY + ")");
                    self._visible = true

                }

            });
};

function Chart() {
    Widget.call(this);
    this._valueDomain;
    this._positionDomain;
    this._spacing = 1;
}

Chart.prototype = new Widget();

Chart.prototype.constructor = Chart;

Chart.prototype.calculate_extent = function(_) {
    self = this;
    if (!arguments.length)
        return d3.extent([, d3.sum(this.getData()(_).map(function(d) {
                return self.getValue()(d)
            }))]);
    return d3.extent([0, d3.sum(this.getData()(_).map(function(d) {
            return self.getValue()(d)
        }))]);
};


Chart.prototype.calculate_position_extent = function(_) {
    if (!arguments.length)
    {
        
        pe = d3.extent(
                this.getData()(this._dataset)
                .map(
                        function(d, i) {
                            return this._getPosition(d, i)
                        }));


        return pe;
    }
    
    self = this; 
    pe = d3.extent(

        self._getData(_).map(function(d, i) {
            
        return self._getPosition(d, i)
    }));

    return pe

};

Chart.prototype.valueDomain = function(_) {
    if (!arguments.length)
        return this._valueDomain;
    this._valueDomain = _;
    return this;
};

Chart.prototype.positionDomain = function(_) {
    if (!arguments.length)
        return this._positionDomain;
    this._positionDomain = _;
    return this;
};

Chart.prototype.spacing = function(_) {
    if (!arguments.length)
        return this._spacing;
    this._spacing = _;
    return this;
};


// LINES



function Line() {
    Widget.call(this);
    this._margin = {top: 0, right: 0, bottom: 0, left: 0};
    this._dataset = "";
    this._height = null;
    this._width = null;
    this._onRedraw = function(canvas) {
    };
}

Line.prototype = new Widget();

Line.prototype.constructor = Line;

// Public Methods

Line.prototype.height = function() {

    if (this._height == null)
    {
        //Set height to a value so it renders and doesn't recall this function
        this._height = 0
        var temp_svg = d3.select("body").append("svg").attr("width", 0)
                .attr("height", 0);

        this.toCanvas(temp_svg);

        this._height = temp_svg.select("path").node().getBBox().height + this._margin.top + this._margin.bottom + this._strokeWidth;
        this._width = temp_svg.select("path").node().getBBox().width + this._margin.left + this._margin.right + this._stroke_width;

        temp_svg.remove();
    }
    return this._height;

};

Line.prototype.width = function() {


    if (this._width == null)
    {
        //Set height to a value so it renders and doesn't recall this function
        this._width = 0
        var temp_svg = d3.select("body").append("svg").attr("width", 0)
                .attr("height", 0);

        this.toCanvas(temp_svg);

        this._height = temp_svg.select("path").node().getBBox().height + this._margin.top + this._margin.bottom + this._strokeWidth;
        this._width = temp_svg.select("path").node().getBBox().width + this._margin.left + this._margin.right + this._strokeWidth;

        temp_svg.remove();
    }
    return this._width;

};



Line.prototype.toCanvas = function(parentCanvas) {
    if (this._canvas != null)
    {
        this._onRedraw(this._canvas);
    }

    this._canvas = parentCanvas.append("g");


    //If the height was not specified and hasn't been calcuated yet, we need to do it now.
    if (this._height == null)
    {
        this.height();
    }

    if (this._width == null)
    {
        this.width();
    }

    this._canvas = parentCanvas.append("g").attr("id", "line")

    self = this;

    var line = d3.svg.line()
            .x(function(d) {
                return self.getData()(d[0]);
            })
            .y(function(d) {
                return self.getData()(d[1]);
            })
            .interpolate("linear");


    var lines = this._canvas
            .append("path")
            .style("stroke-opacity", "1")
            .style("fill-opacity", "0.0")
            .style("stroke", this._color)
            .style("stroke-width", this._strokeWidth)
            .attr('d', line(this.getData()(this._dataset)));

    return this;

};


function SparkLine() {
    Chart.call(this);
    self = this
    this._yScale = d3.scale.linear();
    this._xScale = d3.scale.linear();
    this._lineInterpolation = "basis";
    this._bands = 1;
    this._strokeWidth = 1.5;
    this._valueDomain = false;
    this._colorScale = function(d, i) {
        return "#1f77b4"};
    this._positionDomain = null;
    this._areaColorValue = function(d, i) {
    return self._areaColorScale(i)};
};
    

SparkLine.prototype = new Chart();

SparkLine.prototype.constructor = SparkLine;

//Public Properties

SparkLine.prototype._areaColorScale = function(d, i) {
    return "white"
};
SparkLine.prototype._areaOpacity = function(d, i) {
    return 0.25
};


SparkLine.prototype.calculate_extent = function(_) {
    self = this;
    if (!arguments.length)
        return d3.extent(
                this.getData()(this._dataset)
                .map(
                        function(d) {
                            return self.getValue()(d)
                        }));

    return d3.extent(this.getData()(_).map(function(d) {
        return self.getValue()(d)
    }));
}

SparkLine.prototype.lineInterpolation = function(_) {
    if (!arguments.length)
        return this._lineInterpolation;
    this._lineInterpolation = _;
    return this;
};

SparkLine.prototype.areaColorValue = function(_) {
    if (!arguments.length)
        return this._areaColorValue;
    this._areaColorValue = _;
    return this;
};

SparkLine.prototype.areaColorScale = function(_) {
    if (!arguments.length)
        return this._areaColorScale;
    this._areaColorScale = _;
    return this;
};

SparkLine.prototype.areaOpacity = function(_) {
    if (!arguments.length)
        return this._areaOpacity;
    this._areaOpacity = _;
    return this;
};

SparkLine.prototype.bands = function(_) {
    if (!arguments.length)
        return this._bands;
    this._bands = _;
    return this;
};


SparkLine.prototype.toCanvas = function(parentCanvas) {
    this.parentCanvas = parentCanvas;
    if (this._canvas != null)
    {
        this._onRedraw(this._canvas);
    }

    this._canvas = this.parentCanvas.append("g");

    available_width = this._width - this._margin.left - this._margin.right;
    available_height = this._height - this._margin.top - this._margin.bottom;
    data = this._getData(this._dataset);

    this._yScale = this._yScale.domain(this._valueDomain || d3.extent(data, this.getValue())).range([0, available_height]).clamp(true);

    //this._yScale = this._yScale.domain(d3.extent(data, this.getValue())).range([0, available_height]).clamp(true);


//TODO: The appopriate position domain does not seem to be being applied so the xaxis is way too large (for dates)
//d3.extent(data, this._getPosition) <--- seems to work, but the myPositionDomain is not right when run normally
//may need to see if table is calling getPositionExtend correctly


    if (this._positionDomain == null || this._positionDomain.indexOf(undefined) >= 0)
    {
        myPositionDomain = d3.extent(data, this._getPosition)
    }
    else
    {
        myPositionDomain = this._positionDomain
    }


    this._xScale = this._xScale
            .domain(myPositionDomain)
            .range([this._x + this._margin.left, this._x + this._margin.left + available_width]);

            

    self = this;

    var line = d3.svg.line()
            .x(function(d, i) {
                return self._xScale(self.getPosition()(d, i));
            })
            .y(function(d, i) {
                return (self._y + self._margin.top + available_height - self._yScale(self._getValue(d)));
            })
            .interpolate(self._lineInterpolation);

    var area = d3.svg.area()
            .x(function(d, i) {
                return self._xScale(self.getPosition()(d, i));
            })
            .y0(function(d, i) {
                return self._y + self._margin.top + available_height
            })
            .y1(function(d, i) {
                return self._y + self._margin.top + available_height - self._yScale(self._getValue(d))
            })
            .interpolate(self._lineInterpolation);


    l = line(data)
    

    var lines = this._canvas.append("g")
            .append("path")
            .style("stroke-opacity", "1")
            .style("fill-opacity", "0")
            .style("stroke", function(d, i) {
                return self._colorValue(self._getValue(d), i)
            })
            .style("fill", function(d, i) {
                return self._colorValue(self._getValue(d), i)
            })
            .style("stroke-width", this._strokeWidth)
            .attr('d', l) 

    var area = this._canvas.append("g").attr("class", "line-area")
            .append("path")
            .style("stroke-opacity", "0")
            .style("fill-opacity", this._areaOpacity())
            .style("stroke", function(d, i) {
                return self._areaColorValue(self._getValue(d), i)
            })
            .style("fill", function(d, i) {
                return self._areaColorValue(self._getValue(d), i)
            })
            .style("stroke-width", this._strokeWidth)
            .attr('d', area(data));
    
    return this;

};


// BARS

function BarChart() {
    Chart.call(this);
    this._spacing = 1;
}

BarChart.prototype = new Chart();

BarChart.prototype.constructor = BarChart;


function SparkBar() {
    BarChart.call(this);
    self = this;
    this._colorValue = function(d, i) {
    return self._colorScale(0);
    };
}

SparkBar.prototype = new BarChart();

SparkBar.prototype.constructor = SparkBar;

SparkBar.prototype.calculate_extent = function(_) {
    // replace calculate_extent
    self = this;
    if (!arguments.length)
        return d3.extent(
                this.getData()(this._dataset)
                .map(
                        function(d) {
                            return self.getValue()(d)
                        }));

    return d3.extent(this.getData()(_).map(function(d) {
        return self.getValue()(d)
    }));

};


SparkBar.prototype.toCanvas = function(parentCanvas) {
    if (this._canvas != null)
    {
        this._onRedraw(this._canvas)
    }

    this._canvas = parentCanvas.append("g");

    if (this._tooltip)
    {
        this._tooltip.toCanvas(parentCanvas);
    }


    available_width = this._width - this._margin.left - this._margin.right;
    available_height = this._height - this._margin.top - this._margin.bottom;

    data = this.getData()(this._dataset);

    this._yScale = d3.scale.linear().domain(this._valueDomain || [d3.min([d3.min(data, this.getValue()), 0]), d3.max(data, this.getValue())]).range([0, available_height]).clamp(true);
    this._xScale = d3.scale.linear().domain([0, data.length]).range([this._x + this._margin.left, this._x + this._margin.left + available_width]);

    var max_value = d3.max(data, this.getValue());
    var self = this; // point self to this before this goes out of scope

    var rects = self._canvas.append("g").selectAll("rect")
            .data(data)
            .enter()
            .append("rect");

    rects.attr("fill", function(d, i)
    {
        return self.colorValue()(self.getValue()(d), i);
    });
    rects.attr("x", function(d, i) {
        return self._xScale(i);
    });
    rects.attr("y", function(d) {
        return self._y + self._margin.top + available_height - self._yScale(self.getValue()(d));
    });
    rects.attr("width", (available_width / data.length) - (self._spacing))
    rects.attr("height", function(d) {
        return Math.abs(self._yScale(self.getValue()(d)));
    });
};


function StackedBar() {
    BarChart.call(this);
    self = this;
    //this._colorScale = function(d,i) { return d > 0?"#D7191C":"#1A9641"}
    this._colorValue = function(d, i) {
        return this._colorScale(i)
    }

}

StackedBar.prototype = new BarChart();

StackedBar.prototype.constructor = StackedBar;

StackedBar.prototype.toCanvas = function(parentCanvas) {

    if (this._canvas != null)
    {
        this._onRedraw(this._canvas)
    }

    this._canvas = parentCanvas.append("g");

    available_width = this._width - this._margin.left - this._margin.right;
    available_height = this._height - this._margin.top - this._margin.bottom;

    data = this.getData()(this._dataset);


    if (this._tooltip)
    {
        this._tooltip.toCanvas(parentCanvas);
    }

    this._xScale = d3.scale.linear().domain(this._valueDomain || [0, d3.max(data, this.getValue())]).range([this._x + this._margin.left, this._x + this._margin.left + available_width]).clamp(true);

    var max_value = d3.max(data, this.getValue());

    var self = this; // point self to this before this goes out of scope

    mapped_data = data.map(function(d, i) {
        return [{y: self.getValue()(d), x: i}]
    })

    var stacked_data = d3.layout.stack()
            .offset("zero")
            .values(function(d) {
                return d
            })(mapped_data);





    var rects = self._canvas.append("g").selectAll("rect")
            .data(stacked_data)
            .enter()
            .append("rect");
    var position = 0

    rects.attr("fill", function(d, i)
    {

        return self._colorValue(self.getValue()(d), i);
    })
            .attr("x", function(d) {
                return self._xScale(d[0].y0);
            })
            .attr("y", function(d) {
                return self._y + self._margin.top;
            })
            .attr("width", function(d) {
                return self._xScale(d[0].y) - self._x - self._margin.left;
            })
            .attr("height", available_height);
};



function Label() {
    Widget.call(this);
    // clear inherited dimensions from parent.
    this._height = null;
    this._width = null;
    this._color = "#000";
    this._fontSize = "12";
    this._fontWeight = "normal";
    this._align = "left";
    this._href = null;
    this._position;
    this._getValue = function(d, i) {
        return d
    }
    this._getData = function(d, i) {
        return d
    }

}

Label.prototype = new Widget();

Label.prototype.constructor = Label;


Label.prototype.fontSize = function(_) {
    if (!arguments.length)
        return this._fontSize;
    this._fontSize = _;
    return this;
};

//backwards compat

Label.prototype.font_size = function(_) {
    if (!arguments.length)
        return this._fontSize;
    this._fontSize = _;
    return this;
};


Label.prototype.fontWeight = function(_) {
    if (!arguments.length)
        return this._fontWeight;
    this._fontWeight = _;
    return this;
};

Label.prototype.href = function(_) {
    if (!arguments.length)
        return this._href;
    this._href = _;
    return this;
};

Label.prototype.height = function(_) {
    if (!arguments.length) {
        if (this._height == null)
        {
            //Set height to a value so it renders and doesn't recall this function
            this._height = 0
            var temp_svg = d3.select("body").append("svg").attr("width", 0)
                    .attr("height", 0);

            this.toCanvas(temp_svg);

            this._height = temp_svg.select("text").node().getBBox().height + this._margin.top + this._margin.bottom;

            temp_svg.remove();
        }
        return this._height;
    }
    this._height = _;
    return this;
}

Label.prototype.width = function(_) {
    if (!arguments.length) {
        if (this._width == null)
        {
            //Set height to a value so it renders and doesn't recall this function
            this._width = 0
            var temp_svg = d3.select("body").append("svg").attr("width", 0)
                    .attr("height", 0);

            this.toCanvas(temp_svg);

            this._width = temp_svg.select("text").node().getBBox().width + this._margin.right + this._margin.left;

            temp_svg.remove();
        }
        return this._width;
    }
    this._width = _;
    return this;
};

Label.prototype.position = function(_) {
      if (!arguments.length) return this._position;
      this._position = _;
      return this;
    };


Label.prototype.toCanvas = function(parentCanvas) {
//    this.parentCanvas = parentCanvas;
    if (this._canvas != null)
    {
        this._onRedraw(this._canvas);
    }

    this._canvas = parentCanvas.append("g");


    //If the height was not specified and hasn't been calcuated yet, we need to do it now.
    if (this._height == null)
    {
        this.height();
    }

    if (this._width == null)
    {
        this.width();
    }

    this._canvas = parentCanvas.append("g").attr("id", "text")

    this.available_width = this._width - this._margin.left - this._margin.right;

    this.available_height = this._height - this._margin.top - this._margin.bottom;

    if (this._clipping == true)
    {
        clip_path = "clip" + d3dash.uuid();
        this._canvas.append("defs").append("clipPath").attr("id", clip_path)
                .append("rect")
                .attr("width", this._width)
                .attr("height", this._height)
                .attr("x", this._x)
                .attr("y", this._y)

        this._canvas.attr("clip-path", "url(#" + clip_path + ")")
    }

    var foreground = this._canvas.append("g").attr("id", "text-foreground");


    if (this._href)
    {
        foreground = foreground.append("a").attr("xlink:show", "new").attr("xlink:href", this.href()(this.getValue()(this.getData()(dataset))))
    }


    var text_field = foreground.append("text")
            .attr("x", this._x + this._margin.left)
            .attr("y", this._y + this._margin.top + (this._height - this._margin.top - this._margin.bottom) / 2)
            .attr("font-size", this._fontSize)
            .attr("style", "dominant-baseline: central")
            .attr("fill", this._color)
            .text(this.getValue()(this.getData()(this._dataset), this._position))   //getData()(getValue()(dataset)))

    if (this._align == "center")
    {
        text_field.attr("x", this._x + this._margin.left + this.available_width / 2)
        text_field.attr("text-anchor", "middle")
    }
    else if (this._align == "right")
    {
        text_field.attr("x", this._x + this._width - this._margin.right)
        text_field.attr("text-anchor", "end")
    }
    else
    {
        text_field.attr("x", this._x + this._margin.left)
        text_field.attr("text-anchor", "left")
    }
    if (this._fontWeight == "bold")
    {
        text_field.attr("font-weight", "bold")
    }
    return this;
}


function Image() {
    Widget.call(this);
    this._height = null;
    this._align = "left";
    this._preserveAspectRatio = true;
}

Image.prototype = new Widget();

Image.prototype.constructor = Image;

//Public Methods

Image.prototype.preserveAspectRatio = function(_) {
    if (!arguments.length)
        return this._preserveAspectRatio;
    this._preserveAspectRatio = _;
    return this;
};

Image.prototype.height = function(_) {
    if (!arguments.length) {
        if (this._height == null)
        {
            //Set height to a value so it renders and doesn't recall this function
            this._height = 0
            var temp_svg = d3.select("body").append("svg").attr("width", 0)
                    .attr("height", 0);

            this.toCanvas(temp_svg);

            this._height = temp_svg.select("text").node().getBBox().height + this._margin.top + this._margin.bottom;

            temp_svg.remove();
        }
        return this._height;
    }
    this._height = _;
    return this;
}

Image.prototype.toCanvas = function(parentCanvas) {
    if (this._canvas != null)
    {
        this._onRedraw(this._canvas);
    }


    //If the height was not specified and hasn't been calcuated yet, we need to do it now.
    if (this._height == null)
    {
        this.height();
    }

    this._canvas = parentCanvas.append("g").attr("id", "image")

    available_width = this._width - this._margin.left - this._margin.right;

    available_height = this._height - this._margin.top - this._margin.bottom;

    clip_path = "clip" + d3dash.uuid();
    this._canvas.append("defs").append("clipPath").attr("id", clip_path)
            .append("rect")
            .attr("width", this._width)
            .attr("height", this._height)
            .attr("x", this._x)
            .attr("y", this._y)

    this._canvas.attr("clip-path", "url(#" + clip_path + ")")

    var foreground = this._canvas.append("g").attr("id", "image-foreground");

    foreground.append("image")
            .attr("x", this._x + this._margin.left)
            .attr("y", this._y + this._margin.top)
            .attr("height", available_height)
            .attr("width", available_width)
            .attr("preserveAspectRatio", this._preserveAspectRatio ? "xMidyMid slice" : "none")


            .attr("xlink:href", this.getValue()(this.getData()(this._dataset)))   //getData()(getValue()(dataset)))

}

function WorldMap() {
    Widget.call(Chart);
    self = this;
    this._mapPath = "../lib/world-countries.json";
    this._colorScale = d3.scale.ordinal().range(colorbrewer.Reds[9]).domain([0,10])
    this._colorValue = function(d,i) { 
          if(d) {
            return self._colorScale(d)
          }
          else return self._defaultColor;
        }

    this._getValue = function(d,dataset) {  return dataset[d.properties.name] };
    this._baseHeight = 70;
    this._baseWidth = 100;
    this._backgroundColor = "#888";
    this._defaultColor = "#ddc";
}

WorldMap.prototype = new Chart();

WorldMap.prototype.constructor = WorldMap;

WorldMap.prototype.backgroundColor = function(_) {
      if (!arguments.length) return this._backgroundColor;
      this.backgroundColor = _;
      return this;
    };

WorldMap.prototype.defaultColor = function(_) {
      if (!arguments.length) return this._defaultColor;
      this.defaultColor = _;
      return this;
    };
    
WorldMap.prototype.mapPath = function(_) {
      if (!arguments.length) return this._mapPath;
      this.mapPath = _;
      return this;
    };
    
WorldMap.prototype.calculate_extent = function(_) {
     self = this; 
     if(!arguments.length) return d3.extent([,d3.sum(this.getData()(_).map(function(d) {return self.getValue()(d)}))]);
     return d3.extent([0,d3.sum(this.getData()(_).map(function(d) {return self.getValue()(d)}))]);
    
}
    
WorldMap.prototype.toCanvas = function(parentCanvas) {

        if(this._canvas != null)
        {
          this._onRedraw(this._canvas)
        }

        this._canvas = parentCanvas.append("g").attr("id","world_map");
        available_width = this._width - this._margin.left - this._margin.right;
        available_height = this._height - this._margin.top - this._margin.bottom;

        data = this.getData()(this._dataset);

        scaleValue = d3.min([available_height/this._baseHeight,available_width/this._baseWidth])*100;

      var canvas = this._canvas.append("g")
      clip_path = "clip" + d3dash.uuid();
          canvas.append("defs").append("clipPath").attr("id", clip_path)
            .append("rect")
            .attr("width", this._width)
            .attr("height", this._height)
            .attr("x", this._x)
            .attr("y", this._y)
          

          

      //canvas.attr("clip-path", "url(#"+ clip_path + ")")
      
  
      
      canvas.append("rect")
            .attr("width", this._width)
            .attr("height", this._height)
            .attr("x", this._x)
            .attr("y", this._y)
            .attr("fill", this._backgroundColor)
         
          
  self = this;
  

  d3.json(this._mapPath, function(collection) {
    canvas.selectAll("path")
    
      .data(collection.features)
      .enter().append("path")
      .attr("d", d3.geo.path().projection(
        d3.geo.mercator()
          .translate([(self._baseWidth*scaleValue/100)/2+self._x+self._margin.left,((self._baseHeight*1.4)*scaleValue/100)/2+self._y+self._margin.top])
          .scale([scaleValue])
        )

      )
      
      .attr("fill",function(d,i) { return  self._colorValue(self._getValue(d,self._dataset)) }

    );
  });
  }


function BulletChart() {
    Chart.call(this);
    this._backgroundTiles = 5;
    this._backgroundScale;
    this._backgroundColorScale;
    this._bulletType = "rect";
    this._bulletSize = 5;
    this._goalData;
    this._getGoalValue = null;
    this._goalBandColor = "magenta";
    this._goalBandSize = 4;
}

BulletChart.prototype = new Chart();

BulletChart.prototype.constructor = BulletChart;


BulletChart.prototype._getGoalData = function(gd, d, i) {
    return gd
}

BulletChart.prototype.backgroundTiles = function(_) {
    if (!arguments.length)
        return this._backgroundTiles;
    this._backgroundTiles = _;
    return this;
};

BulletChart.prototype.backgroundScale = function(_) {
    if (!arguments.length)
        return this._backgroundScale;
    this._backgroundScale = _;
    return this;
};

BulletChart.prototype.backgroundColorScale = function(_) {
    if (!arguments.length)
        return this._backgroundColorScale;
    this._backgroundColorScale = _;
    return this;
};

BulletChart.prototype.bulletType = function(_) {
    if (!arguments.length)
        return this._bulletType;
    this._bulletType = _;
    return this;
};

BulletChart.prototype.bulletSize = function(_) {
    if (!arguments.length)
        return this._bulletSize;
    this._bulletSize = _;
    return this;
};

BulletChart.prototype.goalData = function(_) {
    if (!arguments.length)
        return this._goalData;
    this._goalData = _;
    return this;
};

BulletChart.prototype.getGoalValue = function(_) {
    if (!arguments.length)
        return this._getGoalValue;
    this._getGoalValue = _;
    return this;
};

BulletChart.prototype.getGoalData = function(_) {
    if (!arguments.length)
        return this._getGoalData;
    this._getGoalData = _;
    return this;
};

BulletChart.prototype.goalBandColor = function(_) {
    if (!arguments.length)
        return this._goalBandColor;
    this._goalBandColor = _;
    return this;
};

BulletChart.prototype.goalBandSize = function(_) {
    if (!arguments.length)
        return this._goalBandSize;
    this._goalBandSize = _;
    return this;
};

BulletChart.prototype.toCanvas = function(parentCanvas) {
    if (this._canvas != null)
    {
        this._onRedraw(this._canvas);
    }

    this._canvas = parentCanvas.append("g");

    available_width = this._width - this._margin.left - this._margin.right;
    available_height = this._height - this._margin.top - this._margin.bottom;
    data = this.getData()(this._dataset);

    if (this._tooltip) {
        this._tooltip.toCanvas(parentCanvas);
    }

    xScaleAdjustment = 0
    if (this._bulletType == "circle") {
        xScaleAdjustment = this._bulletSize;
    }

    this._backgroundScale = d3.scale.linear().domain([0, this._backgroundTiles]).range([this._x + this._margin.left + xScaleAdjustment, this._x + this._margin.left + available_width - xScaleAdjustment])
    this._backgroundColorScale = this.backgroundColorScale() || d3.scale.linear().domain([0, this._backgroundTiles - 1]).range(["#666", "#CCC"])

    for (var i = 0; i < this._backgroundTiles; i++) {
        this._canvas.append("rect")
                .attr("x", this._backgroundScale(i))
                .attr("y", this._y + this._margin.top)
                .attr("width", available_width / (this._backgroundTiles))
                .attr("height", available_height)
                .attr("fill", this._backgroundColorScale(i))
    }

    //d3.max should probably be d3. sum to do a full width bar (when you have multiple series)
    //This needs to be set outside of here in most cases...

    var data = this.getData()(this._dataset)


    this._xScale = d3.scale.linear().domain(this._valueDomain || [0, 100]).range([this._x + this._margin.left + xScaleAdjustment, this._x + this._margin.left + available_width - xScaleAdjustment]).clamp(true);

    self = this;

    if (this._getGoalValue) {

        var goal = this._canvas.append("g").selectAll("rect")
                .data([this.getGoalValue()(this.getGoalData()(this._goalData), data)])
                .enter()
                .append("rect");

        goal
                .attr("fill", function(d, i) {
                    return self._goalBandColor;
                })
                .attr("x", function(d) {
                    return self._xScale(d) - self._goalBandSize / 2;
                })
                .attr("y", function(d) {
                    return self._y + self._margin.top;
                })
                .attr("height", function(d) {
                    return available_height;
                })
                .attr("width", function(d) {
                    return self._goalBandSize;
                })

    }

    if (this._bulletType == "circle") {

        var circle = this._canvas.append("g").selectAll("circle")
                .data([data])
                .enter()
                .append("circle");


        circle
                .attr("fill", function(d, i) {
                    return self.colorValue()(self.getValue()(d), i);
                })
                .attr("cx", function(d) {
                    return self._xScale(self.getValue()(d));
                })
                .attr("cy", function(d) {
                    return self._y + self._margin.top + available_height / 2;
                })
                .attr("stroke", "black")
                .attr("r", self._bulletSize)
    } else {
        var circle = this._canvas.append("g").selectAll("rect")
                .data([data])
                .enter()
                .append("rect");


        circle
                .attr("fill", function(d, i) {
                    return self.colorValue()(self.getValue()(d), i);
                })
                .attr("x", function(d) {
                    return self._x + self._margin.left + xScaleAdjustment;
                })
                .attr("y", function(d) {
                    return self._y + self._margin.top + available_height / 2 - self._bulletSize / 2;
                })
                .attr("height", function(d) {
                    return self._bulletSize;
                })
                .attr("width", function(d) {
                    return self._xScale(self.getValue()(d)) - (self._x + self._margin.left - xScaleAdjustment);
                })
    }
//    console.log(this);
}

function WinLose() {
    BarChart.call(this);
    self = this;
    this._axisScale;
    this._yScale = d3.scale.quantile();
    this._positionDomain = null;
    this._colorScale = function(d, i) {
        return d > 0 ? "#D7191C" : "#1A9641"
    }
    this._colorValue = function(d, i) {
        return this._colorScale(d, i)
    }
//    this._getValue = function(d,i) { return d }
//    this._getData = function(d) { return d }

}

WinLose.prototype = new BarChart();

WinLose.prototype.constructor = WinLose;

WinLose.prototype.axisScale = function(_) {
    if (!arguments.length)
        return this._axisScale;
    this._axisScale = _;
    this._yScale;
    
    
    return this;

};

WinLose.prototype.toCanvas = function(parentCanvas) {
    if (this._canvas != null)
    {
        this._onRedraw(this._canvas);
    }

    this._canvas = parentCanvas.append("g");

    available_width = this._width - this._margin.left - this._margin.right;
    available_height = this._height - this._margin.top - this._margin.bottom;
    data = this.getData()(this._dataset);

    this._yScale = this._yScale.range([available_height / 2, 0, 0]).domain([-1e-10, 0, 1e-10])


    if (this._tooltip) {
        this._tooltip.toCanvas(parentCanvas);
    }


    if (this._positionDomain == null || this._positionDomain.indexOf(undefined) >= 0)
    {
        //myPositionDomain = [d3.min([d3.min(data,chart.getPosition())]),(1+d3.max(data,chart.getPosition()))]
        myPositionDomain = this.calculate_position_extent();
    }
    else
    {
        myPositionDomain = this._positionDomain;
    }


    this._xScale = this._xScale.domain(myPositionDomain).range([this._x + this._margin.left, this._x + this._margin.left + available_width]).clamp(true);
                

    var max_value = d3.max(data, this.getValue());

    var axis = new Line();

    axis.dataset([[this._x + this._margin.left, this._y + this._margin.top + available_height / 2], [this._x + this._margin.left + available_width, this._y + this._margin.top + available_height / 2]])
            .stroke_width(1)
            .toCanvas(this._canvas);

    positionExtent = myPositionDomain[1] - myPositionDomain[0];

    self = this;




    var rects = this._canvas.append("g").selectAll("rect")
            .data(data)
            .enter()
            .append("rect");

    

    rects
            .attr("fill", function(d, i)
            {
                
                return self._colorValue(self.getValue()(d), i);
            })
            .attr("x", function(d, i) {
                return  self._xScale(self.getPosition()(d, i));
            })
            .attr("y", function(d) {
                return self._y + self._margin.top + self._yScale(self.getValue()(d));
            })
            .attr("width", d3.max([(available_width / (positionExtent)) - (this._spacing), 1]))
            .attr("height", function(d) {
                return self.getValue()(d) == 0 ? 0 : available_height / 2;
            });

//    console.log(this);
}

WinLose.prototype.calculate_extent = function(_) {
    self = this;
    if (!arguments.length)
        return d3.extent(
                this.getData()(this._dataset)
                .map(
                        function(d) {
                            return self.getValue()(d)
                        }));

    return d3.extent(this.getData()(_).map(function(d) {
        return self.getValue()(d)
    }));

};

WinLose.prototype.calculate_position_extent = function(_) {
    self = this;
    if (!arguments.length)
    {
        pe = d3.extent(
                this.getData()(this._dataset)
                .map(
                        function(d, i) {
                            return self.getPosition()(d, i)
                        }));

        //Try Number(pe[1]) + 1
        //pe[1] = pe[1] + 1

        return pe;
    }

    pe = d3.extent(this.getData()(_).map(function(d, i) {
        return self.getPosition()(d, i)
    }));
    //pe[1] = pe[1] + 1
    return pe

};



function Spread() {
    BulletChart.call(this);
    this._xScale = d3.scale.linear();
    this._backgroundTiles = 5;
    this._backgroundScale;
    this._backgroundColorScale;
    this._bulletType = "circle";
    this._bulletSize = 1.5;
    this._goalData;
    this._getGoalValue = null;
    this._goalBandColor = "magenta";
    this._goalBandSize = 4;
    this._extentBandFill = "#FFF";
    this._colorValue = function(d) {
        return self._strokeColor;
    };
    this._extentBandStroke = "magenta";
    this._extentBandStrokeWidth = 1;
    this._extentBandSize = 12;

}

Spread.prototype = new BulletChart();

Spread.prototype.constructor = Spread;

Spread.prototype.calculate_extent = function(_) {
    self = this;
    if (!arguments.length)
        return d3.extent(
                this.getData()(this._dataset)
                .map(
                        function(d) {
                            return self.getValue()(d)
                        }));

    return d3.extent(this.getData()(_).map(function(d) {
        return self.getValue()(d)
    }));

};

//For this chart, this is the same as the calculate_extent function above
Spread.prototype.calculate_position_extent = function(_) {
    self = this;
    if (!arguments.length)
        return d3.extent(
                this.getData()(this._dataset)
                .map(
                        function(d) {
                            return self.getPosition()(d)
                        }));

    return d3.extent(this.getData()(_).map(function(d) {
        return self.getPosition()(d)
    }));
};




Spread.prototype.extentBandFill = function(_) {
    if (!arguments.length)
        return this._extentBandFill;
    this._extentBandFill = _;
    return this;

};

Spread.prototype.extentBandStroke = function(_) {
    if (!arguments.length)
        return this._extentBandStroke;
    this._extentBandStroke = _;
    return this;

};

Spread.prototype.extentBandStrokeWidth = function(_) {
    if (!arguments.length)
        return this._extentBandStrokeWidth;
    this._extentBandStrokeWidth = _;
    return this;

};

Spread.prototype.extentBandSize = function(_) {
    if (!arguments.length)
        return this._extentBandSize;
    this._extentBandSize = _;
    return this;
};

Spread.prototype.toCanvas = function(parentCanvas) {
    if (this._canvas != null)
    {
        this._onRedraw(this._canvas);
    }

    this._canvas = parentCanvas.append("g");

    available_width = this._width - this._margin.left - this._margin.right;
    available_height = this._height - this._margin.top - this._margin.bottom;
    data = this.getData()(this._dataset);

    if (this._tooltip) {
        this._tooltip.toCanvas(parentCanvas);
    }

    xScaleAdjustment = this._bulletSize;

    this._backgroundScale = d3.scale.linear().domain([0, this._backgroundTiles]).range([this._x + this._margin.left + xScaleAdjustment, this._x + this._margin.left + available_width - xScaleAdjustment])
    this._backgroundColorScale = this.backgroundColorScale() || d3.scale.linear().domain([0, this._backgroundTiles - 1]).range(["#666", "#CCC"])

    for (var i = 0; i < this._backgroundTiles; i++) {
        this._canvas.append("rect")
                .attr("x", this._backgroundScale(i))
                .attr("y", this._y + this._margin.top)
                .attr("width", available_width / (this._backgroundTiles))
                .attr("height", available_height)
                .attr("fill", this._backgroundColorScale(i))
    }

    this._xScale = this._xScale.domain(this._valueDomain || [0, 100]).range([this._x + this._margin.left + xScaleAdjustment, this._x + this._margin.left + available_width - xScaleAdjustment]).clamp(true);


    extent = this.calculate_extent();

    extentX = this._xScale(extent[0]);

    extentWidth = this._xScale(extent[1]) - extentX;

    self = this;

    if (!isNaN(extentX) && !isNaN(extentWidth))
    {

        this._canvas.append("g").attr("id", "extent").append("rect")
                .attr()
                .attr("x", extentX)
                .attr("y", this._y + this._margin.top + available_height / 2 - this._extentBandSize / 2)
                .attr("width", extentWidth)
                .attr("height", this._extentBandSize)
                .attr("fill", this._extentBandFill)
                .attr("stroke", this._extentBandStroke)
                .attr("stroke-width", this._extentBandStrokeWidth)
    }

    var circle = this._canvas.append("g").selectAll("circle")
            .data(data)
            .enter()
            .append("circle");


    circle
            .attr("fill", function(d, i)
            {
                return self.colorValue()(self.getValue()(d), i, d);
            })
            .attr("cx", function(d) {
                return self._xScale(self.getValue()(d));
            })
            .attr("cy", function(d) {
                return self._y + self._margin.top + available_height / 2;
            })
            .attr("stroke", this._strokeColor)
            .attr("stroke-width", this._strokeWidth)
            .attr("r", this._bulletSize)

    //console.log(this);
}




function Indicator() {
    Widget.call(this);
    self = this;
    this._margin = {top: 5, right: 5, bottom: 5, left: 5};
    this._colorScale = function(d) {
        return "#888"
    };
    this._colorValue = function(d) {
        return self._colorScale(d)
    };
    this._fillColorScale = null
    this._fillColorValue = null
    this._indicatorHeight = 15;
    this._indicatorWidth = 15;
    this._shape = "rect";
    this._strokeWidth = 0;
}

Indicator.prototype = new Widget();

Indicator.prototype.constructor = Indicator;

Indicator.prototype.shape = function(_) {
    if (!arguments.length)
        return this._shape;
    this._shape = _;
    return this;

};

Indicator.prototype.indicatorWidth = function(_) {
    if (!arguments.length)
        return this._indicatorWidth;
    this._indicatorWidth = _;
    return this;

};

Indicator.prototype.indicatorHeight = function(_) {
    if (!arguments.length)
        return this._indicatorHeight;
    this._indicatorHeight = _;
    return this;

};

Indicator.prototype.fillColorValue = function(_) {
    if (!arguments.length)
        return this._fillColorValue;
    this._fillColorValue = _;
    return this;

};

Indicator.prototype.fillColorScale = function(_) {
    if (!arguments.length)
        return this._fillColorScale;
    this._fillColorScale = _;
    return this;

};



Indicator.prototype.toCanvas = function(parentCanvas) {

    if (this._canvas != null)
    {
        this._onRedraw(this._canvas)
    }

    this._fillColorScale = this._fillColorScale ? this._fillColorScale : this._colorScale
    this._fillColorValue = this._fillColorValue ? this._fillColorValue : this._colorValue


    this._canvas = parentCanvas.append("g").attr("id", "image");

    available_width = this._width - this._margin.left - this._margin.right;
    available_height = this._height - this._margin.top - this._margin.bottom;

    data = this.getData()(this._dataset);

    if (this._tooltip)
    {
        this._tooltip.toCanvas(parentCanvas);
    }

    clip_path = "clip" + d3dash.uuid();
    if (this._clipping)
    {
        this._canvas.append("defs").append("clipPath").attr("id", clip_path)
                .append("rect")
                .attr("width", this._width)
                .attr("height", this._height)
                .attr("x", this._x)
                .attr("y", this._y)


        this._canvas.attr("clip-path", "url(#" + clip_path + ")")
    }
    data = this.getData()(this._dataset)
    value = this.getValue()(data)
    var foreground = this._canvas.append("g").attr("id", "image-foreground");
    if (value)
    {
        if (this._shape == "circle")
        {
            foreground.append("circle")
                    .attr("fill", this.fillColorValue()(value, 0, data))
                    .attr("cx", this._x + this._margin.left + this._indicatorWidth / 2)
                    .attr("cy", this._y + this._margin.top + this._indicatorWidth / 2)
                    .attr("r", (this._indicatorWidth - this._strokeWidth) / 2)
                    .attr("stroke-width", this._strokeWidth)
                    .attr("stroke", this.colorValue()(value, 0, data))

        }
        else
        {
            x = foreground.append("rect")
                    .attr("fill", this.fillColorValue()(value, 0, data))
                    .attr("x", this._x + this._margin.left)
                    .attr("y", this._y + this._margin.top)
                    .attr("width", this._indicatorWidth - this._strokeWidth)
                    .attr("height", this._indicatorHeight - this._strokeWidth)
                    .attr("stroke-width", this._strokeWidth)
                    .attr("stroke", this.colorValue()(value, 0, data))
        }

    }
};

