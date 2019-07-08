import React, { Component } from 'react';
import {
    Form,
    Row,
    Col,
    Select,
    Popover,
    Button,
    Divider,
    Card,
    Typography,
    Spin,
    message
} from 'antd';
import ScrollArea from 'react-scrollbar';
import berthImg1 from "../../static/images/berth_paid.png"
import berthImg2 from "../../static/images/berth_waitPaid.png"
import berthImg3 from "../../static/images/berth_unpaid.png"
import berthImg4 from "../../static/images/berth_empty.png"
import berthImg5 from "../../static/images/berth_fault.png"

import { HttpClient } from "@/common/HttpClient";

const { Text } = Typography;

const gettime = (str) => {
    if (!str) return
    const arr = str.split("T");
    const d = arr[0];
    const darr = d.split('-');
    const t = arr[1];
    const tarr = t.split('.000');
    const marr = tarr[0].split(':');
    const dd = parseInt(darr[0]) + "-" + parseInt(darr[1]) + "-" + parseInt(darr[2]) + " " + parseInt(marr[0]) + ":" + parseInt(marr[1]) + ":" + parseInt(marr[2]);
    //console.log(parseInt(marr[0])+"点");
    return dd;
};

class BerthDetails extends Component {
    constructor(props) {
        super(props);
        const requireContext = require.context("../../static/images", false, /berth_(\w*?)\.png/)
        this.state = {
            id: this.props.location.query.id || '',                 //泊位ID
            areaName: this.props.location.query.areaName || '',     //路段名
            baseData: {},               //基础信息
            berthStatusList: [],        //泊位列表
            berthData: {},              //泊位详情信息
            spinning: true,             //详情信息是否加载中
            // imgData: requireContext.keys().map(requireContext),
        }
    }

    componentDidMount() {
        //目前构造的数据只有id=6才有数据
        this.getBaseData();
        this.getBerthStatusList();
    }

