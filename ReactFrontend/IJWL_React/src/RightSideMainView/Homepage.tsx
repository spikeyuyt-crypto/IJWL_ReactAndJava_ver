import React from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
    const navigate = useNavigate();

    const cardStyle: React.CSSProperties = {
        width: 250,
        height: 150,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        borderRadius: "50px",
        cursor: "pointer",
    };

    const titleStyle: React.CSSProperties = {
        color: "#fff",
        margin: 0,
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        marginBottom: "20px",
                        marginTop: "20px",
                    }}
                >
                    <Card
                        style={{
                            ...cardStyle,
                            width: 520,
                            backgroundColor: "#8B5CF6",
                        }}
                        onClick={() => navigate("/learning")}
                    >
                        <h1 style={titleStyle}>学習</h1>
                    </Card>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                        marginBottom: "20px",
                        gap: "20px",
                    }}
                >
                    <Card
                        style={{
                            ...cardStyle,
                            backgroundColor: "#3B82F6",
                        }}
                        onClick={() => navigate("/wordlist")}
                    >
                        <h1 style={titleStyle}>単語リスト</h1>
                    </Card>

                    <Card
                        style={{
                            ...cardStyle,
                            backgroundColor: "#F59E0B",
                        }}
                        onClick={() => navigate("/scopechoosing")}
                    >
                        <h1 style={titleStyle}>テスト</h1>
                    </Card>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                        marginBottom: "20px",
                        gap: "20px",
                    }}
                >
                    <Card
                        style={{
                            ...cardStyle,
                            backgroundColor: "#14B8A6",
                        }}
                        onClick={() => navigate("/wordlist")}
                    >
                        <h1 style={titleStyle}>重要単語</h1>
                    </Card>

                    <Card
                        style={{
                            ...cardStyle,
                            backgroundColor: "#EF4444",
                        }}
                        onClick={() => navigate("/wordlist")}
                    >
                        <h1 style={titleStyle}>バツ単語</h1>
                    </Card>
                </div>
            </div>
        </>
    );
}