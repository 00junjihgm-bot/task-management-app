import { useState, useEffect, useCallback } from 'react';

const API_TASK_URL = 'http://localhost:8080/api/tasks';
const API_RESOURCE_URL = 'http://localhost:8080/api/resources';

export function TaskCreatePage({ credentials, initialTask, onCancel, onSuccess }) {
    const [resources, setResources] = useState([]);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        id: initialTask?.id ?? initialTask?.taskId ?? '',
        taskName: initialTask?.taskName ?? initialTask?.title ?? '',
        resourceId: initialTask?.resourceId ?? '',
        dueDate: initialTask?.dueDate ?? '',
        status: initialTask?.status ?? '未着手',
        completed: initialTask?.completed ?? false,
    });

    const getAuthHeaders = useCallback((customHeaders = {}) => {
        const headers = { ...customHeaders };
        if (credentials) {
            headers['Authorization'] = `Basic ${credentials}`;
        }
        return headers;
    }, [credentials]);

    useEffect(() => {
        let isMounted = true;
        const fetchResources = async () => {
            try {
                const res = await fetch(API_RESOURCE_URL, {
                    headers: getAuthHeaders(),
                });
                if (res.ok && isMounted) {
                    const data = await res.json();
                    setResources(data);
                }
            } catch {
                // エラー時は何もしない
            }
        };
        void fetchResources();
        return () => { isMounted = false; };
    }, [getAuthHeaders]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const isEdit = Boolean(formData.id);
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `${API_TASK_URL}/${formData.id}` : API_TASK_URL;

        const payload = {
            id: isEdit ? Number(formData.id) : undefined,
            taskName: formData.taskName,
            resourceId: formData.resourceId ? Number(formData.resourceId) : null,
            dueDate: formData.dueDate,
            status: formData.status,
            completed: formData.completed,
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

            onSuccess();
        } catch {
            setError('サーバーとの通信に失敗しました');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <h1>{formData.id ? `タスク編集 (ID: ${formData.id})` : '新規タスク登録'}</h1>

            {error && (
                <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={(e) => void handleSubmit(e)} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>タスク名 *:</label>
                    <input
                        type="text"
                        name="taskName"
                        value={formData.taskName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>担当者:</label>
                    <select
                        name="resourceId"
                        value={formData.resourceId}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    >
                        <option value="">未設定</option>
                        {resources.map((r) => {
                            const rId = r.id ?? r.resourceId;
                            return (
                                <option key={rId} value={rId}>
                                    {r.name} ({r.department ?? '所属なし'})
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>期限:</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>ステータス:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    >
                        <option value="未着手">未着手</option>
                        <option value="進行中">進行中</option>
                        <option value="完了">完了</option>
                    </select>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {formData.id ? '更新する' : '登録する'}
                    </button>
                    <button type="button" onClick={onCancel} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        キャンセル（一覧へ戻る）
                    </button>
                </div>
            </form>
        </div>
    );
}