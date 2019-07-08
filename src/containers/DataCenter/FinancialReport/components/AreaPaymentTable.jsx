import React, {Component} from 'react';
import {Table} from 'antd';

class AreaPaymentTable extends Component {
    render() {
        const columns = [
            {
                title: '日期',
                dataIndex: 'day',
            },
            {
                title: '范围',
                dataIndex: 'name',
            },
            {
                title: this.props.AreaPaymentTableTitle.money,
                dataIndex: 'money',
            },
            {
                title: this.props.AreaPaymentTableTitle.count,
                dataIndex: 'count',
            }
        ];
        return (
            <Table columns={columns} dataSource={this.props.dataSource}
                   childrenColumnName="subAreaList"/>
        );
    }
}

export default AreaPaymentTable;
