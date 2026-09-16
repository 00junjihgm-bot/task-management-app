import React, { useState, useEffect } from 'react';

// APIのベースURL
const API_TASK_URL = 'http://localhost:8080/api/tasks';

export function TaskListPage({ credentials, auth, isAdmin: propIsAdmin, onNavigateToCreate, onEditTask }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // 認証ヘッダーの取得
    const getAuthHeaders = (extraHeaders = {}) => {
        const headers = { ...extraHeaders };
        if (credentials) {
            headers['Authorization'] = `Basic ${credentials}`;
        }
        return headers;
    };

    // 1. タスク一覧の取得
    const fetchTasks = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(API_TASK_URL, {
                headers: getAuthHeaders(),
            });

            if (!res.ok) {
                setError(`タスク一覧の取得に失敗しました (Status: ${res.status})`);
                return;
            }

            const data = await res.json();
            setTasks(data);
        } catch (err) {
            console.error('一覧取得通信エラー:', err);
            setError('サーバーとの通信に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchTasks();
    }, []);

    // 2. 完了/未完了の切り替え処理 (PUT)
    const handleToggleComplete = async (task) => {
        const taskId = task.taskId ?? task.id;
        if (!taskId) {
            setError('タスクIDが見つかりません');
            return;
        }

        const currentCompleted = Boolean(task.checkFlag ?? task.completed ?? (task.status === '完了'));
        const nextCompletedState = !currentCompleted;

        const dtoPayload = {
            taskName: task.taskName,
            deadline: task.deadline || null,
            complete: nextCompletedState ? new Date().toISOString().split('T')[0] : null,
            checkFlag: nextCompletedState,
            resourceId: task.resourceId ?? task.resource?.resourceId ?? task.resource?.id ?? null,
        };

        try {
            const res = await fetch(`${API_TASK_URL}/${taskId}`, {
                method: 'PUT',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(dtoPayload),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error('更新エラー詳細:', res.status, errText);
                setError(`更新に失敗しました (Status: ${res.status})`);
                return;
            }

            await fetchTasks();
        } catch (err) {
            console.error('通信エラー:', err);
            setError('サーバーとの通信に失敗しました');
        }
    };

    // 3. タスク削除処理 (DELETE)
    const handleDelete = async (id) => {
        if (!isAdmin) {
            setError('権限エラー: 削除は管理者のみ可能です');
            return;
        }

        if (!window.confirm('本当に削除しますか？')) return;
        setError(null);

        try {
            const res = await fetch(`${API_TASK_URL}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            if (!res.ok) {
                setError('削除に失敗しました');
                return;
            }
            await fetchTasks();
        } catch {
            setError('サーバーとの通信に失敗しました');
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h1>📋 タスク一覧</h1>
                {onNavigateToCreate && (
                    <button
                        onClick={onNavigateToCreate}
                        style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        ＋ 新規タスク登録
                    </button>
                )}
            </div>

            {error && (
                <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ width: '50px', textAlign: 'center' }}>完了</th>
                    <th>ID</th>
                    <th>タスク名</th>
                    <th>担当者</th>
                    <th>期限</th>
                    <th>ステータス</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {tasks.length === 0 ? (
                    <tr>
                        <td colSpan="7" style={{ textAlign: 'center' }}>データがありません</td>
                    </tr>
                ) : (
                    tasks.map((task) => {
                        const taskId = task.taskId ?? task.id;
                        const isCompleted = Boolean(task.checkFlag ?? task.completed ?? (task.status === '完了'));

                        return (
                            <tr key={taskId} style={{ backgroundColor: isCompleted ? '#f9f9f9' : 'transparent' }}>
                                <td style={{ textAlign: 'center' }}>
                                    <input
                                        type="checkbox"
                                        checked={isCompleted}
                                        onChange={() => handleToggleComplete(task)}
                                        style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                                    />
                                </td>
                                <td>{taskId}</td>
                                <td style={{ textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? '#888' : '#000' }}>
                                    {task.taskName || '(名称なし)'}
                                </td>
                                <td>{task.resourceName || task.resource?.name || '-'}</td>
                                <td>{task.deadline || '-'}</td>
                                <td>{isCompleted ? '完了' : '未完了'}</td>
                                <td>
                                    {onEditTask && <button onClick={() => onEditTask(task)} style={{ marginRight: '5px' }}>編集</button>}
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(taskId)}
                                            style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            削除
                                        </button>
                                    )}
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

export default TaskListPage;