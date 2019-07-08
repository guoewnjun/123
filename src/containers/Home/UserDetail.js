import React, {Component} from 'react';
import {Button, Card, Row, Col, Table, DatePicker, Spin} from 'antd';
import moment from "moment";
import upload_png from '@static/images/upload.png';
import {HttpClient} from "@/common/HttpClient";

class UserDetail extends Component {

    constructor(props) {
        super(props);
        this.clickCellDate = undefined;
        this.map = undefined;
        this.polyline = undefined;
        this.car = undefined;
        this.lineArr = [];
    }

    state = {
        tableLoading: false,
        spinning: false,
        dateInfos: [],//表头日历信息
        dataSource: [],
        currentMonth: moment().format('YYYY-MM'),
        id: this.props.location.query.id || 0,
        userInfo: null,
        showMap: false,
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

    // 获取稽员组单月月排班日历信息，表格头部信息
    getCalendar() {
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/inspection/schedule/manage/member/month/calendar`, 'GET', {
            inspectionMemId: this.state.id,
            inspectionGroupId: this.state.inspectionGroupId,
            workMonth: this.state.currentMonth
        }, this.handleQuery.bind(this));
    }

    // 获得表格数据data
    initialPayload() {
        // 获取稽查组所有人员单月排班信息
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/monitoringCenter/${this.state.id}/inspectionMemberSchedule`, 'GET', {
            year: this.state.currentMonth.split('-')[0],
            month: this.state.currentMonth.split('-')[1]
        }, (d, type) => {
            this.setState({
                tableLoading: false,
            });
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
                dateInfos: data || [], //表头日历信息
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
            currentMonth: dateString,
            tableLoading: true,
            dataSource: []
        }, () => {
            // 获取稽查组单月月排班日历信息
            this.getCalendar();
        });
    }

    onHeadCellClick(column) {
        this.clickCellDate = `${moment().format('YYYY-MM')}-${column.key}`;
        console.log(this.clickCellDate);
        this.setState({
            showMap: true
        }, () => {
            this.map = new window.AMap.Map('map', {
                resizeEnable: true,
                // zoom: 11,
                showIndoorMap: true
            });
            const params = {};
            HttpClient.query(`easy-mock/monitoringCenter/moveSpot`, 'GET', params, (d, type) => {
                if (type === HttpClient.requestSuccess) {
                    let lineArr = [];
                    const data = d.data;
                    data.forEach((item, index) => {
                        new window.AMap.Text({
                            text: `${item.reportTime}`,
                            map: this.map,
                            position: new window.AMap.LngLat(item.reportLongitude, item.reportLatitude)
                        });
                        if (index === 0) {
                            this.car = new window.AMap.Marker({
                                map: this.map,
                                icon: "https://webapi.amap.com/images/car.png",
                                offset: new window.AMap.Pixel(-26, -13),
                                autoRotation: true,
                                angle: -90,
                                position: new window.AMap.LngLat(item.reportLongitude, item.reportLatitude)
                            });
                        } else if (index === data.length - 1) {
                            new window.AMap.Marker({
                                map: this.map,
                                icon: 'https://webapi.AMap.com/theme/v1.3/markers/n/mark_r.png',
                                position: new window.AMap.LngLat(item.reportLongitude, item.reportLatitude)
                            });
                        }
                        lineArr.push([item.reportLongitude, item.reportLatitude])
                    });
                    this.lineArr = lineArr;
                    this.polyline = new window.AMap.Polyline({
                        map: this.map,
                        path: lineArr,            // 设置线覆盖物路径
                        strokeColor: '#3366FF',   // 线颜色
                        strokeOpacity: 1,         // 线透明度
                        strokeWeight: 6,          // 线宽
                        strokeStyle: 'solid',     // 线样式
                        strokeDasharray: [10, 5], // 补充线样式
                        // geodesic: true,            // 绘制大地线
                        showDir: true,
                    });
                    const passedPolyline = new window.AMap.Polyline({
                        map: this.map,
                        showDir: true,
                        strokeColor: "#AF5",  //线颜色
                        strokeWeight: 6,      //线宽
                    });
                    this.car.on('moving', function (e) {
                        passedPolyline.setPath(e.passedPath);
                    });
                    this.map.setFitView();
                }
            })
        })
    }

    startAnimation() {
        this.car.moveAlong(this.lineArr, 2000);
    }

    pauseAnimation() {
        this.car.pauseMove();
    }

    resumeAnimation() {
        this.car.resumeMove();
    }

    stopAnimation() {
        this.car.stopMove();
    }

    render() {
        const workTypeEnum = ['早班', '中班', '晚班', '全天', '休息'];
        const { dataSource, dateInfos, currentMonth, userInfo, tableLoading, showMap } = this.state;
        const { MonthPicker } = DatePicker;

        let col = [];
        // 组合列
        if (dateInfos.length > 0) {
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
                    onHeaderCell: (column) => {
                        return {
                            onClick: () => {
                                this.onHeadCellClick(column)
                            }, // 点击表头cell
                        };
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
                        {/*<Button type='primary' style={{ float: 'right' }} onClick={() => {*/}
                        {/*location.hash = '/Home/Visualization'*/}
                        {/*}}>返回</Button>*/}
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
                                <div>今日上传照片数：<span style={{ color: '#1890ff' }}>{userInfo.uploadPhotoCount || 0}张</span>
                                </div>
                                <div>当前排班：<span style={{ color: '#1890ff' }}>
                                    {
                                        userInfo.workType.map(item => `${workTypeEnum[item]}`).join('/')
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
                        <Spin spinning={tableLoading} tip='加载中...'>
                            <Table style={{ marginTop: 20 }} columns={columns} dataSource={dataSource}
                                   bordered pagination={false} rowKey={(record) => record.groupMemberId}/>
                        </Spin>
                    </Card>
                    {
                        showMap && (
                            <Card title='稽查员轨迹点' bodyStyle={{ padding: 0 }}>
                                <div id='map' style={{ height: 600 }}>
                                    <div style={{
                                        height: 200, width: 200, zIndex: 999,
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                    }}>
                                        <Button style={{marginRight: 10, marginBottom: 10}} onClick={this.startAnimation.bind(this)}>开始动画</Button>
                                        <Button style={{marginBottom: 10}} onClick={this.pauseAnimation.bind(this)}>暂停动画</Button>
                                        <Button style={{marginRight: 10}} onClick={this.resumeAnimation.bind(this)}>继续动画</Button>
                                        <Button onClick={this.stopAnimation.bind(this)}>停止动画</Button>
                                    </div>
                                </div>
                                <div>

                                </div>
                            </Card>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default UserDetail;
