import React, {Component} from 'react';
import {Breadcrumb} from 'antd';
import {Link} from 'react-router';
import _ from 'lodash';
import routes from '@/config/routes.jsx';

export default class GreyBreadcrumb extends Component {

    state = {
        totalPathList: []
    };

    componentWillMount() {

    }

    componentDidMount() {
        let pathList = [];
        if (routes) {
            const routesLoop = (routeList) => {
                routeList.forEach(route => {
                    if (route.props && route.props.breadcrumbName) {
                        pathList.push({
                            name: route.props.breadcrumbName,
                            path: route.props.path,
                            isLink: route.props.isLink || typeof route.props.component === 'function'
                        });
                        if (route.props.children) {
                            if (_.isArray(route.props.children)) {
                                routesLoop(route.props.children)
                            }else {
                                routesLoop([route.props.children])
                            }
                        }
                    }
                })
            };
            routesLoop(routes.props.children);
            this.setState({
                totalPathList: pathList
            });
        }
    }


    render() {
        const { totalPathList } = this.state;
        let pathHash = window.location.hash.split('?')[0];
        let pathArr = _.split(pathHash, '/');
        const getBreadName = (path, i, pathArr) => {
            let index = _.findIndex(totalPathList, function (o) {
                return o.path.toLowerCase() === path.toLowerCase();
            });
            if (index > -1) {
                if (i === 1 || i === pathArr.length - 1) {
                    return <Breadcrumb.Item key={i}>{totalPathList[index].name}</Breadcrumb.Item>;
                } else {
                    if (!totalPathList[index].isLink) {
                        return <Breadcrumb.Item key={i}>{totalPathList[index].name}</Breadcrumb.Item>;
                    }
                    let url = "";
                    for (let j = i; j > 0; j--) {
                        url = "/" + pathArr[j] + url;
                    }
                    return <Breadcrumb.Item key={i}><Link to={url}>{totalPathList[index].name}</Link></Breadcrumb.Item>;
                }
            } else {
                return null;
            }
        };
        return (
            <Breadcrumb style={{ padding: '16px 32px 0 32px', background: "white" }}>
                {pathArr.map((path, i) => getBreadName(path, i, pathArr))}
            </Breadcrumb>
        )
    }


}
