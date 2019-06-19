import React, {Component} from 'react';
import {
    Chart,
    Geom,
    Axis,
    Tooltip
} from "bizcharts";

class AreaPayment extends Component {

    state = {};

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    onPlotClick(e) {
        if (e.data) {
            const data = e.data._origin;
            location.hash = `${location.hash}/AreaPaymentDetail?id=${data.id}`
        }
    }

    render() {
        const data = [
            {
                area: "福田区",
                sales: 38,
                id: 1
            },
            {
                area: "南山区",
                sales: 52,
                id: 2
            },
            {
                area: "宝安区",
                sales: 61,
                id: 3
            },
            {
                area: "罗湖区",
                sales: 145,
                id: 4
            },
            {
                area: "龙华区",
                sales: 48,
                id: 5
            },
            {
                area: "龙岗区",
                sales: 38,
                id: 6
            },
            {
                area: "光明区",
                sales: 38,
                id: 7
            },
            {
                area: "坪山区",
                sales: 38,
                id: 8
            }
        ];
        const cols = {
            sales: {
                tickInterval: 20
            }
        };
        return (
            <div>
                <div style={{ fontSize: 20, paddingLeft: 60 }}>区域缴费金额统计</div>
                <Chart height={400} data={data} scale={cols} forceFit onPlotClick={(e) => this.onPlotClick(e)}>
                    <Axis name="area"/>
                    <Axis name="sales"/>
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom type="interval" position="area*sales"/>
                </Chart>
            </div>
        );
    }
}

export default AreaPayment;
