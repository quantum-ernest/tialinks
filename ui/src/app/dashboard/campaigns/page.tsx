"use client";
import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Space,
  Spin,
  Table,
  TableProps,
  Tag,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useUtm } from "@/hooks/Utm";
import { CiEdit } from "react-icons/ci";
import Search from "antd/es/input/Search";
import { useAuthContext } from "@/hooks/Auth";
import { useNotification } from "@/utils/notifications";
import { UtmType } from "@/schemas/Utm";

export default function UtmPage() {
  const { utmList, fetchUtmList, loading, createUtm, updateUtm } = useUtm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUtm, setEditingUtm] = useState<UtmType | null>(null);
  const { checkAuth, isAuthenticated } = useAuthContext();
  const { openNotification } = useNotification();
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    const _fetchData = async () => {
      checkAuth();
      if (isAuthenticated) {
        await fetchUtmList();
      }
    };
    _fetchData().catch((error) => {
      openNotification("error", error);
    });
  }, [isAuthenticated]);

  const showModal = (utm?: UtmType) => {
    if (utm) {
      setEditingUtm(utm);
      form.setFieldsValue(utm);
    } else {
      setEditingUtm(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUtm) {
        await updateUtm(editingUtm.id, values);
      } else {
        await createUtm(values);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns: TableProps<UtmType>["columns"] = [
    {
      title: "Campaign",
      dataIndex: "campaign",
      key: "campaign",
      ellipsis: true,
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Medium",
      dataIndex: "medium",
      key: "medium",
    },
    {
      title: "Link Count",
      dataIndex: "link_count",
      key: "link_count",
      sorter: (a: UtmType, b: UtmType) =>
        (a.link_count ?? 0) - (b.link_count ?? 0),
      render: (link_count) => (
        <Tag color={link_count > 1 ? "green" : "volcano"} key={link_count}>
          {link_count}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: UtmType) => (
        <Space size="middle">
          <Button
            type="text"
            form={"form"}
            style={{ color: "#7C3AED" }}
            icon={<CiEdit color={"#7C3AED"} />}
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      {!isAuthenticated ? (
        <Spin size="large" fullscreen />
      ) : (
        <div className="space-y-6">
          <Flex justify="space-between" align="center">
            <Search
              placeholder="Search..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "40%" }}
            />
            <Button
              type="primary"
              form={"form"}
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              UTM
            </Button>
          </Flex>

          <Table
            columns={columns}
            dataSource={utmList?.filter(
              (utm: UtmType) =>
                utm.campaign.toLowerCase().includes(searchText.toLowerCase()) ||
                utm.source.toLowerCase().includes(searchText.toLowerCase()) ||
                utm.medium.toLowerCase().includes(searchText.toLowerCase()),
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
          />
          <Modal
            title={editingUtm ? "Edit UTM" : "Create New UTM"}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical" name="utm_form">
              <Form.Item
                name="campaign"
                label="Campaign"
                rules={[
                  {
                    required: true,
                    message: "Please input the campaign name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="source"
                label="Source"
                rules={[
                  { required: true, message: "Please input the source!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="medium" label="Medium">
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      )}
    </>
  );
}
