import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Input, message, Statistic, Tag, Space } from 'antd';
import { DollarOutlined, DownloadOutlined, CreditCardOutlined } from '@ant-design/icons';
import axios from 'axios';

const FeesPage = ({ user }) => {
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentForm] = Form.useForm();
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`/api/fees/student/${user?.id}`, { headers });
      setFees(response.data.fees);
      setPaymentHistory(response.data.fees?.feePaymentHistory || []);
    } catch (error) {
      message.error('Failed to load fee details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post('/api/fees/payment', {
        studentId: user?.id,
        amount: values.amount,
        method: values.method,
        transactionId: values.transactionId,
      }, { headers });

      message.success('Payment recorded successfully');
      paymentForm.resetFields();
      setPaymentModal(false);
      fetchFeeData();
    } catch (error) {
      message.error('Payment failed');
    }
  };

  const paymentColumns = [
    {
      title: 'Date',
      dataIndex: 'paymentDate',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => `₹${text}`,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={text === 'completed' ? 'green' : text === 'pending' ? 'orange' : 'red'}>
          {text?.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={6}>
          <Card>
            <Statistic
              title="Total Fees"
              value={fees?.totalFees || 0}
              prefix="₹"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Card>
            <Statistic
              title="Paid Amount"
              value={fees?.paidAmount || 0}
              prefix="₹"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Card>
            <Statistic
              title="Pending Dues"
              value={fees?.pendingDues || 0}
              prefix="₹"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {fees?.totalFees ? Math.round((fees.paidAmount / fees.totalFees) * 100) : 0}%
              </div>
              <div style={{ color: '#999' }}>Payment Progress</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Fee Payment History" style={{ marginTop: '20px' }} loading={loading}>
        <Space style={{ marginBottom: '15px' }}>
          <Button
            type="primary"
            icon={<CreditCardOutlined />}
            onClick={() => setPaymentModal(true)}
            disabled={!fees?.pendingDues || fees.pendingDues === 0}
          >
            Make Payment
          </Button>
          <Button icon={<DownloadOutlined />}>
            Download Fee Receipt
          </Button>
        </Space>

        <Table
          columns={paymentColumns}
          dataSource={paymentHistory.map((item, idx) => ({ ...item, key: idx }))}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Record Payment"
        open={paymentModal}
        onCancel={() => setPaymentModal(false)}
        footer={null}
      >
        <Form form={paymentForm} layout="vertical" onFinish={handlePayment}>
          <Form.Item
            name="amount"
            label="Amount (₹)"
            rules={[
              { required: true, message: 'Please enter amount' },
              {
                validator: (_, value) => {
                  if (!value || value <= 0 || value > (fees?.pendingDues || 0)) {
                    return Promise.reject('Invalid amount');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" placeholder={`Max: ₹${fees?.pendingDues}`} />
          </Form.Item>

          <Form.Item
            name="method"
            label="Payment Method"
            rules={[{ required: true, message: 'Please select payment method' }]}
          >
            <select style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9' }}>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Net Banking</option>
              <option>UPI</option>
            </select>
          </Form.Item>

          <Form.Item
            name="transactionId"
            label="Transaction ID"
            rules={[{ required: true, message: 'Please enter transaction ID' }]}
          >
            <Input placeholder="Enter transaction ID" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Submit Payment
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default FeesPage;
