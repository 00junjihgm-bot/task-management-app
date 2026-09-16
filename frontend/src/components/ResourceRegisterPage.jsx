import { useState, useEffect, useCallback } from 'react';

const API_RESOURCE_URL = 'http://localhost:8080/api/resources';

export function ResourceRegisterPage({ credentials }) {
    const [resources, setResources] = useState([]);
    const [error, setError] = useState('');

    // フォームの状態管理
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        department: '',
        position: '',
        email: '',
    });

    // 共通の認証ヘッダーを生成するヘルパー関数
    const getAuthHeaders = useCallback((customHeaders = {}) => {
        const headers = { ...customHeaders };
        if (credentials) {
            headers['Authorization'] = `Basic ${credentials}`;
        }
        return headers;
    }, [credentials]);

    // リソース一覧を取得 (GET)
    const fetchResources = useCallback(async () => {
        setError('');
        try {
            const res = await fetch(API_RESOURCE_URL, {
                headers: getAuthHeaders(),
            });
            if (!res.ok) {
                setError('リソース情報の取得に失敗しました');
                return;
            }
            const data = await res.json();
            setResources(data);
        } catch {
            setError('サーバーとの通信に失敗しました');
        }
    }, [getAuthHeaders]);

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

    // 入力ハンドリング
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // フォームリセット
    const handleReset = () => {
        setFormData({
            id: '',
            name: '',
            department: '',
            position: '',
            email: '',
        });
    };

    // 新規登録 (POST) / 更新 (PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const isEdit = Boolean(formData.id);
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `${API_RESOURCE_URL}/${formData.id}` : API_RESOURCE_URL;

        const payload = {
            id: isEdit ? Number(formData.id) : undefined,
            name: formData.name,
            department: formData.department,
            position: formData.position,
            email: formData.email,
        };

        try {
            const res = await fetch(url, {
                method,
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                setError(errorData.message || '保存に失敗しました');
                return;
            }

            handleReset();
            await fetchResources();
        } catch {
            setError('サーバーとの通信に失敗しました');
        }
    };

    // 編集モードセット
    const handleEdit = (resource) => {
        setFormData({
            id: resource.id ?? resource.resourceId ?? '',
            name: resource.name ?? '',
            department: resource.department ?? '',
            position: resource.position ?? '',
            email: resource.email ?? '',
        });
    };

    // 削除 (DELETE)
    const handleDelete = async (id) => {
        if (!window.confirm('本当に削除しますか？')) return;
        setError('');

        try {
            const res = await fetch(`${API_RESOURCE_URL}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
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
            <h1>リソース（担当者）管理</h1>

            {/* エラーメッセージ表示 */}
            {error && (
                <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* リソース一覧 */}
                <div style={{ flex: 2 }}>
                    <h2>担当者一覧</h2>
                    <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th>ID</th>
                            <th>氏名</th>
                            <th>所属</th>
                            <th>役職</th>
                            <th>メール</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {resources.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>データがありません</td>
                            </tr>
                        ) : (
                            resources.map((r) => {
                                const resId = r.id ?? r.resourceId;
                                return (
                                    <tr key={resId}>
                                        <td>{resId}</td>
                                        <td>{r.name}</td>
                                        <td>{r.department ?? '-'}</td>
                                        <td>{r.position ?? '-'}</td>
                                        <td>{r.email ?? '-'}</td>
                                        <td>
                                            <button onClick={() => handleEdit(r)}>編集</button>{' '}
                                            <button onClick={() => void handleDelete(resId)}>削除</button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 登録・更新フォーム */}
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                    <h2>{formData.id ? `編集 (ID: ${formData.id})` : '新規登録'}</h2>
                    <form onSubmit={(e) => void handleSubmit(e)}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block' }}>氏名 *:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block' }}>所属:</label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block' }}>役職:</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block' }}>メールアドレス:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <button type="submit">{formData.id ? '更新' : '登録'}</button>{' '}
                        <button type="button" onClick={handleReset}>キャンセル</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResourceRegisterPage;