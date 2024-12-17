import React, { useEffect, useState } from 'react';
import { Line, Pie } from '@ant-design/charts';

function Chart({sortedTransaction}) {
    const [screenWidth,setScreenWidth] = useState(window.innerWidth)
    const data = sortedTransaction.map((item)=>{
        return {date: item.date, amount: item.amount}
    })
    const spendingData =  sortedTransaction.filter(item =>{
        if(item.type === 'expense'){
            return {tag: item.tag, amount: item.amount}
        }
    })
    useEffect(() => {
        const handleResize = () => {
          setScreenWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

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
    const spendingAmount = newSpendingData.reduce((a, b)=>{
        return a + b.amount;
    }, 0)
      const config = {
        data,
        width:screenWidth>900?800:445,
        height: 320,
        xField: 'date',
        yField: 'amount',
      };
    const spendingConfig = {
        data: newSpendingData,
        width:270,
        height: 320,
        angleField: "amount",
        colorField: "tag"
    }
  return (
    <div className='chart-supper-wrapper'>
        <div className='chart line-chart'>
            <h2>Your Analytics</h2>
            <Line {...config} />
        </div>
        <div className='chart pie-chart'>
            <h2>Your Spendings</h2>
            {spendingAmount > 0 ? <Pie {...spendingConfig}/>: <p>You don't have spended yet.</p>}
        </div>
    </div>
  );
}

export default Chart;