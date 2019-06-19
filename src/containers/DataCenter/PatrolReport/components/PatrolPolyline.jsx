import React, {Component} from 'react';
import _ from "lodash";
import {Axis, Chart, Geom, Tooltip, Legend} from "bizcharts";

class PatrolPolyline extends Component {

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
                    value: _.random(0, 30),
                    type: '未缴费停车'
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
                    <Legend />
                    <Axis name="date"/>
                    <Axis name="value"/>
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom type="line" position="date*value" size={2} color={'type'}/>
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

export default PatrolPolyline;
