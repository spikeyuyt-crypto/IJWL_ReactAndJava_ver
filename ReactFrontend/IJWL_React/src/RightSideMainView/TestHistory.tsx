import { useEffect, useState } from 'react';
import { useUserStatusStore } from '../stores/useUserStatusStore';
import axiosInstance from '../NetWork/axiosInstance';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';




export default function TestHistory() {
    const isLoggedIn = useUserStatusStore((state) => state.isLoggedIn);

    const [data, setData] = useState([]);

    const themeColor = useUserStatusStore((state) => state.user?.backgroundColor)?? "#8884d8";



    async function fetchTestHistory() {
        try {
            const response = await axiosInstance.post(
                `/test/showTestScore`,
            );
            setData(response.data.data);
        } catch (error) {
            console.error("テスト履歴の取得に失敗しました", error);
        }
    }

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        fetchTestHistory();
    }, [isLoggedIn]);

    const TestHistoryBarChart = () => {
        return (
            <BarChart
                style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
                responsive
                data={data}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="endedAt" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill= {themeColor} activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[20, 20, 0, 0]} />
            </BarChart>)
    }

    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center'
            }}>
                <p>
                    テスト履歴
                </p>
                <p>
                    最近五回の点数
                </p>
                <TestHistoryBarChart />

            </div>
        </>
    )
}