    //获取基本信息
    getBaseData() {
        HttpClient.query(`/parking-resource/admin/parking/road/space/details/base?parkingId=${this.state.id}`, 'GET', null, (d, type) => {
            console.log(d)
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    baseData: d.data
                })
            } else {

            }
        })
    }

    //获取泊位状态列表
    getBerthStatusList() {
        HttpClient.query(`/parking-resource/admin/parking/road/space/details/spaces?parkingId=${this.state.id}`, 'GET', null, (d, type) => {
            console.log(d)
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    berthStatusList: d.data
                })
            } else {

            }
        })
    }

    //获取已缴费泊位详情信息
    getPay(spaceNo) {
        // spaceNo = 'NO9'
        HttpClient.query(`/parking-resource/admin/parking/road/space/details/park/customer/info?spaceNo=${spaceNo}`, 'GET', null, (d, type) => {
            console.log(d)
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    berthData: d.data,
                    spinning: false
                })
            } else {
                message.error('查询不到详情信息')
            }
        })
    }

    //获取未缴费泊位详情信息
    getUnpaid(spaceNo) {
        // spaceNo = 'NO9'
        HttpClient.query(`/parking-resource/admin/parking/road/space/details/park/info?spaceNo=${spaceNo}`, 'GET', null, (d, type) => {
            console.log(d)
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    berthData: d.data,
                    spinning: false
                })
            } else {
                message.error('查询不到详情信息')
            }
        })
    }

    //显示泊位详情信息
    showBerthData(item, visible) {
        // console.log(visible)
        if (visible) {
            this.setState({ spinning: true })
            if (item.feeState == '正常') {
                this.getPay(item.code);
            } else {
                this.getUnpaid(item.code);
            }
        }
    }

    //渲染泊位列表
    showBerthList(item, index) {
        const berthState = ['', '正常缴费', '等待缴费', '未缴费', '空位', '故障']
        const imgData = ['', berthImg1, berthImg2, berthImg3, berthImg4, berthImg5]
        const title = <div style={{ fontWeight: 700, textAlign: 'center' }}>详细信息</div>;
        let content = null;
        const { berthData } = this.state;
        // console.log(item)
        if (item == null) return;
        content = berthData.inTime ?
            (
                <div>
                    <Spin spinning={this.state.spinning}>
                        <p>车辆驶入时间：{gettime(berthData.inTime)}</p>
                        <p style={{ marginBottom: 0 }}>已泊车时长：{berthData.duration}分钟</p>
                    </Spin>
                </div>
            ) : (
                <div>
                    <Spin spinning={this.state.spinning}>
                        {/* <p>手机号：{berthData.mobile}</p> */}
                        <p>申请方式：{berthData.purchaseType}</p>
                        <p>申请时间：{berthData.purchaseTime}</p>
                        <p>申请时长：{berthData.purchaseDuration}分钟</p>
                        <p>申请结束时间：{berthData.endTime}</p>
                        <p style={{ marginBottom: 0 }}>已泊车时长：{berthData.parkedDuration}分钟</p>
                    </Spin>
                </div>
            );
        let imgIndex = 1;
        if (item.feeState == '等待缴费') imgIndex = 2;
        if (item.feeState == '未缴费' || item.feeState == '待稽查') imgIndex = 3;
        if (item.state == '空闲') imgIndex = 4;
        if (item.state == '不可用') imgIndex = 5;
        switch (item.feeState) {
            case '正常':
            case '等待缴费':
            case '未缴费':
                return (
                    <Popover placement="top" title={title} content={content} trigger="click" key={index} onVisibleChange={this.showBerthData.bind(this, item)}>
                        <Card
                            key={index}
                            hoverable
                            style={{ width: 150, height: 100, margin: '0 10px', display: 'inline-block' }}
                            cover={<img style={{ width: '150px', height: '75px' }} src={imgData[imgIndex]} />}
                            bodyStyle={{ padding: '0px' }}
                            bordered={false}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                                <div style={{ fontWeight: 700, fontSize: '16px' }}>{item.code}</div>
                                <div style={{ color: '#808080' }}>{item.state}</div>
                                <div style={{ color: '#808080' }}>{item.feeState}</div>
                            </div>
                        </Card >
                    </Popover>
                )
            case '待稽查':
                return (
                    <Card
                        key={index}
                        hoverable
                        style={{ width: 150, height: 100, margin: '0 10px', display: 'inline-block' }}
                        cover={<img style={{ width: '150px', height: '75px' }} src={imgData[imgIndex]} />}
                        bodyStyle={{ padding: '0px' }}
                        bordered={false}
                    >
                        {item.state == '占用' ?
                            (<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                                <div style={{ fontWeight: 700, fontSize: '16px' }}>{item.code}</div>
                                <div style={{ color: '#808080' }}>{item.state}</div>
                                <div style={{ color: '#808080' }}>{item.feeState}</div>
                            </div>)
                            :
                            (<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 700, fontSize: '16px' }}>{item.code}</span>
                                <span style={{ color: '#808080' }}>{item.state}</span>
                                <span style={{ color: '#808080' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            </div>)}

                    </Card >
                )
            default:
                return (
                    <Card
                        key={index}
                        hoverable
                        style={{ width: 150, height: 100, margin: '0 10px', display: 'inline-block' }}
                        cover={<img style={{ width: '150px', height: '75px' }} src={imgData[imgIndex]} />}
                        bodyStyle={{ padding: '0 10px' }}
                        bordered={false}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, fontSize: '16px' }}>{item.code}</span>
                            <span style={{ color: '#808080' }}>{item.state}</span>
                            <span style={{ color: '#808080' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </div>
                    </Card >
                )
        }

    }

    //返回按钮监听
    backOnClick() {
        location.hash = '/Home/Visualization'
    }

    render() {
        // if (!checkPageEnable('/ParkingRecord')) {
        //     return <Exception type='403' />;
        // }
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
        };

        const { areaName, baseData, berthStatusList } = this.state;

        return (
            <div className="page">
                <div className="page-header">
                    可视化监控
                </div>
                <div className="page-content ">
                    <Row type="flex" justify="space-between" align="middle">
                        <Col>
                            <div style={{ fontSize: 20 }}>路段详情</div>
                        </Col>
                        <Col>
                            <Button type="primary" onClick={this.backOnClick.bind(this)}>返回</Button>
                        </Col>
                    </Row>
                    <Divider />
                    <Row >
                        <Col span={4}>
                            <Text style={{ fontSize: 20, marginLeft: 20 }}>{areaName}</Text>
                        </Col>
                        <Col span={4}>
                            <Text style={{ fontSize: 20, color: "#0084ff", fontWeight: 700 }}>总泊位{baseData.spaceTotalCount}个</Text>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 20 }}>
                        <Col>
                            <Text style={{ background: "#EEE", padding: 10, paddingRight: 50, marginLeft: 20, fontSize: 18 }}>基础信息</Text>
                        </Col>
                    </Row>
                    <Divider style={{ marginTop: 0, marginLeft: 20, minWidth: "98%", width: "99%" }} />
                    <Row gutter={46}>
                        <Col span={5} style={{ marginLeft: 25 }}>
                            <Text>行政区域：{baseData.area}</Text>
                        </Col>
                        <Col span={5}>
                            <Text>片区：{baseData.parkingName}</Text>
                        </Col>
                        <Col span={12}>
                            <Text>计费规则：</Text>
                            <Button type="link" onClick={() => { location.hash = '/ConfigCenter/BerthManage/ChargeRules' }}>查看计费规则</Button>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 20 }}>
                        <Col>
                            <Text style={{ background: "#EEE", padding: 10, paddingRight: 50, marginLeft: 20, fontSize: 18 }}>泊位展示</Text>
                        </Col>
                    </Row>
                    <Divider style={{ marginTop: 0, marginLeft: 20, minWidth: "98%", width: "99%" }} />

                    {/* {
                        !berthStatusList ?
                            <div style={{ marginLeft: 25 }}>暂无泊位</div> :
                            <ScrollArea
                                speed={0.8}
                                // className="area"
                                // contentClassName="content"
                                horizontal={true}
                                // vertical={true}
                                contentStyle={{ width: berthStatusList.length * 170 }}
                                style={{ width: '1535px', marginTop: 40 }}
                                // style={{ minWidth: '1535px', width: '1745px', height: 170 }}
                                // verticalContainerStyle={{ left: '0' }}
                                horizontalContainerStyle={{ background: '#d6ebff', borderRadius: '20px' }}
                                horizontalScrollbarStyle={{ background: '#0084ff', borderRadius: '20px' }}
                            >
                                {
                                    berthStatusList.map((item, index) => {
                                        return this.showBerthList(item, index)
                                    })
                                }
                            </ScrollArea>
                    } */}

                    {
                        !berthStatusList ?
                            <div style={{ marginLeft: 25 }}>暂无泊位</div> :
                            <div
                            >
                                {
                                    berthStatusList.map((item, index) => {
                                        return this.showBerthList(item, index)
                                    })
                                }
                            </div>
                    }



                    {/* <Row type="flex" justify="center" align="middle" gutter={48} style={{ height: '110px', background: '#c3c3c3', margin: '20px 0' }}>
                        <Col><div style={{ height: '30px', width: '30px', background: '#fff', borderRadius: '30px', textAlign: 'center', lineHeight: '30px' }}>东</div></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col span={2}><hr style={{ height: '10px', background: '#fff' }}></hr></Col>
                        <Col><div style={{ height: '30px', width: '30px', background: '#fff', borderRadius: '30px', textAlign: 'center', lineHeight: '30px' }}>西</div></Col>
                    </Row> */}

                    {/* <ScrollArea
                        speed={0.8}
                        // className="area"
                        // contentClassName="content"
                        horizontal={true}
                        // vertical={true}
                        contentStyle={{ width: berthStatusList.length * 170 }}
                        style={{ width: '1535px', paddingTop: 30 }}
                        // style={{ minWidth: '1535px', width: '1745px' }}
                        // verticalContainerStyle={{ left: '0' }}
                        horizontalContainerStyle={{ top: '0', background: '#d6ebff', borderRadius: '20px' }}
                        horizontalScrollbarStyle={{ background: '#0084ff', borderRadius: '20px' }}
                    >
                        {
                            berthStatusList.map((item, index) => {
                                return this.showBerthList(item, index)
                            })
                        }
                    </ScrollArea> */}
                </div>
            </div>
        );
    }
}

export default BerthDetails;
