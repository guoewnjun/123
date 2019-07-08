import React, { Component } from 'react';
import { Button, Form, Table, Row, Col, Input, Spin, Card, Select, Radio, Timeline, message } from 'antd';
import { HttpClient } from "@/common/HttpClient";

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

class FacilityMaintenanceDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uId: this.props.location.query.id,
            xianshi: false,
            loading: false, //表格加载状态
            datum: {},
            lists: [],
            adminList: []       //运营人员列表
        }
    }


    loadData() {
        let uId = null;
        this.setState({
            loading: true
        });

        if (!this.state.uId) {
            this.setState({
                uId
            })
        } else {
            uId = this.state.uId
        }
        HttpClient.query(`/parking-resource/road/maintenance/warning/device/dispose/detail?id=${uId}`, 'GET', null, this.handleQueryData.bind(this))
        HttpClient.query(`/parking-resource/road/maintenance/warning/device/dispose/history?id=${uId}`, 'GET', null, this.handleQueryData2.bind(this))
        HttpClient.query(`/parking-info/admin/user/simple/maintenance`, 'GET', null, this.handleGetMaintenance.bind(this))
    }

    //获取工单详情
    handleQueryData(d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            this.setState({
                datum: data,
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    //获取工单处理记录
    handleQueryData2(d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            this.setState({
                lists: data,
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    handleGetMaintenance(d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            this.setState({
                adminList: data,
            })
        } else {
            //失败----做除了报错之外的操作
        }
    }

    chuli(e) {
        this.setState({
            xianshi: true,
        })
    }

    refer() {
        let params = {};
        params.id = this.state.datum.id;
        this.props.form.validateFields((err, values) => {
            if (err) return;
            params.disposeType = values.disposeType
            params.disposer = values.disposer
            params.content = values.content
            // console.log(params)
            HttpClient.query(`/parking-resource/road/maintenance/warning/device/dispose/dispose`, 'GET', params, (d, type) => {
                if (type === HttpClient.requestSuccess) {
                    message.success('提交成功')
                    this.loadData();
                    this.props.form.resetFields();
                    this.setState({
                        xianshi: false
                    })
                } else {
                    //失败----做除了报错之外的操作
                }
            })
        })
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        this.loadData();
    }

    // 组件卸载之前
    componentWillUnmount() {
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { uId, xianshi, loading, datum, lists, adminList } = this.state;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        // const lists=[
        //     {shijian:'12:00', neirong:'................'},
        //       {shijian:'12:00', neirong:'...........'},
        //         {shijian:'12:00', neirong:'........'},
        //           {shijian:'12:00', neirong:'............'},
        // ];

        const listItem = lists.map((str) =>
            <Timeline.Item key={str.id}>
                {str.createTime + '  --------  '}{str.opinion}
            </Timeline.Item>
        );
        const gongdanchuli = () => {
            if (xianshi) {
                return (
                    <Card title='工单处理'>
                        <div style={{ width: '55%', }}>
                            <Row>
                                <Col span={24}>
                                    <FormItem label='工单状态' {...formItemLayout}>
                                        {getFieldDecorator('disposeType', {
                                            rules: [{
                                                required: true,
                                                whitespace: true,
                                                message: '请选择工单状态'
                                            }]
                                        })(
                                            <Select placeholder="请选择" style={{ width: '200px' }}>
                                                <Option value="自行处理中">自行处理中</Option>
                                                <Option value="厂家处理中">厂家处理中</Option>
                                                <Option value="验收中">验收中</Option>
                                                <Option value="工单完成">工单完成</Option>
                                            </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={24} style={{ marginTop: '20px' }}>
                                    <FormItem label='指派' {...formItemLayout}>
                                        {getFieldDecorator('disposer', {
                                            rules: [{
                                                required: true,
                                                whitespace: true,
                                                message: '请选择指派人员'
                                            }]
                                        })(
                                            <Select placeholder='请选择' style={{ width: '200px', }}>
                                                {adminList.map((item, index) => {
                                                    return (<Option value={item.name} key={item.id}>{item.name}</Option>)
                                                })}
                                            </Select>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label='处理说明' {...formItemLayout}>
                                        {getFieldDecorator('content', {
                                            rules: [{
                                                required: true,
                                                whitespace: true,
                                                message: '请输入处理说明'
                                            }]
                                        })(
                                            <TextArea rows={6} style={{ width: '500px' }} />)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <Button type='primary' onClick={this.refer.bind(this)} style={{ marginLeft: '150px' }}>提交</Button>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                )
            } else {
                return '';
            }
        }


        const gettime = (str) => {
            if (!str) return
            const arr = str.split("T");
            const d = arr[0];
            const darr = d.split('-');
            const t = arr[1];
            const tarr = t.split('.000');
            const marr = tarr[0].split(':');
            const dd = parseInt(darr[0]) + "/" + parseInt(darr[1]) + "/" + parseInt(darr[2]) + " " + parseInt(marr[0]) + ":" + parseInt(marr[1]) + ":" + parseInt(marr[2]);
            //console.log(parseInt(marr[0])+"点");
            return dd;
        };

        return (
            <div className='page'>
                <div className='page-header '>
                    <div style={{ height: 40 }}>
                        <div style={{
                            width: '60%',
                            float: 'left',
                        }}>
                            <label>工单编号：</label>
                            <span style={{ marginLeft: '20px' }}>{this.state.uId}</span>
                        </div>
                        <div style={{
                            width: '5%',
                            float: 'right',
                        }}>
                            <Button type='primary' onClick={() => { window.history.back() }}>返回</Button>
                        </div>
                    </div>
                    <div className='page-content page-content-transparent'>
                        <Spin spinning={loading}>
                            <Card title='设备信息' >
                                <Row>
                                    <Col span={8} style={{ marginLeft: '30px' }}>
                                        <label>路段名称：</label>
                                        <span>{datum.parkingName || '---'}</span>
                                    </Col>
                                    <Col span={8} style={{ marginLeft: '70px' }}>
                                        <label>关联车位：</label>
                                        <span>{datum.parkingSpaces}</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} style={{ marginLeft: '30px' }}>
                                        <label>设备类型：</label>
                                        <span>{datum.deviceType || '---'}</span>
                                    </Col>
                                    <Col span={8} style={{ marginLeft: '70px' }}>
                                        <label>设备型号：</label>
                                        <span>{datum.deviceModel || '---'}</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} style={{ marginLeft: '30px' }}>
                                        <label>设备ID：</label>
                                        <span>{datum.deviceId || '---'}</span>
                                    </Col>
                                    <Col span={8} style={{ marginLeft: '70px' }}>
                                        <label>硬件ID：</label>
                                        <span>{datum.hardwareId || '---'}</span>
                                    </Col>
                                    <Col span={8} style={{ marginLeft: '30px' }}>
                                        <label>设备厂家：</label>
                                        <span>{datum.factory || '---'}</span>
                                    </Col>
                                    <Col span={8} style={{ marginLeft: '70px' }}>
                                        <label>设备地址：</label>
                                        <span>{datum.address || '---'}</span>
                                    </Col>
                                    <Col span={8} style={{ marginLeft: '30px' }}>
                                        <label>设备状态：</label>
                                        <span>{datum.online || '---'}</span>
                                    </Col>
                                </Row>
                            </Card>
                            <Card title='工单基本信息' >
                                <Row>
                                    <Col span={8} style={{ marginLeft: '30px' }}>
                                        <label>工单编号：</label>
                                        <span >{this.state.uId || '---'}</span>
                                    </Col>
                                    <Col span={8} style={{ marginLeft: '70px' }}>
                                        <label>工单标题：</label>
                                        <span >{datum.caption || '---'}</span>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col span={8} style={{ marginLeft: '30px' }}>
                                        <label>工单内容：</label>
                                        <span>{datum.content || '---'}</span>
                                    </Col>
                                    <Col span={8} style={{ marginLeft: '70px' }}>
                                        <label>工单状态：</label>
                                        <span>{datum.state || '---'}</span>
                                    </Col>
                                </Row>
                                <Row>

                                    <Col span={8} style={{ marginLeft: '30px' }}>
                                        <label>优先级：</label>
                                        <span>{datum.priority || '---'}</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} style={{ marginLeft: '30px' }}>
                                        <label>工单发起人：</label>
                                        <span>{datum.operator || '手机APP'}</span>
                                    </Col>
                                    <Col span={8} style={{ marginLeft: '70px' }}>
                                        <label>创建时间：</label>
                                        <span>{gettime(datum.createTime) || '2019-05-05 21:20'}</span>
                                    </Col>
                                </Row>
                            </Card>
                            <Card title='处理记录'>
                                <Row>
                                    <Col span={16} style={{ marginLeft: '30px' }}>
                                        <Timeline>
                                            {listItem}
                                        </Timeline>
                                    </Col>
                                    {datum.state != '工单完成' ?
                                        <Col span={6} style={{ marginLeft: '30px' }}>
                                            <Button type='primary' onClick={(e) => { this.chuli(e) }} style={{ marginTop: '40px' }}>处理</Button>
                                        </Col> : ''}
                                </Row>
                            </Card>
                            {gongdanchuli()}
                        </Spin>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form.create()(FacilityMaintenanceDetails)
