import { create } from "zustand";

export enum WordListStatus {
    default = "default",
    batsu = "batsu",
    important = "important",
}

export type Word = {
    wordId: string;
    chinese: string;
    japanese: string;
};

type WordListStatusStore = {
    wordListStatus: Record<string, WordListStatus>;
    wordList: Word[];
    unitNumber: number | null;

    setWordListStatus: (
        wordId: string,
        status: WordListStatus,
    ) => void;

    setWordList: (wordList: Word[]) => void;
    setUnitNumber: (unitNumber: number | null) => void;
};

export const useWordListStatusStore =
    create<WordListStatusStore>((set) => ({
        wordListStatus: {},
        wordList: [],
        unitNumber: null,

        setWordListStatus: (wordId, status) =>
            set((state) => ({
                wordListStatus: {
                    ...state.wordListStatus,
                    [wordId]: status,
                },
            })),

        setWordList: (wordList) =>
            set({
                wordList,
            }),

        setUnitNumber: (unitNumber) =>
            set({
                unitNumber,
            }),
    }));