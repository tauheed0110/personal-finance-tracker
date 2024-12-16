import React from 'react';
import { Line, Pie } from '@ant-design/charts';

function Chart({sortedTransaction}) {

    const data = sortedTransaction.map((item)=>{
        return {date: item.date, amount: item.amount}
    })
    const spendingData =  sortedTransaction.filter(item =>{
        if(item.type === 'expense'){
            return {tag: item.tag, amount: item.amount}
        }
    })
    const newSpendingData = [{tag: "food", amount: 0}, {tag: "eduaction", amount: 0}, {tag: "office", amount: 0}]
    spendingData.forEach(item =>{
        if(item.tag === "food"){
            newSpendingData[0].amount += item.amount;
        }else if(item.tag === "education"){
            newSpendingData[1].amount += item.amount;
        }else{
            newSpendingData[2].amount += item.amount;
        }
    })
      const config = {
        data,
        width: 800,
        height: 400,
        xField: 'date',
        yField: 'amount',
      };
    const spendingConfig = {
        data: newSpendingData,
        width: 300,
        height: 400,
        angleField: "amount",
        colorField: "tag"
    }
  return (
    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", gap:"2rem", margin:"2rem"}}>
        <div className='chart line-chart'>
            <h2>Your Analytics</h2>
            <Line {...config} />
        </div>
        <div className='chart pie-chart'>
            <h2>Your Spendings</h2>
            <Pie {...spendingConfig}/>
        </div>
    </div>
  );
}

export default Chart;