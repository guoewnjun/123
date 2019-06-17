import React, {Component} from 'react';
import {Col, DatePicker, Select, Input, Row, Button, Table, Pagination} from "antd";

class AbnormalDevice extends Component {

    constructor(props) {
        super(props);
        this.roadName = '';
        this.alarmStatus = -1;
        this.alarmEvent = -1;
        this.alarmTime = [];
    }

    state = {
        dataSource: [{
            number: 'G454465',
            event: '低电量警告',
            roadName: '南山一路',
            deviceManufacturer: '金益科技',
            deviceType: '车检器',
            deviceModel: 'sp032',
            alarmTime: '2018-09-02 12:00:00',
            alarmGrade: '普通',
            alarmStatus: '待处理'
        }],
        total: 0,
        pageNum: 0,
        pageSize: 0,
    };

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    // 查询
    search() {
        console.log(this.roadName)
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
                title: '告警编号',
                dataIndex: 'number',
            }, {
                title: '告警事件',
                dataIndex: 'event',
            }, {
                title: '路段名称',
                dataIndex: 'roadName',
            }, {
                title: '设备厂商',
                dataIndex: 'deviceManufacturer',
            }, {
                title: '设备类型',
                dataIndex: 'deviceType',
            }, {
                title: '设备型号',
                dataIndex: 'deviceModel'
            }, {
                title: '告警时间',
                dataIndex: 'alarmTime'
            }, {
                title: '告警等级',
                dataIndex: 'alarmGrade'
            }, {
                title: '告警状态',
                dataIndex: 'alarmStatus'
            }, {
                title: '操作',
                dataIndex: 'action',
                render: (value, row) => (
                    <a onClick={() => {
                        location.hash = `${location.hash}/AbnormalDeviceDetail?id=${row.number}`
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
                    <Row gutter={50} style={{ marginBottom: 24 }}>
                        <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>路段名称：</div>
                            <Input style={{ flexGrow: 1, width: 'auto' }} placeholder='请输入' onChange={(e) => {
                                this.roadName = e.target.value
                            }}/>
                        </Col>
                        <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>告警状态：</div>
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
                            <div>告警事件：</div>
                            <Select style={{ flexGrow: 1, width: 'auto' }} placeholder='请输入' allowClear
                                    onChange={(value) => {
                                        this.alarmEvent = value
                                    }}>
                                <Option value={0}>低电量告警</Option>
                                <Option value={1}>工作异常</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={50} style={{ marginBottom: 24 }}>
                        <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>告警时间：</div>
                            <RangePicker style={{ flexGrow: 1, width: 'auto' }} allowClear format="YYYY-MM-DD"
                                         onChange={(dates, dateString) => {
                                             this.alarmTime = dateString;
                                         }}/>
                        </Col>
                        <Col span={16} style={{ textAlign: 'right' }}>
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

export default AbnormalDevice;
