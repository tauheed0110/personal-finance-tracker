import { Radio, Select, Table } from 'antd';
import React, { useState } from 'react';
import searchImg from '../../assets/searchImg.svg';
import Papa, { parse } from 'papaparse'
import {toast} from 'react-toastify';

function TransactionTable({ 
    transactions,
    addTransaction, 
    fetchTransactions
 }) {
    const [search, setSeacrh] = useState("");
    const [filterType, setFilterType] = useState("");
    const [sortKey, setSortKey] = useState("");
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
    ];
    let filteredTransaction = transactions.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(filterType)
    )
    let sortedTransaction = [...filteredTransaction].sort((a, b) => {
        if (sortKey === "date") {
            return new Date(a.date) - new Date(b.date);
        } else if (sortKey === "amount") {
            return a.amount - b.amount;
        } else return 0;
    })
    // function to export csv file
    function exportCSV() {
        var csv = Papa.unparse({
            fields: ["name", "type", "tag", "date", "amount"],
            data: transactions
        });
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'transactions.csv';
        document.body.appendChild(link); 
        link.click();
        document.body.removeChild(link);
    }
    // writing function import from csv
    async function importCSV(event){
        event.preventDefault();
        try{
            parse(event.target.files[0], {
                header: true,
                complete: async function (results){
                    for(const transaction of results.data){
                        const {name, type, tag, date, amount} = transaction;
                        if(name && type && tag && date && amount){
                            const newTransaction = {
                                ...transaction, amount: parseFloat(transaction.amount)
                            }
                            console.log(newTransaction);
                            await addTransaction(newTransaction, true);
                        }
                    }
                }
            });
            toast.success('All transactions added');
            fetchTransactions();
            event.target.files=null;
        }catch(e){
            toast.error(e.message)
        }
    }
    return (
        <div className='my-table'>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", gap: "1rem" }}>
                <div className='input-flex'>
                    <img src={searchImg} alt='search..' width={"16"} />
                    <input value={search} onChange={(e) => { setSeacrh(e.target.value) }} placeholder='Search by name' />
                </div>
                <Select
                    className='select-input'
                    onChange={(value) => setFilterType(value)}
                    value={filterType}
                    placeholder={'Filter'}
                    allowClear>
                    <Select.Option value=''>All</Select.Option>
                    <Select.Option value='income'>Income</Select.Option>
                    <Select.Option value='expense'>Expenses</Select.Option>
                </Select>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <h2>My Transactions</h2>
                <Radio.Group
                    className='input-radio'
                    value={sortKey}
                    onChange={(e) => { setSortKey(e.target.value) }}>
                    <Radio.Button value={""}>No Sort</Radio.Button>
                    <Radio.Button value={"date"}>Sort By Date</Radio.Button>
                    <Radio.Button value={"amount"}>Sort By Ammount</Radio.Button>
                </Radio.Group>
                <div
                    style={{ display: "flex", justifyContent: "center", gap: "1rem", width: "400px" }}>
                    <button className='btn' onClick={exportCSV}>Export to CSV</button>
                    <label htmlFor='file-svg' className='btn blue-btn'>Import to CSV</label>
                    <input onChange={importCSV} id='file-svg' type='file' accept='.csv' required style={{ display: 'none' }} />
                </div>
            </div>
            <Table dataSource={sortedTransaction} columns={columns} />;
        </div>
    );
}

export default TransactionTable;