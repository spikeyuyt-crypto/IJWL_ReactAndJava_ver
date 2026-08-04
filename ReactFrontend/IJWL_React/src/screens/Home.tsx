import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, theme, Avatar, ConfigProvider } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUserStatusStore } from '../stores/useUserStatusStore';
import { useWordListStatusStore } from '../stores/useWordListStatusStore';
import '../css/Home.css';
import { Input, } from 'antd';
import type { GetProps } from 'antd';
import axios from 'axios';

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

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);


const SearchBar: React.FC = () => {
    const location = useLocation();
    const shouldShowSearch =
        location.pathname === '/wordlist' ||
        location.pathname === '/testresult' ||
        location.pathname === '/learning' ||
        location.pathname === '/';

    if (!shouldShowSearch) {
        return null;
    }

    return (
        <Search
            style={{
                width: 300,
                marginLeft: '20px',
            }}
            placeholder="単語を入力してください"
            allowClear
            enterButton="検索"
            size="large"
            onSearch={onSearch}
        />
    );
};

const Home: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();

    const userStatus = useUserStatusStore((state) => state);
    const setAvailableUnitNumbers = useWordListStatusStore((state) => state.setAvailableUnitNumbers);
    const avatar = userStatus.avatar;

    const isLoggedIn = userStatus.isLoggedIn;
    const userName = userStatus.user?.userName || null;

    let authButtons;

    type GetUnitNumbersApiResponse = {
    code: number;
    message: string;
    data: string[];
};

    useEffect(() => {
        async function getAvailableUnitNumbers() {
            try {
                const response = await axios.get<GetUnitNumbersApiResponse>(
                    "http://localhost:8080/word/getUnitNumbers"
                );
                setAvailableUnitNumbers(response.data.data.map(Number));
            } catch (error) {
                console.error("単元リストの取得に失敗しました", error);
            }
        }
        getAvailableUnitNumbers();
    }, [setAvailableUnitNumbers]);


    if (isLoggedIn) {
        authButtons = (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px'}}>
                    <p style={{ fontSize: '20px' ,fontWeight: 'bold' }}>{userName + 'さん, こんにちは'}</p>
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


    return (
        <Layout style={{ height: '100vh', overflow: 'hidden' }}>
            <Sider trigger={null} collapsible collapsed={collapsed} width={450} collapsedWidth={150}>
                <div className="demo-logo-vertical" />
                <div style={{ textAlign: 'center' }}>
                    <Avatar
                        onClick={() => navigate('/myprofile')}
                        size={120} icon={avatarIconMap[avatar || 'Icon1']}
                        style={{ cursor: 'pointer', margin: '16px', backgroundColor: '#5cbbe3' }} />
                </div>
                <ConfigProvider
                    theme={{
                        components: {
                            Menu: {
                                itemHeight: 65,          // 修改：菜单项高度
                                iconSize: 30,            // 修改：展开状态图标大小
                                collapsedIconSize: 40,   // 修改：折叠状态图标大小
                                fontSize: 30,            // 修改：菜单文字大小
                                iconMarginInlineEnd: 20,      // 修改：图标与文字的间距
                            },
                        },
                    }}
                >
                    <Menu
                        className="home-menu"
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
                                onClick: () => navigate('/scopechoosing'),
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
                </ConfigProvider>
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
                    <SearchBar />
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