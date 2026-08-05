import axios from "axios"; 
import { create } from "zustand";

export enum WordListStatus {
    default = "default",
    batsu = "batsu",
    important = "important",
}

export type Word = {
    wordId: number;
    chinese: string;
    japanese: string;
};

type GetWordsApiResponse = {
    code: number;
    message: string;
    data: Word[];
};

type WordListStatusStore = {
    wordListStatus: WordListStatus;
    wordList: Word[] | null;
    unitNumbers: number[] | null;
    availableUnitNumbers: number[];

    setWordListStatus: (
        status: WordListStatus,
    ) => void;

    setWordList: (wordList: Word[]) => void;

    setAvailableUnitNumbers: (
        availableUnitNumbers: number[],
    ) => void;

    setUnitNumbersAndFetchWordList: (
        unitNumbers: number[],
    ) => Promise<void>;
};

export const useWordListStatusStore =
    create<WordListStatusStore>((set) => ({
        wordListStatus: WordListStatus.default,
        wordList: [],
        unitNumbers: null,
        availableUnitNumbers: [],

        setWordListStatus: (status) => {
            set({
                wordListStatus: status,
            });
        },

        setWordList: (wordList) =>
            set({
                wordList,
            }),

        setAvailableUnitNumbers: (availableUnitNumbers) =>
            set({
                availableUnitNumbers,
            }),


        setUnitNumbersAndFetchWordList: async (unitNumbers) => {
            try {
                set({
                    unitNumbers,
                });

                const response = await axios.post<GetWordsApiResponse>(
                    "http://localhost:8080/word/getAllWords",
                    {
                        unitNumbers: unitNumbers.map(String),
                    },
                );
                set({
                    wordList: response.data.data,
                });
            } catch (error) {
                console.error("単語リストの取得に失敗しました", error);
                set({
                    wordList: [],
                });

                throw error;
            }
        },
    }));