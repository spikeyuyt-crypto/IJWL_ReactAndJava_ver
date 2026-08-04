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

    const setTestWordList = useTestStore(
        (state) => state.setTestWordList
    );

    const setAnswerList = useTestStore(
        (state) => state.setAnswerList
    )

    const setJudgeList = useTestStore(
        (state) => state.setJudgeList
    )

    function shuffleWordList(wordList: Word[]) {
        return wordList.map(word => ({ ...word })).sort(() => Math.random() - 0.5);
    }

    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    const [tmpAnswerList, setTmpAnswerList] = useState<string[]>([]);

    function updateTmpAnswerList(answer: string) {
        setTmpAnswerList((previousList) => {
            const newList = [...previousList];
            newList[currentWordIndex] = answer;
            return newList;
        });
    }

    const [tmpJudgeList, setTmpJudgeList] = useState<boolean[]>([]);

    function updateTmpJudgeList(answer: string): boolean[] {
        const newList = [...tmpJudgeList];

        newList[currentWordIndex] =
            answer.trim() ===
            testWordList[currentWordIndex].japanese.trim();

        setTmpJudgeList(newList);

        return newList;
    }


    useEffect(() => {
        if (!wordList || wordList.length === 0) {
            message.warning("テストする単語がありません");
            navigate("/learning");
            return;
        }
        const randomWords = shuffleWordList(wordList).slice(0, 10);

        setTestWordList(randomWords);
        setStartedAt(new Date());
    }, [
        wordList,
        navigate,
        setStartedAt,
        setTestWordList,
    ]);

    const testWordList = useTestStore(
        (state) => state.testWordList,
    );

    function saveTest( finalJudgeList: boolean[], tmpAnswerList : string[]) {
        setAnswerList(tmpAnswerList);
        setJudgeList(finalJudgeList);
        navigate("/result", { replace: true });
    }

    if (testWordList.length === 0) {
        return <p>読み込み中...</p>;
    }

    return (
        <>
            <p>{testWordList[currentWordIndex].chinese}</p>

            <Input variant="outlined" value={tmpAnswerList[currentWordIndex] ?? ""}
                onChange={(event) => { updateTmpAnswerList(event.target.value); }} />

            <Button onClick={() => { setCurrentWordIndex(previousIndex => previousIndex - 1) }}
                disabled={currentWordIndex === 0}>前に戻る</Button>

            {currentWordIndex === testWordList.length - 1
                ? <Button type="primary" onClick={() => {
                    const finalJudgeList = updateTmpJudgeList(tmpAnswerList[currentWordIndex] ?? "",);
                    saveTest( finalJudgeList, tmpAnswerList);
                }}>終了</Button>
                : <Button type="primary"
                    onClick={() => {
                        updateTmpJudgeList(tmpAnswerList[currentWordIndex] ?? "");
                        setCurrentWordIndex(previousIndex => previousIndex + 1)
                    }}
                    disabled={currentWordIndex === testWordList.length - 1}>次へ</Button>}
        </>
    )
}