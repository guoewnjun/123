import React, {Component} from 'react';
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Legend,
} from "bizcharts";
import DataSet from "@antv/data-set";
import {Empty} from "antd";

class AnalysisIllegalParking extends Component {

    state = {};

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        const { DataView } = DataSet;
        const { data } = this.props;
        const dv = new DataView().source(data);
        dv.transform({
            type: "fold",
            fields: ["parkwarnTimes"],
            // 展开字段集
            key: "user",
            // key字段
            value: "score" // value字段
        });
        const cols = {
            score: {
                min: 0,
            }
        };
        return (
            <div>
                <div style={{ fontSize: 20, textAlign: 'center' }}>{this.props.title}</div>
                {
                    data.length > 0 ? (
                        <Chart
                            height={400}
                            data={dv}
                            padding={20}
                            scale={cols}
                            forceFit
                        >
                            <Coord type="polar" radius={0.8}/>
                            <Axis
                                name="areaName"
                                line={null}
                                tickLine={null}
                                grid={{
                                    lineStyle: {
                                        lineDash: null
                                    },
                                    hideFirstLine: false
                                }}
                            />
                            <Tooltip/>
                            <Axis
                                name="score"
                                line={null}
                                tickLine={null}
                                grid={{
                                    type: "polygon",
                                    lineStyle: {
                                        lineDash: null
                                    },
                                    alternateColor: "rgba(0, 0, 0, 0.04)"
                                }}
                            />
                            <Geom type="area" position="areaName*score" color="user"
                                  tooltip={[
                                      "areaName*score",
                                      (areaName, score) => {
                                          return {
                                              name: '违停次数',
                                              value: score
                                          };
                                      }
                                  ]}
                            />
                            <Geom type="line" position="areaName*score" color="user" size={2} tooltip={false}/>
                            <Geom
                                type="point"
                                tooltip={false}
                                position="areaName*score"
                                color="user"
                                shape="circle"
                                size={4}
                                style={{
                                    stroke: "#fff",
                                    lineWidth: 1,
                                    fillOpacity: 1
                                }}
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

export default AnalysisIllegalParking;
