import React, {Component, Fragment} from 'react';
import {Button, Input, Row, Tree, Card, message} from "antd";
import ProTypes from 'prop-types';
import _ from "lodash";
import {HttpClient} from "@/common/HttpClient";

class VisualizationUsers extends Component {

    constructor(props) {
        super(props);
        this.payLoad = {};
    }

    state = {
        usersList: [],
        treeData: []
    };

    componentWillMount() {

    }

    componentDidMount() {
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/monitoringCenter/${window.cityCode}/getPersonAttendance`, 'GET', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                if (d.data) {
                    this.setState({
                        treeData: [d.data],
                    })
                }
            }
        });
    }

    componentWillUnmount() {

    }

    // 人员树形选择器的选择事件
    onSelect(selectedKeys, info) {
        console.log('selected', selectedKeys, info);
    };

    searchUsers(params) {
        const filterParams = this.filterParams(params);
        if (!Object.keys(filterParams).length) {
            message.info('请输入查询条件');
            return;
        }
        HttpClient.query(`${window.MODULE_PARKING_INFO}/centerConsole/searchInspectionMember`, 'GET', filterParams, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data;
                this.setState({
                    usersList: data
                })
            }
        })
    }

    checkUserDetail(id) {
        location.hash = `${location.hash}/UserDetail?id=${id}`
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

    render() {
        const { treeData, usersList } = this.state;
        const { TreeNode } = Tree;
        const renderTreeNodes = data => data.map((item) => {
            let title = '';
            if (item.planAttendance >= 0) {
                title = `${item.name}(应到${item.planAttendance || 0}，实到${item.actualAttendance || 0})`
            } else {
                title = item.name
            }
            if (item.children) {
                return (
                    <TreeNode title={title} key={item.id} dataRef={item} selectable={false}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={title} key={item.id}/>;
        });
        return (
            <Fragment>
                <Row type='flex' align='middle' style={{ marginBottom: 10 }}>
                    <label>姓名：</label>
                    <Input style={{ flexGrow: 1, width: 'unset' }} placeholder="请输入"
                           onChange={(e => this.payLoad.userName = e.target.value)}/>
                </Row>
                <Row type='flex' align='middle' style={{ marginBottom: 10 }}>
                    <label>工号：</label>
                    <Input disabled title='该选项暂时无法使用' style={{ flexGrow: 1, width: 'unset' }} placeholder="请输入"
                           onChange={(e => this.payLoad.workNum = e.target.value)}/>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                    <Button style={{ width: '100%' }} type='primary'
                            onClick={() => this.searchUsers(this.payLoad)}>查询</Button>
                </Row>
                <div style={{ height: 490, overflowY: 'auto' }}>
                    {
                        usersList.length > 0 && (
                            <Card bodyStyle={{ padding: 0 }}>
                                {
                                    usersList.map(item => (
                                        <div key={item.id} style={{
                                            padding: 10,
                                            display: 'flex',
                                            width: '100%',
                                            borderBottom: '1px solid #e8e8e8'
                                        }}
                                             onClick={this.checkUserDetail.bind(this, item.id)}
                                        >
                                            {
                                                item.imageUrl &&
                                                <img src={item.imageUrl} alt='' style={{ width: 50, height: 50 }}/>
                                            }
                                            <div style={{ flexGrow: 1, marginLeft: 10 }}>
                                                <div style={{ marginBottom: 6 }}>{item.userName}</div>
                                                <div>{item.mobile}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </Card>
                        )
                    }
                    <Row>
                        <Tree
                            onSelect={this.onSelect.bind(this)}
                        >
                            {renderTreeNodes(treeData)}
                        </Tree>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

VisualizationUsers.proTypes = {
    searchUsers: ProTypes.func,
    usersList: ProTypes.array
};
export default VisualizationUsers;
