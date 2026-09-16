import { useState, useEffect, useCallback } from 'react';

const API_RESOURCE_URL = 'http://localhost:8080/api/resources';

export function ResourceListPage({ credentials, onNavigateToCreate, onEditResource }) {
    const [resources, setResources] = useState([]);
    const [error, setError] = useState('');

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
                setError('リソース一覧の取得に失敗しました');
                return;
            }
            const data = await res.json();
            setResources(data);
        } catch {
            setError('サーバーとの通信に失敗しました');
        }
    }, [getAuthHeaders]);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            if (isMounted) {
                await fetchResources();
            }
        };
        void load();
        return () => { isMounted = false; };
    }, [fetchResources]);

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
                setError('削除に失敗しました');
                return;
            }
            await fetchResources();
        } catch {
            setError('サーバーとの通信に失敗しました');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h1>👤 リソース（担当者）一覧</h1>
                <button
                    onClick={onNavigateToCreate}
                    style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    ＋ 新規リソース登録
                </button>
            </div>

            {error && (
                <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th>ID</th>
                    <th>氏名</th>
                    <th>所属部署</th>
                    <th>メールアドレス</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {resources.length === 0 ? (
                    <tr>
                        <td colSpan="5" style={{ textAlign: 'center' }}>データがありません</td>
                    </tr>
                ) : (
                    resources.map((resource) => {
                        const rId = resource.id ?? resource.resourceId;
                        return (
                            <tr key={rId}>
                                <td>{rId}</td>
                                <td>{resource.name}</td>
                                <td>{resource.department ?? '-'}</td>
                                <td>{resource.email ?? '-'}</td>
                                <td>
                                    <button onClick={() => onEditResource(resource)}>編集</button>{' '}
                                    <button onClick={() => void handleDelete(rId)}>削除</button>
                                </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
}