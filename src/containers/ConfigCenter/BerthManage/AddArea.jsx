import React, {Component} from 'react';
import {Button, Card, Form, Row, Col, Input, Icon, Modal, message} from 'antd';
import {HttpClient} from "@/common/HttpClient";
import AttendanceAddressModal from "../../OperationsAndCenter/InspectionManaage/Components/AttendanceAddressModal";
import ChinaRegion from "@/components/ChinaRegion"; //省市区

class AddArea extends Component {

    state = {
        amapVisible: false
    };

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    submit() {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            const districtInfo = ['provinceCode', 'cityCode', 'areaCode'];
            let payLoad = {};
            values.area.forEach((item, index) => {
                payLoad[districtInfo[index]] = item
            });
            payLoad.longitude = values.location.lng;
            payLoad.latitude = values.location.lat;
            payLoad.name = values.name;
            if (values.remark) {
                payLoad.remark = values.remark;
            }
            HttpClient.query(`${window.MODULE_PARKING_INFO}/admin/area/subarea/new`, 'POST', payLoad, (d, type) => {
                if (type === HttpClient.requestSuccess) {
                    message.success('新增成功');
                    history.back(-1)
                }
            }, 'application/x-www-form-urlencoded;charset=UTF-8')
        })
    }

    mapOk() {
        const form = this.detailAddress.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.props.form.setFieldsValue({ location: values.location });
            this.setState({
                amapVisible: false
            })
        });
    }

    mapCancel() {
        this.setState({
            amapVisible: false
        })
    }

    render() {
        const { amapVisible } = this.state;
        const { getFieldDecorator } = this.props.form;
        const FormItem = Form.Item;
        const TextArea = Input.TextArea;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>添加片区</div>
                </div>
                <div className='page-content' style={{ padding: 0 }}>
                    <Form>
                        <Card title='添加片区'>
                            <Row gutter={40}>
                                <Col span={8}>
                                    <FormItem label='片区名称' {...formItemLayout}>
                                        {getFieldDecorator('name', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入片区名称'
                                                },
                                                {
                                                    max: 20,
                                                    message: '输入不可超过20字'
                                                }, {
                                                    pattern: new RegExp(/^[A-Za-z0-9\u4e00-\u9fa5]+$/),
                                                    message: '仅支持输入中英文和数字',
                                                }, {
                                                    validator: (rule, value, callback) => {
                                                        if (value === "全部") {
                                                            callback("此命名不允许")
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ]
                                        })(
                                            <Input placeholder='请输入'/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={40}>
                                <Col span={8}>
                                    <FormItem label='片区坐标' {...formItemLayout}>
                                        {getFieldDecorator('location', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '该字段必须',
                                                }
                                            ],
                                        })(
                                            <Input placeholder='X, Y' disabled={true}/>
                                        )}
                                        <Button type='primary' style={{ marginTop: 20 }}
                                                onClick={() => this.setState({ amapVisible: true })}>
                                            <Icon type='plus'/>添加坐标</Button>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={40}>
                                <Col span={8}>
                                    <FormItem label='所属区域' {...formItemLayout}>
                                        {getFieldDecorator('area', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '该字段必须',
                                                }
                                            ],
                                        })(
                                            <ChinaRegion placeholder="省/市/区，县"/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={40}>
                                <Col span={8}>
                                    <FormItem label='描述' {...formItemLayout}>
                                        {getFieldDecorator('remark')(
                                            <TextArea placeholder='请输入' rows={3}/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Card>
                    </Form>

                    {/*高德地图*/}
                    <Modal
                        visible={amapVisible}
                        title='添加坐标'
                        destroyOnClose
                        maskClosable={false}
                        onOk={this.mapOk.bind(this)}
                        onCancel={this.mapCancel.bind(this)}
                        bodyStyle={{ margin: 0 }}
                        width={900}
                    >
                        <AttendanceAddressModal
                            showLocation
                            wrappedComponentRef={formRef => this.detailAddress = formRef}
                        />
                    </Modal>

                    {/*footer 提交或取消*/}
                    <div className="edit_bottom">
                        <Button type="primary" style={{ float: "right" }} onClick={this.submit.bind(this)}>提交</Button>
                        <Button style={{ float: "right", marginRight: "12px" }}
                                onClick={() => history.back(-1)}>取消</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form.create()(AddArea);
