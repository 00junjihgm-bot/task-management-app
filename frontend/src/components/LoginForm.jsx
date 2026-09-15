import React, { useState } from 'react';

export function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic 認証用の Authorization ヘッダー値を作成 (Base64エンコード)
        const credentials = btoa(`${username}:${password}`);

        try {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                // ログイン情報を保持＆呼び出し元に通知
                onLoginSuccess({
                    username: userData.username,
                    roles: userData.roles,
                    credentials // 以降の認証付き API 呼び出し用
                });
            } else {
                setError('ユーザー名またはパスワードが正しくありません');
            }
        } catch (err) {
            setError('通信エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '360px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>ログイン</h2>
            {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>ユーザー名</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '4px' }}>パスワード</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {loading ? 'ログイン中...' : 'ログイン'}
                </button>
            </form>
        </div>
    );
}