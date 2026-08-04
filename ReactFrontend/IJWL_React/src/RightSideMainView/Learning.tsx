import { message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStatusStore } from "../stores/useUserStatusStore";
import { useWordListStatusStore } from "../stores/useWordListStatusStore";
import { Button, Modal, Checkbox } from 'antd';
import axios from "axios";

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
            userId: userId,
        };
        await axios.post('http://localhost:8080/word/markWord', [data], {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return (
        <>
            <div>
                <div>
                    <p>{displayWordList[currentWordIndex].chinese}</p>
                    <p style={{ visibility: showJapanese ? 'visible' : 'hidden' }}>{displayWordList[currentWordIndex].japanese}</p>

                    <Button type="primary" onClick={() => setShowJapanese(!showJapanese)}
                        disabled={displayWordList[currentWordIndex].japanese === ""}>答えを見る</Button>

                    <Button type="primary" onClick={() => markWord(displayWordList[currentWordIndex].wordId, currentUserId)}
                        disabled={displayWordList === blankWordList}>この単語をマークする</Button>

                    <Button type="primary" onClick={() => navigate('/wordlist')}>単語リストへ</Button>

                    {contextHolder}
                    {modalHolder}
                </div>
                <div>
                    <Button type="primary" onClick={() => { openScopeChoosingModal() }}>範囲選択</Button>
                    <Button type="primary" onClick={() => { setCurrentWordIndex((previous) => previous - 1) }}
                        disabled={currentWordIndex === 0}>
                        前に戻る
                    </Button>
                    <Button type="primary" onClick={() => { setCurrentWordIndex((previous) => previous + 1) }}
                        disabled={currentWordIndex >= displayWordList.length - 1}>
                        次へ
                    </Button>
                </div>
            </div>
        </>
    )
}