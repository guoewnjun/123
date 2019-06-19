import React, {Component} from 'react';
import {Card, Row, Col, DatePicker, Button, Radio} from 'antd';
import {HttpClient} from "@/common/HttpClient";
import moment from 'moment';
import './index.css';
import PatrolPolyline from "./components/PatrolPolyline";
import IllegalParkingAlarmType from "./components/IllegalParkingAlarmType";
import AlarmHandleRanking from './components/AlarmHandleRanking';
import IllegalParkingTreatment from './components/IllegalParkingTreatment';
import AnalysisIllegalParking from './components/AnalysisIllegalParking';
import DailyIllegalParkingStatistics from './components/DailyIllegalParkingStatistics';


class PatrolReport extends Component {

    state = {
    };

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        const { RangePicker } = DatePicker;
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>巡检报表</div>
                </div>
                <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                    <Card title='今日巡检概况（截至2019-06-03  11:22:16）'>
                        <Row gutter={40}>
                            <Col span={4} className='todayFinancial'>
                                <div>违停告警次数</div>
                                <span>18,290元</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>告警处理次数</div>
                                <span>1890</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>误报次数</div>
                                <span>290元</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>告警成立数</div>
                                <span>190元</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>贴条数</div>
                                <span>180元</span>
                            </Col>
                        </Row>
                    </Card>
                    <Card title='历史巡检数据'>
                        <Row gutter={40} style={{marginBottom: 20}}>
                            <Col span={8}>
                                <RangePicker style={{ width: '100%' }}
                                             disabledDate={(current) => current > moment().startOf('day')}
                                             ranges={{
                                                 '近一周': [moment().startOf('week'), moment().endOf('week')],
                                                 '近一月': [moment().date(-30).startOf('day'), moment().date(0).endOf('day')],
                                             }}/>
                            </Col>
                            <Col span={8}>
                                <Button type='primary'>查询</Button>
                            </Col>
                        </Row>
                        <div className='dashedStyle'/>
                        <Row gutter={40} style={{marginTop: 20}}>
                            <Col style={{fontSize: 20}}>
                                每日违停告警次数统计
                            </Col>
                        </Row>
                        <Row gutter={40} style={{marginTop: 20}}>
                            <Col>
                                <Radio.Group defaultValue="a" buttonStyle="solid">
                                    <Radio.Button value="a">未交费停车</Radio.Button>
                                    <Radio.Button value="b">跨泊位停车</Radio.Button>
                                    <Radio.Button value="c">逆向停车</Radio.Button>
                                    <Radio.Button value="d">禁停时段停车</Radio.Button>
                                    <Radio.Button value="e">黑名单禁停区停车</Radio.Button>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row gutter={40} style={{marginTop: 20}}>
                            <Col>
                                <PatrolPolyline/>
                            </Col>
                        </Row>
                        <div className='dashedStyle'/>
                        <Row gutter={40} style={{marginTop: 40}}>
                            <Col span={12}>
                                <IllegalParkingAlarmType/>
                            </Col>
                            <Col span={12}>
                                <AlarmHandleRanking/>
                            </Col>
                        </Row>
                        <div className='dashedStyle'/>
                        <Row gutter={40} style={{marginTop: 40}}>
                            <Col span={12}>
                                <IllegalParkingTreatment/>
                            </Col>
                            <Col span={12}>
                                <AnalysisIllegalParking/>
                            </Col>
                        </Row>
                        <div className='dashedStyle'/>
                        <Row gutter={40} style={{marginTop: 40}}>
                            <Col>
                                <DailyIllegalParkingStatistics />
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        );
    }
}

export default PatrolReport;
