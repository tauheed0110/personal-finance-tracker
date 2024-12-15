import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';

import React from 'react';

function AddIncomeModal({
    isIncomeModalVisible,
      hadleIncomeCancel,
      onFinish
}) {
    const [form] = Form.useForm();
  return (
    <Modal
        style={{ fontWeight: '600' }}
        title={'Add Income'}
        open={isIncomeModalVisible}
        onCancel={hadleIncomeCancel}
        footer={null}>
             <Form
                form={form}
                layout={'vertical'}
                onFinish={(values) => {
                    onFinish(values, "income");
                    form.resetFields();
                }}
            >
                <Form.Item
                    style={{ fontWeight: '600' }}
                    label={'Name'}
                    name={'name'}
                    rules={[{
                        required: true,
                        message: 'Please input the name of the transaction'
                    }]}
                >
                    <Input type='text' className='custom-input' />
                </Form.Item>
                <Form.Item
                    style={{ fontWeight: '600' }}
                    label={'Amount'}
                    name={'amount'}
                    rules={[{
                        required: true,
                        message: 'Please input the income amount'
                    }]}
                >
                    <Input type='number' className='custom-input' />
                </Form.Item>
                <Form.Item
                    style={{ fontWeight: '600' }}
                    label={'Date'}
                    name={'date'}
                    rules={[{
                        required: true,
                        message: 'Please input the income date'
                    }]}
                >
                    <DatePicker className='custom-input' format={'YYYY-MM-DD'} />
                </Form.Item>
                <Form.Item
                    style={{ fontWeight: '600' }}
                    label={'Tag'}
                    name={'tag'}
                    rules={[{
                        required: true,
                        message: 'Please select a tag'
                    }]}
                >
                    <Select className='select-input-2'>
                        <Select.Option value='salary'>Salary</Select.Option>
                        <Select.Option value='freelance'>Freelance</Select.Option>
                        <Select.Option value='investment'>Investment</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button className='btn blue-btn' type='primary' htmlType='submit'>
                        Add Income
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
  );
}

export default AddIncomeModal;