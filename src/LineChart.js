import React from 'react';
import * as d3 from 'd3';
import * as d3array from 'd3-array';

export default class LineChart extends React.Component {

    createLineChart = () => {
        const selectNeighborhood = this.props.selectNeighborhood;
        const data = this.state.data;
        const width = 500;
        const height = 400;
        const margin = { top: 30, right: 20, bottom: 30, left: 30 };

        // X-axis scale, year
        const x = d3.scaleTime()
            .domain([new Date(2010, 0, 1), new Date(2014, 0, 1)])
            .range([margin.left, width - margin.right]);

        // Y-axis scale, count of accidents
        const y = d3.scaleLinear()
            .domain([0, 12]).nice()
            .range([height - margin.bottom, margin.top]);

        // Select svg and in React DOM ref
        const svg = d3.select(this.svgNode).attr("viewBox", [0, 0, width, height]);

        // Clear existing paths
        svg.selectAll("*").remove();

        // Add X-axis to SVG
        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x)
                .ticks(d3.timeYear)
                .tickSizeOuter(0));

        // Add Y-axis to SVG
        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y));

        // Line drawing function for series
        const line = d3.line()
            .defined(d => !isNaN(d))
            .x((d, i) => x(this.state.data.dates[i]))
            .y(d => y(d))

        // Create paths for each series
        let path = svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#DC143C")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .selectAll("path")
            .data(data.series)
            .join("path")
            .attr("d", d => line(d.values))
            .attr("stroke", d => this.props.featureId ? "#eee" : d3.rgb(...this.props.colorScale(d.total)));

            function moved() {
                d3.event.preventDefault();
                const mouse = d3.mouse(this);
                const xm = x.invert(mouse[0]);
                const ym = y.invert(mouse[1]);
    
                // Find the closest X to mouse
                const i1 = d3.bisectLeft(data.dates, xm, 1);
                const i0 = i1 - 1;
    
                // Find the closest Y to mouse
                const i = xm - data.dates[i0] > data.dates[i1] - xm ? i1 : i0;
                const s = d3array.least(data.series, d => Math.abs(d.values[i] - ym));
    
                // Select the closest path
                selectNeighborhood(s.id);
            }

        // Bind mouse movement to moved handler
        path.on("mousemove", moved);

        // Change series style when a neighborhood is selected
        path.filter(d => d.id === this.props.featureId)
            .attr("stroke", d => d3.rgb(...this.props.colorScale(d.total)))
            .attr("stroke-width", 3.5)
            .raise();

    }

    componentDidMount() {
        const data = {
            series: this.props.geoJson.features.map(f => {
                const item = f.properties;
                return {
                    name: item.name,
                    id: f.id,
                    total: item.total,
                    values: [item[2010], item[2011], item[2012], item[2013], item[2014]]
                };
            }),
            dates: [
                new Date(2010, 0, 1),
                new Date(2011, 0, 1),
                new Date(2012, 0, 1),
                new Date(2013, 0, 1),
                new Date(2014, 0, 1)
            ]
        };

        this.setState({ data }, () => {
            this.createLineChart();
        });
    }

    componentDidUpdate() {
        this.createLineChart();
    }

    render() {
        return (
            <svg
                ref={svgNode => this.svgNode = svgNode}
                width="100%"
                height="400">
            </svg>);
    }

}
