import React, {Component} from 'react'
import {LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import IndexContainer from './IndexContainer/IndexContainer.jsx';
// import {HttpClient} from "../common/HttpClient";
import './App.css';

//首页
export default class App extends Component {

    constructor (props) {
        super(props);
        this.state = {}
    }

    componentWillMount () {
    }

    componentDidMount () {
        window.LOGO_SRC = require('@static/images/logo_unicom.png');
    }

    componentWillUnmount () {
    }


    render () {
        let pathname = this.props.location.pathname.toLocaleLowerCase();
        let isLoginPage = pathname === '/login' || pathname === '/resetpassword';
        return (
            <LocaleProvider locale={zh_CN}>{
                isLoginPage ? this.props.children :
                    <IndexContainer routes={this.props.routes} children={this.props.children}/>
            }</LocaleProvider>
        )
    }
}
