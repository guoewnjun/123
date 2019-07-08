import React, {Component, Fragment} from 'react';
import {Button, Col, Form, Input, Pagination, Row, Spin, Table} from 'antd';
import _ from "lodash";
import {HttpClient} from "@/common/HttpClient";

class EquipmentManufacturers extends Component {

    constructor(props) {
        super(props);
        this.payLoad = {}
    }

    state = {
        dataSource: [],
        total: 0,
        pageNum: 1,
        pageSize: 10,
        spinning: true
    };

    componentWillMount() {

    }

    componentDidMount() {
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
            spinning: true
        });
        let params = {
            page: pageNum - 1, // 中间件默认0
            page_size: pageSize,
            ...otherParams
        };
        params = this.filterParams(params);
        HttpClient.query(`https://iotdev.triplego.cn/admin/device/vendors`, 'GET', params, this.handleQueryData.bind(this))
    }

    // loadData回调函数
    handleQueryData(d, type) {
        if (!d) return;
        if (type === HttpClient.requestSuccess) {
            const data = d.data;
            this.setState({
                dataSource: data || [],
                total: d.count || 0,
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
        this.loadData(this.payLoad, 1, pageSize)
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

    //重置
    handleReset() {
        this.props.form.resetFields();
        this.payLoad = {};
        this.setState({
            pageNum: 1, //当前页
            pageSize: 10, //一页多少数据
        }, () => {
            this.loadData(this.payLoad, this.state.pageNum, this.state.pageSize)
        });
    }

    render() {
        const { dataSource, total, pageNum, pageSize, spinning } = this.state;
        const { getFieldDecorator } = this.props.form;
        const FormItem = Form.Item;
        const formModalLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const columns = [
            {
                title: '供应商名称',
                dataIndex: 'vendor_name',
            }, {
                title: '供应商代码',
                dataIndex: 'vendor_code',
            }, {
                title: '系统登录账户',
                dataIndex: 'vendor_username',
            }, {
                title: '供应商密钥',
                dataIndex: 'vendor_key',
            }, {
                title: '启用状态',
                dataIndex: 'enabled',
                render: (value, row) => (
                    <Fragment>
                        <span style={value ? {} : { color: 'red' }}>{
                            row.reviewer ? (
                                value ? '已启用' : '已停用'
                            ) : (
                                '待复核'
                            )
                        }</span>
                    </Fragment>
                )
            }, {
                title: '操作',
                dataIndex: 'action',
                width: 80,
                render: (value, row) => (
                    <a onClick={() => location.hash = `${location.hash}/EquipmentManufacturersDetail?id=${row.id}`}>详情</a>
                )
            }
        ];
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>设备厂商</div>
                </div>
                <div className='page-content'>
                    <Form>
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label='供应商名称' {...formModalLayout}>
                                    {getFieldDecorator('vendor_name')(
                                        <Input placeholder='请输入' onChange={(e) => {
                                            this.payLoad.vendor_name = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <Button type='primary' onClick={() => this.search()}
                                        style={{ marginRight: 15 }}>查询</Button>
                                <Button style={{ marginRight: 15 }} onClick={() => this.handleReset()}>重置</Button>
                            </Col>
                        </Row>
                        <Row gutter={40}>
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
                    </Form>
                </div>
            </div>
        );
    }
}

export default Form.create()(EquipmentManufacturers);
