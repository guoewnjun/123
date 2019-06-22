import React, { PureComponent } from 'react';
import {  Row, Col, Icon } from 'antd';

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

//柱
export default class NewZhu extends PureComponent {

  render() {
    const ds = new DataSet();
    const dv = ds.createView().source(this.props.data);


    dv.transform({
      type: "fold",
      fields: ['福田区','南山区','宝安区','龙华区','罗湖区','龙岗区','光明区','坪山区',],
      // 展开字段集
      key: "地区",
      // key字段
      value: "数量", // value字段
    });
   const cols = {
     percent: {
       formatter: val => {
         val = val + "%";
         return val;
       }
     }
   };
     return (
       <div>
        <Chart height={400} data={dv} scale={cols} forceFit>
          <Axis name="地区" />
          <Axis
            name="数量"
            label={{
              formatter: val => `${val}%`
            }}
          />
          <Legend />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            position="地区*数量"
            color={"name"}
            size={40}
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
