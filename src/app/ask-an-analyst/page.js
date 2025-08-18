'use client';
import { Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import toast, { Toaster } from 'react-hot-toast';

export default function AskAnalystPage() {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  console.log('User from context:', user);

  useEffect(() => {
    if (user && user.user) {
      console.log('Setting form values:', {
        firstName: user.user.Firstname || '',
        lastName: user.user.Lastname || '',
        email: user.user.email || '',
      });
      form.setFieldsValue({
        firstName: user.user.Firstname || '',
        lastName: user.user.Lastname || '',
        email: user.user.email || '',
      });
      setFormKey((prev) => prev + 1); // Force form re-render
    }
  }, [user, form]);

  const onFinish = async (values) => {
    if (!user) {
      toast.error('Please log in to submit a query');
      router.push('/login?callbackUrl=/ask-an-analyst');
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (file) {
      formData.append('file', file);
    }

    setLoading(true);
    const toastId = toast.loading('Submitting query...');
    try {
      const res = await fetch('/api/ask-analyst', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Query submitted successfully', { id: toastId });
        form.resetFields();
        setFile(null);
      } else {
        toast.error(data.message || 'Submission failed', { id: toastId });
      }
    } catch (err) {
      toast.error('Something went wrong', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return <div style={{ textAlign: 'center', padding: 20 }}>Loading...</div>;
  }

  if (!user) {
    router.push('/login?callbackUrl=/ask-an-analyst');
    return null;
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <Toaster position="top-right" />
      <h2>Ask an Analyst</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        key={formKey}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter your first name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter your last name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email Address"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: 'Please enter a subject' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="query"
          label="Your Query"
          rules={[{ required: true, message: 'Please enter your query' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Upload Document">
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
 mơ            fileList={file ? [file] : []}
            onRemove={() => setFile(null)}
            accept=".pdf,.doc,.docx"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} disabled={userLoading}>
          Submit
        </Button>
      </Form>
    </div>
  );
}