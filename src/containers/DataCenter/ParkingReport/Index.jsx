import React, {Component} from 'react';
import {
  Row, Col, Radio, DatePicker, Button, Cascader, Table, Card, Spin, Form
} from "antd";

import {HttpClient} from "@/common/HttpClient";
import ChinaRegion from "@/components/ChinaRegion";

import LineChart from './components/LineChart';//引入折线图
import LineChart1 from './components/LineChart1';//引入%折线图
import LineChart3 from './components/LineChart3';//引入%折线图
import Histogram from './components/Histogram';//引入柱状图
import Histogram2 from './components/Histogram2';//引入%柱状图
import Histogram1 from './components/Histogram1';//引入堆叠柱状图
import moment from 'moment';
import _ from 'lodash';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
class ParkingReport extends Component {

    constructor(props) {
        super(props);
        this.payLoad = {
            city: window.cityCode,
            beginDate: moment().subtract(30, 'day').format('YYYY-MM-DD'),
            endDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        }
        this.state = {
          loading:false,
          cascaderOptions: [],
          ParkingToday:{
          },
          HistoricalParkingData:{
          },

          zxdata1:[],
          zxdata2:[],
          zxdata3:[],

          zdata1:[],
          zdata2:[],
          zdata3:[],

          table1:[],
          table2:[],
          table3:[],

          bool1:true,
          bool2:false,
          bool3:false,
        };
    }


