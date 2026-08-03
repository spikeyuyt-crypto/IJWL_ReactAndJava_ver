import React from 'react';
import type { FormProps } from 'antd';
import { Button, Divider, Form, Input, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserStatusStore } from '../stores/useUserStatusStore';

type FieldType = {
    username?: string;
    password?: string;
};

const Login: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const userStatus = useUserStatusStore((state) => state);

    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        async function login() {
            try {
                const response =await axios.post('http://localhost:8080/user/signIn',
                    values,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const data = response.data;
                console.log(data);

                userStatus.login({
                    userId: data.userId,
                    userName: data.userName,
                    backgroundColor: data.backgroundColor,
                    fontSize: data.fontSize,
                });
                messageApi.success('ログインに成功しました。\n 3秒後にホームページにリダイレクトされます。');
                setTimeout(() => { navigate('/'); }, 3000);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const status = error.response?.status;
                    switch (status) {
                        case 401:
                            messageApi.error(
                                'ユーザー名またはパスワードが正しくありません',
                            );
                            break;

                        case 404:
                            messageApi.warning(
                                'ユーザーが見つかりませんでした',
                            );
                            break;

                        case 500:
                            messageApi.error(
                                'サーバーエラーが発生しました',
                            );
                            break;

                        default:
                            messageApi.error(
                                'ログイン処理中にエラーが発生しました',
                            );
                            break;
                    }

                    return;
                }
                messageApi.error(
                    '予想外のエラーが発生しました',
                );
            }
        }
        login();
    };


    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <div style={{
            display: 'flex', justifyContent: 'center',
            alignItems: 'center', height: '100vh'
        }}>

            {contextHolder}
            <Divider orientation="vertical"
                style={{
                    height: '80%', borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: '2px', marginRight: '100px'
                }} />
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item label={null} name="title" style={{ marginLeft: '50px' }}>
                    <h1>Welcome</h1>
                </Form.Item>

                <Form.Item<FieldType>
                    label="ユーザー名"
                    name="username"
                    rules={[{ required: true, message: 'ユーザー名を入力してください' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="パスワード"
                    name="password"
                    rules={[{ required: true, message: 'パスワードを入力してください' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item label={null} >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Button type="primary" htmlType="submit">
                            ログイン
                        </Button>
                        <Button type="default" htmlType="button"
                            style={{ marginTop: '8px' }}
                            onClick={() => {
                                navigate('/');
                            }}>
                            キャンセル
                        </Button>
                    </div>
                </Form.Item>
            </Form>
            <Divider orientation="vertical"
                style={{
                    height: '80%', borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: '2px', marginLeft: '200px'
                }} />
        </div>
    );
};

export default Login;