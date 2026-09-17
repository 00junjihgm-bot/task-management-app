import React, { useState, useEffect, useCallback } from 'react';
import './TaskCreatePage.css'; // 専用CSSのインポート

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

        const payload = {
            taskId: isEdit ? Number(formData.id) : undefined,
            id: isEdit ? Number(formData.id) : undefined,
            taskName: formData.taskName,
            resourceId: formData.resourceId ? Number(formData.resourceId) : null,
            deadline: formData.dueDate,
            dueDate: formData.dueDate,
            complete: formData.complete || null,
            status: formData.status,
            checkFlag: formData.status === '完了',
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

    const isFieldDisabled = !isAdmin && Boolean(formData.id);

    return (
        <div className="task-create-container">
            <h1>{formData.id ? `タスク編集 (ID: ${formData.id})` : '新規タスク登録'}</h1>

            {!isAdmin && formData.id && (
                <div className="task-create-notice">
                    ※一般ユーザーのため、「実施日」と「ステータス」のみ変更可能です。
                </div>
            )}

            {error && (
                <div className="task-create-error">
                    {error}
                </div>
            )}

            <form onSubmit={(e) => void handleSubmit(e)} className="task-create-form">
                <div className="task-form-group">
                    <label className="task-form-label">タスク名 *:</label>
                    <input
                        type="text"
                        name="taskName"
                        value={formData.taskName}
                        onChange={handleChange}
                        required
                        disabled={isFieldDisabled}
                        className={`task-form-input ${isFieldDisabled ? 'task-input-disabled' : ''}`}
                    />
                </div>

                <div className="task-form-group">
                    <label className="task-form-label">担当者:</label>
                    <select
                        name="resourceId"
                        value={formData.resourceId}
                        onChange={handleChange}
                        disabled={isFieldDisabled}
                        className={`task-form-input ${isFieldDisabled ? 'task-input-disabled' : ''}`}
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

                <div className="task-form-group">
                    <label className="task-form-label">期限:</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        disabled={isFieldDisabled}
                        className={`task-form-input ${isFieldDisabled ? 'task-input-disabled' : ''}`}
                    />
                </div>

                {/* 実施日（complete）- 一般ユーザーも編集可能 */}
                <div className="task-form-group">
                    <label className="task-form-label">実施日:</label>
                    <input
                        type="date"
                        name="complete"
                        value={formData.complete}
                        onChange={handleChange}
                        className="task-form-input"
                    />
                </div>

                {/* ステータス - 一般ユーザーも編集可能 */}
                <div className="task-form-group">
                    <label className="task-form-label">ステータス:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="task-form-input"
                    >
                        <option value="未着手">未着手</option>
                        <option value="完了">完了</option>
                    </select>
                </div>

                <div className="task-form-actions">
                    <button type="submit" className="task-btn-submit">
                        {formData.id ? '更新する' : '登録する'}
                    </button>
                    <button type="button" onClick={onCancel} className="task-btn-cancel">
                        一覧へ戻る
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TaskCreatePage;