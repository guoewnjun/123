import React, {Component, Fragment} from 'react';
import {Input, Form, Table, Row, Col, Button, Pagination, Spin, Modal, message, Divider, Popconfirm} from "antd";
import {HttpClient} from "@/common/HttpClient";
import ChinaRegion from '@/components/ChinaRegion.jsx';
import CheckAddressModal from '@/components/MapModal/CheckAddressModal.jsx';
import _ from "lodash";
import './Style/AreaManage.css';

class AreaManage extends Component {

    constructor(props) {
        super(props);
        this.payLoad = {}
    }

    state = {
        checkPointsVisible: false,
        spinning: false,
        dataSource: [],
        total: 0,
        pageNum: 1,
        pageSize: 10,
        checkPoints: [],
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
            pageNum: pageNum,
            pageSize: pageSize,
            ...otherParams
        };
        params = this.filterParams(params);
        HttpClient.query(`${window.MODULE_PARKING_INFO}/admin/area/subarea/list`, 'GET', params, this.handleQueryData.bind(this))
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
                dataSource: data.list || [],
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

    // 编辑
    editArea(row) {
        localStorage.setItem('AreaInfo', JSON.stringify(row));
        location.hash = `${location.hash}/EditArea`;
    }

    // 删除
    deleteArea(id) {
        HttpClient.query(`${window.MODULE_PARKING_INFO}/admin/area/subarea/delete`, 'POST', {id: id}, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                message.success('删除成功');
                this.loadData(this.payLoad)
            }
        }, 'application/x-www-form-urlencoded;charset=UTF-8')
    }

    render() {
        const { dataSource, total, pageNum, pageSize, spinning, checkPointsVisible, checkPoints } = this.state;
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
                title: '片区名称',
                dataIndex: 'name',
                className: 'colMinWidth'
            }, {
                title: '坐标',
                dataIndex: 'location',
                className: 'colMinWidth',
                render: (value) => <a onClick={() => {
                    let checkPoints = [{
                        longitude: value.split(',')[0],
                        latitude: value.split(',')[1]
                    }];
                    this.setState({
                        checkPointsVisible: true,
                        checkPoints
                    })
                }}>查看</a>
            }, {
                title: '路段数',
                dataIndex: 'parkingCount',
                className: 'colMinWidth',
                render: value => value || 0
            }, {
                title: '泊位数',
                dataIndex: 'spaceCount',
                className: 'colMinWidth',
                render: value => value || 0
            }, {
                title: '所属区域',
                dataIndex: 'areaName',
                className: 'colMinWidth'
            }, {
                title: '描述',
                dataIndex: 'remark',
                className: 'remark-col-maxWidth'
            }, {
                title: '操作',
                dataIndex: 'action',
                width: 120,
                render: (value, row) => (
                    <Fragment>
                        <a onClick={() => this.editArea(row)}>编辑</a>
                        <Divider type="vertical"/>
                        <Popconfirm
                            placement="topRight"
                            title={`你确定删除该片区？`}
                            onConfirm={() => this.deleteArea(row.id)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <a>删除</a>
                        </Popconfirm>
                    </Fragment>
                )
            }
        ];
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>片区管理</div>
                </div>
                <div className='page-content'>
                    <Form>
                        <Row gutter={40}>
                            <Col span={8}>
                                <FormItem label='片区名称' {...formModalLayout}>
                                    {getFieldDecorator('subAreaName')(
                                        <Input placeholder='请输入' onChange={(e) => {
                                            this.payLoad.subAreaName = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label='行政区' {...formModalLayout}>
                                    {getFieldDecorator('district')(
                                        <ChinaRegion placeholder='请输入' onChange={(values) => {
                                            const districtInfo = ['provinceId', 'cityId', 'areaId'];
                                            values.forEach((item, index) => {
                                                this.payLoad[districtInfo[index]] = item
                                            })
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <Button type='primary' onClick={() => this.search()}
                                        style={{ marginRight: 15 }}>查询</Button>
                                <Button style={{ marginRight: 15 }} onClick={() => this.handleReset()}>重置</Button>
                                <Button type='primary' style={{ marginRight: 15 }}
                                        onClick={() => location.hash = `${location.hash}/AddArea`}>添加</Button>
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

                {/*查看已选考勤点*/}
                <Modal
                    visible={checkPointsVisible}
                    title='查看地址'
                    destroyOnClose
                    maskClosable={false}
                    onOk={() => {
                        this.setState({
                            checkPointsVisible: false
                        })
                    }}
                    onCancel={() => {
                        this.setState({
                            checkPointsVisible: false
                        })
                    }}
                    footer={null}
                    bodyStyle={{ margin: 0 }}
                    width={900}
                >
                    <CheckAddressModal
                        checkPoints={checkPoints}
                    />
                </Modal>
            </div>
        );
    }
}

export default Form.create()(AreaManage);
