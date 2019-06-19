import React, {Component} from 'react';
import {Col, DatePicker, Select, Input, Row, Button, Table, Pagination, Cascader, Form} from "antd";
import {HttpClient} from "@/common/HttpClient";
import _ from "lodash";

class CheckInInformation extends Component {

    constructor(props) {
        super(props);
        this.payLoad = {
            inspectionSignInfoDTO: {}
        };
    }

    state = {
        dataSource: [],
        CascaderOptions: [],
        total: 0,
        pageNum: 1,
        pageSize: 10
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
        });
        this.loadData(this.payLoad)
    }

    componentWillUnmount() {

    }

    // 筛选参数
    filterParams(params) {
        const newParams = {};
        _.forIn(params, (value, key) => {
            if (value || value === 0) {
                newParams[key] = value
            }
        });
        return newParams
    }

    //加载数据
    loadData(otherParams, pageNum = 1, pageSize = 10) {
        this.setState({
            loading: true
        });
        let params = {
            pageNum: pageNum,
            pageSize: pageSize,
            ...otherParams
        };
        params = this.filterParams(params);
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/inspection/group/member/signInfo`, 'GET', params, this.handleQueryData.bind(this))
    }

    // loadData回调函数
    handleQueryData(d, type) {
        if (!d) return;
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            this.setState({
                dataSource: data.list,
                total: data.total,
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        });
    }

    // 查询
    search() {
        const pageSize = this.state.pageSize;
        this.setState({
            pageNum: 1
        });
        this.loadData(this.payLoad, 1, pageSize)
    }

    // 分页变化
    onPageChange() {

    }

    // 分页大小变化
    onShowSizeChange() {

    }

    //重置
    handleReset() {
        this.props.form.resetFields();
        this.setState({
            pageNum: 1, //当前页
            pageSize: 10, //一页多少数据
        }, () => {
            this.loadData(this.payLoad, this.state.pageNum, this.state.pageSize)
        });
    }

    render() {
        const { dataSource, total, pageNum, pageSize, CascaderOptions } = this.state;
        const Option = Select.Option;
        const RangePicker = DatePicker.RangePicker;
        const { getFieldDecorator } = this.props.form;
        const FormItem = Form.Item;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const columns = [
            {
                title: '行政区域',
                dataIndex: 'areaName',
            }, {
                title: '巡检组',
                dataIndex: 'inspectionGroupName',
            }, {
                title: '姓名',
                dataIndex: 'inspectionMemName',
            }, {
                title: '工号',
                dataIndex: 'workNum',
            }, {
                title: '班次',
                dataIndex: 'workType'
            }, {
                title: '签到/签出时间',
                dataIndex: 'signTime'
            }, {
                title: '签到类型',
                dataIndex: 'signType'
            }, {
                title: '签到状态',
                dataIndex: 'signStatus'
            }
        ];
        return (
            <div className='page'>
                <div className='page-header'>
                    签到信息
                </div>
                <div className='page-content'>
                    <Form>
                        <Row gutter={50}>
                            <Col span={8}>
                                <FormItem label='工号' {...formItemLayout}>
                                    {getFieldDecorator('workNum')(
                                        <Input placeholder='请输入' onChange={(e) => {
                                            this.payLoad.inspectionSignInfoDTO.workNum = e.target.value
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='行政区域' {...formItemLayout}>
                                    {getFieldDecorator('district')(
                                        <Cascader changeOnSelect options={CascaderOptions}
                                                  placeholder='请选择'
                                                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                                                  onChange={(values) => this.payLoad.inspectionSignInfoDTO.areaId = values[values.length - 1]}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='日期' {...formItemLayout}>
                                    {getFieldDecorator('date')(
                                        <RangePicker allowClear format="YYYY-MM-DD"
                                                     style={{ width: '100%' }}
                                                     onChange={(dates, dateString) => {
                                                         console.log(dateString);
                                                         this.payLoad.inspectionSignInfoDTO.startTime = dateString[0];
                                                         this.payLoad.inspectionSignInfoDTO.endTime = dateString[1];
                                                     }}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={50}>
                            <Col span={8}>
                                <FormItem label='巡检组' {...formItemLayout}>
                                    {getFieldDecorator('inspectionMemName')(
                                        <Input placeholder='请输入' onChange={(e) => {
                                            this.payLoad.inspectionSignInfoDTO.inspectionGroupName = e.target.value
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='签到类型' {...formItemLayout}>
                                    {getFieldDecorator('inspectionMemName')(
                                        <Select placeholder='请输入' allowClear
                                                onChange={(value) => {
                                                    this.payLoad.inspectionSignInfoDTO.signType = value
                                                }}>
                                            <Option value={0}>签到</Option>
                                            <Option value={1}>签出</Option>
                                        </Select>
                                    )}
                                </FormItem>

                            </Col>
                            <Col span={8}>
                                <FormItem label='姓名' {...formItemLayout}>
                                    {getFieldDecorator('inspectionMemName')(
                                        <Input placeholder='请输入' onChange={(e) => {
                                            this.payLoad.inspectionSignInfoDTO.inspectionMemName = e.target.value
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ textAlign: 'right' }}>
                                <Button type='primary' style={{ marginRight: 10 }}
                                        onClick={this.search.bind(this)}>查询</Button>
                                <Button onClick={this.handleReset.bind(this)}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Row>
                        <Table
                            style={{ marginTop: '20px' }}
                            rowKey={data => data.number}
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
                    </Row>
                </div>
            </div>
        );
    }
}

export default Form.create()(CheckInInformation);
