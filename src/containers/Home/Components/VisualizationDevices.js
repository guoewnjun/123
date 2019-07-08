import React, {Component, Fragment} from 'react';
import {Button, Row, Select} from "antd";
import {HttpClient} from "@/common/HttpClient";

class VisualizationDevices extends Component {

    constructor(props) {
        super(props);
        this.payLoad = {};
    }

    state = {
        districtOptions: [],
        areaOptions: [],
        subAreaValue: undefined,
    };

    componentWillMount() {

    }

    componentDidMount() {
        // 获取行政区
        HttpClient.query(`${window.MODULE_PARKING_INFO}/admin/city/areaInfo/${window.cityCode}`, 'GET', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    districtOptions: d.data
                })
            }
        });
        this.getSubAreaInfo({ cityCode: window.cityCode })
    }

    getSubAreaInfo(params) {
        // 获取片区
        HttpClient.query('/parking-info/admin/city/subAreaInfo', 'GET', params, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                this.setState({
                    areaOptions: d.data
                })
            }
        });
    }

    componentWillUnmount() {

    }

    selectArea(value) {
        this.setState({
            subAreaValue: undefined,
        });
        const params = {
            cityCode: window.cityCode,
            areaCode: value
        };
        this.payLoad.areaCode = value;
        this.getSubAreaInfo(params)
    }

    render() {
        const { districtOptions, areaOptions, subAreaValue } = this.state;
        const Option = Select.Option;
        return (
            <Fragment>
                <Row type='flex' align='middle' style={{ marginBottom: 20 }}>
                    <label>区域：</label>
                    <Select
                        allowClear
                        onChange={(value) => this.selectArea(value)}
                        style={{ flexGrow: 1 }}
                        placeholder="请选择"
                        optionFilterProp="children"
                    >
                        {
                            districtOptions.map(item => (
                                <Option
                                    key={item.areaCode}>{item.areaName}</Option>
                            ))
                        }
                    </Select>
                </Row>
                <Row type='flex' align='middle' style={{ marginBottom: 20 }}>
                    <label>片区：</label>
                    <Select
                        allowClear
                        onChange={(value) => {
                            this.setState({
                                subAreaValue: value
                            });
                            if (value) {
                                this.payLoad.geo_longlat = JSON.stringify([value.split('_')[0], value.split('_')[1]])
                            }else {
                                this.payLoad.geo_longlat = undefined
                            }
                        }}
                        style={{ flexGrow: 1 }}
                        value={subAreaValue}
                        placeholder="请选择"
                        optionFilterProp="children"
                    >
                        {
                            areaOptions.map(item => (
                                <Option key={item.subAreaCode}
                                        value={`${item.longitude}_${item.latitude}_${item.subAreaCode}`}>{item.subAreaName}</Option>
                            ))
                        }
                    </Select>
                </Row>
                <Row type='flex' align='middle' style={{ marginBottom: 20 }}>
                    <label>设备类型：</label>
                    <Select
                        onChange={(value) => this.payLoad.type = value}
                        style={{ flexGrow: 1 }}
                        placeholder="请选择"
                        optionFilterProp="children"
                        defaultValue={0}
                    >
                        <Option value={0}>车检器</Option>
                    </Select>
                </Row>
                <Row type='flex' align='middle' justify='space-around'>
                    <Button type='primary' style={{ width: '100%' }}
                            onClick={() => this.props.searchDevice(this.payLoad)}>查询</Button>
                </Row>
            </Fragment>
        );
    }
}

export default VisualizationDevices;
