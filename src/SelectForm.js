import React from 'react';
import Select from 'react-select';

export default class SelectForm extends React.Component {

    state = {
        options: []
    }

    componentDidMount() {
        const options = this.props.geoJson.features.map(feature => {
            const item = feature.properties;
            return {
                label: `${item.name}: ${Math.max(0, item.total)}`,
                value: feature.id,
                total: item.total
            };
        });
        this.setState({
            options: options.sort((a, b) => {
                return b.total - a.total;
            })
        });
    }

    onSelectChange = (option) => {
        this.props.selectNeighborhood(option.value);
    }

    getOption = () => {
        if (this.state.options.length) {
            return this.state.options.find(d => d.value === this.props.featureId) || null;
        }
    }

    render() {
        return (
            <Select
                isMulti={false}
                onChange={this.onSelectChange}
                options={this.state.options}
                value={this.getOption()}
            />);
    }

}