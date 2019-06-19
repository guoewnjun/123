import React, {Component} from 'react';
import {Row,Col,Select,Button,Table,Radio} from "antd";
import {HttpClientImmidIot} from "../../../common/HttpClientImmidIot";
import {Chart,Geom,Axis,Tooltip,} from "bizcharts";
import _ from 'lodash';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class UerReport extends Component {
  constructor(props) {
      super(props);
      this.state = {
          loading: false,
          deadline:'',
          userTotal:'',
          newUsers:'',
          recharge:'',
          parkingUsers:'',
          activeUsers:'',
          lists:[],
          list1:[],
          list2:[],
          list3:[],
          list4:[],
          list:[],
      }
  }


    componentWillMount() {

    }

    componentDidMount() {
      this.loadData();
    }

    componentWillUnmount() {

    }

    loadData() {
        this.setState({
            loading: true
        });
        HttpClientImmidIot.query("/containers/DataCenter/UserReport", "GET", null, this.handleQueryData.bind(this))
    }

    handleQueryData(d, type) {
        const data = d.data;
        const list=[];
        const list1=[];
        const list2=[];
        const list3=[];
        const list4=[];
        if (type === HttpClientImmidIot.requestSuccess) {
          for(let i=0;i<data.lists.length;i++){
            list1.push({
              time:data.lists[i].time,
              num:data.lists[i].newUsers,
            })
            list2.push({
              time:data.lists[i].time,
              num:data.lists[i].phoneUsers,
            })
            list3.push({
              time:data.lists[i].time,
              num:data.lists[i].stopUsers,
            })
            list4.push({
              time:data.lists[i].time,
              num:data.lists[i].activeUser,
            })
          };
            this.setState({
                lists: data.lists,
                deadline: data.deadline,
                userTotal: data.userTotal,
                newUsers: data.newUsers,
                recharge: data.recharge,
                parkingUsers: data.parkingUsers,
                activeUsers: data.activeUsers,
                lists: data.lists,
                list1:list1,
                list2:list2,
                list3:list3,
                list4:list4,
                list:list1,
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

    handleSelect=(a)=>{
      if(a.target.value==1){
        this.setState({
          list: _.cloneDeep(this.state.list1),
        })
      }else if(a.target.value==2){
        this.setState({
          list: _.cloneDeep(this.state.list2),
        })
      }else if(a.target.value==3){
        this.setState({
          list: _.cloneDeep(this.state.list3),
        })
      }else if(a.target.value==4){
        this.setState({
          bool:false,
          list: _.cloneDeep(this.state.list4),
        })
      }else{
        this.setState({
          bool:false,
          list: _.cloneDeep(this.state.list1),
        })
      }
    }

    render() {
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

      const {lists,list1,list2,list3,list4,list,loading, deadline, userTotal, newUsers, recharge, parkingUsers, activeUsers} = this.state;
      const columns = [
          {
              title: "日期",
              dataIndex: "time",
              render: (value) => value || "--",
          }, {
              title: "新增用户",
              dataIndex: "newUsers",
              render: (value) => value || "--",
          }, {
              title: "充值用户",
              dataIndex: "phoneUsers",
              render: (value) => value || "--",
          }, {
              title: "停车用户",
              dataIndex: "stopUsers",
              render: (value) => value || "--",
          },{
              title: "活跃用户",
              dataIndex: "activeUser",
              render: (value) => value || "--",
          },
      ];
      // const data = [
      //      {
      //        taday: this.state.year+'-06-01',
      //        value: 3454
      //      },
      //      {
      //        taday: "2019-06-05",
      //        value: 3443
      //      },
      //      {
      //        taday: "2019-06-10",
      //        value: 6654
      //      },
      //      {
      //        taday: "2019-06-15",
      //        value: 3454
      //      },
      //      {
      //        taday: "2019-06-20",
      //        value: 3443
      //      },
      //      {
      //        taday: "2019-06-25",
      //        value: 3454
      //      },
      //      {
      //        taday: "2019-06-30",
      //        value: 7676
      //      },
      //    ];
         const cols = {
           value: {
             min: 0
           },
           year: {
             range: [0, 1]
           }
         };
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>用户报表</div>
                </div>
                <div className='page-content'>
                     <Row gutter={48}>
                          <Col span={8}>
                               今日用户概况（截至{getNowFormatDate()}）
                          </Col>
                     </Row>
                     <Row gutter={48}>
                          <Col span={4} style={{textAlign:'center'}}>
                               <p >用户总数</p>
                               <div style={{fontSize:25,color:'red',marginTop:-25}}>{userTotal}</div>
                          </Col>
                          <Col span={4} style={{textAlign:'center',marginLeft:50}}>
                               <p >新增用户数</p>
                               <p style={{fontSize:25,color:'red',marginTop:-25}}>{newUsers}</p>
                          </Col>
                          <Col span={4} style={{textAlign:'center',marginLeft:50}}>
                               <p >充值用户数</p>
                               <p style={{fontSize:25,color:'red',marginTop:-25}}>{recharge}</p>
                          </Col>
                          <Col span={4} style={{textAlign:'center',marginLeft:50}}>
                               <p >停车用户数</p>
                               <p style={{fontSize:25,color:'red',marginTop:-25}}>{parkingUsers}</p>
                          </Col>
                          <Col span={4} style={{textAlign:'center',marginLeft:50}}>
                               <p >活跃用户数</p>
                               <p style={{fontSize:25,color:'red',marginTop:-25}}>{activeUsers}</p>
                          </Col>
                     </Row>
                </div>
                <div className='page-content'>
                      <Row gutter={48}>
                           <Col span={24}>
                                 <div style={{float:'left'}}>
                                      <span>年份</span>
                                      <Select defaultValue="jack" style={{ width: 160,marginLeft:10}} onChange={(e) => {
                                          this.state.year= e.value;
                                      }}>
                                            <Option value="jack">2019</Option>
                                            <Option value="lucy">2018</Option>
                                       </Select>
                                 </div>
                                 <div style={{float:'left',marginLeft:50}}>
                                      <span>月份</span>
                                      <Select defaultValue="jack" style={{ width: 160,marginLeft:10}}>
                                            <Option value="jack">5月</Option>
                                            <Option value="lucy">6月</Option>
                                            <Option value="lucy">...</Option>
                                       </Select>
                                 </div>
                           </Col>
                      </Row>
                      <Row gutter={48}>
                           <Col span={24}>
                               <div style={{marginTop:20}}>
                                    <Radio.Group defaultValue="1" buttonStyle="solid" onChange={this.handleSelect.bind(this)}>
                                        <Radio.Button value="1">新增用户</Radio.Button>
                                        <Radio.Button value="2">充值用户</Radio.Button>
                                        <Radio.Button value="3">停车用户</Radio.Button>
                                        <Radio.Button value="4">活跃用户</Radio.Button>
                                    </Radio.Group>
                               </div>
                           </Col>
                      </Row>
                      <Row gutter={48}>
                           <Col span={24}>
                                 <div>
                                    <Chart height={400} data={list} scale={cols} forceFit>
                                      <Axis name="time" />
                                      <Axis name="num" />
                                      <Tooltip crosshairs={{type: "y"}}/>
                                      <Geom type="line" position="time*num" size={2} />
                                      <Geom
                                        type="point"
                                        position="time*num"
                                        size={4}
                                        shape={"circle"}
                                        style={{stroke: "#fff",lineWidth: 1}}/>
                                    </Chart>
                                </div>
                           </Col>
                      </Row>
                      <Row gutter={48}>
                            <Col span={24}>
                                <div style={{fontSize:20}}>明细数据</div>
                            </Col>
                           <Col span={24}>
                               <Table
                                   style={{marginTop: "20px"}}
                                   columns={columns}
                                   dataSource={lists}
                                   pagination={false}
                               />
                           </Col>
                      </Row>

                </div>
            </div>
        );
    }
}

export default UerReport;
