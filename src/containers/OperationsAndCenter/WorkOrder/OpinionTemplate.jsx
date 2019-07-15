import React, {Component} from "react";
import {
    Button, Form, Select, Radio, Table, Row, Col, DatePicker, Input, Spin, Pagination, Switch, Badge, Modal,Popconfirm,Divider,message
} from "antd";
import {HttpClient} from "../../../common/HttpClient";


const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

const { Option } = Select;
const { TextArea } = Input;

const EditableContext = React.createContext();

class OpinionTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bianjichuzhi:{
                changeOpinionClassify_1:'',
                changeOpinionTitle_1:'',
                changeOpinionContent_1:''
            },
            opinionclassify:[],
            loading: false, //表格加载状态
            AlarmRecord: [
            ], //表格数据
            pageNum: 1, //当前页
            pageSize: 10, //一页多少数据
            total: 1, //数据总条数
            otherParams: {
                warningDisposeStatus: -1, //处理状态按钮组当前值
                warningType: null,//报警类型
                parkingSpaceNo: null,//泊位编号
            },

            visible: false,
            visible1: false,
            visible2: false,
            visible3: false,
            confirmLoading: false,
        };
    }

        //添加
        showModal = () => {
            this.setState({
              visible: true,
            });
        };

        //添加
         handleOk = () => {
             let params = {};
             this.props.form.validateFields(['addOpinionClassify','addOpinionContent','addOpinionTitle'], (err, values) => {
                 if (err) return;
                 params.type = values.addOpinionClassify
                 params.content = values.addOpinionContent
                 params.caption = values.addOpinionTitle
                 // console.log(params)
                 this.setState({visible:false});
                 HttpClient.query(`/parking-info/dictionary/opinion/new`, 'POST', params, (d, type) => {
                     if (type === HttpClient.requestSuccess) {
                         message.success('提交成功')
                         this.loadData();
                         this.props.form.resetFields();
                         this.setState({
                             visible: false,
                             confirmLoading: false,
                         })
                         this.props.form.setFieldsValue({
                                 addOpinionClassify:'',
                                 addOpinionTitle:'',
                                 addOpinionContent:'',
                               });
                     } else {
                         //失败----做除了报错之外的操作
                     }
                 })
             })
         }


          //添加意见分类
          showModal1 = () => {
              this.setState({
                visible1: true,
              });
          };

          //添加意见分类
          handleOk1 = e => {
              this.props.form.validateFields(['addOpinionClassify1'], (err, values) => {
                  if (err) return;
                  let value1 ='';
                  value1 = values.addOpinionClassify1;
                  let list = this.state.opinionclassify;
                  list.push({value:value1});
                  this.setState({
                      opinionclassify:list,
                      visible1:false,
                  });
                  this.props.form.setFieldsValue({
                      addOpinionClassify:value1,
                  });
              });
          };


        //编辑
        showModal2 = (key) => {
            let params = {};
            for (let i = 0; i < this.state.AlarmRecord.length; i++) {
                if (this.state.AlarmRecord[i].id == key) {
                    params = this.state.AlarmRecord[i];
                }
            }
             this.setState({
                 visible2: true,
                 bianjichuzhi:{
                     changeOpinionClassify_1:params.type,
                     changeOpinionTitle_1:params.caption,
                     changeOpinionContent_1:params.content,
                 },
             });
        };

        //编辑
        handleOk2 = e => {
            let params = {};
            this.props.form.validateFields(['changeOpinionClassify','changeOpinionTitle','changeOpinionContent'], (err, values) => {
                if (err) return;
                params.type = values.changeOpinionClassify
                params.content = values.changeOpinionContent
                params.caption = values.changeOpinionTitle
                // console.log(params)
                this.setState({visible2:false});
                HttpClient.query(`/parking-info/dictionary/opinion/new`, 'POST', params, (d, type) => {
                    if (type === HttpClient.requestSuccess) {
                        message.success('提交成功')
                        this.loadData();
                        this.props.form.resetFields();
                        this.setState({
                            visible: false,
                            confirmLoading: false,
                        })
                        this.props.form.setFieldsValue({
                                changeOpinionClassify:'',
                                changeOpinionTitle:'',
                                changeOpinionContent:'',
                              });
                    } else {
                        //失败----做除了报错之外的操作
                    }
                })
            })
        };

        //编辑意见分类
        showModal3 = () => {
            this.setState({
              visible3: true,
            });
        };

        //编辑意见分类
        handleOk3 = e => {
            this.props.form.validateFields(['changeOpinionClassify1'], (err, values) => {
                if (err) return;
                let value1 ='';
                value1 = values.changeOpinionClassify1;
                let list = this.state.opinionclassify;
                list.push({value:value1});
                this.setState({
                    opinionclassify:list,
                    visible3:false,
                });
                this.props.form.setFieldsValue({
                    changeOpinionClassify:value1,
                });
            });
        };

    // 分页变化
    onPageChange(pageNum) {
        this.setState({
            pageNum: pageNum,
        }, () => {
            this.loadData(pageNum, this.state.pageSize, this.state.otherParams)
        });
    }

    // 分页大小变化
    onShowSizeChange(pageNum, pageSize) {
        this.setState({
            pageNum,
            pageSize
        }, () => {
            this.loadData(pageNum, pageSize, this.state.otherParams)
        });
    }

    // 筛选参数
    filterOtherParams(otherParams) {
        let params = {};
        for (let item in otherParams) {
            if (otherParams[item] || item === "warningDisposeStatus") {
                params[item] = otherParams[item]
            }
        }
        return params
    }

    //加载数据
    loadData(pageNum = 1, pageSize = 10, otherParams) {
        this.setState({
            loading: true
        });
        let params = {
            pageNum: pageNum,
            pageSize: pageSize,
            ...otherParams
        };
        this.props.form.setFieldsValue({
                addOpinionClassify:'',
                addOpinionTitle:'',
                addOpinionContent:'',
              });
        params = this.filterOtherParams(params);
        HttpClient.query("/parking-info/dictionary/opinion/list", "GET", params, this.handleQueryData.bind(this))
    }


    // loadData回调函数
    handleQueryData(d, type) {
        const data = d.data;
        let list = [];
        for (let i = 0; i < data.list.length; i++) {
            list.push({value:data.list[i].type})
        }
        if (type === HttpClient.requestSuccess) {
            this.setState({
                AlarmRecord: data.list,
                total: data.total,
                opinionclassify:list,
            })
        } else {
            //失败----做除了报错之外的操作
        }
        this.setState({
            loading: false,
        })
    }

       //查询按钮
    handleQuery() {
        const pageSize = this.state.pageSize;
        this.setState({
            pageNum: 1
        });
        let params = {};
        params.id = this.state.AlarmRecord.id;
        this.props.form.validateFields(['OpinionTitle','OpinionClassify'], (err, values) => {
            if (err) return;
            params.caption = values.OpinionTitle
            params.type = values.OpinionClassify
        })
        this.loadData(1, pageSize, params)
    }

    //重置
    handleReset() {
        this.props.form.resetFields();
        this.setState({
            pageNum: 1, //当前页
            pageSize: 10, //一页多少数据
            otherParams: {
                warningDisposeStatus: -1, //处理状态按钮组当前值
                startTime: null,
                endTime: null,
                warningType: null,
                parkingSpaceNo: null,
            }
        }, () => {
            this.loadData()
        });
    }


     handleDelete(key){
       let params = {id:key};
       console.log(params);
       HttpClient.query("/parking-info/dictionary/delete/id"+'?id='+key, "POST", params, this.loadData.bind(this));
       // this.setState({ AlarmRecord: dataSource.filter(item => item.id !== key) });
     };


    // deleteLine() {
    // const tab2=document.getElementById('Table');//获取枚举table对象
    // const activeObj = event.srcElement;//激活对象
    // const rowIndex = activeObj.parentElement.rowIndex;//激活行号
    // tab2.deleteRow(rowIndex);//删除当前行 }
    // }

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

    const {
        loading, pageNum, pageSize, AlarmRecord, total, otherParams: {warningDisposeStatus},
        visible,visible1, visible2,visible3,confirmLoading,opinionclassify,bianjichuzhi
    } = this.state;
    const {getFieldDecorator} = this.props.form;



    //意见分类点击事件


        const columns = [
              {
                  title: "意见标题",
                  dataIndex: "caption",
                  render: (value) => value || "--",
              },{
                  title: "意见分类",
                  dataIndex: "type",
                  render: (value) => value || "--",
              }, {
                  title: "添加时间",
                  dataIndex: "updateTime",
                  render: (value) => value || "--",
              }, ,{
                  title: "操作",
                  dataIndex: "Operation",
                  render:(text, record)  =>this.state.AlarmRecord.length >= 1 ? (
                      <span>
                          <a onClick={() => this.showModal2(record.id)}>编辑</a>
                          <Divider type="vertical" />
                          <Popconfirm title="是否删除本条意见?" onConfirm={() => this.handleDelete(record.id)}>
                                <a>删除</a>
                          </Popconfirm>
                      </span>
                      ) : "--",
              },
          ];


        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };

        const selectOption = opinionclassify.map((str) =>
            <Option value = {str.value} >{str.value}</Option>
        );

        return (
             <div className="page">
                <div className="page-header">
                    意见模板
                </div>
                <div className="page-content">
                    <Form className="queryForm">
                        <Row gutter={48}>
                            <Col span={8}>
                                <FormItem label="意见标题" {...formItemLayout}>
                                    {getFieldDecorator("OpinionTitle")(
                                        <Input placeholder="请输入" allowClear='true'/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="意见分类" {...formItemLayout}>
                                    {getFieldDecorator("OpinionClassify")(
                                        <Select placeholder='请选择' allowClear='true'>
                                            {selectOption}
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} style={{textAlign: "right"}}>
                                <Button type="primary" onClick={this.handleQuery.bind(this)}>查询</Button>
                                <Button style={{marginLeft: "20px"}}
                                        onClick={this.handleReset.bind(this)}>重置</Button>
                                <Button style={{marginLeft: "20px"}} type="primary" onClick={this.showModal}>添加</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Spin tip="加载中.." spinning={loading}>

                        <Table
                            style={{marginTop: "20px"}}
                            rowKey={data => data.id}
                            columns={columns}
                            dataSource={AlarmRecord}
                            pagination={false}
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
                                <div style={{clear: "both"}}></div>
                            </div>
                        ) : ""}
                    </Spin>
                </div>
                <Modal
                    title="添加意见"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={()=>{this.setState({visible:false});
                            this.props.form.setFieldsValue({
                                    addOpinionClassify:'',
                                    addOpinionTitle:'',
                                    addOpinionContent:'',
                                  });}}>
                    <Form className="queryForm">
                        <Row>
                            <Col span={20} style={{marginTop:20,}}>
                                <FormItem label="意见类型" {...formItemLayout}>
                                    {getFieldDecorator("addOpinionClassify",{
                                          rules:[{required:true,message:'意见类型不能为空'}]
                                        })(
                                        <Select placeholder='请选择' allowClear='true'>
                                            {selectOption}
                                            <Option value='添加意见类型'  onClick={this.showModal1}>添加意见类型</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={20}>
                                <FormItem label="意见标题" {...formItemLayout}>
                                    {getFieldDecorator("addOpinionTitle",{
                                          rules:[{required:true,message:'意见标题不能为空'}]
                                        })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={20}>
                                <FormItem label="意见内容" {...formItemLayout}>
                                    {getFieldDecorator("addOpinionContent",{
                                          rules:[{required:true,message:'意见内容不能为空'}]
                                        })(
                                        <TextArea rows={5}
                                            placeholder=""
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal
                    visible={visible1}
                    onOk={this.handleOk1}
                    onCancel={()=>{this.setState({visible1:false});}}
                >
                <Form className="queryForm">
                    <Row>
                        <Col span={20} style={{marginTop:20,}}>
                            <FormItem label="意见类型" {...formItemLayout}>
                                {getFieldDecorator("addOpinionClassify1",{
                                      rules:[{required:true,message:'不能为空'},{max:20,message:'输入长度不能超过20！'}]
                                    })(
                                    <Input placeholder="请输入" allowClear='true'/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                </Modal>
                <Modal
                    title="编辑意见"
                    visible={visible2}
                    onOk={this.handleOk2}
                    confirmLoading={confirmLoading}
                    onCancel={()=>{this.setState({visible2:false});
                            this.props.form.setFieldsValue({
                                    addOpinionClassify:'',
                                    addOpinionTitle:'',
                                    addOpinionContent:'',
                                  });}}>
                    <Form className="queryForm">
                        <Row>
                            <Col span={20} style={{marginTop:20,}}>
                                <FormItem label="意见类型" {...formItemLayout}>
                                    {getFieldDecorator("changeOpinionClassify",{
                                          rules:[{required:true,message:'意见类型不能为空'}],
                                          initialValue:bianjichuzhi.changeOpinionClassify_1,
                                        })(
                                        <Select placeholder='请选择' allowClear='true'>
                                            {selectOption}
                                            <Option value='添加意见类型'  onClick={this.showModal3}>添加意见类型</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={20}>
                                <FormItem label="意见标题" {...formItemLayout}>
                                    {getFieldDecorator("changeOpinionTitle",{
                                          rules:[{required:true,message:'意见标题不能为空'}],
                                          initialValue:bianjichuzhi.changeOpinionTitle_1,
                                        })(
                                        <Input placeholder="请输入" allowClear='true' />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={20}>
                                <FormItem label="意见内容" {...formItemLayout}>
                                    {getFieldDecorator("changeOpinionContent",{
                                          rules:[{required:true,message:'意见内容不能为空'}],
                                          initialValue:bianjichuzhi.changeOpinionContent_1,
                                        })(
                                        <TextArea rows={5}
                                            placeholder=""
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal
                    visible={visible3}
                    onOk={this.handleOk3}
                    onCancel={()=>{this.setState({visible3:false});}}
                >
                <Form className="queryForm">
                    <Row>
                        <Col span={20} style={{marginTop:20,}}>
                            <FormItem label="意见类型" {...formItemLayout}>
                                {getFieldDecorator("changeOpinionClassify1",{
                                      rules:[{required:true,message:'不能为空'},{max:20,message:'输入长度不能超过20！'}]
                                    })(
                                    <Input placeholder="请输入" allowClear='true'/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                </Modal>
             </div>
            );
    }
}

const WrapperAbnormalParkingAlarm = Form.create()(OpinionTemplate);
export default WrapperAbnormalParkingAlarm;
