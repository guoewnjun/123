import React, {Component} from 'react';
import {Button, Card, Row, Col, Table, DatePicker} from 'antd';
import moment from "moment";
import upload_png from '@static/images/upload.png';

class UserDetail extends Component {

    state = {
        dataSource: [],
        currentMonth: moment().format('YYYY-MM'),
        id: this.props.location.query.id || '',
    };

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    // 选择月份
    monthChange(date, dateString) {
        this.setState({
            loading: true,
            currentMonth: dateString
        }, () => {
            // 获取稽查组单月月排班日历信息
            // this.getCalendar();
        });
    }

    render() {
        const { dataSource, currentMonth } = this.state;
        const { MonthPicker } = DatePicker;
        const columns = [];
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>
                        人员详情
                        <Button type='primary' style={{ float: 'right' }} onClick={() => {
                            location.hash = '/Home/Visualization'
                        }}>返回</Button>
                    </div>
                </div>
                <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                    <Card title='基础信息' className='detail-card'>
                        <Row gutter={30}>
                            <Col span={8} style={{ display: 'flex' }}>
                                <img src={upload_png} alt='' style={{ width: 70, height: 70 }}/>
                                <div style={{ marginLeft: 30, flexGrow: 1 }}>
                                    <div>
                                        <span style={{ width: 50 }}>张三</span>
                                        <span style={{
                                            background: 'rgb(0,204,51)',
                                            padding: '1px 5px',
                                            width: 80,
                                            fontSize: '12px',
                                            marginLeft: 20,
                                            color: 'white'
                                        }}>启用中</span>
                                    </div>
                                    <div>1235649841</div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div>今日上传照片数：<span style={{ color: '#1890ff' }}>18张</span></div>
                                <div>当前排班：<span style={{ color: '#1890ff' }}>早班</span></div>
                            </Col>
                        </Row>
                        <div className='dashedStyle'/>
                        <Row gutter={30} style={{ marginTop: 20 }}>
                            <Col span={8} className='detail-card-col'>
                                <label>中队：</label>
                                <span>南山中队</span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>巡查组：</label>
                                <span>西丽查询组</span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>部门：</label>
                                <span>南山运营部</span>
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col span={8} className='detail-card-col'>
                                <label>角色：</label>
                                <span>稽查员</span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>工号：</label>
                                <span>1006</span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>性别：</label>
                                <span>男</span>
                            </Col>
                        </Row>
                    </Card>
                    <Card title='排班巡检' className='detail-card'>
                        <Row>
                            <MonthPicker onChange={this.monthChange.bind(this)}
                                         value={moment(currentMonth, 'YYYY-MM')}
                                         allowClear={false}
                                         defaultValue={moment().month('YYYY-MM')}/>
                        </Row>
                        <Table columns={columns} dataSource={dataSource}/>
                    </Card>
                </div>
            </div>
        );
    }
}

export default UserDetail;
