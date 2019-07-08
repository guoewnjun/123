import React, {Component} from 'react';
import {
    Chart,
    Geom,
    Axis,
    Tooltip
} from "bizcharts";
import {Empty} from 'antd';

class AreaPayment extends Component {
    render() {
        const cols = {
            money: {
                alias: '金额',
                min: 0
            }
        };
        return (
            <div>
                <div style={{ fontSize: 20, paddingLeft: 60 }}>{this.props.AreaPaymentTitle}</div>
                {
                    this.props.areaList.length > 0 ? (
                        <Chart placeholder height={400} data={this.props.areaList} forceFit scale={cols}>
                            <Axis name="name"/>
                            <Axis name="money"/>
                            <Tooltip
                                crosshairs={{
                                    type: "y"
                                }}
                            />
                            <Geom type="interval" position="name*money"/>
                        </Chart>
                    ) : (
                        <Empty style={{marginBottom: 20}}/>
                    )
                }
            </div>
        );
    }
}

export default AreaPayment;
