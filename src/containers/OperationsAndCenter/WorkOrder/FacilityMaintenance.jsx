import React, { Component } from 'react';
import {
    Button, Form, Select, Radio, Table, Row, Col, DatePicker, Input, Spin, Pagination, Badge
} from 'antd';
import { HttpClient } from "@/common/HttpClient";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class FacilityMaintenance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, //表格加载状态
            AlarmRecord: [
            ], //表格数据
            pageNum: 1, //当前页
            pageSize: 10, //一页多少数据
            total: 1, //数据总条数
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        this.loadData();

    }

    // 组件卸载之前
    componentWillUnmount() {
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
        HttpClient.query('/parking-resource/road/maintenance/warning/device/dispose/list', 'GET', params, this.handleQueryData.bind(this))
    }

    // loadData回调函数
    handleQueryData(d, type) {
        const data = d.data;
        // console.log(d)
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
            otherParams: {}
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
    idClick(id) {
        window.location.hash = `${location.hash}/FacilityMaintenanceDetails?id=${id}`;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { loading, pageNum, pageSize, AlarmRecord, total } = this.state;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        }

        const gettime = (str) => {
            if (!str) return
            const arr = str.split("T");
            const d = arr[0];
            const darr = d.split('-');
            const t = arr[1];
            const tarr = t.split('.000');
            const marr = tarr[0].split(':');
            const dd = parseInt(darr[0]) + "/" + parseInt(darr[1]) + "/" + parseInt(darr[2]) + " " + parseInt(marr[0]) + ":" + parseInt(marr[1]) + ":" + parseInt(marr[2]);
            //console.log(parseInt(marr[0])+"点");
            return dd;
        };

        const columns = [
            {
                title: '工单编号',
                dataIndex: 'id',
                render: (value) => (
                    <a onClick={this.idClick.bind(this, value)} style={{ color: '#1890FF' }}>{value}</a>),
            },
            {
                title: '工单优先级',
                dataIndex: 'priority',
                render: (value) => value || '--',
            },
            {
                title: '设备类型',
                dataIndex: 'deviceType',
                render: (value) => value || '--',
            },
            {
                title: '工单标题',
                dataIndex: 'caption',
                render: (value) => value || '--',
            },
            {
                title: '工单内容',
                dataIndex: 'content',
                render: (value) => value || '--',
            },
            {
                title: '工单来源',
                dataIndex: 'source',
                render: (value) => value || '--',
            },
            {
                title: '工单发起人',
                dataIndex: 'operator',
                render: (value) => value || '--',
            },
            {
                title: '当前处理人',
                dataIndex: 'disposer',
                render: (value) => value || '--',
            },
            {
                title: '工单状态',
                dataIndex: 'state',
                render: (value) => value || '--',
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                render: (value) => gettime(value) || '--',
            },
        ];

        return (
            <div className='page'>
                <div className='page-header'>
                    设备维保
                </div>

                <div className='page-content'>
                    <Form className='queryForm'>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='工单编号' {...formItemLayout}>
                                    {getFieldDecorator('uId')(
                                        <Input style={{ width: 240 }} placeholder='请输入' onChange={(e) => {
                                            const value = e.target.value;
                                            this.setState((state, props) => ({ otherParams: { ...state.otherParams, id: value } }))
                                        }} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='设备类型' {...formItemLayout}>
                                    {getFieldDecorator('deviceType')(
                                        <Select placeholder='全部' initialValue="全部" style={{ width: 240 }}
                                            onSelect={(e) => {
                                                this.setState((state, props) => ({ otherParams: { ...state.otherParams, deviceType: e } }))
                                            }}>
                                            <Option value="车检器">车检器</Option>
                                            <Option value="lucy">类型2</Option>
                                            <Option value="Yiminghe">类型3</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='工单优先级' {...formItemLayout}>
                                    {getFieldDecorator('workorderPriority')(
                                        <Select placeholder='全部' initialValue="全部" style={{ width: 240 }}
                                            onSelect={(e) => {
                                                this.setState((state, props) => ({ otherParams: { ...state.otherParams, priority: e } }))
                                            }}>
                                            <Option value="普通">普通</Option>
                                            <Option value="lucy">紧急</Option>
                                            <Option value="Yiminghe">立即处理</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='工单状态' {...formItemLayout}>
                                    {getFieldDecorator('workorderState')(
                                        <Select placeholder='全部' initialValue="全部" style={{ width: 240 }}
                                            onSelect={(e) => {
                                                this.setState((state, props) => ({ otherParams: { ...state.otherParams, state: e } }))
                                            }}>
                                            <Option value="1">待处理</Option>
                                            <Option value="处理中">处理中</Option>
                                            <Option value="3">厂家处理中</Option>
                                            <Option value="4">验收中</Option>
                                            <Option value="5">工单完成</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='创建日期' {...formItemLayout}>
                                    {getFieldDecorator('creationTime')(
                                        <RangePicker style={{ width: 360 }} format="YYYY-MM-DD"
                                            onChange={(dates, dateString) => {
                                                this.setState((state, props) => ({ otherParams: { ...state.otherParams, beginTime: dates[0]._d, endTime: dates[1]._d } }))
                                                console.log(dates)
                                            }} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} style={{ textAlign: 'right' }}>
                                <Button type="primary" onClick={this.handleQuery.bind(this)}>查询</Button>
                                <Button onClick={this.handleReset.bind(this)} style={{ marginLeft: '20px' }}>重置</Button>
                            </Col>
                        </Row>
                    </Form>

                    <Spin tip='加载中...' spinning={loading}>
                        <Table
                            style={{ marginTop: '20px' }}
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
                                <div style={{ clear: 'both' }}></div>
                            </div>
                        ) : ''}
                    </Spin>
                </div>
            </div>
        );
    }
}

const WrapperAbnormalParkingAlarm = Form.create()(FacilityMaintenance);
export default WrapperAbnormalParkingAlarm;
