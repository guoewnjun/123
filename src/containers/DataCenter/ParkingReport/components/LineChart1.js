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
import _ from "lodash";


//折线
export default class LineChart extends PureComponent {



  render() {
     const cols = {
       revenue: {
         min:0,
         ratio: {
          formatter: val => _.ceil((val * 100), 2) + '%'
         }
       },
         day: {
           range: [0, 1],
         }
     }
     return (
         <div>
          <Chart height={500} data={this.props.data} scale={cols}
          padding={[100, 100, 100, 100]}  forceFit>
            <Legend />
            <Axis name="day" />
            <Axis
              name="ratio"
              label={{
                formatter: val => _.ceil((val * 100), 2) + '%'
              }}
            />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="line" position="day*ratio" size={2}
            shape={"smooth"} tooltip={[
                'day*ratio',
                (day, ratio) => {
                    ratio = ratio;
                    return {
                        name: "周转率",
                        value: _.ceil((ratio * 100), 2) + '%',
                    };
                },
            ]}/>
            <Geom
              type="point"
              position="day*ratio"
              size={4}
              shape={"circle"}
              tooltip={[
                  'day*ratio',
                  (day, ratio) => {
                      ratio = ratio;
                      return {
                          name: "周转率",
                          value: _.ceil((ratio * 100), 2) + '%'
                      };
                  },
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
