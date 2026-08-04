import { Button, Checkbox, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useWordListStatusStore } from "../stores/useWordListStatusStore";




export default function ScopeChoosing() {

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
            <Button type="primary" onClick={openScopeChoosingModal}>範囲選択</Button>
            <Button type="default" onClick={() => navigate('/')}>キャンセル</Button>
            {modalHolder}
            {contextHolder}
            <Button type="primary" onClick={() => setTimeout(() => navigate('/test'),500)}>確認</Button>
        </>
    )
}