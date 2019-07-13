import React, { Component } from 'react';

import {
    Card, Row, Col, Button, Form, Select, Input, Radio, message
} from 'antd';
import { HttpClient } from "@/common/HttpClient";
// import ImagePreview from '../../components/ImagePreview/';
// import _ from 'lodash';
import './Style/ParkingRecord.css'

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


class ComplaintDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,//显示处理页面
            switchover: 1, //切换处理页面
            nengbunengtian: true,
            uId: this.props.location.query.id || '',
            complaintsInfo: {},
            disposedInfo: {},
            opinionEntry: [],
            opinionTitleList: [],
            adminList: []
        }
    }

    // 组件挂载之前
    componentWillMount() {

    }

    // 组件挂载后
    componentDidMount() {
        HttpClient.query(`/parking-person-info/business/complaints/detail/disposed?id=${this.state.uId}`, 'GET', null, this.parkingDetail.bind(this));
        this.getOpinionEntry();
        this.getAdminList();
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    // 获取意见词条
    getOpinionEntry() {
        HttpClient.query(`/parking-info/dictionary/opinion`, 'GET', null, (d, type) => {
            const data = d.data;
            if (type === HttpClient.requestSuccess) {
                //成功-------在这里做你的数据处理
                this.setState({
                    opinionEntry: data[0].list,
                });
            } else {
                //失败----做除了报错之外的操作
            }
        });
    }

    //获取客服人员列表
    getAdminList() {
        HttpClient.query(`/parking-info/admin/user/simple/complaints`, 'GET', null, (d, type) => {
            const data = d.data;
            if (type === HttpClient.requestSuccess) {
                //成功-------在这里做你的数据处理
                this.setState({
                    adminList: data,
                });
            } else {
                //失败----做除了报错之外的操作
            }
        });
    }

    // 获取投诉详情
    parkingDetail(d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            this.setState({
                complaintsInfo: data.complaintsInfo,
                disposedInfo: data.disposeInfo
            });
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    checkAppealDetail() {
        window.location.history.back(-1);
    }

    // 投诉处理
    chuli(e) {
        this.setState({
            show: true,
        })
    }

    // 处理工单
    switchover(value, option) {
        this.setState({
            switchover: value,
        })
    }

    //取消按钮
    quxiao(e) {
        this.setState({
            show: false,
            switchover: 1
        })
    }

    //提交按钮
    tijiao(e) {
        let params = {};
        params.id = this.state.uId;
        this.props.form.validateFields((err, values) => {
            switch (values.complainStatus) {
                case '1':
                    params.state = '结案'
                    params.content = values.closeContent
                    params.isAdvise = values.sendMessage == 2 ? true : false
                    if (!params.content) {
                        message.error('请输入结案内容')
                        return
                    }
                    break;
                case '2':
                    params.state = '生成工单'
                    params.caption = values.workOrderTitle
                    params.priority = values.priority
                    this.state.adminList.map(item => {
                        if (item.id == values.adminId) {
                            params.toDisposer = item.name
                            params.toDisposerId = item.id
                        }
                    })
                    params.content = values.workOrderContent
                    if (!params.caption || !params.priority || !params.toDisposer || !params.content) {
                        message.error('请完整填写信息')
                        return
                    }
                    break;
                case '3':
                    params.state = '关闭'
                    if (values.close == 1) {
                        params.content = '无效内容'
                    } else if (values.close == 2) {
                        params.content = '问题不存在'
                    } else if (values.closeReason) {
                        params.content = values.closeReason
                    } else {
                        message.error('请输入原因')
                        return
                    }
                    break;
            }
            HttpClient.query(`/parking-person-info/business/complaints/dispose`, 'POST', params, (d, type) => {
                const data = d.data;
                if (type === HttpClient.requestSuccess) {
                    //成功-------在这里做你的数据处理
                    // this.setState({
                    //     adminList: data,
                    // });
                } else {
                    //失败----做除了报错之外的操作
                }
            });
        })
    }
    gaibian(value) {
        if (value.target.value == '3') {
            this.setState({
                nengbunengtian: false,
            })
        } else {
            this.setState({
                nengbunengtian: true,
            })
        }
    }

    //处理意见分类选择
    handleOpinionType(type) {
        this.state.opinionEntry.map((item) => {
            if (item.type == type) {
                this.setState({
                    opinionTitleList: item.list
                })
            }
        })
    }

    //处理添加意见
    handleAddOpinion() {
        let opinionContent;
        let closeContent;
        this.props.form.validateFields((err, values) => {
            if (values.opinionContent != undefined) {
                opinionContent = values.opinionContent
                closeContent = values.closeContent || ''
            } else {
                message.error('请选择常用意见')
            }
        })
        if (opinionContent != undefined) {
            this.props.form.setFieldsValue({
                closeContent: closeContent ? closeContent + '\n' + opinionContent : opinionContent
            })
        }
    }

    render() {
        const { show, switchover, nengbunengtian, complaintsInfo, opinionEntry, opinionTitleList, adminList } = this.state;

        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        const chulijilu = () => {
            if (show) {
                if (switchover == "1") {
                    return (
                        <Card
                            title="投诉处理"
                            className="baseInfo"
                        >
                            <Form>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label='投诉状态' {...formItemLayout}>
                                            {getFieldDecorator('complainStatus', { initialValue: '1' })(
                                                <Select initialValue="1" onChange={this.switchover.bind(this)}>
                                                    <Option value="1">结案</Option>
                                                    <Option value="2">生成工单</Option>
                                                    <Option value="3">关闭</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10} style={{ marginLeft: 25, paddingLeft: 10 }}>
                                        <div style={{ background: "#F5F5F5", paddingLeft: '20px', borderWidth: "1", borderStyle: "solid", borderColor: "rgba(215, 215, 215, 1)", borderRadius: "0", }}>
                                            温馨提示：该内容可能以短信方式发送给用户，请认真填写！
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "25px" }}>
                                    <Col span={8}>
                                        <FormItem label="常用意见" {...formItemLayout}>
                                            <Select placeholder='请选择意见分类' onChange={this.handleOpinionType.bind(this)}>
                                                {
                                                    opinionEntry.map((item, index) => {
                                                        return (
                                                            <Option key={index} value={item.type} > {item.type}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={6} style={{ marginLeft: "10px" }}>
                                        <FormItem>
                                            {getFieldDecorator('opinionContent')(
                                                <Select placeholder='请选择意见标题'>
                                                    {
                                                        opinionTitleList.map((item, index) => {
                                                            return (
                                                                <Option key={index} value={item.content}>{item.caption}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6} style={{ marginLeft: "10px" }}>
                                        <Button onClick={this.handleAddOpinion.bind(this)}>添加意见</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} >
                                        <FormItem label="结案内容" {...formItemLayout}>
                                            {getFieldDecorator('closeContent')(
                                                <TextArea rows={5}
                                                    placeholder="请输入结案"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} >
                                        <FormItem label="给用户发短信" {...formItemLayout}>
                                            {getFieldDecorator('sendMessage', { initialValue: 1 })(
                                                <Radio.Group>
                                                    <Radio value={1}>否</Radio>
                                                    <Radio value={2}>是</Radio>
                                                </Radio.Group>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4} style={{ textAlign: "center" }}>
                                        <Button onClick={(e) => { this.quxiao(e) }}>
                                            <span>取消</span>
                                        </Button>
                                        <Button type="primary" onClick={(e) => { this.tijiao(e) }} style={{ marginLeft: 20, }}>
                                            <span style={{ color: 'white' }}>提交</span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    )
                } else if (switchover == "2") {
                    return (
                        <Card
                            title="投诉处理"
                            className="baseInfo"
                        >
                            <Form>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label='投诉状态' {...formItemLayout}>
                                            {getFieldDecorator('complainStatus')(
                                                <Select initialValue="1" onChange={this.switchover.bind(this)}>
                                                    <Option value="1">结案</Option>
                                                    <Option value="2">生成工单</Option>
                                                    <Option value="3">关闭</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label="工单标题" {...formItemLayout}>
                                            {getFieldDecorator('workOrderTitle')(
                                                <Input placeholder="请输入工单标题" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <Col span={12} style={{ marginRight: "-30%" }}>
                                            <FormItem label="优先级" {...formItemLayout}>
                                                {getFieldDecorator('priority')(
                                                    <Select placeholder="请选择">
                                                        <Option value="一般">一般</Option>
                                                        <Option value="紧急">紧急</Option>
                                                        <Option value="立即处理">立即处理</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12} style={{ float: "right" }}>
                                            <FormItem label="指派" {...formItemLayout}>
                                                {getFieldDecorator('adminId')(
                                                    <Select placeholder="请选择">
                                                        {
                                                            adminList.map((item, index) => {
                                                                return (
                                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} >
                                        <FormItem label="工单内容" {...formItemLayout}>
                                            {getFieldDecorator('workOrderContent')(
                                                <TextArea rows={5}
                                                    placeholder="请输入工单内容"
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4} style={{ textAlign: "center" }}>
                                        <Button onClick={(e) => { this.quxiao(e) }}>
                                            <span>取消</span>
                                        </Button>
                                        <Button type="primary" onClick={(e) => { this.tijiao(e) }} style={{ marginLeft: 20, }}>
                                            <span style={{ color: 'white' }}>提交</span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    )
                } else {
                    return (
                        <Card
                            title="工单处理"
                            className="baseInfo"
                        >
                            <Form>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label='投诉状态' {...formItemLayout}>
                                            {getFieldDecorator('complainStatus')(
                                                <Select initialValue="1" onChange={this.switchover.bind(this)}>
                                                    <Option value="1">结案</Option>
                                                    <Option value="2">生成工单</Option>
                                                    <Option value="3">关闭</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} >
                                        <FormItem label="关闭原因" {...formItemLayout}>
                                            {getFieldDecorator('close', {
                                                initialValue: 1
                                            })(
                                                <Radio.Group onChange={(value) => { this.gaibian(value) }}>
                                                    <Radio value={1}>无效内容</Radio>
                                                    <Radio value={2}>问题不存在</Radio>
                                                    <Radio value={3}>
                                                        {getFieldDecorator('closeReason')(
                                                            <Input disabled={nengbunengtian} placeholder="请输入原因" />
                                                        )}
                                                    </Radio>
                                                </Radio.Group>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4} style={{ textAlign: "center" }}>
                                        <Button onClick={(e) => { this.quxiao(e) }}>
                                            <span>取消</span>
                                        </Button>
                                        <Button type="primary" onClick={(e) => { this.tijiao(e) }} style={{ marginLeft: 20, }}>
                                            <span style={{ color: 'white' }}>提交</span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    )
                }
            } else {
                return '';
            }
        }





        return (
            <div className='page'>
                <div className="page-header">
                    <Row>
                        <Col span={8} style={{ fontSize: "20px" }}>
                            投诉详情
                        </Col>
                        <Col style={{ textAlign: "right" }}>
                            <Button type="primary" onClick={() => { window.history.back() }}>
                                <span>返回</span>
                            </Button>
                        </Col>
                    </Row>
                </div>
                <div className='page-content page-content-transparent'>
                    <Card
                        title="投诉信息"
                        className="baseInfo"
                    >
                        <Row>
                            <Col span={20}>
                                <Col span={8}>
                                    <label>投诉分类：</label>
                                    <span>{complaintsInfo.type || '--'}</span>
                                </Col>
                                <Col span={24}>
                                    <label>投诉内容：</label>
                                    <span>
                                        {complaintsInfo.content || '--'}
                                    </span>
                                </Col>
                                <Col span={24}>
                                    <Col span={8}>
                                        <label style={{ marginLeft: 14, }}>泊位号：</label>
                                        <span>{complaintsInfo.spaceNo || '--'}</span>
                                    </Col>
                                    <Col span={8}>
                                        <label style={{ marginLeft: 14, }}>车牌号：</label>
                                        <span>{complaintsInfo.plateNo || '--'}</span>
                                    </Col>
                                </Col>
                                <Col span={8}>
                                    <label>停车时间：</label>
                                    <span>{complaintsInfo.parkTime || '--'}</span>
                                </Col>
                                <Col span={8}>
                                    <label>联系电话：</label>
                                    <span>{complaintsInfo.contactTel || '--'}</span>
                                </Col>
                                <Col span={24} style={{ marginTop: 12, }}>
                                    <label style={{ float: "left", marginTop: 12, marginLeft: 28, }}>照片：</label>
                                    <img src={complaintsInfo.photo || '--'} style={{width:100}}/>
                                </Col>
                                <Col span={8} style={{ marginTop: 12, }}>
                                    <label>投诉来源：</label>
                                    <span>
                                        {complaintsInfo.source || '--'}
                                    </span>
                                </Col>
                                <Col span={8} style={{ marginTop: 12, }}>
                                    <label>投诉时间：</label>
                                    <span>
                                        {complaintsInfo.time || '--'}
                                    </span>
                                </Col>
                            </Col>
                            <Col span={4} style={{ textAlign: "center" }}>
                                <Button style={{ marginTop: 200, }} type="primary" onClick={(e) => { this.chuli(e) }}>
                                    <span style={{ color: 'white' }}>处理</span>
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                    {chulijilu()}
                </div>
            </div>
        )

    }
}


const WrapperAbnormalParkingAlarm = Form.create()(ComplaintDetails);
export default WrapperAbnormalParkingAlarm;
