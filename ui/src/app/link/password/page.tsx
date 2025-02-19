"use client";

import { Button, Card, Form, Input, Spin, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "../../styles/login.css";
import { useSearchParams } from "next/navigation";
import { useLinks } from "@/hooks/Links";
import { Suspense } from "react";

const { Title } = Typography;
const { Password } = Input;

function LinkLoginForm() {
  const { authenticateLink, loading } = useLinks();
  const searchParams = useSearchParams();
  const shortcode = searchParams.get("shortcode");
  const handleSubmit = async ({ password }: { password: string }) => {
    if (shortcode) {
      await authenticateLink(password, shortcode);
    }
  };
  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name="password"
        wrapperCol={{ span: 24 }}
        rules={[{ required: true, message: "Please input password!" }]}
      >
        <Password
          name="password"
          placeholder="input password"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          style={{ marginTop: "10px" }}
          allowClear
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          className="login-button"
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default function LinkLoginPage() {
  return (
    <>
      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
            <Title level={3} style={{ color: "white", margin: 0 }}>
              TiaLinks
            </Title>
          </div>
          <div className="login-form">
            <Suspense fallback={<Spin size="large" fullscreen />}>
              <LinkLoginForm />
            </Suspense>
          </div>
        </Card>
      </div>
    </>
  );
}
