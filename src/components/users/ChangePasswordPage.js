"use client";
import { Form, Input, Button } from "antd";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

export default function ChangePasswordPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.user._id, ...values }), // use _id not id
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Password updated successfully!");
      } else {
        alert(data.error || "Failed to update password.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Current Password" name="oldPassword" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="New Password" name="newPassword" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="Confirm Password" name="confirmPassword" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update Password
        </Button>
      </Form>
    </div>
  );
}
