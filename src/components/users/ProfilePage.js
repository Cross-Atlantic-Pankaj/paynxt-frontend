"use client";
import { Form, Input, Button, Switch } from "antd";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { user, login } = useUser(); // include login from context
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            const formValues = {
                Firstname: user.user.Firstname || "",
                Lastname: user.user.Lastname || "",
                email: user.user.email || "",
                jobTitle: user.user.jobTitle || "",
                companyName: user.user.companyName || "",
                phoneNumber: user.user.phoneNumber || "",
                country: user.user.country || "",
                newsletter: user.user.newsletter || false,
            };
            form.setFieldsValue(formValues);
        }
    }, [user, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await fetch("/api/users/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (data.success) {
                // Update in context + localStorage
                login(data);  // or login({ user: data.user })
                alert("Profile updated successfully!");
            } else {
                alert(data.error || "Failed to update profile");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("An error occurred while updating the profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            {user ? (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        Firstname: "",
                        Lastname: "",
                        email: "",
                        jobTitle: "",
                        companyName: "",
                        phoneNumber: "",
                        country: "",
                        newsletter: false,
                    }}
                >
                    <Form.Item
                        label="First Name"
                        name="Firstname"
                        rules={[{ required: true, message: "Please enter your first name" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="Lastname"
                        rules={[{ required: true, message: "Please enter your last name" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Job Title" name="jobTitle">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Company Name" name="companyName">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="phoneNumber">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Country" name="country">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Sign up for Newsletter"
                        name="newsletter"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
}
