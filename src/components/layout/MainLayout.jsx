import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Layout } from 'antd';
const { Content, Header } = Layout;

export default function MainLayout() {
  return (
    <>
      <Layout>
        <Navbar />
        {/* <Header style={headerStyle}>Header</Header> */}
        <Content style={{ padding: '0 48px', marginTop: 64, minHeight: 'calc(100vh - 64px - 70px)' }}>
        <Outlet />
        </Content>
      <Footer />
      </Layout>
    </>
  );
}
