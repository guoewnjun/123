import React, {Component} from 'react';
import {Card, Select, Tag, Row, Col, Transfer, Divider, Button, Modal, Spin, message} from 'antd';
import {HttpClient} from "@/common/HttpClient";

class SectionVisualizationSetting extends Component {
    constructor(props) {
        super(props);
        this.dataSource = [];
        this.upList = [];
        this.downList = [];
    }

    state = {
        parkingId: this.props.location.query.id,
        spinning: false,
        directIndex: undefined,
        unSettingBerth: 10,
        upDataSource: [],
        downDataSource: [],
        upBerthTarget: [],
        downBerthTarget: [],
        upModalVisible: false,
        downModalVisible: false,
        upConfirmLoading: false,
        downConfirmLoading: false
    };

    componentWillMount() {

    }

    componentDidMount() {
        this.getBerthDetail()
    }

    componentWillUnmount() {

    }

    getBerthDetail() {
        this.setState({
            spinning: true,
        });
        const directLeftSelect = ['东', '南', '西', '北', '东北', '东南', '西南', '西北'];
        HttpClient.query(`easy-mock${window.MODULE_PARKING_RESOURCE}/admin/resource/parking/set/detail`, 'GET', { parkingId: this.state.parkingId }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data;
                let direct = undefined;
                if (data.direct) {
                    direct = directLeftSelect.indexOf(data.direct.split('-')[0]);
                }
                this.dataSource = data.unSettedList;
                this.upList = data.upList;
                this.downList = data.downList;
                this.setState({
                    directIndex: direct,
                    upDataSource: [...data.unSettedList, ...data.upList],
                    downDataSource: [...data.unSettedList, ...data.downList],
                    downBerthTarget: data.downList.map(item => item.spaceNo),
                    upBerthTarget: data.upList.map(item => item.spaceNo)
                })
            }
            this.setState({
                spinning: false,
                upModalVisible: false,
                downModalVisible: false,
                upConfirmLoading: false,
                downConfirmLoading: false
            })
        })
    }

    editBerth(obj) {
        this.setState({
            spinning: true,
            upConfirmLoading: true,
            downConfirmLoading: true
        });
        const directLeftSelect = ['东', '南', '西', '北', '东北', '东南', '西南', '西北'];
        const directRightSelect = ['西', '北', '东', '南', '西南', '西北', '东北', '东南'];
        let params = {
            parkingId: this.state.parkingId,
            direct: `${directLeftSelect[this.state.directIndex]}-${directRightSelect[this.state.directIndex]}`,
            upList: obj.upList || this.state.upBerthTarget,
            downList: obj.downList || this.state.downBerthTarget,
        };
        HttpClient.query(`easy-mock${window.MODULE_PARKING_RESOURCE}/admin/resource/parking/set/config`, 'POST', params, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                message.success('编辑成功');
                this.getBerthDetail()
        }
        })
    }

    selectUpBerth() {
        this.setState({
            upModalVisible: true
        })
    }

    selectDownBerth() {
        this.setState({
            downModalVisible: true
        })
    }

    filterOption(inputValue, option) {
        return option.spaceNo.indexOf(inputValue) > -1
    }

    handleUpChange(upBerthTarget, direction, moveKeys) {
        this.editBerth({ upList: upBerthTarget });
    }

    handleDownChange(downBerthTarget, direction, moveKeys) {
        this.editBerth({ downList: downBerthTarget });
    }

    handleUpOk() {
        this.getBerthDetail();
    }

    handleDownOk() {
    }

    submit() {

    }

    render() {
        const { directIndex, unSettingBerth, upDataSource, downDataSource, upBerthTarget, downBerthTarget, upModalVisible, downModalVisible, upConfirmLoading, downConfirmLoading } = this.state;
        const directLeftSelect = ['东', '南', '西', '北', '东北', '东南', '西南', '西北'];
        const directRightSelect = ['西', '北', '东', '南', '西南', '西北', '东北', '东南'];
        const Option = Select.Option;
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>可视化设置</div>
                </div>
                <div className='page-content' style={{ padding: 0 }}>
                    <Card title='可视化设置'>
                        <Row gutter={40}>
                            <Col span={8}>
                                <label>路段方向（左）：</label>
                                <Select style={{ width: '60%', marginRight: 10 }}
                                        value={directIndex}
                                        onChange={(value) => {
                                            this.setState({
                                                directIndex: value
                                            })
                                        }}>
                                    {directLeftSelect.map((item, index) => <Option key={index}
                                                                                   value={index}>{item}</Option>)}
                                </Select>
                            </Col>
                            <Col span={8}>
                                <label>路段方向（右）：</label>
                                <Select style={{ width: '60%', marginRight: 10 }}
                                        value={directIndex} disabled>
                                    {directRightSelect.map((item, index) => <Option key={index}
                                                                                    value={index}>{item}</Option>)}
                                </Select>
                            </Col>
                        </Row>
                        <Divider dashed/>
                        <Row>
                            <label>未设置泊位：</label>
                            <span>{unSettingBerth}</span>
                        </Row>
                        <Divider/>
                        <Row>
                            <Col span={4}>
                                <label>上行泊位排列</label>
                            </Col>
                            <Col span={20}>
                                <Button onClick={this.selectUpBerth.bind(this)}>请选择</Button>
                                <div>
                                    {upBerthTarget.map((item, index) => <Tag key={index}>{item}</Tag>)}
                                </div>
                            </Col>
                        </Row>
                        <Divider/>
                        <Row>
                            <Col span={4}>
                                <label>下行泊位排列</label>
                            </Col>
                            <Col span={20}>
                                <Button onClick={this.selectDownBerth.bind(this)}>请选择</Button>
                                <div>
                                    {downBerthTarget.map((item, index) => <Tag key={index}>{item}</Tag>)}
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <Modal
                        title='上行泊位选择'
                        visible={upModalVisible}
                        onOk={this.handleUpOk.bind(this)}
                        onCancel={() => {
                            this.setState({ upModalVisible: false })
                        }}
                        maskClosable={false}
                        destroyOnClose
                        width={900}
                        bodyStyle={{ display: 'flex', justifyContent: 'center', height: 680 }}
                    >
                        <Transfer
                            listStyle={{
                                width: 400,
                                height: 660,
                            }}
                            style={{ margin: '10px 0' }}
                            dataSource={upDataSource}
                            targetKeys={upBerthTarget}
                            rowKey={record => record.spaceNo}
                            showSearch
                            filterOption={this.filterOption}
                            onChange={this.handleUpChange.bind(this)}
                            render={item => item.spaceNo}
                        />
                    </Modal>
                    <Modal
                        title='下行泊位选择'
                        visible={downModalVisible}
                        onOk={this.handleDownOk.bind(this)}
                        width={900}
                        bodyStyle={{ display: 'flex', justifyContent: 'center', height: 680 }}
                        onCancel={() => {
                            this.setState({ downModalVisible: false })
                        }}
                        maskClosable={false}
                        destroyOnClose
                        confirmLoading={upConfirmLoading}
                    >
                        <Transfer
                            listStyle={{
                                width: 400,
                                height: 660,
                            }}
                            confirmLoading={downConfirmLoading}
                            style={{ margin: '10px 0' }}
                            dataSource={downDataSource}
                            targetKeys={downBerthTarget}
                            rowKey={record => record.spaceNo}
                            showSearch
                            filterOption={this.filterOption}
                            onChange={this.handleDownChange.bind(this)}
                            render={item => item.spaceNo}
                        />
                    </Modal>
                </div>
            </div>
        );
    }
}

export default SectionVisualizationSetting;
