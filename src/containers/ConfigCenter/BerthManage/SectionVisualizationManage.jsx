import React, {Component} from 'react';
import {Form, Table, Button, Input, Row, Col, Pagination, Spin} from 'antd';
import {HttpClient} from "@/common/HttpClient";
import _ from 'lodash';

class SectionVisualizationManage extends Component {

    state = {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        spinning: false,
        parkingList: []
    };

    componentWillMount() {

    }

    componentDidMount() {
        this.loadData()
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
    loadData(otherParams = {}, pageNum = 1, pageSize = 10) {
        this.setState({
            spinning: true
        });
        let params = {
            pageNum: pageNum,
            pageSize: pageSize,
            ...otherParams
        };
        params = this.filterParams(params);
        HttpClient.query(`easy-mock${window.MODULE_PARKING_RESOURCE}/admin/resource/parking/set/list`, 'GET', params, this.handleQueryData.bind(this))
    }

    // loadData回调函数
    handleQueryData(d, type) {
        if (!d) return;
        if (type === HttpClient.requestSuccess) {
            const data = d.data;
            data.list && data.list.forEach(item => {
                item.location = `${item.longitude},${item.latitude}`
            });
            this.setState({
                parkingList: data.list || [],
                total: data.total || 0,
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            spinning: false,
        });
    }

    // 查询
    search() {
        const pageSize = this.state.pageSize;
        this.setState({
            pageNum: 1
        });
        const payLoad = this.props.form.getFieldsValue(['parkingName']);
        this.loadData(payLoad, 1, pageSize)
    }

    reset() {
        this.props.form.resetFields();
        this.loadData();
    }

    // 分页变化
    onPageChange(pageNum) {
        this.setState({
            pageNum: pageNum,
        }, () => {
            this.loadData(this.payLoad, pageNum)
        });
    }

    // 分页大小变化
    onShowSizeChange(pageNum, pageSize) {
        this.setState({
            pageNum,
            pageSize
        }, () => {
            this.loadData(this.payLoad, pageNum, pageSize)
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { spinning, pageNum, pageSize, total, parkingList } = this.state;
        const FormItem = Form.Item;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        const columns = [
            {
                title: '路段名称',
                dataIndex: 'parkingName',
            }, {
                title: '路段方位',
                dataIndex: 'direct',
            }, {
                title: '泊位数',
                dataIndex: 'totalSpaceCount',
            }, {
                title: '未设置泊位',
                dataIndex: 'unSettedSpaceCount',
            }, {
                title: '操作',
                dataIndex: 'action',
                render: (value, row) => <a
                    onClick={() => location.hash = `${location.hash}/SectionVisualizationSetting?id=${row.parkingId}`}>编辑</a>

            },
        ];
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>路段可视化管理</div>
                </div>
                <div className='page-content'>
                    <Form>
                        <Row gutter={30}>
                            <Col span={8}>
                                <FormItem {...formItemLayout} label='路段名称'>
                                    {getFieldDecorator('parkingName')(
                                        <Input placeholder='请输入'/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                                <Button style={{ marginLeft: 20 }} onClick={this.reset.bind(this)}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Row>
                        <Spin tip="加载中.." spinning={spinning}>
                            <Table
                                className="sectionResource_table"
                                rowKey="parkingId"
                                columns={columns}
                                dataSource={parkingList}
                                pagination={false}
                            />

                            {parkingList !== undefined && parkingList.length > 0 ? (
                                <div>
                                    <div className="sectionResource_table_total">共{total}条</div>
                                    <Pagination
                                        className="sectionResource_table_pagination"
                                        showSizeChanger
                                        showQuickJumper
                                        total={total}
                                        pageSize={pageSize}
                                        current={pageNum}
                                        onChange={this.onPageChange.bind(this)}
                                        onShowSizeChange={this.onShowSizeChange.bind(this)}
                                    />
                                </div>
                            ) : ''}
                        </Spin>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Form.create()(SectionVisualizationManage);
