import { useState } from 'react';
import './RegisterForm.css'; // 専用CSSのインポート

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
        <div className="register-container">
            <h2>👤 ユーザーアカウント作成</h2>
            {message && <p className="register-message">{message}</p>}
            {error && <p className="register-error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="register-group">
                    <label className="register-label">ユーザー名</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="register-input"
                    />
                </div>

                <div className="register-group-last">
                    <label className="register-label">パスワード</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="register-input"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`register-submit-btn ${loading ? 'register-loading' : ''}`}
                >
                    {loading ? '登録中...' : 'ユーザーを作成'}
                </button>
            </form>

            {/* ★「トップページへ」戻るボタン */}
            <div className="register-nav-container">
                <button
                    onClick={onNavigateTop}
                    className="register-nav-btn"
                >
                    🏠 トップページへ
                </button>
            </div>
        </div>
    );
}

export default RegisterForm;