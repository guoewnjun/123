import React, {Component, Fragment} from 'react';
import {Button, Table, DatePicker, Select, Pagination, Form, Row, Col, Spin, Tooltip} from 'antd';
import moment from 'moment';
import {HttpClient} from "@/common/HttpClient";

import './Style/FinancialManage.css';
import Exception from "@/components/Exception";
import {StringUtil} from "@/common/SystemFunction";

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class ParkingRevenueAndExpenditureDetails extends Component {

    constructor(props) {
        super(props);
        this.ordersDetailTableExcelUrl = '/parking-orders/dataAnalysis/ordersDetailTableExcel'; //停车记录明细列表导出
        this.globalUrl = '/parking-orders/dataAnalysis/ordersDetailTable';
    }

    state = {
        loading: false,
        pageNum: 1, //当前页
        pageSize: 10, //一页限制多少数据
        total: 1, //数据总条数
        optionalParams: {
            partnerCompanyId: window.currentIsSystemAdmin ? null : localStorage.getItem('partnerCompanyId'),//合作方id
            parkId: null,//路段id
            inspectionGroupId: null, //稽查组id
            startDate: moment().add(-1, 'd').startOf('day').format('YYYY-MM-DD HH:mm:ss'),//开始时间
            endDate: moment().add(-1, 'd').endOf('day').format('YYYY-MM-DD HH:mm:ss'),//结束时间
        },
        FinancialDetailRecord: [],
        financialReportDownload: window.getPerValue('financialReportDownload'), //是否拥有下载按钮权限点
        passCompanyList: [], // 已审核合作方列表
        parkingOfPartnerCompany: [], //对应合作方公司所属路段
        partnerCompanyName: '',  //合作方公司名
        parkingName: '', //路段名
    };

    componentWillMount() {

    }

    componentDidMount() {
        if (window.currentIsSystemAdmin) { // 运营方
            this.loadData(this.state.optionalParams);
            // 获取所有合作公司
            HttpClient.query(window.MODULE_PARKING_INFO + '/admin/reviewPassCompany', 'GET', null, (d, type) => {
                if (type === HttpClient.requestSuccess) {
                    this.setState({
                        passCompanyList: d.data
                    });
                }
            });
            // 获取所有所做公司所属路段
            HttpClient.query(window.MODULE_PARKING_RESOURCE + '/admin/resource/parking/getParkingByPartnerCompany', 'GET', null, (d, type) => {
                if (type === HttpClient.requestSuccess) {
                    this.setState({
                        parkingOfPartnerCompany: d.data
                    })

                }
            })
        } else { // 合作方
            const param = {
                partnerCompanyId: localStorage.getItem('partnerCompanyId')
            };
            // 获取合作方当前公司所属路段
            HttpClient.query(window.MODULE_PARKING_RESOURCE + '/admin/resource/parking/getParkingByPartnerCompany', 'GET', param, (d, type) => {
                if (type === HttpClient.requestSuccess) {
                    this.setState({
                        parkingOfPartnerCompany: d.data
                    })

                }
            });
            this.setState({
                optionalParams: {
                    ...this.state.optionalParams,
                    partnerCompanyId: param.partnerCompanyId
                },
                partnerCompanyName: localStorage.getItem('partnerCompanyName')
            }, () => {
                this.loadData(this.state.optionalParams);
            });
        }
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
    queryList () {
        const params = this.state.optionalParams;
        this.setState({
            pageNum: 1
        });
        this.loadData(params, 1, this.state.pageSize)
    }

    // 重置
    resetParams() {
        this.props.form.resetFields();
        let partnerCompanyId = window.currentIsSystemAdmin ? null : localStorage.getItem('partnerCompanyId');
        this.setState({
            pageNum: 1, //当前页
            pageSize: 10, //一页限制多少数据
            FinancialDetailRecord: [],
            parkingName: '',
            partnerCompanyName: '',
            optionalParams: {
                partnerCompanyId: partnerCompanyId,//合作方id
                parkId: null,//路段id
                startDate: moment().add(-1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),//开始时间
                endDate: moment().add(-1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss'),//结束时间
            }
        }, () => {
            this.loadData(this.state.optionalParams)
        })
    }

    // 导出
    exportList() {
        const { optionalParams: { partnerCompanyId, parkId, startDate, endDate }, partnerCompanyName, parkingName } = this.state;
        let paramsArr = [];
        let obj = {
            partnerCompanyId,
            partnerCompanyName,
            parkId,
            parkingName,
            startDate,
            endDate
        };
        for (let item in obj) {
            if (obj[item]) {
                const str = `${item}=${obj[item]}`;
                paramsArr.push(str)
            }
        }
        paramsArr.push(`token=Bearer ${window.customCookie.get('access_token')}`);
        const url = `${this.ordersDetailTableExcelUrl}?${paramsArr.join('&')}`;
        let downloadHtml = (
            <a target="_blank" href={HttpClient.ClientHost + url}>
                <Button icon='save' type='primary'>
                    <span style={{ color: "white", marginLeft: 5 }}>导出</span>
                </Button>
            </a>
        );
        return downloadHtml;
    }

    // 财报停车记录明细列表页
    onReportDetailTabClick() {
        if (this.state.loading) return;
        const optionalParams = {
            ...this.state.optionalParams,
            inspectionGroupId: null,
            startDate: moment().add(-1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),//开始时间
            endDate: moment().add(-1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss'),//结束时间
        };
        this.props.form.setFieldsValue({
            RangeTime: [moment().add(-1, 'days').startOf('day'), moment().add(-1, 'days').endOf('day')]
        });
        this.setState({
            FinancialSummaryRecord: [],
            InspectionChargeRecord: [],
            pageNum: 1,
            pageSize: 10,
            optionalParams,
        }, () => {
            this.loadData(this.state.optionalParams, this.state.pageNum, this.state.pageSize)
        });
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

    // 选择合作方公司
    onPartnerCompany(value) {
        this.state.partnerCompanyName = value && value.label;
        this.state.optionalParams.partnerCompanyId = value ? parseInt(value.key) : null;
        if (this.state.optionalParams.parkId) {
            this.props.form.resetFields('parkId');
            this.state.optionalParams.parkId = null;
            this.state.parkingName = '';
        }
        let param = {};
        if (this.state.optionalParams.partnerCompanyId) {
            param.partnerCompanyId = this.state.optionalParams.partnerCompanyId
        } else {
            param = null
        }
        HttpClient.query(window.MODULE_PARKING_RESOURCE + '/admin/resource/parking/getParkingByPartnerCompany', 'GET', param, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    parkingOfPartnerCompany: d.data
                })
            }
        })
    }

    render() {
        /*if (!window.window.checkPageEnable('/FinancialReportsDownload')) {
            return <Exception type='403'/>
        }*/
        const { loading, FinancialDetailRecord, pageNum, pageSize, total, financialReportDownload, optionalParams } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        const columnsDetail = [
            {
                title: '订单号',
                dataIndex: 'orderId',
                fixed: 'left',
                width: 270,
            }, {
                title: '车辆进场时间',
                dataIndex: 'inTime',
                sorter: (a, b) => {
                    let aTime = moment(a.outTime).unix() || 0;
                    let bTime = moment(b.outTime).unix() || 0;
                    return aTime - bTime;
                },
                render: (text) => (text ? text : '--'),
            }, {
                title: '车辆出场时间',
                dataIndex: 'outTime',
                sorter: (a, b) => {
                    let aTime = moment(a.outTime).unix() || 0;
                    let bTime = moment(b.outTime).unix() || 0;
                    return aTime - bTime;
                },
                render: (text) => (text ? text : '--'),
            }, {
                title: '停车时长(分钟)',
                dataIndex: 'realTime',
            }, {
                title: '车牌号',
                dataIndex: 'plateNumber',
            }, {
                title: '所属路段',
                dataIndex: 'parkingName',
                render: (value) => {
                    let strDom = null;
                    if (value) {
                        if (StringUtil.getStrFullLength(value) > 30) {
                            strDom = (
                                <Tooltip title={value}>
                                    <span>{`${StringUtil.cutStrByFullLength(value, 20)}...`}</span>
                                </Tooltip>
                            )
                        } else {
                            strDom = <span>{value}</span>
                        }
                    }
                    return strDom || '--'
                }
            }, {
                title: '应收金额(元)',
                dataIndex: 'totalPrice',
                render: (text) => (text ? text : 0),
                sorter: (a, b) => (Number(a.totalPrice) || 0) - (Number(b.totalPrice) || 0),
            }, {
                title: '优惠类型',
                dataIndex: 'appliedCouponTypeName',
                render: (text) => (text ? text : '--'),
            }, {
                title: '优惠金额(元)',
                dataIndex: 'appliedCouponAmount',
                render: (text) => (text ? text : 0),
            }, {
                title: '实际应收总金额(元)',
                dataIndex: 'realPrice',
                render: (text) => (text ? text : 0),
            }, {
                title: '实际收到总金额(元)',
                dataIndex: 'receiveMoney',
                render: (text) => (text ? text : 0),
            }, {
                title: '当前尚欠费金额(元)',
                dataIndex: 'reminderMoney',
                render: (text) => (text ? text : 0),
            }, {
                title: '当前已退金额(元)',
                dataIndex: 'refundMoney',
                render: (text) => (text ? text : 0),
            }, {
                title: '实开发票金额(元)',
                dataIndex: 'invoiceAmount',
                render: (text) => (text ? text : 0),
            }
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
                    <div>停车记录收支明细</div>
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
                                {
                                    window.currentIsSystemAdmin && (
                                        <Col span={8}>
                                            <FormItem label='合作方' {...formItemLayout}>
                                                {getFieldDecorator('partnerCompanyId')(
                                                    <Select onChange={this.onPartnerCompany.bind(this)}
                                                            showSearch
                                                            placeholder="请输入"
                                                            allowClear
                                                            labelInValue
                                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                        {
                                                            this.state.passCompanyList.map((item, index) => (
                                                                <Option key={index}
                                                                        value={item.id}>{item.partnerCompanyName}</Option>
                                                            ))
                                                        }
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    )
                                }
                                <Col span={8}>
                                    <FormItem label='路段名称' {...formItemLayout}>
                                        {getFieldDecorator('parkId')(
                                            <Select
                                                showSearch
                                                placeholder="请输入"
                                                allowClear
                                                labelInValue
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                onChange={value => {
                                                    this.state.parkingName = value && value.label;
                                                    this.state.optionalParams.parkId = value ? parseInt(value.key) : null;
                                                }}>
                                                {
                                                    this.state.parkingOfPartnerCompany.map(item => (
                                                            <Option value={item.id}
                                                                    key={item.id}>{item.parkingName}</Option>
                                                        )
                                                    )
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                { // 为运营方时，没有合作方选择框，一行布局
                                    !window.currentIsSystemAdmin && (
                                        <Col span={8}>
                                            {queryButton}
                                        </Col>
                                    )
                                }
                            </Fragment>
                        </Row>
                        {
                            window.currentIsSystemAdmin && (
                                <Row style={{ textAlign: 'right' }}>
                                    {queryButton}
                                </Row>
                            )
                        }
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
                                rowKey={data => data.orderId}
                                columns={columnsDetail}
                                dataSource={FinancialDetailRecord}
                                scroll={{ x: '200%' }}
                                pagination={false}
                            />
                            {/*分页*/}
                            {(FinancialDetailRecord.length > 0) ? (
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

const WrapperParkingRevenueAndExpenditureDetails = Form.create()(ParkingRevenueAndExpenditureDetails);
export default WrapperParkingRevenueAndExpenditureDetails;
