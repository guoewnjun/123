import React, {Component} from 'react';
import {Axis, Chart, Geom, Tooltip, Legend} from "bizcharts";
import {Empty} from "antd";
import moment from 'moment';

class PatrolPolyline extends Component {
    constructor(props) {
        super(props);
        this.durationDay = [];
    }

    state = {
        sourceData: []
    };

    componentDidMount() {
        this.updateDurationTime();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.startDay !== this.props.startDay || nextProps.endDay !== this.props.endDay) {
            this.updateDurationTime({ startDay: nextProps.startDay, endDay: nextProps.endDay });
        }
        //不太清楚是否会对相同长度的不同内容的数组作比较
        if (nextProps.data !== this.props.data || nextProps.type !== this.props.type) {
            this.updateDataSource(nextProps);
        }
    }

    // 更新时间段
    updateDurationTime({ startDay, endDay } = this.props) {
        let arr = [];
        let durationDate = parseInt(moment(endDay - startDay).format('DDD'));
        for (let i = 0; i < durationDate; i++) {
            let day = moment(startDay).add(i, 'days');
            arr.push(day.format('YYYY-MM-DD'))
        }
        this.durationDay = arr;
    }

    // 更新数据源
    updateDataSource(nextProps) {
        let sourceData = [];
        const enm = {
            noPayCount: '未交费停车',
            crossSpaceCount: '跨泊位停车',
            reverseParkCount: '逆向停车',
            forbiddenTimeCount: '禁停时段停车',
            blackListCount: '黑名单禁停区停车'
        };
        this.durationDay.forEach(duration => {
            let obj = {
                date: duration,
                type: enm[nextProps.type],
                value: 0
            };
            nextProps.data.forEach(item => {
                if (duration === item.dayTime) {
                    obj.value = item[nextProps.type];
                }
            });
            sourceData.push(obj)
        });
        this.setState({
            sourceData
        })
    }

    render() {
        const { sourceData } = this.state;
        const enm = {
            noPayCount: '未交费停车',
            crossSpaceCount: '跨泊位停车',
            reverseParkCount: '逆向停车',
            forbiddenTimeCount: '禁停时段停车',
            blackListCount: '黑名单禁停区停车'
        };
        const cols = {
            value: {
                alias: enm[this.props.type],
                min: 0
            },
            date: {
                type: 'time',
                range: [0, 1]
            }
        };
        return (
            <div>
                {/*<div style={{ fontSize: 20, paddingLeft: 60 }}>{this.props.title}</div>*/}
                {
                    sourceData.length > 0 ? (
                        <Chart height={400} data={sourceData} scale={cols} forceFit>
                            <Legend/>
                            <Axis name="date"/>
                            <Axis name="value"/>
                            <Tooltip
                                crosshairs={{
                                    type: "y"
                                }}
                            />
                            <Geom type="line" position="date*value" size={2} color={'type'}
                                  shape={"smooth"}/>
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
                    ) : (
                        <Empty style={{ marginBottom: 20 }}/>
                    )
                }
            </div>
        );
    }
}

export default PatrolPolyline;
