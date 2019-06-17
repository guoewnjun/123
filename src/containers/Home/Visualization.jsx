import React, {Component, Suspense, lazy} from 'react';
import {Icon, Tabs, Spin} from 'antd';
import './Visualization.css';
import _ from 'lodash';
import {HttpClient} from "@/common/HttpClient";

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
                                this.cityBerthMarker.setPosition(new window.AMap.LngLat(data.longitude, data.latitude));
                                this.cityBerthMarker.setContent(markerContent);
                                this.cityBerthMarker.setMap(this.mapInstance);
                                this.cityBerthMarker.show();
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
                } else if (13 <= zoom && zoom <= 16) { //片区
                    this.cityBerthMarker.hide();
                    this.districtMarkerGroup.hide();
                    this.streetMarkerGroup.hide();
                    if (this.areaMarkerGroup.getOverlays().length > 0) {
                        this.areaMarkerGroup.show();
                    } else {
                        const params = { areaType: 'subArea', cityCode: window.cityCode };
                        this.getBerthOnMap(params)
                    }
                } else if (zoom >= 17) { //街道
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
                const markers = [];
                data.forEach(item => {
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
                    if (params.areaType === 'parking') {
                        marker.on('click', () => {
                            location.hash = `Home/Visualization/BerthDetails?id=${item.areaCode}`
                        })
                    }
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
                } else if (13 <= zoom && zoom <= 16) { //片区
                    this.districtMarkerGroup.hide();
                    this.areaMarkerGroup.show();
                    this.streetMarkerGroup.hide();
                } else if (zoom >= 17) { //街道
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
            }else {
                this.getDevice(null);
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
        const deviceType = ['dici', 'wifi', 'zhongjiqi'];
        const deviceStatus = ['blue', 'red', 'green'];
        HttpClient.query('/visualization/device', 'GET', params, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data;
                const markers = [];
                data.forEach(item => {
                    const marker = new window.AMap.Marker({
                        position: new window.AMap.LngLat(item.location[0], item.location[1]),
                        topWhenClick: true,
                        icon: new window.AMap.Icon({
                            image: `./resources/mapIcons/${deviceType[item.device_type]}_${deviceStatus[item.statu]}.png`,
                            imageSize: new window.AMap.Size(30, 30),
                        }),
                        extData: item
                    });
                    const infoWindow = new window.AMap.InfoWindow({
                        autoMove: true,
                        offset: new window.AMap.Pixel(8, -30)
                    });

                    marker.on('click', (e) => {
                        //构建信息窗体中显示的内容
                        const extData = e.target.C.extData;
                        const info = `<div style="max-width: 500px; padding: 10px">
                                    <p>坐标 : ${extData.location[0]}，${extData.location[1]}</p>
                                    <p>地址 :北京市朝阳区望京阜荣街10号首开广场4层</p>
                                </div>`;
                        infoWindow.setContent(info);
                        infoWindow.open(this.mapInstance, e.target.C.position);
                    });
                    markers.push(marker)
                });
                this.deviceMarkerGroup.addOverlays(markers);
                this.deviceMarkerGroup.setMap(this.mapInstance)
            }
        })
    }

    // 设备复选框change事件
    checkBoxChange(values) {
        this.deviceParams.status = values;
        this.deviceParams = this.filterParams(this.deviceParams);
        this.getDevice(this.deviceParams)
    }

    // 选择设备类型
    selectDeviceType(value) {
        this.deviceParams.type = value;
        this.deviceParams = this.filterParams(this.deviceParams);
        this.getDevice(this.deviceParams)
    }

    // 选择设备片区
    selectArea(value) {
        this.deviceParams.area = value;
        this.deviceParams = this.filterParams(this.deviceParams);
        this.getDevice(this.deviceParams)
    }

    // 选择设备行政区
    selectDistrict(value) {
        this.deviceParams.district = value;
        this.deviceParams = this.filterParams(this.deviceParams);
        this.getDevice(this.deviceParams)
    }

    // 获取在线地图人员
    getUsersOnMap() {
        HttpClient.query(`${window.MODULE_PARKING_INSPECTION}/monitoringCenter/${window.cityCode}/getInspectionMembersByAreaId`, 'GET', null, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data;
                const markers = [];
                data.forEach((item, index) => {
                    let markerContent = `<div style="display: flex; justify-content: center; flex-direction: column; align-items: center">
                            <div class=''><img style="width: 30px; height: 30px;" src=${item.imageUrl} /></div>
                        </div>`;
                    const marker = new window.AMap.Marker({
                        position: new window.AMap.LngLat(item.signLongitude, item.signLatitude),
                        content: markerContent,
                        topWhenClick: true,
                        extData: item
                    });
                    marker.on('click', () => {
                        location.hash = `/Home/Visualization/UserDetail?id=${item.userId}`
                    });
                    markers.push(marker);
                });
                this.usersMarkerGroup.addOverlays(markers);
                this.usersMarkerGroup.setMap(this.mapInstance)
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
                                                <Berth/>
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
                                                    selectDeviceType={this.selectDeviceType.bind(this)}
                                                    selectArea={this.selectArea.bind(this)}
                                                    selectDistrict={this.selectDistrict.bind(this)}
                                                    checkBoxChange={this.checkBoxChange.bind(this)}/>
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
