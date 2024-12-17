import React, { useEffect, useState } from 'react';
import { Card, Row } from 'antd';
import Button from '../Button/index';
import './styles.css';
import { collection, getDocs, deleteDoc, query } from "firebase/firestore";
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

function Cards({

    showExpenseModal,
    showIncomeModal,
    income,
    expense,
    currentBalance,
    fetchTransactions
}) {
    const [user] = useAuthState(auth);
    const [userId, setUserId] = useState(null);

    // set the user id
    useEffect(()=>{
        if(user){
            setUserId(user.uid)
        }
    }, [user]);
    async function deleteAllTransactions(){
        try {
            // Reference to the 'transactions' subcollection for the specific user
            const transactionsRef = collection(db, "users", userId, "transactions");

            // Get all documents in the 'transactions' subcollection
            const transactionsSnapshot = await getDocs(transactionsRef);

            // Loop through the documents and delete them
            const deletePromises = transactionsSnapshot.docs.map((doc) =>
                deleteDoc(doc.ref)
            );

            // Wait for all deletions to complete
            await Promise.all(deletePromises);

            toast.success('All the transactions deleted');
            fetchTransactions();
        } catch (error) {
            toast.error(error.message);
        }
    };
    

    return (
        <div>
            <Row className='row'>
                <Card bordered={true} className='my-card'>
                    <h2>Current Balance</h2>
                    <p>₹{currentBalance}</p>
                    <Button text={'Reset Balance'} blue={true} onClick={deleteAllTransactions}/>
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