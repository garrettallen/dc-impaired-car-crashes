import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, PolygonLayer } from '@deck.gl/layers';
import { LightingEffect, AmbientLight, _SunLight as SunLight } from '@deck.gl/core';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // eslint-disable-line

const initialViewState = {
    latitude: 38.87,
    longitude: -77.03,
    zoom: 10.5,
    maxZoom: 11,
    minZoom: 10,
    pitch: 45,
    bearing: 0
};

const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 1.0
});

const dirLight = new SunLight({
    timestamp: Date.UTC(2019, 8, 21, 18),
    color: [255, 255, 255],
    intensity: 1.0,
    _shadow: true
});

const landCover = [[[-75.9, 38.7], [-75.9, 39.2], [-77.5, 39.2], [-77.5, 38.7]]];

const material = {
    ambient: 0.64,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [51, 51, 51]
};

const lightingEffect = new LightingEffect({ ambientLight, dirLight });
lightingEffect.shadowColor = [0, 0, 0, 0.5];
const effects = [lightingEffect];

export default class Map extends React.Component {
    getTooltip = ({ object }) => {
        if (object) {
            this.props.selectHood(object.id);
            return { html: ReactDOMServer.renderToStaticMarkup(<div>{object.properties.name}</div>) };
        } else {
            this.props.selectHood(null);
        }
    }

    filterFeature = (feature_id) => {
        let geoJson3d = JSON.parse(JSON.stringify(this.props.geoJson));
        geoJson3d.features = geoJson3d.features.filter((feature) => feature.id === feature_id);
        return geoJson3d;
    }

    render() {
        const layers = [
            new GeoJsonLayer({
                id: 'geojson',
                data: this.props.geoJson,
                opacity: 0.8,
                stroked: false,
                filled: true,
                extruded: false,
                wireframe: true,
                getElevation: f => f.properties.total * 200,
                getFillColor: f => this.props.colorScale(f.properties.total),
                getLineColor: [255, 255, 255],
                pickable: true
            }),
            new PolygonLayer({
                id: 'ground',
                data: landCover,
                stroked: false,
                getPolygon: f => f,
                getFillColor: [0, 0, 0, 0]
            }),
            new GeoJsonLayer({
                id: 'geojson3d',
                data: this.filterFeature(this.props.featureId),
                opacity: 1,
                stroked: false,
                filled: true,
                extruded: true,
                wireframe: true,
                getElevation: f => Math.max(f.properties.total, 1) * 150,
                getFillColor: f => this.props.colorScale(f.properties.total),
                getLineColor: [255, 255, 255],
                material,
                pickable: true
            })
        ];

        return (
            <DeckGL
                layers={layers}
                effects={effects}
                initialViewState={initialViewState}
                controller={true}
                getTooltip={this.getTooltip}
                width="100%"
                height="100%"
            >
                <StaticMap
                    reuseMaps
                    mapStyle='mapbox://styles/mapbox/light-v9'
                    preventStyleDiffing={true}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                />
            </DeckGL>
        );
    }
}
