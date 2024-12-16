import React from 'react';
import emptyTransaction from '../../assets/transaction.svg'

function NoTransactions() {
  return (
    <div style={{height: "30vh", display: "flex", justifyContent: "center", alignItems:"center"}}>
      <img src={emptyTransaction} alt='emtyImg...'/>
    </div>
  );
}

export default NoTransactions;