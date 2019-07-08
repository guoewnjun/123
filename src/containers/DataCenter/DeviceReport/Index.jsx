import React, {Component} from 'react';
import {Row, Col} from "antd";

import {HttpClientImmidIot} from "@/common/HttpClientImmidIot";
import AnnularChart from './components/AnnularChart';//引入环形图

class DeviceReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
          time:'',
          cjq:{},//车检器
          wap:{},//无线网关
          wr:{},//无线转发器
          pda:{},//巡检PDA
          cjqqyzb:[],//车检器区域占比
          wapqyzb:[],//无线网关区域占比
          wrqyzb:[],//无线转发器区域占比
          pdaqyzb:[],//巡检PDA区域占比
          cjqcjzb:[],//车检器厂家占比
          wapcjzb:[],//无线网关厂家占比
          wrcjzb:[],//无线转发器厂家占比
          pdacjzb:[],//巡检PDA厂家占比
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
              time:data.time,
              cjq:data.cjq,
              wap:data.wap,
              wr:data.wr,
              pda:data.pda,
              cjqqyzb:data.cjqqyzb,
              wapqyzb:data.wapqyzb,
              wrqyzb:data.wrqyzb,
              pdaqyzb:data.pdaqyzb,
              cjqcjzb:data.cjqcjzb,
              wapcjzb:data.wapcjzb,
              wrcjzb:data.wrcjzb,
              pdacjzb:data.pdacjzb,
            })
        } else {
            //失败----做除了报错之外的操作
        }
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
        time, cjq, wap, wr, pda, cjqqyzb, wapqyzb, wrqyzb, pdaqyzb, cjqcjzb, wapcjzb, wrcjzb, pdacjzb,
      }= this.state;

        return (
            <div className='page'>
                <div className='page-header'>
                    <div>设备报表</div>
                </div>
                <div className='page-content' style={{ padding: 0 }}>
                  <Row gutter={0}>
                    <Col span={24}>
                      <div style={{marginLeft:20, marginTop:15, fontSize:20,}}>设备概况 (截至{time})</div>
                    </Col>
                    <Col span={6}>
                      <div style={{marginTop:15,textAlign:'center'}}>
                        <Row>
                          <Col span={4}></Col>
                          <Col span={8}>
                            <div style={{color:'#868686'}}>车检器</div>
                            <div style={{marginTop:0,fontSize:30}}>{cjq.sum}</div>
                          </Col>
                          <Col span={8}>
                            <div style={{textAlign:'left'}}>
                              <span style={{color:'green'}}>在线</span> {cjq.online}
                            </div>
                            <div style={{textAlign:'left'}}>
                              <span style={{color:'red'}}>离线</span>  {cjq.offline}
                            </div>
                          </Col>
                          <Col span={4}></Col>
                        </Row>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{marginTop:15,textAlign:'center'}}>
                        <Row>
                          <Col span={4}></Col>
                          <Col span={8}>
                            <div style={{color:'#868686'}}>无线网关</div>
                            <div style={{marginTop:0,fontSize:30}}>{wap.sum}</div>
                          </Col>
                          <Col span={8}>
                            <div style={{textAlign:'left'}}>
                              <span style={{color:'green'}}>在线</span> {wap.online}
                            </div>
                            <div style={{textAlign:'left'}}>
                              <span style={{color:'red'}}>离线</span> {wap.offline}
                            </div>
                          </Col>
                          <Col span={4}></Col>
                        </Row>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{marginTop:15,textAlign:'center'}}>
                        <Row>
                          <Col span={4}></Col>
                          <Col span={8}>
                            <div style={{color:'#868686'}}>无线转发器</div>
                            <div style={{marginTop:0,fontSize:30}}>{wr.sum}</div>
                          </Col>
                          <Col span={8}>
                            <div style={{textAlign:'left'}}>
                              <span style={{color:'green'}}>在线</span> {wr.online}
                            </div>
                            <div style={{textAlign:'left'}}>
                              <span style={{color:'red'}}>离线</span> {wr.offline}
                            </div>
                          </Col>
                          <Col span={4}></Col>
                        </Row>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div style={{marginTop:15,textAlign:'center'}}>
                        <Row>
                          <Col span={4}></Col>
                          <Col span={8}>
                            <div style={{color:'#868686'}}>巡检PDA</div>
                            <div style={{marginTop:0,fontSize:30}}>{pda.sum}</div>
                          </Col>
                          <Col span={8}>
                            <div style={{textAlign:'left'}}>
                              <span style={{color:'green'}}>在线</span> {pda.online}
                            </div>
                            <div style={{textAlign:'left'}}>
                              <span style={{color:'red'}}>离线</span> {pda.offline}
                            </div>
                          </Col>
                          <Col span={4}></Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className='page-content' style={{ padding: 0 }}>
                  <Row>
                    <Col span={24}>
                      <div style={{marginLeft:20, marginTop:15, fontSize:20,}}>设备区域占比</div>
                    </Col>
                    <Col span={6}>
                      <AnnularChart dataSource={cjqqyzb} style={{width:'100%'}}/>
                      <div style={{textAlign:'center',marginTop:-100}}>车检器区域占比</div>
                    </Col>
                    <Col span={6}>
                      <AnnularChart dataSource={wapqyzb} />
                      <div style={{textAlign:'center',marginTop:-100}}>无线网关区域占比</div>
                    </Col>
                    <Col span={6}>
                      <AnnularChart dataSource={wrqyzb} />
                      <div style={{textAlign:'center',marginTop:-100}}>无线转发器区域占比</div>
                    </Col>
                    <Col span={6}>
                      <AnnularChart dataSource={pdaqyzb} />
                      <div style={{textAlign:'center',marginTop:-100}}>巡检PDA区域占比</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <div style={{marginLeft:20, marginTop:15, fontSize:20,}}>设备厂家占比</div>
                    </Col>
                    <Col span={6}>
                      <AnnularChart dataSource={cjqcjzb} />
                      <div style={{textAlign:'center',marginTop:-100}}>车检器厂家占比</div>
                    </Col>
                    <Col span={6}>
                      <AnnularChart dataSource={wapcjzb} />
                      <div style={{textAlign:'center',marginTop:-100}}>无线网关厂家占比</div>
                    </Col>
                    <Col span={6}>
                      <AnnularChart dataSource={wrcjzb} />
                      <div style={{textAlign:'center',marginTop:-100}}>无线转发器厂家占比</div>
                    </Col>
                    <Col span={6}>
                      <AnnularChart dataSource={pdacjzb} />
                      <div style={{textAlign:'center',marginTop:-100}}>巡检PDA厂家占比</div>
                    </Col>
                  </Row>
                </div>
            </div>
        );
    }
}

export default DeviceReport;
