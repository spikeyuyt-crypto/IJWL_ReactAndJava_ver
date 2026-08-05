import {create} from 'zustand';


type Word = {
    wordId: number,
    chinese: string,
    japanese: string,
}

type TestItem = {
    testWord: Word,
    answer: string,
    judge: boolean | null,
}

type TestStore = {
    testItemList: TestItem[],
    startedAt: string | null,
    endedAt: string | null,
    setTestItemList: (testItemList: TestItem[]) => void,
    setAnswer: (index: number, answer: string) => void,
    setJudge: ( index: number, judge: boolean) => void,
    setStartedAt: (startAt: string | null) => void,
    setEndedAt: (endedAt: string | null) => void
}

export const useTestStore = create<TestStore>((set) => ({
    testItemList: [],
    startedAt: null,
    endedAt: null,
    setTestItemList: (testItemList: TestItem[]) => set({ testItemList }),
    setAnswer: (targetIndex: number, answer: string) => set((state) => ({
        testItemList: state.testItemList.map((item, index) => index === targetIndex ? {...item, answer} : item)
    })),
    setJudge: (targetIndex: number, judge: boolean) => set((state) => ({
        testItemList: state.testItemList.map((item, index) => index === targetIndex ? {...item, judge} : item)
    })),
    setStartedAt: (startedAt: string | null) => set({ startedAt }),
    setEndedAt: (endedAt: string | null) => set({ endedAt }),
}))