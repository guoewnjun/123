import React, {Component, Fragment} from 'react';

import {Button, Table, DatePicker, Select, Pagination, Form, Row, Col, Spin} from 'antd';
import moment from 'moment';
import {HttpClient} from "@/common/HttpClient";

import './Style/FinancialManage.css';
// import Exception from "@/components/Exception";
// import {StringUtil} from "@/common/SystemFunction";

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

// 稽查收费记录表
class InspectionChargeList extends Component {
    constructor(props) {
        super(props);
        this.payRecorderUrl = '/parking-inspection/assistant/payRecord/getListByExcel'; //辅助收费导出
        this.globalUrl = '/parking-inspection/assistant/payRecord/getList';
    }

    state = {
        loading: false,
        pageNum: 1, //当前页
        pageSize: 10, //一页限制多少数据
        total: 1, //数据总条数
        optionalParams: {
            inspectionGroupId: null, //稽查组id
            startDate: moment().add(-1, 'd').startOf('day').format('YYYY-MM-DD HH:mm:ss'),//开始时间
            endDate: moment().add(-1, 'd').endOf('day').format('YYYY-MM-DD HH:mm:ss'),//结束时间
        },
        InspectionChargeRecord: [],
        financialReportDownload: window.getPerValue('financialReportDownload'), //是否拥有下载按钮权限点
        inspectionList: [], //稽查组列表
    };

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        // 获取所有稽查组
        HttpClient.query(window.MODULE_PARKING_INSPECTION + '/inspection/group/getSimpleList', 'GET', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    inspectionList: d.data
                });
            }
        });
        this.getInspectionCharge()
    }

    // 稽查收费记录表
    getInspectionCharge() {
        const optionalParams = {
            ...this.state.optionalParams,
            startDate: moment().add(-1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),//开始时间
            endDate: moment().add(-1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss'),//结束时间
        };
        this.props.form.setFieldsValue({
            RangeTime: [moment().add(-1, 'days').startOf('day'), moment().add(-1, 'days').startOf('day')]
        });
        this.setState({
            pageNum: 1,
            pageSize: 10,
            optionalParams
        }, () => {
            this.loadData(this.state.optionalParams, this.state.pageNum, this.state.pageSize)
        });
    }

    // 组件卸载之前
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
            data.list.forEach((item, index) => {
                item.id = index;
            });
            this.setState({
                InspectionChargeRecord: data.list
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
    queryList() {
        const params = this.state.optionalParams;
        this.setState({
            pageNum: 1
        });
        this.loadData(params, 1, this.state.pageSize)
    }

    // 重置
    resetParams() {
        this.props.form.resetFields();
        this.setState({
            pageNum: 1, //当前页
            pageSize: 10, //一页限制多少数据
            optionalParams: {
                inspectionGroupId: null,
                startDate: moment().add(-1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),//开始时间
                endDate: moment().add(-1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss'),//结束时间
            }
        }, () => {
            this.loadData(this.state.optionalParams)
        })
    }

    // 导出
    exportList() {
        const { optionalParams: { inspectionGroupId, startDate, endDate } } = this.state;
        let paramsArr = [];
        let obj = {
            inspectionGroupId,
            startDate,
            endDate,
        };
        for (let item in obj) {
            if (obj[item]) {
                const str = `${item}=${obj[item]}`;
                paramsArr.push(str)
            }
        }
        paramsArr.push(`token=Bearer ${window.customCookie.get('access_token')}`);
        const url = `${this.payRecorderUrl}?${paramsArr.join('&')}`;
        let downloadHtml = (
            <a target="_blank" href={HttpClient.ClientHost + url}>
                <Button icon='save' type='primary'>
                    <span style={{ color: "white", marginLeft: 5 }}>导出</span>
                </Button>
            </a>
        );
        return downloadHtml;
    }

    // 页面变化
    onPageChange(pageNum) {
        this.setState({
            pageNum
        }, () => {
            this.loadData(this.state.optionalParams, pageNum, this.state.pageSize)
        })
    }

    // 页面限制大小变化
    onShowSizeChange(pageNum, pageSize) {
        this.setState({
            pageNum,
            pageSize
        }, () => {
            this.loadData(this.state.optionalParams, pageNum, pageSize)
        })
    }

    render() {
        /*if (!window.window.checkPageEnable('/InspectionChargeList')) {
            return <Exception type='403'/>
        }*/
        const { loading, InspectionChargeRecord, pageNum, pageSize, total, financialReportDownload, optionalParams } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const columnsInspection = [
            {
                title: '时间',
                dataIndex: 'date',
                width: 150,
                fixed: 'left',
            }, {
                title: '稽查组',
                dataIndex: 'inspectionGroupName',
                width: 250,
            }, {
                title: '管辖范围',
                dataIndex: 'inspectionGroupCheckRange',
            }, {
                title: '稽查人员',
                dataIndex: 'adminUserName',
                className: 'InspectionOtherCol'
            }, {
                title: '单日收费单数',
                dataIndex: 'parkOrderTotal',
                className: 'InspectionOtherCol'
            }, {
                title: '单日收费总金额(元)',
                dataIndex: 'payAmount',
                className: 'InspectionPayAmount',
                sorter: (a, b) => a.payAmount - b.payAmount,
                render: (value) => (
                    <span>{value} 元</span>
                )
            },
        ];
        const queryButton = (
            <Fragment>
                <Button type='primary'
                        onClick={this.queryList.bind(this)}>查询</Button>
                <Button style={{ marginLeft: '20px' }}
                        onClick={this.resetParams.bind(this)}>重置</Button>
            </Fragment>
        );
        return (
            <div className='page'>
                {/*header*/}
                <div className='page-header'>
                    <div>稽查收费记录表</div>
                </div>
                {/*content*/}
                <div className='page-content'>
                    <Form className='reportForm'>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='选择日期' {...formItemLayout}>
                                    {getFieldDecorator('RangeTime', {
                                        initialValue: [moment(optionalParams.startDate), moment(optionalParams.endDate)]
                                    })(
                                        <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD"
                                                     disabledDate={(current) => current && current > moment().add(-1, 'day').startOf('day')}
                                                     onChange={(dates, dateStrings) => {
                                                         this.state.optionalParams.startDate = dateStrings[0] ? dateStrings[0] + ' 00:00:00' : null;
                                                         this.state.optionalParams.endDate = dateStrings[1] ? dateStrings[1] + ' 23:59:59' : null;
                                                     }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Fragment>
                                <Col span={8}>
                                    <FormItem label='稽查组' {...formItemLayout}>
                                        {getFieldDecorator('inspectionGroup')(
                                            <Select
                                                showSearch
                                                placeholder="请输入"
                                                allowClear
                                                labelInValue
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                onChange={value => {
                                                    // this.state.parkingName = value && value.label;
                                                    this.state.optionalParams.inspectionGroupId = value ? parseInt(value.key) : null;
                                                }}>
                                                {
                                                    this.state.inspectionList.map(item => (
                                                            <Option value={item.id}
                                                                    key={item.id}>{item.groupName}</Option>
                                                        )
                                                    )
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    {queryButton}
                                </Col>
                            </Fragment>
                        </Row>
                    </Form>
                    {
                        financialReportDownload && (
                            <Row>
                                {this.exportList()}
                            </Row>
                        )
                    }
                    <Row>
                        {/*表格*/}
                        <Spin tip="加载中.." spinning={loading}>
                            <Table
                                style={{ marginTop: '20px' }}
                                rowKey={data => data.id}
                                columns={columnsInspection}
                                dataSource={InspectionChargeRecord}
                                pagination={false}
                                scroll={{ x: '120%' }}
                            />
                            {/*分页*/}
                            {InspectionChargeRecord.length > 0 ? (
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
                                    <div style={{ clear: 'both' }}>
                                    </div>
                                </div>
                            ) : ''}
                        </Spin>
                    </Row>
                </div>
            </div>
        );
    }
}

const WrapperInspectionChargeList = Form.create()(InspectionChargeList);
export default WrapperInspectionChargeList;
