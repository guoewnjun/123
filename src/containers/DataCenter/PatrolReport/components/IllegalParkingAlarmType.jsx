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
import _ from 'lodash';
import {Empty} from "antd";

class IllegalParkingAlarmType extends Component {
    render() {
        const emun = {
            // warnEstablishCount: '告警成立数',
            noPayCount: '未支付',
            crossSpaceCount: '跨泊位',
            reverseParkCount: '逆向停车',
            forbiddenTimeCount: '禁停时段',
            blackListCount: '黑名单停车'
        };
        const { DataView } = DataSet;
        const { data } = this.props;
        let sourceData = [];
        let total = 0;
        _.forEach(data, (value, key) => {
            if (key !== 'warnEstablishCount') {
                sourceData.push({
                    item: emun[key],
                    count: value
                });
                total = total + value
            }
        });
        const dv = new DataView();
        const { Html } = Guide;
        dv.source(sourceData).transform({
            type: "percent",
            field: "count",
            dimension: "item",
            as: "percent"
        });
        const cols = {
            percent: {
                formatter: val => {
                    val = _.round(val * 100, 2) + "%";
                    return val;
                }
            }
        };
        return (
            <div>
                <div style={{ fontSize: 20, textAlign: 'center' }}>{this.props.title}</div>
                {
                    sourceData.length > 0 ? (
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
                                itemTpl={
                                    `<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>`
                                }
                            />
                            <Guide>
                                <Html
                                    position={["50%", "50%"]}
                                    html={
                                        `<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width:10em;">总违停数<br>
                                    <span style="color:#262626;font-size:2.5em">${total}</span>次
                                 </div>`
                                    }
                                    alignX="middle"
                                    alignY="middle"
                                />
                            </Guide>
                            <Geom
                                type="intervalStack"
                                position="percent"
                                color="item"
                                tooltip={[
                                    "item*percent",
                                    (item, percent) => {
                                        const value = `${parseInt(percent * total)}次`;
                                        return {
                                            name: item,
                                            value: value
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
                    ) : (
                        <Empty style={{ marginBottom: 20 }}/>
                    )
                }
            </div>
        );
    }
}

export default IllegalParkingAlarmType;
