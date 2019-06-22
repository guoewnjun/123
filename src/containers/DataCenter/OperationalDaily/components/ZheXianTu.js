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
    const data = [
      {
        year: "1991",
        value: 3
      },
      {
        year: "1992",
        value: 4
      },
      {
        year: "1993",
        value: 3.5
      },
      {
        year: "1994",
        value: 5
      },
      {
        year: "1995",
        value: 4.9
      },
      {
        year: "1996",
        value: 6
      },
      {
        year: "1997",
        value: 7
      },
      {
        year: "1998",
        value: 9
      },
      {
        year: "1999",
        value: 13
      }
    ];
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
                  formatter: val => (_.ceil((val), 2) + '%')
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
              count =_.ceil( (count), 2) + "%";
              return {
                name: item,
                value: count
              };
            }
          ]}
           />
          <Geom type="area" position="item*count"
              tooltip={[
                "item*count",
                (item, count) => {
                  count =_.ceil( (count), 2) + "%";
                  return {
                    name: item,
                    value: count
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
                count =_.ceil( (count), 2) + "%";
                return {
                  name: item,
                  value: count
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
