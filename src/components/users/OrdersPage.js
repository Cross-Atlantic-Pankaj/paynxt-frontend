"use client";
import { useEffect, useState } from "react";
import { Table } from "antd";
import { useUser } from "@/context/UserContext";

export default function OrdersPage() {
    const { user } = useUser();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        console.log("User:", user); // Debug: Should log { id: '68a00c4b19467df897be57f6', email: 'swardesai1904@gmail.com', ... }
        if (user?.user.email) {
            fetch(`/api/user-order?email=${encodeURIComponent(user.user.email)}`)
                .then((res) => res.json())
                .then((data) => {
                    //   console.log("Raw API response:", data); // Debug API response
                    if (Array.isArray(data)) {
                        setOrders(data);
                        // console.log("Orders state:", data); // Debug orders state
                    } else {
                        setOrders([]);
                        console.error("Unexpected orders response:", data);
                    }
                })
                .catch((error) => {
                    console.error("Fetch error:", error);
                    setOrders([]);
                });
        } else {
            console.warn("No user email available");
            setOrders([]);
        }
    }, [user]);

    const columns = [
        { title: "Title", dataIndex: "title", key: "title" },
        { title: "Price", dataIndex: "price", key: "price" },
        { title: "Summary", dataIndex: "summary", key: "summary" },
        { title: "Date", dataIndex: "createdAt", key: "createdAt" },
    ];

    //   console.log("Orders1: ", orders); // Debug: Should log orders array

    const tableData = Array.isArray(orders)
        ? orders.flatMap((o, orderIndex) => {
            if (!o.items || !Array.isArray(o.items)) {
                console.warn("Order missing items:", o);
                return [];
            }
            return o.items.map((item, itemIndex) => {
                if (!item.title || !item.price || !item.summary) {
                    console.warn("Invalid item:", item);
                }

                // Extract title up to first dash
                const formattedTitle = item.title?.split("-")[0].trim();

                // Trim summary to 100 chars
                const formattedSummary = item.summary
                    ? item.summary.length > 100
                        ? item.summary.substring(0, 100) + "..."
                        : item.summary
                    : "";

                return {
                    ...item,
                    title: formattedTitle,
                    summary: formattedSummary,
                    key: `${orderIndex}-${itemIndex}`,
                    createdAt: new Date(o.createdAt).toLocaleDateString("en-GB"),
                };
            });
        })
        : [];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
            {tableData.length === 0 && <p>No orders found.</p>}
            <Table rowKey="key" columns={columns} dataSource={tableData} bordered />
        </div>
    );
}