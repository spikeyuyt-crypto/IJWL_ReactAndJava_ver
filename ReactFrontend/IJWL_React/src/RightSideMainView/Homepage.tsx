import { Card } from "antd";
import { useNavigate } from "react-router-dom";



export default function Homepage() {
    const navigate = useNavigate();

    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center'
            }}>
                <div>
                    <Card style={{
                        width: 250, height: 150, alignItems: 'center',
                        justifyContent: 'center', display: 'flex',
                        backgroundColor: '#5cbbe3', borderRadius: '50px',
                        cursor: "pointer"
                    }}
                        onClick={() => navigate('/learning')}
                    >
                        <h1>学習</h1>
                    </Card>
                </div>
                <div style={{
                    display: 'flex', justifyContent: 'center',
                    marginTop: '20px', marginBottom: '20px', gap: '20px'
                }}>
                    <Card style={{
                        width: 250, height: 150, alignItems: 'center',
                        justifyContent: 'center', display: 'flex',
                        backgroundColor: '#5cbbe3', borderRadius: '50px',
                        cursor: "pointer"
                    }}
                        onClick={() => navigate('/wordlist')}
                    >
                        <h1>単語リスト</h1>
                    </Card>
                    <Card style={{
                        width: 250, height: 150, alignItems: 'center',
                        justifyContent: 'center', display: 'flex',
                        backgroundColor: '#5cbbe3', borderRadius: '50px',
                        cursor: "pointer"
                    }}
                        onClick={() => navigate('/test')}
                    >
                        <h1>テスト</h1>
                    </Card>
                </div>
                <div style={{
                    display: 'flex', justifyContent: 'center',
                    marginTop: '20px', marginBottom: '20px', gap: '20px'
                }}>
                    <Card style={{
                        width: 250, height: 150, alignItems: 'center',
                        justifyContent: 'center', display: 'flex',
                        backgroundColor: '#5cbbe3', borderRadius: '50px',
                        cursor: "pointer"
                    }}
                        onClick={() => navigate('/wordlist')}
                    >
                        <h1>重要単語</h1>
                    </Card><Card style={{
                        width: 250, height: 150, alignItems: 'center',
                        justifyContent: 'center', display: 'flex',
                        backgroundColor: '#5cbbe3', borderRadius: '50px',
                        cursor: "pointer"
                    }}
                        onClick={() => navigate('/test')}
                    >
                        <h1>バツ単語</h1>
                    </Card>
                </div>
            </div>
        </>
    )
}