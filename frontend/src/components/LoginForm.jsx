import { useState } from 'react';
import './LoginForm.css'; // 専用CSSのインポート

const API_BASE_URL = 'http://localhost:8080'; // バックエンドのベースURL

export function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // 日本語文字が含まれていても安全に Base64 エンコードする処理
        const credentials = btoa(unescape(encodeURIComponent(`${username}:${password}`)));

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                // ログイン成功情報を呼び出し元 (App.jsx) に通知
                onLoginSuccess({
                    username: userData.username,
                    roles: userData.roles,
                    credentials // 以降の各API呼び出し時に Authorization ヘッダーで使用
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
        <div className="login-container">
            <h2>タスク管理アプリ</h2>
            {error && <p className="login-error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="login-group">
                    <label className="login-label">ユーザー名</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="login-input"
                    />
                </div>

                <div className="login-group-last">
                    <label className="login-label">パスワード</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`login-submit-btn ${loading ? 'login-loading' : ''}`}
                >
                    {loading ? 'ログイン中...' : 'ログイン'}
                </button>
            </form>
        </div>
    );
}

export default LoginForm;