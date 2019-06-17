import React from 'react';
import _ from 'lodash';
import {Route, IndexRedirect, IndexRoute} from 'react-router';
import App from '../containers/App.jsx';

// import Index from '../containers/IndexContainer/IndexContainer.jsx';
// import AnalysisIndexContainer from "../containers/Home/AnalysisIndexContainer.jsx";//统计分析
// import AnalysisDetailContainer from "../containers/Home/AnalysisDetailContainer.jsx";//泊位图
import LoginContainer from '../containers/LoginContainer/LoginContainer.jsx'; //登录页
import ResetPassword from '../containers/LoginContainer/ResetPassword.jsx'; //修改密码
import PartnerList from '../containers/PartnerManage/PartnerListContainer.jsx';//合作方列表
import NewPartner from '../containers/PartnerManage/NewPartner.jsx';//新建合作方
import UpdatePartner from '../containers/PartnerManage/UpdatePartner.jsx';//编辑合作方
import PartnerDetail from '../containers/PartnerManage/PartnerDetail.jsx';//合作方详情
import PartnerAccounts from '../containers/PartnerManage/PartnerAccounts.jsx';//合作方主账号
// import PartnerOrganization from '../containers/PartnerManage/PartnerOrganization.jsx';//合作方组织结构

// -----------------------------------------------------------------------------------------------------------------------------

// 监控中心
import Today from "../containers/Home/Today.jsx";//今日数据
import Visualization from '../containers/Home/Visualization'; //可视化页面
import BerthDetails from '../containers/BerthManage/BerthDetails'//泊位详情

// 运营中心
import ParkingRecord from '../containers/OperatingCenter/DealManage/ParkingRecord.jsx';//停车记录
import ParkingRecordDetail from '../containers/OperatingCenter/DealManage/ParkingRecordDetail.jsx';//停车记录详情
import AppealManage from '../containers/OperatingCenter/DealManage/AppealManage.jsx';// 申诉处理
import AppealDetail from '../containers/OperatingCenter/DealManage/AppealDetail.jsx';// 申诉处理详情
import VipList from "../containers/OperatingCenter/VipManage/VipList.jsx";//会员列表
import VipDetails from "../containers/OperatingCenter/VipManage/VipDetails.jsx";//会员详情
// import VipDeleteRecord from "../containers/OperatingCenter/VipDeleteRecordRecord.jsx";//会员注销记录
import ComplaintsList from "../containers/OperatingCenter/ComplaintsList.jsx";//投诉建议
import ComplaintDetails from "../containers/OperatingCenter/ComplaintDetails.jsx";//投诉建议详情及处理
import UserDetail from "../containers/Home/UserDetail"; //人员详情

