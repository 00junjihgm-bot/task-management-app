import { useState, useEffect, useCallback } from 'react';
import './ResourceListPage.css'; // 専用CSSのインポート

const API_RESOURCE_URL = 'http://localhost:8080/api/resources';

export function ResourceListPage({ credentials, onNavigateToCreate, onEditResource, onBackToTop }) {
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
        <div className="resource-container">
            {/* ★ トップに戻るボタンを左上に配置 */}
            {onBackToTop && (
                <div className="resource-back-container">
                    <button
                        onClick={onBackToTop}
                        className="resource-btn-secondary"
                    >
                        ← トップに戻る
                    </button>
                </div>
            )}

            <div className="resource-header-row">
                <h1>👤 リソース（担当者）一覧</h1>
                <button
                    onClick={onNavigateToCreate}
                    className="resource-btn-primary"
                >
                    ＋ 新規リソース登録
                </button>
            </div>

            {error && (
                <div className="resource-error-banner">
                    {error}
                </div>
            )}

            <table className="resource-table">
                <thead>
                <tr>
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
                        <td colSpan="5" className="resource-empty-cell">データがありません</td>
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
                                    <button
                                        onClick={() => onEditResource(resource)}
                                        className="resource-btn-edit"
                                    >
                                        編集
                                    </button>
                                    <button
                                        onClick={() => void handleDelete(rId)}
                                        className="resource-btn-delete"
                                    >
                                        削除
                                    </button>
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

export default ResourceListPage;