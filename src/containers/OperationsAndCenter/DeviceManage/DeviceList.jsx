import React, {PureComponent} from 'react';
import {
    Button, Form, Select, Radio, Table, Row, Col, DatePicker, Input, Spin, Pagination, Badge,Modal
} from 'antd';
import {HttpClient} from '../../../common/HttpClient.jsx';
import _ from 'lodash';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const url = 'https://iotdev.triplego.cn/admin/device/basic';
const url1 = 'admin/device/basic';
const new_url = url1.replace('/','.').replace('/','.').replace('/','.').replace('/','.').replace('/','.').replace('/','.').replace('/','.');


function setTime(e, separator = '-'){
    if(e != undefined){
      const changeTime = e.toString();
      const year = changeTime.substr(0, 4);
      const month = changeTime.substr(4, 2);
      const day = changeTime.substr(6, 2);
      const hour = changeTime.substr(8, 2);
      const minut = changeTime.substr(10, 2);
      const second = changeTime.substr(12, 2);
      return year + separator + month + separator + day + ' ' + hour + ':' + minut + ':' + second;
    }else{
        return e;
    }
}
class DeviceList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, //表格加载状态
            visible:false,//新增对话框是否显示
            AlarmRecord: [
            ], //表格数据
            pageNum: 1, //当前页
            pageSize: 10, //一页多少数据
            total: 1, //数据总条数
            otherParams: {
                warningDisposeStatus: -1, //处理状态按钮组当前值
                startTime: null, //开始时间
                endTime: null,//结束时间
                warningType: null,//报警类型
                parkingSpaceNo: null,//泊位编号
                _id:this.props.location.query.id||'',
            },
            addParams:{
              deployment_address: '[请选择]',
              geo_longlat: ['请选择','请选择'],
            },
            amapVisible:false,//地图控件show开关
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
      if(this.props.location.query.id){
        this.loadData(1, this.state.pageSize,{_id:this.props.location.query.id});

      }else{
        this.loadData(1, this.state.pageSize);

      }
    }

    // 组件卸载之前
    componentWillUnmount() {

    }
    // 筛选参数
    filterOtherParams(otherParams) {
        let params = {};
        for (let item in otherParams) {
            if (otherParams[item] || item === 'warningDisposeStatus') {
                params[item] = otherParams[item]
            }
        }
        return params
    }

    //加载数据
    loadData(pageNum = 1, pageSize = 10,str) {

      const { form: { validateFields } } = this.props;
      validateFields(['type', 'sub_type','vendor','activated','mobile','hardware_id'], (errors, fieldsValue) => {
        if (errors) return;
        const values = {
          type: fieldsValue['type']||'',
          sub_type: fieldsValue['sub_type']||'',
          vendor: fieldsValue['vendor']||'',
          activated: fieldsValue['activated']||'',
          device_status: fieldsValue['mobile']||'',
          hardware_id: fieldsValue['hardware_id']||'',
        };
        this.setState({
          loading: true
        });
        let params = {
          page: pageNum-1,
          page_size: pageSize,
          "service": new_url,
          "version": "2.0",
          "timestamp": Date.parse(new Date()),
          ...values
        };
        if(str){
          params = {
            ...str
          };
          params = this.filterOtherParams(params);
          HttpClient.query(url, "GET", params, this.handleQueryData1.bind(this));
          //fetch(params).then(data => this.handleQueryData1(data));
        }else{
          params = this.filterOtherParams(params);
          HttpClient.query(url, "GET", params, this.handleQueryData1.bind(this));
        }
      });
    }
    // loadData回调函数
    handleQueryData1(d) {
        const data = d.data;
        if (d.ack_code == 'ok') {
          if(this.props.location.query.id&&data.length==1){
              this.props.form.setFieldsValue({
                hardware_id:data[0].hardware_id,
              });
          }
            this.setState({
                AlarmRecord: data,
                total: d.count
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
            visible:false,
        });
    }
    // loadData回调函数
    handleQueryData(d) {
        const data = d.data;
        if (d.ack_code == 'ok') {
            this.setState({
                AlarmRecord: data,
                total: d.count
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
            visible:false,
        });
    }

    //查询按钮
    handleQuery() {
      this.setState({
        pageNum: 1
      });
      this.loadData(1,this.state.pageSize);
    }

    //重置
    handleReset() {
      this.props.form.resetFields();
      this.handleQuery();
    }

    // 分页变化
    onPageChange(pageNum) {
        this.setState({
            pageNum: pageNum,
        }, () => {
            this.loadData(pageNum, this.state.pageSize)
        });
    }

    // 分页大小变化
    onShowSizeChange(pageNum, pageSize) {
        this.setState({
            pageNum,
            pageSize
        }, () => {
            this.loadData(pageNum, pageSize)
        });
    }

      // handleOk = e => {
      //   const { form: { validateFields } } = this.props;
      //   validateFields(['type1', 'sub_type1',
      //                   'model1','vendor1',
      //                   'hardware_id1','mac',
      //                   'sim_id','batch_no',
      //                   'hardware_version',
      //                   'software_version',
      //                   'firmware_version',
      //                   'ip','geo_longlat',
      //                   'deployment_address'], (errors, fieldsValue) => {
      //     if (errors) return;
      //     const values = {
      //       type: fieldsValue['type1']||'',
      //       sub_type: fieldsValue['sub_type1']||'',
      //       model: fieldsValue['model1']||'',
      //       vendor: fieldsValue['vendor1']||'',
      //       mac: fieldsValue['mac']||'',
      //       hardware_id: fieldsValue['hardware_id1']||'',
      //       sim_id: fieldsValue['sim_id']||'',
      //       batch_no: fieldsValue['batch_no']||'',
      //       hardware_version: fieldsValue['hardware_version']||'',
      //       software_version: fieldsValue['software_version']||'',
      //       firmware_version: fieldsValue['firmware_version']||'',
      //       ip: fieldsValue['ip']||'',
      //       geo_longlat: this.state.geo_longlat?[this.state.geo_longlat.split('_')[0],this.state.geo_longlat.split('_')[1]]:'',
      //       deployment_address: fieldsValue['deployment_address']||'',
      //     };
      //     this.setState({
      //       pageNum: 1
      //     });
      //     this.props.form.setFieldsValue({
      //       type1:'',
      //       sub_type1:'',
      //       model1:'',
      //       vendor1:'',
      //       mac:'',
      //       sim_id:'',
      //       hardware_id1:'',
      //       batch_no:'',
      //       hardware_version:'',
      //       software_version:'',
      //       firmware_version:'',
      //       ip:'',
      //       geo_longlat:'',
      //       deployment_address:'',
      //     });
      //     //addFetch(values).then(data => this.loadData(this.state.pageNum, this.state.pageSize));
      //   });
      // };

      // handleCancel = e => {
      //   this.props.form.setFieldsValue({
      //     type1:'',
      //     sub_type1:'',
      //     model1:'',
      //     vendor1:'',
      //     mac:'',
      //     sim_id:'',
      //     hardware_id1:'',
      //     batch_no:'',
      //     hardware_version:'',
      //     software_version:'',
      //     firmware_version:'',
      //     ip:'',
      //     geo_longlat:'',
      //     deployment_address:'',
      //   });
      //   this.setState({
      //     visible: false,
      //   });
      // };

      // mapOk () {
      //     const form = this.detailAddress.props.form;
      //     form.validateFields((err, values) => {
      //         if (err) {
      //             return;
      //         }
      //         if (values.location) {
      //             this.setState({
      //               amapVisible: false,
      //               geo_longlat:values.location.lng+'_'+values.location.lat,
      //             });
      //             this.props.form.setFieldsValue({
      //               deployment_address:values.address,
      //               geo_longlat:'x:'+values.location.lng+'  ,  y:'+values.location.lat,
      //             });
      //         } else {
      //             message.warning('请在地图上选择考勤点坐标')
      //         }
      //     });
      // }

      // mapCancel () {
      //     this.setState({
      //         amapVisible: false,
      //     });
      // }
      // mapShow() {
      //     this.setState({
      //         amapVisible: true,
      //     });
      // }



    render() {
        const {amapVisible,visible,loading, pageNum, pageSize, AlarmRecord, total, otherParams: {warningDisposeStatus}} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        const getInfo = payload => {
          this.props.history.push('/facility/DeviceList/PatrolManage1Details?id='+payload.id+'&&hardware_id='+payload.hardware_id);
        };
        const columns = [{
          title: '序号',
          dataIndex: 'number',
          key: 'number',
          fixed: 'left',
          width: 80,
          render: (text, record) => (
            <span>
              {record.number+pageSize*(pageNum-1)}
            </span>
          ),
        },
            {
                title: '硬件ID',
                dataIndex: 'hardware_id',
                fixed: 'left',
                width: 100,
                //dataIndex: 'memberId',
                render: (value) => value || '--',
            },{
                title: '设备状态	',
                dataIndex: 'device_status	',
                render: (text, record) => {
                  if(record.device_status=='ONLINE'){
                    return(<span>
                      <Badge status="success" />在线
                    </span>)
                  }else if(record.device_status=='OFFLINE'){
                     return(<span>
                    <Badge status="default" />离线
                  </span>)
                  }else if(record.device_status=='MALFUNC'){
                     return(<span>
                    <Badge status="error" />故障
                  </span>)
                  }else if(record.device_status=='UNKNOWN'){
                     return(<span>
                    <Badge status="default" />未知
                  </span>)
                  }else{
                    return(<span>
                    {record.device_status}
                  </span>)
                  }
                },
            },  {
                title: '设备厂商',
                dataIndex: 'vendor',
                render: (value) => value || '--',
            },{
                title: '激活状态',
                dataIndex: 'activated',
                render: (value) => value? '已激活' : '未激活'
            },{
                title: '设备类型',
                dataIndex: 'type',
                render: (text, record) => {
                  if(record.type=='PSD'){
                    return(<span>
                      车检器
                    </span>)
                  }else if(record.type=='RP'){
                     return(<span>
                    中继器
                  </span>)
                  }else if(record.type=='HUB'){
                     return(<span>
                    集中器
                  </span>)
                  }else if(record.type=='PSL'){
                     return(<span>
                    车位锁
                  </span>)
                  }else{
                    return(<span>
                    {record.type}
                  </span>)
                  }
                },
            }, {
                title: '子类型',
                dataIndex: 'sub_type',
                render: (text, record) => {
                  if(record.sub_type=='GMG'){
                    return(<span>
                      地磁
                    </span>)
                  }else if(record.sub_type=='NBGMG'){
                     return(<span>
                    NB-地磁
                  </span>)
                  }else if(record.sub_type=='UWB'){
                     return(<span>
                    超宽带射频定位
                  </span>)
                  }else if(record.sub_type=='CAM'){
                     return(<span>
                    视频
                  </span>)
                  }else if(record.sub_type=='HCAM'){
                     return(<span>
                    高位视频
                  </span>)
                  }else if(record.sub_type=='UWBCAM'){
                     return(<span>
                    超宽带定位+视频
                  </span>)
                  }else if(record.sub_type=='USON'){
                     return(<span>
                    超声波
                  </span>)
                  }else{
                    return(<span>
                    {record.sub_type}
                  </span>)
                  }
                },
            }, {
                title: '设备型号',
                dataIndex: 'model',
                render: (value) => value || '--',
            },{
                title: '注册时间',
                dataIndex: 'time_created',
                render: (text, record) => (
                  <span>
                    {setTime(record.time_created)}
                  </span>
                ),
            }, {
                title: '批次编号',
                dataIndex: 'batch_no',
                render: (value) => value || '--',
            },{
                title: '硬件版本',
                dataIndex: 'hardware_version	',
                render: (value) => value || '--',
            },{
                title: '固件版本',
                dataIndex: 'firmware_version',
                render: (value) => value || '--',
            },{
                title: '软件版本',
                dataIndex: 'software_version',
                render: (value) => value || '--',
            },
        ];
        return (
            <div className='page'>
                <div className='page-header'>
                    设备列表
                </div>
                <div className='page-content'>
                    {/*查询表单*/}
                    <Form className='queryForm'>
                        <Row gutter={46}>
                            <Col span={8}>
                                <FormItem label='设备类型' {...formItemLayout}>
                                    {getFieldDecorator('type')(
                                      <Select style={{ width: '100%' }}
                                          allowClear = {true}>
                                        <Option value="PSD">车检器</Option>
                                        <Option value="RP">中继器</Option>
                                        <Option value="HUB">集中器</Option>
                                        <Option value="PSL">车位锁</Option>
                                      </Select>
                                    )}
                                </FormItem>
                            </Col><Col span={8}>
                                <FormItem label='设备子类型' {...formItemLayout}>
                                    {getFieldDecorator('sub_type')(
                                      <Select style={{ width: '100%' }}
                                          allowClear = {true}>
                                        <Option value="GMG">地磁</Option>
                                        <Option value="NBGMG">NB-地磁</Option>
                                        <Option value="UWB">超宽带射频定位</Option>
                                        <Option value="CAM">视频</Option>
                                        <Option value="HCAM">高位视频</Option>
                                        <Option value="UWBCAM">超宽带定位+视频</Option>
                                        <Option value="USON">超声波</Option>
                                      </Select>
                                    )}
                                </FormItem>
                            </Col><Col span={8}>
                                <FormItem label='设备厂商' {...formItemLayout}>
                                    {getFieldDecorator('vendor')(
                                        <Input placeholder='请输入'/>
                                    )}
                                </FormItem>
                            </Col><Col span={8}>
                                <FormItem label='设备状态' {...formItemLayout}>
                                    {getFieldDecorator('mobile')(
                                      <Select style={{ width: '100%' }}
                                          allowClear = {true}>
                                        <Option value="ONLINE">在线</Option>
                                        <Option value="OFFLINE">离线</Option>
                                        <Option value="MALFUNC">故障</Option>
                                        <Option value="UNKNOWN">未知</Option>
                                      </Select>
                                    )}
                                </FormItem>
                            </Col><Col span={8}>
                                <FormItem label='硬件ID' {...formItemLayout}>
                                    {getFieldDecorator('hardware_id')(
                                        <Input placeholder='请输入'/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={46}>
                            <Col style={{textAlign: 'right'}}>
                                <Button type='primary' onClick={this.handleQuery.bind(this)}>查询</Button>
                                <Button style={{marginLeft: '20px'}}
                                        onClick={this.handleReset.bind(this)}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                    {/*表格*/}
                    <Spin tip="加载中.." spinning={loading}>
                        <Table
                            style={{marginTop: '20px'}}
                            rowKey={data => data.id}
                            columns={columns}
                            dataSource={AlarmRecord}
                            pagination={false}
                            align={'center'}
                            scroll={{ x: '120%' }}
                        />
                        {/*分页*/}
                        {AlarmRecord.length > 0 ? (
                            <div>
                                <div className="table_pagination_total">共{total}条</div>
                                <Pagination
                                    className="table_pagination"
                                    showSizeChanger
                                    showQuickJumper
                                    total={total}
                                    current={pageNum}
                                    pageSize={pageSize}
                                    onChange={this.onPageChange.bind(this)}
                                    onShowSizeChange={this.onShowSizeChange.bind(this)}
                                />
                                <div style={{clear: 'both'}}></div>
                            </div>
                        ) : ''}
                    </Spin>
                </div>
            </div>
        );
    }
}

const WrapperAbnormalParkingAlarm = Form.create()(DeviceList);
export default WrapperAbnormalParkingAlarm;
