import React, {Component} from 'react';
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
} from 'bizcharts';
import _ from "lodash";
import {Empty} from "antd";

class IllegalParkingTreatment extends Component {

    state = {};

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        const { data } = this.props;
        const enm = {
            invalidReportTimes: '误报',
            validReportTimes: '有效告警',
            hasPrintOrderTimes: '贴条',
            notPrintOrderTimes: '未贴条'
        };
        let sortData = [];
        _.forEach(data, (value, key) => {
            sortData.push({
                name: enm[key],
                times: value
            })
        });
        const cols = {
            times: {
                tickInterval: 20
            }
        };
        return (
            <div>
                <div style={{ fontSize: 20, textAlign: 'center' }}>{this.props.title}</div>
                {
                    sortData.length > 0 ? (
                        <Chart height={400} data={sortData} scale={cols} forceFit>
                            <Axis name="name"/>
                            <Axis name="times"/>
                            <Tooltip
                                crosshairs={{
                                    type: "y"
                                }}
                            />
                            <Geom type="interval" position="name*times"
                                  tooltip={['name*times', (name, times) => {
                                      return {
                                          name: '次数',
                                          value: times
                                      }
                                  }]}
                            />
                        </Chart>
                    ) : (
                        <Empty style={{ marginBottom: 20 }}/>
                    )
                }
            </div>
        );
    }
}

export default IllegalParkingTreatment;
