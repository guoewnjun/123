import React, {Component, Fragment} from 'react';

import {
    Button, Form, Select, Radio, Table, Row, Col, DatePicker, Input, Spin, Pagination, Badge,Card
} from 'antd';
import {HttpClientImmidIot} from "../../common/HttpClientImmidIot";
import ImagePreview from '../../components/ImagePreview/';
import _ from 'lodash';
import './Style/ParkingRecord.css';

const sex = ['男','女','其他'];
const zhuangtai = ['停车中','行程结束','退款中','欠费中','异常订单','异常订单关闭'];


export default class VipLogDetails extends Component {
    constructor (props) {
        super(props);
        this.state = {
            data: [],
            baseInfo:{},
            orderId: this.props.location.query.id,
            loading: false, //表格加载状态
            AlarmRecord: [
            ], //表格数据
            pageNum: 1, //当前页
            pageSize: 10, //一页多少数据
            total: 1, //数据总条数
            detailData:{},
            otherParams: {
                warningDisposeStatus: -1, //处理状态按钮组当前值
                startTime: null, //开始时间
                endTime: null,//结束时间
                warningType: null,//报警类型
                parkingSpaceNo: null,//泊位编号
            },
        }
    }

    // 组件挂载之前
    componentWillMount () {

    }

    // 组件挂载后
    componentDidMount () {
            let orderId = null;
            if (!this.state.orderId) {
                orderId = sessionStorage.getItem('orderId_AppealDetail');
                sessionStorage.removeItem('orderId_AppealDetail');
                this.setState({
                    orderId
                })
            } else {
                orderId = this.state.orderId
            }
            HttpClientImmidIot.query(`/parking-person-info/business/member/detail?id=${orderId}`, 'GET', null, this.parkingDetail.bind(this));
            this.loadData();

    }

    // 组件卸载之前
    componentWillUnmount () {
    }
    // 筛选参数
    filterOtherParams(otherParams) {
        let params = {};
        for (let item in otherParams) {
            if (otherParams[item] || item === 'warningDisposeStatus') {
                params[item] = otherParams[item]
            }
        }
        return params
    }
    //加载数据
    loadData(pageNum = 1, pageSize = 10, otherParams) {
        this.setState({
            loading: true
        });
        let params = {
            pageNum: pageNum,
            pageSize: pageSize,
            id:this.state.orderId,
            ...otherParams
        };
        params = this.filterOtherParams(params);
        HttpClientImmidIot.query('/parking-person-info/business/member/park/list', 'GET', params, this.handleQueryData.bind(this))
    }

