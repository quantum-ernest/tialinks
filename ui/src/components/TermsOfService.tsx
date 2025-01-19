import { Layout, Typography } from "antd";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function TermsOfService() {
  return (
    <Layout style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Content>
        <Typography>
          <Title level={2}>Terms of Use</Title>
          <Paragraph>
            Welcome to Tialinks! By using our services, you agree to comply with
            these Terms of Use. Please read them carefully before proceeding.
          </Paragraph>

          <Title level={3}>Use of Service</Title>
          <Paragraph>
            Tialinks provides a URL shortening service for personal and
            professional use. Users are solely responsible for the content and
            links they create, ensuring compliance with applicable laws and
            regulations.
          </Paragraph>

          <Title level={3}>Prohibited Activities</Title>
          <Paragraph>
            Users must not use Tialinks to create links that lead to malicious,
            illegal, or harmful content. Any abuse of the platform may result in
            account suspension or termination.
          </Paragraph>

          <Title level={3}>Disclaimer of Warranties</Title>
          <Paragraph>
            Tialinks is provided &#34;as is&#34; without warranties of any kind.
            We do not guarantee the uninterrupted availability or accuracy of
            the service.
          </Paragraph>

          <Title level={3}>Limitation of Liability</Title>
          <Paragraph>
            Tialinks is not liable for any indirect, incidental, or
            consequential damages arising from your use of the service.
          </Paragraph>

          <Title level={3}>License</Title>
          <Paragraph>
            Tialinks is an open-source project licensed under the GNU General
            Public License. You can find the source code and contribute to the
            project on our GitHub repository at{" "}
            <a
              href="https://github.com/quantum-ernest/tialinks"
              target="_blank"
            >
              https://github.com/quantum-ernest/tialinks
            </a>
            .
          </Paragraph>

          <Title level={3}>Changes to These Terms</Title>
          <Paragraph>
            Tialinks reserves the right to modify these Terms of Use at any
            time. Continued use of the service constitutes acceptance of the
            updated terms.
          </Paragraph>

          <Title level={3}>Contact Us</Title>
          <Paragraph>
            For questions or concerns regarding these Terms of Use, please
            contact us at support@tialinks.com.
          </Paragraph>
        </Typography>
      </Content>
    </Layout>
  );
}
