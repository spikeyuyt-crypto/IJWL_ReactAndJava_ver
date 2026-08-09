import { Button, Table, Flex, message, Modal, Checkbox, Input } from "antd";
import axios from "axios";
import type { TableProps } from "antd/es/table";
import React from "react";
import { useState, useEffect } from "react";
import { useWordListStatusStore, WordListStatus } from "../stores/useWordListStatusStore";
import { useUserStatusStore } from "../stores/useUserStatusStore";


export default function WordList() {

    const wordListStatus = useWordListStatusStore((state) => state.wordListStatus);

    const userId = useUserStatusStore((state) => state.user?.userId ?? null);

    const unitNumbers = useWordListStatusStore((state) => state.unitNumbers);

    const [messageApi, contextHolder] = message.useMessage();

    const setWordListStatus = useWordListStatusStore((state) => state.setWordListStatus);

    const [openMemoModal, setOpenMemoModal] = useState(false);

    const { TextArea } = Input;

    interface ImportantWordItem {
        wordId: number;
    }

    interface ImportantWordsResponse {
        code: number;
        message: string;
        data: ImportantWordItem[];
    }

    const [importantWordIds, setImportantWordIds] = useState<number[]>([]);

    async function getImportantWordIds(userId: number) {
        const importantResponse =
            await axios.get<ImportantWordsResponse>(
                `http://localhost:8080/word/getMarkedWords/${userId}`,
            );

        return importantResponse.data.data.map(
            (item) => item.wordId,
        );
    }

    async function requestWordList(
        wordListStatus: WordListStatus,
        userId: number | null,
        unitNumbers: number[],
    ) {
        switch (wordListStatus) {
            case WordListStatus.default:
                if (unitNumbers.length === 0) {
                    messageApi.warning("範囲を選択してください");
                    return [];
                }
                const defaultResponse =

                    await axios.post('http://localhost:8080/word/getAllWords',
                        { unitNumbers: unitNumbers });
                return defaultResponse.data.data;

            case WordListStatus.batsu:
                if (userId === null) {
                    messageApi.warning('ログインしてください');
                    return [];
                }
                const batsuresponse =
                    await axios.get(`http://localhost:8080/word/getBatsuWords/${userId}`);
                return batsuresponse.data.data;

            case WordListStatus.important:
                if (userId === null) {
                    messageApi.warning('ログインしてください');
                    return [];
                }
                const importantResponse =
                    await axios.get(`http://localhost:8080/word/getMarkedWords/${userId}`);
                return importantResponse.data.data;
        }
    }

    const [displayWordList, setDisplayWordList] = useState<DataType[]>([]);



    type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

    interface DataType {
        key: React.Key;
        wordId: number;
        japanese: string;
        chinese: string;
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: '単語ID',
            dataIndex: 'wordId',
            key: 'wordId',
        },
        {
            title: '日本語',
            dataIndex: 'japanese',
            key: 'japanese',
        },
        {
            title: '中国語',
            dataIndex: 'chinese',
            key: 'chinese',
        },
        {
            title: '',
            key: 'operation',
            render: (_, record) => {
                return (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Button
                                type="default"
                                disabled={userId === null}
                                style={{ backgroundColor: importantWordIds.includes(record.wordId) ? 'rgb(243, 255, 19)' : 'rgb(255, 255, 255)' }}
                                onClick={() => {
                                    importantWordIds.includes(record.wordId)
                                        ? unmarkWords([record.wordId])
                                        : markWords([record.wordId])
                                }}>
                                マーク
                            </Button>
                            <Button
                                type="default"
                                disabled={userId === null}
                                onClick={() => {
                                    setOpenMemoModal(true);
                                    setCurrentWordId(record.wordId);
                                    setCurrentDbMemo(record.wordId, userId);
                                }}
                            >コメント</Button>
                        </div>
                    </>
                )
            },
        },
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const [currentPageSize, setCurrentPageSize] = useState(10);

    const [isLoading, setIsLoading] = useState(false);


    const [modal, modalHolder] = Modal.useModal();


    const selectedUnits = useWordListStatusStore(
        (state) => state.unitNumbers,
    );

    const availableUnitNumbers = useWordListStatusStore(
        (state) => state.availableUnitNumbers,
    );

    const setUnitNumbersAndFetchWordList = useWordListStatusStore(
        (state) => state.setUnitNumbersAndFetchWordList,
    );

    let temporarySelectedUnits: number[] | null = selectedUnits;


    const openScopeChoosingModal = () => {
        modal.confirm({
            title: "範囲選択",
            content: (
                <div>
                    <p>テスト範囲を選択してください。</p>
                    <Checkbox.Group options={
                        availableUnitNumbers.map((unitNumber) => ({
                            label: `単元${unitNumber}`,
                            value: unitNumber
                        }))
                    }
                        onChange={(checkedValues) => {
                            temporarySelectedUnits = checkedValues
                        }}
                        defaultValue={[]} />
                </div>
            ),
            okText: "確認",
            cancelText: "キャンセル",
            mask: {
                blur: true,
            },
            onOk: async () => {
                if (temporarySelectedUnits === null) {
                    messageApi.warning("テスト範囲を選択してください");
                    return Promise.reject();
                }

                try {
                    await setUnitNumbersAndFetchWordList(
                        temporarySelectedUnits,
                    );
                    messageApi.success(
                        "テスト範囲を更新しました",
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

    interface MarkWordRequest {
        wordId: number;
        userId: number;
    }

    async function markWords(wordIds: number[]) {
        if (userId === null) {
            messageApi.warning("ログインしてください");
            return;
        }

        if (wordIds.length === 0) {
            messageApi.warning("単語を選択してください");
            return;
        }

        const requestBody: MarkWordRequest[] = wordIds.map((wordId) => ({
            wordId,
            userId,
        }));

        try {
            await axios.post(
                "http://localhost:8080/word/markWord",
                requestBody,
            ).then(() => {
                getImportantWordIds(userId)
                    .then((ids) => { setImportantWordIds(ids); })
            });

            messageApi.success("単語をマークしました");
        } catch (error) {
            messageApi.error("単語のマークに失敗しました");
        }
    }

    async function unmarkWords(wordIds: number[]) {
        if (userId === null) {
            messageApi.warning("ログインしてください");
            return;
        }
        if (wordIds.length === 0) {
            messageApi.warning("単語を選択してください");
            return;
        }

        const requestBody: MarkWordRequest[] = wordIds.map((wordId) => ({
            wordId,
            userId,
        }));

        try {
            await axios.delete(
                "http://localhost:8080/word/unmarkWord",
                { data: requestBody },
            ).then(() => {
                getImportantWordIds(userId)
                    .then((ids) => { setImportantWordIds(ids); })
            })

            messageApi.success("単語のマークを解除しました");
        }
        catch (error) {
            messageApi.error("単語のマーク解除に失敗しました");
        }
    }

    async function deleteBatsuWords(wordIds: number[]) {
        if (userId === null) {
            messageApi.warning("ログインしてください");
            return;
        }
        if (wordIds.length === 0) {
            messageApi.warning("単語を選択してください");
            return;
        }

        const requestBody: MarkWordRequest[] = wordIds.map((wordId) => ({
            wordId,
            userId,
        }))
        try {
            await axios.delete(
                "http://localhost:8080/word/deleteBatsuWord",
                { data: requestBody },
            ).then(() => {
                axios.get(`http://localhost:8080/word/getBatsuWords/${userId}`)
                    .then((response) => {
                        setDisplayWordList(response.data.data);
                    })

            })
            messageApi.success("バツ単語を削除しました");
        }
        catch (error) {
            messageApi.error("バツ単語解除に失敗しました");
        }
    }


    useEffect(() => {
        setSelectedRowKeys([]);

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const gotWordList = await requestWordList(
                    wordListStatus,
                    userId,
                    unitNumbers ?? [],
                );

                setDisplayWordList(gotWordList ?? []);

                if (userId !== null) {
                    const ids = await getImportantWordIds(userId);
                    setImportantWordIds(ids);
                } else {
                    setImportantWordIds([]);
                }
            } catch (error) {
                console.error(error);
                setDisplayWordList([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [wordListStatus, userId, unitNumbers]);

    const [memo, setMemo] = useState("");

    const [dbMemo, setDbMemo] = useState("");

    function updateMemo(wordId: number, userId: number | null, memo: string) {
        if (userId === null) {
            messageApi.warning("ログインしてください");
            return;
        }
        axios.put("http://localhost:8080/word/updateComment",
            { wordId, userId, memo })
            .then(() => {
                messageApi.success("メモを更新しました");
            })
            .catch(() => {
                messageApi.error("メモの更新に失敗しました");
            });
    }

    async function setCurrentDbMemo(wordId: number, userId: number | null) {
        if (userId === null) {
            messageApi.warning("ログインしてください");
            return;
        }

        try {
            await axios.post("http://localhost:8080/word/comment",
                { wordId, userId })
                .then((response) => {
                    setDbMemo(response.data.data.memo);
                });
            messageApi.success("メモを取得しました");
        }
        catch (error) {
            setDbMemo("");
            messageApi.error("メモの取得に失敗しました");
        }
    }

    const [currentWordId, setCurrentWordId] = useState(0);





    return (
        <>
            {modalHolder}
            {contextHolder}
            <Modal
                title="メモ編集"
                centered
                open={openMemoModal}
                okText="確認"
                cancelText="キャンセル"
                onCancel={() => { setOpenMemoModal(false) }}
                onOk={() => {
                    updateMemo(currentWordId, userId, memo);
                    setOpenMemoModal(false)
                    setMemo("");
                }}
            >
                <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <p>
                        現在のメモ:
                    </p>
                    <p>
                        {dbMemo}
                    </p>
                    <TextArea
                        style={{
                            width: '300px', height: '100px',
                            resize: "none", marginBottom: "20px"
                        }}
                        placeholder="メモを入力してください"
                        value={memo}
                        onChange={(e) => { setMemo(e.target.value) }}
                    />
                </div>
            </Modal>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <Button type="primary"
                    onClick={() => {
                        setWordListStatus(WordListStatus.batsu);
                    }}
                    style={{ visibility: wordListStatus === WordListStatus.batsu ? "hidden" : "visible" }}>
                    バツ単語
                </Button>

                <Button type="primary"
                    onClick={() => {
                        setWordListStatus(WordListStatus.important);
                    }}
                    style={{ visibility: wordListStatus === WordListStatus.important ? "hidden" : "visible" }}>
                    重要単語
                </Button>

                <Button type="primary"
                    onClick={() => {
                        setWordListStatus(WordListStatus.default)
                    }}
                    style={{ visibility: wordListStatus === WordListStatus.default ? "hidden" : "visible" }}>
                    単語リスト
                </Button>

                <Button type="primary"
                    onClick={openScopeChoosingModal} >
                    範囲選択
                </Button>
            </div>
            <div>
                <Flex gap="medium" vertical style={{ width: '100%', marginTop: "20px" }}>
                    <Table<DataType>
                        rowKey="wordId"
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={displayWordList}
                        pagination={{
                            pageSize: currentPageSize,
                            showSizeChanger: true,
                            pageSizeOptions: [5, 10, 20, 50],

                            onChange: (_, pageSize) => {
                                setCurrentPageSize(pageSize);
                            },
                        }}
                        loading={isLoading}
                        scroll={{ y: 350 }} />
                </Flex>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <Button type="primary"
                    style={{ visibility: wordListStatus === WordListStatus.important ? "hidden" : "visible" }}
                    disabled={selectedRowKeys.length === 0 || wordListStatus === WordListStatus.important}
                    onClick={() => {
                        markWords(selectedRowKeys.map(Number));
                    }}>
                    選択した単語をノートに追加
                </Button>
                <Button type="primary"
                    onClick={() => {
                        switch (wordListStatus) {
                            case WordListStatus.batsu:
                                deleteBatsuWords(selectedRowKeys.map(Number));
                                break;
                            case WordListStatus.important:
                                unmarkWords(selectedRowKeys.map(Number));
                                break;
                        }
                    }}
                    style={{ visibility: wordListStatus === WordListStatus.default ? "hidden" : "visible" }}
                    disabled={selectedRowKeys.length === 0}>
                    選択した単語を削除
                </Button>
            </div>
        </>
    )
}