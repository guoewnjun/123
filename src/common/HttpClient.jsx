import $ from 'jquery';
import {message} from 'antd';
import {getQueryString} from './SystemFunction';

export const HttpClient = (function () {
    const REQUEST = "truth";

    const requestSuccess = 0;
    const requestDataError = 1;
    const requestServiceError = 2;

    //获取请求host
    let httpClientHost = '';

    switch (process.env.NODE_ENV) {
        case "development":
            httpClientHost = 'http://test01.triplego.cn:9527'; //测试主机
            break;
        case "production":
            // httpClientHost = 'https://tripark.triplego.cn/api';
            httpClientHost = 'http://test01.triplego.cn:9527'; //测试主机
            break;
        default:
            break;
    }

    function query(url, rtype, data, callback, contentType = 'application/json;charset=UTF-8', processData = true) {
        if (process.env.NODE_ENV === 'development') {
            // console.log(location.hash.split('?')[1]);
            if (location.hash.split('?')[1] && getQueryString(location.hash.split('?')[1], 'isMock') === 'true') {
                httpClientHost = 'https://www.easy-mock.com/mock/5cd0f2f3682f200251f31dd3/immidiot';
            } else if (location.hash.split('?')[1] && getQueryString(location.hash.split('?')[1], 'isDebug') === 'true') {
                httpClientHost = '127.123.25:9090';
            }
        }
        let headers = null;
        let header_token = null;
        if ((url === window.MODULE_PARKING_AUTHORITY + '/admin/token') || (url === window.MODULE_PARKING_AUTHORITY + '/configureInfo/getLogoConfig')) { // 判断是否是登录接口
            header_token = "Basic Y29uc29sZTpjb25zb2xl";
        } else {
            let access_token = window.customCookie.get('access_token') || '';
            header_token = "Bearer " + access_token;
        }
        headers = { "Authorization": header_token };
        // console.log(REQUEST + "--" + httpClientHost + url + "--Params:", data);
        $(function () {
            $.ajax({
                "url": httpClientHost + url,
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
                },
                error: function (e) {
                    //服务异常
                    console.error(REQUEST + "--" + url + "--Error:", e);
                    message.error("服务器异常！");
                    callback(e, requestServiceError);
                }
            });
        })
    }

    return {
        ClientHost: httpClientHost,
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
