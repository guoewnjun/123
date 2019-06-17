import React, {Component} from 'react';
import {Card, Row, Col, Icon, Table} from 'antd';
import {Chart, Axis, Geom, Tooltip, Legend, Coord, Label, Guide} from 'bizcharts';
import DataSet from "@antv/data-set";
import MapofToday from './Components/MapofToday';
import _ from 'lodash';
import {HttpClient} from "@/common/HttpClient";


export default class Today extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstdata: {},
            data: [],
            bztdata: [],
            data2: [],
            ddtdata: [],
            numbers: [],
            maxmoney: 12800,
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        HttpClient.query('/parking-report/report/road/today/base', 'GET', { cityCode: window.cityCode }, this.handleQueryData.bind(this));
        HttpClient.query('/parking-report/report/road/today/count', 'GET', { cityCode: window.cityCode }, this.handleQueryData1.bind(this));
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    handleQueryData(d, type) {
        if (type === HttpClient.requestSuccess) {
            this.setState({
                firstdata: d.data,
            })
        }
    }

    handleQueryData1(d, type) {
        if (type === HttpClient.requestSuccess) {
            const data = d.data;
            data.areaConsume && data.areaConsume.forEach((item, index) => {
                item.index = index + 1
            });
            const list = _.cloneDeep();
            this.setState({
                data: _.cloneDeep(data.areaConsume),
                bztdata: (_.cloneDeep(data.payType).length==0)?[{"payType": "暂无信息","ratio": 1}]:_.cloneDeep(data.payType),
                data2: (_.cloneDeep(data.areaSaturations).length==0)?[{"areaName": "暂无数据","money": 0,"ratio": 0}]:_.cloneDeep(data.areaSaturations),
                ddtdata: (_.cloneDeep(data.platformEarning).length==0)?[{"day": "暂无数据","money": 0}]:_.cloneDeep(data.platformEarning),
                numbers: _.cloneDeep(data.parkingEarning),
                maxmoney: data.parkingEarning[0] ? data.parkingEarning[0].money : 0,
            })
        }
    }

    render() {
        const { firstdata, data, bztdata, data2, ddtdata, numbers, maxmoney } = this.state;
        const columns = [{
            title: '排名',
            dataIndex: 'index',
        }, {
            title: '区域',
            dataIndex: 'areaName',
        }, {
            title: '消费金额',
            dataIndex: 'money',
        }, {
            title: '占比',
            render: (text, record) => (
                <span style={{ color: 'gray' }}>
                  <Icon type={record.ratio > 0 ? "caret-up" : "caret-down"} style={{ color: 'green' }}/>
                    {record.ratio ? _.ceil((record.ratio * 100), 2) : '--'} %
                </span>
            )
        }];

        const { DataView } = DataSet;
        const bzt = new DataView();
        bzt.source(bztdata).transform({
            type: 'percent',
            field: 'ratio',
            dimension: 'payType',
            as: 'percent',
        });
        const bztcols = {
            percent: {
                formatter: val => {
                    val = _.ceil((val * 100), 2) + '%';
                    return val;
                },
            },
        };

        const { Html } = Guide;

        const ds2 = new DataSet();
        const dv2 = ds2.createView().source(data2);
        dv2.transform({
            type: "fold",
            fields: 'saturation',
            // 展开字段集
            key: "city",
            // key字段
            value: "temperature" // value字段
        });
        const cols2 = {
            areaName: {
                range: [0, 1]
            }
        };
        const dd = new DataSet();
        const ddt = dd.createView().source(ddtdata);
        ddt.transform({
            type: 'fold',
            fields: 'money', // 展开字段集
            key: 'city', // key字段
            value: 'temperature', // value字段
        });
        const ddtcols = {
            dataKey: 'day',
            // day: {
            //     range: [0, 1],
            // },
        }
        const cols3 = {
            percent: {
                formatter: val => {
                    val = val * 100 + "%";
                    return val;
                }
            }
        };
        const bijiao = (num) => {
            let a = 1;
            if (num.money <= maxmoney) {

                a = 400 * num.money / maxmoney;
            } else {
                a = 1;
            }
            const style = {
                background: '#3AA1FF',
                width: a,
                height: 25,
                float: 'left',
                marginTop: 7,
                marginLeft: 11
            };
            return style;

        };
        const listItems = numbers.map((number) =>
            <Col xs={24} key={number.parkingName}>
                <span style={{ fontSize: 14, float: 'left', width: 100 }}>{number.parkingName}</span>
                <div style={bijiao(number)}></div>
                <span style={{ fontSize: 14, float: 'left', width: 50, marginLeft: 10 }}>{number.money}</span>
            </Col>
        );
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>今日数据</div>
                </div>
                <div className='page-content'>
                    <Row gutter={24}>
                        <Col xs={5}>
                            <Row gutter={24}>
                                <Col xs={24}>
                                    <Card hoverable={true}>
                                        <Row gutter={24}>
                                            <Col xs={24}>
                                                <Icon type="dollar"
                                                      style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                                <span style={{
                                                    fontSize: 14,
                                                    float: 'left',
                                                    marginLeft: 10
                                                }}>今日消费金额(元)：</span>
                                            </Col>
                                            <Col xs={24} style={{ paddingBottom: 20, paddingTop: 20 }}>
                                                <span style={{
                                                    fontSize: 28,
                                                    color: 'red',
                                                    marginLeft: 45
                                                }}>{firstdata.paidMoney}</span>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col xs={24}>
                                    <Card hoverable={true}>
                                        <Row gutter={24}>
                                            <Col xs={24}>
                                                <Icon type="pound"
                                                      style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                                <span style={{
                                                    fontSize: 14,
                                                    float: 'left',
                                                    marginLeft: 10
                                                }}>今日交易次数(笔)：</span>
                                            </Col>
                                            <Col xs={24} style={{ paddingBottom: 20, paddingTop: 20 }}>
                                                <span style={{
                                                    fontSize: 28,
                                                    color: '#6B6B6B',
                                                    marginLeft: 45
                                                }}>{firstdata.paidCount}</span>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={14}>
                            <MapofToday/>
                        </Col>
                        <Col xs={5}>
                            <Row gutter={24}>
                                <Col xs={24}>
                                    <Card hoverable={true}>
                                        <Row gutter={24}>
                                            <Col xs={24}>
                                                <Icon type="user"
                                                      style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                                <span style={{
                                                    fontSize: 14,
                                                    float: 'left',
                                                    marginLeft: 10
                                                }}>用户总数：</span>
                                            </Col>
                                            <Col xs={24} style={{ paddingBottom: 20, paddingTop: 20 }}>
                                                <span style={{
                                                    fontSize: 28,
                                                    color: 'red',
                                                    marginLeft: 45
                                                }}>{firstdata.customerCount}</span>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col xs={24}>
                                    <Card hoverable={true}>
                                        <Row gutter={24}>
                                            <Col xs={24}>
                                                <Icon type="user-add"
                                                      style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                                <span style={{
                                                    fontSize: 14,
                                                    float: 'left',
                                                    marginLeft: 10
                                                }}>新增用户：</span>
                                            </Col>
                                            <Col xs={24} style={{ paddingBottom: 20, paddingTop: 20 }}>
                                                <span
                                                    style={{
                                                        fontSize: 28,
                                                        color: '#6B6B6B',
                                                        marginLeft: 45
                                                    }}>{firstdata.customerNewCount}</span>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={5}>
                            <Card hoverable={true}>
                                <Row gutter={24}>
                                    <Col xs={24}>
                                        <Icon type="profile"
                                              style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                        <span style={{ fontSize: 14, float: 'left', marginLeft: 10 }}>今日充值金额(元)：</span>
                                    </Col>
                                    <Col xs={24} style={{ paddingBottom: 20, paddingTop: 20 }}>
                                        <span style={{
                                            fontSize: 28,
                                            color: 'red',
                                            marginLeft: 45
                                        }}>{firstdata.chargeMoney}</span>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={5}>
                            <Card hoverable={true}>
                                <Row gutter={24}>
                                    <Col xs={24}>
                                        <Icon type="file-search"
                                              style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                        <span style={{ fontSize: 14, float: 'left', marginLeft: 10 }}>今日充值次数(笔)：</span>
                                    </Col>
                                    <Col xs={24} style={{ paddingBottom: 20, paddingTop: 20 }}>
                                        <span style={{
                                            fontSize: 28,
                                            color: '#6B6B6B',
                                            marginLeft: 45
                                        }}>{firstdata.chargeCount}</span>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={4}>
                            <Card hoverable={true}>
                                <Row gutter={10}>
                                    <Col xs={24}>
                                        <Icon type="dollar" style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                        <span style={{ fontSize: 14, float: 'left', marginLeft: 10 }}>今日新增工单（张）：</span>
                                    </Col>
                                    <Col xs={24} style={{ paddingBottom: 20, paddingTop: 20 }}>
                                        <span style={{
                                            fontSize: 28,
                                            color: '#6B6B6B',
                                            marginLeft: 45
                                        }}>{firstdata.newOrderCount}</span>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={5}>
                            <Card hoverable={true}>
                                <Row gutter={24}>
                                    <Col xs={24}>
                                        <Icon type="picture"
                                              style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                        <span style={{ fontSize: 14, float: 'left', marginLeft: 10 }}>今日巡检照片(张)：</span>
                                    </Col>
                                    <Col xs={24} style={{ paddingBottom: 20, paddingTop: 20 }}>
                                        <span style={{
                                            fontSize: 28,
                                            color: '#6B6B6B',
                                            marginLeft: 45
                                        }}>{firstdata.accessWarningCount}</span>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={5}>
                            <Card hoverable={true}>
                                <Row gutter={24}>
                                    <Col xs={24}>
                                        <Icon type="eye" style={{ fontSize: '35px', color: '#08c', float: 'left' }}/>
                                        <span style={{ fontSize: 14, float: 'left', marginLeft: 10 }}>今日巡查(人次)：</span>
                                    </Col>
                                    <Col xs={24} style={{ paddingBottom: 20, paddingTop: 20 }}>
                                        <span style={{
                                            fontSize: 28,
                                            color: '#6B6B6B',
                                            marginLeft: 45
                                        }}>{firstdata.inspectCount}</span>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={12}>
                            <Card bordered={false}>
                                <span style={{ fontSize: 16 }}>今日各区消费分析</span>
                                <Table columns={columns} dataSource={data} size="middle" pagination={false}/>
                            </Card>
                        </Col>
                        <Col xs={12}>
                            <Card bordered={false}>
                                <span style={{ fontSize: 16 }}>今日消费渠道分布</span>
                                <Chart height={290} data={bzt} scale={bztcols} padding={[20, 10, 20, 100]} forceFit>
                                    <Coord type="theta" radius={0.75}/>
                                    <Axis name="percent"/>
                                    <Legend position="left"/>
                                    <Tooltip
                                        showTitle={false}
                                        itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}:{value}</li>"/>
                                    <Geom
                                        type="intervalStack"
                                        position="percent"
                                        color="payType"
                                        tooltip={[
                                            'payType*percent',
                                            (payType, percent) => {
                                                percent = _.ceil((percent * 100), 2) + '%';
                                                return {
                                                    name: payType,
                                                    value: percent,
                                                };
                                            },
                                        ]}
                                        style={{ lineWidth: 1, stroke: '#fff' }}
                                    >
                                        <Label
                                            content="percent"
                                            formatter={(val, payType) => {
                                                return payType.point.payType + ': ' + val;
                                            }}/>
                                    </Geom>
                                </Chart>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={12}>
                            <Card bordered={false}>
                                <span style={{ fontSize: 16 }}>各区停车利用率分析</span>
                                <Chart height={400} data={dv2} scale={cols2} padding={[80, 100, 80, 80]} forceFit>
                                    <Axis name="areaName"/>
                                    <Axis
                                        name="temperature"
                                        label={{
                                            formatter: val => (_.ceil((val * 100), 2) + '%')
                                        }}
                                    />
                                    <Tooltip
                                        crosshairs={{
                                            type: "y"
                                        }}
                                    />
                                    <Geom
                                        type="line"
                                        position="areaName*temperature"
                                        size={2}
                                        color={"city"}
                                        shape={"smooth"}
                                        tooltip={[
                                            'areaName*temperature',
                                            (areaName, temperature) => {
                                                temperature = _.ceil((temperature * 100), 2) + '%';
                                                return {
                                                    name: areaName,
                                                    value: temperature,
                                                };
                                            },
                                        ]}
                                        style={{ lineWidth: 1, stroke: '#fff' }}
                                    />
                                    <Geom
                                        type="point"
                                        position="areaName*temperature"
                                        size={4}
                                        shape={"circle"}
                                        color={"city"}
                                        tooltip={[
                                            'areaName*temperature',
                                            (areaName, temperature) => {
                                                temperature = _.ceil((temperature * 100), 2) + '%';
                                                return {
                                                    name: areaName,
                                                    value: temperature,
                                                };
                                            },
                                        ]}
                                        style={{
                                            stroke: "#fff",
                                            lineWidth: 1
                                        }}
                                    />
                                </Chart>
                            </Card>
                        </Col>
                        <Col xs={12}>
                            <Card bordered={false}>
                                <span style={{ fontSize: 16 }}>今日路内车场收入TOP 8</span>
                                {listItems.length==0?(<Card bordered={false} loading={listItems.length==0}>
                                </Card>):''}

                                <Row gutter={24} style={{ marginTop: 20 }}>
                                    {listItems}

                                </Row>
                            </Card>
                        </Col>
                    </Row>


                    <Row gutter={24}>
                        <Col xs={24}>
                            <Card bordered={false}>
                                <span style={{ fontSize: 16 }}>近30天平台收入变化趋势</span>
                                <Chart height={400} data={ddt} scale={ddtcols} forceFit>
                                    <Axis name="date"/>
                                    <Axis name="temperature" label={{ formatter: val => `${val}` }}/>
                                    <Tooltip crosshairs={{ type: 'y' }}/>
                                    <Geom type="line" position="day*temperature" size={2} color={'city'}
                                          style={{ stroke: '#fff', lineWidth: 1 }}
                                          shape={"smooth"}
                                          tooltip={[
                                              'day*temperature',
                                              (day, temperature) => {
                                                  temperature = temperature;
                                                  return {
                                                      name: "收入",
                                                      value: temperature,
                                                  };
                                              },
                                          ]}
                                    />
                                    <Geom
                                        type="point"
                                        position="day*temperature"
                                        size={4}
                                        shape={'circle'}
                                        color={'city'}
                                        tooltip={[
                                            'day*temperature',
                                            (day, temperature) => {
                                                temperature = temperature;
                                                return {
                                                    name: "收入",
                                                    value: temperature,
                                                };
                                            },
                                        ]}

                                    />
                                </Chart>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
