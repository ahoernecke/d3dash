function XYChart() {
    Chart.call(this);
    self = this
    this._yScale = d3.scale.linear();
    this._xScale = d3.scale.linear();

    this._getValue = function(d) {return d};
    this._getPosition = function(d,i) {return i};
    this._lineInterpolation = "linear";
    this._bands = 1;
    this._strokeWidth = 1.5;
    this._valueDomain = false;
    this._colorValue = function(d,i) {return this._colorScale(i) } 
    this._colorScale = d3.scale.ordinal().range(colorbrewer.Set1[9]).domain([0,10])
    this._positionDomain = null;
    this._showXAxis = true;
    this._showYAxis = true;
    this._legendValues = null;
    this._title = null;
    this._title_font_size = 16;
    this._xAxisTickFormat=null;
    this._yAxisTickFormat=null;
    this._setupXScale=true
};
    

XYChart.prototype = new Chart();

XYChart.prototype.constructor = XYChart;

//Public Properties

XYChart.prototype._areaColorScale = function(d, i) {
    return "white"
};
XYChart.prototype._areaOpacity = function(d, i) {
    return 0.25
};

XYChart.prototype.calculate_position_extent = function(_) {
    self = this


    return d3.extent(
        d3.merge(
            self._getData(self._dataset)
            .map(
                function(d,i) {return d.map(
                    function(d,i) {return self._getPosition(d,i)}
                    )
                }
            )
        )
    );
}



XYChart.prototype.calculate_extent = function(_) {
    self = this; 
    return d3.extent(
        d3.merge(
            self._getData(self._dataset)
            .map(
                function(d,i) {return d.map(
                    function(d,i) {return self._getValue(d,i)}
                    )
                }
            )
        )
    );


}

XYChart.prototype.lineInterpolation = function(_) {
    if (!arguments.length)
        return this._lineInterpolation;
    this._lineInterpolation = _;
    return this;
};

XYChart.prototype.showXAxis = function(_) {
    if (!arguments.length)
        return this._showXAxis;
    this._showXAxis = _;
    return this;
};

XYChart.prototype.title = function(_) {
    if (!arguments.length)
        return this._title;
    this._title = _;
    return this;
};

XYChart.prototype.title_font_size = function(_) {
    if (!arguments.length)
        return this._title_font_size;
    this._title_font_size = _;
    return this;
};

XYChart.prototype.showYAxis = function(_) {
    if (!arguments.length)
        return this._showYAxis;
    this._showYAxis = _;
    return this;
};

XYChart.prototype.legendValues = function(_) {
    if (!arguments.length)
        return this._legendValues;
    this._legendValues = _;
    return this;
};

XYChart.prototype.yAxisTickFormat = function(_) {
    if (!arguments.length)
        return this._yAxisTickFormat;
    this._yAxisTickFormat = _;
    return this;
};

XYChart.prototype.xAxisTickFormat = function(_) {
    if (!arguments.length)
        return this._xAxisTickFormat;
    this._xAxisTickFormat = _;
    return this;
};

XYChart.prototype.areaColorValue = function(_) {
    if (!arguments.length)
        return this._areaColorValue;
    this._areaColorValue = _;
    return this;
};

XYChart.prototype.areaColorScale = function(_) {
    if (!arguments.length)
        return this._areaColorScale;
    this._areaColorScale = _;
    return this;
};

XYChart.prototype.areaOpacity = function(_) {
    if (!arguments.length)
        return this._areaOpacity;
    this._areaOpacity = _;
    return this;
};

XYChart.prototype.bands = function(_) {
    if (!arguments.length)
        return this._bands;
    this._bands = _;
    return this;
};


