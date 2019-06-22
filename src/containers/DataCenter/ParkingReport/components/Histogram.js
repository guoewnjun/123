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

    // const data = [
    //    {
    //      year: "1951 年",
    //      sales: 38
    //    },
    //    {
    //      year: "1952 年",
    //      sales: 52
    //    },
    //    {
    //      year: "1956 年",
    //      sales: 61
    //    },
    //    {
    //      year: "1957 年",
    //      sales: 145
    //    },
    //    {
    //      year: "1958 年",
    //      sales: 48
    //    },
    //    {
    //      year: "1959 年",
    //      sales: 38
    //    },
    //    {
    //      year: "1960 年",
    //      sales: 38
    //    },
    //    {
    //      year: "1962 年",
    //      sales: 38
    //    },
    //    {
    //      year: "1966 年",
    //      sales: 99
    //    }
    //  ];
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
