import React, { Component } from 'react';

import {
    Card, Row, Col, Button, Form, Select, Input, Radio,
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
            complainInformation: {},

        }
    }

    // 组件挂载之前
    componentWillMount() {

    }

    // 组件挂载后
    componentDidMount() {
        HttpClient.query(`/parking-person-info/business/complaints/detail/nodisposed?id=${this.state.uId}`, 'GET', null, this.parkingDetail.bind(this));
    }

    // 组件卸载之前
    componentWillUnmount() {
    }

    // 获取停车详情回调
    parkingDetail(d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            console.log(data)
            this.setState({
                complainInformation: data,
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
        alert("已提交");
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
    render() {
        const { show, switchover, nengbunengtian, complainInformation } = this.state;

        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        function handleChange(value) {
            console.log(`selected ${value}`);
        }

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
                                            {getFieldDecorator('ComplainStatus', { initialValue: '1' })(
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
                                            {getFieldDecorator('OpinionClassify')(
                                                <Select initialValue="1" onChange={handleChange}>
                                                    <Option value="1">请选择意见分类</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6} style={{ marginLeft: "10px" }}>
                                        <FormItem>
                                            {getFieldDecorator('OpinionTitle')(
                                                <Select initialValue="1" onChange={handleChange}>
                                                    <Option value="1">请选择意见标题</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6} style={{ marginLeft: "10px" }}>
                                        <Button>添加意见</Button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} >
                                        <FormItem label="结案内容" {...formItemLayout}>
                                            {getFieldDecorator('CloseContent')(
                                                <TextArea rows={5}
                                                    placeholder=""
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} >
                                        <FormItem label="给用户发短信" {...formItemLayout}>
                                            {getFieldDecorator('SendMessage')(
                                                <Radio.Group initialValue={1}>
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
                                            {getFieldDecorator('ComplainStatus')(
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
                                            {getFieldDecorator('WorkOrderTitle')(
                                                <Input placeholder="" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <Col span={12} style={{ marginRight: "-30%" }}>
                                            <FormItem label="优先级" {...formItemLayout}>
                                                {getFieldDecorator('Priority')(
                                                    <Select initialValue="1" onChange={handleChange}>
                                                        <Option value="1">请选择</Option>
                                                        <Option value="2">一般</Option>
                                                        <Option value="3">紧急</Option>
                                                        <Option value="4">立即处理</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12} style={{ float: "right" }}>
                                            <FormItem label="指派" {...formItemLayout}>
                                                {getFieldDecorator('Designate')(
                                                    <Select initialValue="1" onChange={handleChange}>
                                                        <Option value="1">请选择</Option>
                                                        <Option value="2">XX小姐</Option>
                                                        <Option value="3">张三</Option>
                                                        <Option value="4">李四</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} >
                                        <FormItem label="工单内容" {...formItemLayout}>
                                            {getFieldDecorator('WorkOrderContent')(
                                                <TextArea rows={5}
                                                    placeholder=""
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
                                            {getFieldDecorator('ComplainStatus')(
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
                                            {getFieldDecorator('ClosureReason')(
                                                <Radio.Group initialValue={1} onChange={(value) => { this.gaibian(value) }}>
                                                    <Radio value={1}>无效内容</Radio>
                                                    <Radio value={2}>问题不存在</Radio>
                                                    <Radio value={3}>
                                                        <Input disabled={nengbunengtian} placeholder="请输入原因" />
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
                                    <span>{complainInformation.type}</span>
                                </Col>
                                <Col span={24}>
                                    <label>投诉内容：</label>
                                    <span>
                                        {complainInformation.content}
                                    </span>
                                </Col>
                                <Col span={24}>
                                    <Col span={8}>
                                        <label style={{ marginLeft: 14, }}>泊位号：</label>
                                        <span>{complainInformation.spaceNo}</span>
                                    </Col>
                                    <Col span={8}>
                                        <label style={{ marginLeft: 14, }}>车牌号：</label>
                                        <span>{complainInformation.plateNo}</span>
                                    </Col>
                                </Col>
                                <Col span={8}>
                                    <label>停车时间：</label>
                                    <span>{complainInformation.parkTime}</span>
                                </Col>
                                <Col span={8}>
                                    <label>联系电话：</label>
                                    <span>{complainInformation.contactTel}</span>
                                </Col>
                                <Col span={24} style={{ marginTop: 12, }}>
                                    <label style={{ float: "left", marginTop: 12, marginLeft: 28, }}>照片：</label>
                                    <span>
                                        {complainInformation.photo}
                                    </span>
                                </Col>
                                <Col span={8} style={{ marginTop: 12, }}>
                                    <label>投诉来源：</label>
                                    <span>
                                        {complainInformation.source}
                                    </span>
                                </Col>
                                <Col span={8} style={{ marginTop: 12, }}>
                                    <label>投诉时间：</label>
                                    <span>
                                        {complainInformation.time}
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
