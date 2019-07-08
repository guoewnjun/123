import React, {Component} from 'react';
import {
    Chart,
    Geom,
    Axis,
    Tooltip
} from 'bizcharts';
import {Empty} from 'antd';
import moment from 'moment';

class dayPayment extends Component {
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
        if (nextProps.dayList !== this.props.dayList) {
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
        this.durationDay.forEach(duration => {
            let obj = {
                day: duration,
                money: 0
            };
            nextProps.dayList.forEach(item => {
                if (duration === item.day) {
                    obj.money = item.money;
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
        const cols = {
            money: {
                alias: '金额',
                min: 0
            },
            day: {
                range: [0, 1]
            }
        };
        return (
            <div>
                <div style={{ fontSize: 20, paddingLeft: 60 }}>{this.props.DatePaymentTitle}</div>
                {
                    sourceData.length > 0 ? (
                        <Chart height={400} data={sourceData} scale={cols} forceFit>
                            <Axis name="day"/>
                            <Axis name="money"/>
                            <Tooltip
                                crosshairs={{
                                    type: "y"
                                }}
                            />
                            <Geom type="line" position="day*money" size={2} shape={"smooth"}/>
                            <Geom
                                type="point"
                                position="day*money"
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

export default dayPayment;
