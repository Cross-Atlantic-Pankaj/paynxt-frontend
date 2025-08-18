"use client";
import { useState } from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  LockOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import ProfilePage from "@/components/users/ProfilePage";
import OrdersPage from "@/components/users/OrdersPage";
import ChangePasswordPage from "@/components/users/ChangePasswordPage";

export default function UsersPage() {
  const [selectedKey, setSelectedKey] = useState("profile");
  const [isOpen, setIsOpen] = useState(true);

  const renderContent = () => {
    switch (selectedKey) {
      case "profile":
        return <ProfilePage />;
      case "orders":
        return <OrdersPage />;
      case "password":
        return <ChangePasswordPage />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="flex min-h-screen p-6 relative">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 border-r pr-4 bg-white shadow-md
        ${isOpen ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key)}
          style={{ height: "100%" }}
        >
          <Menu.Item key="profile" icon={<UserOutlined />}>
            Profile
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
            Orders
          </Menu.Item>
          <Menu.Item key="password" icon={<LockOutlined />}>
            Change Password
          </Menu.Item>
        </Menu>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-6 left-2 bg-gray-200 rounded-full p-2 shadow-md hover:bg-gray-300 transition"
      >
        {isOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      </button>

      {/* Main Content */}
      <div className={`transition-all duration-300 pl-6 flex-1`}>
        {renderContent()}
      </div>
    </div>
  );
}
