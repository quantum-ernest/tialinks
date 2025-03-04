"use client";

import { useEffect } from "react";
import { Button, Card, Col, Form, Input, Row, Spin } from "antd";
import { getUserObject } from "@/utils/auth";
import { useUser } from "@/hooks/User";
import { useAuthContext } from "@/hooks/Auth";
import { UserType } from "@/schemas/User";

export default function SettingsPage() {
  const { checkAuth, isAuthenticated } = useAuthContext();
  const [form] = Form.useForm();
  const { updateUser, loading } = useUser();
  const user = getUserObject();
  const userData = user ? JSON.parse(user) : null;

  useEffect(() => {
    checkAuth();
  }, [isAuthenticated]);

  const onFinish = async ({ name }: { name: Omit<UserType, "email"> }) => {
    await updateUser(name);
  };
  return (
    <>
      {!isAuthenticated ? (
        <Spin size="large" fullscreen />
      ) : (
        <Row>
          <Col xs={24} sm={12} md={12} lg={12}>
            <Card>
              <Form
                form={form}
                layout="vertical"
                initialValues={userData}
                onFinish={onFinish}
              >
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    { required: true, message: "Please input your name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="email" label="Email">
                  <Input disabled />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                      display: "block",
                      margin: "0 auto",
                      padding: "10px 20px",
                    }}
                  >
                    Update Name
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
}
