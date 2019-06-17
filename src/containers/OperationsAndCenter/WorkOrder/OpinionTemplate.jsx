import React, {Component} from "react";
import {
<<<<<<< HEAD
    Button, Form, Select, Radio, Table, Row, Col, DatePicker, Input, Spin, Pagination, Switch, Badge,Popconfirm
=======
    Button, Form, Select, Radio, Table, Row, Col, DatePicker, Input, Spin, Pagination, Switch, Badge, Modal,Popconfirm
>>>>>>> 6bb681d553f7a53eaccd9316cc48db904d50fe0a
} from "antd";
import {HttpClientImmidIot} from "../../../common/HttpClientImmidIot";


const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
<<<<<<< HEAD
const EditableContext = React.createContext();
=======

const { Option } = Select;
const { TextArea } = Input;

const EditableContext = React.createContext();

>>>>>>> 6bb681d553f7a53eaccd9316cc48db904d50fe0a
class OpinionTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
<<<<<<< HEAD
        };
    }

=======
            ModalText: "Content of the modal",
            visible: false,
            confirmLoading: false,
        };
    }

        //
        showModal = () => {
            this.setState({
              visible: true,
            });
        };

        //
        handleOk = () => {
            this.setState({
              ModalText: "点击确定提交成功后将会自动关闭",
              confirmLoading: true,
            });
            setTimeout(() => {
              this.setState({
                visible: false,
                confirmLoading: false,
              });
            }, 1000);
         };

         //
         handleCancel = () => {
            console.log("Clicked cancel button");
            this.setState({
              visible: false,
            });
          };

          //



