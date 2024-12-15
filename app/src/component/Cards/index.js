import React from 'react';
import { Card, Row } from 'antd';
import Button from '../Button/index';
import './styles.css';

function Cards({

    showExpenseModal,
    showIncomeModal,
    income,
    expense,
    currentBalance
}) {
    return (
        <div>
            <Row className='row'>
                <Card bordered={true} className='my-card'>
                    <h2>Current Balance</h2>
                    <p>₹{currentBalance}</p>
                    <Button text={'Reset Balance'} blue={true} />
                </Card>
                <Card bordered={true} className='my-card'>
                    <h2>Total Income</h2>
                    <p>₹{income}</p>
                    <Button text={'Add Income'} blue={true} onClick={showIncomeModal} />
                </Card>
                <Card bordered={true} className='my-card'>
                    <h2>Total Expenses</h2>
                    <p>₹{expense}</p>
                    <Button text={'Add Expenses'} blue={true} onClick={showExpenseModal} />
                </Card>
            </Row>
        </div>
    );
}

export default Cards;