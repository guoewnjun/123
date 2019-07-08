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
      const data  =this.props.data;
      if(this.props.data.length==0){
        data.push({name:'暂无数据 ',in:0,out:0});
      }
      const list = [];
      const in1 = {name:'入场'};
      const out1 = {name:'出场'};
      const listcol = [];
      for (let i = 0; i < data.length; i++) {
        in1[data[i].name] = data[i].in;
        out1[data[i].name] = data[i].out;
        listcol[i] = data[i].name;
      }
      list[0] = in1;
      list[1] = out1;
      const dv = ds.createView().source(list);
      dv.transform({
        type: "fold",
        fields: listcol,
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
