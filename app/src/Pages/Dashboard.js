import Header from '../component/Header';
import React, { useEffect, useState } from 'react';
import Cards from '../component/Cards';
import AddExpenseModal from '../component/Modal/addExpenses';
import AddIncomeModal from '../component/Modal/addIncome';
import moment from 'moment';
import { addDoc, collection, getDoc, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import TransactionTable from '../component/TransactionTable';
import Chart from '../component/Chart';
import NoTransactions from '../component/NoTransactions';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate()
  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  function showExpenseModal() {
    setIsExpenseModalVisible(true);
  }
  function showIncomeModal() {
    setIsIncomeModalVisible(true);
  }
  function hadleExpenseCancel() {
    setIsExpenseModalVisible(false);
  }
  function hadleIncomeCancel() {
    setIsIncomeModalVisible(false);
  }
  function onFinish(values, type) {
    const newTransaction = {
      type: type,
      date: values.date.format('YYYY-MM-DD'),
      amount: Math.floor(values.amount),
      tag: values.tag,
      name: values.name
    }
    addTransaction(newTransaction, true)
  }

  async function addTransaction(transaction, many) {
    // add the transaction to firebase
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID", docRef.id);
      if(!many) toast.success('Transacton added');
      // set the transactions again so that it calculates balance again
      setTransactions([...transactions, transaction]);
    } catch (e) {
      console.log("Error adding document", e);
      if(!many) toast.error("Couldn't add Transaction")

    }
  }
  // if user os not logged in navigate to signup page
  useEffect(()=>{
    if(!user){
      navigate('/');
    }
  },[])
  useEffect(() => {
    fetchTransactions();
  }, [user])

  useEffect(()=>{
    calculateBalance();
  }, [transactions])


  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      try {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        let transactionsArray = [];
        querySnapshot.forEach((doc) => {
          transactionsArray.push(doc.data());
        });
        setTransactions(transactionsArray);
        console.log('Transactions fetched', transactionsArray);
        toast.success('Transactions Fetched')
      } catch (e) {
        toast.error(e.message);
      }
    }
    setLoading(false);
  }

  function calculateBalance(){
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      const amount = parseInt(transaction.amount);
      if(transaction.type == 'income'){
        incomeTotal += amount;
      }else{
        expenseTotal += amount;
      }
    })

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setCurrentBalance(incomeTotal - expenseTotal);

  }
  let sortedTransaction = [...transactions].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
  });
  return (
    <div>
      <Header />
      {
        loading ? <p>Loading...</p> :
          <>
            <Cards 
            income={income}
            expense={expense}
            currentBalance={currentBalance}
            showExpenseModal={showExpenseModal} 
            showIncomeModal={showIncomeModal}
            fetchTransactions={fetchTransactions} />

            {transactions.length > 0 ? <Chart sortedTransaction={sortedTransaction}/>: <NoTransactions />}

            <AddExpenseModal
              isExpenseModalVisible={isExpenseModalVisible}
              hadleExpenseCancel={hadleExpenseCancel}
              onFinish={onFinish} />

            <AddIncomeModal
              isIncomeModalVisible={isIncomeModalVisible}
              hadleIncomeCancel={hadleIncomeCancel}
              onFinish={onFinish} />
            <TransactionTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
          </>
      }
    </div>
  );
}

export default Dashboard;
