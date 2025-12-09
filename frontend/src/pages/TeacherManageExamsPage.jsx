import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Table, Modal, message, Space, Spin, Empty, Tag, Layout } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import TeacherTopNav from '../components/teacher/TeacherTopNav';

const TeacherManageExamsPage = ({ user }) => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExams();
  }, [user?.id]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/exams');
      if (response.data.success) {
        setExams(response.data.exams || []);
      }
    } catch (error) {
      message.error('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = (examId) => {
    Modal.confirm({
      title: 'Delete Exam',
      content: 'Are you sure you want to delete this exam?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await api.delete(`/exams/${examId}`);
          message.success('Exam deleted successfully');
          fetchExams();
        } catch (error) {
          message.error('Failed to delete exam');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Exam Name',
      dataIndex: 'examName',
      key: 'examName',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Course',
      dataIndex: ['course', 'courseName'],
      key: 'course',
      render: (text) => text || '-'
    },
    {
      title: 'Type',
      dataIndex: 'examType',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Total Marks',
      dataIndex: 'totalMarks',
      key: 'marks'
    },
    {
      title: 'Passing Marks',
      dataIndex: 'passingMarks',
      key: 'passingMarks'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />}>
            View Results
          </Button>
          <Button icon={<EditOutlined />} size="small">
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteExam(record._id)}>
            Delete
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f8f9fc' }}>
      <TeacherTopNav profile={null} user={user} />
      <Layout.Content style={{ padding: '32px', background: '#f8f9fc', minHeight: 'calc(100vh - 100px)' }}>
        <Card style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Manage Exams</h2>
              <p style={{ color: '#666', marginTop: '4px' }}>View and manage all your exams</p>
            </Col>
            <Col>
              <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/teacher/create-exam')}>
                Create New Exam
              </Button>
            </Col>
          </Row>
        </Card>

        <Spin spinning={loading}>
          <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            {exams.length > 0 ? (
              <Table
                columns={columns}
                dataSource={exams.map((exam, idx) => ({ ...exam, key: idx }))}
                pagination={{ pageSize: 10 }}
                style={{ borderRadius: '12px' }}
              />
            ) : (
              <Empty description="No exams yet. Create one to get started!" />
            )}
          </Card>
        </Spin>
      </Layout.Content>
    </Layout>
  );
};

export default TeacherManageExamsPage;
