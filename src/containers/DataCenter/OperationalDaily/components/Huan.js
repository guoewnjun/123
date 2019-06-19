import React, { PureComponent } from 'react';
import { Chart, Axis, Geom, Tooltip, Legend, Coord, Label, Guide } from 'bizcharts';
import DataSet from "@antv/data-set";
import _ from "lodash";
const { DataView } = DataSet;


export default class Huan extends PureComponent {

  render() {
    const data = [
      {
        item: "1-2",
        count: 40
      },
      {
        item: "0.5-1",
        count: 21
      },
      {
        item: "8-16",
        count: 17
      },
      {
        item: "4-8",
        count: 13
      },
      {
        item: ">16",
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
    const cols = {
      percent: {
        formatter: val => {
          val = _.ceil((val * 100), 2) + '%';
          return val;
        }
      }
    };
        return (
          <Chart
            height={250}
            data={dv}
            scale={cols}
            padding={[30, 30, 30, 30]}
            forceFit
          >
            <Coord type={"theta"} radius={0.9} innerRadius={0.5} />
            <Axis name="percent" />
            <Tooltip
              showTitle={false}
              itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
            />
            <Geom
              type="intervalStack"
              position="percent"
              color="item"
              tooltip={[
                "item*percent",
                (item, percent) => {
                  percent = percent * 100 + "%";
                  return {
                    name: item,
                    value: percent
                  };
                }
              ]}
              style={{
                lineWidth: 1,
                stroke: "#fff"
              }}
            >
              <Label
                content="percent"
                formatter={(val, item) => {
                  return item.point.item + ": " + val;
                }}
              />
            </Geom>
          </Chart>
        );
    }
}