XYChart.prototype.toCanvas = function(parentCanvas) {
    self = this;
    this.parentCanvas = parentCanvas;
    if (this._canvas != null)
    {
        this._onRedraw(this._canvas);
    }

    this._canvas = this.parentCanvas.append("g");

    available_width = this._width - this._margin.left - this._margin.right;
    available_height = this._height - this._margin.top - this._margin.bottom;


    
    data = this.getData()(this._dataset);

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


    

    showXAxis = true
    showYAxis = true
    startX=0
    startY=0
    if(this._showYAxis)
    {
        yAxisWidth = 25
        
        
        
        //Adjust to make text fit in box
        this._margin.top+=3
        this._margin.bottom+=3
        
        available_height -= 6
        available_width -= yAxisWidth
        startX += yAxisWidth

    }
    if(this._showXAxis)
    {
        xAxisHeight = 20


        //Adjust to make text fit in box
        this._margin.left+=3
        this._margin.right+=3

        available_width -= 6
        available_height -= xAxisHeight
        startY += xAxisHeight
        
    }

    if(this._title)
    {

        title = new Label().font_size(this._title_font_size).width(this._width-(this._margin.left+this._margin.right)).dataset(this._title)
        this._margin.top += title.height();
        title.x(this._x + this._margin.left)
            .y(this._y )
            .align("center")
            
        title.toCanvas(this._canvas);
        
     
    }

    if(this._legendValues)
    {
        xOffset=0;
        for (j = 0; j < this._legendValues.length; j++)
        {
            
            legend_canvas = this._canvas.append("g", "legend")
            box_size = 12
            
            fill = this._colorValue(0, j);
            
            legend_canvas.append("rect")
                    .attr("x", this._x + startX + this._margin.left + xOffset + 10)
                    .attr("y", this._y +  this._margin.top )
                    .attr("width", box_size)
                    .attr("height", box_size)
                    .attr("fill", fill)
                    .attr("stroke", "#000")
                    .attr("stroke-width", 0)





            temp_txt = new Label().dataset(this._legendValues[j])
                    .x(this._x + startX + this._margin.left + xOffset + box_size + 15)
                    .y(this._y + this._margin.top - box_size/2 + 1)
                    .margin({top: 5, right: 7, bottom: 2, left: 2})
                    .font_size(10)
                    .align("left");

            temp_txt.toCanvas(legend_canvas);


            xOffset += temp_txt.width() + box_size + 8;
            
        }

    }


    this._yScale = this._yScale.domain(this._valueDomain || this.calculate_extent()).range([this._y + this._height - (this._margin.bottom + startY), this._y + this._margin.top ]).clamp(true);    

    if(this._setupXScale)
    {
        this._xScale = this._xScale.domain(this._positionDomain || this.calculate_position_extent() ).range([startX + this._x + this._margin.left, this._x + this._width - (this._margin.right)   ]);
    }
    

    

    

    if(this._showXAxis)
    {

    
        var xAxis = d3.svg.axis()                    
        xAxis.scale(self._xScale)

        xAxis.orient("bottom");

        if(self._xAxisTickFormat)
        {
            xAxis.tickFormat(self._xAxisTickFormat).ticks(24)
        }


        self._canvas.append("g", "xAxis")
                .call(xAxis)
                .attr("class", "axis")
                .attr("transform", "translate(0,"+ (self._y + self._height - self._margin.bottom - startY) + ")");

    }

    if(this._showYAxis)
    {
        var yAxis = d3.svg.axis()
            .scale(self._yScale)
            .orient("left");

        if(self._yAxisTickFormat)
        {
            yAxis.tickFormat(self._yAxisTickFormat)
        }


        yAxis = self._canvas.append("g", "yAxis")
          .call(yAxis)
          .attr("class", "axis")
          .attr("transform", "translate("+(this._x + yAxisWidth+self._margin.left)+",0)")
          //.append("text")
          //.attr("transform", "rotate(-90)")
          //.attr("x", -(self._margin.top+5))
          //.attr("y", self._margin.left)
          //.attr("dy", ".71em")
          //.style("text-anchor", "end")
          //.text("Testing");
      }

    
    return this;

};

function LineChart() {
    XYChart.call(this);
    self = this
    
};
    

LineChart.prototype = new XYChart();

LineChart.prototype.constructor = LineChart;



