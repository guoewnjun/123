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
        const data = [
            {
                item: "龙华区",
                a: 70,
            },
            {
                item: "宝安区",
                a: 60,
            },
            {
                item: "南山区",
                a: 50,
            },
            {
                item: "福田区",
                a: 40,
            },
            {
                item: "罗湖区",
                a: 60,
            },
            {
                item: "光明区",
                a: 70,
            },
            {
                item: "龙岗区",
                a: 50,
            },
            {
                item: "坪山区",
                a: 30,
            },
            {
                item: "大鹏新区",
                a: 60,
            }
        ];
        const dv = new DataView().source(data);
        dv.transform({
            type: "fold",
            fields: ["a", "b"],
            // 展开字段集
            key: "user",
            // key字段
            value: "score" // value字段
        });
        const cols = {
            score: {
                min: 0,
                max: 80
            }
        };
        return (
            <div>
                <div style={{ fontSize: 20, textAlign: 'center' }}>各区违停指数分析</div>
                <Chart
                    height={400}
                    data={dv}
                    padding={20}
                    scale={cols}
                    forceFit
                >
                    <Coord type="polar" radius={0.8} />
                    <Axis
                        name="item"
                        line={null}
                        tickLine={null}
                        grid={{
                            lineStyle: {
                                lineDash: null
                            },
                            hideFirstLine: false
                        }}
                    />
                    <Tooltip />
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
                    <Legend name="user" marker="circle" offset={30} />
                    <Geom type="area" position="item*score" color="user" />
                    <Geom type="line" position="item*score" color="user" size={2} />
                    <Geom
                        type="point"
                        position="item*score"
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
            </div>
        );
    }
}

export default AnalysisIllegalParking;
