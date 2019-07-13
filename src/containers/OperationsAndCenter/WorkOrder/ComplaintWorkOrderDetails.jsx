import React, {Component} from 'react';
import {
    Button, Form, Select, Table, Row, Col, DatePicker, Input, Spin, Pagination, Badge, Switch, Card, List, Timeline, Radio, message
} from 'antd';
import {HttpClient} from '@/common/HttpClient.jsx';


import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

const FormItem = Form.Item;

class ComplaintWorkOrderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uId:this.props.location.query.id?this.props.location.query.id:"--",
            shuju:{},
            tousu:{},
            lista:[],
            show:false,//显示处理页面
            switchover:1, //切换处理页面
        };
    }


    //加载数据
    loadData() {
        let uId = null;
        if (!this.state.uId) {
            uId = sessionStorage.getItem('uId_AppealDetail');
            sessionStorage.removeItem('uId_AppealDetail');
            this.setState({
                uId
            })
        } else {
            uId = this.state.uId
        };
        // params = this.filterOtherParams(params);
        HttpClient.query(`/parking-person-info/business/complaints/dispose/detail/complaints?id=${uId}`, 'GET', null, this.handleQueryData.bind(this))
        HttpClient.query(`/parking-person-info/business/complaints/dispose/detail/dispose?id=${uId}`, 'GET', null, this.handleQueryData2.bind(this))
        HttpClient.query(`/parking-person-info/business/complaints/dispose/detail/history?id=${uId}`, 'GET', null, this.handleQueryData1.bind(this))
        // HttpClient.query(`/OperationsAndCenter/WorkOrder/ComplainWorkOrder/ComplainWorkOrderDetails?id=${uId}`, 'GET', null, this.handleQueryData.bind(this))
    }

    // 处理工单
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


    // loadData回调函数
    handleQueryData(d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            this.setState({
                tousu: data,
            })
        } else {
            //失败----做除了报错之外的操作
        }
    }
    // loadData回调函数
    handleQueryData2(d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            this.setState({
                shuju: data,
            })
        } else {
            //失败----做除了报错之外的操作
        }
    }
    // loadData回调函数
    handleQueryData1(d, type) {
        const data = d.data;
        if (type === HttpClient.requestSuccess) {
            this.setState({
                lista: data,
            })
        } else {
            //失败----做除了报错之外的操作
        }
    }



    //提交按钮
    tijiao() {
        let params = {};
        params.id = this.state.datum.id;
        this.props.form.validateFields((err, values) => {
            if (err) return;
            params.state = values.workorderState
            params.content = values.CaseContent
            params.adwise = values.SendMessage
            params.toDisposer = values.Designate
            params.toDisposerId = values.Designate
            // console.log(params)
            HttpClient.query(`/parking-person-info/business/complaints/dispose/dispose`, 'POST', params, (d, type) => {
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
        const {switchover,show, uId,shuju,tousu,lista}= this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };

        function handleChange(value) {
          console.log(`selected ${value}`);
        }

        // const lista = [
        //     {shijian:'12点',neirong:'Create a servicessashdkjashdsd servicessashdkjashdsd'},
        //     {shijian:'12点',neirong:'Cre servicessashdkjashdsd'},
        //     {shijian:'12点',neirong:'Create servicessashdkjashdsd'},
        //     {shijian:'12点',neirong:'Create a servicessashdkj'},
        // ];
        // {moment().format('YYYY-MM-DD HH:mm:ss')} Create a servicessashdkjashdsd servicessashdkjashdsd
        for (let i = 0; i < lista.length; i++) {
            lista[i].id = i+1;
        }
        const listItems = lista.map((str) =>{
            if(str.disposeType === '结案'){
                return(
                    <Timeline.Item key={str.id}>
                        <Row>
                            <Col span={4}>
                            {str.time}
                            </Col>
                            <Col span={18}>
                                <Row>
                                    <Col span={24}>
                                        <a>{(str.operator?str.operator:'--')}</a>{((str.id==lista.length)?('发起了工单，'):'')}将工单设置为已结案
                                    </Col>
                                    <Col span={24}>
                                        结案内容：{str.content?str.content:'--'}
                                    </Col>
                                    <Col span={24}>
                                        给用户发短信：{str.adwise?'是':'否'}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Timeline.Item>
                )
            }else{
                return(
                    <Timeline.Item key={str.id}>
                        <Row>
                            <Col span={4}>
                            {str.time}
                            </Col>
                            <Col span={18}>
                                <Row>
                                    <Col span={24}>
                                        <a>{str.operator?str.operator:'--'}</a>{((str.id==lista.length)?('发起了工单，'):'')}把工单指派给了<a>{str.disposer?str.disposer:'--'}</a>
                                    </Col>
                                    <Col span={24}>
                                        处理内容：{str.content?str.content:'--'}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Timeline.Item>
                )
            }
        }
        );
        const chulijilu=()=>{
            if(show){
                if(switchover=="1"){
                    return (
                        <Card
                            title="工单处理"
                            className="baseInfo"
                            >
                            <Form>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label='工单状态' {...formItemLayout}>
                                            {getFieldDecorator("workorderState")(
                                                <Select defaultValue="1" onChange={this.switchover.bind(this)}>
                                                    <Option value="1">结案</Option>
                                                    <Option value="2">处理中</Option>
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
                                            {getFieldDecorator("OpinionClassify")(
                                                <Select defaultValue="1"  onChange={handleChange}>
                                                    <Option value="1">请选择意见分类</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6} style={{marginLeft:"10px"}}>
                                        <FormItem>
                                            {getFieldDecorator("OpinionTitle")(
                                                <Select defaultValue="1"  onChange={handleChange}>
                                                    <Option value="1">请选择意见标题</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={6} style={{marginLeft:"10px"}}>
                                        {getFieldDecorator("AddOpinions")(
                                            <Button>添加意见</Button>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} >
                                        <FormItem label="结案内容" {...formItemLayout}>
                                            {getFieldDecorator("CaseContent")(
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
                                            {getFieldDecorator("SendMessage")(
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
                                        <Button type="primary" onClick={(e)=>{this.tijiao.bind(this)}}>
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
                                        <FormItem label='工单状态' {...formItemLayout}>
                                            {getFieldDecorator("workorderState")(
                                                <Select defaultValue="2" onChange={this.switchover.bind(this)}>
                                                    <Option value="1">结案</Option>
                                                    <Option value="2">处理中</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label="指派" {...formItemLayout}>
                                            {getFieldDecorator("Designate")(
                                                <Select defaultValue="1"  onChange={handleChange}>
                                                    <Option value="1">请选择</Option>
                                                    <Option value="2">XX小姐</Option>
                                                    <Option value="3">张三</Option>
                                                    <Option value="4">李四</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8} >
                                        <FormItem label="处理说明" {...formItemLayout}>
                                            {getFieldDecorator("ProcessingSpecification")(
                                                <TextArea rows={5}
                                                    placeholder=""
                                                />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4} style={{textAlign: "center"}}>
                                        <Button type="primary" onClick={(e)=>{this.tijiao.bind(this)}}>
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
                            <label>工单编号：</label>
                            <span>{uId}</span>
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
                        title="工单基本信息"
                        className="baseInfo"
                        >
                        <Row>
                            <Col span={8}>
                                <label>工单编号：</label>
                                <span>{uId||'--'}</span>
                            </Col>
                            <Col span={8}>
                                <label>工单标题：</label>
                                <span>{shuju.caption||'--'}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <label>工单级别：</label>
                                <span>{shuju.priority||'--'}</span>
                            </Col>
                            <Col span={8}>
                                <label>工单发起人：</label>
                                <span>{shuju.operator||'--'}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <label>投诉时间：</label>
                                <span>{shuju.time||'--'}</span>
                            </Col>
                            <Col span={8}>
                                <label>投诉内容：</label>
                                <span>{shuju.content||'--'}</span>
                            </Col>
                        </Row>
                    </Card>
                    <Card
                        title="投诉信息"
                        className="baseInfo"
                        >
                        <Row>
                            <Col span={8}>
                                <label>投诉类型：</label>
                                <span>{tousu.type||'--'}</span>
                            </Col>
                            <Col span={8}>
                                <label>投诉内容：</label>
                                <span>{tousu.content||'--'}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <label>泊位号：</label>
                                <span>{tousu.TheBerthNo||'--'}</span>
                            </Col>
                            <Col span={8}>
                                <label>车牌号：</label>
                                <span>{tousu.LicensePlateNumber||'--'}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <label>停车时间：</label>
                                <span>{tousu.parkTime||'--'}</span>
                            </Col>
                            <Col span={8}>
                                <label>联系电话：</label>
                                <span>{tousu.mobile||'--'}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <label>照片：</label>
                                <img src={tousu.photos||'--'}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <label>投诉来源：</label>
                                <span>{tousu.source||'--'}</span>
                            </Col>
                            <Col span={8}>
                                <label>投诉时间：</label>
                                <span>{shuju.time||'--'}</span>
                            </Col>
                        </Row>
                    </Card>
                    <Card
                        title="处理记录"
                        className="baseInfo"
                        >
                        <Row>
                            <Col span={20}>
                                <Timeline>
                                {listItems}
                                </Timeline>
                            </Col>
                            {((lista[0]?(lista[0].disposeType):'') != '结案')?(<Col span={4} style={{textAlign: "center"}}>
                                <Button style={{Color:'white',marginTop:"80px",}} type="primary" onClick={(e)=>{this.chuli(e)}}>
                                <span>处理</span>
                                </Button>
                            </Col>):('')}
                        </Row>
                    </Card>
                    {chulijilu()}
                </div>
			</div>
    		);
    }
}
const WrapperComplaintWorkOrderDetails = Form.create()(ComplaintWorkOrderDetails);
export default WrapperComplaintWorkOrderDetails;
