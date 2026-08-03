import React, { useState } from 'react';
import { Button, Layout, Menu, theme, Avatar } from 'antd';
import { Outlet,useLocation, useNavigate } from 'react-router-dom';
import { useUserStatusStore } from '../stores/useUserStatusStore';

// 导入图标
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    HomeOutlined,
    EditOutlined,
    FormOutlined,
    TagOutlined,
    CloseOutlined,
    TagsOutlined,
    SmileOutlined,
    RobotOutlined,
    CrownOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
import type { AvatarType } from '../stores/useUserStatusStore';


const avatarIconMap: Record<AvatarType, React.ReactNode> = {
    Icon1: <UserOutlined />,
    Icon2: <SmileOutlined />,
    Icon3: <RobotOutlined />,
    Icon4: <CrownOutlined />,
    Icon5: <ThunderboltOutlined />,
};


const { Header, Sider, Content } = Layout;


const Home: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();

    const userStatus = useUserStatusStore((state) => state);
    const avatar = userStatus.avatar;

    const isLoggedIn = userStatus.isLoggedIn;
    const userName = userStatus.user?.userName || null;


    const [searchText, setSearchText] = useState('');

    const sendSearchRequest = () => {
        console.log('検索リクエストを送信:', searchText);
    }

    const location = useLocation();



    let authButtons;
    let searchBar;

    if (isLoggedIn) {
        authButtons = (
            <div>
                <span>{userName + 'さん, こんにちは'}</span>
            </div>
        );
    } else {
        authButtons = (
            <div>
                <Button type="primary" onClick={() => navigate('/login')}>
                    ログイン
                </Button>

                <Button type="primary"
                    onClick={() => navigate('/register')}
                    style={{ marginLeft: '8px' }}>
                    新規登録
                </Button>
            </div>
        );
    }

    if (location.pathname === '/wordlist'|| location.pathname === '/testresult'
        || location.pathname === '/learning' || location.pathname === '/') 
     {
        searchBar = (
            <>
                <div style={{ marginRight: '16px' }}>
                    <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                </div>
                <Button type="primary" onClick={() => sendSearchRequest()}>
                    検索
                </Button>
            </>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <div style={{ textAlign: 'center' }}>
                    <Avatar
                        onClick={() => navigate('/myprofile')}
                        size="large" icon={avatarIconMap[avatar || 'Icon1']}
                        style={{ cursor: 'pointer', margin: '16px' }} />
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: (<HomeOutlined />),
                            label: 'Home',
                            onClick: () => navigate('/'),
                        },
                        {
                            key: '2',
                            icon: <EditOutlined />,
                            label: '学習',
                            onClick: () => navigate('/learning'),
                        },
                        {
                            key: '3',
                            icon: <FormOutlined />,
                            label: 'テスト',
                            onClick: () => navigate('/test'),
                        },
                        {
                            key: '4',
                            icon: <TagOutlined />,
                            label: '重要単語',
                            onClick: () => navigate('/wordlist'),
                        },
                        {
                            key: '5',
                            icon: <CloseOutlined />,
                            label: 'バツ単語',
                            onClick: () => navigate('/wordlist'),
                        },
                        {
                            key: '6',
                            icon: <TagsOutlined />,
                            label: '単語リスト',
                            onClick: () => navigate('/wordlist'),
                        },
                        {
                            key: '7',
                            icon: <UserOutlined />,
                            label: 'マイプロフィール',
                            onClick: () => navigate('/myprofile'),
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{
                    padding: 0, background: colorBgContainer,
                    alignItems: 'center', display: 'flex'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                            marginRight: '26px',
                        }}
                    />
                    {searchBar}
                    <div style={{ flex: 1 }}></div>
                    {authButtons}
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;