import React, {Component, Fragment} from 'react';
import {Col, DatePicker, Select, Input, Row, Button, Table, Pagination} from "antd";
import {HttpClient} from "@/common/HttpClient";

class CheckInInformation extends Component {

    state = {
        dataSource: []
    };

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    // 筛选参数
    filterOtherParams(otherParams) {
        let params = {};
        for (let item in otherParams) {
            if (otherParams[item]) {
                params[item] = otherParams[item]
            }
        }
        return params
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
        params = this.filterOtherParams(params);
        HttpClient.query(this.globalUrl, 'GET', params, this.handleQueryData.bind(this))
    }

    // loadData回调函数
    handleQueryData(d, type) {
        if (!d) return;
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            this.setState({
                FinancialDetailRecord: data.list
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
            total: data.total,
        });
    }

    // 查询
    search() {

    }

    // 分页变化
    onPageChange() {

    }

    // 分页大小变化
    onShowSizeChange() {

    }

    render() {
        const { dataSource, total, pageNum, pageSize } = this.state;
        const Option = Select.Option;
        const RangePicker = DatePicker.RangePicker;
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
                    <Row gutter={50} style={{ marginBottom: 24 }}>
                        <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>工号：</div>
                            <Input style={{ flexGrow: 1, width: 'auto' }} placeholder='请输入' onChange={(e) => {
                                this.roadName = e.target.value
                            }}/>
                        </Col>
                        <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>行政区域：</div>
                            <Select style={{ flexGrow: 1, width: 'auto' }} placeholder='需要请求接口' allowClear
                                    onChange={(value) => {
                                        this.alarmStatus = value
                                    }}>
                                <Option value={0}>待处理</Option>
                                <Option value={1}>无需处理</Option>
                                <Option value={2}>已生成工单</Option>
                            </Select>
                        </Col>
                        <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>日期：</div>
                            <RangePicker style={{ flexGrow: 1, width: 'auto' }} allowClear format="YYYY-MM-DD"
                                         onChange={(dates, dateString) => {
                                             this.alarmTime = dateString;
                                         }}/>
                        </Col>
                    </Row>
                    <Row gutter={50} style={{ marginBottom: 24 }}>
                        <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>巡检组：</div>
                            <Select style={{ flexGrow: 1, width: 'auto' }} placeholder='请输入' allowClear
                                    onChange={(value) => {
                                        this.alarmStatus = value
                                    }}>
                                <Option value={0}>待处理</Option>
                                <Option value={1}>无需处理</Option>
                                <Option value={2}>已生成工单</Option>
                            </Select>
                        </Col>
                        <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>签到类型：</div>
                            <Select style={{ flexGrow: 1, width: 'auto' }} placeholder='请输入' allowClear
                                    onChange={(value) => {
                                        this.alarmStatus = value
                                    }}>
                                <Option value={0}>待处理</Option>
                                <Option value={1}>无需处理</Option>
                                <Option value={2}>已生成工单</Option>
                            </Select>
                        </Col>
                        <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>工号：</div>
                            <Input style={{ flexGrow: 1, width: 'auto' }} placeholder='请输入' onChange={(e) => {
                                this.roadName = e.target.value
                            }}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ textAlign: 'right' }}>
                            <Button type='primary' style={{ marginRight: 10 }}
                                    onClick={this.search.bind(this)}>查询</Button>
                            <Button>重置</Button>
                        </Col>
                    </Row>
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

export default CheckInInformation;
