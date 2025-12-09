import { useState, useEffect } from 'react';
import { Row, Col, Card, List, Button, Modal, Form, Input, message, Badge, Tag, Space, Empty } from 'antd';
import { MailOutlined, SendOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import axios from 'axios';

const MessagesPage = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [composeModal, setComposeModal] = useState(false);
  const [composeForm] = Form.useForm();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [detailModal, setDetailModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get('/api/messages', { headers });
      setMessages(response.data.messages || []);
    } catch (error) {
      message.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(`/api/messages/${messageId}/mark-as-read`, {}, { headers });
      fetchMessages();
    } catch (error) {
      message.error('Failed to update message');
    }
  };

  const handleDelete = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`/api/messages/${messageId}`, { headers });
      message.success('Message deleted');
      fetchMessages();
    } catch (error) {
      message.error('Failed to delete message');
    }
  };

  const handleCompose = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post('/api/messages/send', values, { headers });
      message.success('Message sent successfully');
      composeForm.resetFields();
      setComposeModal(false);
      fetchMessages();
    } catch (error) {
      message.error('Failed to send message');
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24}>
          <Card>
            <Row justify="space-between" align="middle">
              <Col>
                <h2>
                  <MailOutlined /> Messages
                  {unreadCount > 0 && <Badge count={unreadCount} style={{ marginLeft: '10px' }} />}
                </h2>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={() => setComposeModal(true)}
                >
                  Compose Message
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card title="Inbox" loading={loading}>
            {messages.length === 0 ? (
              <Empty description="No messages" />
            ) : (
              <List
                dataSource={messages}
                renderItem={(msg) => (
                  <List.Item
                    key={msg._id}
                    style={{
                      backgroundColor: msg.isRead ? 'transparent' : '#f0f5ff',
                      padding: '12px',
                      borderRadius: '4px',
                      marginBottom: '8px',
                    }}
                    extra={
                      <Space>
                        {!msg.isRead && (
                          <Button
                            type="text"
                            icon={<CheckOutlined />}
                            size="small"
                            onClick={() => handleMarkAsRead(msg._id)}
                          />
                        )}
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          size="small"
                          onClick={() => handleDelete(msg._id)}
                          danger
                        />
                      </Space>
                    }
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <span>{msg.subject}</span>
                          {!msg.isRead && <Tag color="blue">New</Tag>}
                        </Space>
                      }
                      description={
                        <div>
                          <p style={{ marginBottom: '4px' }}>From: {msg.from?.name || 'Admin'}</p>
                          <p style={{ marginBottom: '4px' }}>
                            {msg.message?.substring(0, 100)}
                            {msg.message?.length > 100 ? '...' : ''}
                          </p>
                          <p style={{ color: '#999', fontSize: '12px' }}>
                            {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Quick Stats">
            <div style={{ marginBottom: '15px' }}>
              <p><strong>Total Messages:</strong> {messages.length}</p>
              <p><strong>Unread:</strong> <Badge count={unreadCount} /></p>
              <p><strong>Read:</strong> {messages.length - unreadCount}</p>
            </div>
            <hr />
            <h4>Message Categories</h4>
            <ul>
              <li>Academic Updates</li>
              <li>Administrative Notices</li>
              <li>Fee Notifications</li>
              <li>Event Announcements</li>
            </ul>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Compose Message"
        open={composeModal}
        onCancel={() => {
          setComposeModal(false);
          composeForm.resetFields();
        }}
        footer={null}
      >
        <Form form={composeForm} layout="vertical" onFinish={handleCompose}>
          <Form.Item
            name="recipientId"
            label="Send To"
            rules={[{ required: true, message: 'Please select recipient' }]}
          >
            <select style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d9d9d9', width: '100%' }}>
              <option>Admin</option>
              <option>Dean</option>
              <option>Faculty</option>
            </select>
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please enter subject' }]}
          >
            <Input placeholder="Message subject" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please enter message' }]}
          >
            <Input.TextArea
              placeholder="Type your message here..."
              rows={5}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block icon={<SendOutlined />}>
            Send Message
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default MessagesPage;
