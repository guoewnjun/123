import React, {Component} from 'react';
import {Card, Row, Col, DatePicker, Cascader, Button, Radio, Spin, message} from 'antd';
import {HttpClient} from "@/common/HttpClient";
import moment from 'moment';
import './index.css';
import DatePayment from './components/DatePayment';
import AreaPayment from './components/AreaPayment';
import AreaPaymentTable from './components/AreaPaymentTable';
import _ from "lodash";

class FinancialReport extends Component {

    constructor(props) {
        super(props);
        this.url = '/parking-report/report/road/center/finance/history/fee';
        this.payLoad = {
            city: window.cityCode,
            beginDate: moment().subtract(30, 'day').format('YYYY-MM-DD'),
            endDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        }
    }

    state = {
        spinning: true,
        cascaderOptions: [],
        financeToday: null,
        financeHistory: null,
        tableData: [],
        dayList: [], //每日图表统计
        areaList: [], //区域图表统计
        AreaPaymentTableTitle: {
            money: '缴费金额',
            count: '缴费次数'
        },
        DatePaymentTitle: '每日缴费金额统计',
        AreaPaymentTitle: '区域缴费金额统计',
        startDay: moment().subtract(30, 'day'),
        endDay: moment().subtract(1, 'day'),
    };

    componentWillMount() {

    }

