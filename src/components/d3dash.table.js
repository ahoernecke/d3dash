d3dash.models.table = function() {


    var width
            , height
            , margin = {top: 0, right: 0, bottom: 0, left: 0}
            , actual_height
            , parent
            , getData = function(d) {
                return d
            }
            , getValue = function(d, i) {
                return d
            }
            , top_line
            , bottom_line
            , rows = []
            , row_line
            , column_line = new Line()
            , column_lines = true
            , header_lines = true
            , column_lines_x
            , row_line_every = 1
            , row_shading_colors
            , current_x_transform = 0
            , current_y_transform = 0
            , contents_height = 0
            , contents_start_y = 0
            , color = "#000"
            , x = 0
            , y = 0
            , dataset = []
            , current_sort
            , current_sort_direction = 0
            , table_data
            , canvas
            , table_contents
            , columns = []
            , onRedraw = function(canvas) {
                canvas.remove()
            }
            , column_settings = []
            , scroll_interval
            , sort_function = function(column_i) {

                return getData(dataset).sort(
                        function(a, b) {
                            if (column_settings[column_i].sort_function == "string")
                            {
                                return (columns[column_i].getValue()(columns[column_i].getData()(a)).localeCompare(columns[column_i].getValue()(columns[column_i].getData()(b))))
                            }
                            else if (column_settings[column_i].sort_function != null)
                            {
                                return column_settings[column_i].sort_function(
                                        (columns[column_i].getData()(a)),
                                        (columns[column_i].getData()(b))
                                        )
                            }
                            else
                            {
                                return columns[column_i].getValue()(columns[column_i].getData()(b)) - columns[column_i].getValue()(columns[column_i].getData()(a))
                            }
                        }


                )


            }



            , show_axises = false
            , axises_line
            , show_legends = true
            , legends_line
            , legends_height = 20
            , show_header = true
            , header_text_color = "#000"
            , header_font_size = 14
            , header_line
            , header_height = 25
            , axis_height = 20
            ;

    function table(parent_canvas) {
        table_data = table_data || table.getData()(dataset)

        actual_height = 0
        if (canvas != null)
        {
            onRedraw(canvas);
        }

        if (canvas)
        {
            canvas.remove();
        }

        if (parent_canvas == null)
        {
            canvas = parent.append("g").attr("id", "table");
        }
        else
        {
            parent = parent_canvas
            canvas = parent_canvas.append("g").attr("id", "table");
        }
        available_width = width - margin.left - margin.right;
        available_height = height - margin.top - margin.bottom;




        var current_x = x + margin.left
        var current_y = y + margin.top
        actual_height += margin.top + margin.bottom

        if (table.top_line())
        {

            if (top_line.toCanvas)
            {
                top_line.dataset([[x, current_y + top_line.stroke_width() / 2], [x + width, current_y + top_line.stroke_width() / 2]]).toCanvas(canvas.append("g"));
            }
            else
                top_line.dataset([[x, current_y + top_line.stroke_width() / 2], [x + width, current_y + top_line.stroke_width() / 2]])(canvas.append("g"));
            //top_line.dataset([[1,2,3]])(canvas.append("g")); 
            actual_height += top_line.height();
            current_y += top_line.height();
        }

        if (show_header)
        {
            header_y = current_y;
            current_y += header_height;
            actual_height += header_height;


            if (table.header_line())
            {
                if (header_line.toCanvas) {
                    header_line.dataset([[x, current_y + header_line.stroke_width() / 2], [x + width, current_y + header_line.stroke_width() / 2]]).toCanvas(canvas.append("g"));
                } else
                    header_line.dataset([[x, current_y + header_line.stroke_width() / 2], [x + width, current_y + header_line.stroke_width() / 2]])(canvas.append("g"));
                actual_height += header_line.height();
                current_y += header_line.height();
            }
        }

        if (show_legends)
        {

            legend_y = current_y;
            current_y += legends_height;
            actual_height += legends_height;


            if (table.legends_line())
            {
                legends_line.dataset([[x, current_y + legends_line.stroke_width() / 2], [x + width, current_y + legends_line.stroke_width() / 2]])/*(canvas.append("g")/)*/;
                actual_height += legends_line.height();
                current_y += legends_line.height();
            }
        }

        if (show_axises)
        {
            axis_y = current_y + axis_height;
            current_y += axis_height + 5;
            actual_height += axis_height + 5;


            if (table.axises_line())
            {
                axises_line.dataset([[x, current_y + axises_line.stroke_width() / 2], [x + width, current_y + axises_line.stroke_width() / 2]]).toCanvas(canvas.append("g"));
                actual_height += axises_line.height();
                current_y += axises_line.height();
            }
        }



        table_contents_container = canvas.append("g").attr("id", "table-contents-container")



        table_contents = table_contents_container.append("g").attr("id", "table-contents")
        row_shading_contents = table_contents.append("g").attr("id", "row-shadings")
        column_lines_contents = table_contents.append("g").attr("id", "columnn-lines")


        contents_height = available_height - actual_height
        contents_start_y = current_y



        var cols = table_contents


                .selectAll("g#table-row")
                .data(table_data)
                .enter()
                .append("g").attr("id", "table-row")


        var last_row_line

        relative_y = 0

        column_lines_x = []
        header_lines_x = []




        cols.each(function(d, i)
        {

            var row_height = 0

            rows[i] = {}
            rows[i].y = relative_y

            adjust_x_for_line = false
            if (column_line && (column_lines == true || column_lines.indexOf(0) >= 0))
            {

                if (i == 0)
                {
                    column_lines_x.push(current_x)
                }
                adjust_x_for_line = true

            }

            if (column_line && (header_lines == true || header_lines.indexOf(0) >= 0))
            {

                if (i == 0)
                {
                    header_lines_x.push(current_x)
                }
                adjust_x_for_line = true

            }

            if (adjust_x_for_line)
            {
                current_x += column_line.width();
            }

            for (var j = 0; j < columns.length; j++)
            {


                column_settings[j] = column_settings[j] || {}
                data = table.getValue()(d, i)

                //Removing a check here to see if the range has been set. This was 
                //a problem if you re-render the db because it wouldn't rescale the charts
                //Should be able to set the range with column[].static_range
                //if(column_settings[j].range == null && 'valueDomain' in columns[j])
                if ('valueDomain' in columns[j])
                {
                    if (column_settings[j].static_range != true)
                    {


                        column_settings[j].range = column_settings[j].static_range ||
                                d3.extent(
                                        d3.merge(
                                                table_data.map(
                                                        function(d) {
                                                            return table.getValue()(d)
                                                        }
                                                ).map(function(d) {
                                            return columns[j].calculate_extent(d)
                                        })));

                        //Removing this check as part of the fix referenced above
                        //if(columns[j].valueDomain() == null && )   
                        //{
//                        columns[j].valueDomain([d3.min([0,column_settings[j].range[0]]),column_settings[j].range[1]]);
                        columns[j].valueDomain([column_settings[j].range[0], column_settings[j].range[1]]);

                        //}
                    }
                }


                if (column_settings[j].normalize_position && "positionDomain" in columns[j])
                {
                    column_settings[j].position_range =
                            d3.extent(
                                    d3.merge(
                                            table_data.map(
                                                    function(d) {
                                                        return table.getValue()(d)
                                                    }
                                            ).map(function(d) {
                                        return columns[j].calculate_position_extent(d)
                                    })));


                            //Check here if olumns[j].xScale().domain()[0] contains undefined
                            //typeof(arrayResults[i])=='undefined'
                    
                    if (columns[j].positionDomain() == null)
                    {
                        
                        columns[j].positionDomain([column_settings[j].position_range[0], column_settings[j].position_range[1]]);
                    }



                }

                


                var new_canvas = d3.select(this).append("g").attr("id", "table-column");
                columns[j].x(current_x);
                columns[j].y(current_y);



                if (columns[j].width == null)
                {
                    columns[j].width(width / columns.length);
                }


                columns[j].dataset(data);

                if ("position" in columns[j])
                {
                    columns[j].position(i);
                }

                if (columns[j].toCanvas)
                    columns[j].toCanvas(new_canvas);
                else
                    columns[j](new_canvas);

                if (i == 0 && show_header && column_settings[j].header_label)
                {
                    var column_id = j
                    var on_click = function(column_id) {
                        return function() {
                            table.sort(column_id);
                            table();
                        }
                    };


                     lt = new Label().dataset(column_settings[j].header_label)
                             .x(current_x)
                             .y(header_y)
                             .width(columns[j].width())
                             .margin({top: 2, left: 2})
                             .font_size(header_font_size)
                             .clipping(false)
                             .color(header_text_color)
                             .align(column_settings[j].header_alignment ? column_settings[j].header_alignment : "left")
                             .toCanvas(
                                        canvas.append("g", "header")
                                        .attr("class", "d3dash_clickable")
                                        .on("click", on_click(j))
                            );




                /*     d3dash.models.text().dataset(column_settings[j]
                            .header_label)
                            .x(current_x)
                            .y(header_y)
                            .width(columns[j].width())
                            .margin({top: 2, left: 2})
                            .font_size(header_font_size)
                            .clipping(false)
                            .color(header_text_color)
                            .align(column_settings[j].header_alignment ? column_settings[j].header_alignment : "left")
                             (canvas.append("g", "header")
                            .attr("class", "d3dash_clickable")
                            .on("click", on_click(j))

                            );*/
                }

                if (i == 0 && show_legends && column_settings[j].show_legend == true && column_settings[j].legend_values != null)
                {
                    var column_id = j

                    offset_x = 5

                    for (k = 0; k < column_settings[j].legend_values.length; k++)
                    {
                        legend_canvas = canvas.append("g", "legend")
                        
                        box_size = 12
                        
                        color = columns[j]._colorValue(column_settings[j].legend_values[k].value, k)
                        console.log("Value:" + column_settings[j].legend_values[k].value)
                        console.log("k:" + k)
                        console.log("j:" + j)
                        console.log("color:" + color)
                        console.log("colorV:" + columns[j]._colorValue)
                        console.log("colorS:" + columns[j]._colorScale)


                        

                        console.log(color)
                        
                        legend_canvas.append("rect")
                                .attr("x", current_x + offset_x)
                                .attr("y", legend_y + (legends_height - box_size) / 2)
                                .attr("width", box_size)
                                .attr("height", box_size)
                                .attr("fill", color)
                                .attr("stroke", "#000")
                                .attr("stroke-width", 0)


                        offset_x += 15


                        temp_txt = new Label().dataset(column_settings[j].legend_values[k].text)
                                .x(current_x + offset_x)
                                .y(legend_y)
                                .margin({top: 5, right: 7, bottom: 2, left: 2})
                                .font_size(10)
                                .align("left");

                        temp_txt.toCanvas(legend_canvas);

                        offset_x += temp_txt.width()


                    }









                }



                current_x += columns[j].width()

                row_height = d3.max([row_height, columns[j].height()]);
                rows[i].height = row_height

                adjust_x_for_line = false
                if (column_line && (column_lines == true || column_lines.indexOf(j + 1) >= 0))
                {

                    if (i == 0)
                    {
                        column_lines_x.push(current_x)
                    }
                    adjust_x_for_line = true
                }

                if (column_line && (header_lines == true || header_lines.indexOf(j + 1) >= 0))
                {

                    if (i == 0)
                    {

                        header_lines_x.push(current_x)
                    }
                    adjust_x_for_line = true

                }

                if (adjust_x_for_line)
                {
                    current_x += column_line.width();
                }

                if (i == 0)
                {
                    if (show_axises && column_settings[j].show_axis == true && "xScale" in columns[j])
                    {

                        var axis = d3.svg.axis()

                        
                        axis.scale(columns[j].xScale());

                        axis.orient("top")
                                //.scale(columns[j].xScale()))
                                .ticks(column_settings[j].axis_ticks || 4)
                        if (column_settings[j].axis_format)
                        {
                            axis.tickFormat(column_settings[j].axis_format)

                        }

                        if (column_settings[j].axis_tick_values)
                        {
                            axis.tickValues(column_settings[j].axis_tick_values)




                        }
                        if (column_settings[j].axis_tick_size)
                        {
                            axis.tickSize(column_settings[j].axis_tick_size[0],
                                    column_settings[j].axis_tick_size[1],
                                    column_settings[j].axis_tick_size[2])


                        }
                        if (column_settings[j].axis_tick_padding)
                        {

                            axis.tickPadding(column_settings[j].axis_tick_padding);

                        }

                        if (column_settings[j].axis_beginning_and_end_ticks_only == true)
                        {
                            axis.tickValues(columns[j].xScale().domain())
                        }
                        if (column_settings[j].axis_tick_values)
                        {
                            axis.tickValues(column_settings[j].axis_tick_values)
                        }

                        canvas.append("g", "axis")
                                .call(axis)

                                .attr("class", "axis")
                                .attr("transform", "translate(0," + (axis_y) + ")");



                    }

                    



                }




            }

            if (row_shading_colors)
            {

                row_shading_contents.insert("g", ":first-child")
                        .attr("id", "table-row-shading")
                        .insert("rect")
                        .attr("x", x)
                        .attr("y", current_y)
                        .attr("width", width)
                        .attr("height", row_height)
                        .attr("fill", row_shading_colors[i % row_shading_colors.length])
            }

            actual_height += row_height
            current_y += row_height;
            current_x = x + margin.left





            last_row_line = null
            if (table.row_line() && ((i + 1) % row_line_every == 0))
            {
                if (row_line.toCanvas) {
                    last_row_line = row_line.dataset([[x, current_y + row_line.stroke_width() / 2], [x + width, current_y + row_line.stroke_width() / 2]]).toCanvas(table_contents).canvas();
                }
                //last_row_line = row_line.dataset([[0, 250], [2000, 250]]).toCanvas(table_contents).canvas();}

                //last_row_line = row_line.dataset([[x ,current_y + row_line.stroke_width()/2],[x + width,current_y+ row_line.stroke_width()/2]]).toCanvas(table_contents).canvas();}
                else
                    last_row_line = row_line.dataset([[x, current_y + row_line.stroke_width() / 2], [x + width, current_y + row_line.stroke_width() / 2]])(table_contents).canvas()
                actual_height += row_line.height();
                current_y += row_line.height();
                relative_y += row_line.height();

            }
            relative_y += row_height


        })

        adjust_x_for_line = false
        if (column_line && (column_lines == true || column_lines.indexOf(columns.length) >= 0))
        {


            column_lines_x.push(current_x)

            adjust_x_for_line = true;
        }

        if (column_line && (header_lines == true || header_lines.indexOf(columns.length) >= 0))
        {


            header_lines_x.push(current_x)
            adjust_x_for_line = true;
        }

        if (adjust_x_for_line)
        {
            current_x += column_line.width();
        }


        if (last_row_line)
        {
            last_row_line.remove();
        }

        if (table.bottom_line())
        {
            if (bottom_line.toCanvas) {
                bottom_line.dataset([[x, current_y + bottom_line.stroke_width() / 2], [x + width, current_y + bottom_line.stroke_width() / 2]]).toCanvas(table_contents);
            } else
                bottom_line.dataset([[x, current_y + bottom_line.stroke_width() / 2], [x + width, current_y + bottom_line.stroke_width() / 2]])(table_contents);
            actual_height += bottom_line.height();
            current_y += bottom_line.height();
        }



        for (i = 0; i < column_lines_x.length; i++)
        {
            column_line.dataset([[column_lines_x[i] + column_line.stroke_width() / 2, contents_start_y], [column_lines_x[i] + column_line.stroke_width() / 2, current_y]]).toCanvas((column_lines_contents.insert("g", ":first-child").attr("class", "column_line")));
        }



        for (i = 0; i < header_lines_x.length; i++)
        {

            column_line.dataset([[header_lines_x[i] + column_line.stroke_width() / 2, header_y], [header_lines_x[i] + column_line.stroke_width() / 2, contents_start_y]]).toCanvas(canvas);
        }


        contents_clip_path = "clip" + d3dash.uuid();
        table_contents_container.append("defs").append("clipPath").attr("id", contents_clip_path)
                .append("rect")
                .attr("width", width)
                .attr("height", (height != null ? (height) : (actual_height - contents_start_y)))
                .attr("x", x)
                .attr("y", contents_start_y)

        table_contents_container.attr("clip-path", "url(#" + contents_clip_path + ")")


        clip_path = "clip" + d3dash.uuid();
        clip_path_element = canvas.append("defs").append("clipPath").attr("id", clip_path)
                .append("rect")
                .attr("width", width)
                //.attr("x", current_x)
                .attr("x", x + margin.left)
                .attr("y", y + margin.top)
                .attr("height", (height != null ? (height) : (actual_height)))


        //canvas.attr("clip-path", "url(#"+ clip_path + ")")






        return table
    }



    table.add_column = function(column) {
        columns.push(column.onRedraw(function(canvas) {
        }))
        column_settings.push({})
        return column_settings[column_settings.length - 1];
    };

    table.sort = function(column)
    {


        if (current_sort == column)
        {
            current_sort_direction = (current_sort_direction + 1) % 2
        }


        current_sort = column

        table_data = table.sort_function()(column)
        if (current_sort_direction == 1)
        {
            table_data.reverse();
        }


    }

    table.sort_function = function(_) {
        if (!arguments.length)
            return sort_function;

        sort_function = _;
        return table;
    };



    table.actual_height = function() {
        return actual_height;
    }

    table.actual_width = function() {
        return actual_width;
    }

    table.show_axises = function(_) {
        if (!arguments.length)
            return show_axises;
        show_axises = _;
        return table;
    };

    table.axises_line = function(_) {
        if (!arguments.length)
            return axises_line;
        axises_line = _;
        return table;
    };

    table.axis_height = function(_) {
        if (!arguments.length)
            return axises_height;
        axises_height = _;
        return table;
    };

    table.show_legends = function(_) {
        if (!arguments.length)
            return show_legends;
        show_legends = _;
        return table;
    };

    table.legend_values = function(_) {
        if (!arguments.length)
            return legend_values;
        legend_values = _;
        return table;
    };

    table.legends_height = function(_) {
        if (!arguments.length)
            return legends_height;
        legends_height = _;
        return table;
    };

    table.legends_line = function(_) {
        if (!arguments.length)
            return legends_line;
        legends_line = _;
        return table;
    };

    table.show_header = function(_) {
        if (!arguments.length)
            return show_header;
        show_header = _;
        return table;
    };

    table.header_text_color = function(_) {
        if (!arguments.length)
            return header_text_color;
        header_text_color = _;
        return table;
    };

    table.header_height = function(_) {
        if (!arguments.length)
            return header_height;
        header_height = _;
        return table;
    };

    table.header_font_size = function(_) {
        if (!arguments.length)
            return header_font_size;
        header_font_size = _;
        return table;
    };

    table.header_line = function(_) {
        if (!arguments.length)
            return header_line;
        header_line = _;
        return table;
    };

    table.dataset = function(_) {
        if (!arguments.length)
            return dataset;
        dataset = _;
        table_data = null;
        return table;
    };

    table.width = function(_) {
        if (!arguments.length)
            return width;
        width = _;
        return table;
    };

    table.height = function(_) {
        if (!arguments.length)
            return height;
        height = _;
        return table;
    };

    table.x = function(_) {
        if (!arguments.length)
            return x;
        x = _;
        return table;
    };

    table.y = function(_) {
        if (!arguments.length)
            return y;
        y = _;
        return table;
    };


    table.spacing = function(_) {
        if (!arguments.length)
            return spacing;
        spacing = _;
        return table;
    };

    table.color = function(_) {
        if (!arguments.length)
            return color;
        color = _;
        return table;
    };

    table.getData = function(_) {
        if (!arguments.length)
            return getData;
        getData = _;
        return table;
    };

    table.getValue = function(_) {
        if (!arguments.length)
            return getValue;
        getValue = _;
        return table;
    };

    table.top_line = function(_) {
        if (!arguments.length)
            return top_line;
        top_line = _;
        return table;
    };

    table.axises_line = function(_) {
        if (!arguments.length)
            return axises_line;
        axises_line = _;
        return table;
    };

    table.bottom_line = function(_) {
        if (!arguments.length)
            return bottom_line;
        bottom_line = _;
        return table;
    };

    table.row_line = function(_) {
        if (!arguments.length)
            return row_line;
        row_line = _;
        return table;
    };

    table.column_lines = function(_) {
        if (!arguments.length)
            return column_lines;
        column_lines = _;
        return table;
    };

    table.header_lines = function(_) {
        if (!arguments.length)
            return header_lines;
        header_lines = _;
        return table;
    };

    table.column_line = function(_) {
        if (!arguments.length)
            return column_line;
        column_line = _;
        return table;
    };

    table.row_line_every = function(_) {
        if (!arguments.length)
            return row_line_every;
        row_line_every = _;
        return table;
    };


    table.row_shading_colors = function(_) {
        if (!arguments.length)
            return row_shading_colors;
        row_shading_colors = _;
        return table;
    };

    table.canvas = function(_) {
        if (!arguments.length)
            return canvas;
        canvas = _;
        return table;
    };

    table.auto_scroll = function(interval)
    {
        clearInterval(scroll_interval)
        scroll_interval = setInterval(function() {
            table.scroll()
        }, interval || 10000);
    }

    table.scroll = function(tranform_x, tranform_y)
    {

        if (tranform_x || tranform_y)
        {
            current_x_transform += tranform_x
            current_y_transform += tranform_y
            table_contents.transition().duration(1000).attr("transform", "translate(" + current_x_transform + "," + current_y_transform + ")")
        }
        else
        {


            //Naive way of finding the first element not on the screen
            j = 0
            //console.log("contents_height:" + contents_height)
            for (i = 0; i < rows.length; i++)
            {
                //console.log("Row " + i + ": " + "y:" + rows[i].y + " h:" + rows[i].height)

                if ((rows[i].y + rows[i].height) > contents_height - current_y_transform)
                {
                    j = i
                    current_y_transform = -1 * rows[i].y
                    break;
                }
            }
            if (j == 0)
            {
                current_y_transform = 0
            }
            table_contents.transition().duration(1000).attr("transform", "translate(" + 0 + "," + current_y_transform + ")")

        }


    }

    table.margin = function(_) {
        if (!arguments.length)
            return margin;
        margin.top = typeof _.top != 'undefined' ? _.top : margin.top;
        margin.right = typeof _.right != 'undefined' ? _.right : margin.right;
        margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
        margin.left = typeof _.left != 'undefined' ? _.left : margin.left;
        return table;
    };

    return table;
}
