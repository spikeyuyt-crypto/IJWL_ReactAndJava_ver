import { Avatar, Modal, Button, Popconfirm, BorderBeam, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useUserStatusStore, type AvatarType } from "../stores/useUserStatusStore";
import { avatarIconMap } from "../screens/Home.tsx";
import { useState } from "react";
import React from "react";
import axios from "axios";


type SelectableListProps<T> = {
    items: T[];
    selectedItem: T | null;
    borderRadius?: string | number;
    onSelect: (item: T) => void;
    renderItem: (item: T) => React.ReactNode;
};

function SelectableList<T>({
    items,
    selectedItem,
    onSelect,
    renderItem,
    borderRadius = "12px",
}: SelectableListProps<T>) {

    return (
        <>
            {items.map((item, index) => {
                const isSelected = selectedItem === item;

                return (
                    <div
                        key={index}
                        onClick={() => onSelect(item)}
                        style={{
                            position: "relative",
                            width: "fit-content",
                            height: "fit-content",
                            padding: 4,
                            margin: 16,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: borderRadius,
                            overflow: "hidden",
                            cursor: "pointer",
                            boxSizing: "border-box",
                        }}
                    >
                        {isSelected ? (
                            <BorderBeam
                                size={70}
                                duration={0.5}
                                lineWidth={3}
                                outset={0}
                                color="#fff700"
                            >
                                {renderItem(item)}
                            </BorderBeam>
                        ) : (
                            renderItem(item)
                        )}
                    </div>
                );
            })}
        </>
    );
}

export default function MyProfile() {

    const navigate = useNavigate();

    const { avatar } = useUserStatusStore();

    const [messageApi, contextHolder] = message.useMessage();

    const userId = useUserStatusStore((state) => state.user?.userId ?? null);

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


    const setThemeColor = useUserStatusStore(
        (state) => state.setThemeColor
    );

    const backgroundColorList = [
        "violet",
        "blue",
        "green",
        "orange"
    ];

    const themeColorMap: Record<string, string> = {
        violet: "#7C3AED",
        blue: "#3B82F6",
        green: "#10B981",
        orange: "#F59E0B",
    };

    async function upgradeUserSettings(
        color: string | null,
        fontSize: string | null,
        userId: number | null) {

        try {
            await axios.put('http://localhost:8080/settings/update', {
                backgroundColor: color,
                fontSize: fontSize,
                userId: userId
            });
            messageApi.success('設定を更新しました');
        } catch (error) {
            if(userId !== null) {
                messageApi.error('設定の保存に失敗しました');
            }
        }
    }


    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center'
            }}>
                {contextHolder}
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
                    <SelectableList<AvatarType>
                        items={Object.keys(avatarIconMap) as AvatarType[]}
                        selectedItem={temporaryAvatar}
                        onSelect={setTemporaryAvatar}
                        borderRadius="50%"
                        renderItem={(avatarKey) => (
                            <Avatar
                                size={100}
                                icon={avatarIconMap[avatarKey]}
                                style={{
                                    backgroundColor: "#5cbbe3",
                                }}
                            />
                        )}
                    />
                </Modal>
                <Modal
                    onCancel={() => {
                        setIsFontChoosingModalOpen(false)
                        setTemporaryFont(null)
                    }}
                    onOk={() => setIsFontChoosingModalOpen(false)}
                    open={isFontChoosingModalOpen}
                    okText="変更"
                    cancelText="キャンセル"
                >
                    <SelectableList<AvatarType>
                        items={Object.keys(avatarIconMap) as AvatarType[]}
                        selectedItem={temporaryAvatar}
                        onSelect={setTemporaryAvatar}
                        renderItem={(avatarKey) => (
                            <Avatar></Avatar>
                        )}
                    />
                </Modal>
                <Modal
                    onCancel={() => {
                        setIsBackgroundChoosingModalOpen(false)
                        setTemporaryBackgroundColor(null)
                    }}
                    onOk={() => {
                        setIsBackgroundChoosingModalOpen(false)
                        setThemeColor(temporaryBackgroundColor || "violet")
                        upgradeUserSettings(temporaryBackgroundColor, temporaryFont, userId)
                    }}
                    open={isBackgroundChoosingModalOpen}
                    okText="変更"
                    cancelText="キャンセル"
                >
                    <SelectableList<string>
                        items={backgroundColorList}
                        selectedItem={temporaryBackgroundColor}
                        onSelect={setTemporaryBackgroundColor}
                        renderItem={(color) => (
                            <div
                                style={{
                                    width: 100,
                                    height: 60,
                                    backgroundColor: themeColorMap[color],
                                    borderRadius: "10px",
                                }}
                            />
                        )}
                    />
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