// 运维中心
import ComplaintWorkOrder from "../containers/OperationsAndCenter/WorkOrder/ComplaintWorkOrder.jsx";//投诉工单
import ComplaintWorkOrderDetails from "../containers/OperationsAndCenter/WorkOrder/ComplaintWorkOrderDetails.jsx";//投诉工单详情
import FacilityMaintenance from "../containers/OperationsAndCenter/WorkOrder/FacilityMaintenance.jsx";//设备维保
import FacilityMaintenanceDetails from "../containers/OperationsAndCenter/WorkOrder/FacilityMaintenanceDetails.jsx";//设备维保详情
import OpinionTemplate from "../containers/OperationsAndCenter/WorkOrder/OpinionTemplate.jsx" //意见模板
import AbnormalDevice from '../containers/OperationsAndCenter/AlarmManage/AbnormalDevice.jsx';// 设备告警
import AbnormalDeviceDetail from '../containers/OperationsAndCenter/AlarmManage/DetailPages/AbnormalDeviceDetail.jsx';// 设备告警详情
import AbnormalParkingAlarm from '../containers/OperationsAndCenter/AlarmManage/AbnormalParkingAlarm.jsx';// 异常停车报警
import AlarmDetail from '../containers/OperationsAndCenter/AlarmManage/DetailPages/AlarmDetail.jsx'; //报警详情
import AbnormalOrderAlarm from '../containers/OperationsAndCenter/AlarmManage/AbnormalOrderAlarm.jsx';//异常订单报警
import OrderAlarmDetail from '../containers/OperationsAndCenter/AlarmManage/DetailPages/OrderAlarmDetail.jsx';//异常订单详情
import AbnormalEventManage from '../containers/OperationsAndCenter/AlarmManage/AbnormalEventManage.jsx';//告警事件管理
import InspectionGroup from '../containers/OperationsAndCenter/InspectionManaage/InspectionGroup.jsx';//稽查组管理
import AddInspectionGroup from '../containers/OperationsAndCenter/InspectionManaage/AddInspectionGroup';//新建稽查组
import EditInspectionGroup from '../containers/OperationsAndCenter/InspectionManaage/EditInspectionGroup.jsx';//编辑稽查组
import ScheduleManage from '../containers/OperationsAndCenter/InspectionManaage/ScheduleManage.jsx';//稽查组管理
import InspectionGroupDetail from '../containers/OperationsAndCenter/InspectionManaage/InspectionGroupDetail.jsx';//稽查组详情
import EditSchedule from '../containers/OperationsAndCenter/InspectionManaage/EditSchedule.jsx';//编辑排班
import CheckInInformation from '../containers/OperationsAndCenter/InspectionManaage/CheckInInformation.jsx';//签到信息

// 配置中心
import BerthSearch from '../containers/ConfigCenter/BerthManage/BerthSearch.jsx'; // 泊位查询
import BerthDetail from '../containers/ConfigCenter/BerthManage/BerthDetail.jsx'; // 泊位详情
import AreaManage from '../containers/ConfigCenter/BerthManage/AreaManage.jsx'; // 片区管理
import BerthTypeManage from '../containers/ConfigCenter/BerthManage/BerthTypeManage.jsx'; // 泊位查询
import SectionResource from '../containers/ConfigCenter/BerthManage/SectionResource.jsx';//路段资源
import SectionDetails from '../containers/ConfigCenter/BerthManage/SectionDetails.jsx';//路段资源
import ChargeRules from '../containers/ConfigCenter/BerthManage/ChargeRules.jsx';//收费规则
import InsertChargeRules from '../containers/ConfigCenter/BerthManage/InsertChargeRules.jsx';//收费规则
import DisplayChargeRules from '../containers/ConfigCenter/BerthManage/DisplayChargeRules.jsx';//收费规则
import EditChargeRules from '../containers/ConfigCenter/BerthManage/EditChargeRules.jsx';//收费规则
import ChargeTimes from '../containers/ConfigCenter/BerthManage/ChargeTimes.jsx'; //收费时段
import ChargeTimesDetails from '../containers/ConfigCenter/BerthManage/ChargeTimesDetails.jsx'//收费时段详情
import InsertChargeTimes from '../containers/ConfigCenter/BerthManage/InsertChargeTimes.jsx'; //新建收费时段
import EditChargeTimes from '../containers/ConfigCenter/BerthManage/EditChargeTimes.jsx'; //编辑收费时段
import BlackList from '../containers/ConfigCenter/RosterManage/BlackList.jsx';//黑名单
import WhiteList from '../containers/ConfigCenter/RosterManage/WhiteList.jsx';//优惠名单
import UserManage from '../containers/ConfigCenter/Organization/UserManage.jsx';//用户管理
import RoleManage from '../containers/ConfigCenter/Organization/RoleManage.jsx';//角色管理
import SquadronManage from '../containers/ConfigCenter/Organization/SquadronManage.jsx';//中队管理
import FinancialAccountParams from '../containers/ConfigCenter/SystemManage/FinancialAccountParams.jsx';//财务账号参数
import BusinessAccountParams from '../containers/ConfigCenter/SystemManage/BusinessAccountParams.jsx';//业务账号参数
import HolidayConfig from '../containers/ConfigCenter/SystemManage/HolidayConfig.jsx';//节假日配置
import CustomerService from '../containers/ConfigCenter/SystemManage/CustomerService';//客服展示页
import CustomerServiceConfig from '../containers/ConfigCenter/SystemManage/CustomerServiceConfig';//客服配置页
import SystemLog from '../containers/ConfigCenter/SystemManage/SystemLog.jsx';//客服配置页

