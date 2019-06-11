import React, {Component, Fragment} from 'react';
import {Button, Input, Row, Tree, Card} from "antd";
import ProTypes from 'prop-types';
import _ from "lodash";
import {HttpClientImmidIot} from "../../../common/HttpClientImmidIot";

class VisualizationUsers extends Component {

    constructor(props) {
        super(props);
        this.payLoad = {};
    }

    state = {
        usersList: [],
        treeData: [
            {
                title: '梧州市',
                key: '0',
            }
        ]
    };

    componentWillMount() {

    }

    componentDidMount() {
        this.searchUsers(null)
    }

    componentWillUnmount() {

    }

    // 人员树形选择器的选择事件
    onSelect(selectedKeys, info) {
        console.log('selected', selectedKeys, info);
    };

    searchUsers(params) {
        HttpClientImmidIot.query('/visualization/users', 'GET', params, (d, type) => {
            const data = d.data;
            this.setState({
                usersList: data
            })
        })
    }

    checkUserDetail(id) {
        location.hash = `/Home/Visualization/UserDetail?id=${id}`
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

    onLoadData(treeNode) {
        return new Promise(resolve => {
            const isLeaf = treeNode.props.eventKey.split('-').length > 3;
            if (treeNode.props.children || isLeaf) {
                resolve();
                return;
            }
            setTimeout(() => {
                treeNode.props.dataRef.children = [
                    { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
                    { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
                ];
                this.setState({
                    treeData: [...this.state.treeData],
                });
                resolve();
            }, 500);
        });
    }

    render() {
        const { treeData, usersList } = this.state;
        const { TreeNode } = Tree;
        const renderTreeNodes = data => data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item} selectable={false}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item}/>;
        });
        return (
            <Fragment>
                <Row type='flex' align='middle' style={{ marginBottom: 10 }}>
                    <label>姓名：</label>
                    <Input style={{ flexGrow: 1, width: 'unset' }} placeholder="请输入"
                           onChange={(e => this.payLoad.name = e.target.value)}/>
                </Row>
                <Row type='flex' align='middle' style={{ marginBottom: 10 }}>
                    <label>工号：</label>
                    <Input style={{ flexGrow: 1, width: 'unset' }} placeholder="请输入"
                           onChange={(e => this.payLoad.jobNumber = e.target.value)}/>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                    <Button style={{ width: '100%' }} type='primary'
                            onClick={() => this.searchUsers(this.payLoad)}>查询</Button>
                </Row>
                <div style={{ height: 490, overflowY: 'auto' }}>
                    {
                        usersList.length > 0 && (
                            <Card bodyStyle={{padding: 0}}>
                                {
                                    usersList.map(item => (
                                        <div key={item.userNumber} style={{
                                            padding: 10,
                                            display: 'flex',
                                            width: '100%',
                                            borderBottom: '1px solid #e8e8e8'
                                        }}
                                             onClick={this.checkUserDetail.bind(this, item.userId)}
                                        >
                                            <img src={item.imgUrl} alt='' style={{ width: 50, height: 50 }}/>
                                            <div style={{ flexGrow: 1, marginLeft: 10 }}>
                                                <div style={{marginBottom: 6}}>{item.userName}</div>
                                                <div>{item.userNumber}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </Card>
                        )
                    }
                    <Row>
                        <Tree
                            defaultCheckedKeys={['0-0-2', '0-0-1']}
                            loadData={this.onLoadData.bind(this)}
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
