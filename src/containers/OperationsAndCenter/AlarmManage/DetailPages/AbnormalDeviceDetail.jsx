import React, {Component, Fragment} from 'react';
import {Card, Col, Row, Button, Modal, Form, Input, Select, Spin} from "antd";
import {HttpClient} from "@/common/HttpClient";
import _ from "lodash";

class AbnormalDeviceDetail extends Component {

    state = {
        spinning: true,
        id: this.props.location.query.id || '',
        modalVisible: false,
        confirmLoading: false,
        dealWay: 0,
        detailInfo: null,
        userList: [],
    };

    componentWillMount() {

    }

    componentDidMount() {
        HttpClient.query(`${window.MODULE_PARKING_RESOURCE}/road/maintenance/warning/device/detail`, 'GET', { id: this.state.id }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    detailInfo: d.data || null
                })
            }
            this.setState({
                spinning: false
            })
        });
    }

    componentWillUnmount() {

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

    onSubmit() {
        this.setState({
            confirmLoading: true
        });
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            const params = {
                id: this.state.id,
                ...this.filterParams(fieldsValue)
            };
            HttpClient.query(`${window.MODULE_PARKING_RESOURCE}/road/maintenance/warning/device/dispose`, 'POST', params, (d, type) => {
                if (type === HttpClient.requestSuccess) {
                    this.setState({
                        modalVisible: false
                    });
                }
                this.setState({
                    confirmLoading: false
                })
            })
        });
    }

    onCancel() {
        this.setState({
            modalVisible: false
        })
    }

    handleAlarm() {
        // 获取指派人员列表
        HttpClient.query(`${window.MODULE_PARKING_INFO}/admin/user/simple/maintenance`, 'GET', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    userList: d.data || []
                })
            }
        });
        this.setState({
            modalVisible: true
        });
    }

    render() {
        const { modalVisible, confirmLoading, dealWay, spinning, detailInfo, userList } = this.state;
        if (!detailInfo) {
            return (
                <div className='page'>
                    <div className='page-header'>
                        设备告警详情
                        <Button type='primary' onClick={() => window.history.back()}
                                style={{ float: 'right' }}>返回</Button>
                    </div>
                    <Spin spinning={spinning} tip='加载中...'>
                        <div className='page-content' style={{ padding: 0, background: 'transparent' }}/>
                    </Spin>
                </div>
            )
        }
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
                    {/*<Button type='primary' onClick={() => window.history.back()} style={{ float: 'right' }}>返回</Button>*/}
                </div>
                <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                    <Spin spinning={spinning} tip='加载中...'>
                        <Card title='设备信息' className='detail-card'>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>路段名称：</label>
                                    <span>{detailInfo.parkingName}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>关联车位：</label>
                                    <span>{detailInfo.parkingSpaces}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>设备类型：</label>
                                    <span>{detailInfo.deviceType}</span>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>设备型号：</label>
                                    <span>{detailInfo.deviceModel}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>设备ID：</label>
                                    <span>{detailInfo.deviceId}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>硬件ID：</label>
                                    <span>{detailInfo.hardwareId}</span>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>设备厂家：</label>
                                    <span>{detailInfo.factory}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>设备地址：</label>
                                    <span>{detailInfo.address}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>设备状态：</label>
                                    <span>{detailInfo.online}</span>
                                </Col>
                            </Row>
                        </Card>
                        <Card title='告警信息' className='detail-card'
                              extra={<Button type='primary' onClick={() => this.handleAlarm()}>处理</Button>}>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>告警事件：</label>
                                    <span>{detailInfo.type}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>告警等级：</label>
                                    <span>{detailInfo.priority}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>告警时间：</label>
                                    <span>{detailInfo.faultTime}</span>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>告警状态：</label>
                                    <span>{detailInfo.state}</span>
                                </Col>
                            </Row>
                        </Card>
                    </Spin>
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
                                {detailInfo.deviceType}
                            </FormItem>
                            <FormItem label='告警等级' {...formItemLayout}>
                                {detailInfo.priority}
                            </FormItem>
                            <FormItem label='告警事件' {...formItemLayout}>
                                {detailInfo.type}
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
                                        {getFieldDecorator('content')(
                                            <TextArea row={4} placeholder='请填写处理说明, 字数不超过200字'/>
                                        )}
                                    </FormItem>
                                ) : (
                                    <Fragment>
                                        <FormItem label='工单标题' {...formItemLayout}>
                                            {getFieldDecorator('caption', {
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
                                            {getFieldDecorator('disposer')(
                                                <Select placeholder='请选择'>
                                                    {
                                                        userList.map(item => (
                                                            <Option key={item.id} value={item.id}>{item.name}</Option>
                                                        ))
                                                    }
                                                </Select>
                                            )}
                                        </FormItem>
                                        <FormItem label='工单内容' {...formItemLayout}>
                                            {getFieldDecorator('content', {
                                                rules: [{ required: true, message: '请填写工单内容' }],
                                            })(
                                                <Input suffix='0/30' placeholder='请输入'/>
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