// 数据中心
import UserReport from '../containers/DataCenter/UserReport/Index.jsx'; //用户报表
import DeviceReport from '../containers/DataCenter/DeviceReport/Index.jsx'; //设备报表
import ParkingReport from '../containers/DataCenter/ParkingReport/Index.jsx'; //停车报表
import PatrolReport from '../containers/DataCenter/PatrolReport/'; //巡检报表
import OperationsReport from '../containers/DataCenter/OperationsReport/'; //运维报表
import OperationalDaily from '../containers/DataCenter/OperationalDaily/'; //运营日报
import OperationalWeekly from '../containers/DataCenter/OperationalWeekly/'; //运营周报
import OperationalMonthly from '../containers/DataCenter/OperationalMonthly/'; //运营月报

//财务管理
import InvoicesManage from '../containers/FinancialManage/InvoicesManage.jsx'; //财务管理
import InvoiceDetail from '../containers/FinancialManage/InvoiceDetail.jsx'; //发票详情
import ParkingRevenueAndExpenditureDetails from '../containers/FinancialManage/ParkingRevenueAndExpenditureDetails.jsx'; //停车收支明细
import ParkingRevenueAndExpenditureSummary from '../containers/FinancialManage/ParkingRevenueAndExpenditureSummary.jsx'; //停车收支明细
import MembershipRechargeDetails from '../containers/FinancialManage/MembershipRechargeDetails.jsx'; //会员充值明细
import WalletBalanceInquiry from '../containers/FinancialManage/WalletBalanceInquiry.jsx'; //钱包余额查询
// import FinancialReportsDownload from '../containers/FinancialManage/InspectionChargeList.jsx'; //财报下载

import Page403 from '../containers/ExceptionPage/Page403' // 403页面
import NotMatch from '../containers/ExceptionPage/Page404'

