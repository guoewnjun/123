import React, {Component} from 'react';
import {Button, DatePicker, Form, Row, Col, Spin,Card} from 'antd';
import {HttpClientImmidIot} from "../../../common/HttpClientImmidIot";
import Huan from "./components/Huan";
import ZheXianTu from "./components/ZheXianTu";
import Zhu from "./components/Zhu";
import moment from 'moment';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const dayFormat = "YYYY-MM-DD";
class OperationalDaily extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            date:moment().format(dayFormat),
            userProfile:{},
            berthSituation:{},
            parkingProfile:{},
            spendingProfile:{},
            complaintsOverview:{},
            maintenanceOverview:{},
            stopOverview:{},
            patrolInspector:{},
        };
    }
    componentWillMount() {

    }

    componentDidMount() {
        this.loadData();
    }

    componentWillUnmount() {

    }

    loadData(newDate) {
        this.setState({
            loading: true
        });
        let date={date:newDate?newDate:this.state.date}
        console.log(date)
        HttpClientImmidIot.query('/containers/DataCenter/OperationalDaily', 'GET', date, this.handleQueryData.bind(this))
    }
    handleQueryData(d){
        const data=d.data;
        // console.log(data);
        if(data){
        this.setState({
            userProfile:data.userProfile||{},
            berthSituation:data.berthSituation||{},
            parkingProfile:data.parkingProfile||{},
            spendingProfile:data.spendingProfile||{},
            complaintsOverview:data.complaintsOverview||{},
            maintenanceOverview:data.maintenanceOverview||{},
            stopOverview:data.stopOverview||{},
            patrolInspector:data.patrolInspector||{},
        });}else{
          this.setState({
              data:{},
          })
        }

        this.setState({
            loading: false
        });
    }
    onDateChange (date,dateString) {
        console.log(dateString)
        this.state.date=dateString;

        // this.loadData(dateString)
    }
    chaxundate(){
      this.loadData(this.state.date)
    }

    render() {
      const formItemLayout = {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 },
      };
      const numberStyle = {
          style:{color:'red'},
      };
      const dataUserProfile = [
        {
          item: "手机",
          count: this.state.userProfile.userApp
        },
        {
          item: "微信",
          count: this.state.userProfile.userWechat
        },
        {
          item: "支付宝",
          count: this.state.userProfile.userAlipay
        },
      ];
      const data2 = [
        {
          item: "0:00",
          count: this.state.berthSituation.count1,
        },
        {
          item: "3:00",
          count: this.state.berthSituation.count2
        },
        {
          item: "6:00",
          count: this.state.berthSituation.count3
        },
        {
          item: "9:00",
          count: this.state.berthSituation.count4
        },
        {
          item: "12:00",
          count: this.state.berthSituation.count5
        },
        {
          item: "15:00",
          count: this.state.berthSituation.count6
        },
        {
          item: "18:00",
          count: this.state.berthSituation.count7
        },
        {
          item: "21:00",
          count: this.state.berthSituation.count8
        },
        {
          item: "23:00",
          count: this.state.berthSituation.count9
        },
      ];
      const dataParkingProfile = [
        {
          item: "0-1小时",
          count: this.state.parkingProfile.parking1
        },
        {
          item: "0.5-2小时",
          count: this.state.parkingProfile.parking2
        },
        {
          item: "2-4小时",
          count: this.state.parkingProfile.parking4
        },
        {
          item: "4-8小时",
          count: this.state.parkingProfile.parking8
        },
        {
          item: ">8小时",
          count: this.state.parkingProfile.parkingmax
        },
      ];
      const data4 = [
        {
          item: "泊位异常",
          count: this.state.complaintsOverview.count2
        },
        {
          item: "充值异常",
          count: this.state.complaintsOverview.count3
        },
        {
          item: "订单异常",
          count: this.state.complaintsOverview.count4
        },
        {
          item: "其他问题",
          count: this.state.complaintsOverview.count5
        },
      ];
      const data7 = [
        {
          item: "手机",
          count: this.state.spendingProfile.strokeCount2
        },
        {
          item: "微信",
          count: this.state.spendingProfile.strokeCount3
        },
        {
          item: "支付宝",
          count: this.state.spendingProfile.strokeCount4
        },
      ];
      const data8 = [
        {
          item: "手机",
          count: this.state.spendingProfile.money2
        },
        {
          item: "微信",
          count: this.state.spendingProfile.money3
        },
        {
          item: "支付宝",
          count: this.state.spendingProfile.money4
        },
      ];
      const sourceComplaints = [
        {
          item: "手机",
          count: this.state.complaintsOverview.complaintApp
        },
        {
          item: "微信",
          count: this.state.complaintsOverview.complaintWechat
        },
        {
          item: "支付宝",
          count: this.state.complaintsOverview.complaintAlipay
        },
      ];
      const deviceType = [
        {
          item: "车检器",
          count: this.state.maintenanceOverview.count2
        },
        {
          item: "中继器",
          count: this.state.maintenanceOverview.count3
        },
        {
          item: "集中器",
          count: this.state.maintenanceOverview.count4
        },
        {
          item: "车位锁",
          count: this.state.maintenanceOverview.count5
        },
        {
          item: "巡检PDA",
          count: this.state.maintenanceOverview.count6
        },
      ];
      const areaStop = [
        {
          item: "南山区",
          count: this.state.stopOverview.count2,
          color:'违停数',
        },
        {
          item: "福田区",
          count: this.state.stopOverview.count3
        },
        {
          item: "罗湖区",
          count: this.state.stopOverview.count4
        },
        {
          item: "龙岗区",
          count: this.state.stopOverview.count5
        },
        {
          item: "宝安区",
          count: this.state.stopOverview.count6
        },
      ];
      const stopType = [
        {
          item: "一般道路违停",
          count: this.state.stopOverview.count21
        },
        {
          item: "特殊道路违停",
          count:  this.state.stopOverview.count22
        },
        {
          item: "高速违停罚",
          count:  this.state.stopOverview.count23
        },
      ];
      const dataOffice = [
        {
          item: "缺卡",
          count: this.state.patrolInspector.count23
        },
        {
          item: "正常上班",
          count: this.state.patrolInspector.count21
        },
        {
          item: "迟到上班",
          count: this.state.patrolInspector.count22
        },
      ];
      const dataOff = [
        {
          item: "缺卡",
          count: this.state.patrolInspector.count31
        },
        {
          item: "正常打卡",
          count: this.state.patrolInspector.count32
        },
        {
          item: "早退",
          count: this.state.patrolInspector.count33
        },
      ];


        const {date,userProfile,berthSituation,parkingProfile,spendingProfile,complaintsOverview,maintenanceOverview,stopOverview,patrolInspector,}=this.state;
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
                                          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" onChange={this.onDateChange.bind(this)}/>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                      <Button type='primary' style={{marginLeft:-50}} onClick={this.chaxundate.bind(this)}>查询</Button>
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
                            {date}
                            </Col>
                        </Row>

                    </Card>
                        <Card
                            title='一、用户概况'
                        >
                            <Row gutter={50}>
                                <Col span={24}>
                                    <label>本日注册人数合计<nobr {...numberStyle}>{userProfile.userSum}</nobr>人。其中，手机APP注册<nobr {...numberStyle} >{userProfile.userApp}</nobr>人，微信注册<nobr {...numberStyle} >{userProfile.userWechat}</nobr>人，支付宝注册<nobr {...numberStyle} >{userProfile.userAlipay}</nobr>人</label>
                                </Col>
                                <Col span={7}></Col>
                                <Col span={8}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={dataUserProfile}/>
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
                                    <label>本日泊位平均占用率为<nobr {...numberStyle} >{berthSituation.occupancyRate}</nobr>，泊位日周转率数为<nobr {...numberStyle} >{berthSituation.dayTurnover}</nobr>次。</label>
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
                                    <label>本日停车<nobr {...numberStyle} >{parkingProfile.parkingSum}</nobr>次。其中，0-1小时<nobr {...numberStyle} >{parkingProfile.parking1}</nobr>次，0.5-2小时<nobr {...numberStyle} >{parkingProfile.parking2}</nobr>次，2-4小时<nobr {...numberStyle} >{parkingProfile.parking4}</nobr>次，4-8小时<nobr {...numberStyle} >{parkingProfile.parking8}</nobr>次，大于8小时<nobr {...numberStyle} >{parkingProfile.parkingmax}</nobr>次，平均停车时长<nobr {...numberStyle} >{parkingProfile.parkingAverage}</nobr>分钟</label>
                                </Col>
                                <Col span={7}></Col>
                                <Col span={8}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={dataParkingProfile}/>
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
                                    <label>本日缴费笔数<nobr {...numberStyle} >{spendingProfile.strokeCount1}</nobr>笔。其中，手机APP缴费<nobr {...numberStyle} >{spendingProfile.strokeCount2}</nobr>笔，微信缴费<nobr {...numberStyle} >{spendingProfile.strokeCount3}</nobr>笔，支付宝缴费<nobr {...numberStyle} >{spendingProfile.strokeCount4}</nobr>笔。</label>
                                </Col>
                                <Col span={24}>
                                    <label>本日缴费金额<nobr {...numberStyle} >{spendingProfile.money1}</nobr>元。其中，手机APP缴费<nobr {...numberStyle} >{spendingProfile.money2}</nobr>元，微信缴费<nobr {...numberStyle} >{spendingProfile.money3}</nobr>元，支付宝缴费<nobr {...numberStyle} >{spendingProfile.money4}</nobr>元，平均缴费金额<nobr {...numberStyle} >{spendingProfile.money5}</nobr>元。</label>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={data7}/>
                                                <div style={{fontSize:17}}>缴费笔数</div>
                                          </div>
                                </Col>
                                <Col span={8}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={data8}/>
                                                <div style={{fontSize:17}}>缴费金额</div>
                                          </div>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='五、投诉概况'
                        >
                            <Row gutter={50}>
                                <Col span={24}>
                                    <label>本日新增投诉工单<nobr {...numberStyle} >{complaintsOverview.count1}</nobr>个。其中，泊位异常<nobr {...numberStyle} >{complaintsOverview.count2}</nobr>个，充值异常<nobr {...numberStyle} >{complaintsOverview.count3}</nobr>个，订单异常<nobr {...numberStyle} >{complaintsOverview.count4}</nobr>个，其他问题<nobr {...numberStyle} >{complaintsOverview.count5}</nobr>个。</label>
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
                                                <Huan data={sourceComplaints}/>
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
                                    <label>本日新增维保工单<nobr {...numberStyle} >{maintenanceOverview.count1}</nobr>个。其中，车检器<nobr {...numberStyle} >{maintenanceOverview.count2}</nobr>个，中继器<nobr {...numberStyle} >{maintenanceOverview.count3}</nobr>个，集中器<nobr {...numberStyle} >{maintenanceOverview.count4}</nobr>个，车位锁<nobr {...numberStyle} >{maintenanceOverview.count5}</nobr>个，巡检PDA<nobr {...numberStyle} >{maintenanceOverview.count6}</nobr>个。</label>
                                </Col>
                                <Col span={7}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Zhu data={deviceType}/>
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
                                    <label>本日违停<nobr {...numberStyle} >{stopOverview.count1}</nobr>次。其中，南山区违停<nobr {...numberStyle} >{stopOverview.count2}</nobr>次，福田区违停<nobr {...numberStyle} >{stopOverview.count3}</nobr>次，罗湖区违停<nobr {...numberStyle} >{stopOverview.count4}</nobr>次，龙岗区违停<nobr {...numberStyle} >{stopOverview.count5}</nobr>次，宝安区违停<nobr {...numberStyle} >{stopOverview.count6}</nobr>次。</label>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Zhu data={areaStop}/>
                                                <div style={{fontSize:17}}>各区违停数</div>
                                          </div>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Zhu data={stopType}/>
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
                                  <label>本日上岗<nobr {...numberStyle} >{patrolInspector.count1}</nobr>人次。其中，南山区<nobr {...numberStyle} >{patrolInspector.count2}</nobr>人次，福田区<nobr {...numberStyle} >{patrolInspector.count3}</nobr>人次，罗湖区<nobr {...numberStyle} >{patrolInspector.count4}</nobr>人次，龙岗区<nobr {...numberStyle} >{patrolInspector.count5}</nobr>人次，宝安区<nobr {...numberStyle} >{patrolInspector.count6}</nobr>人次。</label>
                                </Col>
                                <Col span={24}>
                                    <label>正常上班<nobr {...numberStyle} >{patrolInspector.count21}</nobr>人次，迟到上班<nobr {...numberStyle} >{patrolInspector.count22}</nobr>人次，缺卡<nobr {...numberStyle} >{patrolInspector.count23}</nobr>人次。正常下班<nobr {...numberStyle} >{patrolInspector.count24}</nobr>人次，早退<nobr {...numberStyle} >{patrolInspector.count25}</nobr>人次，缺卡<nobr {...numberStyle} >{patrolInspector.count26}</nobr>人次。</label>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={dataOffice}/>
                                                <div style={{fontSize:17}}>上班情况</div>
                                          </div>
                                </Col>
                                <Col span={8}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={dataOff}/>
                                                <div style={{fontSize:17}}>下班情况</div>
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
