import React, {Component} from 'react';
import {Col, DatePicker, Select, Input, Row, Button, Table, Pagination, Form, Spin} from "antd";
import {HttpClient} from "@/common/HttpClient";
import _ from "lodash";
import moment from 'moment';

class AbnormalDevice extends Component {

    constructor(props) {
        super(props);
        this.payLoad = {};
    }

    state = {
        spinning: true,
        dataSource: [],
        total: 1,
        pageNum: 1,
        pageSize: 10,
    };

    componentWillMount() {

    }

    componentDidMount() {
        this.loadData()
    }

    loadData() {
        const params = this.filterParams({
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            ...this.payLoad
        });
        HttpClient.query(`${window.MODULE_PARKING_RESOURCE}/road/maintenance/warning/device/list`, 'GET', params, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                // console.log(d);
                this.setState({
                    dataSource: d.data.list || [],
                    total: d.data.total
                })
            }
            this.setState({
                spinning: false
            });
        })
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

    // 查询
    search() {
        this.loadData()
    }

    // 分页变化
    onPageChange(pageNum) {
        this.setState({
            pageNum: pageNum,
        }, () => {
            this.loadData()
        });
    }

    // 分页大小变化
    onShowSizeChange(pageNum, pageSize) {
        this.setState({
            pageNum,
            pageSize
        }, () => {
            this.loadData()
        });
    }

    //重置
    reset() {
        this.props.form.resetFields();
        this.payLoad = {};
        this.setState({
            pageNum: 1, //当前页
            pageSize: 10, //一页多少数据
        }, () => {
            this.loadData()
        });
    }

    render() {
        const { dataSource, total, pageNum, pageSize, spinning } = this.state;
        const FormItem = Form.Item;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        const Option = Select.Option;
        const RangePicker = DatePicker.RangePicker;
        const columns = [
            {
                title: '告警编号',
                dataIndex: 'id',
            }, {
                title: '告警事件',
                dataIndex: 'type',
            }, {
                title: '路段名称',
                dataIndex: 'parkingName',
            }, {
                title: '设备厂商',
                dataIndex: 'factory',
            }, {
                title: '设备类型',
                dataIndex: 'deviceType',
            }, {
                title: '设备型号',
                dataIndex: 'deviceModel'
            }, {
                title: '告警时间',
                dataIndex: 'faultTime',
                render: (value) => (
                    moment(value).format('YYYY-MM-DD HH:mm:ss')
                )
            }, {
                title: '告警等级',
                dataIndex: 'priority'
            }, {
                title: '告警状态',
                dataIndex: 'state'
            }, {
                title: '操作',
                dataIndex: 'action',
                render: (value, row) => (
                    <a onClick={() => {
                        location.hash = `${location.hash}/AbnormalDeviceDetail?id=${row.id}`
                    }}>详情</a>
                )

            }
        ];
        return (
            <div className='page'>
                <div className='page-header'>
                    设备告警
                </div>
                <div className='page-content'>
                    <Row gutter={50}>
                        <Col span={8}>
                            <FormItem label='路段名称' {...formItemLayout}>
                                {getFieldDecorator('parkingName')(
                                    <Input placeholder='请输入' onChange={(e) => {
                                        this.payLoad.parkingName = e.target.value
                                    }}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='告警状态' {...formItemLayout}>
                                {getFieldDecorator('state')(
                                    <Select placeholder='请选择' allowClear
                                            style={{width: '100%'}}
                                            onChange={(value) => {
                                                this.payLoad.state = value
                                            }}>
                                        <Option value={0}>待处理</Option>
                                        <Option value={1}>无需处理</Option>
                                        <Option value={2}>已生成工单</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='告警事件' {...formItemLayout}>
                                {getFieldDecorator('faultType')(
                                    <Select placeholder='请选择' allowClear
                                            style={{width: '100%'}}
                                            onChange={(value) => {
                                                this.payLoad.faultType = value
                                            }}>
                                        <Option value={0}>低电量告警</Option>
                                        <Option value={1}>工作异常</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={50}>
                        <Col span={8}>
                            <FormItem label='告警时间' {...formItemLayout}>
                                {getFieldDecorator('time')(
                                    <RangePicker allowClear format="YYYY-MM-DD"
                                                 style={{width: '100%'}}
                                                 onChange={(dates, dateString) => {
                                                     this.payLoad.beginTime = dateString[0];
                                                     this.payLoad.endTime = dateString[1];
                                                 }}/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label='告警等级' {...formItemLayout}>
                                {getFieldDecorator('priority')(
                                    <Select placeholder='请选择' allowClear
                                            style={{width: '100%'}}
                                            onChange={(value) => {
                                                this.payLoad.priority = value
                                            }}>
                                        <Option value={0}>普通</Option>
                                        <Option value={1}>重要</Option>
                                        <Option value={2}>严重</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                            <Button type='primary' style={{ marginRight: 10 }}
                                    onClick={this.search.bind(this)}>查询</Button>
                            <Button onClick={this.reset.bind(this)}>重置</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Spin spinning={spinning} tip='加载中...'>
                            <Table
                                style={{ marginTop: '20px' }}
                                rowKey={data => data.id}
                                columns={columns}
                                dataSource={dataSource}
                                pagination={false}
                            />
                            {
                                dataSource.length > 0 && (
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
                                    </div>
                                )
                            }
                        </Spin>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Form.create()(AbnormalDevice);
