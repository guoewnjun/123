import React, {Component} from 'react';
import {Card, Row, Col, DatePicker, Cascader, Button, Radio} from 'antd';
import {HttpClient} from "@/common/HttpClient";
import moment from 'moment';
import './index.css';
import DatePayment from './components/DatePayment';
import AreaPayment from './components/AreaPayment';

class FinancialReport extends Component {

    state = {
        CascaderOptions: [],
    };

    componentWillMount() {

    }

    componentDidMount() {
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/monitoringCenter/${window.cityCode}/getPersonAttendance`, 'GET', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data ? [d.data] : [];
                this.setState({
                    CascaderOptions: data
                })
            }
        })
    }

    componentWillUnmount() {

    }

    onDateChange(dates, dateStrings) {
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    }

    render() {
        const { CascaderOptions } = this.state;
        const { RangePicker } = DatePicker;
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>财务报表</div>
                </div>
                <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                    <Card title='今日财务概况'>
                        <Row gutter={40}>
                            <Col span={4} className='todayFinancial'>
                                <div>今日缴费金额</div>
                                <span>18,290元</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>今日缴费笔数</div>
                                <span>1890</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>今日退费金额</div>
                                <span>290元</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>今日退费笔数</div>
                                <span>190元</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>今日欠费金额</div>
                                <span>180元</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>今日欠费笔数</div>
                                <span>10</span>
                            </Col>
                        </Row>
                    </Card>
                    <Card title='历史停车数据'>
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
                                <Cascader style={{ width: '100%' }} changeOnSelect options={CascaderOptions}
                                          placeholder='请选择'
                                          fieldNames={{ label: 'name', value: 'id', children: 'children' }}/>
                            </Col>
                            <Col span={8}>
                                <Button type='primary'>查询</Button>
                            </Col>
                        </Row>
                        <Row gutter={40} style={{marginBottom: 20}}>
                            <Col span={4} className='todayFinancial'>
                                <div>缴费总金额</div>
                                <span>18,290元</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>缴费总笔数</div>
                                <span>18,290元</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>退费总金额</div>
                                <span>18,290元</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>退费总笔数</div>
                                <span>190</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>欠费总金额</div>
                                <span>1520元</span>
                            </Col>
                            <Col span={4} className='todayFinancial'>
                                <div>欠费总笔数</div>
                                <span>90</span>
                            </Col>
                        </Row>
                        <div className='dashedStyle'/>
                        <Row gutter={40} style={{marginTop: 20}}>
                            <Col>
                                <Radio.Group defaultValue="a" buttonStyle="solid">
                                    <Radio.Button value="a">缴费金额</Radio.Button>
                                    <Radio.Button value="b">退费金额</Radio.Button>
                                    <Radio.Button value="c">欠费金额</Radio.Button>
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row gutter={40} style={{marginTop: 20}}>
                            <Col>
                                <DatePayment/>
                            </Col>
                        </Row>
                        <Row gutter={40}>
                            <Col>
                                <AreaPayment/>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        );
    }
}

export default FinancialReport;