    //加载数据
    loadData() {
      this.setState({
        loading: true
      });
      HttpClient.query("/parking-report/report/road/center/park/today", "GET", null, this.handleQueryData.bind(this));
    }
    // 日期变化
    onDateChange(dates, dateStrings) {
        this.payLoad.beginDate = dateStrings[0];
        this.payLoad.endDate = dateStrings[1];
    }
    search() {
        this.getHistoryTotalReportData();
    }
    filterParams(params) {
        const newParams = {};
        _.forIn(params, (value, key) => {
            if (value || value === 0) {
                newParams[key] = value
            }
        });
        return newParams
    }
    getHistoryTotalReportData() {
        // 停车报表-历史统计-总计
        HttpClient.query(`/parking-report/report/road/center/park/history`, 'GET', {
            city: window.cityCode,
            ...this.filterParams(this.payLoad)
        }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data || null;
                this.setState({
                    HistoricalParkingData: data
                })
            }
        });
        // 停车报表-历史统计-出入场车流
        HttpClient.query(`/parking-report/report/road/center/park/history/inout`, 'GET', {
            city: window.cityCode,
            ...this.filterParams(this.payLoad)
        }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data || null;
                if (data.dayAreaList) {
                    data.dayAreaList.forEach((city) => {
                        city.key = `${city.day}${city.id}`;
                        if (city.subAreaList) {
                            city.subAreaList.forEach((subArea) => {
                                subArea.key = `${city.day}${subArea.id}`
                            })
                        }
                    })
                }
                this.setState({
                    zxdata1: data.dayList,
                    zdata1: data.areaList,
                    table1: data.dayAreaList,
                })
            }
        });
        // 停车报表-历史统计-周转率
        HttpClient.query(`/parking-report/report/road/center/park/history/ratio`, 'GET', {
            city: window.cityCode,
            ...this.filterParams(this.payLoad)
        }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data || null;
                if (data.dayAreaList) {
                    data.dayAreaList.forEach((city) => {
                        city.key = `${city.day}${city.id}`;
                        if (city.subAreaList) {
                            city.subAreaList.forEach((subArea) => {
                                subArea.key = `${city.day}${subArea.id}`
                            })
                        }
                    })
                }
                this.setState({
                  zxdata2: data.dayList,
                  zdata2: data.areaList,
                  table2: data.dayAreaList,
                })
            }
        });
        // 停车报表-历史统计-停车次数/时长
        HttpClient.query(`/parking-report/report/road/center/park/history/parktimes`, 'GET', {
            city: window.cityCode,
            ...this.filterParams(this.payLoad)
        }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data || null;
                if (data.dayAreaList) {
                    data.dayAreaList.forEach((city) => {
                        city.key = `${city.day}${city.id}`;
                        if (city.subAreaList) {
                            city.subAreaList.forEach((subArea) => {
                                subArea.key = `${city.day}${subArea.id}`
                            })
                        }
                    })
                }
                console.log(data.dayAreaList);
                this.setState({
                  zxdata3: data.dayList,
                  zdata3: data.areaList,
                  table3: data.dayAreaList,
                })
            }
        });





    }
    // loadData回调函数
    handleQueryData(d, type) {
      const data = d.data;
      console.log(d);
      if (type === HttpClient.requestSuccess) {
        this.setState({
          ParkingToday:data,
          // HistoricalParkingData:this.state.HistoricalParkingData,
          // options:this.state.options,
          // table1:this.state.table1,
          // table2:this.state.table2,
          // table3:this.state.table3,
        })
      } else {
          //失败----做除了报错之外的操作
      }
      this.setState({
        loading: false
      });
    }
    build=(a)=>{
      if(a.target.value==1){
        this.setState({
        bool1:true,
        bool2:false,
        bool3:false,
        })
      }else if(a.target.value==2){
        this.setState({
        bool1:false,
        bool2:true,
        bool3:false,
        })
      }else if(a.target.value==3){
        this.setState({
        bool1:false,
        bool2:false,
        bool3:true,
        })
      }else{
        this.setState({
          bool1:false,
        })
      }
    }

    componentWillMount() {

    }

    componentDidMount() {
      this.loadData();
      // 获取市区级联数据
      HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/monitoringCenter/${window.cityCode}/getPersonAttendance`, 'GET', null, (d, type) => {
          if (type === HttpClient.requestSuccess) {
              const data = d.data ? [d.data] : [];
              this.setState({
                  cascaderOptions: data
              })
          }
      });
      this.getHistoryTotalReportData();
    }

    componentWillUnmount() {

    }

    render() {
      const {
        cascaderOptions,loading, ParkingToday, HistoricalParkingData, bool1, bool2, bool3,
        zxdata1, zxdata2, zxdata3,
        zdata1, zdata2, zdata3,
        table1, table2, table3,
      }= this.state;

      const { getFieldDecorator } = this.props.form;

      const getNowFormatDate=()=> {//获取当前时间
        	let date = new Date();
        	let seperator1 = "-";
        	let seperator2 = ":";
        	let month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
        	let strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
        	let currentdate = date.getFullYear() + seperator1  + month  + seperator1  + strDate
        			+ " "  + date.getHours()  + seperator2  + date.getMinutes()
        			+ seperator2 + date.getSeconds();
        	return currentdate;
      }

      const columns1 = [
          {
              title: "日期",
              dataIndex: "day",
              render: (value) => value || "",
          },{
              title: "范围",
              dataIndex: "name",
              render: (value) => value || "--",
          },{
              title: "入场次数",
              dataIndex: "in",
              render: (value) => value || "0",
          },{
              title: "出场次数",
              dataIndex: "out",
              render: (value) => value || "0",
          },
        ];
      const columns2 = [
            {
                title: "日期",
                dataIndex: "day",
                render: (value) => value || "",
            },{
                title: "范围",
                dataIndex: "name",
                render: (value) => value || "--",
            },{
                title: "平均周转率",
                dataIndex: "ratio",
                render: (value) => value?(_.ceil((value * 100), 2) + '%'):(0+'%'),
            },
          ];
      const columns3 = [
                {
                    title: "日期",
                    dataIndex: "day",
                    render: (value) => value || "",
                },{
                    title: "范围",
                    dataIndex: "name",
                    render: (value) => value || "--",
                },{
                    title: "停车总次数",
                    dataIndex: "parkCount",
                    render: (value) => value || "0",
                },{
                    title: "0-1小时",
                    render: (text, record) => {
                      if(record.timeList){
                        let re = '0';
                        for (var i = 0; i < record.timeList.length; i++) {
                          if(record.timeList[i].name==0){
                            re = record.timeList[i].count;
                          }
                        }
                        return(re);
                      }else{
                        return('0');
                      }
                    }
                },{
                    title: "1-2小时",
                    render: (text, record) => {
                      if(record.timeList){
                        let re = '0';
                        for (var i = 0; i < record.timeList.length; i++) {
                          if(record.timeList[i].name==1){
                            re = record.timeList[i].count;
                          }
                        }
                        return(re);
                      }else{
                        return('0');
                      }
                    }
                },{
                    title: "2-4小时",
                    render: (text, record) => {
                      if(record.timeList){
                        let re = '0';
                        for (var i = 0; i < record.timeList.length; i++) {
                          if(record.timeList[i].name==2){
                            re = record.timeList[i].count;
                          }
                        }
                        return(re);
                      }else{
                        return('0');
                      }
                    }
                },{
                    title: "4-8小时",
                    render: (text, record) => {
                      if(record.timeList){
                        let re = '0';
                        for (var i = 0; i < record.timeList.length; i++) {
                          if(record.timeList[i].name==3){
                            re = record.timeList[i].count;
                          }
                        }
                        return(re);
                      }else{
                        return('0');
                      }
                    }
                },{
                    title: ">8小时",
                    render: (text, record) => {
                      if(record.timeList){
                        let re = '0';
                        for (var i = 0; i < record.timeList.length; i++) {
                          if(record.timeList[i].name==4){
                            re = record.timeList[i].count;
                          }
                        }
                        return(re);
                      }else{
                        return('0');
                      }
                    }
                },
              ];

        return (
            <div className='page'>
                <div className='page-header'>
                    <div>停车报表</div>
                </div>
              <Spin tip="加载中.." spinning={loading}>
                <div className='page-content'style={{ padding: 0, background: 'transparent' }}>
                <Card title={'今日停车概况 (截至'+getNowFormatDate()+')'}>
                  <Row gutter={64} type="flex" justify="space-around" style={{textAlign:'center'}}>
                    <Col span={4} style={{marginTop:20}}>
                      <Row gutter={0} >
                        <Col span={24} style={{color:'#868686'}}>
                          泊位总数
                        </Col>
                        <Col span={24} style={{fontSize:30,color:'#FF003B'}}>
                          {ParkingToday.totalSpaceCount||'0'}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4} style={{marginTop:20}}>
                      <Row gutter={0} >
                        <Col span={24} style={{color:'#868686'}}>
                          当前占用数
                        </Col>
                        <Col span={24} style={{fontSize:30,color:'#FF003B'}}>
                          {ParkingToday.usedSpaceCount||'0'}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4} style={{marginTop:20}}>
                      <Row gutter={0} >
                        <Col span={24} style={{color:'#868686'}}>
                          当前占用率
                        </Col>
                        <Col span={24} style={{fontSize:30,color:'#FF003B'}}>
                        {ParkingToday.spaceUsedRatio ? _.ceil((ParkingToday.spaceUsedRatio * 100), 2) : '0'} %
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4} style={{marginTop:20}}>
                      <Row gutter={0} >
                        <Col span={24} style={{color:'#868686'}}>
                          实时空位
                        </Col>
                        <Col span={24} style={{fontSize:30,color:'#FF003B'}}>
                          {ParkingToday.freeSpaceCount||'0'}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4} style={{marginTop:20}}>
                      <Row gutter={0} >
                        <Col span={24} style={{color:'#868686'}}>
                          今日停车次数
                        </Col>
                        <Col span={24} style={{fontSize:30,color:'#FF003B'}}>
                          {ParkingToday.parkTimes||'0'}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4} style={{marginTop:20}}>
                      <Row gutter={0} >
                        <Col span={24} style={{color:'#868686'}}>
                          平均停车时长
                        </Col>
                        <Col span={24} style={{fontSize:30,color:'#FF003B'}}>
                          {ParkingToday.averageParkTime||'0'}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  </Card>
                <Card title={'历史停车数据'}>
                  <Form>
                    <Row gutter={64} type="flex" justify="space-around">
                      <Col span={24} style={{marginTop:25}}>
                        <Row gutter={40} style={{ marginBottom: 20 }}>
                            <Col span={8}>
                                <RangePicker style={{ width: '100%' }}
                                             allowClear={false}
                                             defaultValue={[moment().subtract(30, 'day'), moment().subtract(1, 'day')]}
                                             disabledDate={(current) => current > moment().startOf('day')}
                                             onChange={this.onDateChange.bind(this)}
                                             ranges={{
                                                 '近7天': [moment().subtract(7, 'day'), moment().subtract(1, 'day')],
                                                 '近30天': [moment().subtract(30, 'day'), moment().subtract(1, 'day')],
                                             }}/>
                            </Col>
                            <Col span={8}>
                              <Cascader style={{ width: '100%' }} changeOnSelect options={cascaderOptions}
                                        defaultValue={[parseInt(window.cityCode)]}
                                        allowClear={false}
                                        onChange={(value) => {
                                            const districtInfo = ['city', 'area', 'subArea'];
                                            if (value) {
                                                value.forEach((item, index) => {
                                                    this.payLoad[districtInfo[index]] = item
                                                })
                                            }
                                        }}
                                        fieldNames={{ label: 'name', value: 'id', children: 'children' }}/>
                            </Col>
                            <Col span={8}>
                                <Button type='primary' onClick={this.search.bind(this)}>查询</Button>
                            </Col>
                        </Row>
                      </Col>
                      <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                        <Row gutter={0}>
                          <Col span={6} style={{marginTop:20}}>
                            <Row gutter={0} >
                              <Col span={24} style={{color:'#868686'}}>
                                入场总次数
                              </Col>
                              <Col span={24} style={{fontSize:30}}>
                                {HistoricalParkingData.enterCount||'0'}
                              </Col>
                            </Row>
                          </Col>
                          <Col span={6} style={{marginTop:20}}>
                            <Row gutter={0} >
                              <Col span={24} style={{color:'#868686'}}>
                                出场总次数
                              </Col>
                              <Col span={24} style={{fontSize:30}}>
                                {HistoricalParkingData.leaveCount||'0'}
                              </Col>
                            </Row>
                          </Col>
                          <Col span={6} style={{marginTop:20}}>
                            <Row gutter={0} >
                              <Col span={24} style={{color:'#868686'}}>
                                停车总次数
                              </Col>
                              <Col span={24} style={{fontSize:30}}>
                                {HistoricalParkingData.parkCount||'0'}
                              </Col>
                            </Row>
                          </Col>
                          <Col span={6} style={{marginTop:20}}>
                            <Row gutter={0} >
                              <Col span={24} style={{color:'#868686'}}>
                                平均停车时长
                              </Col>
                              <Col span={24} style={{fontSize:30}}>
                                {HistoricalParkingData.averageParkTime||'0'}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Form>
                  </Card>
                </div>
                <div className='page-content' style={{ padding: 0 ,marginTop:20}}>
                  <Row gutter={64}>
                    <Col span={24} style={{marginLeft:20, marginTop:15,}}>
                      <Radio.Group defaultValue="1" buttonStyle="solid" onChange={this.build.bind(this)}>
                        <Radio.Button value="1" style={{width:150,textAlign:'center'}} >出入场车流</Radio.Button>
                        <Radio.Button value="2" style={{width:150,textAlign:'center'}} >周转率</Radio.Button>
                        <Radio.Button value="3" style={{width:150,textAlign:'center'}} >停车次数/时长</Radio.Button>
                      </Radio.Group>
                    </Col>
                  </Row>
                  {this.state.bool1?(
                <Card bordered={false}>
                  <Row gutter={64} style={{textAlign:'left',marginTop:20}}>
                    <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                      每日出入车流统计
                    </Col>
                    <Col span={24} style={{marginTop:30}}>
                      <LineChart data={zxdata1} />
                    </Col>
                    <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                      区域出入车流统计
                    </Col>
                    <Col span={24} style={{marginTop:30}}>
                      <Histogram  data={zdata1} type={'interval'} />
                    </Col>
                  </Row>
                  <Row gutter={64} style={{marginTop:30}}>
                    <Col span={24}>
                      <Table
                          pageSize={10}
                          columns={columns1}
                          dataSource={table1}
                          childrenColumnName="subAreaList"
                      />
                    </Col>
                  </Row>
                </Card>
                  ):''}
                  {this.state.bool2?(
                <Card bordered={false}>
                  <Row gutter={64} style={{textAlign:'left',marginTop:20}}>
                    <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                      每日周转率统计
                    </Col>
                    <Col span={24} style={{marginTop:30}}>
                      <LineChart1 data={zxdata2} />
                    </Col>
                    <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                      区域平均周转率统计
                    </Col>
                    <Col span={24} style={{marginTop:30}}>
                      <Histogram2  data={zdata2} />
                    </Col>
                  </Row>
                  <Row gutter={64} style={{marginTop:30}}>
                    <Col span={24}>
                      <Table
                          columns={columns2}
                          dataSource={table2}
                          childrenColumnName="subAreaList"
                      />
                    </Col>
                  </Row>
                </Card>
                ):''}
                  {this.state.bool3?(
                <Card bordered={false}>
                  <Row gutter={64} style={{textAlign:'left',marginTop:20}}>
                    <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                      每日停车次数统计
                    </Col>
                    <Col span={24} style={{marginTop:30}}>
                      <LineChart3 data={zxdata3} type={'intervalStack'}/>
                    </Col>
                    <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                      区域停车次数与时长统计
                    </Col>
                    <Col span={24} style={{marginTop:30}}>
                      <Histogram1  data={zdata3} />
                    </Col>
                  </Row>
                  <Row gutter={64} style={{marginTop:30}}>
                    <Col span={24}>
                      <Table
                          columns={columns3}
                          dataSource={table3}
                          childrenColumnName="subAreaList"
                      />
                    </Col>
                  </Row>
                </Card>
                  ):''}
                </div>
              </Spin>
            </div>
            );
      }
}

export default Form.create()(ParkingReport);
