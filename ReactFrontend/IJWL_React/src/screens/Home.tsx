import React, { useState, useEffect } from 'react';
import { Button, Layout, Menu, theme, Avatar, ConfigProvider, Modal, message, Switch } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUserStatusStore } from '../stores/useUserStatusStore';
import { useWordListStatusStore } from '../stores/useWordListStatusStore';
import '../css/Home.css';
import { Input, } from 'antd';
import type { GetProps } from 'antd';
import axios from 'axios';
import { WordListStatus } from '../stores/useWordListStatusStore';
import { IoMdSunny } from "react-icons/io";
import { PiMoonLight } from "react-icons/pi";
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


export const avatarIconMap: Record<AvatarType, React.ReactNode> = {
    Icon1: <UserOutlined />,
    Icon2: <SmileOutlined />,
    Icon3: <RobotOutlined />,
    Icon4: <CrownOutlined />,
    Icon5: <ThunderboltOutlined />,
};


const { Header, Sider, Content } = Layout;

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

type SearchResult = {
    japanese: string;
    chinese: string;
}


interface SearchResultModalProps {
    searchResult: SearchResult[];
    isModalOpen: boolean;
    onClose: () => void;
}

interface SearchBarProps {
    onSearchSuccess: (result: SearchResult[]) => void;
    onSearchError: () => void;
}

const SearchResultModal: React.FC<SearchResultModalProps> = ({
    searchResult,
    isModalOpen,
    onClose,
}) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (isModalOpen) {
            setIndex(0);
        }
    }, [isModalOpen, searchResult]);

    const currentResult = searchResult[index];

    return (
        <Modal
            title="検索結果"
            centered
            open={isModalOpen}
            onOk={onClose}
            onCancel={onClose}
            okText="閉じる"
            cancelButtonProps={{
                style: {
                    display: "none",
                },
            }}
        >
            {currentResult ? (
                <>
                    <p>日本語：{currentResult.japanese}</p>
                    <p>中国語：{currentResult.chinese}</p>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Button
                            onClick={() => setIndex((previousIndex) => previousIndex - 1,)}
                            disabled={index === 0}
                            style={{ visibility: index === 0 ? "hidden" : "visible" }}>
                            前へ
                        </Button>

                        <span>
                            {index + 1} / {searchResult.length}
                        </span>

                        <Button
                            onClick={() => setIndex((previousIndex) => previousIndex + 1,)}
                            disabled={index >= searchResult.length - 1}
                            style={{ visibility: index >= searchResult.length - 1 ? "hidden" : "visible" }}>
                            次へ
                        </Button>
                    </div>
                </>
            ) : (
                <p>検索結果がありません</p>
            )}
        </Modal>
    );
};

const SearchBar: React.FC<SearchBarProps> = ({
    onSearchSuccess,
    onSearchError,
}) => {
    const location = useLocation();

    const shouldShowSearch =
        location.pathname === "/wordlist" ||
        location.pathname === "/testresult" ||
        location.pathname === "/learning" ||
        location.pathname === "/";


    const handleSearch: SearchProps["onSearch"] = async (value) => {
        const searchValue = value.trim();

        if (searchValue === "") {
            message.warning("検索語を入力してください");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/word/searchWord",
                searchValue,
                {
                    headers: {
                        "Content-Type": "text/plain",
                    },
                },
            );

            const result: SearchResult[] =
                response.data.data ?? [];

            onSearchSuccess(result);
        } catch (error) {
            console.error("単語の検索に失敗しました", error);

            onSearchError();
        }
    };

    if (!shouldShowSearch) {
        return null;
    }

    return (
        <Search
            style={{
                width: 300,
                marginLeft: "20px",
            }}
            placeholder="単語を入力してください"
            allowClear
            enterButton="検索"
            size="large"
            onSearch={handleSearch}
        />
    );
};

