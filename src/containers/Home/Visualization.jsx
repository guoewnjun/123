import React, {Component, Suspense, lazy} from 'react';
import {Icon, Tabs, Spin, message} from 'antd';
import './Visualization.css';
import _ from 'lodash';
import {HttpClient} from "@/common/HttpClient";
import $ from 'jquery';
import moment from 'moment';

const Berth = lazy(() => import('./Components/VisualizationBerth'));
const Users = lazy(() => import('./Components/VisualizationUsers'));
const Devices = lazy(() => import('./Components/VisualizationDevices'));

export default class Visualization extends Component {
    constructor(props) {
        super(props);
        this.mapInstance = null;
        this.checkPoints = [
            { lnglat: [111.320542, 23.472962], address: '万秀区', streets: 97, berths: 300 },
            { lnglat: [111.274777, 23.485695], address: '长洲区', streets: 122, berths: 350 },
            { lnglat: [111.246035, 23.40996], address: '龙圩区', streets: 136, berths: 535 },
        ];
        this.cityBerthMarker = new window.AMap.Marker({ topWhenClick: true });
        this.districtMarkerGroup = new window.AMap.OverlayGroup();
        this.areaMarkerGroup = new window.AMap.OverlayGroup();
        this.streetMarkerGroup = new window.AMap.OverlayGroup();

        this.deviceMarkerGroup = new window.AMap.OverlayGroup();
        this.usersMarkerGroup = new window.AMap.OverlayGroup();
        this.deviceParams = {};
        this.state = {
            spinning: false,
            currentTab: '1',
            isToggle: true,
            checkPointsInfo: '南山区：97个路段',
            areaBerthData: [], //片区泊位数据
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        this.mapInstance = new window.AMap.Map('mapContainer', {
            resizeEnable: true,
            // center: new window.AMap.LngLat(111.297604, 23.474803),
            zoom: 11,
            showIndoorMap: true
        });
        window.AMap.plugin('AMap.Geolocation', () => {
            const geolocation = new window.AMap.Geolocation({
                // enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：5s
                showButton: false,
                zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

            });
            this.mapInstance.addControl(geolocation);
        });
        this.getBerthOnMap({ areaType: 'area', cityCode: window.cityCode });
        // 地图缩放事件
        this.mapInstance.on('zoomend', () => {
            if (this.state.currentTab === '1') {
                const zoom = this.mapInstance.getZoom();
                if (8 <= zoom && zoom <= 9) { //市级
                    if (this.cityBerthMarker.getPosition()) {
                        this.cityBerthMarker.show();
                    } else {
                        // 获取市区泊位，并添加到地图上
                        HttpClient.query('/parking-resource/admin/parking/road/space/count', 'GET', {
                            areaType: 'area',
                            cityCode: window.cityCode
                        }, (d, type) => {
                            if (type === HttpClient.requestSuccess) {
                                const data = d.data;
                                let markerContent = `<div style="display: flex; justify-content: center; flex-direction: column; align-items: center">
                                                        <div class='markerLngLat'></div>
                                                        <span class='markerContent'>${data.areaName}：${data.count}个泊位</span>
                                                     </div>`;
                                const cityCenter = new window.AMap.LngLat(data.longitude, data.latitude);
                                this.cityBerthMarker.setPosition(cityCenter);
                                this.cityBerthMarker.setContent(markerContent);
                                this.cityBerthMarker.setMap(this.mapInstance);
                                this.cityBerthMarker.show();
                                this.cityBerthMarker.on('click', () => {
                                    this.mapInstance.setZoomAndCenter(11, cityCenter)
                                })
                            }
                        });
                    }
                    this.districtMarkerGroup.hide();
                    this.areaMarkerGroup.hide();
                    this.streetMarkerGroup.hide();
                } else if (10 <= zoom && zoom <= 12) { //行政区
                    this.cityBerthMarker.hide();
                    this.areaMarkerGroup.hide();
                    this.streetMarkerGroup.hide();
                    if (this.districtMarkerGroup.getOverlays().length > 0) {
                        this.districtMarkerGroup.show();
                    } else {
                        const params = { areaType: 'area', cityCode: window.cityCode };
                        this.getBerthOnMap(params)
                    }
                } else if (13 <= zoom && zoom <= 14) { //片区
                    this.cityBerthMarker.hide();
                    this.districtMarkerGroup.hide();
                    this.streetMarkerGroup.hide();
                    if (this.areaMarkerGroup.getOverlays().length > 0) {
                        this.areaMarkerGroup.show();
                    } else {
                        const params = { areaType: 'subArea', cityCode: window.cityCode };
                        this.getBerthOnMap(params)
                    }
                } else if (zoom >= 15) { //街道
                    this.cityBerthMarker.hide();
                    this.districtMarkerGroup.hide();
                    this.areaMarkerGroup.hide();
                    if (this.streetMarkerGroup.getOverlays().length > 0) {
                        this.streetMarkerGroup.show();
                    } else {
                        const params = { areaType: 'parking', cityCode: window.cityCode };
                        this.getBerthOnMap(params)
                    }
                }
            }
        });
        // 比例尺插件
        this.mapInstance.plugin(["AMap.Scale"], () => {
            const scale = new window.AMap.Scale({
                position: 'RB'
            });
            this.mapInstance.addControl(scale);
        });
    }

    // 获取地图上的泊位数据
    getBerthOnMap(params) {
        this.setState({
            spinning: true
        });
        HttpClient.query('/parking-resource/admin/parking/road/space/count', 'GET', params, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data.list;
                if (data && !data.length) {
                    message.info('暂无数据')
                }
                const markers = [];
                data && data.forEach(item => {
                    let markerContent = `<div style="display: flex; justify-content: center; flex-direction: column; align-items: center">
                            <div class='markerLngLat'></div>
                            <span class='markerContent'>${item.areaName}：${item.count}个泊位</span>
                        </div>`;
                    const marker = new window.AMap.Marker({
                        position: new window.AMap.LngLat(item.longitude, item.latitude),
                        content: markerContent,
                        topWhenClick: true,
                        extData: item
                    });
                    marker.on('click', () => {
                        switch (params.areaType) {
                            case 'area':
                                this.mapInstance.setZoomAndCenter(14, new window.AMap.LngLat(item.longitude, item.latitude));
                                break;
                            case 'subArea':
                                this.mapInstance.setZoomAndCenter(15, new window.AMap.LngLat(item.longitude, item.latitude));
                                break;
                            default:
                                location.hash = `${location.hash}/BerthDetails?id=${item.areaCode}&areaName=${item.areaName}`;
                        }
                    });
                    markers.push(marker)
                });
                if (params.areaType === 'area') {
                    this.districtMarkerGroup.addOverlays(markers);
                    this.districtMarkerGroup.setMap(this.mapInstance);
                } else if (params.areaType === 'subArea') {
                    this.areaMarkerGroup.addOverlays(markers);
                    this.areaMarkerGroup.setMap(this.mapInstance)
                } else {
                    this.streetMarkerGroup.addOverlays(markers);
                    this.streetMarkerGroup.setMap(this.mapInstance)
                }
            }
            this.setState({
                spinning: false
            });
        });
    }

    // 隐藏或显示地图上的泊位数据
    showOrHideBerthOnMap(hide = true) {
        if (hide) {
            this.cityBerthMarker.hide();
            this.districtMarkerGroup.hide();
            this.areaMarkerGroup.hide();
            this.streetMarkerGroup.hide();
        } else {
            // this.cityBerthMarker.show();
            if (this.mapInstance) {
                const zoom = this.mapInstance.getZoom();
                if (8 <= zoom && zoom <= 9) { //市级
                    this.districtMarkerGroup.hide();
                    this.areaMarkerGroup.hide();
                    this.streetMarkerGroup.hide();
                } else if (10 <= zoom && zoom <= 12) { //行政区
                    this.areaMarkerGroup.hide();
                    this.streetMarkerGroup.hide();
                    this.districtMarkerGroup.show();
                } else if (13 <= zoom && zoom <= 14) { //片区
                    this.districtMarkerGroup.hide();
                    this.areaMarkerGroup.show();
                    this.streetMarkerGroup.hide();
                } else if (zoom >= 15) { //街道
                    this.districtMarkerGroup.hide();
                    this.areaMarkerGroup.hide();
                    this.streetMarkerGroup.show();
                }
            }
        }
    }

    // 组件卸载之前
    componentWillUnmount() {
        this.mapInstance.destroy()
    }

    // 控制面板tab标签变化事件
    panelTabChange(activeKey) {
        this.setState({
            currentTab: activeKey
        });
        this.mapInstance.clearInfoWindow();
        if (activeKey === '1') { // 泊位
            this.deviceMarkerGroup.hide();
            this.usersMarkerGroup.hide();
        } else if (activeKey === '2') { // 人员
            this.deviceMarkerGroup.hide();
            if (this.usersMarkerGroup.getOverlays().length > 0) {
                this.usersMarkerGroup.show();
                return
            }
            this.getUsersOnMap();
        } else if (activeKey === '3') { // 设备
            this.usersMarkerGroup.hide();
            if (this.deviceMarkerGroup.getOverlays().length > 0) {
                this.deviceMarkerGroup.show();
            } else {
                this.mapInstance.plugin(["AMap.DistrictSearch"], () => {
                    new window.AMap.DistrictSearch({
                        extensions: 'all',
                        subdistrict: 0
                    }).search(window.cityCode, (status, result) => {
                        const center = result.districtList[0].center;
                        let deviceParams = {};
                        deviceParams.geo_longlat = JSON.stringify([center.lng, center.lat]);
                        this.getDevice(deviceParams);
                    })
                });
            }
        }
    }

    //控制面板的显示隐藏
    panelToggle() {
        this.setState({
            isToggle: !this.state.isToggle
        })
    }

    // 获取设备
    getDevice(params) {
        this.deviceMarkerGroup.clearOverlays();
        HttpClient.query('https://iotdev.triplego.cn/admin/devices', 'GET', params, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                if (d.ack_code === 'ok') {
                    const data = d.data;
                    const markers = [];
                    data.forEach(item => {
                        const srcUrl = `./resources/mapIcons/${item.sub_type}_${item.device_status}.png`;
                        let markerContent = `<div style="display: flex; justify-content: center; flex-direction: column; align-items: center">
                            <div><img style="width: 40px; height: 40px; border-radius: 50%" src=${srcUrl} /></div>
                        </div>`;
                        const marker = new window.AMap.Marker({
                            position: new window.AMap.LngLat(item.geo_longlat[0], item.geo_longlat[1]),
                            topWhenClick: true,
                            content: markerContent,
                            extData: item
                        });

                        marker.on('click', (e) => {
                            //构建信息窗体中显示的内容
                            const extData = e.target.C.extData;
                            this.onClickDeviceMarker(extData, e.target.C.position);
                        });
                        markers.push(marker)
                    });
                    this.deviceMarkerGroup.addOverlays(markers);
                    this.deviceMarkerGroup.setMap(this.mapInstance)
                }
            }
        });
    }

    // 点击设备图标
    onClickDeviceMarker(extData, infoWindowPosition) {
        const device_type = {
            GMG: '地磁',
            NBGMG: 'NB-地磁',
            UWB: '超宽带射频定位',
            CAM: '视频',
            HCAM: '高位视频',
            UWBCAM: '超宽带定位+视频',
            USON: '超声波'
        };
        if (!extData.activated) {
            message.warning('该设备未激活');
            return;
        }
        if (!extData.device_id) {
            message.warning('未找到该设备id');
            return
        }
        const params = {
            device_id: extData.device_id
        };
        const infoWindow = new window.AMap.InfoWindow({
            autoMove: true,
            offset: new window.AMap.Pixel(8, -30)
        });
        const loadingInfo = `<div class="ant-spin-nested-loading" style="max-width: 500px; min-width: 200px; padding: 20px">
                                <div>
                                    <div class="ant-spin ant-spin-spinning ant-spin-show-text">
                                        <span class="ant-spin-dot ant-spin-dot-spin">
                                            <i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i>
                                            <i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i>
                                        </span>
                                        <div class="ant-spin-text">加载中...</div>
                                    </div>
                                </div>
                            </div>`;
        infoWindow.setContent(loadingInfo);
        infoWindow.open(this.mapInstance, infoWindowPosition);
        HttpClient.query('https://iotdev.triplego.cn/admin/monitor', 'GET', params, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                if (d.ack_code === 'ok') {
                    const info = `<div style="width: 260px; padding: 20px">
                           <p>设备类型：${d.device_type ? device_type[d.device_type] : ''}</p>
                           <p>设备型号：${d.device_model || ''}</p>
                           <p>硬件ID：${d.hardware_id || ''}</p>
                           <p>设备厂家：${d.device_vendor || ''}</p>
                           <p>坐标：${d.monitor_status ? d.monitor_status.geo_longlat.join(',') : ''}</p>
                           <p>设备电量：${d.monitor_status ? d.monitor_status.battery : ''}</p>
                           <p>设备温度：${d.monitor_status ? d.monitor_status.temperature : ''}</p>
                           <p>设备状态：${d.device_status || ''}</p>
                           <p>最后状态更新时间：${d.time_created ? moment(d.time_created).format('YYYY-MM-DD HH:mm:ss') : ''}</p>
                      </div>`;
                    infoWindow.setContent(info);
                }
            } else if (type === HttpClient.requestServiceError) {
                infoWindow.close();
            }
        });
    }

    // 设备查询
    searchDevice(values) {
        this.deviceParams = this.filterParams(values);
        if (Object.keys(this.deviceParams).length === 0) {
            message.warning('请选择区域或者片区');
            return
        }
        if (this.deviceParams.areaCode && !this.deviceParams.geo_longlat) { //只选了区域
            this.mapInstance.plugin(["AMap.DistrictSearch"], () => {
                new window.AMap.DistrictSearch({
                    extensions: 'all',
                    subdistrict: 0
                }).search(this.deviceParams.areaCode, (status, result) => {
                    const center = result.districtList[0].center;
                    this.deviceParams.geo_longlat = JSON.stringify([center.lng, center.lat]);
                    this.getDevice(this.deviceParams);
                })
            });
        } else { // 选择了片区
            this.getDevice(this.deviceParams)
        }
    }

    // 获取在线地图人员
    getUsersOnMap() {
        this.setState({
            spinning: true
        });
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/monitoringCenter/${window.cityCode}/getInspectionMembersByAreaId`, 'GET', { areaType: 'city' }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                // TODO 当多个人员坐标一样时，显示一个tooltip，内容为人员名称
                const data = d.data || [];
                const markers = [];
                data.forEach((item, index) => {
                    let markerContent = `<div style="display: flex; justify-content: center; flex-direction: column; align-items: center">
                            <div><img style="width: 40px; height: 40px; border-radius: 50%" src=${item.imageUrl || './resources/mapIcons/userAvatar.png'} /></div>
                        </div>`;
                    if (item.signLatitude && item.signLongitude) {
                        const marker = new window.AMap.Marker({
                            position: new window.AMap.LngLat(item.signLongitude, item.signLatitude),
                            content: markerContent,
                            topWhenClick: true,
                            extData: item
                        });
                        marker.on('click', () => {
                            location.hash = `${location.hash}/UserDetail?id=${item.userId}`
                        });
                        markers.push(marker);
                    }
                });
                this.usersMarkerGroup.addOverlays(markers);
                this.usersMarkerGroup.setMap(this.mapInstance);
                this.setState({
                    spinning: false
                });
            }
        })
    }

    filterParams(params) {
        const newParams = {};
        _.forIn(params, (value, key) => {
            if (value || value === 0) {
                newParams[key] = value
            }
        });
        return newParams
    }

    // 泊位--缩放到路段
    zoomInRoad(value) {
        if (value.longitude && value.latitude) {
            this.mapInstance.setZoomAndCenter(18, new window.AMap.LngLat(value.longitude, value.latitude));
        } else {
            message.warning('该路段暂无坐标')
        }
    }

    render() {
        const { isToggle, currentTab, spinning } = this.state;
        const TabPane = Tabs.TabPane;
        if (currentTab === '1') {
            this.showOrHideBerthOnMap(false)
        } else {
            this.showOrHideBerthOnMap(true)
        }
        return (
            <div className='page'>
                <div className='page-header'>
                    <div>可视化监控</div>
                </div>
                <div className='page-content' style={{ padding: 0 }}>
                    <Spin spinning={spinning} tip='加载中...'>
                        <div id='mapContainer'
                             style={{
                                 height: 'calc(100vh - 64px - 100px - 80px)',
                                 width: '100%',
                                 position: 'relative'
                             }}>
                            <div className='visualPanel' style={isToggle ? { left: 10 } : { left: -300 }}>
                                <div style={{
                                    width: 300,
                                    height: 'calc(100vh - 64px - 100px - 80px - 20px)',
                                    float: 'left',
                                    background: 'white',
                                    marginRight: 10,
                                    padding: '0 15px'
                                }}>
                                    <Tabs defaultActiveKey="1" onChange={this.panelTabChange.bind(this)}>
                                        <TabPane tab="泊位" key="1">
                                            <Suspense fallback={null}>
                                                <Berth zoomInRoad={this.zoomInRoad.bind(this)}/>
                                            </Suspense>
                                        </TabPane>
                                        <TabPane tab="人员" key="2">
                                            <Suspense fallback={null}>
                                                <Users usersList={[]}/>
                                            </Suspense>
                                        </TabPane>
                                        <TabPane tab="设备" key="3">
                                            <Suspense fallback={null}>
                                                <Devices
                                                    searchDevice={this.searchDevice.bind(this)}/>
                                            </Suspense>
                                        </TabPane>
                                    </Tabs>
                                </div>
                                <Icon type="bars" style={{ fontSize: '24px', color: 'rgb(0,140,255)' }}
                                      onClick={this.panelToggle.bind(this)}/>
                            </div>
                        </div>
                    </Spin>
                </div>
            </div>
        );
    }
}
