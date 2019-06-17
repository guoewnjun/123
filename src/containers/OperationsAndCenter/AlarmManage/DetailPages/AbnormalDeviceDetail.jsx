import React, {Component, Fragment} from 'react';
import {Card, Col, Row, Button, Modal, Form, Input, Select} from "antd";

class AbnormalDeviceDetail extends Component {

    state = {
        modalVisible: false,
        confirmLoading: false,
        dealWay: 0,
    };

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    onSubmit() {
        this.setState({
            modalVisible: false
        })
    }

    onCancel() {
        this.setState({
            modalVisible: false
        })
    }

    render() {
        const { modalVisible, confirmLoading, dealWay } = this.state;
        const FormItem = Form.Item;
        const Option = Select.Option;
        const TextArea = Input.TextArea;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        return (
            <div className='page'>
                <div className='page-header'>
                    设备告警详情
                    <Button type='primary' onClick={() => window.history.back()} style={{ float: 'right' }}>返回</Button>
                </div>
                <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                    <Card title='设备信息' className='detail-card'>
                        <Row gutter={30}>
                            <Col span={8} className='detail-card-col'>
                                <label>报警泊位编号：</label>
                                <span></span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>报警泊位编号：</label>
                                <span></span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>报警泊位编号：</label>
                                <span></span>
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col span={8} className='detail-card-col'>
                                <label>报警泊位编号：</label>
                                <span></span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>报警泊位编号：</label>
                                <span></span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>报警泊位编号：</label>
                                <span></span>
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col span={8} className='detail-card-col'>
                                <label>报警泊位编号：</label>
                                <span></span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>报警泊位编号：</label>
                                <span></span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>报警泊位编号：</label>
                                <span></span>
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col span={8} className='detail-card-col'>
                                <label>报警泊位编号：</label>
                                <span></span>
                            </Col>
                        </Row>
                    </Card>
                    <Card title='告警信息' className='detail-card'
                          extra={<Button type='primary' onClick={() => {
                              this.setState({
                                  modalVisible: true
                              })
                          }}>处理</Button>}>
                        <Row gutter={30}>
                            <Col span={8} className='detail-card-col'>
                                <label>告警事件：</label>
                                <span></span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>告警等级：</label>
                                <span></span>
                            </Col>
                            <Col span={8} className='detail-card-col'>
                                <label>告警时间：</label>
                                <span></span>
                            </Col>
                        </Row>
                        <Row gutter={30}>
                            <Col span={8} className='detail-card-col'>
                                <label>告警状态：</label>
                                <span></span>
                            </Col>
                        </Row>
                    </Card>
                    <Modal
                        visible={modalVisible}
                        title='设备告警处理'
                        destroyOnClose
                        maskClosable={false}
                        onOk={this.onSubmit.bind(this)}
                        onCancel={this.onCancel.bind(this)}
                        bodyStyle={{ margin: 20 }}
                        confirmLoading={confirmLoading}
                    >
                        <Form>
                            <FormItem label='设备类型' {...formItemLayout}>
                                车检器
                            </FormItem>
                            <FormItem label='告警等级' {...formItemLayout}>
                                车检器
                            </FormItem>
                            <FormItem label='告警描述' {...formItemLayout}>
                                车检器
                            </FormItem>
                            <FormItem label='处理方式' {...formItemLayout}>
                                {getFieldDecorator('dealWay', {
                                    initialValue: 0
                                })(
                                    <Select onChange={(value) => {
                                        this.setState({ dealWay: value })
                                    }}>
                                        <Option value={0}>无需处理</Option>
                                        <Option value={1}>生成工单</Option>
                                    </Select>
                                )}
                            </FormItem>
                            {
                                dealWay === 0 ? (
                                    <FormItem label='处理说明' {...formItemLayout}>
                                        {getFieldDecorator('dealExplain')(
                                            <TextArea row={4} placeholder='请填写处理说明, 字数不超过200字'/>
                                        )}
                                    </FormItem>
                                ) : (
                                    <Fragment>
                                        <FormItem label='工单标题' {...formItemLayout}>
                                            {getFieldDecorator('workOrderTitle', {
                                                rules: [{ required: true, message: '请填写工单标题' }],
                                            })(
                                                <Input suffix='0/20' placeholder='请填写'/>
                                            )}
                                        </FormItem>
                                        <FormItem label='优先级' {...formItemLayout}>
                                            {getFieldDecorator('priority', {
                                                rules: [{ required: true, message: '请选择优先级' }],
                                            })(
                                                <Select placeholder='请选择'>
                                                    <Option value={0}>一般</Option>
                                                    <Option value={1}>紧急</Option>
                                                    <Option value={2}>立即处理</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                        <FormItem label='指派' {...formItemLayout}>
                                            {getFieldDecorator('assign')(
                                                <Select placeholder='请选择'>
                                                    <Option value={0}>xx小组</Option>
                                                    <Option value={1}>张三</Option>
                                                    <Option value={2}>李四</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                        <FormItem label='工单内容' {...formItemLayout}>
                                            {getFieldDecorator('workOrderContent', {
                                                rules: [{ required: true, message: '请填写工单内容' }],
                                            })(
                                                <Input suffix='0/30' placeholder='此处默认填写设备名称+告警描述'/>
                                            )}
                                        </FormItem>
                                    </Fragment>
                                )
                            }
                        </Form>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Form.create()(AbnormalDeviceDetail);
