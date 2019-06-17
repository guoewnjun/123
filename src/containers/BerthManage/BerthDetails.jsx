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
    Typography
} from 'antd';
// import InfiniteScroll from 'react-infinite-scroller';
import ScrollArea from 'react-scrollbar';
import { HttpClientImmidIot } from "../../common/HttpClientImmidIot";
import berthImg1 from "../../static/images/berth_paid.png"
import berthImg2 from "../../static/images/berth_waitPaid.png"
import berthImg3 from "../../static/images/berth_unpaid.png"
import berthImg4 from "../../static/images/berth_empty.png"
import berthImg5 from "../../static/images/berth_fault.png"

const { Text } = Typography;


class BerthDetails extends Component {
    constructor(props) {
        super(props);
        const requireContext = require.context("../../static/images", false, /berth_(\w*?)\.png/)
        this.state = {
            imgData: requireContext.keys().map(requireContext),
            berthDetailsData: {},
            topRoadData: [],
            bottomRoadData: []
        }
    }

    componentDidMount() {
        HttpClientImmidIot.query('/visualization/berthDetails', 'GET', null, (d, type) => {
            if (d.data) {
                // console.log(d);
                this.setState({
                    berthDetailsData: d.data,
                    topRoadData: d.data.topRoadData,
                    bottomRoadData: d.data.bottomRoadData
                })
            }
        });
    }

    showBerthStatus(item, index) {
        const berthState = ['', '正常缴费', '等待缴费', '未缴费', '空位', '故障']
        const imgData = ['', berthImg1, berthImg2, berthImg3, berthImg4, berthImg5]
        const text = <div style={{ fontWeight: 700, textAlign: 'center' }}>详细信息</div>;
        let content = null;
        // console.log(item)
        if (item == null) return;
        switch (item.status) {
            case 1:
                content = (
                    <div>
                        <p>手机号：{item.phoneNo}</p>
                        <p>申请方式：{item.applyMode}</p>
                        <p>申请时间：{item.applyTime}</p>
                        <p>申请时长：{item.applyDuration}</p>
                        <p>预计离开时间：{item.expectOutTime}</p>
                        <p style={{ marginBottom: 0 }}>已停时长：{item.parkingDuration}</p>
                    </div>
                );
                return (
                    <Popover placement="top" title={text} content={content} trigger="click" key={index}>
                        <Card
                            hoverable
                            style={{ width: 150, height: 100, margin: '0 10px', display: 'inline-block' }}
                            cover={<img style={{ width: '150px', height: '75px' }} src={imgData[item.status]} />}
                            bodyStyle={{ padding: '0 15px' }}
                            bordered={false}
                        >
                            <div>
                                <span style={{ fontWeight: 700, fontSize: '16px' }}>{item.berthNo}</span>
                                <span style={{ color: '#808080', float: 'right' }}>{berthState[item.status]}</span>
                            </div>
                        </Card>
                    </Popover>
                )
                break
            case 2:
            case 3:
                content = (
                    <div>
                        <p>车辆驶入时间{item.inTime}</p>
                        <p style={{ marginBottom: 0 }}>已停时长：{item.parkingDuration}</p>
                    </div >
                );
                return (
                    <Popover placement="top" title={text} content={content} trigger="click" key={index}>
                        <Card
                            hoverable
                            style={{ width: 150, height: 100, margin: '0 10px', display: 'inline-block' }}
                            cover={<img style={{ width: '150px', height: '75px' }} src={imgData[item.status]} />}
                            bodyStyle={{ padding: '0 15px' }}
                            bordered={false}
                        >
                            <div>
                                <span style={{ fontWeight: 700, fontSize: '16px' }}>{item.berthNo}</span>
                                <span style={{ color: '#808080', float: 'right' }}>{berthState[item.status]}</span>
                            </div>
                        </Card>
                    </Popover>
                )
                break
            case 4:
            case 5:
                return (
                    <Card
                        key={index}
                        hoverable
                        style={{ width: 150, height: 100, margin: '0 10px', display: 'inline-block' }}
                        cover={<img style={{ width: '150px', height: '75px' }} src={imgData[item.status]} />}
                        bodyStyle={{ padding: '0 15px' }}
                        bordered={false}
                    >
                        <div>
                            <span style={{ fontWeight: 700, fontSize: '16px' }}>{item.berthNo}</span>
                            <span style={{ color: '#808080', float: 'right' }}>{berthState[item.status]}</span>
                        </div>
                    </Card>
                )
                break
        }

    }

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

        const { berthDetailsData, topRoadData, bottomRoadData } = this.state;

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
                            <Text style={{ fontSize: 20, marginLeft: 20 }}>{berthDetailsData.roadName}</Text>
                        </Col>
                        <Col span={4}>
                            <Text style={{ fontSize: 20, color: "#0084ff", fontWeight: 700 }}>总泊位{berthDetailsData.berthNum}个</Text>
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
                            <Text>行政区域：{berthDetailsData.region}</Text>
                        </Col>
                        <Col span={5}>
                            <Text>片区：{berthDetailsData.district}</Text>
                        </Col>
                        <Col span={12}>
                            <Text>收费规则：{berthDetailsData.chargingRules}</Text>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 20 }}>
                        <Col>
                            <Text style={{ background: "#EEE", padding: 10, paddingRight: 50, marginLeft: 20, fontSize: 18 }}>泊位展示</Text>
                        </Col>
                    </Row>
                    <Divider style={{ marginTop: 0, marginLeft: 20, minWidth: "98%", width: "99%" }} />


                    <ScrollArea
                        speed={0.8}
                        // className="area"
                        // contentClassName="content"
                        horizontal={true}
                        // vertical={true}
                        contentStyle={{ width: topRoadData.length * 170 }}
                        style={{ width: '1535px', marginTop: 40 }}
                        // style={{ minWidth: '1535px', width: '1745px', height: 170 }}
                        // verticalContainerStyle={{ left: '0' }}
                        horizontalContainerStyle={{ background: '#d6ebff', borderRadius: '20px' }}
                        horizontalScrollbarStyle={{ background: '#0084ff', borderRadius: '20px' }}
                    >
                        {
                            topRoadData.map((item, index) => {
                                return this.showBerthStatus(item, index)
                            })
                        }
                    </ScrollArea>

                    <Row type="flex" justify="center" align="middle" gutter={48} style={{ height: '110px', background: '#c3c3c3', margin: '20px 0' }}>
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
                    </Row>


                    <ScrollArea
                        speed={0.8}
                        // className="area"
                        // contentClassName="content"
                        horizontal={true}
                        // vertical={true}
                        contentStyle={{ width: bottomRoadData.length * 170 }}
                        style={{ width: '1535px', paddingTop: 30 }}
                        // style={{ minWidth: '1535px', width: '1745px' }}
                        // verticalContainerStyle={{ left: '0' }}
                        horizontalContainerStyle={{ top: '0', background: '#d6ebff', borderRadius: '20px' }}
                        horizontalScrollbarStyle={{ background: '#0084ff', borderRadius: '20px' }}
                    >
                        {
                            bottomRoadData.map((item, index) => {
                                return this.showBerthStatus(item, index)
                            })
                        }
                    </ScrollArea>
                </div>
            </div>
        );
    }
}

export default BerthDetails;
