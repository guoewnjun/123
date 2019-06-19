import React, {Component} from 'react';
import {Table} from 'antd';

class AreaPaymentDetail extends Component {

    state = {};

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        const dataSource = [
            {
                date: '2019-6-1',
                range: '南山区',
                money: '15431',
                times: '9485'
            }, {
                date: '2019-6-2',
                range: '南山区',
                money: '15431',
                times: '9485'
            }, {
                date: '2019-6-3',
                range: '南山区',
                money: '15431',
                times: '9485'
            }, {
                date: '2019-6-4',
                range: '南山区',
                money: '15431',
                times: '9485'
            }, {
                date: '2019-6-5',
                range: '南山区',
                money: '15431',
                times: '9485'
            },
        ];
        const columns = [
            {
                title: '日期',
                dataIndex: 'date',
            }, {
                title: '范围',
                dataIndex: 'range',
            }, {
                title: '缴费金额',
                dataIndex: 'money',
            }, {
                title: '缴费笔数',
                dataIndex: 'times',
            }
        ];
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>区域缴费金额统计详情</div>
                </div>
                <div className='page-content' style={{ padding: 30 }}>
                    <Table columns={columns} dataSource={dataSource} pagination={false} rowKey={(row => row.date)}/>
                </div>
            </div>
        );
    }
}

export default AreaPaymentDetail;
