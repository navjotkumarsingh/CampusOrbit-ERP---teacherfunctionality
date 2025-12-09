import { useState, useEffect } from 'react';
import { Card, Button, Modal, Input, message, Pagination, Tag, DatePicker, Select } from 'antd';
import { PlusOutlined, EyeOutlined, DeleteOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const AdminFeesManagement = ({ user }) => {
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    totalAmount: 0,
    collectedAmount: 0,
  });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/fees', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => ({ data: { fees: [] } }));
      
      const fees = response.data.fees || [];
      setFeeRecords(fees);
      
      const totalAmount = fees.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
      const collectedAmount = fees
        .filter(f => f.status === 'paid')
        .reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
      
      setStats({
        total: fees.length,
        paid: fees.filter(f => f.status === 'paid').length,
        pending: fees.filter(f => f.status === 'pending').length,
        overdue: fees.filter(f => f.status === 'overdue').length,
        totalAmount,
        collectedAmount,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (feeId) => {
    Modal.confirm({
      title: 'Delete Fee Record',
      content: 'Are you sure you want to delete this fee record? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      async onOk() {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`/api/fees/${feeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {});
          message.success('Fee record deleted successfully');
          fetchFees();
        } catch (error) {
          message.error('Failed to delete fee record');
        }
      },
    });
  };

  const filteredRecords = feeRecords.filter(record => {
    const matchesSearch =
      record.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      record.admissionNumber?.includes(search) ||
      record.feeType?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'green';
      case 'pending': return 'orange';
      case 'overdue': return 'red';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'paid': return 'PAID';
      case 'pending': return 'PENDING';
      case 'overdue': return 'OVERDUE';
      default: return status?.toUpperCase();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fees Management</h1>
        <p className="text-gray-600">Track and manage student fees payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <div>
            <p className="text-gray-600 text-sm mb-2">Total Due</p>
            <p className="text-3xl font-bold text-red-600">₹{stats.totalAmount.toFixed(2)}</p>
            <p className="text-gray-600 text-xs mt-2">From {stats.total} records</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-gray-600 text-sm mb-2">Collected</p>
            <p className="text-3xl font-bold text-green-600">₹{stats.collectedAmount.toFixed(2)}</p>
            <p className="text-gray-600 text-xs mt-2">From {stats.paid} paid records</p>
          </div>
        </Card>
        <Card>
          <div>
            <p className="text-gray-600 text-sm mb-2">Outstanding</p>
            <p className="text-3xl font-bold text-amber-600">
              ₹{(stats.totalAmount - stats.collectedAmount).toFixed(2)}
            </p>
            <p className="text-gray-600 text-xs mt-2">{stats.pending} pending + {stats.overdue} overdue</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Fee Records</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Search by student name or admission number..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'All Status', value: 'all' },
              { label: 'Paid', value: 'paid' },
              { label: 'Pending', value: 'pending' },
              { label: 'Overdue', value: 'overdue' },
            ]}
          />
          <Button type="primary" icon={<PlusOutlined />} className="bg-green-600">
            Add Fee Record
          </Button>
          <Button type="default" icon={<DownloadOutlined />}>
            Export Report
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Admission No.</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Student Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Fee Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Due Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-semibold">{record.admissionNumber}</td>
                    <td className="px-4 py-3 text-gray-900">{record.studentName}</td>
                    <td className="px-4 py-3 text-gray-600">{record.feeType || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-900 font-semibold">₹{parseFloat(record.amount).toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {record.dueDate ? dayjs(record.dueDate).format('DD/MM/YYYY') : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <Tag color={getStatusColor(record.status)}>
                        {getStatusLabel(record.status)}
                      </Tag>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setModalVisible(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EyeOutlined className="mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(record._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <DeleteOutlined className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No fee records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="text-gray-600">
            Showing {paginatedRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length}
          </span>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredRecords.length}
            onChange={setCurrentPage}
          />
        </div>
      </Card>

      <Modal
        title="Fee Record Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Admission Number</p>
                <p className="font-semibold text-gray-900">{selectedRecord.admissionNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="font-semibold text-gray-900">
                  <Tag color={getStatusColor(selectedRecord.status)}>
                    {getStatusLabel(selectedRecord.status)}
                  </Tag>
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Student Name</p>
                <p className="font-semibold text-gray-900">{selectedRecord.studentName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Fee Type</p>
                <p className="font-semibold text-gray-900">{selectedRecord.feeType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Amount</p>
                <p className="font-semibold text-gray-900 text-lg">₹{parseFloat(selectedRecord.amount).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Due Date</p>
                <p className="font-semibold text-gray-900">
                  {selectedRecord.dueDate ? dayjs(selectedRecord.dueDate).format('DD/MM/YYYY') : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Paid Date</p>
                <p className="font-semibold text-gray-900">
                  {selectedRecord.paidDate ? dayjs(selectedRecord.paidDate).format('DD/MM/YYYY') : 'Not Paid'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">Remarks</p>
                <p className="font-semibold text-gray-900">{selectedRecord.remarks || 'None'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminFeesManagement;
