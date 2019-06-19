import React, {Component} from 'react';
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    Guide,
} from "bizcharts";
import DataSet from "@antv/data-set";

class IllegalParkingAlarmType extends Component {

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
                item: "未缴费停车",
                count: 40
            },
            {
                item: "跨泊位停车",
                count: 21
            },
            {
                item: "逆向停车",
                count: 17
            },
            {
                item: "禁停时段停车",
                count: 13
            },
            {
                item: "黑名单禁停区停车",
                count: 9
            }
        ];
        const dv = new DataView();
        dv.source(data).transform({
            type: "percent",
            field: "count",
            dimension: "item",
            as: "percent"
        });
        const cols = {
            percent: {
                formatter: val => {
                    val = val * 100 + "%";
                    return val;
                }
            }
        };
        return (
            <div>
                <div style={{ fontSize: 20, textAlign: 'center' }}>违停告警类型</div>
                <Chart
                    height={400}
                    data={dv}
                    scale={cols}
                    padding={20}
                    forceFit
                >
                    <Coord type={"theta"} radius={0.75} innerRadius={0.6}/>
                    <Axis name="percent"/>
                    <Legend
                        position="right"
                        offsetY={-160}
                        offsetX={-100}
                    />
                    <Tooltip
                        showTitle={false}
                        itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                    />
                    <Geom
                        type="intervalStack"
                        position="percent"
                        color="item"
                        tooltip={[
                            "item*percent",
                            (item, percent) => {
                                percent = percent * 100 + "%";
                                return {
                                    name: item,
                                    value: percent
                                };
                            }
                        ]}
                        style={{
                            lineWidth: 1,
                            stroke: "#fff"
                        }}
                    >
                        <Label
                            content="percent"
                            formatter={(val, item) => {
                                return item.point.item + ": " + val;
                            }}
                        />
                    </Geom>
                </Chart>
            </div>
        );
    }
}

export default IllegalParkingAlarmType;
