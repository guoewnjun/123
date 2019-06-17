import React, {Component, Fragment} from 'react';
import {Button, Icon} from 'antd';
import {HttpClient} from "@/common/HttpClient";

export default class MapofToday extends Component {
    constructor(props) {
        super(props);
        this.mapInstance = null;
        this.trafficLayer = null;
        this.polygonOverlay = new window.AMap.OverlayGroup();
        this.state = {
            isGeoJsonMap: true,
        };
    }

    // 组件挂载之前
    componentWillMount() {
    }

    // 组件挂载后
    componentDidMount() {
        this.mapInstance = new window.AMap.Map('mapContainer', {
            resizeEnable: true,
            zoom: 10,
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
        // 生成市行政区
        HttpClient.query('/parking-report/report/road/today/space/ratation', 'GET', { cityCode: window.cityCode }, (d, type) => {
            if (type === HttpClient.requestSuccess) {
                const data = d.data;
                data.forEach(item => {
                    this.getDistrict(item);
                });
            }
            this.polygonOverlay.setMap(this.mapInstance);
        });
        //实时路况图层
        this.trafficLayer = new window.AMap.TileLayer.Traffic({
            zIndex: 10
        });
    }

    getDistrict(districtInfo) {
        // 地图插件
        this.mapInstance.plugin(["AMap.DistrictSearch"], () => {
            new window.AMap.DistrictSearch({
                extensions: 'all',
                // subdistrict: 0
            }).search(districtInfo.areaCode, (status, result) => {
                // console.log(result);
                let holes = result.districtList[0].boundaries;
                let polygon = new window.AMap.Polygon({
                    path: holes,
                    strokeColor: 'white',
                    strokeWeight: 1,
                    fillColor: 'red',
                    fillOpacity: districtInfo.saturation
                });
                this.polygonOverlay.addOverlay(polygon);
                // this.mapInstance.add(polygon);
                this.mapInstance.setCenter(result.districtList[0].center)
            })
        });
    }

    // 组件卸载之前
    componentWillUnmount() {
        this.mapInstance.destroy()
    }

    mapToggle(code) {
        if (code) { // 路况
            if (this.polygonOverlay.getOverlays().length > 0) {
                this.polygonOverlay.hide();
            }
            this.setState({
                isGeoJsonMap: false
            });
            this.trafficLayer.setMap(this.mapInstance);
        } else {
            if (this.trafficLayer) {
                this.trafficLayer.setMap(null);
            }
            this.setState({
                isGeoJsonMap: true
            });
            this.polygonOverlay.show();
        }
    }

    render() {
        const { isGeoJsonMap } = this.state;
        const MyIcon = Icon.createFromIconfontCN({
            scriptUrl: '//at.alicdn.com/t/font_1180595_z33n9kulk9g.js', // 在 iconfont.cn 上生成
        });
        return (
            <div id='mapContainer' style={{ height: 370, width: '100%', position: 'relative' }}>
                {/*百分比*/}
                <div style={{
                    position: 'absolute',
                    zIndex: 100,
                    top: 10,
                    padding: '0 10px',
                    left: 'calc(50% - 70px)',
                    background: 'white'
                }}>{isGeoJsonMap ? '各区车位使用情况分布' : '实时交通路况图'}</div>
                {
                    isGeoJsonMap && (
                        <Fragment>
                            <div style={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                zIndex: 100,
                                lineHeight: 'initial',
                                background: 'white',
                                padding: '5px 10px'
                            }}>
                                <div>车位占用百分比 <Icon type="heat-map"/></div>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 20,
                                        height: 15,
                                        background: 'rgba(255, 0, 0, 0.2)'
                                    }}/>
                                    <span style={{ marginLeft: 10 }}>0~20%</span>
                                </div>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 20,
                                        height: 15,
                                        background: 'rgba(255, 0, 0, 0.4)'
                                    }}/>
                                    <span style={{ marginLeft: 10 }}>20~40%</span>
                                </div>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 20,
                                        height: 15,
                                        background: 'rgba(255, 0, 0, 0.6)'
                                    }}/>
                                    <span style={{ marginLeft: 10 }}>40~60%</span>
                                </div>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 20,
                                        height: 15,
                                        background: 'rgba(255, 0, 0, 0.8)'
                                    }}/>
                                    <span style={{ marginLeft: 10 }}>60~80%</span>
                                </div>
                                <div>
                                    <span style={{
                                        display: 'inline-block',
                                        width: 20,
                                        height: 15,
                                        background: 'rgba(255, 0, 0, 1)'
                                    }}/>
                                    <span style={{ marginLeft: 10 }}>80~100%</span>
                                </div>
                            </div>
                        </Fragment>
                    )
                }
                {/*地图切换*/}
                <div style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 100,
                    lineHeight: 'initial',
                    padding: '5px 10px'
                }}>
                    <Button title='车位占用比地图' type='primary' onClick={this.mapToggle.bind(this, 0)}
                            style={{ marginRight: 10 }}><MyIcon type='iconMapicon'
                                                                style={{ color: 'white', fontSize: '16px' }}/></Button>
                    <Button title='实时路况图' type='primary' onClick={this.mapToggle.bind(this, 1)}><MyIcon
                        type='iconlukuang' style={{ color: 'white', fontSize: '16px' }}/></Button>
                </div>
            </div>
        );
    }
}
