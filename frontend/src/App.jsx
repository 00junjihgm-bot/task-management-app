import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:8080/api/resources';

export function App() {
    const [resources, setResources] = useState([]);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        department: '',
        position: '',
        email: '',
    });

    // 全件取得 (GET)
    const fetchResources = useCallback(async () => {
        setError('');
        try {
            const res = await fetch(API_URL);
            if (!res.ok) {
                setError('データの取得に失敗しました');
                return;
            }
            const data = await res.json();
            setResources(data);
        } catch {
            setError('サーバーとの通信に失敗しました');
        }
    }, []);

    // 初回ロード時
    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if (isMounted) {
                await fetchResources();
            }
        };
        void loadData();

        return () => {
            isMounted = false;
        };
    }, [fetchResources]);

    // フォーム入力のハンドリング
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // フォームリセット
    const handleReset = () => {
        setFormData({ id: '', name: '', department: '', position: '', email: '' });
    };

    // 新規登録 (POST) / 更新 (PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const isEdit = Boolean(formData.id);
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `${API_URL}/${formData.id}` : API_URL;

        // 新規登録時に id: "" を送信しないようペイロードを整形
        const payload = { ...formData };
        if (!isEdit) {
            delete payload.id;
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.message || '保存に失敗しました');
                return;
            }

            handleReset();
            await fetchResources();
        } catch {
            setError('サーバーとの通信に失敗しました');
        }
    };

    // 編集モードへのセット
    const handleEdit = (resource) => {
        setFormData(resource);
    };

    // 削除 (DELETE)
    const handleDelete = async (id) => {
        if (!window.confirm('本当に削除しますか？')) return;
        setError('');

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.message || '削除に失敗しました');
                return;
            }
            await fetchResources();
        } catch {
            setError('サーバーとの通信に失敗しました');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>リソース（担当者）管理システム</h1>

            {/* エラーメッセージ表示 */}
            {error && (
                <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* 一覧表示 */}
                <div style={{ flex: 2 }}>
                    <h2>担当者一覧</h2>
                    <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th>ID</th>
                            <th>名前</th>
                            <th>部署</th>
                            <th>役職</th>
                            <th>Email</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {resources.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>データがありません</td>
                            </tr>
                        ) : (
                            resources.map((r, index) => (
                                // key に r.id ?? index を指定して unique key 警告を回避
                                <tr key={r.id ?? index}>
                                    <td>{r.id}</td>
                                    <td>{r.name}</td>
                                    <td>{r.department}</td>
                                    <td>{r.position}</td>
                                    <td>{r.email}</td>
                                    <td>
                                        <button onClick={() => handleEdit(r)}>編集</button>{' '}
                                        <button onClick={() => void handleDelete(r.id)}>削除</button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 登録・更新フォーム */}
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h2>{formData.id ? `編集 (ID: ${formData.id})` : '新規登録'}</h2>
                    <form onSubmit={(e) => void handleSubmit(e)}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block' }}>名前:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block' }}>部署:</label>
                            <input type="text" name="department" value={formData.department} onChange={handleChange} required style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block' }}>役職:</label>
                            <input type="text" name="position" value={formData.position} onChange={handleChange} style={{ width: '100%' }} />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block' }}>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%' }} />
                        </div>
                        <button type="submit">{formData.id ? '更新' : '登録'}</button>{' '}
                        <button type="button" onClick={handleReset}>キャンセル</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;