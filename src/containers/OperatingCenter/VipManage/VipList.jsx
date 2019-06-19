import React, {Component} from 'react';
import {
    Button, Form, Table, Row, Col, DatePicker, Input, Spin, Pagination
} from 'antd';
import {HttpClient} from "@/common/HttpClient";
import Exception from "@/components/Exception/index";

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const laiyuan = ["Web","手机App","微信"];
const typetype = ["正常","注销","冻结"];

class VipList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, //表格加载状态
            AlarmRecord: [
            ], //表格数据
            pageNum: 1, //当前页
            pageSize: 10, //一页多少数据
            total: 1, //数据总条数
            otherParams: {
                warningDisposeStatus: -1, //处理状态按钮组当前值
                startTime: null, //开始时间
                endTime: null,//结束时间
                warningType: null,//报警类型
                parkingSpaceNo: null,//泊位编号
            },
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
      this.loadData();
         // if (window.checkPageEnable('/AbnormalParkingAlarm')) {
         //     this.loadData();
         // }
    }

    // 组件卸载之前
    componentWillUnmount() {

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
            ...otherParams
        };
        params = this.filterOtherParams(params);
        HttpClient.query('/parking-person-info/business/member/list', 'GET', params, this.handleQueryData.bind(this))
    }

    // loadData回调函数
    handleQueryData(d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            this.setState({
                AlarmRecord: data.list,
                total: data.total
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    //查询按钮
    handleQuery() {
        const pageSize = this.state.pageSize;
        this.setState({
            pageNum: 1
        });
        this.loadData(1, pageSize, this.state.otherParams)
    }

    //重置
    handleReset() {
        this.props.form.resetFields();
        this.setState({
            pageNum: 1, //当前页
            pageSize: 10, //一页多少数据
            otherParams: {
                warningDisposeStatus: -1, //处理状态按钮组当前值
                startTime: null,
                endTime: null,
                warningType: null,
                parkingSpaceNo: null,
            }
        }, () => {
            this.loadData()
        });
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
    // 点击跳转详情
    idClick (id) {
        window.location.hash = `${location.hash}/VipLogDetails?id=${id}`;
    }
    render() {
        if (!window.checkPageEnable('/AbnormalParkingAlarm')) {
            return <Exception type='403'/>
        }
        const {loading, pageNum, pageSize, AlarmRecord, total, otherParams: {warningDisposeStatus}} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
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
                title: '会员ID',
                dataIndex: 'id',
                //dataIndex: 'memberId',
                render: (value,rouder) =>  (
                    <a onClick={this.idClick.bind(this, rouder.id)} style={{ color: '#1890FF' }}>{value}</a>),
            }, {
                title: '注册来源',
                dataIndex: 'regSource',
                render: (value) => laiyuan[value] || '--',
            }, {
                title: '手机号码',
                dataIndex: 'mobile',
                render: (value) => value || '--',
            }, {
                title: 'openId',
                dataIndex: 'openId',
                render: (value) => value || '--',
            }, {
                title: '用户余额（元）',
                dataIndex: 'balance',
                render: (value) => value || '--',
            }, {
                title: '注册时间',
                dataIndex: 'regTime',
                render: (value) => gettime(value) || '--',
            },{
                title: '状态',
                dataIndex: 'state',
                render: (value) => typetype[value] || '--',
            },
        ];
        return (
            <div className='page'>
                <div className='page-header'>
                    会员列表
                </div>
                <div className='page-content'>
                    {/*查询表单*/}
                    <Form className='queryForm'>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='手机号' {...formItemLayout}>
                                    {getFieldDecorator('mobile')(
                                        <Input placeholder='请输入' onChange={(e) => {
                                            this.state.otherParams.mobile = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='注册日期' {...formItemLayout}>
                                    {getFieldDecorator('enrollTime')(
                                        <RangePicker style={{width: '100%'}} format="YYYY-MM-DD"
                                                     onChange={(dates, dateString) => {
                                                         this.state.otherParams.beginRegDate = dates[0]._d;
                                                         this.state.otherParams.endRegDate = dates[1]._d;
                                                     }}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={46}>
                            <Col style={{textAlign: 'right'}}>
                                <Button type='primary' onClick={this.handleQuery.bind(this)}>查询</Button>
                                <Button style={{marginLeft: '20px'}}
                                        onClick={this.handleReset.bind(this)}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                    {/*表格*/}
                    <Spin tip="加载中.." spinning={loading}>
                        <Table
                            style={{marginTop: '20px'}}
                            rowKey={data => data.id}
                            columns={columns}
                            dataSource={AlarmRecord}
                            pagination={false}
                        />
                        {/*分页*/}
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
                </div>
            </div>
        );
    }
}

const WrapperAbnormalParkingAlarm = Form.create()(VipList);
export default WrapperAbnormalParkingAlarm;