LineChart.prototype.toCanvas = function(parentCanvas) {
    XYChart.prototype.toCanvas.call(this, parentCanvas);
    


    for (var i = 0; i < data.length; i++)
    {
        

        var line = d3.svg.line()
            .x(function(d, i) {
                return self._xScale(self.getPosition()(d, i));
            })
            .y(function(d, i) {
                return (self._yScale(self._getValue(d)));
            })
            .interpolate(this._lineInterpolation);

        var lines = this._canvas.append("g")
            .append("path")
            .style("stroke-opacity", "1")
            .style("fill-opacity", "0")
            .style("stroke", self._colorValue(self.getValue()(data), i))
            .style("fill", self._colorValue(self.getValue()(data), i))
            .style("stroke-width", this._strokeWidth)
            .attr('d', line(data[i]))



    };


    return this;

};



function ScatterPlot() {
    XYChart.call(this);
    self = this
    this._getSize = function(d) {return 3};
};
    



ScatterPlot.prototype = new XYChart();

ScatterPlot.prototype.constructor = ScatterPlot;

ScatterPlot.prototype.getSize = function(_) {
    if (!arguments.length)
        return this._getSize;
    this._getSize = _;
    return this;
};

ScatterPlot.prototype.toCanvas = function(parentCanvas) {
    XYChart.prototype.toCanvas.call(this, parentCanvas);
    


     for (var i = 0; i < data.length; i++)
    {
        
        self._canvas.append("g", "series")
            .selectAll("circle")
           .data(data[i])
           .enter()
           .append("circle")
            .attr("cx", function(d,i) {
                    return self._xScale(self.getPosition()(d, i));
               })
               .attr("cy", function(d,i) {
                    return (self._yScale(self._getValue(d,i)));
               })
               .attr("r", function(d,i) {
                    return self._getSize(d,i);
               })

                
               .style("fill", function(d,i) {
                    return self._colorValue(d,i);
               })

    };


    return this;

};





function StackedBarChart() {
    XYChart.call(this);
    self = this
    this._barSpacing = .2;
    this._setupXScale=false;
    this._xDomain = null;
};
    
StackedBarChart.prototype = new XYChart();
StackedBarChart.prototype.constructor = StackedBarChart;
StackedBarChart.prototype.barSpacing = function(_) {
    if (!arguments.length)
        return this._barSpacing;
    this._barSpacing = _;
    return this;
};


StackedBarChart.prototype.toCanvas = function(parentCanvas) {
    

    self = this

    mapped_data = self._getData(self._dataset)
            .map(
                function(d,i) {return d.map(
                    function(d,i) {return {x: self._getPosition(d,i), y:self._getValue(d,i)}}
                    )
                }
            )


    stack = d3.layout.stack().offset("zero")
    stacked_data = stack(mapped_data)
    yMaxStacked = d3.max(stacked_data, function(stack) { return d3.max(stack, function(d) { return d.y0 + d.y; }); });
    series_count = d3.max(stacked_data,function(d){return d.length})
    

    
    self._xScale = d3.scale.ordinal().domain(this._xDomain || d3.range(series_count)).rangeBands([3+startX + this._x + this._margin.left, this._x + this._width - (this._margin.right)],this._barSpacing)

    
    XYChart.prototype.toCanvas.call(self, parentCanvas);
    self._yScale.domain([0,yMaxStacked])

    

    var layer = self._canvas.selectAll(".layer")
        .data(stacked_data)
        .enter().append("g")
        .attr("class", "layer")
        .style("fill", function(d,i) { return self._colorValue(d,i); });

    var rect = layer.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
            .attr("x", function(d) { return self._xScale(d.x); })
            .attr("y", self._y + self._height - (self._margin.bottom + startY))
            .attr("width", self._xScale.rangeBand())
            .attr("y", function(d) { return self._yScale(d.y0 + d.y); })
            .attr("height", function(d) { return self._yScale(d.y0) - self._yScale(d.y0 + d.y); });

    return this;

};


StackedBarChart.prototype.xDomain = function(_) {
    if (!arguments.length)
        return this._xDomain;
    this._xDomain = _;
    return this;
};



