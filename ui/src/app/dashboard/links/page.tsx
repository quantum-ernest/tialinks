"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { SiSimpleanalytics } from "react-icons/si";
import { LinkParams, useLinks } from "@/hooks/Links";
import Image from "next/image";
import { useAuthContext } from "@/hooks/Auth";
import { useNotification } from "@/utils/notifications";
import { useUtm } from "@/hooks/Utm";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;

export default function LinksPage() {
  const { loading, linkData, fetchLinks, createLink } = useLinks();
  const { utmList, fetchUtmList } = useUtm();
  const [selectedUtm, setSelectedUtm] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const filteredLinkData = linkData?.map((link) => ({
    ...link,
    campaign: link.utm?.campaign,
  }));
  const columns = [
    {
      title: "Original URL",
      dataIndex: "original_url",
      width: 100,
      key: "original_url",
      ellipsis: {
        showTitle: false,
      },
      render: (original_url: string, record: LinkParams) => (
        <>
          <Flex align="center">
            <Image
              src={record.favicon_url}
              width={20}
              height={20}
              alt="favicon"
              style={{ marginRight: "5px" }}
              onError={(event: SyntheticEvent<HTMLImageElement, Event>) => {
                const target = event.target as HTMLImageElement;
                target.src = "/earth.png";
                target.srcset = "/earth.png";
              }}
            />
            <Tooltip placement="topLeft" title={original_url}>
              {original_url.length > 50
                ? original_url.substring(0, 50) + "..."
                : original_url}
            </Tooltip>
          </Flex>
        </>
      ),
    },
    {
      title: "Short URL",
      dataIndex: "generated_url",
      key: "generated_url",
      render: (text: string) => (
        <a href={`https://${text}`} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Campaign",
      dataIndex: "campaign",
      key: "campaign",
    },
    {
      title: "Clicks",
      dataIndex: "count",
      key: "count",
      sorter: (a: LinkParams, b: LinkParams) => a.count - b.count,
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "volcano"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<SiSimpleanalytics color={"#7C3AED"} />}>
            Analytics
          </Button>
        </Space>
      ),
    },
  ];
  const { checkAuth, isAuthenticated } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openNotification } = useNotification();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await createLink(values.url, selectedUtm, expiresAt);
      form.resetFields();
    } catch (error) {
      if (error instanceof Error) {
        openNotification("error", error?.message);
      } else {
        openNotification("error", "Invalid Form Input");
        console.error(error);
      }
    }
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  useEffect(() => {
    const _fetchData = async () => {
      checkAuth();
      if (isAuthenticated) {
        await fetchLinks();
        await fetchUtmList();
      }
    };
    _fetchData().catch((error) => {
      openNotification("error", error);
    });
  }, [isAuthenticated]);
  return (
    <>
      {!isAuthenticated ? (
        <Spin size="large" fullscreen />
      ) : (
        <div className="space-y-4">
          <Flex justify="space-between" align="center">
            <Search
              placeholder="Search..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "40%" }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              Link
            </Button>
          </Flex>
          <Table
            columns={columns}
            dataSource={filteredLinkData?.filter(
              (link: LinkParams) =>
                link.original_url
                  .toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                link.shortcode.toLowerCase().includes(searchText.toLowerCase()),
            )}
            loading={loading}
            pagination={{
              pageSize: 10,
              responsive: true,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            rowKey="key"
            scroll={{ x: "max-content" }}
            size="middle"
          />

          <Modal
            title="Create New Link"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical" name="create_link_form">
              <Form.Item
                name="url"
                label="URL to shorten"
                rules={[
                  {
                    required: true,
                    message: "Please input the URL to shorten!",
                  },
                  { type: "url", message: "Please enter a valid URL!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Select
                  style={{ margin: "auto" }}
                  allowClear={true}
                  defaultValue={null}
                  onChange={(value) => setSelectedUtm(value)}
                >
                  {utmList?.map((utm) => (
                    <Option key={utm.id} value={utm.id}>
                      {utm.campaign}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DDTHH:mm:ss"
                  showTime
                  minDate={dayjs(Date(), "YYYY-MM-DDTHH:mm:ss")}
                  onChange={(date, dateString) =>
                    setExpiresAt(dateString as string)
                  }
                  needConfirm
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )}
    </>
  );
}
