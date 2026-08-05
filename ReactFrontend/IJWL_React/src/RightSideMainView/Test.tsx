import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWordListStatusStore, type Word } from "../stores/useWordListStatusStore";
import { useTestStore } from "../stores/useTestStore";
import { message, Input, Button } from "antd";


export default function Test() {

    const navigate = useNavigate();

    const wordList = useWordListStatusStore(
        (state) => state.wordList,
    );

    const setStartedAt = useTestStore(
        (state) => state.setStartedAt
    );

    const setTestItemList = useTestStore(
        (state) => state.setTestItemList
    );

    const setAnswer = useTestStore(
        (state) => state.setAnswer
    );

    const setJudge = useTestStore(
        (state) => state.setJudge
    );

    function shuffleWordList(wordList: Word[]) {
        return wordList.map(word => ({ ...word })).sort(() => Math.random() - 0.5);
    }

    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const setEndedAt = useTestStore(
        (state) => state.setEndedAt
    );


    useEffect(() => {
        if (!wordList || wordList.length === 0) {
            message.warning("テストする単語がありません");
            setTimeout(() => navigate("/scopechoosing", { replace: true }), 3000);
            return;
        }
        const randomWords = shuffleWordList(wordList).slice(0, 10);

        const initialTestItemList = randomWords
            .map((word) => ({ testWord: word, answer: "", judge: false }));

        setCurrentWordIndex(0);
        setTestItemList(initialTestItemList);
        setStartedAt(getLocalDateTimeString());
    }, [
        wordList,
        navigate,
        setStartedAt,
        setTestItemList
    ]);


    const testItemList = useTestStore(
        (state) => state.testItemList,
    );

    const currentTestItem = testItemList[currentWordIndex];

    if (!currentTestItem) {
        return <p>読み込み中...</p>;
    }

    function judgeAnswer(currentWordIndex: number) {
        currentTestItem.answer.trim() === testItemList[currentWordIndex].testWord.japanese 
        ? setJudge(currentWordIndex, true)
        : setJudge(currentWordIndex, false);
    }

    function getLocalDateTimeString(): string {
    const now = new Date();

    return new Date(
        now.getTime() - now.getTimezoneOffset() * 60_000
    )
        .toISOString()
        .slice(0, 19);
}

    return (
        <>
            <p>{currentTestItem.testWord.chinese}</p>

            <Input variant="outlined" value={testItemList[currentWordIndex].answer}
                onChange={(event) => {
                    setAnswer(currentWordIndex, event.target.value);
                }} />

            <Button onClick={() => { setCurrentWordIndex(previousIndex => previousIndex - 1) }}
                disabled={currentWordIndex === 0}>前に戻る</Button>

            {currentWordIndex === testItemList.length - 1
                ? <Button type="primary" onClick={() => {
                    judgeAnswer(currentWordIndex);
                    setEndedAt(getLocalDateTimeString());
                    navigate("/testresult", { replace: true });
                }}>終了</Button>

                : <Button type="primary"
                    onClick={() => {
                        judgeAnswer(currentWordIndex);
                        setCurrentWordIndex(previousIndex => previousIndex + 1)
                    }}
                    disabled={currentWordIndex === testItemList.length - 1}>次へ</Button>}
        </>
    )
}