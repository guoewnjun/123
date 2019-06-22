import React, { PureComponent } from 'react';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";

const ds = new DataSet();

//柱
export default class NewZhu extends PureComponent {

  render() {
    const dv = ds.createView().source(this.props.data);
    // const data:[
    //   {
    //   name: "0-1小时",
    //   "福田区": 310,
    //   "南山区": 320,
    //   "宝安区": 340,
    //   "龙华区": 330,
    //   "罗湖区": 310,
    //   "龙岗区": 300,
    //   "光明区": 340,
    //   "坪山区": 330,
    //   },
    //   {
    //   name: "1-2小时",
    //   "福田区": 780,
    //   "南山区": 800,
    //   "宝安区": 690,
    //   "龙华区": 810,
    //   "罗湖区": 780,
    //   "龙岗区": 790,
    //   "光明区": 760,
    //   "坪山区": 740,
    //   },
    //   {
    //   name: "2-4小时",
    //   "福田区": 560,
    //   "南山区": 560,
    //   "宝安区": 530,
    //   "龙华区": 530,
    //   "罗湖区": 560,
    //   "龙岗区": 560,
    //   "光明区": 550,
    //   "坪山区": 550,
    //   },
    //   {
    //   name: "4-8小时",
    //   "福田区": 300,
    //   "南山区": 290,
    //   "宝安区": 280,
    //   "龙华区": 270,
    //   "罗湖区": 250,
    //   "龙岗区": 310,
    //   "光明区": 300,
    //   "坪山区": 290,
    //   },
    //
    //   {
    //   name: ">8小时",
    //   "福田区": 150,
    //   "南山区": 140,
    //   "宝安区": 140,
    //   "龙华区": 150,
    //   "罗湖区": 130,
    //   "龙岗区": 130,
    //   "光明区": 130,
    //   "坪山区": 150,
    //   },
    // ];
    dv.transform({
      type: "fold",
      fields: ['福田区','南山区','宝安区','龙华区','罗湖区','龙岗区','光明区','坪山区',],
      // 展开字段集
      key: "地区",
      // key字段
      value: "数量" // value字段
    });
     return (
       <div>
        <Chart height={400} data={dv} forceFit>
          <Axis name="地区" />
          <Axis name="数量" />
          <Legend />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="intervalStack"
            position="地区*数量"
            color={"name"}
            size={25}
            adjust={[
              {
                type: "dodge",
                marginRatio: 1 / 32
              }
            ]}
          />
        </Chart>
      </div>
     );
    }
}
