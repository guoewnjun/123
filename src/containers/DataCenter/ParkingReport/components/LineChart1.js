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

    // const data = [
    //    {
    //      year: "1991",
    //      value: 3
    //    },
    //    {
    //      year: "1992",
    //      value: 4
    //    },
    //    {
    //      year: "1993",
    //      value: 3.5
    //    },
    //    {
    //      year: "1994",
    //      value: 5
    //    },
    //    {
    //      year: "1995",
    //      value: 4.9
    //    },
    //    {
    //      year: "1996",
    //      value: 6
    //    },
    //    {
    //      year: "1997",
    //      value: 7
    //    },
    //    {
    //      year: "1998",
    //      value: 9
    //    },
    //    {
    //      year: "1999",
    //      value: 13
    //    }
    //  ];
     const cols = {
       revenue: {
         min:0,
         percent: {
          formatter: val => `${val}%`
         }
       },
         time: {
           range: [0, 1],
         }
     }
     return (
         <div>
          <Chart height={500} data={this.props.data} scale={cols} forceFit>
            <Legend />
            <Axis name="time" />
            <Axis
              name="revenue"
              label={{
                formatter: val => `${val}%`
              }}
            />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="line" position="time*revenue" size={2} color={'zhuangtai'}/>
            <Geom
              type="point"
              position="time*revenue"
              size={4}
              color={'zhuangtai'}
              shape={"circle"}
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
