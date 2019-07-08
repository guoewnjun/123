import React, {Component} from 'react';
import {Card, Row, Col, DatePicker, Button, Radio, Spin, message} from 'antd';
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
    constructor(props) {
        super(props);
        this.payLoad = {
            startTime: moment().subtract(30, 'day').format('YYYY-MM-DD'),
            endTime: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        }
    }

    state = {
        spinning: true,
        currentTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        todayData: {
            "parkWarnTimes": '',
            "parkWarnDisposedTimes": '',
            "invalidReportTimes": '',
            "validReportTimes": '',
            "printOrderTimes": ''
        }, //今日数据概览
        patrolPolyLineType: 'noPayCount',
        parkingAbnormalType: [],
        topDisposer: [],
        parkingAbnormalDispose: [],
        parkingAbnormalAnalysis: [],
        statisticsData: [], //统计数据
        endDay: moment().subtract(1, 'day'),
        startDay: moment().subtract(30, 'day'),
    };

    componentWillMount() {

    }

    componentDidMount() {
        HttpClient.query('/parking-report/data/parkWarn/todayOverview', 'GET', { curDate: this.state.currentTime }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data;
                if (data) {
                    this.setState({
                        todayData: data
                    })
                }
            }
        });
        this.getHistoryData();
    }

    componentWillUnmount() {

    }

    getHistoryData() {
        this.setState({
            spinning: true
        });
        // 违停告警类型
        HttpClient.query('/parking-report/data/parkWarn/parkwarnDistribute', 'GET', this.payLoad, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data || [];
                this.setState({
                    parkingAbnormalType: data
                })
            }
        });
        // 告警处理排行TOP10
        HttpClient.query('/parking-report/data/parkWarn/parkwarnTopDisposer', 'GET', this.payLoad, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data || [];
                this.setState({
                    topDisposer: data
                })
            }
        });
        // 违停处理
        HttpClient.query('/parking-report/data/parkWarn/parkwarnResult', 'GET', this.payLoad, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data || [];
                this.setState({
                    parkingAbnormalDispose: data
                })
            }
        });
        // 各区违停指数分析
        HttpClient.query('/parking-report/data/parkWarn/analysis/area', 'GET', this.payLoad, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data || [];
                this.setState({
                    parkingAbnormalAnalysis: data
                })
            }
        });
        // 每日统计
        HttpClient.query('/parking-report/data/parkWarn/times', 'GET', this.payLoad, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data || [];
                this.setState({
                    statisticsData: data
                })
            }
            this.setState({
                spinning: false
            })
        });
    }

    // 日期变化
    onDateChange(dates, dateStrings) {
        this.setState({
            startDay: dates[0],
            endDay: dates[1]
        });
        this.payLoad.startTime = dateStrings[0];
        this.payLoad.endTime = dateStrings[1];
    }

    handleRadioChange(e) {
        this.setState({
            patrolPolyLineType: e.target.value
        })
    }

    search() {
        if (parseInt(moment(this.state.endDay - this.state.startDay).format('DDD')) > 30) {
            message.warning('选择的日期间隔不得大于30天， 请重新选择');
            return
        }
        this.getHistoryData()
    }

    render() {
        const {
            spinning, endDay, startDay, currentTime, todayData, patrolPolyLineType, parkingAbnormalType, topDisposer,
            parkingAbnormalDispose, parkingAbnormalAnalysis, statisticsData
        } = this.state;
        const { RangePicker } = DatePicker;
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>巡检报表</div>
                </div>
                <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                    <Card title={`今日巡检概况（截止至${currentTime}）`}>
                        <Row gutter={40}>
                            <Col span={4} className='todayFinancial'>
                                <div>违停告警次数</div>
                                <span>{todayData.parkWarnTimes}</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>告警处理次数</div>
                                <span>{todayData.parkWarnDisposedTimes}</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>误报次数</div>
                                <span>{todayData.invalidReportTimes}</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>告警成立数</div>
                                <span>{todayData.validReportTimes}</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>贴条数</div>
                                <span>{todayData.printOrderTimes}</span>
                            </Col>
                        </Row>
                    </Card>
                    <Spin spinning={spinning} tip='加载中...'>
                        <Card title='历史巡检数据'>
                            <Row gutter={40} style={{ marginBottom: 20 }}>
                                <Col span={8}>
                                    <RangePicker style={{ width: '100%' }}
                                                 allowClear={false}
                                                 defaultValue={[moment().subtract(30, 'day'), moment().subtract(1, 'day')]}
                                                 disabledDate={(current) => current > moment().startOf('day')}
                                                 onChange={this.onDateChange.bind(this)}
                                                 ranges={{
                                                     '近7天': [moment().subtract(7, 'day'), moment().subtract(1, 'day')],
                                                     '近30天': [moment().subtract(30, 'day'), moment().subtract(1, 'day')],
                                                 }}/>
                                </Col>
                                <Col span={8}>
                                    <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                                </Col>
                            </Row>
                            <div className='dashedStyle'/>
                            <Row gutter={40} style={{ marginTop: 20 }}>
                                <Col style={{ fontSize: 20 }}>
                                    每日违停告警次数统计
                                </Col>
                            </Row>
                            <Row gutter={40} style={{ marginTop: 20 }}>
                                <Col>
                                    <Radio.Group defaultValue="noPayCount" buttonStyle="solid"
                                                 onChange={this.handleRadioChange.bind(this)}>
                                        <Radio.Button value="noPayCount">未交费停车</Radio.Button>
                                        <Radio.Button value="crossSpaceCount">跨泊位停车</Radio.Button>
                                        <Radio.Button value="reverseParkCount">逆向停车</Radio.Button>
                                        <Radio.Button value="forbiddenTimeCount">禁停时段停车</Radio.Button>
                                        <Radio.Button value="blackListCount">黑名单禁停区停车</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            <Row gutter={40} style={{ marginTop: 20 }}>
                                <Col>
                                    <PatrolPolyline type={patrolPolyLineType} title='每日缴费金额统计' data={statisticsData}
                                                    startDay={startDay} endDay={endDay}/>
                                </Col>
                            </Row>
                            <div className='dashedStyle'/>
                            <Row gutter={40} style={{ marginTop: 40 }}>
                                <Col span={12}>
                                    <IllegalParkingAlarmType title='违停告警类型' data={parkingAbnormalType}/>
                                </Col>
                                <Col span={12}>
                                    <AlarmHandleRanking title='告警处理排行TOP10' data={topDisposer || []}/>
                                </Col>
                            </Row>
                            <div className='dashedStyle'/>
                            <Row gutter={40} style={{ marginTop: 40 }}>
                                <Col span={12}>
                                    <IllegalParkingTreatment title='违停处理' data={parkingAbnormalDispose}/>
                                </Col>
                                <Col span={12}>
                                    <AnalysisIllegalParking title='各区违停指数分析' data={parkingAbnormalAnalysis}/>
                                </Col>
                            </Row>
                            <div className='dashedStyle'/>
                            <Row gutter={40} style={{ marginTop: 40 }}>
                                <Col>
                                    <DailyIllegalParkingStatistics title='每日违停统计' data={statisticsData}/>
                                </Col>
                            </Row>
                        </Card>
                    </Spin>
                </div>
            </div>
        );
    }
}

export default PatrolReport;