    // loadData回调函数
    handleQueryData(d, type) {
        const data = d.data;
        if (type === HttpClientImmidIot.requestSuccess) {
            this.setState({
                AlarmRecord: data.list?data.list:[],
                total: data.total
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    // 分页变化
    onPageChange(pageNum) {
        this.setState({
            pageNum: pageNum,
        }, () => {
            this.loadData(pageNum, this.state.pageSize, this.state.otherParams)
        });
    }

    // 分页大小变化
    onShowSizeChange(pageNum, pageSize) {
        this.setState({
            pageNum,
            pageSize
        }, () => {
            this.loadData(pageNum, pageSize, this.state.otherParams)
        });
    }

    // 获取停车详情回调
    parkingDetail (d, type) {
        const data = d.data;
        if (type === HttpClientImmidIot.requestSuccess) {
            //成功-------在这里做你的数据处理
            this.setState({
                data: data.vehicleInfos	,
                detailData: data,
                baseInfo:data.baseInfo,
            });
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    checkAppealDetail () {
            window.location.history.back(-1);
    }


    render () {
        const { baseInfo, orderId, data,AlarmRecord, detailData, loading, ImagePreviewVisible, imageUrl, pageNum, pageSize, total } = this.state;
        const  gettime=(str)=>{
               const arr=str.split("T");
               const d=arr[0];
               const darr = d.split('-');
               const t=arr[1];
               const tarr = t.split('.000');
               const marr = tarr[0].split(':');
               const dd = parseInt(darr[0])+"/"+parseInt(darr[1])+"/"+parseInt(darr[2])+" "+parseInt(marr[0])+":"+parseInt(marr[1])+":"+parseInt(marr[2]);
               //console.log(parseInt(marr[0])+"点");
               return dd;
             };
        const columns = [
            {
                title: '车牌号',
                dataIndex: 'plateNo',
                render: (text) => (text ? text : '--'),
            }, {
                title: '车辆品牌',
                dataIndex: 'brand',
                render: (text) => (text ? text : '--'),
            }, {
                title: '车辆型号',
                dataIndex: 'model',
                render: (text) => (text ? text : '0 元'),
            }, {
                title: '常用车',
                dataIndex: 'default',
                render: (text) => (text ? '是' : '否'),
            }, {
                title: '绑定时间',
                dataIndex: 'bindingTime',
                render: (text) => (text ? gettime(text) : '--'),
            }
        ];
        const columns1 = [
          {
              title: '停车场/路段',
              dataIndex: 'parking',
              render: (text) => (text ? text : '--'),
          }, {
              title: '车牌号',
              dataIndex: 'plateNo',
              render: (text) => (text ? text : '--'),
          }, {
              title: '泊位编号',
              dataIndex: 'spaceNo',
              render: (text) => (text ? text : '0 元'),
          }, {
              title: '停入时间',
              dataIndex: 'inTime',
              render: (text) => (text ? gettime(text) : '--'),
          }, {
              title: '停出时间',
              dataIndex: 'outTime',
              render: (text) => (text ? gettime(text) : '--'),
          }
          , {
              title: '停车时长（分种）',
              dataIndex: 'duration',
              render: (text) => (text ? text : '--'),
          }
          , {
              title: '停车费用（元）',
              dataIndex: 'fee',
              render: (text) => (text ? text : '--'),
          }
          , {
              title: '订单状态',
              dataIndex: 'state',
              render: (text) => (zhuangtai[text] ? zhuangtai[text] : '--'),
          }

        ];
        return (
                <div className='page'>
                    <div className='page-header '>
                        <div style={{ position: "relative", height: 44 }}>
                            <div style={{
                                fontSize: '20px',
                                float: 'left',
                                fontFamily: 'PingFangSC-Medium',
                                color: 'rgba(0,0,0,0.85)',
                                lineHeight: '28px'
                            }}>会员号: {orderId}</div>
                            <div style={{ float: 'right' }}>
                                <div style={{
                                    textAlign: 'right',
                                    color: 'rgba(0,0,0,0.45)',
                                    lineHeight: '22px',
                                    fontSize: '14px'
                                }}><Button type="primary" onClick={ ()=>{window.history.back()}}>返回</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='page-content page-content-transparent'>
                        <Card
                            title='会员详情'
                            className='baseInfo'
                        >
                            <Row>
                                <Col span={8}>
                                    <label>会员ID：</label>
                                    <span>{orderId}</span>
                                </Col>
                                <Col span={8}>
                                    <label>注册来源：</label>
                                    <span>{detailData.regSource || '--'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>手机号码：</label>
                                    <span>{detailData.mobile || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>openid：</label>
                                    <span>{detailData.openId || '--'}</span>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='基础信息'
                            className='baseInfo'
                        >
                            <Row>
                                <Col span={8}>
                                    <label>头像：</label>
                                    <span>{baseInfo.headPortrait || '--'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>昵称：</label>
                                    <span>{baseInfo.nickName || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>性别：</label>
                                    <span>{sex[baseInfo.gender] || '--'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>出生年月：</label>
                                    <span>{baseInfo.birthday || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>电子邮箱：</label>
                                    <span>{baseInfo.email || '--'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>地址：</label>
                                    <span>{baseInfo.address || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>注册时间：</label>
                                    <span>{baseInfo.regTime || '--'}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <label>账户余额（元）：</label>
                                    <span>{baseInfo.balance || '--'}</span>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='车辆信息'
                        >
                            <Table dataSource={data} columns={columns} rowKey='id' pagination={false}/>
                        </Card>
                        <Card
                            title='停车信息'
                        >
                        <Spin spinning={loading} tip='加载中...'>
                            <Table dataSource={AlarmRecord} columns={columns1} rowKey='id' pagination={false}/>
                            {AlarmRecord.length > 0 ? (
                                <div>
                                    <div className="table_pagination_total">共{total}条</div>
                                    <Pagination
                                        className="table_pagination"
                                        showSizeChanger
                                        showQuickJumper
                                        total={total}
                                        current={pageNum}
                                        pageSize={pageSize}
                                        onChange={this.onPageChange.bind(this)}
                                        onShowSizeChange={this.onShowSizeChange.bind(this)}
                                    />
                                    <div style={{clear: 'both'}}></div>
                                </div>
                            ) : ''}
                            </Spin>
                        </Card>
                    </div>
                </div>
        );
    }
}
