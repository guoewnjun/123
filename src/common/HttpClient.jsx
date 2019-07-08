import $ from 'jquery';
import {message} from 'antd';
import moment from 'moment';

export const HttpClient = (function () {
    const REQUEST = "truth";

    const requestSuccess = 0;
    const requestDataError = 1;
    const requestServiceError = 2;

    //获取请求host
    let baseUrl = '';

    switch (process.env.NODE_ENV) {
        case "development":
            baseUrl = 'http://test01.triplego.cn/api'; //测试主机
            // baseUrl = 'https://tripark.triplego.cn/api';
            break;
        case "production":
            // baseUrl = 'http://yingshi.triplego.cn/api';
            baseUrl = 'http://test01.triplego.cn/api'; //测试主机
            break;
        default:
            break;
    }

    function query(url, rtype, data, callback, contentType = 'application/json;charset=UTF-8', processData = true) {
        let headers = null;
        let header_token = null;
        const isLogin = (url.indexOf(window.MODULE_PARKING_AUTHORITY + '/admin/token') > -1) ||
            (url.indexOf(window.MODULE_PARKING_AUTHORITY + '/configureInfo/getLogoConfig') > -1);
        if (isLogin) { // 判断是否是登录接口
            header_token = "Basic Y29uc29sZTpjb25zb2xl";
        }else {
            let access_token = window.customCookie.get('access_token') || '';
            header_token = "Bearer " + access_token;
        }
        headers = { "Authorization": header_token };
        if ((url.indexOf(window.MODULE_PARKING_AUTHORITY + '/admin/address/getVerificationCode') > -1)) {
            headers = null
        }
        let httpUrl = '';
        if (url.indexOf('http') > -1) {
            httpUrl = url;
            // 中间件接口，增加几个公共参数
            if (url.indexOf('https://iotdev.triplego.cn/') > -1) {
                if (!data.service) {
                    data.service = url.substring((url.indexOf('cn/') + 3)).replace(/\//g, '.').replace(/(.\d+)/g, '');
                }
                data.version = '2.0';
                data.timestamp = +moment();
            }
        } else if (url.indexOf('easy-mock') > -1) {
            httpUrl = url.replace(/easy-mock/, 'https://www.easy-mock.com/mock/5cd0f2f3682f200251f31dd3/immidiot');
        } else {
            httpUrl = baseUrl + url
        }
        $(function () {
            $.ajax({
                "url": httpUrl,
                "async": true,
                "cache": false,
                "method": rtype,
                "data": data,
                "processData": processData,
                "dataType": 'json',
                "contentType": contentType,
                "xhrFields": {
                    "withCredentials": true,
                },
                "headers": headers,
                timeout: 40000,
                "crossDomain": true,
                success: function (d) {
                    if (url.indexOf('iotdev') > -1) {
                        if (d.ack_code === 'ok') {
                            callback(d, requestSuccess)
                        } else {
                            message.error(d.err_msg);
                            callback(d, requestDataError);
                        }
                    } else {
                        if (d.success) {
                            callback(d, requestSuccess);
                        } else {
                            console.error('success=false: ', url);
                            //可以处理d.error.code
                            if (d.error.code === 10014 || d.error.code === 10015) {// 登录失效 || 用户不存在
                                window.isInvalidToLogin = true;
                                sessionStorage.clear();
                                localStorage.clear();
                                window.setPageMenu([]);
                                window.setPermission({});
                                window.setManagePartnerList([]);
                                window.currentIsSystemAdmin = false;
                                if (d.error.code === 10014) {
                                    location.hash = '/Login';
                                } else {
                                    callback(d, requestSuccess);
                                    const hash = location.hash;
                                    if (!hash.match('Login')) {
                                        location.hash = '/Login';
                                    }
                                }
                            } else {
                                message.error(d.error.message);
                                callback(d, requestDataError);
                            }
                        }
                    }
                },
                error: function (e) {
                    //服务异常
                    console.error(REQUEST + "--" + url + "--Error:", e);
                    if (e.status === 500) {
                        message.error(e.responseJSON.message)
                    } else {
                        message.error("服务器异常！");
                    }
                    callback(e, requestServiceError);
                }
            });
        })
    }

    return {
        ClientHost: baseUrl,
        GET: 'GET',
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE",
        requestSuccess: requestSuccess,
        requestDataError: requestDataError,
        requestServiceError: requestServiceError,
        query: query,
        REQUEST: REQUEST
    }
}());
