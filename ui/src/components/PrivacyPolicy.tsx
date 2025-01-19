import { Layout, Typography } from "antd";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function PrivacyPolicy() {
  return (
    <Layout style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Content>
        <Typography>
          <Title level={2}>Privacy Policy</Title>
          <Paragraph>
            Tialinks is committed to safeguarding the privacy of its users. This
            Privacy Policy outlines how we handle your data and maintain
            transparency about our practices.
          </Paragraph>

          <Title level={3}>Data We Collect</Title>
          <Paragraph>
            To provide our URL shortening service, we only require your email
            address when you log in. This is the only piece of personally
            identifiable information we collect.
          </Paragraph>

          <Title level={3}>How We Use Your Data</Title>
          <Paragraph>
            Your email address is used solely for authentication and to
            personalize your experience. We do not share or sell your email
            address to third parties.
          </Paragraph>

          <Title level={3}>Data We Do Not Collect</Title>
          <Paragraph>
            Tialinks does not collect the IP addresses or actual geographic
            coordinates of individuals who click on your shortened links. Our
            focus is on respecting the privacy of both our users and their link
            visitors.
          </Paragraph>

          <Title level={3}>Third-Party Services</Title>
          <Paragraph>
            Tialinks uses third-party services to host and maintain its
            platform. These services adhere to strict privacy standards,
            ensuring the security of your data.
          </Paragraph>

          <Title level={3}>Data Security</Title>
          <Paragraph>
            We employ industry-standard measures to protect your data. However,
            no system is entirely secure, and we encourage users to take
            precautions when using online services.
          </Paragraph>

          <Title level={3}>Changes to This Policy</Title>
          <Paragraph>
            Tialinks reserves the right to update this Privacy Policy at any
            time. Users will be notified of significant changes through the
            website.
          </Paragraph>

          <Title level={3}>Contact Us</Title>
          <Paragraph>
            If you have any questions or concerns about this Privacy Policy,
            please reach out to us at support@tialinks.com.
          </Paragraph>
        </Typography>
      </Content>
    </Layout>
  );
}
