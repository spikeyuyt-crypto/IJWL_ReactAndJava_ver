import { Avatar, Modal, Button, Popconfirm, BorderBeam } from "antd";
import { useNavigate } from "react-router-dom";
import { useUserStatusStore, type AvatarType } from "../stores/useUserStatusStore";
import { avatarIconMap } from "../screens/Home.tsx";
import { useState } from "react";
import React from "react";

export default function MyProfile() {

    const navigate = useNavigate();

    const { avatar } = useUserStatusStore();

    const [isAvatarChoosingModalOpen, setIsAvatarChoosingModalOpen] = useState(false);

    const [isFontChoosingModalOpen, setIsFontChoosingModalOpen] = useState(false);

    const [isBackgroundChoosingModalOpen, setIsBackgroundChoosingModalOpen] = useState(false);

    const [temporaryAvatar, setTemporaryAvatar] =
        useState<AvatarType | null>(avatar);

    const [temporaryFont, setTemporaryFont] =
        useState<string | null>(null);

    const [temporaryBackgroundColor, setTemporaryBackgroundColor] =
        useState<string | null>(null);

    const changeAvatar = useUserStatusStore(
        (state) => state.changeAvatar
    );


    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center'
            }}>
                <h1>マイプロフィール</h1>
                <Modal
                    okText="変更"
                    cancelText="キャンセル"
                    style={{ textAlign: 'center' }}
                    title="アイコン選択"
                    open={isAvatarChoosingModalOpen}
                    onCancel={() => {
                        setTemporaryAvatar(avatar)
                        setIsAvatarChoosingModalOpen(false)
                    }}
                    onOk={() => {
                        changeAvatar(temporaryAvatar || 'Icon1')
                        setIsAvatarChoosingModalOpen(false)
                    }}
                >
                    {(Object.keys(avatarIconMap) as AvatarType[]).map((key) => {
                        const isSelected = temporaryAvatar === key;

                        const content = (
                            <div
                                onClick={() => {
                                    setTemporaryAvatar(key);
                                }}
                                style={{
                                    position: "relative",
                                    width: 108,
                                    height: 108,
                                    padding: 4,
                                    margin: 16,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    boxSizing: "border-box",
                                }}
                            >
                                <Avatar
                                    size={100}
                                    icon={avatarIconMap[key]}
                                    style={{
                                        backgroundColor: "#5cbbe3",
                                    }}
                                />
                            </div>
                        );

                        return (
                            <React.Fragment key={key}>
                                {isSelected ? (
                                    <BorderBeam
                                        size={70}
                                        duration={0.5}
                                        lineWidth={3}
                                        outset={0}
                                        color="#fff700"
                                    >
                                        {content}
                                    </BorderBeam>
                                ) : (
                                    content
                                )}
                            </React.Fragment>
                        );
                    })}
                </Modal>
                <Modal
                    onCancel={() => setIsFontChoosingModalOpen(false)}
                    onOk={() => setIsFontChoosingModalOpen(false)}
                    open={isFontChoosingModalOpen}>

                </Modal>
                <Modal
                    onCancel={() => setIsBackgroundChoosingModalOpen(false)}
                    onOk={() => setIsBackgroundChoosingModalOpen(false)}
                    open={isBackgroundChoosingModalOpen}>

                </Modal>
                <Avatar
                    onClick={() => setIsAvatarChoosingModalOpen(true)}
                    size={120}
                    icon={avatarIconMap[avatar || 'Icon1']}
                    style={{ cursor: 'pointer', margin: '16px', backgroundColor: '#5cbbe3' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '26px' }}>
                    <Button
                        onClick={() => setIsFontChoosingModalOpen(true)}>
                        テキスト設定
                    </Button>
                    <Button
                        onClick={() => setIsBackgroundChoosingModalOpen(true)}>
                        バックグラウンド設定
                    </Button>
                    <Button
                        onClick={() => navigate('/testhistory')}>
                        テスト履歴
                    </Button>
                    <Popconfirm
                        title="ログアウトしますか?"
                        okText="はい"
                        cancelText="いいえ"
                        onConfirm={() => {
                            useUserStatusStore.getState().logout();
                            setTimeout(() => {
                                navigate('/');
                            }, 500);
                        }}
                        onCancel={() => { }}>
                        <Button>
                            ログアウト
                        </Button>
                    </Popconfirm>
                </div>
            </div>
        </>
    )
}