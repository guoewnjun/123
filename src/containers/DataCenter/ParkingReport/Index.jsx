import React, {Component} from 'react';
import {Empty, Row, Col, Select, Radio, DatePicker, Button, Cascader, Table,} from "antd";

import {HttpClientImmidIot} from "@/common/HttpClientImmidIot";

import LineChart from './components/LineChart';//引入折线图
import Histogram from './components/Histogram';//引入柱状图

const RangePicker = DatePicker.RangePicker;
const { Option } = Select;
class ParkingReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
          ParkingToday:{
            BerthageTotal:'23,025',//泊位总数
            CurrentOccupation:'18,025',//当前占用数
            CurrentOccupancyRate:'72.37%',//当前占用率
            CurrentTimeSlots:'2,025',//实时空位
            StopsToday:'1,023',//今日停车次数
            AverageStoppingTime:'80分钟',//平均停车时长
          },
          HistoricalParkingData:{
            TotalAdmission:'18,290',//入场总次数
            TotalAppearances:'15,290',//出场总次数
            TotalStops:'18,290',//停车总次数
            AverageStoppingTime:'80分钟',//平均停车时长
          },
          options:[
            {
              value: 'shenzhen',
              label: '深圳',
              children: [
                {
                  value: 'nanshanqu',
                  label: '南山区',
                  children: [
                    {
                      value: 'xilipianqu',
                      label: '西丽片区',
                    },
                    {
                      value: 'nantoupianqu',
                      label: '南头片区',
                    },
                  ],
                },
                {
                  value: 'futianqu',
                  label: '福田区',
                  children: [
                    {
                      value: 'huaqiangbeipianqu',
                      label: '华强北片区',
                    },
                    {
                      value: 'tiananpianqu',
                      label: '天安片区',
                    },
                  ],
                },
              ],
            },
          ],

          table1:[
            {
              key: '1',
              date: '2019-05-05',
              scope: '深圳',
              admissions: '18029',
              appearances: '20230',
              operation: '收起',
            },
            {
              key: '2',
              date: '2019-05-05',
              scope: '福田区',
              admissions: '3290',
              appearances: '4800',

            },
            {
              key: '3',
              date: '2019-05-05',
              scope: '南山区',
              admissions: '3782',
              appearances: '3782',
              
            },
          ],
          table2:[],
          table3:[],

          otherParams: {
              startTime: null, //开始时间
              endTime: null,//结束时间
          },
        };
    }

    //加载数据
    loadData() {
        this.setState({

        });
        HttpClientImmidIot.query("/DataCenter/DeviceReport/Index", "GET", null, this.handleQueryData.bind(this))
    }

    // loadData回调函数
    handleQueryData(d, type) {
        const data = d.data;
        if (type === HttpClientImmidIot.requestSuccess) {
            this.setState({
              ParkingToday:this.state.ParkingToday,
              HistoricalParkingData:this.state.HistoricalParkingData,
              options:this.state.options,
              table1:this.state.table1,
              table2:this.state.table2,
              table3:this.state.table3,
            })
        } else {
            //失败----做除了报错之外的操作
        }
    }

    onChange(value) {
      console.log(value);
    }

    //查询按钮
    handleQuery() {
      this.setState({

      });
      this.loadData(this.state.otherParams)
    }

    componentWillMount() {

    }

    componentDidMount() {
      this.loadData();
    }

    componentWillUnmount() {

    }

    render() {
      const {
        ParkingToday, HistoricalParkingData, otherParams, options, table1, table2, table3,
      }= this.state;

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
              dataIndex: "date",
              render: (value) => value || "--",
          },{
              title: "范围",
              dataIndex: "scope",
              render: (value) => value || "--",
          },{
              title: "入场次数",
              dataIndex: "admissions",
              render: (value) => value || "--",
          },{
              title: "出场次数",
              dataIndex: "appearances",
              render: (value) => value || "--",
          },{
              title: "操作",
              dataIndex: "operation",
              render: (value) =>  (
                  <a style={{ color: "#1890FF" }}>{value}</a>),
          },
        ];


        return (
            <div className='page'>
                <div className='page-header'>
                    <div>停车报表</div>
                </div>
                <div className='page-content' style={{ padding: 0 }}>
                  <Row gutter={0} >
                    <Col span={24}>
                      <div style={{marginLeft:20, marginTop:12, fontSize:20,}}>今日停车概况 (截至{getNowFormatDate()})</div>
                    </Col>
                    <Col span={4} style={{marginTop:15,textAlign:'center'}}>
                      <div style={{color:'#868686'}}>泊位总数</div>
                      <div style={{marginTop:0,fontSize:30,color:'#FF003B'}}>{ParkingToday.BerthageTotal}</div>
                    </Col>
                    <Col span={4} style={{marginTop:15,textAlign:'center'}}>
                      <div style={{color:'#868686'}}>当前占用数</div>
                      <div style={{marginTop:0,fontSize:30,color:'#FF003B'}}>{ParkingToday.CurrentOccupation}</div>
                    </Col>
                    <Col span={4} style={{marginTop:15,textAlign:'center'}}>
                      <div style={{color:'#868686'}}>当前占用率</div>
                      <div style={{marginTop:0,fontSize:30,color:'#FF003B'}}>{ParkingToday.CurrentOccupancyRate}</div>
                    </Col>
                    <Col span={4} style={{marginTop:15,textAlign:'center'}}>
                      <div style={{color:'#868686'}}>实时空位</div>
                      <div style={{marginTop:0,fontSize:30,color:'#FF003B'}}>{ParkingToday.CurrentTimeSlots}</div>
                    </Col>
                    <Col span={4} style={{marginTop:15,textAlign:'center'}}>
                      <div style={{color:'#868686'}}>今日停车次数</div>
                      <div style={{marginTop:0,fontSize:30,color:'#FF003B'}}>{ParkingToday.StopsToday}</div>
                    </Col>
                    <Col span={4} style={{marginTop:15,textAlign:'center'}}>
                      <div style={{color:'#868686'}}>平均停车时长</div>
                      <div style={{marginTop:0,fontSize:30,color:'#FF003B'}}>{ParkingToday.AverageStoppingTime}</div>
                    </Col>
                  </Row>
                </div>
                <div className='page-content' style={{ padding: 0 }}>

                    <Row gutter={0}>
                      <Col span={24}>
                        <div style={{marginLeft:20, marginTop:12, fontSize:20,}}>历史停车数据</div>
                      </Col>
                      <Col span={24} style={{marginTop:15}}>
                        <Col span={6} style={{marginLeft:20,}}>
                          <RangePicker style={{width: "100%",}} format="YYYY-MM-DD"
                              onChange={(dates, dateString) => {
                                  this.state.otherParams.startTime = dateString[0];
                                  this.state.otherParams.endTime = dateString[1];
                                  }}
                          />
                        </Col>
                        <Col span={6} style={{marginLeft:80,}}>
                          <Cascader options={options} onChange={() => this.onChange()} placeholder="深圳" style={{width:'100%'}} changeOnSelect />
                        </Col>
                        <Col span={4} style={{marginLeft:80,}}>
                          <Button type="primary" onClick={this.handleQuery.bind(this)}>查询</Button>
                        </Col>
                      </Col>
                      <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                        <Col span={6} style={{marginTop:15,textAlign:'center'}}>
                          <div style={{color:'#868686'}}>平均停车时长</div>
                          <div style={{marginTop:0,fontSize:30}}>{HistoricalParkingData.TotalAdmission}</div>
                        </Col>
                        <Col span={6} style={{marginTop:15,textAlign:'center'}}>
                          <div style={{color:'#868686'}}>平均停车时长</div>
                          <div style={{marginTop:0,fontSize:30}}>{HistoricalParkingData.TotalAppearances}</div>
                        </Col>
                        <Col span={6} style={{marginTop:15,textAlign:'center'}}>
                          <div style={{color:'#868686'}}>平均停车时长</div>
                          <div style={{marginTop:0,fontSize:30}}>{HistoricalParkingData.TotalStops}</div>
                        </Col>
                        <Col span={6} style={{marginTop:15,textAlign:'center'}}>
                          <div style={{color:'#868686'}}>平均停车时长</div>
                          <div style={{marginTop:0,fontSize:30}}>{HistoricalParkingData.AverageStoppingTime}</div>
                        </Col>
                      </Col>
                    </Row>
                    <hr />
                    <Row gutter={0}>
                      <div style={{marginLeft:20, marginTop:12,}}>
                        <Radio.Group defaultValue="a" buttonStyle="solid">
                          <Radio.Button value="a" style={{width:120,textAlign:'center'}}>出入场车流</Radio.Button>
                          <Radio.Button value="b" style={{width:120,textAlign:'center'}}>周转率</Radio.Button>
                          <Radio.Button value="c" style={{width:120,textAlign:'center'}}>停车次数/时长</Radio.Button>
                        </Radio.Group>
                      </div>
                      <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                        每日出入车流统计
                      </Col>
                      <Col span={24}>
                        <LineChart />
                      </Col>
                      <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                        区域出入车流统计
                      </Col>
                      <Col span={24}>
                        <Histogram />
                      </Col>
                    </Row>
                    <Table
                        style={{marginTop: 20,textAlign:'center'}}
                        bordered
                        pagination={false}
                        columns={columns1}
                        dataSource={table1}
                    />
                </div>
            </div>
        );
    }
}


export default ParkingReport;
