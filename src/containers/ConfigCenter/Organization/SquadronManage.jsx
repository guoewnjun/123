import React, {Component} from 'react';
import {Empty, Row, Col, Input, Form, Spin, Button, Table, Modal, } from "antd";
import {HttpClientImmidIot} from "@/common/HttpClientImmidIot";



const FormItem = Form.Item

class SquadronManage extends Component {
    constructor(props){
        super(props);
        this.state = {
            // loadding:false,
            visible: false,
        };
    }

    //加载
    loadData(){
        this.setState({
            // loadding:true
        })
        HttpClientImmidIot.query("/DataCenter/DeviceReport/Index", "GET", null, this.callbackData.bind(this))
    }

    //回调
    callbackData(d,type){
        const data = d.data;
        this.setState({
            // loading: false,
        })
        if(type === HttpClientImmidIot.requestSuccess){
            this.setState({

            })
        }else{
            console.error();
        }
    }

    //查询
    Inquiry(){
        this.loadData(this.props.form);
    }

    //重置
    Reset(){
        this.loadData();
    }

    //添加
    Add(){
        this.setState({
            visible: true,
        });
    }

    //点击确定
    handleOk () {
        this.setState({
            visible: false,
        });
    };

    //点击取消
    handleCancel(){
        this.setState({
            visible: false,
        });
    };

    componentWillMount() {

    }

    componentDidMount() {
        this.loadData();
    }

    componentWillUnmount() {

    }

    render() {
        const {
            loading,visible
        } = this.state;

        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 18},
        };
        const columns =[
            {
                title: '中队名称',
                dataIndex: 'StaffelName',
                key: 'StaffelName',
                rander: (value) => (value) || '--',
            },{
                title: '管辖路段',
                dataIndex: 'RestrainRoad',
                key: 'RestrainRoad',
                rander: (value) => (value) || '--',
            },{
                title: '描述',
                dataIndex: 'Describe',
                key: 'Describe',
                rander: (value) => (value) || '--',
            },{
                title: '操作',
                dataIndex: '',
                key: 'x',
                render: () => <span>
                                <a href="javascript:;">编辑</a>
                                <a href="javascript:;" style={{marginLeft:15}}>删除</a>
                              </span>,
            },
        ];
        const table=[
            {
                StaffelName: '西丽中队',
                RestrainRoad: '西丽南路,留仙路,同乐路,科学路,白云路,科技路,南山路',
                Describe: '',
            },
        ];
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>中队管理</div>
                </div>
                <div className='page-content' style={{ padding: 0 }}>
                    <Form>
                        <Row gutter={0}>
                            <Col span={6} style={{marginTop:20, marginLeft:20}}>
                                <Form.Item label='中队名称' {...formItemLayout}>
                                    {getFieldDecorator('StaffelName')(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={17} style={{marginTop:17, textAlign:'right'}}>
                                <Button type="primary" onClick={(e)=>this.Inquiry()}>查询</Button>
                                <Button style={{marginLeft:20}} onClick={(e)=>this.Reset()}>重置</Button>
                                <Button type="primary" style={{marginLeft:20}} onClick={(e)=>this.Add()}>添加</Button>
                                <Modal
                                    title="添加中队"
                                    visible={visible}
                                    onOk={this.handleOk}
                                    onCancel={this.handleCancel}
                                >
                                    <Row gutter={0}>
                                        <Col span={24} style={{marginTop:17}}>
                                            <Form.Item label='中队名称' {...formItemLayout}>
                                                {getFieldDecorator('StaffelName')(
                                                    <Input />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Modal>
                            </Col>
                        </Row>
                    </Form>
                        <Row gutter={0}>
                            <Col span={24}>
                            <Table
                                pagination={false}
                                style={{marginTop: "20px"}}
                                columns={columns}
                                dataSource={table}
                            />
                            </Col>
                        </Row>
                    /**<Spin tip='loading...' spinning={loading}>
                    </Spin>**/
                </div>
            </div>
        );
    }
}

export default Form.create()(SquadronManage);
