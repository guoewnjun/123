import React, { PureComponent } from 'react';
import { Chart, Axis, Geom, Tooltip, Legend, Coord, Label, Guide } from 'bizcharts';
import DataSet from "@antv/data-set";
const { DataView } = DataSet;

export default class Zhu extends PureComponent {

  render() {
    const data1 = [
      {
        item: "南山区",
        count: 40
      },
      {
        item: "福田区",
        count: 21
      },
      {
        item: "盐田区",
        count: 17
      },
      {
        item: "宝安区",
        count: 13
      },
      {
        item: "龙岗区",
        count: 9
      }
    ];
    const dv = new DataView();
    dv.source(this.props.data).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });

    const data17 = [
        {
          time: "18",
          次数: 38
        },
        {
          time: "19",
          次数: 52
        },
        {
          time: "20",
          次数: 61
        },
        {
          time: "21",
          次数: 38
        },
        {
          time: "22",
          次数: 48
        },
        {
          time: "23",
          次数: 38
        },
        {
          time: "24",
          次数: 38
        }
      ];
        return (
          <Chart height={250} data={dv} padding={[40, 20, 40, 40]}  forceFit>
            <Axis name="item" />
            <Axis name="count"
             grid ="null" />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="interval" position="item*count" />
          </Chart>
        );
    }
}
