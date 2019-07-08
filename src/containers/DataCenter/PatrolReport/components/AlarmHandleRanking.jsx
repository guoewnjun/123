import React, {Component} from 'react';
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
} from "bizcharts";
import _ from 'lodash';
import {Empty} from "antd";

class AlarmHandleRanking extends Component {
    render() {
        const { data } = this.props;
        let sortData = _.sortBy(data, (o) => o.times);
        _.reverse(sortData);
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
                            <Axis name="userName"/>
                            <Axis name="times"/>
                            <Tooltip
                                crosshairs={{
                                    type: "y"
                                }}
                            />
                            <Geom type="interval" position="userName*times"
                                  tooltip={['userName*times', (userName, times) => {
                                      return {
                                          name: '处理次数',
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

export default AlarmHandleRanking;
