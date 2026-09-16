import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export function RegisterForm({ credentials, onSuccess, onNavigateTop }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                setMessage('新しいユーザーアカウントを作成しました');
                setUsername('');
                setPassword('');
                if (onSuccess) onSuccess();
            } else if (response.status === 403) {
                setError('権限エラー: ユーザー作成は管理者（ROLE_ADMIN）のみ可能です');
            } else {
                const text = await response.text();
                setError(text || '登録に失敗しました');
            }
        } catch (err) {
            setError('通信エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '360px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
            <h2>👤 ユーザーアカウント作成</h2>
            {message && <p style={{ color: 'green', fontSize: '14px' }}>{message}</p>}
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
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: loading ? '#6c757d' : '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: '15px'
                    }}
                >
                    {loading ? '登録中...' : 'ユーザーを作成'}
                </button>
            </form>

            {/* ★「トップページへ」戻るボタン */}
            <div style={{ textAlign: 'center' }}>
                <button
                    onClick={onNavigateTop}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#007bff',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: 0,
                        fontSize: '14px'
                    }}
                >
                    🏠 トップページへ
                </button>
            </div>
        </div>
    );
}

export default RegisterForm;