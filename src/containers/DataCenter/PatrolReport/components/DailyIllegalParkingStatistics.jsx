import React, {Component, Fragment} from 'react';
import {Table} from 'antd';

class DailyIllegalParkingStatistics extends Component {

    state = {};

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        const columns = [
            {
                title: '日期',
                dataIndex: 'date',
            }, {
                title: '违停告警数',
                dataIndex: 'times',
            }, {
                title: '告警成立数',
                dataIndex: 'setUp',
            }, {
                title: '未缴费停车',
                dataIndex: 'unpaid',
            }, {
                title: '跨泊位停车',
                dataIndex: 'crossBerth',
            }, {
                title: '逆向停车',
                dataIndex: 'reverseParking',
            }, {
                title: '禁停时段停车',
                dataIndex: 'noStoppingTime',
            }, {
                title: '黑名单禁停区停车',
                dataIndex: 'blackList',
            }
        ];
        const dataSource = [];
        return (
            <Fragment>
                <div style={{ fontSize: 20}}>每日违停统计</div>
                <Table columns={columns} dataSource={dataSource}/>
            </Fragment>
        );
    }
}

export default DailyIllegalParkingStatistics;