    componentDidMount() {
        // 获取市区级联数据
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/monitoringCenter/${window.cityCode}/getPersonAttendance`, 'GET', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data ? [d.data] : [];
                this.setState({
                    cascaderOptions: data
                })
            }
        });
        // 获取账务报表-今日财务
        HttpClient.query(`/parking-report/report/road/center/finance/today`, 'GET', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data || null;
                this.setState({
                    financeToday: data
                })
            }
        });
        this.getHistoryTotalReportData();
    }

    getHistoryTotalReportData() {
        // 账务报表-历史统计-总计
        HttpClient.query(`/parking-report/report/road/center/finance/history`, 'GET', {
            city: window.cityCode,
            ...this.filterParams(this.payLoad)
        }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data || null;
                this.setState({
                    financeHistory: data
                })
            }
        });
        // 账务报表-历史统计-缴费
        this.getHistoryPay();
    }

    // 账务报表-历史统计
    getHistoryPay() {
        this.setState({
            spinning: true,
        });
        HttpClient.query(this.url, 'GET', this.filterParams(this.payLoad), (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data || null;
                if (data.dayAreaList) {
                    data.dayAreaList.forEach((city) => {
                        city.key = `${city.day}${city.id}`;
                        if (city.subAreaList) {
                            city.subAreaList.forEach((subArea) => {
                                subArea.key = `${city.day}${subArea.id}`
                            })
                        }
                    })
                }
                this.setState({
                    tableData: data.dayAreaList,
                    dayList: data.dayList || [],
                    areaList: data.areaList || []
                })
            }
            this.setState({
                spinning: false
            })
        });
    }

    filterParams(params) {
        const newParams = {};
        _.forIn(params, (value, key) => {
            if (value || value === 0) {
                newParams[key] = value
            }
        });
        return newParams
    }

    componentWillUnmount() {

    }

    // 日期变化
    onDateChange(dates, dateStrings) {
        this.payLoad.beginDate = dateStrings[0];
        this.payLoad.endDate = dateStrings[1];
        this.setState({
            startDay: dates[0],
            endDay: dates[1]
        })
    }

    radioChange(e) {
        const value = e.target.value;
        switch (value) {
            case 'a':
                this.setState({
                    AreaPaymentTableTitle: {
                        money: '缴费金额',
                        count: '缴费次数'
                    },
                    DatePaymentTitle: '每日缴费金额统计',
                    AreaPaymentTitle: '区域缴费金额统计',
                });
                this.url = '/parking-report/report/road/center/finance/history/fee';
                this.getHistoryPay();
                break;
            case 'b':
                this.setState({
                    AreaPaymentTableTitle: {
                        money: '退费金额',
                        count: '退费次数'
                    },
                    DatePaymentTitle: '每日退费金额统计',
                    AreaPaymentTitle: '区域退费金额统计',
                });
                this.url = '/parking-report/report/road/center/finance/history/refund';
                this.getHistoryPay();
                break;
            case 'c':
                this.setState({
                    AreaPaymentTableTitle: {
                        money: '欠费金额',
                        count: '欠费次数'
                    },
                    DatePaymentTitle: '每日欠费金额统计',
                    AreaPaymentTitle: '区域欠费金额统计',
                });
                this.url = '/parking-report/report/road/center/finance/history/arrearage';
                this.getHistoryPay();
                break;
            default:
                break;
        }
    }

    search() {
        if (parseInt(moment(this.state.endDay - this.state.startDay).format('DDD')) > 30) {
            message.warning('选择的日期间隔不得大于30天， 请重新选择');
            return
        }
        this.getHistoryTotalReportData();
    }

    render() {
        const { cascaderOptions, financeToday, financeHistory, spinning, areaList, dayList, tableData, AreaPaymentTableTitle,
            DatePaymentTitle, AreaPaymentTitle, startDay, endDay } = this.state;
        const { RangePicker } = DatePicker;
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>财务报表</div>
                </div>
                <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                    <Spin spinning={spinning} tip='加载中...'>
                        <Card title='今日财务概况'>
                            {
                                financeToday && (
                                    <Row gutter={40}>
                                        <Col span={4} className='todayFinancial'>
                                            <div>今日缴费金额</div>
                                            <span>{financeToday.parkPayMoney}元</span>
                                        </Col>
                                        <Col span={4} className='todayFinancial'>
                                            <div>今日缴费笔数</div>
                                            <span>{financeToday.parkPayCount}</span>
                                        </Col>
                                        <Col span={4} className='todayFinancial'>
                                            <div>今日退费金额</div>
                                            <span>{financeToday.parkRefundMoney}元</span>
                                        </Col>
                                        <Col span={4} className='todayFinancial'>
                                            <div>今日退费笔数</div>
                                            <span>{financeToday.parkRefundCount}</span>
                                        </Col>
                                        <Col span={4} className='todayFinancial'>
                                            <div>今日欠费金额</div>
                                            <span>{financeToday.parkArrearageMoney}元</span>
                                        </Col>
                                        <Col span={4} className='todayFinancial'>
                                            <div>今日欠费笔数</div>
                                            <span>{financeToday.parkArrearageCount}</span>
                                        </Col>
                                    </Row>
                                )
                            }
                        </Card>
                        <Card title='历史财务数据'>
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
                                    <Cascader style={{ width: '100%' }} changeOnSelect options={cascaderOptions}
                                              defaultValue={[parseInt(window.cityCode)]}
                                              allowClear={false}
                                              onChange={(value) => {
                                                  const districtInfo = ['city', 'area', 'subArea'];
                                                  if (value) {
                                                      value.forEach((item, index) => {
                                                          this.payLoad[districtInfo[index]] = item
                                                      })
                                                  }
                                              }}
                                              fieldNames={{ label: 'name', value: 'id', children: 'children' }}/>
                                </Col>
                                <Col span={8}>
                                    <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                                </Col>
                            </Row>
                            {
                                financeHistory && (
                                    <Row gutter={40} style={{ marginBottom: 20 }}>
                                        <Col span={4} className='todayFinancial'>
                                            <div>缴费总金额</div>
                                            <span>{financeHistory.parkPayMoney}元</span>
                                        </Col>
                                        <Col span={4} className='todayFinancial'>
                                            <div>缴费总笔数</div>
                                            <span>{financeHistory.parkPayCount}</span>
                                        </Col>
                                        <Col span={4} className='todayFinancial'>
                                            <div>退费总金额</div>
                                            <span>{financeHistory.parkRefundMoney}元</span>
                                        </Col>
                                        <Col span={4} className='todayFinancial'>
                                            <div>退费总笔数</div>
                                            <span>{financeHistory.parkRefundCount}</span>
                                        </Col>
                                        <Col span={4} className='todayFinancial'>
                                            <div>欠费总金额</div>
                                            <span>{financeHistory.parkArrearageMoney}元</span>
                                        </Col>
                                        <Col span={4} className='todayFinancial'>
                                            <div>欠费总笔数</div>
                                            <span>{financeHistory.parkArrearageCount}</span>
                                        </Col>
                                    </Row>
                                )
                            }
                            <div className='dashedStyle'/>
                            <Row gutter={40} style={{ marginTop: 20 }}>
                                <Col>
                                    <Radio.Group defaultValue="a" buttonStyle="solid"
                                                 onChange={(e) => this.radioChange(e)}>
                                        <Radio.Button value="a">缴费金额</Radio.Button>
                                        <Radio.Button value="b">退费金额</Radio.Button>
                                        <Radio.Button value="c">欠费金额</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            <Row gutter={40} style={{ marginTop: 20 }}>
                                <Col>
                                    <DatePayment dayList={dayList} DatePaymentTitle={DatePaymentTitle} startDay={startDay} endDay={endDay}/>
                                </Col>
                            </Row>
                            <Row gutter={40}>
                                <Col>
                                    <AreaPayment areaList={areaList} AreaPaymentTitle={AreaPaymentTitle}/>
                                </Col>
                            </Row>
                            <Row gutter={40}>
                                <Col>
                                    <AreaPaymentTable AreaPaymentTableTitle={AreaPaymentTableTitle}
                                                      dataSource={tableData}/>
                                </Col>
                            </Row>
                        </Card>
                    </Spin>
                </div>
            </div>
        );
    }
}

export default FinancialReport;
