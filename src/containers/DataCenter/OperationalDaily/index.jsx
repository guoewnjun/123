import React, {Component} from 'react';
import {Button, DatePicker, Form, Row, Col, Spin,Card} from 'antd';
import {HttpClient} from "../../../common/HttpClient";
import Huan from "./components/Huan";
import ZheXianTu from "./components/ZheXianTu";
import Zhu from "./components/Zhu";
import moment from 'moment';
import _ from "lodash";
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const dayFormat = "YYYY-MM-DD";

const zhifuleixin = ['钱包 ','微信'];
class OperationalDaily extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            date:moment().format(dayFormat),
            userProfile:{},
            berthSituation:{statisticsSpaceUsageRateHour:[]},
            parkingProfile:{parkTimesVOList:[]},
            spendingProfile:{rpPayTimeCountVO:{rpPayTypeTimesCountVOList:[]},rpPayAmountCountVO:{rpPayTypeAmountCountVOList:[]}},
            complaintsOverview:{complaintTypeCountList:[],complaintSourceCountList:[]},
            maintenanceOverview:{ todayIncreasedCount:0,rpDeviceTypeWarnCountList:[] },
            stopOverview:{},
            stopOverview1:{},
            patrolInspector:{attendanceCountVO:{areaAttendanceCountList:[]},scheduleDetailCountList:[]},
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
        let date={queryDate:newDate?newDate:this.state.date}
        let date1={startTime:newDate?newDate:this.state.date,endTime:newDate?newDate:this.state.date}
        HttpClient.query('/parking-report/dailyReport/operation/spaceInfo', 'GET', date, this.handleQueryData2.bind(this));
        HttpClient.query('/parking-report/dailyReport/operation/parkingInfo', 'GET', date, this.handleQueryData3.bind(this));
        HttpClient.query('/parking-report/dailyReport/operation/payInfo', 'GET', date, this.handleQueryData4.bind(this));
        HttpClient.query('/parking-report/dailyReport/operation/complaintInfo', 'GET', date, this.handleQueryData5.bind(this));
        HttpClient.query('/parking-report/dailyReport/operation/deviceWarnCount', 'GET', date, this.handleQueryData6.bind(this));
        HttpClient.query('/parking-report/data/parkWarn/analysis/area', 'GET', date1, this.handleQueryData7.bind(this));
        HttpClient.query('/parking-report/data/parkWarn/parkwarnDistribute', 'GET', date1, this.handleQueryData71.bind(this));
        HttpClient.query('/parking-report/dailyReport/operation/inspectionTodayAttendance', 'GET', date, this.handleQueryData.bind(this));
    }
    handleQueryData2(d){
        const data=d.data;
        if(data){
        this.setState({
            // userProfile:data.userProfile||{},
             berthSituation:data||{},
            // stopOverview:data.stopOverview||{},
        });}else{
          this.setState({
              data:{},
          })
        }

        this.setState({
            loading: false
        });
    }
    handleQueryData3(d){
        const data=d.data;
        if(data){
        this.setState({
             parkingProfile:data||{},
        });}else{
          this.setState({
              data:{},
          })
        }

        this.setState({
            loading: false
        });
    }
    handleQueryData4(d){
        const data=d.data;
        if(data){
        this.setState({
             spendingProfile:data||{},
        });}else{
          this.setState({
              data:{},
          })
        }

        this.setState({
            loading: false
        });
    }
    handleQueryData5(d){
        const data=d.data;
        if(data){
        this.setState({
            complaintsOverview:data||{},
        });}else{
          this.setState({
              data:{},
          })
        }

        this.setState({
            loading: false
        });
    }
    handleQueryData6(d){
        const data=d.data;
        if(data){
        this.setState({
            maintenanceOverview:data||{},
        });}else{
          this.setState({
              data:{},
          })
        }

        this.setState({
            loading: false
        });
    }
    handleQueryData7(d){
        const data=d.data;
        if(data){
        this.setState({
            stopOverview:data||{},
        });}else{
          this.setState({
              data:{},
          })
        }

        this.setState({
            loading: false
        });
    }
    handleQueryData71(d){
        const data=d.data;
        if(data){
        this.setState({
            stopOverview1:data||{},
        });}else{
          this.setState({
              data:{},
          })
        }

        this.setState({
            loading: false
        });
    }
    handleQueryData(d){
        const data=d.data;
        if(data){
        this.setState({
            patrolInspector:data||{},
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
      this.loadData(this.state.date);
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
      const {loading,stopOverview1,date,userProfile,berthSituation,parkingProfile,spendingProfile,complaintsOverview,maintenanceOverview,stopOverview,patrolInspector,}=this.state;
      //二、泊位概况----start------
        let boweixiangqin = '本日泊位平均占用率为'+(berthSituation.averageUsageRate?( _.ceil(((berthSituation.averageUsageRate) / 100), 2) + '%'):(0+'%'))+'，泊位日周转率为'+(berthSituation.turnOverRate?(berthSituation.turnOverRate + '%'):(0+'%'))+'。';
        const meixiaoshizhanyonglv =()=>{
            let list = [];
            for (var i = 0; i < berthSituation.statisticsSpaceUsageRateHour.length; i++) {
              list.push(
                {
                  item: berthSituation.statisticsSpaceUsageRateHour[i].statisticsTime.split(' ')[1],
                  count: berthSituation.statisticsSpaceUsageRateHour[i].usageRate
                }
              );
            }
            if(berthSituation.statisticsSpaceUsageRateHour.length==0){
              list.push(
                {
                  item: '暂无数据',
                  count: 0
                }
              );
            }
            return list
          };
      //二、泊位概况----end------

      //三、停车概况----start------
      let tinchegaikuang = '本日停车'+(parkingProfile.todayParkTimes||0)+'次。其中，';
      let tinchegaikuang1 = '';
      let tinchegaikuangList = [];
      for (let i = 0; i < parkingProfile.parkTimesVOList.length; i++) {
        if(parkingProfile.parkTimesVOList[i]['parkDurationType']==0){
          tinchegaikuang1 = tinchegaikuang1+'0-1小时'+parkingProfile.parkTimesVOList[i]['parkTimes']+'次，';
          tinchegaikuangList.push({
            item: '0-1小时',
            count: parkingProfile.parkTimesVOList[i]['parkTimes']
          });
        }else if(parkingProfile.parkTimesVOList[i]['parkDurationType']==1){
          tinchegaikuang1 = tinchegaikuang1+'0.5-2小时'+parkingProfile.parkTimesVOList[i]['parkTimes']+'次，';
          tinchegaikuangList.push({
            item: '0.5-2小时',
            count: parkingProfile.parkTimesVOList[i]['parkTimes']
          });
        }else if(parkingProfile.parkTimesVOList[i]['parkDurationType']==2){
          tinchegaikuang1 = tinchegaikuang1+'2-4小时'+parkingProfile.parkTimesVOList[i]['parkTimes']+'次，';
          tinchegaikuangList.push({
            item: '2-4小时',
            count: parkingProfile.parkTimesVOList[i]['parkTimes']
          });
        }else if(parkingProfile.parkTimesVOList[i]['parkDurationType']==3){
          tinchegaikuang1 = tinchegaikuang1+'4-8小时'+parkingProfile.parkTimesVOList[i]['parkTimes']+'次，';
          tinchegaikuangList.push({
            item: '4-8小时',
            count: parkingProfile.parkTimesVOList[i]['parkTimes']
          });
        }else if(parkingProfile.parkTimesVOList[i]['parkDurationType']==4){
          tinchegaikuang1 = tinchegaikuang1+'大于8小时'+parkingProfile.parkTimesVOList[i]['parkTimes']+'次，';
          tinchegaikuangList.push({
            item: '大于8小时',
            count: parkingProfile.parkTimesVOList[i]['parkTimes']
          });
        }
      }
      tinchegaikuang = tinchegaikuang + tinchegaikuang1+'平均停车时长'+(parkingProfile.todayParkTimeAverage||0)+'分钟。';
      if(parkingProfile.parkTimesVOList.length==0){
        tinchegaikuang = '本日停车'+(parkingProfile.todayParkTimes||0)+'次。';
      }
      //三、停车概况----end------

      //四、消费概况----start------
        let xiaofeigaikuang = '本日缴费笔数'+(spendingProfile.rpPayTimeCountVO.payTimesTotalCount||0)+'笔。其中，';
        if(spendingProfile.rpPayTimeCountVO.rpPayTypeTimesCountVOList.length==0){
          xiaofeigaikuang = '本日缴费笔数'+(spendingProfile.rpPayTimeCountVO.payTimesTotalCount||0)+'笔。';
        }
        for (var i = 0; i < spendingProfile.rpPayTimeCountVO.rpPayTypeTimesCountVOList.length; i++) {
          xiaofeigaikuang = xiaofeigaikuang + zhifuleixin[spendingProfile.rpPayTimeCountVO.rpPayTypeTimesCountVOList[i].payType]+spendingProfile.rpPayTimeCountVO.rpPayTypeTimesCountVOList[i].payTimesCount+'个，'
        }
        xiaofeigaikuang = xiaofeigaikuang.substr(0,xiaofeigaikuang.length-1)+'。';

        let xiaofeigaikuang1 = '本日缴费金额'+spendingProfile.rpPayAmountCountVO.payAmountTotalCount+'元。其中，';
        if(spendingProfile.rpPayAmountCountVO.rpPayTypeAmountCountVOList.length==0){
          xiaofeigaikuang1 = '本日缴费金额'+spendingProfile.rpPayAmountCountVO.payAmountTotalCount+'元。';
        }
        for (var i = 0; i < spendingProfile.rpPayAmountCountVO.rpPayTypeAmountCountVOList.length; i++) {
          xiaofeigaikuang1 = xiaofeigaikuang1 + zhifuleixin[spendingProfile.rpPayAmountCountVO.rpPayTypeAmountCountVOList[i].payType]+spendingProfile.rpPayAmountCountVO.rpPayTypeAmountCountVOList[i].payAmountCount+'元，'
        }
        xiaofeigaikuang1 = xiaofeigaikuang1.substr(0,xiaofeigaikuang1.length-1)+'。';
        const jiaofeibishu = () => {
          let list = [];
          for (var i = 0; i < spendingProfile.rpPayTimeCountVO.rpPayTypeTimesCountVOList.length; i++) {
            list.push({item:zhifuleixin[spendingProfile.rpPayTimeCountVO.rpPayTypeTimesCountVOList[i].payType],count:spendingProfile.rpPayTimeCountVO.rpPayTypeTimesCountVOList[i].payTimesCount});
          }
          if(spendingProfile.rpPayTimeCountVO.rpPayTypeTimesCountVOList.length==0){
            list.push({item:'暂无数据',count:1});
          }
          return list
        }
        const jiaofeijine = () => {
          let list = [];
          for (var i = 0; i < spendingProfile.rpPayAmountCountVO.rpPayTypeAmountCountVOList.length; i++) {
            list.push({item:zhifuleixin[spendingProfile.rpPayAmountCountVO.rpPayTypeAmountCountVOList[i].payType],count:spendingProfile.rpPayAmountCountVO.rpPayTypeAmountCountVOList[i].payAmountCount});
          }
          if(spendingProfile.rpPayAmountCountVO.rpPayTypeAmountCountVOList.length==0){
            list.push({item:'暂无数据',count:1});
          }
          return list
        }

      //四、消费概况----end------
      //五、投诉概况----start------
        let tousugaikuang = '本日新增投诉工单'+(complaintsOverview.totalComplaintCount)||0+'个。';
        if(complaintsOverview.complaintSourceCountList.length==0){
          tousugaikuang = '本日新增维保工单'+(complaintsOverview.totalComplaintCount||0)+'个。';
        }
        const tousugaikuangList1 = [];
        const tousugaikuangList2 = [];
        if(complaintsOverview.complaintTypeCountList){
          for (var i = 0; i < complaintsOverview.complaintTypeCountList.length; i++) {
            if(complaintsOverview.complaintTypeCountList[i]['complaintType']==0){
              tousugaikuangList1.push({
                item:'泊位',
                count:complaintsOverview.complaintTypeCountList[i]['count']
              });
            }else if(complaintsOverview.complaintTypeCountList[i]['complaintType']==1){
              tousugaikuangList1.push({
                item:'充值',
                count:complaintsOverview.complaintTypeCountList[i]['count']
              });
            }else if(complaintsOverview.complaintTypeCountList[i]['complaintType']==2){
              tousugaikuangList1.push({
                item:'订单',
                count:complaintsOverview.complaintTypeCountList[i]['count']
              });
            }else if(complaintsOverview.complaintTypeCountList[i]['complaintType']==3){
              tousugaikuangList1.push({
                item:'其它问题',
                count:complaintsOverview.complaintTypeCountList[i]['count']
              });
            }else if(complaintsOverview.complaintTypeCountList[i]['complaintType']==4){
              tousugaikuangList1.push({
                item:'咨询建议',
                count:complaintsOverview.complaintTypeCountList[i]['count']
              });
            }
          }
        }
        if(complaintsOverview.complaintSourceCountList){
          for (var i = 0; i < complaintsOverview.complaintSourceCountList.length; i++) {
            if(complaintsOverview.complaintSourceCountList[i]['complaintType']==0){
              tousugaikuangList2.push({
                item:'微信公众号',
                count:complaintsOverview.complaintSourceCountList[i]['count']
              });
            }else if(complaintsOverview.complaintSourceCountList[i]['complaintType']==1){
              tousugaikuangList2.push({
                item:'支付宝服务号',
                count:complaintsOverview.complaintSourceCountList[i]['count']
              });
            }else if(complaintsOverview.complaintSourceCountList[i]['complaintType']==2){
              tousugaikuangList2.push({
                item:'手机app',
                count:complaintsOverview.complaintSourceCountList[i]['count']
              });
            }
          }
        }

      //五、投诉概况----end------
      //六、设备维保概况----start------
        let shebeiweibao = '本日新增维保工单'+(maintenanceOverview.todayIncreasedCount||0)+'个。其中，';
        if(maintenanceOverview.rpDeviceTypeWarnCountList.length==0){
          shebeiweibao = '本日新增维保工单'+(maintenanceOverview.todayIncreasedCount||0)+'个。';
        }
        for (var i = 0; i < maintenanceOverview.rpDeviceTypeWarnCountList.length; i++) {
          shebeiweibao = shebeiweibao + maintenanceOverview.rpDeviceTypeWarnCountList[i].deviceType+maintenanceOverview.rpDeviceTypeWarnCountList[i].count+'个，'
        }
        shebeiweibao = shebeiweibao.substr(0,shebeiweibao.length-1)+'。';
      const deviceType =()=>{
          let list = [];
          for (var i = 0; i < maintenanceOverview.rpDeviceTypeWarnCountList.length; i++) {
            list.push(
              {
                item: maintenanceOverview.rpDeviceTypeWarnCountList[i].deviceType,
                count: maintenanceOverview.rpDeviceTypeWarnCountList[i].count
              }
            );
          }
          if(maintenanceOverview.rpDeviceTypeWarnCountList.length==0){
            list.push(
              {
                item: '暂无数据',
                count: 0
              }
            );
          }
          return list
        };
      //六、设备维保概况----end------
      //七、违停概况----start------
        let weitingaikuang = '';
        let weitingaikuang1 = '';
        let weitingaikuangnum = 0;
        const weitingaikuangList = [];
        for (var i = 0; i < stopOverview.length; i++) {
          weitingaikuangList.push({
            count:stopOverview[i].parkwarnTimes,
            item:stopOverview[i].areaName,
          });
          weitingaikuangnum = weitingaikuangnum + stopOverview[i].parkwarnTimes;
          weitingaikuang1 = weitingaikuang1 + stopOverview[i].areaName+stopOverview[i].parkwarnTimes+'次，';
        }
        weitingaikuang ='本日违停'+(weitingaikuangnum||0)+'次，其中，'+weitingaikuang1;
        if(stopOverview.length==0){
          weitingaikuang ='本日违停0次。';
        }
        weitingaikuang = weitingaikuang.substr(0,weitingaikuang.length-1)+'。';

        const weitingaikuangList1 = [];
          if(stopOverview1['warnEstablishCount']){
            weitingaikuangList1.push({
              count:stopOverview1['warnEstablishCount'],
              item:'告警成立数',
            });
          }else if(stopOverview1['noPayCount']){
            weitingaikuangList1.push({
              count:stopOverview1['noPayCount'],
              item:'未支付',
            });
          }else if(stopOverview1['crossSpaceCount']){
            weitingaikuangList1.push({
              count:stopOverview1['crossSpaceCount'],
              item:'跨泊位',
            });
          }else if(stopOverview1['reverseParkCount']){
            weitingaikuangList1.push({
              count:stopOverview1['reverseParkCount'],
              item:'逆向停车',
            });
          }else if(stopOverview1['forbiddenTimeCount']){
            weitingaikuangList1.push({
              count:stopOverview1['forbiddenTimeCount'],
              item:'禁停时段',
            });
          }else if(stopOverview1['blackListCount']){
            weitingaikuangList1.push({
              count:stopOverview1['blackListCount'],
              item:'黑名单停车',
            });
          }
      //七、违停概况----end------

      //八、巡检员管理概况的数据----start------
        let str = '';
        for (let i = 0; i < patrolInspector.attendanceCountVO.areaAttendanceCountList.length; i++) {
          str = str +patrolInspector.attendanceCountVO.areaAttendanceCountList[i].areaName+patrolInspector.attendanceCountVO.areaAttendanceCountList[i].peopleCount+'人次，'
        }
        str = str.substr(0,str.length-1);
        const xunjian = (value) => {
          let shangban = 0;
          let chidao = 0;
          let shangbanqueka = 0;
          let zaotui = 0;
          let xiabanqueka = 0;
          let xiaban = 0;
          for (let i = 0; i < value.length; i++) {
              if(value[i].signType==0){
                if(value[i].signStatus==0){
                  chidao = chidao + value[i].count;
                }else if(value[i].signStatus==2){
                  shangban = shangban + value[i].count;
                }else{
                  shangbanqueka = shangbanqueka + value[i].count;
                }
              }

              if(value[i].signType==1){
                if(value[i].signStatus==1){
                  zaotui = zaotui + value[i].count;
                }else if(value[i].signStatus==2){
                  xiaban = xiaban + value[i].count;
                }else{
                  xiabanqueka = xiabanqueka + value[i].count;
                }
              }
            }

            return '正常上班'+shangban+'人次，迟到上班'+chidao+'人次，缺卡'+shangbanqueka+'人次。正常下班'+xiaban+'人次，早退'+zaotui+'人次，缺卡'+xiabanqueka+'人次。';
          }
        let banci = xunjian(patrolInspector.scheduleDetailCountList);
      const dataOffice =(value)=>{
        let shangban = 0;
        let chidao = 0;
        let shangbanqueka = 0;
        let zaotui = 0;
        let xiabanqueka = 0;
        let xiaban = 0;
        for (let i = 0; i < value.length; i++) {
            if(value[i].signType==0){
              if(value[i].signStatus==0){
                chidao = chidao + value[i].count;
              }else if(value[i].signStatus==2){
                shangban = shangban + value[i].count;
              }else{
                shangbanqueka = shangbanqueka + value[i].count;
              }
            }

            if(value[i].signType==1){
              if(value[i].signStatus==1){
                zaotui = zaotui + value[i].count;
              }else if(value[i].signStatus==2){
                xiaban = xiaban + value[i].count;
              }else{
                xiabanqueka = xiabanqueka + value[i].count;
              }
            }
          }
          let list = {
            shangban:[
              {
                item: "缺卡",
                count: shangbanqueka
              },
              {
                item: "正常上班",
                count: shangban
              },
              {
                item: "迟到上班",
                count: chidao
              },
            ],
            xiaban:[
              {
                item: "缺卡",
                count: xiabanqueka
              },
              {
                item: "正常打卡",
                count: xiaban
              },
              {
                item: "早退",
                count: zaotui
              },
            ],
          };
            return list
        }
        //八、巡检员管理概况的数据----end------
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>运营综合日报</div>
                </div>
              <Spin tip="加载中.." spinning={loading}>
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
                                    <label>{boweixiangqin}</label>
                                </Col>
                                <Col span={24}>
                                          <div style={{textAlign:'center'}}>
                                                <ZheXianTu data={meixiaoshizhanyonglv()}/>
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
                                    <label>{tinchegaikuang}</label>
                                </Col>
                                <Col span={7}></Col>
                                <Col span={8}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={tinchegaikuangList}/>
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
                                    <label>{xiaofeigaikuang}</label>
                                </Col>
                                <Col span={24}>
                                    <label>{xiaofeigaikuang1}</label>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={jiaofeibishu()}/>
                                                <div style={{fontSize:17}}>缴费笔数占比</div>
                                          </div>
                                </Col>
                                <Col span={8}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={jiaofeijine()}/>
                                                <div style={{fontSize:17}}>缴费金额占比</div>
                                          </div>
                                </Col>
                            </Row>
                        </Card>
                        <Card
                            title='五、投诉概况'
                        >
                            <Row gutter={50}>
                                <Col span={24}>
                                    <label>{tousugaikuang}</label>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Zhu data={tousugaikuangList1}/>
                                                <div style={{fontSize:17}}>各投诉类型数</div>
                                          </div>
                                </Col>
                                <Col span={8}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={tousugaikuangList2}/>
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
                                    <label>{shebeiweibao}</label>
                                </Col>
                                <Col span={7}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Zhu data={deviceType()}/>
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
                                    <label>{weitingaikuang}</label>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Zhu data={weitingaikuangList}/>
                                                <div style={{fontSize:17}}>各区违停数</div>
                                          </div>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Zhu data={weitingaikuangList1}/>
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
                                  <label>本日上岗<nobr {...numberStyle} >{patrolInspector.attendanceCountVO.totalPeopleCount}</nobr>人次。其中，{str}。</label>
                                </Col>
                                <Col span={24}>
                                  <label>{banci}</label>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={9}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={dataOffice(patrolInspector.scheduleDetailCountList).shangban}/>
                                                <div style={{fontSize:17}}>上班情况</div>
                                          </div>
                                </Col>
                                <Col span={8}>
                                          <div style={{textAlign:'center'}}>
                                                <Huan data={dataOffice(patrolInspector.scheduleDetailCountList).xiaban}/>
                                                <div style={{fontSize:17}}>下班情况</div>
                                          </div>
                                </Col>
                            </Row>
                        </Card>
                </div>
              </Spin>
            </div>
        );
    }
}

export default OperationalDaily;
