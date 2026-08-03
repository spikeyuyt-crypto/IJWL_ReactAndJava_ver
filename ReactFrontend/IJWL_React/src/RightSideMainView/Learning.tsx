import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStatusStore } from "../stores/useUserStatusStore";
import { useWordListStatusStore } from "../stores/useWordListStatusStore";


export default function Learning() {
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (!userStatus.isLoggedIn) {
            messageApi.warning('ログインしてください');;
        }
    }, []);

     const wordList = useWordListStatusStore(
        (state) => state.wordList,
    );


    const userStatus = useUserStatusStore((state) => state);

    const currentWordIndex = useUserStatusStore((state) => state);

    const currentUserId = userStatus.user?.userId;

    const [showJapanese, setShowJapanese] = useState(false);

    const navigate = useNavigate();

    const blankWordList = [
        { wordId: 0, chinese: "", japanese: "" }
    ];

    const displayWordList = wordList.length === 0 ? blankWordList : wordList;

    // async function markWord(wordId: number, userId: number | undefined) {
    //     if (!userId) {
    //         console.error('ユーザーIDが取得できませんでした。');
    //         return;
    //     }

    // }
    return (
        <>
            <div>
                <p>Learning</p>
                <p style={{ visibility: showJapanese ? 'visible' : 'hidden' }}>Learning</p>
                <Button type="primary" onClick={() => setShowJapanese(!showJapanese)}>答えを見る</Button>
                <Button type="primary" onClick={() => {}}>この単語をマークする</Button>
                <Button type="primary" onClick={() => navigate('/wordlist')}>単語リストへ</Button>
            </div>
        </>
    )
}