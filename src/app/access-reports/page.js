'use client';

import { useEffect, useState } from 'react';
import { Card, Button, Spin, message } from 'antd';
import axios from 'axios';

export default function UserAccessReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId'); // or get from auth context/session
      console.log('userId from localStorage:', userId);
      const res = await axios.post('/api/user/reports', { userId });

      if (res.data.success) {
        setReports(res.data.data);
      } else {
        message.error('Failed to load reports');
      }
    } catch (err) {
      console.error(err);
      message.error('Error loading reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'report';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Your Reports</h1>
      {loading ? (
        <Spin />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <Card
              key={report._id}
              title={report.report_title.split(' - ')[0]}
              extra={
                report.fileUrl && report.fileUrl !== '' ? (
                  <Button type="primary" onClick={() => handleDownload(report.fileUrl, report.report_title)}>
                    Download
                  </Button>
                ) : (
                  <Button disabled>Available Soon</Button>
                )
              }
            >
              <p>{report.report_summary?.slice(0, 100)}...</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
