import {create} from 'zustand';


type Word = {
    wordId: number,
    chinese: string,
    japanese: string,
}

type TestStore = {
    testWordList: Word[],
    answerList: String[],
    judgeList: boolean[],
    score: number,
    startedAt: Date | null,
    endedAt: Date | null,
    setTestWordList: (testWordList: Word[]) => void,
    setAnswerList: (answerList: String[]) => void,
    setJudgeList: (judgeList: boolean[]) => void,
    setScore: (score: number) => void,
    setStartedAt: (startAt: Date | null) => void,
    setEndedAt: (endedAt: Date | null) => void
}

export const useTestStore = create<TestStore>((set) => ({
    testWordList: [],
    score: 0,
    answerList: [],
    judgeList: [],
    startedAt: null,
    endedAt: null,
    setTestWordList: (testWordList: Word[]) => set({ testWordList }),
    setAnswerList: (answerList: String[]) => set({ answerList }),
    setJudgeList: (judgeList: boolean[]) => set({ judgeList }),
    setScore: (score: number) => set({ score }),
    setStartedAt: (startedAt: Date | null) => set({ startedAt }),
    setEndedAt: (endedAt: Date | null) => set({ endedAt }),
}))