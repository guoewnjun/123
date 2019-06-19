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

import _ from 'lodash';

//环
export default class AnnularChart extends PureComponent {


  render() {

        const { DataView } = DataSet;
        /*
        const data = [
          {
            item: "区域1",
            count: 40
          },
          {
            item: "区域2",
            count: 21
          },
          {
            item: "区域3",
            count: 17
          },
          {
            item: "区域4",
            count: 13
          },
          {
            item: "区域5",
            count: 9
          }
        ];
        */
        const dv = new DataView();
        dv.source(this.props.dataSource).transform({
          type: "percent",
          field: "count",
          dimension: "item",
          as: "percent"
        });
        const cols = {
          percent: {
            formatter: val => {
              /*val = val * 100 + "%";*/
              val = _.ceil((val * 100), 2) + '%';
              return val;
            }
          }
        };

     return (
            <Chart
              height={400}
              data={dv}
              scale={cols}
              padding={[20, 20, 150, 20]}
              forceFit
            >
              <Coord type={"theta"} radius={0.75} innerRadius={0.6} />
              <Axis name="percent" />
              <Legend
                position="bottom"
              />
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
                    /*percent = percent * 100 + "%";*/
                    percent = _.ceil((percent * 100), 2) + '%';
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
              </Geom>
            </Chart>
     );
  }
}
