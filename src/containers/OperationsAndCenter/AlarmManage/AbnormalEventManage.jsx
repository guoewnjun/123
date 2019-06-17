import React, {Component, Fragment} from 'react';
import {Button, Col, DatePicker, Input, Pagination, Row, Select, Table} from "antd";

class AbnormalEventManage extends Component {

    constructor(props){
        super(props);
        this.alarmType = 0;
        this.alarmGrade = 0;
    }

    state = {
        dataSource: []
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
        const columns = [
            {
                title: '告警分类',
                dataIndex: 'alarmType',
            }, {
                title: '事件码',
                dataIndex: 'eventCode',
            }, {
                title: '事件名称',
                dataIndex: 'eventName',
            }, {
                title: '告警等级',
                dataIndex: 'alarmGrade',
            }, {
                title: '是否派单',
                dataIndex: 'isAssign',
            }, {
                title: '发送短信',
                dataIndex: 'sendMessage'
            }, {
                title: '创建时间',
                dataIndex: 'createTime'
            }
        ];
        return (
            <div className='page'>
                <div className='page-header'>
                    告警事件管理
                </div>
                <div className='page-content'>
                    <Row gutter={50} style={{ marginBottom: 24 }}>
                        <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>告警分类：</div>
                            <Select style={{ flexGrow: 1, width: 'auto' }} placeholder='请输入' allowClear
                                    onChange={(value) => {
                                        this.alarmType = value
                                    }}>
                                <Option value={0}>设备告警</Option>
                                <Option value={1}>违停告警</Option>
                                <Option value={2}>订单异常告警</Option>
                            </Select>
                        </Col>
                        <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>告警等级：</div>
                            <Select style={{ flexGrow: 1, width: 'auto' }} placeholder='请输入' allowClear
                                    onChange={(value) => {
                                        this.alarmGrade = value
                                    }}>
                                <Option value={0}>普通</Option>
                                <Option value={1}>重要</Option>
                                <Option value={2}>严重</Option>
                            </Select>
                        </Col>
                        <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
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

export default AbnormalEventManage;
