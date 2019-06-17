import React, {Component} from 'react';
import {Button, Card, Row, Col, Table, DatePicker, Spin} from 'antd';
import moment from "moment";
import upload_png from '@static/images/upload.png';
import {HttpClient} from "@/common/HttpClient";

class UserDetail extends Component {

    state = {
        spinning: false,
        dateInfos: [],//表头日历信息
        dataSource: [],
        currentMonth: moment().format('YYYY-MM'),
        id: this.props.location.query.id || 0,
        userInfo: null,
    };

    componentWillMount() {

    }

    componentDidMount() {
        if (this.state.id) {
            HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/monitoringCenter/${this.state.id}/inspectionMemberInfo`, "GET", null, (d, type) => {
                if (type === HttpClient.requestSuccess) {
                    const data = d.data;
                    this.setState({
                        userInfo: data
                    })
                }
            });
            this.getCalendar();
        }
    }

    // 获取稽员组单月月排班日历信息
    getCalendar() {
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/inspection/schedule/manage/inspector/month/calendar`, 'GET', {
            inspectionGroupId: this.state.inspectionGroupId,
            workMonth: this.state.currentMonth
        }, this.handleQuery.bind(this));
    }

    // 获得表格数据data
    initialPayload() {
        // 获取稽查组所有人员单月排班信息
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/inspection/schedule/manage/inspector/month`, 'GET', {
            inspectionGroupId: this.state.inspectionGroupId,
            workMonth: this.state.currentMonth
        }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                //成功-------在这里做你的数据处理
                const memberInfos = d.data;
                let tbdata = [];
                let tbobj = {};
                tbobj['name'] = memberInfos.groupMemberName;
                tbobj['groupMemberId'] = memberInfos.groupMemberId;
                memberInfos.workScheduleDates.forEach(workItem => {
                    tbobj[workItem.workDate.split('-')[2]] = workItem.workTypes;
                });
                tbdata.push(tbobj);
                // console.log(tbdata);
                this.setState({
                    dataSource: tbdata,
                });
            } else {
                //失败----做除了报错之外的操作
            }
        });
    }

    // 处理请求回调
    handleQuery(d, type) {
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            const data = d.data;
            this.setState({
                dateInfos: data.dateInfos, //表头日历信息
            });
            // 获得表格数据data
            this.initialPayload()
        } else {
            //失败----做除了报错之外的操作
            this.setState({
                loading: false,
            })
        }
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
        const workTypeEnum = ['早班', '中班', '晚班', '全天', '休息'];
        const { dataSource, dateInfos, currentMonth, userInfo } = this.state;
        const { MonthPicker } = DatePicker;

        let col = [];
        // 组合列
        if (dataSource.length > 0) {
            dateInfos.forEach((dateInfosItem) => {
                let data = {
                    title: () => (
                        <div className='customTableTitle' style={{
                            color: dateInfosItem.dateStatus == 1 ? 'red' : '',
                            border: moment().isSame(dateInfosItem.date, 'day') ? '1px solid rgba(24, 144, 255, 0.75)' : ''
                        }}>
                            <div>{dateInfosItem.date.split('-')[2]}</div>
                            <div style={{ fontSize: '12px' }}>{dateInfosItem.weekDay.split('')[1]}</div>
                        </div>
                    ),
                    dataIndex: dateInfosItem.date.split('-')[2],
                    render: (text, record, index) => {
                        const elem = moment().isBefore(dateInfosItem.date, 'day') ? (
                            <div style={{ backgroundColor: text && text.length === 0 ? 'white' : '' }}
                                 className={text && text.indexOf(4) === -1 ? 'scheduleText' : 'scheduleText afterTodayRestScheduleText'}
                            >
                                {
                                    text && text.map(textItem => (
                                        <div key={textItem}>{workTypeEnum[textItem]}</div>))
                                }
                            </div>
                        ) : (
                            <div style={{ backgroundColor: text && text.length === 0 ? '#fafafa' : '' }}
                                 className={text && text.indexOf(4) === -1 ? 'scheduleText overdueSchedule' : 'scheduleText restScheduleText'}
                            >
                                {
                                    text && text.map(textItem => <div key={textItem}>{workTypeEnum[textItem]}</div>)
                                }
                            </div>
                        );
                        return elem;
                    },
                    className: 'schedule',
                    align: 'center',
                    width: 43,
                };
                col.push(data)
            });
        }
        const columns = [
            {
                title: () => (<label>姓名</label>),
                dataIndex: 'name',
                align: 'center',
                className: 'inspectorTD',
                render: (text, record, index) => (
                    <div className='inspector'>{text}</div>
                )
            },
            ...col
        ];

        if (!userInfo) {
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
                    <div className='page-content'>
                        <Spin spinning={true} tip='加载中...'/>
                    </div>
                </div>
            )
        }
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
                                        <span style={{ width: 50 }}>{userInfo.name}</span>
                                        <span style={{
                                            background: userInfo.isLoginTerminal ? 'rgb(0,204,51)' : 'rgb(153,153,153)',
                                            padding: '1px 5px',
                                            width: 80,
                                            fontSize: '12px',
                                            marginLeft: 20,
                                            color: 'white'
                                        }}>{userInfo.isLoginTerminal ? '启用中' : '已下线'}</span>
                                    </div>
                                    <div>{userInfo.mobile}</div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div>今日上传照片数：<span style={{ color: '#1890ff' }}>{userInfo.uploadPhotoCount}张</span>
                                </div>
                                <div>当前排班：<span style={{ color: '#1890ff' }}>
                                    {
                                        userInfo.workType.map(item => `${workTypeEnum[item]}、`)
                                    }
                                </span></div>
                            </Col>
                        </Row>
                        <div className='dashedStyle'/>
                        <Row gutter={30} style={{ marginTop: 20 }}>
                            <Col span={8} className='detail-card-col'>
                                <label>中队：</label>
                                <span>{userInfo.clusterName}</span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>巡查组：</label>
                                <span>{userInfo.inspectionName}</span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>部门：</label>
                                <span>{userInfo.departmentName}</span>
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col span={8} className='detail-card-col'>
                                <label>角色：</label>
                                <span>{userInfo.role}</span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>工号：</label>
                                <span>{userInfo.clusterName}</span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>性别：</label>
                                <span>{userInfo.gender}</span>
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
                        <Table style={{marginTop: 20}} columns={columns} dataSource={dataSource} bordered pagination={false} rowKey={(record) => record.groupMemberId}/>
                    </Card>
                </div>
            </div>
        );
    }
}

export default UserDetail;
