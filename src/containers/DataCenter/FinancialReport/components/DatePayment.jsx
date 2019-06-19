import React, {Component} from 'react';
import {
    Chart,
    Geom,
    Axis,
    Tooltip
} from 'bizcharts';
import _ from 'lodash';

class DatePayment extends Component {

    state = {};

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        const genData = () => {
            let data = [];
            for (let i = 0; i < 30; i++) {
                const obj = {
                    date: `${i + 1}`,
                    value: _.random(0, 30)
                };
                data.push(obj)
            }
            return data;
        };
        const data = genData();
        const cols = {
            value: {
                min: 0
            },
            date: {
                range: [0, 1]
            }
        };
        return (
            <div>
                <div style={{ fontSize: 20, paddingLeft: 60 }}>每日缴费金额统计</div>
                <Chart height={400} data={data} scale={cols} forceFit>
                    <Axis name="date"/>
                    <Axis name="value"/>
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom type="line" position="date*value" size={2}/>
                    <Geom
                        type="point"
                        position="date*value"
                        size={4}
                        shape={"circle"}
                        style={{
                            stroke: "#fff",
                            lineWidth: 1
                        }}
                    />
                </Chart>
            </div>
        );
    }
}

export default DatePayment;
