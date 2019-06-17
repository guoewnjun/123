import React, {Component} from 'react';
import {Empty} from "antd";

class SquadronManage extends Component {

    state = {};

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>中队管理</div>
                </div>
                <div className='page-content' style={{ padding: 0 }}>
                    <Empty description='建设中...'/>
                </div>
            </div>
        );
    }
}

export default SquadronManage;
