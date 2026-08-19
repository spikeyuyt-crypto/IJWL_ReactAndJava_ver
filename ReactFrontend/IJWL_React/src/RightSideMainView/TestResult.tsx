import { useTestStore } from "../stores/useTestStore";
import { useNavigate } from "react-router-dom";
import { useUserStatusStore } from "../stores/useUserStatusStore";
import { Button, Popover, message, Popconfirm, Tooltip } from "antd";
import type { PopconfirmProps } from 'antd';
import axiosInstance from "../NetWork/axiosInstance";
import { MdOutlineRefresh } from "react-icons/md";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";


export default function TestResult() {

    const currentUserId = useUserStatusStore((state) => state.user?.userId);

    const navigate = useNavigate();

    const [messageApi, holder] = message.useMessage();


    async function recordTest(
        startedAt: string | null,
        endedAt: string | null,
        score: number,
        wrongWordIds: number[]
    ) {
        if (currentUserId === undefined) {
            messageApi.warning("先にログインしてください");
            return;
        }
        if (startedAt === null || endedAt === null) {
            messageApi.error("テスト時間の情報が不足しています");
            throw new Error("Test time is missing");
        }
        console.log(startedAt, endedAt, score, wrongWordIds);
        try {
            await axiosInstance.post('/test/record', {
                startedAt: startedAt,
                endedAt: endedAt,
                score: score,
                wrongWordIds: wrongWordIds
            });
            messageApi.success('テスト結果の保存に成功しました');
            setTimeout(() => {
                navigate('/')
            }, 3000);
        } catch (e) {
            messageApi.error('テスト結果の保存に失敗しました');
            throw e;
        }
    }
    const confirm: PopconfirmProps['onConfirm'] = async () => {
        await recordTest(
            useTestStore.getState().startedAt,
            useTestStore.getState().endedAt,
            correctAnswerCount * 10,
            testItemList.filter(item => !item.judge).map(item => item.testWord.wordId)
        );
    }

    const cancel: PopconfirmProps['onCancel'] = () => {
        messageApi.error('テスト結果の保存にキャンセルされました');
    };


    const testItemList = useTestStore((state) => state.testItemList);

    const correctAnswerCount = useTestStore((state) => state.testItemList
        .filter(item => item.judge).length);


    const popoverContent = (index: number) => {
        return (
            <>
                <div>問題:{testItemList[index].testWord.chinese}</div>
                <div>正解:{testItemList[index].testWord.japanese}</div>
                <div>あなたの答え:{testItemList[index].answer}</div>
            </>
        )
    }

    const confirmBatsuWord: PopconfirmProps['onConfirm'] = () => {
        if (currentUserId === undefined) {
            messageApi.warning('先にログインしてください');
            return;
        }
        if (testItemList.filter(item => !item.judge).length === 0) {
            messageApi.warning('バツ単語はありません');
            return;
        }
        const markRequestData: Object[] = testItemList
            .filter(item => !item.judge)
            .map(item => ({
                wordId: item.testWord.wordId,
            }));
        try {
            axiosInstance.post('/word/markWord',
                markRequestData
            );
            messageApi.success('バツ単語のマークに成功しました');
        } catch (e) {
            messageApi.error('バツ単語のマークに失敗しました');
        }

    }

    const cancelBatsuWord: PopconfirmProps['onCancel'] = () => {
        messageApi.error('バツ単語のマークにキャンセルされました');
    };


    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {holder}
                <div style={{ fontSize: "40px", fontWeight: "bold" }}>テスト結果</div>
                <div style={{ marginTop: "20px", display: 'flex', justifyContent: 'center' }}>
                    <div style={{ fontSize: "20px", marginRight: "50px" }}>点数表示:{correctAnswerCount * 10}</div>
                    <div style={{ fontSize: "20px" }}>正解率:{correctAnswerCount * 10.0}%</div>
                </div>
                <div style={{
                    marginTop: "40px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    gap: "40px"
                }}>
                    <Popconfirm
                        title="バツ単語をマークしますか？"
                        description="処理が完了するまでお待ちください"
                        onConfirm={confirmBatsuWord}
                        onCancel={cancelBatsuWord}
                        okText="はい"
                        cancelText="キャンセル"
                    >
                        <Tooltip title="バツ単語をマークしますか？" placement="bottom">
                            <Button type="primary"
                                icon={<HiOutlineClipboardDocumentCheck />}
                                shape="circle"
                                style={{ scale: "1.5" }}></Button>
                        </Tooltip>
                    </Popconfirm>


                    <Tooltip title="再チャレンジ" placement="bottom">
                        <Button type="primary" onClick={() => navigate('/scopechoosing', { replace: true })}
                            icon={<MdOutlineRefresh />}
                            shape="circle"
                            style={{ scale: "1.5" }}>
                        </Button>
                    </Tooltip>

                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: "40px",
                    marginTop: "40px",
                }}>
                    {testItemList.map((item, index) => (
                        <Popover key={index} content={popoverContent(index)}>
                            <div style={{
                                backgroundColor: item.judge ? "rgb(74, 255, 46)" : " rgb(239, 255, 62)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100px", height: "100px", borderRadius: "50%"
                            }}>
                                {index + 1}
                            </div>
                        </Popover>
                    ))}
                </div>
                <div style={{ marginTop: "50px" }}>

                    <div style={{ display: "flex", justifyContent: "space-around", gap: "20px" }}>
                        <Button type="default" onClick={() => navigate('/')}>キャンセル</Button>

                        <Popconfirm
                            title="テスト結果を保存しますか？"
                            description="保存処理が完了するまでお待ちください"
                            onConfirm={confirm}
                            onCancel={cancel}
                            okText="はい"
                            cancelText="キャンセル"
                        >
                            <Button type="primary">確認</Button>
                        </Popconfirm>
                    </div>
                </div>
            </div>
        </>
    )
}
