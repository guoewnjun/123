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


//柱
export default class NewZhu extends PureComponent {

  render() {

      const data = [
       {
         year: "1951 年",
         sales: 38
       },
       {
         year: "1952 年",
         sales: 52
       },
       {
         year: "1956 年",
         sales: 61
       },
       {
         year: "1957 年",
         sales: 145
       },
       {
         year: "1958 年",
         sales: 48
       },
       {
         year: "1959 年",
         sales: 38
       },
       {
         year: "1960 年",
         sales: 38
       },
       {
         year: "1962 年",
         sales: 38
       },
       {
         year: "1966 年",
         sales: 99
       }
     ];

     const cols = {
       sales: {
         tickInterval: 20
       }
     };
     return (
       <div>
         <Chart height={500} data={data} scale={cols} forceFit>
           <Legend />
           <Axis name="year" />
           <Axis name="sales" />
           <Tooltip
             crosshairs={{
               type: "y"
             }}
           />
           <Geom type="interval" position="year*sales" />
         </Chart>
       </div>
     );
    }
}
