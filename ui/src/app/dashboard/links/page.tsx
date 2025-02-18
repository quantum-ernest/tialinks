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
  Switch,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import { SiSimpleanalytics } from "react-icons/si";
import { useLinks } from "@/hooks/Links";
import Image from "next/image";
import { useAuthContext } from "@/hooks/Auth";
import { useNotification } from "@/utils/notifications";
import { useUtm } from "@/hooks/Utm";
import { CiEdit, CiLock } from "react-icons/ci";
import dayjs from "dayjs";
import { LinkType } from "@/schemas/Link";
import { useRouter } from "next/navigation";
import { FaLockOpen } from "react-icons/fa";

const { Search } = Input;
const { Option } = Select;
const { Password } = Input;
const { Text } = Typography;

export default function LinksPage() {
  const {
    loading,
    linkData,
    fetchLinks,
    createLink,
    updateLink,
    setAuthenticationOnLink,
    disableAuthenticationOnLink,
  } = useLinks();
  const { utmList, fetchUtmList } = useUtm();
  const [selectedUtm, setSelectedUtm] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [passwordProtectedForm] = Form.useForm();
  const { checkAuth, isAuthenticated } = useAuthContext();
  const [isModelVisible, setIsModalVisible] = useState(false);
  const [isPasswordProtectedModelVisible, setIsPasswordProtectedModalVisible] =
    useState(false);
  const { openNotification } = useNotification();
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);
  const [switchPasswordProtected, setSwitchPasswordProtected] = useState<
    boolean | undefined
  >(editingLink?.password_protected);
  const router = useRouter();

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
  const filteredLinkData = linkData?.map((link) => ({
    ...link,
    campaign: link.utm?.campaign,
  }));
  const columns: TableProps<LinkType>["columns"] = [
    {
      title: "Original URL",
      dataIndex: "original_url",
      width: 100,
      key: "original_url",
      ellipsis: {
        showTitle: false,
      },
      render: (original_url: string, record: LinkType) => (
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
      sorter: (a: LinkType, b: LinkType) => a.count - b.count,
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
      title: "Protected",
      dataIndex: "password_protected",
      key: "password_protected",
      render: (password_protected: boolean, record) => (
        <Button
          type="text"
          form={"form"}
          style={{ color: "#7C3AED" }}
          onClick={() => showPasswordProtectedModal(record)}
        >
          <Tag color={password_protected ? "green" : "volcano"}>
            {password_protected ? <CiLock /> : <FaLockOpen />}
          </Tag>
        </Button>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: LinkType) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<SiSimpleanalytics color={"#7C3AED"} />}
            onClick={() =>
              router.push(
                `/dashboard/analytics?link_id=${encodeURIComponent(record.id)}`,
              )
            }
          >
            Analytics
          </Button>
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

  const showModal = (link?: LinkType) => {
    if (link) {
      setEditingLink(link);
      form.setFieldsValue(link);
      setExpiresAt(link.expires_at);
      setSelectedUtm(link.utm?.id || null);
    } else {
      setEditingLink(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };
  const showPasswordProtectedModal = (link?: LinkType) => {
    if (link) {
      setEditingLink(link);
      passwordProtectedForm.setFieldsValue(link);
    } else {
      setEditingLink(null);
      passwordProtectedForm.resetFields();
    }
    setIsPasswordProtectedModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingLink) {
        if (
          editingLink.expires_at !== expiresAt ||
          editingLink.utm_id !== selectedUtm
        ) {
          await updateLink(editingLink.id, selectedUtm, expiresAt);
        }
      } else {
        await createLink(values.original_url, selectedUtm, expiresAt);
        form.resetFields();
      }
    } catch (error) {
      if (error instanceof Error) {
        openNotification("error", error?.message);
      } else {
        openNotification("error", "Invalid Form Input");
        console.error(error);
      }
    }
    setIsModalVisible(false);
  };
  const handlePasswordProtectedOk = async () => {
    try {
      const values = await passwordProtectedForm.validateFields();
      console.log(switchPasswordProtected);
      if (editingLink) {
        if (values.new_password) {
          await setAuthenticationOnLink(values.new_password, editingLink.id);
        } else if (switchPasswordProtected === false) {
          await disableAuthenticationOnLink(editingLink.id);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        openNotification("error", error?.message);
      } else {
        openNotification("error", "Invalid Form Input");
        console.error(error);
      }
    }
    setIsPasswordProtectedModalVisible(false);
    passwordProtectedForm.resetFields();
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedUtm(null);
    setExpiresAt(null);
  };
  const handlePasswordProtectedCancel = () => {
    setIsPasswordProtectedModalVisible(false);
    passwordProtectedForm.resetFields();
  };

  const onchangeSwitch = (checked: boolean) => {
    setSwitchPasswordProtected(checked);
  };
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Link
            </Button>
          </Flex>
          <Table
            columns={columns}
            dataSource={filteredLinkData?.filter(
              (link: LinkType) =>
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
            title="Create/Edit New Link"
            open={isModelVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical" name="create_link_form">
              <Form.Item
                style={{ marginTop: 16 }}
                name="original_url"
                rules={[
                  {
                    required: true,
                    message: "Please input the URL to shorten!",
                  },
                  { type: "url", message: "Please enter a valid URL!" },
                ]}
              >
                <Input placeholder="Enter URL" />
              </Form.Item>
              <Form.Item>
                <Select
                  style={{ margin: "auto" }}
                  allowClear={true}
                  placeholder="Select Campaign"
                  value={selectedUtm || null}
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
                  placeholder="Select Expiry Date"
                  value={expiresAt ? dayjs(new Date(expiresAt)) : null}
                  needConfirm
                  minDate={dayjs(Date(), "YYYY-MM-DDTHH:mm:ss")}
                  onChange={(date, dateString) =>
                    setExpiresAt(dateString as string)
                  }
                />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="Enable/Disable Link Protection"
            open={isPasswordProtectedModelVisible}
            onOk={handlePasswordProtectedOk}
            onCancel={handlePasswordProtectedCancel}
          >
            <Form
              form={passwordProtectedForm}
              layout="vertical"
              name="set_password_protected_form"
            >
              <Form.Item style={{ marginTop: 16 }} name="new_password">
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
              <Space.Compact size="large">
                <Form.Item style={{ marginTop: 16, marginRight: 10 }}>
                  <Text>Disable Link Protection</Text>
                </Form.Item>
                <Form.Item style={{ marginTop: 16 }} name="password_protected">
                  <Switch
                    onChange={onchangeSwitch}
                    disabled={!editingLink?.password_protected}
                  />
                </Form.Item>
              </Space.Compact>
            </Form>
          </Modal>
        </div>
      )}
    </>
  );
}
