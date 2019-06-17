import React, {Component, Fragment} from 'react';
import {Button, Card, List, Row, Select, Spin} from "antd";
import ProTypes from 'prop-types';
import {HttpClient} from "@/common/HttpClient.jsx";

class VisualizationBerth extends Component {
    constructor(props) {
        super(props);
        this.payLoad = {};
    }


    state = {
        streetBerthData: [],
        districtOptions: [],
        areaOptions: [],
        spinning: false,
    };

    componentWillMount() {

    }

    componentDidMount() {
        // 获取行政区
        HttpClient.query(`/parking-resource/admin/city/areaInfo/450400`, 'GET', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    districtOptions: d.data
                })
            }
        });
        // 获取片区
        HttpClient.query('/parking-info/admin/city/subAreaInfo', 'GET', { cityCode: 450400 }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    areaOptions: d.data
                })
            }
        });
    }

    componentWillUnmount() {

    }

    searchBerth() {
        this.setState({
            spinning: true
        });
        HttpClient.query('/parking-resource/admin/parking/road/space', 'GET', this.payLoad, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    spinning: false,
                    streetBerthData: d.data
                })
            }
        });
    }

    render() {
        const { districtOptions, areaOptions, streetBerthData, spinning } = this.state;
        const Option = Select.Option;
        return (
            <Fragment>
                <Row type='flex' align='middle' style={{ marginBottom: 10 }}>
                    <label>区域：</label>
                    <Select
                        style={{ flexGrow: 1 }}
                        placeholder="请选择"
                        optionFilterProp="children"
                        onChange={(value) => this.payLoad.areaCode = value}
                    >
                        {
                            districtOptions.map(item => (
                                <Option key={item.areaCode} value={item.areaCode}>{item.areaName}</Option>
                            ))
                        }
                    </Select>
                </Row>
                <Row type='flex' align='middle' style={{ marginBottom: 10 }}>
                    <label>片区：</label>
                    <Select
                        style={{ flexGrow: 1 }}
                        placeholder="请选择"
                        optionFilterProp="children"
                        onChange={(value) => this.payLoad.subAreaName = value}
                    >
                        {
                            areaOptions.map(item => (
                                <Option key={item.subAreaCode} value={item.subAreaCode}>{item.subAreaName}</Option>
                            ))
                        }
                    </Select>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                    <Button type='primary' style={{ width: '100%' }}
                            onClick={this.searchBerth.bind(this)}>查询</Button>
                </Row>
                <Row>
                    <Spin spinning={spinning} tip='加载中...'>
                        <Card style={{ maxHeight: 500, overflowY: 'auto' }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={streetBerthData}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<a>{item.roadName}</a>}
                                            description={`泊位数量：剩余${item.freeSpaceCount}个，总共${item.spaceCount}个`}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Spin>
                </Row>
            </Fragment>
        );
    }
}

VisualizationBerth.proTypes = {
    berthSearch: ProTypes.func,
    berthList: ProTypes.array
};
export default VisualizationBerth;
