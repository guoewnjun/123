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


//折线
export default class LineChart extends PureComponent {



  render() {
     const cols = {
       revenue: {
         min:0,
         parkCount: {
          range: [0, 1],
         }
       },
         day: {
           range: [0, 1],
         }
     }
     return (
         <div>
          <Chart height={500} data={this.props.data} scale={cols}
          padding={[100, 100, 100, 30]}  forceFit>
            <Legend />
            <Axis name="day" />
            <Axis
              name="parkCount"
            />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="line"
            shape={"smooth"} position="day*parkCount" size={2} tooltip={[
                'day*parkCount',
                (day, parkCount) => {
                    parkCount = parkCount;
                    return {
                        name: "停车次数",
                        value: parkCount,
                    };
                },
            ]}/>
            <Geom
              type="point"
              position="day*parkCount"
              size={4}
              shape={"circle"}
              tooltip={[
                  'day*parkCount',
                  (day, parkCount) => {
                      parkCount = parkCount;
                      return {
                          name: "停车次数",
                          value: parkCount,
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
