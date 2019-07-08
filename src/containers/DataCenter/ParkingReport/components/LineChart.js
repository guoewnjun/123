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
    const list = this.props.data;
    const list1 = [];
    for (var i = 0; i < list.length; i++) {
      list1.push({day:list[i].day,inout:'入场',count:list[i].in});
      list1.push({day:list[i].day,inout:'出场',count:list[i].out});
    }

     const cols = {
       '入场': {
         min: 0,
       },
       '出场': {
         min: 0,
       },
       day: {
         range: [0, 1],
       }
     };
     return (
         <div>
          <Chart height={500} data={list1} scale={cols}
          padding={[100, 100, 100, 30]} forceFit>
            <Legend />
            <Axis name="day" />
            <Axis name="count" />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="line" position="day*count" size={2} color={'inout'}
            shape={"smooth"}/>
          <Geom
            type="point"
            position="day*count"
            size={4}
            shape={'circle'}
            color={'inout'}
            style={{
              stroke: '#fff',
              lineWidth: 1,
            }}
          />
          </Chart>
        </div>
     );
    }
}
