import React, {Component, Fragment} from 'react';
import {Table} from 'antd';

class DailyIllegalParkingStatistics extends Component {
    render() {
        const columns = [
            {
                title: '日期',
                dataIndex: 'dayTime',
            }, {
                title: '违停告警数',
                dataIndex: 'warningTotalCount',
            }, {
                title: '告警成立数',
                dataIndex: 'warnEstablishCount',
            }, {
                title: '未缴费停车',
                dataIndex: 'noPayCount',
            }, {
                title: '跨泊位停车',
                dataIndex: 'crossSpaceCount',
            }, {
                title: '逆向停车',
                dataIndex: 'reverseParkCount',
            }, {
                title: '禁停时段停车',
                dataIndex: 'forbiddenTimeCount',
            }, {
                title: '黑名单禁停区停车',
                dataIndex: 'blackListCount',
            }
        ];
        const { data } = this.props;
        return (
            <Fragment>
                <div style={{ fontSize: 20 }}>{this.props.title}</div>
                <Table columns={columns} dataSource={data} rowKey={(row) => row.dayTime}/>
            </Fragment>
        );
    }
}

export default DailyIllegalParkingStatistics;