>>>>>>> 6bb681d553f7a53eaccd9316cc48db904d50fe0a
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
        params = this.filterOtherParams(params);
        HttpClientImmidIot.query("/OperationsAndCenter/WorkOrder/ComplainWorkOrder", "GET", params, this.handleQueryData.bind(this))
    }


    // loadData回调函数
    handleQueryData(d, type) {
        const data = d.data;
        if (type === HttpClientImmidIot.requestSuccess) {
            this.setState({
                AlarmRecord: data.list,
                total: data.total
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
        this.loadData(1, pageSize, this.state.otherParams)
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

<<<<<<< HEAD
        //添加按钮
     AddButton() {
         const pageSize = this.state.pageSize;
         this.setState({
             pageNum: 1
         });
         this.loadData(1, pageSize, this.state.otherParams)
     }

     handleDelete(){
       const pageNum = this.state.pageNum;
       const pageSize = this.state.pageSize;
       this.setState({

       });
       this.loadData(pageNum, pageSize, this.state.otherParams)
=======

     handleDelete = key => {
       const dataSource = [...this.state.AlarmRecord];
       this.setState({ AlarmRecord: dataSource.filter(item => item.key !== key) });
>>>>>>> 6bb681d553f7a53eaccd9316cc48db904d50fe0a
     };


    // deleteLine() {
    // const tab2=document.getElementById('Table');//获取枚举table对象
    // const activeObj = event.srcElement;//激活对象
    // const rowIndex = activeObj.parentElement.rowIndex;//激活行号
    // tab2.deleteRow(rowIndex);//删除当前行 }
    // }

<<<<<<< HEAD

=======
>>>>>>> 6bb681d553f7a53eaccd9316cc48db904d50fe0a
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

<<<<<<< HEAD

    render() {

    const {loading, pageNum, pageSize, AlarmRecord, total, otherParams: {warningDisposeStatus}} = this.state;
=======
    render() {

    const {
        loading, pageNum, pageSize, AlarmRecord, total, otherParams: {warningDisposeStatus}, visible, confirmLoading, ModalText
    } = this.state;
>>>>>>> 6bb681d553f7a53eaccd9316cc48db904d50fe0a

    const { Option } = Select;

    //意见分类点击事件
    function handleChange(value) {
      console.log(`selected ${value}`);
    }

        const columns = [
              {
                  title: "意见标题",
                  dataIndex: "workorderHeadline",
                  render: (value) => value || "--",
              },{
                  title: "意见分类",
                  dataIndex: "comfrom",
                  render: (value) => value || "--",
              }, {
                  title: "添加时间",
                  dataIndex: "creationTime",
                  render: (value) => value || "--",
              }, ,{
                  title: "操作",
                  dataIndex: "Operation",
<<<<<<< HEAD
                  render:(value)  =>this.state.AlarmRecord.length >= 1 ? (
                      <Popconfirm title="确定删除本行?" onConfirm={() => this.handleDelete()}>
=======
                  render:(text, record)  =>this.state.AlarmRecord.length >= 1 ? (
                      <Popconfirm title="确定删除本行?" onConfirm={() => this.handleDelete(record.key)}>
>>>>>>> 6bb681d553f7a53eaccd9316cc48db904d50fe0a
                        <a>Delete</a>
                      </Popconfirm>
                      ) : "--",
              },
          ];

        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };



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
<<<<<<< HEAD
                                    {getFieldDecorator("workorderHeadline")(
=======
                                    {getFieldDecorator("OpinionTitle")(
>>>>>>> 6bb681d553f7a53eaccd9316cc48db904d50fe0a
                                        <Input placeholder="请输入" onChange={(e) => {
                                            this.state.otherParams.workorderHeadline = e.target.value;
                                        }}/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label="意见分类" {...formItemLayout}>
<<<<<<< HEAD
                                    {getFieldDecorator("comfrom")(
=======
                                    {getFieldDecorator("OpinionClassify")(
>>>>>>> 6bb681d553f7a53eaccd9316cc48db904d50fe0a
                                        <Select defaultValue="all"  onChange={handleChange}>
                                            <Option value="all">全部</Option>
                                            <Option value="classify1">分类1</Option>
                                            <Option value="classify2">分类2</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} style={{textAlign: "right"}}>
                                <Button type="primary" onClick={this.handleQuery.bind(this)}>查询</Button>
                                <Button style={{marginLeft: "20px"}}
                                        onClick={this.handleReset.bind(this)}>重置</Button>
<<<<<<< HEAD
                                <Button style={{marginLeft: "20px"}} type="primary" onClick={this.AddButton.bind(this)}>添加</Button>
=======
                                <Button style={{marginLeft: "20px"}} type="primary" onClick={this.showModal}>添加</Button>
                                <Modal
                                    title="添加意见"
                                    visible={visible}
                                    onOk={this.handleOk}
                                    confirmLoading={confirmLoading}
                                    onCancel={this.handleCancel}
                                >
                                    <Form className="queryForm">
                                        <Row>
                                            <Col span={20} style={{marginTop:20,}}>
                                                <FormItem label="意见类型" {...formItemLayout}>
                                                    {getFieldDecorator("OpinionType")(
                                                        <Select defaultValue="select"  onChange={handleChange}>
                                                            <Option value="select">请选择</Option>
                                                            <Option value="classify1">分类1</Option>
                                                            <Option value="classify2">分类2</Option>
                                                            <Option value="AddOpinionType">添加意见类型</Option>
                                                        </Select>
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={20}>
                                                <FormItem label="意见标题" {...formItemLayout}>
                                                    {getFieldDecorator("OpinionTitle")(
                                                        <Input placeholder="" onChange={(e) => {
                                                            this.state.otherParams.workorderHeadline = e.target.value;
                                                        }}/>
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={20}>
                                                <FormItem label="意见内容" {...formItemLayout}>
                                                    {getFieldDecorator("OpinionContent")(
                                                        <TextArea rows={5}
                                                            placeholder=""
                                                        />
                                                    )}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Modal>
>>>>>>> 6bb681d553f7a53eaccd9316cc48db904d50fe0a
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
             </div>
<<<<<<< HEAD


=======
>>>>>>> 6bb681d553f7a53eaccd9316cc48db904d50fe0a
            );
    }
}

const WrapperAbnormalParkingAlarm = Form.create()(OpinionTemplate);
export default WrapperAbnormalParkingAlarm;
