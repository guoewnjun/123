import React, {Component} from 'react';
import {
  Row, Col, Radio, DatePicker, Button, Cascader, Table, Card, Spin, Form,
} from "antd";

import {HttpClientImmidIot} from "@/common/HttpClientImmidIot";

import LineChart from './components/LineChart';//引入折线图
import LineChart1 from './components/LineChart1';//引入%折线图
import Histogram from './components/Histogram';//引入柱状图
import Histogram2 from './components/Histogram2';//引入%柱状图
import Histogram1 from './components/Histogram1';//引入堆叠柱状图

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
class ParkingReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
          loading:false,
          ParkingToday:{
            BerthageTotal:'23,025',//泊位总数
            CurrentOccupation:'18,025',//当前占用数
            CurrentOccupancyRate:'72.37%',//当前占用率
            CurrentTimeSlots:'2,025',//实时空位
            StopsToday:'1,023',//今日停车次数
            AverageStoppingTime:'80分钟',//平均停车时长
          },
          HistoricalParkingData:{
            TotalAdmission:'18,290',//入场总次数
            TotalAppearances:'15,290',//出场总次数
            TotalStops:'18,290',//停车总次数
            AverageStoppingTime:'80分钟',//平均停车时长
          },
          options:[
            {
              value: 'shenzhen',
              label: '深圳',
              children: [
                {
                  value: 'nanshanqu',
                  label: '南山区',
                  children: [
                    {
                      value: 'xilipianqu',
                      label: '西丽片区',
                    },
                    {
                      value: 'nantoupianqu',
                      label: '南头片区',
                    },
                  ],
                },
                {
                  value: 'futianqu',
                  label: '福田区',
                  children: [
                    {
                      value: 'huaqiangbeipianqu',
                      label: '华强北片区',
                    },
                    {
                      value: 'tiananpianqu',
                      label: '天安片区',
                    },
                  ],
                },
              ],
            },
          ],

          zxdata1:[
            {
          	time: '2019-06-01',
          	zhuangtai: '入场',
          	revenue: 18029,
            },
            {
          	time: '2019-06-01',
          	zhuangtai: '出场',
          	revenue: 20230,
            },
            {
          	time: '2019-06-04',
          	zhuangtai: '入场',
          	revenue: 18000,
            },
            {
          	time: '2019-06-04',
          	zhuangtai: '出场',
          	revenue: 20200,
            },
            {
          	time: '2019-06-08',
          	zhuangtai: '入场',
          	revenue: 17029,
            },
            {
          	time: '2019-06-08',
          	zhuangtai: '出场',
          	revenue: 19230,
            },
            {
          	time: '2019-06-12',
          	zhuangtai: '入场',
          	revenue: 18829,
            },
            {
          	time: '2019-06-12',
          	zhuangtai: '出场',
          	revenue: 20430,
            },
            {
          	time: '2019-06-16',
          	zhuangtai: '入场',
          	revenue: 18129,
            },
            {
          	time: '2019-06-16',
          	zhuangtai: '出场',
          	revenue: 20030,
            },
            {
          	time: '2019-06-20',
          	zhuangtai: '入场',
          	revenue: 16029,
            },
            {
          	time: '2019-06-20',
          	zhuangtai: '出场',
          	revenue: 21230,
            },
            {
          	time: '2019-06-24',
          	zhuangtai: '入场',
          	revenue: 18029,
            },
            {
          	time: '2019-06-24',
          	zhuangtai: '出场',
          	revenue: 20230,
            },
            {
          	time: '2019-06-28',
          	zhuangtai: '入场',
          	revenue: 18099,
            },
            {
          	time: '2019-06-28',
          	zhuangtai: '出场',
          	revenue: 20290,
            },
          ],
          zxdata2:[
          	{
          	time: '2019-06-01',
            zhuangtai: '周转率',
          	revenue: 330.2,
          	},
          	{
          	time: '2019-06-05',
            zhuangtai: '周转率',
          	revenue: 310.2,
          	},
          	{
          	time: '2019-06-10',
            zhuangtai: '周转率',
          	revenue: 300.2,
          	},
          	{
          	time: '2019-06-15',
            zhuangtai: '周转率',
          	revenue: 330.2,
          	},
          	{
          	time: '2019-06-20',
            zhuangtai: '周转率',
          	revenue: 320.2,
          	},
          	{
          	time: '2019-06-25',
            zhuangtai: '周转率',
          	revenue: 340.2,
          	},
          	{
          	time: '2019-06-30',
            zhuangtai: '周转率',
          	revenue: 290.2,
          	},
          ],
          zxdata3:[
          	{
          	time: '2019-06-01',
            zhuangtai: '停车次数',
          	revenue: 3980,
          	},
          	{
          	time: '2019-06-05',
            zhuangtai: '停车次数',
          	revenue: 4590,
          	},
          	{
          	time: '2019-06-10',
            zhuangtai: '停车次数',
          	revenue: 3700,
          	},
          	{
          	time: '2019-06-15',
            zhuangtai: '停车次数',
          	revenue: 3999,
          	},
          	{
          	time: '2019-06-20',
            zhuangtai: '停车次数',
          	revenue: 4400,
          	},
          	{
          	time: '2019-06-25',
            zhuangtai: '停车次数',
          	revenue: 3500,
          	},
          	{
          	time: '2019-06-30',
            zhuangtai: '停车次数',
          	revenue: 3333,
          	},
          ],

          zdata1:[
            {
          	name: "入场",
          	"福田区": 18029,
          	"南山区": 18000,
          	"宝安区": 17029,
          	"龙华区": 18829,
          	"罗湖区": 20430,
          	"龙岗区": 18129,
          	"光明区": 16029,
          	"坪山区": 18099,
            },
            {
          	name: "出场",
          	"福田区": 20230,
          	"南山区": 20200,
          	"宝安区": 19230,
          	"龙华区": 20430,
          	"罗湖区": 20030,
          	"龙岗区": 21230,
          	"光明区": 20230,
          	"坪山区": 20290,
            },
          ],
          zdata2:[
            {
          	name: "平均周转率",
          	"福田区": 330.2,
          	"南山区": 300.2,
          	"宝安区": 310.2,
          	"龙华区": 300.2,
          	"罗湖区": 330.2,
          	"龙岗区": 320.2,
          	"光明区": 340.2,
          	"坪山区": 290.2,
            }
          ],
          zdata3:[
            {
          	name: "0-1小时",
          	"福田区": 310,
          	"南山区": 320,
          	"宝安区": 340,
          	"龙华区": 330,
          	"罗湖区": 310,
          	"龙岗区": 300,
          	"光明区": 340,
          	"坪山区": 330,
            },
            {
          	name: "1-2小时",
          	"福田区": 780,
          	"南山区": 800,
          	"宝安区": 690,
          	"龙华区": 810,
          	"罗湖区": 780,
          	"龙岗区": 790,
          	"光明区": 760,
          	"坪山区": 740,
            },
            {
          	name: "2-4小时",
          	"福田区": 560,
          	"南山区": 560,
          	"宝安区": 530,
          	"龙华区": 530,
          	"罗湖区": 560,
          	"龙岗区": 560,
          	"光明区": 550,
          	"坪山区": 550,
            },
            {
          	name: "4-8小时",
          	"福田区": 300,
          	"南山区": 290,
          	"宝安区": 280,
          	"龙华区": 270,
          	"罗湖区": 250,
          	"龙岗区": 310,
          	"光明区": 300,
          	"坪山区": 290,
            },

            {
          	name: ">8小时",
          	"福田区": 150,
          	"南山区": 140,
          	"宝安区": 140,
          	"龙华区": 150,
          	"罗湖区": 130,
          	"龙岗区": 130,
          	"光明区": 130,
          	"坪山区": 150,
            },
          ],

          table1:[
            {
              key: '1',
              date: '2019-05-05',
              scope: '深圳',
              admissions: '18029',
              appearances: '20230',
              children:[
                {
                  key: '11',
                  date: '2019-05-05',
                  scope: '福田区',
                  admissions: '3290',
                  appearances: '4800',
                },
                {
                  key: '12',
                  date: '2019-05-05',
                  scope: '南山区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '13',
                  date: '2019-05-05',
                  scope: '宝安区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '14',
                  date: '2019-05-05',
                  scope: '龙华区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '15',
                  date: '2019-05-05',
                  scope: '罗湖区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '16',
                  date: '2019-05-05',
                  scope: '龙岗区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '17',
                  date: '2019-05-05',
                  scope: '光明区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '18',
                  date: '2019-05-05',
                  scope: '坪山区',
                  admissions: '3782',
                  appearances: '2890',
                },
              ],
            },
            {
              key: '2',
              date: '2019-05-06',
              scope: '深圳',
              admissions: '18029',
              appearances: '20230',
              children:[
                {
                  key: '21',
                  date: '2019-05-06',
                  scope: '福田区',
                  admissions: '3290',
                  appearances: '4800',
                },
                {
                  key: '22',
                  date: '2019-05-06',
                  scope: '南山区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '23',
                  date: '2019-05-06',
                  scope: '宝安区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '24',
                  date: '2019-05-06',
                  scope: '龙华区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '25',
                  date: '2019-05-06',
                  scope: '罗湖区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '26',
                  date: '2019-05-06',
                  scope: '龙岗区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '27',
                  date: '2019-05-06',
                  scope: '光明区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '28',
                  date: '2019-05-06',
                  scope: '坪山区',
                  admissions: '3782',
                  appearances: '2890',
                },
              ],
            },{
              key: '3',
              date: '2019-05-07',
              scope: '深圳',
              admissions: '18029',
              appearances: '20230',
              children:[
                {
                  key: '31',
                  date: '2019-05-07',
                  scope: '福田区',
                  admissions: '3290',
                  appearances: '4800',
                },
                {
                  key: '32',
                  date: '2019-05-07',
                  scope: '南山区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '33',
                  date: '2019-05-07',
                  scope: '宝安区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '34',
                  date: '2019-05-07',
                  scope: '龙华区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '35',
                  date: '2019-05-07',
                  scope: '罗湖区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '36',
                  date: '2019-05-07',
                  scope: '龙岗区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '37',
                  date: '2019-05-07',
                  scope: '光明区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '38',
                  date: '2019-05-07',
                  scope: '坪山区',
                  admissions: '3782',
                  appearances: '2890',
                },
              ],
            },{
              key: '4',
              date: '2019-05-08',
              scope: '深圳',
              admissions: '18029',
              appearances: '20230',
              children:[
                {
                  key: '41',
                  date: '2019-05-08',
                  scope: '福田区',
                  admissions: '3290',
                  appearances: '4800',
                },
                {
                  key: '42',
                  date: '2019-05-08',
                  scope: '南山区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '43',
                  date: '2019-05-08',
                  scope: '宝安区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '44',
                  date: '2019-05-08',
                  scope: '龙华区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '45',
                  date: '2019-05-08',
                  scope: '罗湖区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '46',
                  date: '2019-05-08',
                  scope: '龙岗区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '47',
                  date: '2019-05-08',
                  scope: '光明区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '48',
                  date: '2019-05-08',
                  scope: '坪山区',
                  admissions: '3782',
                  appearances: '2890',
                },
              ],
            },{
              key: '5',
              date: '2019-05-09',
              scope: '深圳',
              admissions: '18029',
              appearances: '20230',
              children:[
                {
                  key: '51',
                  date: '2019-05-09',
                  scope: '福田区',
                  admissions: '3290',
                  appearances: '4800',
                },
                {
                  key: '52',
                  date: '2019-05-09',
                  scope: '南山区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '53',
                  date: '2019-05-09',
                  scope: '宝安区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '54',
                  date: '2019-05-09',
                  scope: '龙华区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '55',
                  date: '2019-05-09',
                  scope: '罗湖区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '56',
                  date: '2019-05-09',
                  scope: '龙岗区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '57',
                  date: '2019-05-09',
                  scope: '光明区',
                  admissions: '3782',
                  appearances: '2890',
                },
                {
                  key: '58',
                  date: '2019-05-09',
                  scope: '坪山区',
                  admissions: '3782',
                  appearances: '2890',
                },
              ],
            },
          ],
          table2:[
            {
              key: '1',
              date: '2019-05-05',
              scope: '深圳',
              AverageTurnover: '300.2%',
              children:[
                {
                  key: '11',
                  date: '2019-05-05',
                  scope: '福田区',
                  AverageTurnover: '330.2%',
                },{
                  key: '12',
                  date: '2019-05-05',
                  scope: '南山区',
                  AverageTurnover: '310.2%',
                },{
                  key: '13',
                  date: '2019-05-05',
                  scope: '宝安区',
                  AverageTurnover: '330.2%',
                },{
                  key: '14',
                  date: '2019-05-05',
                  scope: '龙华区',
                  AverageTurnover: '310.2%',
                },{
                  key: '15',
                  date: '2019-05-05',
                  scope: '罗湖区',
                  AverageTurnover: '330.2%',
                },{
                  key: '16',
                  date: '2019-05-05',
                  scope: '龙岗区',
                  AverageTurnover: '310.2%',
                },{
                  key: '17',
                  date: '2019-05-05',
                  scope: '光明区',
                  AverageTurnover: '330.2%',
                },{
                  key: '18',
                  date: '2019-05-05',
                  scope: '坪山区',
                  AverageTurnover: '310.2%',
                },
              ],
            },{
              key: '2',
              date: '2019-05-06',
              scope: '深圳',
              AverageTurnover: '300.2%',
              children:[
                {
                  key: '21',
                  date: '2019-05-06',
                  scope: '福田区',
                  AverageTurnover: '330.2%',
                },{
                  key: '22',
                  date: '2019-05-06',
                  scope: '南山区',
                  AverageTurnover: '310.2%',
                },{
                  key: '23',
                  date: '2019-05-06',
                  scope: '宝安区',
                  AverageTurnover: '330.2%',
                },{
                  key: '24',
                  date: '2019-05-06',
                  scope: '龙华区',
                  AverageTurnover: '310.2%',
                },{
                  key: '25',
                  date: '2019-05-06',
                  scope: '罗湖区',
                  AverageTurnover: '330.2%',
                },{
                  key: '26',
                  date: '2019-05-06',
                  scope: '龙岗区',
                  AverageTurnover: '310.2%',
                },{
                  key: '27',
                  date: '2019-05-06',
                  scope: '光明区',
                  AverageTurnover: '330.2%',
                },{
                  key: '28',
                  date: '2019-05-06',
                  scope: '坪山区',
                  AverageTurnover: '310.2%',
                },
              ],
            },{
              key: '3',
              date: '2019-05-07',
              scope: '深圳',
              AverageTurnover: '300.2%',
              children:[
                {
                  key: '31',
                  date: '2019-05-07',
                  scope: '福田区',
                  AverageTurnover: '330.2%',
                },{
                  key: '32',
                  date: '2019-05-07',
                  scope: '南山区',
                  AverageTurnover: '310.2%',
                },{
                  key: '33',
                  date: '2019-05-07',
                  scope: '宝安区',
                  AverageTurnover: '330.2%',
                },{
                  key: '34',
                  date: '2019-05-07',
                  scope: '龙华区',
                  AverageTurnover: '310.2%',
                },{
                  key: '35',
                  date: '2019-05-07',
                  scope: '罗湖区',
                  AverageTurnover: '330.2%',
                },{
                  key: '36',
                  date: '2019-05-07',
                  scope: '龙岗区',
                  AverageTurnover: '310.2%',
                },{
                  key: '37',
                  date: '2019-05-07',
                  scope: '光明区',
                  AverageTurnover: '330.2%',
                },{
                  key: '38',
                  date: '2019-05-07',
                  scope: '坪山区',
                  AverageTurnover: '310.2%',
                },
              ],
            },{
              key: '4',
              date: '2019-05-08',
              scope: '深圳',
              AverageTurnover: '300.2%',
              children:[
                {
                  key: '11',
                  date: '2019-05-08',
                  scope: '福田区',
                  AverageTurnover: '330.2%',
                },{
                  key: '12',
                  date: '2019-05-08',
                  scope: '南山区',
                  AverageTurnover: '310.2%',
                },{
                  key: '43',
                  date: '2019-05-08',
                  scope: '宝安区',
                  AverageTurnover: '330.2%',
                },{
                  key: '44',
                  date: '2019-05-08',
                  scope: '龙华区',
                  AverageTurnover: '310.2%',
                },{
                  key: '45',
                  date: '2019-05-08',
                  scope: '罗湖区',
                  AverageTurnover: '330.2%',
                },{
                  key: '46',
                  date: '2019-05-08',
                  scope: '龙岗区',
                  AverageTurnover: '310.2%',
                },{
                  key: '47',
                  date: '2019-05-08',
                  scope: '光明区',
                  AverageTurnover: '330.2%',
                },{
                  key: '48',
                  date: '2019-05-08',
                  scope: '坪山区',
                  AverageTurnover: '310.2%',
                },
              ],
            },{
              key: '5',
              date: '2019-05-09',
              scope: '深圳',
              AverageTurnover: '300.2%',
              children:[
                {
                  key: '51',
                  date: '2019-05-09',
                  scope: '福田区',
                  AverageTurnover: '330.2%',
                },{
                  key: '52',
                  date: '2019-05-09',
                  scope: '南山区',
                  AverageTurnover: '310.2%',
                },{
                  key: '53',
                  date: '2019-05-09',
                  scope: '宝安区',
                  AverageTurnover: '330.2%',
                },{
                  key: '54',
                  date: '2019-05-09',
                  scope: '龙华区',
                  AverageTurnover: '310.2%',
                },{
                  key: '55',
                  date: '2019-05-09',
                  scope: '罗湖区',
                  AverageTurnover: '330.2%',
                },{
                  key: '56',
                  date: '2019-05-09',
                  scope: '龙岗区',
                  AverageTurnover: '310.2%',
                },{
                  key: '57',
                  date: '2019-05-09',
                  scope: '光明区',
                  AverageTurnover: '330.2%',
                },{
                  key: '58',
                  date: '2019-05-09',
                  scope: '坪山区',
                  AverageTurnover: '310.2%',
                },
              ],
            },
          ],
          table3:[
            {
              key: '1',
              date: '2019-05-05',
              scope: '深圳',
              TotalStops: '3,980',
              zo:'310',
              ot:'780',
              tf:'560',
              fe:'290',
              eight:'150',
              children:[
                {
                  key: '11',
                  date: '2019-05-05',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '12',
                  date: '2019-05-05',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '13',
                  date: '2019-05-05',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '14',
                  date: '2019-05-05',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '15',
                  date: '2019-05-05',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '16',
                  date: '2019-05-05',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '17',
                  date: '2019-05-05',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '18',
                  date: '2019-05-05',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
              ],
            },{
              key: '2',
              date: '2019-05-06',
              scope: '深圳',
              TotalStops: '3,980',
              zo:'310',
              ot:'780',
              tf:'560',
              fe:'290',
              eight:'150',
              children:[
                {
                  key: '21',
                  date: '2019-05-06',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '22',
                  date: '2019-05-06',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '23',
                  date: '2019-05-06',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '24',
                  date: '2019-05-06',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '25',
                  date: '2019-05-06',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '26',
                  date: '2019-05-06',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '27',
                  date: '2019-05-06',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '28',
                  date: '2019-05-06',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
              ],
            },{
              key: '3',
              date: '2019-05-07',
              scope: '深圳',
              TotalStops: '3,980',
              zo:'310',
              ot:'780',
              tf:'560',
              fe:'290',
              eight:'150',
              children:[
                {
                  key: '31',
                  date: '2019-05-07',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '32',
                  date: '2019-05-07',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '33',
                  date: '2019-05-07',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '34',
                  date: '2019-05-07',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '35',
                  date: '2019-05-07',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '36',
                  date: '2019-05-07',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '37',
                  date: '2019-05-07',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '38',
                  date: '2019-05-07',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
              ],
            },{
              key: '4',
              date: '2019-05-08',
              scope: '深圳',
              TotalStops: '3,980',
              zo:'310',
              ot:'780',
              tf:'560',
              fe:'290',
              eight:'150',
              children:[
                {
                  key: '41',
                  date: '2019-05-08',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '42',
                  date: '2019-05-08',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '43',
                  date: '2019-05-08',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '44',
                  date: '2019-05-08',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '45',
                  date: '2019-05-08',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '46',
                  date: '2019-05-08',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '47',
                  date: '2019-05-08',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '48',
                  date: '2019-05-08',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
              ],
            },{
              key: '5',
              date: '2019-05-09',
              scope: '深圳',
              TotalStops: '3,980',
              zo:'310',
              ot:'780',
              tf:'560',
              fe:'290',
              eight:'150',
              children:[
                {
                  key: '51',
                  date: '2019-05-09',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '52',
                  date: '2019-05-09',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '53',
                  date: '2019-05-09',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '54',
                  date: '2019-05-09',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '55',
                  date: '2019-05-09',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '56',
                  date: '2019-05-09',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },{
                  key: '57',
                  date: '2019-05-09',
                  scope: '福田区',
                  TotalStops: '1,209',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
                {
                  key: '58',
                  date: '2019-05-09',
                  scope: '南山区',
                  TotalStops: '1,280',
                  zo:'310',
                  ot:'780',
                  tf:'560',
                  fe:'290',
                  eight:'150',
                },
              ],
            },
          ],

          bool1:true,
          bool2:false,
          bool3:false,
        };
    }


    //加载数据
    loadData() {
      this.setState({
        loading: true
      });
      HttpClientImmidIot.query("/DataCenter/DeviceReport/Index", "GET", null, this.handleQueryData.bind(this))
    }

    // loadData回调函数
    handleQueryData(d, type) {
      const data = d.data;
      if (type === HttpClientImmidIot.requestSuccess) {
        this.setState({
          ParkingToday:this.state.ParkingToday,
          HistoricalParkingData:this.state.HistoricalParkingData,
          options:this.state.options,
          table1:this.state.table1,
          table2:this.state.table2,
          table3:this.state.table3,
        })
      } else {
          //失败----做除了报错之外的操作
      }
      this.setState({
        loading: false
      });
    }

    //查询按钮
    handleQuery() {
      this.setState({

      });
      this.loadData(this.props.form)
    }

    build=(a)=>{
      if(a.target.value==1){
        this.setState({
        bool1:true,
        bool2:false,
        bool3:false,
        })
      }else if(a.target.value==2){
        this.setState({
        bool1:false,
        bool2:true,
        bool3:false,
        })
      }else if(a.target.value==3){
        this.setState({
        bool1:false,
        bool2:false,
        bool3:true,
        })
      }else{
        this.setState({
          bool1:false,
        })
      }
    }

    componentWillMount() {

    }

    componentDidMount() {
      this.loadData();
    }

    componentWillUnmount() {

    }

    render() {
      const {
        loading, ParkingToday, HistoricalParkingData, options, bool1, bool2, bool3,
        zxdata1, zxdata2, zxdata3,
        zdata1, zdata2, zdata3,
        table1, table2, table3,
      }= this.state;

      const { getFieldDecorator } = this.props.form;

      const getNowFormatDate=()=> {//获取当前时间
        	let date = new Date();
        	let seperator1 = "-";
        	let seperator2 = ":";
        	let month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
        	let strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
        	let currentdate = date.getFullYear() + seperator1  + month  + seperator1  + strDate
        			+ " "  + date.getHours()  + seperator2  + date.getMinutes()
        			+ seperator2 + date.getSeconds();
        	return currentdate;
      }

      const columns1 = [
          {
              title: "日期",
              dataIndex: "date",
              render: (value) => value || "--",
          },{
              title: "范围",
              dataIndex: "scope",
              render: (value) => value || "--",
          },{
              title: "入场次数",
              dataIndex: "admissions",
              render: (value) => value || "--",
          },{
              title: "出场次数",
              dataIndex: "appearances",
              render: (value) => value || "--",
          },
        ];
      const columns2 = [
            {
                title: "日期",
                dataIndex: "date",
                render: (value) => value || "--",
            },{
                title: "范围",
                dataIndex: "scope",
                render: (value) => value || "--",
            },{
                title: "平均周转率",
                dataIndex: "AverageTurnover",
                render: (value) => value || "--",
            },
          ];
      const columns3 = [
                {
                    title: "日期",
                    dataIndex: "date",
                    render: (value) => value || "--",
                },{
                    title: "范围",
                    dataIndex: "scope",
                    render: (value) => value || "--",
                },{
                    title: "停车总次数",
                    dataIndex: "TotalStops",
                    render: (value) => value || "--",
                },{
                    title: "0-1小时",
                    dataIndex: "zo",
                    render: (value) => value || "--",
                },{
                    title: "1-2小时",
                    dataIndex: "ot",
                    render: (value) => value || "--",
                },{
                    title: "2-4小时",
                    dataIndex: "tf",
                    render: (value) => value || "--",
                },{
                    title: "4-8小时",
                    dataIndex: "fe",
                    render: (value) => value || "--",
                },{
                    title: ">8小时",
                    dataIndex: "eight",
                    render: (value) => value || "--",
                },
              ];

        return (
            <div className='page'>
                <div className='page-header'>
                    <div>停车报表</div>
                </div>
              <Spin tip="加载中.." spinning={loading}>
                <div className='page-content'>
                  <Row gutter={64} type="flex" justify="space-around" style={{textAlign:'center'}}>
                    <Col span={24} style={{marginLeft:20, marginTop:12, fontSize:20,textAlign:'left'}}>
                      今日停车概况 (截至{getNowFormatDate()})
                    </Col>
                    <Col span={4} style={{marginTop:20}}>
                      <Row gutter={0} >
                        <Col span={24} style={{color:'#868686'}}>
                          泊位总数
                        </Col>
                        <Col span={24} style={{fontSize:30,color:'#FF003B'}}>
                          {ParkingToday.BerthageTotal}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4} style={{marginTop:20}}>
                      <Row gutter={0} >
                        <Col span={24} style={{color:'#868686'}}>
                          当前占用数
                        </Col>
                        <Col span={24} style={{fontSize:30,color:'#FF003B'}}>
                          {ParkingToday.CurrentOccupation}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4} style={{marginTop:20}}>
                      <Row gutter={0} >
                        <Col span={24} style={{color:'#868686'}}>
                          当前占用率
                        </Col>
                        <Col span={24} style={{fontSize:30,color:'#FF003B'}}>
                          {ParkingToday.CurrentOccupancyRate}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4} style={{marginTop:20}}>
                      <Row gutter={0} >
                        <Col span={24} style={{color:'#868686'}}>
                          实时空位
                        </Col>
                        <Col span={24} style={{fontSize:30,color:'#FF003B'}}>
                          {ParkingToday.CurrentTimeSlots}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4} style={{marginTop:20}}>
                      <Row gutter={0} >
                        <Col span={24} style={{color:'#868686'}}>
                          今日停车次数
                        </Col>
                        <Col span={24} style={{fontSize:30,color:'#FF003B'}}>
                          {ParkingToday.StopsToday}
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4} style={{marginTop:20}}>
                      <Row gutter={0} >
                        <Col span={24} style={{color:'#868686'}}>
                          平均停车时长
                        </Col>
                        <Col span={24} style={{fontSize:30,color:'#FF003B'}}>
                          {ParkingToday.AverageStoppingTime}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
                <div className='page-content'>
                  <Form>
                    <Row gutter={64} type="flex" justify="space-around" style={{textAlign:'center'}}>
                      <Col span={24} style={{marginLeft:20, marginTop:12, fontSize:20,textAlign:'left'}}>
                        历史停车数据
                      </Col>
                      <Col span={24} style={{marginTop:25}}>
                        <Row gutter={0}>
                          <Col span={6} style={{marginLeft:20,}}>
                            <FormItem>
                              {getFieldDecorator('date-time-picker')(
                                <RangePicker style={{width: "100%",}} format="YYYY-MM-DD"/>
                              )}
                            </FormItem>
                          </Col>
                          <Col span={6} style={{marginLeft:80,}}>
                            <FormItem>
                              {getFieldDecorator('city-area-picker')(
                                <Cascader
                                  options={options} placeholder="深圳" style={{width:'100%',textAlign:'left'}} changeOnSelect
                                />
                              )}
                            </FormItem>
                          </Col>
                          <Col span={4} style={{marginLeft:80,}}>
                            <Button type="primary" onClick={this.handleQuery.bind(this)}>查询</Button>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                        <Row gutter={0}>
                          <Col span={6} style={{marginTop:20}}>
                            <Row gutter={0} >
                              <Col span={24} style={{color:'#868686'}}>
                                入场总次数
                              </Col>
                              <Col span={24} style={{fontSize:30}}>
                                {HistoricalParkingData.TotalAdmission}
                              </Col>
                            </Row>
                          </Col>
                          <Col span={6} style={{marginTop:20}}>
                            <Row gutter={0} >
                              <Col span={24} style={{color:'#868686'}}>
                                出场总次数
                              </Col>
                              <Col span={24} style={{fontSize:30}}>
                                {HistoricalParkingData.TotalAppearances}
                              </Col>
                            </Row>
                          </Col>
                          <Col span={6} style={{marginTop:20}}>
                            <Row gutter={0} >
                              <Col span={24} style={{color:'#868686'}}>
                                停车总次数
                              </Col>
                              <Col span={24} style={{fontSize:30}}>
                                {HistoricalParkingData.TotalStops}
                              </Col>
                            </Row>
                          </Col>
                          <Col span={6} style={{marginTop:20}}>
                            <Row gutter={0} >
                              <Col span={24} style={{color:'#868686'}}>
                                平均停车时长
                              </Col>
                              <Col span={24} style={{fontSize:30}}>
                                {HistoricalParkingData.AverageStoppingTime}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Form>
                </div>
                <div className='page-content' style={{ padding: 0 ,marginTop:20}}>
                  <Row gutter={64}>
                    <Col span={24} style={{marginLeft:20, marginTop:15,}}>
                      <Radio.Group defaultValue="1" buttonStyle="solid" onChange={this.build.bind(this)}>
                        <Radio.Button value="1" style={{width:120,textAlign:'center'}} >出入场车流</Radio.Button>
                        <Radio.Button value="2" style={{width:120,textAlign:'center'}} >周转率</Radio.Button>
                        <Radio.Button value="3" style={{width:120,textAlign:'center'}} >停车次数/时长</Radio.Button>
                      </Radio.Group>
                    </Col>
                  </Row>
                  {this.state.bool1?(
                <Card bordered={false}>
                  <Row gutter={64} style={{textAlign:'left',marginTop:20}}>
                    <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                      每日出入车流统计
                    </Col>
                    <Col span={24} style={{marginTop:30}}>
                      <LineChart data={zxdata1} />
                    </Col>
                    <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                      区域出入车流统计
                    </Col>
                    <Col span={24} style={{marginTop:30}}>
                      <Histogram  data={zdata1} type={'interval'} />
                    </Col>
                  </Row>
                  <Row gutter={64} style={{marginTop:30}}>
                    <Col span={24}>
                      <Table
                          pagination={false}
                          columns={columns1}
                          dataSource={table1}
                      />
                    </Col>
                  </Row>
                </Card>
                  ):''}
                  {this.state.bool2?(
                <Card bordered={false}>
                  <Row gutter={64} style={{textAlign:'left',marginTop:20}}>
                    <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                      每日周转率统计
                    </Col>
                    <Col span={24} style={{marginTop:30}}>
                      <LineChart1 data={zxdata2} />
                    </Col>
                    <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                      区域平均周转率统计
                    </Col>
                    <Col span={24} style={{marginTop:30}}>
                      <Histogram2  data={zdata2} />
                    </Col>
                  </Row>
                  <Row gutter={64} style={{marginTop:30}}>
                    <Col span={24}>
                      <Table
                          pagination={false}
                          columns={columns2}
                          dataSource={table2}
                      />
                    </Col>
                  </Row>
                </Card>
                ):''}
                  {this.state.bool3?(
                <Card bordered={false}>
                  <Row gutter={64} style={{textAlign:'left',marginTop:20}}>
                    <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                      每日停车次数统计
                    </Col>
                    <Col span={24} style={{marginTop:30}}>
                      <LineChart data={zxdata3} type={'intervalStack'}/>
                    </Col>
                    <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                      区域停车次数与时长统计
                    </Col>
                    <Col span={24} style={{marginTop:30}}>
                      <Histogram1  data={zdata3} />
                    </Col>
                  </Row>
                  <Row gutter={64} style={{marginTop:30}}>
                    <Col span={24}>
                      <Table
                          pagination={false}
                          columns={columns3}
                          dataSource={table3}
                      />
                    </Col>
                  </Row>
                </Card>
                  ):''}
                </div>
              </Spin>
                  <div className='page-content' style={{ padding: 0 ,marginTop:20}}>
                    <Row gutter={64}>
                      <Col span={24} style={{marginLeft:20, marginTop:15,}}>
                        <Radio.Group defaultValue="a" buttonStyle="solid">
                          <Radio.Button value="a" style={{width:120,textAlign:'center'}}>出入场车流</Radio.Button>
                          <Radio.Button value="b" style={{width:120,textAlign:'center'}}>周转率</Radio.Button>
                          <Radio.Button value="c" style={{width:120,textAlign:'center'}}>停车次数/时长</Radio.Button>
                        </Radio.Group>
                      </Col>
                      <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                        每日出入车流统计
                      </Col>
                      <Col span={24}>
                        <LineChart />
                      </Col>
                      <Col span={24} style={{marginLeft:20, marginTop:15, fontSize:20,}}>
                        区域出入车流统计
                      </Col>
                      <Col span={24}>
                        <Histogram />
                      </Col>
                    </Row>
                    <Row gutter={64} style={{textAlign:'center'}}>
                      <Col span={24}>
                        <Table
                            bordered
                            pagination={false}
                            expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                            columns={columns1}
                            dataSource={table1}
                        />
                      </Col>
                    </Row>
                  </div>
             </div>
            );
      }
}

export default Form.create()(ParkingReport);
