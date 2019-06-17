import React, {Component} from 'react';

import {
    Card, Row, Col, Button, Form, Select, Input, Radio,
} from 'antd';
import {HttpClient} from "@/common/HttpClient";
// import ImagePreview from '../../components/ImagePreview/';
// import _ from 'lodash';
import './Style/ParkingRecord.css'

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


class ComplaintDetails extends Component {
    constructor (props) {
        super(props);
        this.state = {
            show:false,//显示处理页面
            switchover:1, //切换处理页面
            nengbunengtian:true,
            // complainInformation:{},

        }
    }

    // 组件挂载之前
    componentWillMount () {

    }

    // 组件挂载后
    componentDidMount () {
            let orderId = null;
            if (!this.state.orderId) {
                orderId = sessionStorage.getItem('orderId_AppealDetail');
                sessionStorage.removeItem('orderId_AppealDetail');
                this.setState({
                    orderId
                })
            } else {
                orderId = this.state.orderId
            }
        HttpClient.query(`/Vip/VipLogDetails?id=${orderId}`, 'GET', null, this.parkingDetail.bind(this));

    }

    // 组件卸载之前
    componentWillUnmount () {
    }

    // 获取停车详情回调
    parkingDetail (d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            //成功-------在这里做你的数据处理
            this.setState({
                data1: data.data1,
                data: data.data,
                detailData: data,
                // complainInformation:data.complainInformation,
            });
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    checkAppealDetail () {
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
            switchover:value,
        })
    }

    //取消按钮
    quxiao(e) {
      alert("已取消");
    }

    //提交按钮
    tijiao(e) {
        alert("已提交");
    }
    gaibian(value){
        if(value.target.value=='3'){
            this.setState({
                nengbunengtian:false,
            })
        }else{
            this.setState({
                nengbunengtian:true,
            })
        }
    }
    render () {
        const {show, switchover,nengbunengtian,} = this.state;

        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };

        function handleChange(value) {
          console.log(`selected ${value}`);
        }

        //投诉信息
        const complainInformation = {
            ComplainClassify:"泊位异常",//投诉分类
            ComplainContent:"泊位异常无法缴费，被交警贴条了",//投诉内容
            TheBerthNumber:"122341",//泊位号
            LicensePlateNumber:"粤A6666",//车牌号
            StoppingTime:"2019-1-1",//停车时间
            PhoneNumber:"1383838438",//联系电话
            Photo:"img",//照片
            ComplaineSource:"手机APP",//投诉来源
            ComplaineTime:"2019-1-2",//投诉时间
        };


        const chulijilu=()=>{
            if(show){
                if(switchover=="1"){
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
                                                <Select defaultValue="1" onChange={this.switchover.bind(this)}>
                                                    <Option value="1">结案</Option>
                                                    <Option value="2">生成工单</Option>
                                                    <Option value="3">关闭</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={10} style={{marginLeft:25,paddingLeft:10}}>
                                        <div style={{background:"#F5F5F5", borderWidth:"1",borderStyle: "solid", borderColor: "rgba(215, 215, 215, 1)", borderRadius: "0",}}>
                                            温馨提示：该内容可能以短信方式发送给用户，请认真填写！
                                        </div>
                                    </Col>
                                </Row>
                                <Row style={{marginTop:"25px"}}>
                                    <Col span={8}>
                                        <FormItem label="常用意见" {...formItemLayout}>
                                            {getFieldDecorator('OpinionClassify')(
                                                <Select defaultValue="1"  onChange={handleChange}>
                                                    <Option value="1">请选择意见分类</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6} style={{marginLeft:"10px"}}>
                                        <FormItem>
                                            {getFieldDecorator('OpinionTitle')(
                                                <Select defaultValue="1"  onChange={handleChange}>
                                                    <Option value="1">请选择意见标题</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6} style={{marginLeft:"10px"}}>
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
                                                <Radio.Group defaultValue={1}>
                                                    <Radio value={1}>否</Radio>
                                                    <Radio value={2}>是</Radio>
                                                </Radio.Group>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4} style={{textAlign: "center"}}>
                                        <Button onClick={(e)=>{this.quxiao(e)}}>
                                        <span>取消</span>
                                        </Button>
                                        <Button type="primary" onClick={(e)=>{this.tijiao(e)}} style={{marginLeft:20,}}>
                                        <span>提交</span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    )
                }else if (switchover=="2") {
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
                                                <Select defaultValue="1" onChange={this.switchover.bind(this)}>
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
                                        <Col span={12} style={{marginRight:"-30%"}}>
                                            <FormItem label="优先级" {...formItemLayout}>
                                                {getFieldDecorator('Priority')(
                                                    <Select defaultValue="1"  onChange={handleChange}>
                                                        <Option value="1">请选择</Option>
                                                        <Option value="2">一般</Option>
                                                        <Option value="3">紧急</Option>
                                                        <Option value="4">立即处理</Option>
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={12} style={{float:"right"}}>
                                            <FormItem label="指派" {...formItemLayout}>
                                                {getFieldDecorator('Designate')(
                                                    <Select defaultValue="1"  onChange={handleChange}>
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
                                    <Col span={4} style={{textAlign: "center"}}>
                                        <Button onClick={(e)=>{this.quxiao(e)}}>
                                        <span>取消</span>
                                        </Button>
                                        <Button type="primary" onClick={(e)=>{this.tijiao(e)}} style={{marginLeft:20,}}>
                                        <span>提交</span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    )
                }else{
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
                                                <Select defaultValue="1" onChange={this.switchover.bind(this)}>
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
                                                <Radio.Group defaultValue={1} onChange={(value)=>{this.gaibian(value)}}>
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
                                    <Col span={4} style={{textAlign: "center"}}>
                                        <Button onClick={(e)=>{this.quxiao(e)}}>
                                        <span>取消</span>
                                        </Button>
                                        <Button type="primary" onClick={(e)=>{this.tijiao(e)}} style={{marginLeft:20,}}>
                                        <span>提交</span>
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    )
                }
            }else{
                return '';
            }
        }





        return (
            <div className='page'>
                <div className="page-header">
                    <Row>
                        <Col span={8} style={{fontSize:"20px"}}>
                            投诉详情
                        </Col>
                        <Col style={{textAlign: "right"}}>
                            <Button type="primary" onClick={()=>{window.history.back()}}>
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
                                    <span>{complainInformation.ComplainClassify}</span>
                                </Col>
                                <Col span={24}>
                                    <label>投诉内容：</label>
                                    <span>
                                        {complainInformation.ComplainContent}
                                    </span>
                                </Col>
                                <Col span={24}>
                                    <Col span={8}>
                                        <label style={{marginLeft:14,}}>泊位号：</label>
                                        <span>{complainInformation.TheBerthNumber}</span>
                                    </Col>
                                    <Col span={8}>
                                        <label style={{marginLeft:14,}}>车牌号：</label>
                                        <span>{complainInformation.LicensePlateNumber}</span>
                                    </Col>
                                </Col>
                                <Col span={8}>
                                    <label>停车时间：</label>
                                    <span>{complainInformation.StoppingTime}</span>
                                </Col>
                                <Col span={8}>
                                    <label>联系电话：</label>
                                    <span>{complainInformation.PhoneNumber}</span>
                                </Col>
                                <Col span={24} style={{marginTop:12,}}>
                                    <label style={{float:"left", marginTop:12, marginLeft:28,}}>照片：</label>
                                    <span>
                                        {complainInformation.Photo}
                                    </span>
                                </Col>
                                <Col span={8} style={{marginTop:12,}}>
                                    <label>投诉来源：</label>
                                    <span>
                                        {complainInformation.ComplaineSource}
                                    </span>
                                </Col>
                                <Col span={8} style={{marginTop:12,}}>
                                    <label>投诉时间：</label>
                                    <span>
                                        {complainInformation.ComplaineTime}
                                    </span>
                                </Col>
                            </Col>
                            <Col span={4} style={{textAlign: "center"}}>
                                <Button style={{Color:'white',marginTop:200,}} type="primary" onClick={(e)=>{this.chuli(e)}}>
                                <span>处理</span>
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
