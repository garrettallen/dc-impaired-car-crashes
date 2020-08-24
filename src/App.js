import React from 'react';
import { scaleLinear } from 'd3-scale';
import Map from './Map';
import LineChart from './LineChart';
import SelectForm from './SelectForm';
import './App.css';
import geoJson from './annotatedData.geo.json';

const maxTotal = Math.max(...geoJson.features.map(d => d.properties.total));
const colorScale = scaleLinear()
    .domain([0, maxTotal])
    .range([[220, 180, 180], [220, 20, 60]]);

class App extends React.Component {

    state = {
        featureId: ""
    }

    selectNeighborhood = (featureId) => {
        this.setState({ featureId });
    }

    render() {
        return (
            <div className="parent">
                <div className="map">
                    <Map
                        geoJson={geoJson}
                        featureId={this.state.featureId}
                        selectNeighborhood={this.selectNeighborhood}
                        colorScale={colorScale} />
                </div>
                <div className="sidebar">
                    <div className="header">
                        <h2>
                            Impaired Traffic Accidents
                        </h2>
                        <p>
                            <em>Washington DC, 2010-2014</em>
                        </p>
                        <p>
                            This interactive data visualization shows the number of impaired
                            traffic accidents in Washington DC over the five-year period of 2010-2014, separated out
                            by neighborhood.
                        </p>
                        <p>
                            Use the map, dropdown menu, or chart to filter by neighborhood.
                        </p>
                        <SelectForm
                            geoJson={geoJson}
                            featureId={this.state.featureId}
                            selectNeighborhood={this.selectNeighborhood}
                            colorScale={colorScale} />
                    </div>
                    <LineChart
                        geoJson={geoJson}
                        featureId={this.state.featureId}
                        selectNeighborhood={this.selectNeighborhood}
                        colorScale={colorScale} />
                </div>
            </div>
        );
    }

}

export default App;
