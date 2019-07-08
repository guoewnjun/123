import React from "react";
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
import _ from "lodash";
const { DataView } = DataSet;

export default class ZheXianTu extends React.Component {
  render() {
    const cols = {
      value: {
        min: 0
      },
      year: {
        range: [0, 1]
      }
    };
    const dv = new DataView();
    dv.source(this.props.data).transform({
      type: "percent",
      fields: 'count',
      dimension: "item",
      as: "percent"
    });
    return (
      <div>
        <Chart height={400} data={dv} scale={cols}
        padding={[80, 100, 20, 100]}
        forceFit>
          <Axis name="item" />
          <Axis
              name="count"
              label={{
                  formatter: val => (val + "%")
              }}
          />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
            showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
          />
          <Geom type="line" position="item*count" size={2}
          tooltip={[
            "item*count",
            (item, count) => {
              return {
                name: '占用率',
                value: (count + "%")
              };
            }
          ]}
           />
          <Geom type="area" position="item*count"
              tooltip={[
                "item*count",
                (item, count) => {
                  return {
                    name: '占用率',
                    value: (count + "%")
                  };
                }
              ]}
          />
            <Geom
            type="point"
            position="item*count"
            size={4}
            shape="smooth"
            tooltip={[
              "item*count",
              (item, count) => {
                return {
                  name: '占用率',
                  value: (count + "%")
                };
              }
            ]}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          />
        </Chart>
      </div>
    );
  }
}
