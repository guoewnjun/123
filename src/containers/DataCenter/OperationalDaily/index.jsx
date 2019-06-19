import React, {Component, Fragment} from 'react';
import {Button, Table, DatePicker, Select, Pagination, Form, Row, Col, Spin, Tooltip,Card} from 'antd';
import Huan from "./components/Huan";
import ZheXianTu from "./components/ZheXianTu";
import Zhu from "./components/Zhu";
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
class OperationalDaily extends Component {

    state = {};

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
      const formItemLayout = {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 },
      };
      const data1 = [
        {
          item: "手机",
          count: 580
        },
        {
          item: "微信",
          count: 1280
        },
        {
          item: "支付宝",
          count: 680
        },
      ];
      const data2 = [
        {
          item: "0:00",
          count: 75
        },
        {
          item: "3:00",
          count: 35
        },
        {
          item: "6:00",
          count: 45
        },
        {
          item: "9:00",
          count: 65
        },
        {
          item: "12:00",
          count: 85
        },
        {
          item: "15:00",
          count: 65
        },
        {
          item: "18:00",
          count: 35
        },
        {
          item: "21:00",
          count: 45
        },
        {
          item: "23:00",
          count: 65
        },
      ];
      const data3 = [
        {
          item: "0-1小时",
          count: 3820
        },
        {
          item: "0.5-2小时",
          count: 3100
        },
        {
          item: "2-4小时",
          count: 1234
        },
        {
          item: "4-8小时",
          count: 1324
        },
        {
          item: ">8小时",
          count: 1324
        },
      ];
      const data4 = [
        {
          item: "泊位异常",
          count: 10
        },
        {
          item: "充值异常",
          count: 8
        },
        {
          item: "订单异常",
          count: 5
        },
        {
          item: "其他问题",
          count: 0
        },
      ];
      const data5 = [
        {
          item: "缺卡",
          count: 35
        },
        {
          item: "正常上班",
          count: 1280
        },
        {
          item: "迟到上班",
          count: 234
        },
      ];
      const data6 = [
        {
          item: "缺卡",
          count: 64
        },
        {
          item: "正常打卡",
          count: 1280
        },
        {
          item: "早退",
          count: 213
        },
      ];
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>运营综合日报</div>
                </div>
                <div className='page-content' style={{padding: 0,background: 'transparent'}} >
                    <Card >
                        <Form className='reportForm'>
                            <Row gutter={46}>
                                <Col span={6}>
                                    <FormItem  {...formItemLayout}>
                                          <DatePicker  style={{ width: '100%' }} format="YYYY-MM-DD"/>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                      <Button type='primary' style={{marginLeft:-50}}>查询</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    <Card>
                        <Row gutter={46}>
                            <Col span={24} style={{textAlign:'center',fontSize:20}}>
                            路内停车运营综合日报
                            </Col>
                            <Col span={24} style={{textAlign:'center',fontSize:15}}>
                            2019-05-05
                            </Col>
                        </Row>

                    </Card>
                        <Card
                            title='一、用户概况'
                        >
                            <Row gutter={50}>
                                <Col span={24}>
                                    <label>本日注册人数合计<nobr style={{color:'red'}} >2,839</nobr>人。其中，手机APP注册<nobr style={{color:'red'}} >580</nobr>人，微信注册<nobr style={{color:'red'}} >1280</nobr>人，支付宝注册<nobr style={{color:'red'}} >680</nobr>人</label>
                                </Col>
                                <Col span={7}></Col>
                                <Col span={8}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={data1}/>
                                                <div style={{fontSize:17}}>注册来源</div>
                                          </div>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='二、泊位概况'
                        >
                            <Row gutter={50}>
                                <Col span={24}>
                                    <label>本日泊位平均占用率为<nobr style={{color:'red'}} >56.8%</nobr>，泊位日周转率数为<nobr style={{color:'red'}} >367</nobr>次。</label>
                                </Col>
                                <Col span={24}>
                                          <div style={{textAlign:'center'}}>
                                                <ZheXianTu data={data2}/>
                                                <div style={{fontSize:17}}>每小时泊位占用率</div>
                                          </div>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='三、停车概况'
                        >
                            <Row gutter={50}>
                                <Col span={24}>
                                    <label>本日停车<nobr style={{color:'red'}} >12,089</nobr>次。其中，0-1小时<nobr style={{color:'red'}} >3,820</nobr>次，0.5-2小时<nobr style={{color:'red'}} >2,820</nobr>次，2-4小时<nobr style={{color:'red'}} >2,820</nobr>次，4-8小时<nobr style={{color:'red'}} >2,820</nobr>次，大于8小时<nobr style={{color:'red'}} >2,820</nobr>次，平均停车时长<nobr style={{color:'red'}} >80</nobr>分钟</label>
                                </Col>
                                <Col span={7}></Col>
                                <Col span={8}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={data3}/>
                                                <div style={{fontSize:17}}>停车时长</div>
                                          </div>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='四、消费概况'
                        >
                            <Row gutter={50}>
                                <Col span={24}>
                                    <label>本日缴费笔数<nobr style={{color:'red'}} >12,089</nobr>笔。其中，手机APP缴费<nobr style={{color:'red'}} >5,820</nobr>笔，微信缴费<nobr style={{color:'red'}} >5,620</nobr>笔，支付宝缴费<nobr style={{color:'red'}} >890</nobr>笔。</label>
                                </Col>
                                <Col span={24}>
                                    <label>本日缴费笔数<nobr style={{color:'red'}} >12,089</nobr>笔。其中，手机APP缴费<nobr style={{color:'red'}} >5,820</nobr>笔，微信缴费<nobr style={{color:'red'}} >5,620</nobr>笔，支付宝缴费<nobr style={{color:'red'}} >890</nobr>元，平均缴费金额<nobr style={{color:'red'}} >28</nobr>元。</label>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={data1}/>
                                                <div style={{fontSize:17}}>缴费笔数</div>
                                          </div>
                                </Col>
                                <Col span={8}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={data1}/>
                                                <div style={{fontSize:17}}>缴费笔数</div>
                                          </div>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='五、投诉概况'
                        >
                            <Row gutter={50}>
                                <Col span={24}>
                                    <label>本日新增投诉工单<nobr style={{color:'red'}} >23</nobr>个。其中，泊位异常<nobr style={{color:'red'}} >10</nobr>个，充值异常<nobr style={{color:'red'}} >8</nobr>个，订单异常<nobr style={{color:'red'}} >5</nobr>个，其他问题<nobr style={{color:'red'}} >0</nobr>个。</label>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Zhu data={data4}/>
                                                <div style={{fontSize:17}}>各投诉类型数</div>
                                          </div>
                                </Col>
                                <Col span={8}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={data1}/>
                                                <div style={{fontSize:17}}>投诉来源</div>
                                          </div>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='六、设备维保概况'
                        >
                            <Row gutter={50}>
                                <Col span={24}>
                                    <label>本日新增维保工单<nobr style={{color:'red'}} >23</nobr>个。其中，车检器<nobr style={{color:'red'}} >10</nobr>个，中继器<nobr style={{color:'red'}} >8</nobr>个，集中器<nobr style={{color:'red'}} >5</nobr>个，车位锁<nobr style={{color:'red'}} >0</nobr>个，巡检PDA<nobr style={{color:'red'}} >0</nobr>个。</label>
                                </Col>
                                <Col span={7}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Zhu data={data4}/>
                                                <div style={{fontSize:17}}>各设备类型数</div>
                                          </div>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='七、违停概况'
                        >
                            <Row gutter={50}>
                                <Col span={24}>
                                    <label>本日违停<nobr style={{color:'red'}} >283</nobr>次。其中，南山区违停<nobr style={{color:'red'}} >70</nobr>次，福田区违停<nobr style={{color:'red'}} >70</nobr>次，罗湖区违停<nobr style={{color:'red'}} >70</nobr>次，龙岗区违停<nobr style={{color:'red'}} >23</nobr>次，宝安区违停<nobr style={{color:'red'}} >23</nobr>次。</label>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Zhu data={data4}/>
                                                <div style={{fontSize:17}}>各设备类型数</div>
                                          </div>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Zhu data={data4}/>
                                                <div style={{fontSize:17}}>各违停类型数</div>
                                          </div>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='八、巡检员管理概况'
                        >
                            <Row gutter={50}>
                                <Col span={24}>
                                  <label>本日上岗<nobr style={{color:'red'}} >283</nobr>人次。其中，南山区<nobr style={{color:'red'}} >70</nobr>人次，福田区<nobr style={{color:'red'}} >70</nobr>人次，罗湖区<nobr style={{color:'red'}} >70</nobr>人次，龙岗区<nobr style={{color:'red'}} >23</nobr>人次，宝安区<nobr style={{color:'red'}} >23</nobr>人次。</label>
                                </Col>
                                <Col span={24}>
                                    <label>正常上班<nobr style={{color:'red'}} >280</nobr>人次，迟到上班<nobr style={{color:'red'}} >40</nobr>人次，缺卡<nobr style={{color:'red'}} >0</nobr>人次。正常下班<nobr style={{color:'red'}} >290</nobr>人次，早退<nobr style={{color:'red'}} >10</nobr>人次，缺卡<nobr style={{color:'red'}} >10</nobr>人次。</label>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={data5}/>
                                                <div style={{fontSize:17}}>上班情况</div>
                                          </div>
                                </Col>
                                <Col span={8}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={data6}/>
                                                <div style={{fontSize:17}}>上班情况</div>
                                          </div>
                                </Col>
                            </Row>
                        </Card>
                </div>
            </div>
        );
    }
}

export default OperationalDaily;
