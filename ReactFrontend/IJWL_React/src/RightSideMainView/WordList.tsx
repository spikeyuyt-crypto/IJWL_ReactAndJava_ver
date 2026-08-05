import { Button, Table, Flex, message } from "antd";
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

    async function requestWordList(wordListStatus: WordListStatus, userId: number, unitNumbers: number[]) {
        switch (wordListStatus) {
            case WordListStatus.default:
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

    const columns = [
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
            render: () => {
                return (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                            <Button type="default">マーク</Button>
                            <Button type="default">コメント</Button>
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




    useEffect(() => {
        const fetchWordList = async () => {
            const gotWordList = await requestWordList(wordListStatus as WordListStatus, userId as number, unitNumbers as number[]);
            setDisplayWordList(gotWordList);
        }
        fetchWordList();
    }, [wordListStatus, userId, unitNumbers]);

    return (
        <>
            {contextHolder}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <Button type="primary"
                    onClick={() => {
                        setWordListStatus(WordListStatus.batsu);
                    }}>
                    バツ単語
                </Button>

                <Button type="primary"
                    onClick={() => {
                        setWordListStatus(WordListStatus.important);
                    }}>
                    重要単語
                </Button>

                <Button type="primary"
                    onClick={() => {
                        setWordListStatus(WordListStatus.default)
                    }}>
                    単語リスト
                </Button>

                <Button type="primary">
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
                            pageSizeOptions: [10, 20, 50, 100],

                            onChange: (page, pageSize) => {
                                setCurrentPageSize(pageSize);
                            },
                        }}
                        scroll={{ y: 350 }} />
                </Flex>
            </div>
            <div>
                <Button type="primary">単語追加</Button>
                <Button type="primary">単語追加</Button>
            </div>
        </>
    )
}