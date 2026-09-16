import React, { useState, useEffect, useCallback } from 'react';

const API_TASK_URL = 'http://localhost:8080/api/tasks';
const API_RESOURCE_URL = 'http://localhost:8080/api/resources';

export function TaskCreatePage({ credentials, auth, isAdmin: propIsAdmin, initialTask, onCancel, onSuccess }) {
    const [resources, setResources] = useState([]);
    const [error, setError] = useState('');

    // 【管理者判定のロジック】
    let isAdmin = propIsAdmin ?? false;

    if (!isAdmin && auth) {
        const roles = auth.roles ?? auth.role;
        if (Array.isArray(roles)) {
            isAdmin = roles.some(r => r.toUpperCase().includes('ADMIN'));
        } else if (typeof roles === 'string') {
            isAdmin = roles.toUpperCase().includes('ADMIN');
        }
    }

    if (!isAdmin && credentials) {
        try {
            const decoded = atob(credentials);
            const username = decoded.split(':')[0];
            if (username === 'admin') {
                isAdmin = true;
            }
        } catch (e) {
            // デコード失敗時は無視
        }
    }

    // 初期入力データの設定
    const [formData, setFormData] = useState({
        id: initialTask?.taskId ?? initialTask?.id ?? '',
        taskName: initialTask?.taskName ?? initialTask?.title ?? '',
        resourceId: initialTask?.resourceId ?? initialTask?.resource?.resourceId ?? initialTask?.resource?.id ?? '',
        dueDate: initialTask?.deadline ?? initialTask?.dueDate ?? '',
        complete: initialTask?.complete ?? '',
        status: initialTask?.status ?? '未着手',
    });

    // initialTask が渡された際にフォームデータをセット
    useEffect(() => {
        if (initialTask) {
            setFormData({
                id: initialTask.taskId ?? initialTask.id ?? '',
                taskName: initialTask.taskName ?? initialTask.title ?? '',
                resourceId: initialTask.resourceId ?? initialTask?.resource?.resourceId ?? initialTask?.resource?.id ?? '',
                dueDate: initialTask.deadline ?? initialTask.dueDate ?? '',
                complete: initialTask.complete ?? '',
                status: initialTask.status ?? '未着手',
            });
        }
    }, [initialTask]);

    const getAuthHeaders = useCallback((customHeaders = {}) => {
        const headers = { ...customHeaders };
        if (credentials) {
            headers['Authorization'] = `Basic ${credentials}`;
        }
        return headers;
    }, [credentials]);

    // 担当者一覧を取得
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

        // バックエンドが受け取るプロパティ名に合わせて送信用ペイロードを作成
        const payload = {
            taskId: isEdit ? Number(formData.id) : undefined,
            id: isEdit ? Number(formData.id) : undefined,
            taskName: formData.taskName,
            resourceId: formData.resourceId ? Number(formData.resourceId) : null,
            deadline: formData.dueDate,
            dueDate: formData.dueDate,
            complete: formData.complete || null,
            status: formData.status,
            checkFlag: formData.status === '完了', // ステータスに連動させる場合
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

            {!isAdmin && formData.id && (
                <div style={{ color: '#0c5460', backgroundColor: '#d1ecf1', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
                    ※一般ユーザーのため、「実施日」と「ステータス」のみ変更可能です。
                </div>
            )}

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
                        disabled={!isAdmin && Boolean(formData.id)} // 一般ユーザーの編集時は無効化
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box',
                            backgroundColor: !isAdmin && Boolean(formData.id) ? '#e9ecef' : '#fff'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>担当者:</label>
                    <select
                        name="resourceId"
                        value={formData.resourceId}
                        onChange={handleChange}
                        disabled={!isAdmin && Boolean(formData.id)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box',
                            backgroundColor: !isAdmin && Boolean(formData.id) ? '#e9ecef' : '#fff'
                        }}
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
                        disabled={!isAdmin && Boolean(formData.id)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            boxSizing: 'border-box',
                            backgroundColor: !isAdmin && Boolean(formData.id) ? '#e9ecef' : '#fff'
                        }}
                    />
                </div>

                {/* 実施日（complete）- 一般ユーザーも編集可能 */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>実施日:</label>
                    <input
                        type="date"
                        name="complete"
                        value={formData.complete}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                {/* ステータス - 一般ユーザーも編集可能 */}
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
                        一覧へ戻る
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TaskCreatePage;