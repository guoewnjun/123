import React, { PureComponent } from 'react';
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

const ds = new DataSet();

//柱
export default class NewZhu extends PureComponent {

  render() {
    const ds = new DataSet();
    const data  =this.props.data;
    if(this.props.data.length==0){
      data.push({name:'暂无数据 ',timeMap:{0:{count:0},1:{count:0},2:{count:0},3:{count:0},4:{count:0},}});
    }

    const list = [];
    const in0 = {name:'0-1小时'};
    const in1 = {name:'1-2小时'};
    const in2 = {name:'2-4小时'};
    const in3 = {name:'4-8小时'};
    const in4 = {name:'＞8小时'};
    const listcol = [];
    for (let i = 0; i < data.length; i++) {
      if(data[i].timeMap){
        in0[data[i].name] = data[i].timeMap['0']?data[i].timeMap['0'].count:0;
        in1[data[i].name] = data[i].timeMap['1']?data[i].timeMap['1'].count:0;
        in2[data[i].name] = data[i].timeMap['2']?data[i].timeMap['2'].count:0;
        in3[data[i].name] = data[i].timeMap['3']?data[i].timeMap['3'].count:0;
        in4[data[i].name] = data[i].timeMap['4']?data[i].timeMap['4'].count:0;
      }
      listcol[i] = data[i].name;
    }
    list[0] = in0;
    list[1] = in1;
    list[2] = in2;
    list[3] = in3;
    list[4] = in4;
    const dv = ds.createView().source(list);
    dv.transform({
      type: "fold",
      fields: listcol,
      // 展开字段集
      key: "月份",
      // key字段
      value: "月均降雨量" // value字段
    });
     return (
       <div>
        <Chart height={400} data={dv} forceFit>
        <Legend />
         <Axis name="月份" />
         <Axis name="月均降雨量" />
         <Tooltip />
         <Geom
           type="intervalStack"
           position="月份*月均降雨量"
           color={"name"}
           size={40}
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
