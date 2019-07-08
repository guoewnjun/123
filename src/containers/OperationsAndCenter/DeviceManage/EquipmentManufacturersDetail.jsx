import React, {Component} from 'react';
import {Card, Col, Row, Spin} from 'antd';
import {HttpClient} from "@/common/HttpClient";

class EquipmentManufacturersDetail extends Component {

    state = {
        loading: true,
        id: this.props.location.query.id || '', //设备厂商id
        infoData: {
            "vendor_code": "",
            "vendor_name": "",
            "vendor_user_id": "",
            "vendor_username": "",
            "vendor_key": "",
            "contact_name": "",
            "contact_email": "",
            "contact_phone": "",
            "contact_mobile": "",
            "contact_address": "",
            "time_created": "",
            "time_reviewed": "",
            "reviewer": "",
            "enabled": false,
        },
    };

    componentWillMount() {

    }

    componentDidMount() {
        HttpClient.query(`https://iotdev.triplego.cn/admin/device/vendors/${this.state.id}`, 'GET', {service: 'admin.device.vendors'}, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    infoData: d
                })
            }
            this.setState({
                loading: false
            })
        })
    }

    componentWillUnmount() {

    }

    render() {
        const { loading, infoData } = this.state;
        let createDate = '';
        if (infoData.time_created) {
            const year = infoData.time_created.substring(0, 4);
            const month = infoData.time_created.substring(4, 6);
            const day = infoData.time_created.substring(6, 8);
            const hour = infoData.time_created.substring(8, 10);
            const min = infoData.time_created.substring(10, 12);
            const sec = infoData.time_created.substring(12, 14);
            createDate = `${year}-${month}-${day} ${hour}:${min}:${sec}`
        }
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>设备厂商详情</div>
                </div>
                <div className='page-content' style={{ padding: 0, background: 'transparent' }}>
                    <Spin spinning={loading} tip='加载中...'>
                        {/*报警详情*/}
                        <Card title='报警详情' className='detail-card'>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>供应商名称：</label>
                                    <span>{infoData.vendor_name}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>联系人手机：</label>
                                    <span>{infoData.contact_mobile}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>联系电话：</label>
                                    <span>{infoData.contact_phone}</span>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>供应商代码：</label>
                                    <span>{infoData.vendor_code}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>供应商密钥：</label>
                                    <span>{infoData.vendor_key}</span>
                                </Col>
                                <Col span={8}>
                                    <label>联系邮箱：</label>
                                    <span>{infoData.contact_email}</span>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>联系人姓名：</label>
                                    <span>{infoData.contact_name}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>联系地址：</label>
                                    <span>{infoData.contact_address}</span>
                                </Col>
                                <Col span={8}>
                                    <label>系统账号：</label>
                                    <span>{infoData.vendor_username}</span>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col span={8} className='detail-card-col'>
                                    <label>创建时间：</label>
                                    <span>{createDate}</span>
                                </Col>
                                <Col span={8} className='detail-card-col'>
                                    <label>启用状态：</label>
                                    <span>{infoData.enabled ? '已启用' : '已停用'}</span>
                                </Col>
                            </Row>
                        </Card>
                    </Spin>
                </div>
            </div>
        );
    }
}

export default EquipmentManufacturersDetail;
