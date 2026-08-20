import { message, Tooltip, FloatButton } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStatusStore } from "../stores/useUserStatusStore";
import { useWordListStatusStore } from "../stores/useWordListStatusStore";
import { Button, Modal, Checkbox } from 'antd';
import axiosInstance from "../NetWork/axiosInstance";
import { VscOpenPreview } from "react-icons/vsc";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { MdExitToApp } from "react-icons/md";



export default function Learning() {

    const [messageApi, contextHolder] = message.useMessage();

    const wordList = useWordListStatusStore(
        (state) => state.wordList,
    );

    const selectedUnits = useWordListStatusStore(
        (state) => state.unitNumbers,
    );

    const availableUnitNumbers = useWordListStatusStore(
        (state) => state.availableUnitNumbers,
    );

    const setUnitNumbersAndFetchWordList = useWordListStatusStore(
        (state) => state.setUnitNumbersAndFetchWordList,
    );

    const [modal, modalHolder] = Modal.useModal();

    const openScopeChoosingModal = () => {
        let temporarySelectedUnits: number[] | null = selectedUnits;

        modal.confirm({
            title: "学習範囲選択",

            content: (
                <div style={{ marginTop: 20 }}>
                    <p>学習する範囲を選択してください。</p>

                    <Checkbox.Group
                        options={availableUnitNumbers}
                        defaultValue={[]}
                        onChange={(checkedValues) => {
                            temporarySelectedUnits = checkedValues;
                        }}
                    />
                </div>
            ),

            okText: "確認",
            cancelText: "キャンセル",
            mask: {
                blur: true,
            },

            onOk: async () => {
                if (temporarySelectedUnits === null) {
                    messageApi.warning("学習範囲を選択してください");
                    return Promise.reject();
                }

                try {
                    await setUnitNumbersAndFetchWordList(
                        temporarySelectedUnits,
                    );

                    setCurrentWordIndex(0);
                    setShowJapanese(false);

                    messageApi.success(
                        "学習範囲を更新しました",
                    );
                } catch {
                    messageApi.error(
                        "単語リストの取得に失敗しました",
                    );

                    return Promise.reject();
                }
            },
        });
    };

    const userStatus = useUserStatusStore((state) => state);

    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const currentUserId: number | null = userStatus.user?.userId ?? null;

    const [showJapanese, setShowJapanese] = useState(false);

    const navigate = useNavigate();

    const blankWordList = [
        { wordId: 0, chinese: "", japanese: "" }
    ];



    const displayWordList = wordList === null || wordList.length === 0 ? blankWordList : wordList;


    useEffect(() => {
        if (displayWordList === blankWordList) {
            messageApi.warning('範囲選択してください');;
        }
    }, []);

    async function markWord(wordId: number, userId: number | null) {
        if (userId === null) {
            messageApi.warning('ログインしてください');
            return;
        }
        const data = {
            wordId: wordId,
        };
        try {
            await axiosInstance.post('/word/markWord', [data], {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            messageApi.success('マークしました');
        }
        catch (error) {
            messageApi.error('マークに失敗しました');
        };
    }

    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'row',
                alignItems: 'center', justifyContent: 'center',
            }}>

                <div style={{
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center', width: "40vw"
                }}>
                    <p
                        style={{ fontSize: 50 }}>
                        {displayWordList[currentWordIndex].chinese}
                    </p>
                    <p style={{
                        visibility: showJapanese ? 'visible' : 'hidden',
                        fontSize: 50
                    }}>
                        {displayWordList[currentWordIndex].japanese}
                    </p>
                    <div style={{
                        display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                        marginTop: "40px"
                    }}>
                        <Button type="primary" onClick={() => { setCurrentWordIndex((previous) => previous - 1) }}
                            disabled={currentWordIndex === 0}
                            style={{ width: "100px", marginRight: "60px", transform: "scale(1.3)" }}>
                            前に戻る
                        </Button>
                        <Button type="primary" onClick={() => setShowJapanese(!showJapanese)}
                            disabled={displayWordList[currentWordIndex].japanese === ""}
                            style={{ width: "100px", marginRight: "60px", transform: "scale(1.3)" }}>答えを見る</Button>
                        <Button type="primary" onClick={() => {
                            setShowJapanese(false);
                            setCurrentWordIndex((previous) => previous + 1)
                        }}
                            disabled={currentWordIndex >= displayWordList.length - 1}
                            style={{ width: "100px", transform: "scale(1.3)" }}>
                            次へ
                        </Button>
                    </div>
                </div>
                <FloatButton.Group
                    style={{
                        gap: 36,
                        right: 100,
                        bottom: 200
                    }}>
                    <Tooltip title="範囲選択" placement="top">
                        <FloatButton
                            type="primary"
                            shape="circle"
                            style={{ width: "60px", height: "60px", transform: "scale(1.2)", marginBottom:"60px" }}
                            onClick={() => { openScopeChoosingModal() }}
                            icon={<VscOpenPreview size={30} />}>
                        </FloatButton>
                    </Tooltip>
                    <Tooltip title="この単語をマークする" placement="top">
                        <FloatButton type="primary" onClick={() => markWord(displayWordList[currentWordIndex].wordId, currentUserId)}
                            disabled={displayWordList === blankWordList}
                            shape="circle"
                            style={{ width: "60px", height: "60px", transform: "scale(1.2)", marginBottom:"60px" }}
                            icon={<HiOutlineClipboardDocumentCheck size={30} />}>
                        </FloatButton>
                    </Tooltip>
                    <Tooltip title="単語リストへ" placement="top">
                        <FloatButton
                            type="primary"
                            onClick={() => navigate('/wordlist')}
                            shape="circle"
                            style={{ width: "60px", height: "60px", transform: "scale(1.2)" }}
                            icon={<MdExitToApp size={30} />}>
                        </FloatButton>
                    </Tooltip>
                    {contextHolder}
                    {modalHolder}
                </FloatButton.Group>
            </div >
        </>
    )
}