const Home: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [searchResult, setSearchResult] =
        useState<SearchResult[]>([]);

    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate();

    const userStatus = useUserStatusStore((state) => state);

    const setWordListStatus = useWordListStatusStore(
        (state) => state.setWordListStatus
    );

    const setAvailableUnitNumbers = useWordListStatusStore(
        (state) => state.setAvailableUnitNumbers
    );
    const avatar = userStatus.avatar;

    const isLoggedIn = userStatus.isLoggedIn;
    const userName = userStatus.user?.userName || null;

    const darkMode = userStatus.darkMode;

    const setDarkMode = userStatus.switchDarkMode;

    const wordListStatus = useWordListStatusStore(
        (state) => state.wordListStatus
    );

    let currentKey = "1";

    if (location.pathname === "/learning") {
        currentKey = "2";
    } else if (location.pathname === "/scopechoosing") {
        currentKey = "3";
    } else if (location.pathname === "/myprofile") {
        currentKey = "7";
    } else if (location.pathname === "/wordlist") {
        if (wordListStatus === WordListStatus.important) {
            currentKey = "4";
        } else if (wordListStatus === WordListStatus.batsu) {
            currentKey = "5";
        } else {
            currentKey = "6";
        }
    }

    const darkModeSwitch = (
        <Switch

            defaultChecked={darkMode}
            onChange={setDarkMode}
            style={{
                marginRight: '20px',
                transform: "scale(2)",
                transformOrigin: "right center"
            }}
            checkedChildren={<PiMoonLight />}
            unCheckedChildren={<IoMdSunny />}
        />
    )

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
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {userName + '　さん, こんにちは'}
                </p>
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

    const {
        token: {
            colorPrimary,
            colorPrimaryBg,
            colorPrimaryActive,
            colorTextLightSolid,
        },
    } = theme.useToken();


    return (
        <Layout style={{ height: '100vh', overflow: 'hidden' }}>
            <SearchResultModal
                searchResult={searchResult}
                isModalOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <Sider trigger={null} collapsible
                collapsed={collapsed} width={450} collapsedWidth={150}
                style={{ backgroundColor: colorPrimaryActive }} >
                <div className="demo-logo-vertical" />
                <div style={{ textAlign: 'center' }}>
                    <Avatar
                        onClick={() => navigate('/myprofile')}
                        size={120}
                        icon={avatarIconMap[avatar || 'Icon1']}
                        style={{ cursor: 'pointer', margin: '16px', backgroundColor: '#5cbbe3' }} />
                </div>
                <ConfigProvider
                    theme={{
                        components: {
                            Menu: {
                                algorithm: true,
                                itemHeight: 65,
                                iconSize: 30,
                                collapsedIconSize: 40,
                                fontSize: 30,
                                iconMarginInlineEnd: 20,
                                darkItemBg: colorPrimary,
                                darkItemSelectedBg: colorPrimaryActive,
                                darkItemColor: colorTextLightSolid,
                            },
                        },
                    }}
                >
                    <Menu
                        className="home-menu"
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        selectedKeys={[currentKey]}
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
                                onClick: () => {
                                    setWordListStatus(WordListStatus.important);
                                    navigate('/wordlist')
                                },
                            },
                            {
                                key: '5',
                                icon: <CloseOutlined />,
                                label: 'バツ単語',
                                onClick: () => {
                                    setWordListStatus(WordListStatus.batsu);
                                    navigate('/wordlist')
                                },
                            },
                            {
                                key: '6',
                                icon: <TagsOutlined />,
                                label: '単語リスト',
                                onClick: () => {
                                    setWordListStatus(WordListStatus.default);
                                    navigate('/wordlist')
                                },
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
                    padding: 0, background: colorPrimaryBg,
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
                    <SearchBar
                        onSearchSuccess={(result) => {
                            setSearchResult(result);
                            setIsModalOpen(true);
                        }}
                        onSearchError={() => {
                            setSearchResult([]);
                            setIsModalOpen(true);
                        }}
                    />
                    <div style={{ flex: 1 }}></div>
                    {darkModeSwitch}
                    {authButtons}
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorPrimaryBg,
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