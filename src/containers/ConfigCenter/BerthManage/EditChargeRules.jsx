import React, {Component} from 'react';
import './Style/SectionResource.css'
import {HttpClient} from "@/common/HttpClient";
import {custom} from "@/common/SystemStyle";

import RuleEdit from './Components/RuleEdit';

import {message, Spin} from "antd";
import Exception from '@/components/Exception';

export default class EditChargeRules extends Component {
    constructor (props) {
        super(props);

        message.config({
            duration: 1
        });

        this.state = {
            //列表参数
            rule: undefined,
            isLoading: false,
            inEdit: false
        }
    }


    componentWillMount () {

    }

    componentDidMount () {
        if (!window.checkPageEnable("chargeRuleUpdate")) return;
        this.queryRuleDetail();
    }


    queryRuleDetail () {
        this.setState({
            isLoading: true
        });
        let id = 1001;
        if (HttpClient.REQUEST === "truth") {
            id = this.props.location.query.id;
        }
        HttpClient.query('/parking-resource/parkingPriceRules/' + id, HttpClient.GET, null, this.fetchRuleDetail.bind(this));
    }

    fetchRuleDetail (e, type) {
        this.setState({
            isLoading: false
        });
        if (type === HttpClient.requestSuccess) {
            this.setState({
                rule: e.data
            })
        }
        console.log('计费规则详情：', e.data)
    }

    submit (newId) {
        const replacedStr = location.hash.split('?id=')[1];
        location.hash = location.hash.replace(/EditChargeRules/, 'DisplayChargeRules').replace(replacedStr, newId)
    }

    cancelEdit () {
        // location.hash = location.hash.replace("EditChargeRules", "DisplayChargeRules");
        history.back(-1)
    }

    render () {
        //判断页面权限
        if (!window.checkPageEnable("chargeRuleUpdate")) {
            return <Exception type={403}/>
        }

        return (
            <div className="page">
                <div className="page-header" style={{ position: "relative", height: 64 }}>
                    <div style={{ float: "left" }}>编辑计费规则</div>
                    <div style={custom.clear}/>
                </div>
                <Spin tip="加载中.." spinning={this.state.isLoading}>
                    {this.state.rule !== undefined ? <RuleEdit rule={this.state.rule}
                                                               cancel={this.cancelEdit.bind(this)}
                                                               submit={this.submit.bind(this)}
                    /> : <div className="page-content"></div>}
                </Spin>
            </div>
        )
    }


}
