import React from 'react';
import type { FormProps } from 'antd';
import { Button, Divider, Form, Input, message, theme } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserStatusStore } from '../stores/useUserStatusStore';

type FieldType = {
    username?: string;
    password?: string;
    confirmPassword?: string;
};

const Register: React.FC = () => {
    const setUserStatus = useUserStatusStore((state) => state);

    const setAccessToken = useUserStatusStore((state) => state.setAccessToken);


    const navigate = useNavigate();

    const {
        token: {
            colorPrimaryBg,
        },
    } = theme.useToken();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        async function RegisterUser() {
            const requestData = {
                username: values.username,
                password: values.password,
            };

            try {
                const response = await axios.post('http://localhost:8080/users/register',
                    requestData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        withCredentials: true
                    }
                );

                const data = response.data.data;
                console.log(data);

                setAccessToken(data.accessToken);

                setUserStatus.login({
                    userId: data.userId,
                    userName: values.username ?? '',
                    backgroundColor: data.backgroundColor,
                    fontSize: data.fontSize,

                });
                messageApi.success('登録に成功しました。\n 3秒後にホームページにリダイレクトされます。');

                setTimeout(() => { navigate('/') }, 3000);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const status = error.response?.status;
                    switch (status) {
                        case 409:
                            messageApi.error(
                                'ユーザー名がすでに存在します',
                            );
                            setTimeout(() => { navigate('/login'); }, 3000);
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
        RegisterUser().then(() => {


        });
    };

    const [messageApi, contextHolder] = message.useMessage();

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <div style={{
            display: 'flex', justifyContent: 'center',
            alignItems: 'center', height: '100vh',
            backgroundColor: colorPrimaryBg
        }}>

            {contextHolder}
            <Divider orientation="vertical"
                style={{
                    height: '80%', borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: '2px', marginRight: '100px'
                }} />
            <Form
                name="basic"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item label={null} style={{ marginLeft: '60px' }}>
                    <h1>新規登録</h1>
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
                    dependencies={['confirmPassword']}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item<FieldType>
                    label="パスワード確認"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[{ required: true, message: 'パスワードを再入力してください', },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (
                                !value ||
                                getFieldValue('password') === value
                            ) {
                                return Promise.resolve();
                            }

                            return Promise.reject(
                                new Error(
                                    'パスワードが一致していません',
                                ),
                            );
                        },
                    }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item label={null} >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Button type="primary" htmlType="submit">
                            登録
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

export default Register;