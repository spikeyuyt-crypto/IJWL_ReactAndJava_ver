import { Checkbox, Modal, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { useWordListStatusStore } from "../stores/useWordListStatusStore";




export default function ScopeChoosing() {

    const cardStyle: React.CSSProperties = {
        width: 250,
        height: 150,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        borderRadius: "50px",
        cursor: "pointer",
    };

    const navigate = useNavigate();

    const [modal, modalHolder] = Modal.useModal();

    const [messageApi, contextHolder] = message.useMessage();

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

    return (
        <>
            <div style={{ height: '10vh' }}>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Card
                    style={{
                        ...cardStyle,
                        backgroundColor: "#3B82F6",
                    }}
                    onClick={() => openScopeChoosingModal()}
                >
                    <h1 style={{ color: "#fff" }}>範囲選択</h1>
                </Card>
            </div>
            <div style={{ height: '10vh' }}>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Card
                    style={{
                        ...cardStyle,
                        backgroundColor: "#F59E0B",
                        marginRight: '100px'
                    }}
                    onClick={() => navigate('/')}
                >
                    <h1 style={{ color: "#fff" }}>キャンセル</h1>
                </Card>
                {modalHolder}
                {contextHolder}
                <Card
                    style={{
                        ...cardStyle,
                        backgroundColor: "#EC4899",
                    }}
                    onClick={() => setTimeout(() => navigate('/test'), 500)}
                >
                    <h1 style={{ color: "#fff" }}>確認</h1>
                </Card>
            </div>
        </>
    )
}