//登录认证
const requireAuth = (nextState, replace) => {
    let cookie = window.customCookie.get('access_token');
    if (window.pageMenu[0] === 0 && !window.checkPageEnable(`/${_.last(nextState.location.pathname.split('/'))}`)) {
        // replace('/403')
    }
    if (cookie) {
        return;
    }
    replace('/Login');
};
export default (
    <Route path="/" component={App}>
        <Route path="Login" component={LoginContainer}/>
        <Route path='ResetPassword' component={ResetPassword}/>
        <IndexRedirect to="/Home/Today"/>

        <Route path="Home" breadcrumbName="监控中心">
            <Route path="Today" breadcrumbName="今日数据" component={Today} onEnter={requireAuth}/>
            <Route path='Visualization' breadcrumbName="可视化监控" isLink={true}>
                <IndexRoute component={Visualization}/>
                <Route path="BerthDetails" breadcrumbName="泊位详情" component={BerthDetails}/>
                <Route path="UserDetail" breadcrumbName="人员详情" component={UserDetail}/>
            </Route>
        </Route>

        <Route path="OperatingCenter" breadcrumbName="运营中心">
            <Route path="DealManage" breadcrumbName="交易管理">
                <Route path="ParkingRecord" breadcrumbName="停车记录" isLink={true}>
                    <IndexRoute component={ParkingRecord} onEnter={requireAuth}/>
                    <Route path='ParkingRecordDetail' breadcrumbName='停车记录详情' isLink={true}>
                        <IndexRoute component={ParkingRecordDetail} onEnter={requireAuth}/>
                        <Route path='AppealDetail' breadcrumbName='查看申诉详情' component={AppealDetail}
                               onEnter={requireAuth}/>
                    </Route>
                </Route>
                <Route path="AppealManage" breadcrumbName="退款申诉处理" isLink={true}>
                    <IndexRoute component={AppealManage} onEnter={requireAuth}/>
                    <Route path='AppealDetail' breadcrumbName='申诉详情' isLink={true}>
                        <IndexRoute component={AppealDetail} onEnter={requireAuth}/>
                        <Route path='ParkingRecordDetail' breadcrumbName='停车记录详情' component={ParkingRecordDetail}
                               onEnter={requireAuth}/>
                    </Route>
                    <Route path='ParkingRecordDetail' breadcrumbName='停车记录详情' component={ParkingRecordDetail}
                           onEnter={requireAuth}/>
                </Route>
            </Route>
            <Route path="VipManage" breadcrumbName="会员管理">
                <Route path="VipList" breadcrumbName="会员列表" isLink={true}>
                    <IndexRoute component={VipList}/>
                    <Route path="VipLogDetails" component={VipDetails} breadcrumbName="会员详情"/>
                </Route>
            </Route>
            <Route path="PartnerManage" breadcrumbName="合作方管理" isLink={true}>
                <IndexRoute component={PartnerList} onEnter={requireAuth}/>
                <Route path="NewPartner" breadcrumbName="新建合作方" component={NewPartner} onEnter={requireAuth}/>
                <Route path="Update" breadcrumbName="编辑合作方" component={UpdatePartner} onEnter={requireAuth}/>
                <Route path="PartnerDetail" breadcrumbName="合作方详情" component={PartnerDetail} onEnter={requireAuth}/>
                <Route path="PartnerAccounts" breadcrumbName="合作方主账号" component={PartnerAccounts}/>
                {/*<Route path="PartnerOrganization" breadcrumbName="合作方组织结构" component={PartnerOrganization}/>*/}
            </Route>
            <Route path="Complaints" breadcrumbName="投诉建议" isLink={true}>
                <IndexRoute component={ComplaintsList}/>
                <Route path="ComplaintDetails" component={ComplaintDetails} breadcrumbName="投诉详情"/>
            </Route>
        </Route>

        <Route path="OperationsAndCenter" breadcrumbName="运维中心">
            <Route path="WorkOrder" breadcrumbName="工单管理">
                <Route path="ComplaintWorkOrder" breadcrumbName="投诉工单" isLink={true}>
                    <IndexRoute component={ComplaintWorkOrder}/>
                    <Route path="ComplaintWorkOrderDetails" breadcrumbName="投诉工单详情" components={ComplaintWorkOrderDetails}/>
                </Route>
                <Route path="FacilityMaintenance" breadcrumbName="设备维保" isLink={true}>
                    <IndexRoute component={FacilityMaintenance}/>
                    <Route path="FacilityMaintenanceDetails" breadcrumbName="设备维保详情" components={FacilityMaintenanceDetails}/>
                </Route>
                <Route path="OpinionTemplate" breadcrumbName="意见模板" components={OpinionTemplate}/>
            </Route>
            <Route path='AlarmManage' breadcrumbName='告警管理'>
                <Route path='AbnormalDevice' breadcrumbName="设备告警" isLink={true}>
                    <IndexRoute component={AbnormalDevice}/>
                    <Route path="AbnormalDeviceDetail" component={AbnormalDeviceDetail} breadcrumbName="设备告警详情"/>
                </Route>
                <Route path="AbnormalParkingAlarm" breadcrumbName="违停报警" isLink={true}>
                    <IndexRoute component={AbnormalParkingAlarm}/>
                    <Route path="AlarmDetail" component={AlarmDetail} breadcrumbName="报警详情"/>
                </Route>
                <Route path="AbnormalOrderAlarm" breadcrumbName="异常订单报警" isLink={true}>
                    <IndexRoute component={AbnormalOrderAlarm}/>
                    <Route path="OrderAlarmDetail" component={OrderAlarmDetail} breadcrumbName="报警详情"/>
                </Route>
                <Route path="AbnormalEventManage" components={AbnormalEventManage} breadcrumbName="告警事件管理"/>
            </Route>
            <Route path="PatrolManage" breadcrumbName="巡查管理">
                <Route path="InspectionGroup" breadcrumbName="巡检组管理" isLink={true}>
                    <IndexRoute component={InspectionGroup} onEnter={requireAuth}/>
                    <Route path='AddInspectionGroup' component={AddInspectionGroup} breadcrumbName="新建巡检组"
                           onEnter={requireAuth}/>
                    <Route path='EditInspectionGroup' component={EditInspectionGroup} breadcrumbName="编辑巡检组"
                           onEnter={requireAuth}/>
                    <Route path='InspectionGroupDetail' component={InspectionGroupDetail} breadcrumbName="巡检组详情"
                           onEnter={requireAuth}/>
                    <Route path='EditSchedule' component={EditSchedule} breadcrumbName="编辑排班" onEnter={requireAuth}/>
                </Route>
                <Route path="CheckInInformation" component={CheckInInformation} breadcrumbName="签到信息" onEnter={requireAuth}/>
                <Route path="ScheduleManage" component={ScheduleManage} breadcrumbName="班次管理" onEnter={requireAuth}/>
            </Route>
        </Route>

        <Route path="ConfigCenter" breadcrumbName="配置中心">
            <Route path="BerthManage" breadcrumbName="泊位管理">

                <Route path="BerthSearch" breadcrumbName="泊位查询" isLink={true}>
                    <IndexRoute component={BerthSearch} onEnter={requireAuth}/>
                    <Route path='BerthDetail' components={BerthDetail} onEnter={requireAuth} breadcrumbName="泊位详情"/>
                </Route>
                <Route path="SectionResource" breadcrumbName="路段管理" isLink={true}>
                    <IndexRoute component={SectionResource} onEnter={requireAuth}/>
                    <Route path="SectionDetails" breadcrumbName="路段详情" isLink={true}>
                        <IndexRoute component={SectionDetails} onEnter={requireAuth}/>
                        <Route path="DisplayChargeRules" breadcrumbName="计费规则详情" component={DisplayChargeRules}
                               onEnter={requireAuth}/>
                        <Route path="EditChargeRules" breadcrumbName="编辑计费规则" component={EditChargeRules}
                               onEnter={requireAuth}/>
                    </Route>
                </Route>
                <Route path="ChargeRules" breadcrumbName="计费规则" isLink={true}>
                    <IndexRoute component={ChargeRules} onEnter={requireAuth}/>
                    <Route path="InsertChargeRules" breadcrumbName="新建计费规则" component={InsertChargeRules}
                           onEnter={requireAuth}/>
                    <Route path="DisplayChargeRules" breadcrumbName="计费规则详情" component={DisplayChargeRules}
                           onEnter={requireAuth}/>
                    <Route path="EditChargeRules" breadcrumbName="编辑计费规则" component={EditChargeRules}
                           onEnter={requireAuth}/>
                </Route>
                <Route path='ChargeTimes' breadcrumbName='收费时段' isLink={true}>
                    <IndexRoute component={ChargeTimes} onEnter={requireAuth}/>
                    <Route path="ChargeTimesDetails" breadcrumbName="收费时段详情" component={ChargeTimesDetails}
                           onEnter={requireAuth}/>
                    <Route path="InsertChargeTimes" breadcrumbName="新建收费时段" component={InsertChargeTimes}
                           onEnter={requireAuth}/>
                    <Route path="EditChargeTimes" breadcrumbName="编辑收费时段" component={EditChargeTimes}
                           onEnter={requireAuth}/>
                </Route>
                <Route path='AreaManage' breadcrumbName='片区管理' isLink={true}>
                    <IndexRoute component={AreaManage} onEnter={requireAuth}/>
                </Route>
                <Route path='BerthTypeManage' breadcrumbName='泊位类型管理' isLink={true}>
                    <IndexRoute component={BerthTypeManage} onEnter={requireAuth}/>
                </Route>

            </Route>

            <Route path='Organization' breadcrumbName="组织架构">
                <Route path="UserManage" breadcrumbName="用户管理" component={UserManage}/>
                <Route path="RoleManage" breadcrumbName="角色管理" component={RoleManage}/>
                <Route path="SquadronManage" breadcrumbName="中队管理" component={SquadronManage}/>
            </Route>

            <Route path="SystemManage" breadcrumbName="系统管理">
                <Route path="FinancialAccountParams" component={FinancialAccountParams} breadcrumbName="财务账号参数"
                       onEnter={requireAuth}/>
                <Route path="BusinessAccountParams" component={BusinessAccountParams} breadcrumbName="业务账号参数"
                       onEnter={requireAuth}/>
                <Route path="HolidayConfig" component={HolidayConfig} breadcrumbName="节假日配置"
                       onEnter={requireAuth}/>
                <Route path="CustomerService" breadcrumbName="客服配置" isLink={true}>
                    <IndexRoute component={CustomerService} onEnter={requireAuth}/>
                    <Route path="CustomerServiceConfig" component={CustomerServiceConfig} breadcrumbName="配置"
                           onEnter={requireAuth}/>
                </Route>
                <Route path="SystemLog" breadcrumbName="系统操作日志" components={SystemLog}/>
            </Route>

            <Route path="RosterManage" breadcrumbName="名单管理">
                <Route path="BlackList" breadcrumbName="车辆黑名单" component={BlackList}/>
                <Route path="WhiteList" breadcrumbName="车辆白名单" component={WhiteList}/>
            </Route>
        </Route>

        <Route path="DataCenter" breadcrumbName="数据中心">
            <Route path='UerReport' breadcrumbName='用户报表' components={UserReport} />
            <Route path='DeviceReport' breadcrumbName='设备报表' components={DeviceReport} />
            <Route path='ParkingReport' breadcrumbName='停车报表' components={ParkingReport} />
            <Route path='PatrolReport' breadcrumbName='巡检报表' components={PatrolReport} />
            <Route path='OperationsReport' breadcrumbName='运维报表' components={OperationsReport} />
            <Route path='OperationalDaily' breadcrumbName='运营综合日报' components={OperationalDaily} />
            <Route path='OperationalWeekly' breadcrumbName='运营综合周报' components={OperationalWeekly} />
            <Route path='OperationalMonthly' breadcrumbName='运营综合月报' components={OperationalMonthly} />
        </Route>

        <Route path="FinancialManage" breadcrumbName="财务管理">
            <Route path="InvoicesManage" breadcrumbName="发票管理" isLink={true}>
                <IndexRoute component={InvoicesManage} onEnter={requireAuth}/>
                <Route path='InvoiceDetail' breadcrumbName='发票详情' component={InvoiceDetail} onEnter={requireAuth}/>
            </Route>
            <Route path='ParkingRevenueAndExpenditureDetails' breadcrumbName='停车收支明细' component={ParkingRevenueAndExpenditureDetails}/>
            <Route path='ParkingRevenueAndExpenditureSummary' breadcrumbName='停车收支汇总' component={ParkingRevenueAndExpenditureSummary}/>
            <Route path='MembershipRechargeDetails' breadcrumbName='会员充值明细' component={MembershipRechargeDetails}/>
            <Route path='WalletBalanceInquiry' breadcrumbName='钱包余额查询' component={WalletBalanceInquiry}/>
        </Route>

        {/*//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/}

        <Route path='403' component={Page403}/>
        <Route path='*' component={NotMatch}/>
    </Route>
);
