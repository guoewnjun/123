import React, {Component} from 'react';
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
} from "bizcharts";

class AlarmHandleRanking extends Component {

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
            for (let i = 10; i > 0; i--) {
                const obj = {
                    name: `姓名${i}`,
                    count: i * 10
                };
                data.push(obj)
            }
            return data;
        };
        const data = genData();
        console.log(data);
        const cols = {
            count: {
                tickInterval: 20
            }
        };
        return (
            <div>
                <div style={{ fontSize: 20, textAlign: 'center' }}>告警处理排行TOP10</div>
                <Chart height={400} data={data} scale={cols} forceFit>
                    <Axis name="name"/>
                    <Axis name="count"/>
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom type="interval" position="name*count"/>
                </Chart>
            </div>
        );
    }
}

export default AlarmHandleRanking;
