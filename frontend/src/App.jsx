import { useState } from 'react';

function App() {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin123');
    const [responseLog, setResponseLog] = useState('「アクセステスト実行」ボタンを押すと結果が表示されます。');
    const [statusColor, setStatusColor] = useState('#333');

    const handleFetchAdminData = async () => {
        // ユーザー名とパスワードを Basic 認証用に Base64 エンコード
        const credentials = btoa(`${username}:${password}`);

        try {
            // ★ フルパスから相対パス (/api/admin/dashboard) に変更
            const response = await fetch('/api/admin/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });

            const textData = await response.text();

            if (response.ok) {
                setStatusColor('green');
                setResponseLog(`【成功】ステータスコード: ${response.status}\n\n[レスポンス内容]\n${textData}`);
            } else {
                setStatusColor('red');
                setResponseLog(`【エラー】ステータスコード: ${response.status}\n\n[レスポンス内容]\n${textData}`);
            }
        } catch (error) {
            setStatusColor('red');
            setResponseLog(`【通信エラー】\n${error.message}`);
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <h2>統合版 React → Spring Boot 連動テスト</h2>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'inline-block', width: '120px' }}>ユーザー名:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ padding: '0.4rem', width: '200px' }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'inline-block', width: '120px' }}>パスワード:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '0.4rem', width: '200px' }}
                />
            </div>

            <button
                onClick={handleFetchAdminData}
                style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                管理者エリアへアクセス
            </button>

            <h3>実行結果:</h3>
            <pre
                style={{
                    background: '#f4f4f4',
                    padding: '1rem',
                    borderRadius: '4px',
                    whiteSpace: 'pre-wrap',
                    color: statusColor,
                    fontWeight: 'bold'
                }}
            >
        {responseLog}
      </pre>
        </div>
    );
}

export default App;