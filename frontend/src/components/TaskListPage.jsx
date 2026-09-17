import React, { useState, useEffect } from 'react';
import './TaskListPage.css'; // 専用CSSのインポート

// APIのベースURL
const API_TASK_URL = 'http://localhost:8080/api/tasks';

export function TaskListPage({ credentials, auth, isAdmin: propIsAdmin, onNavigateToCreate, onEditTask, onBackToTop }) {
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

    if (loading) return <div className="task-loading">読み込み中...</div>;

    return (
        <div className="task-container">
            {/* ★ トップに戻るボタンを左上に配置 */}
            {onBackToTop && (
                <div className="task-back-container">
                    <button
                        onClick={onBackToTop}
                        className="task-btn-secondary"
                    >
                        ← トップに戻る
                    </button>
                </div>
            )}

            <div className="task-header-row">
                <h1>📋 タスク一覧</h1>
                {onNavigateToCreate && (
                    <button
                        onClick={onNavigateToCreate}
                        className="task-btn-primary"
                    >
                        ＋ 新規タスク登録
                    </button>
                )}
            </div>

            {error && (
                <div className="task-error-banner">
                    {error}
                </div>
            )}

            <table className="task-table">
                <thead>
                <tr>
                    <th className="col-checkbox">完了</th>
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
                        <td colSpan="7" className="task-empty-cell">データがありません</td>
                    </tr>
                ) : (
                    tasks.map((task) => {
                        const taskId = task.taskId ?? task.id;
                        const isCompleted = Boolean(task.checkFlag ?? task.completed ?? (task.status === '完了'));

                        return (
                            <tr key={taskId} className={isCompleted ? 'task-row-completed' : ''}>
                                <td className="col-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={isCompleted}
                                        onChange={() => handleToggleComplete(task)}
                                        className="task-checkbox"
                                    />
                                </td>
                                <td>{taskId}</td>
                                <td className={isCompleted ? 'task-name-completed' : ''}>
                                    {task.taskName || '(名称なし)'}
                                </td>
                                <td>{task.resourceName || task.resource?.name || '-'}</td>
                                <td>{task.deadline || '-'}</td>
                                <td>{isCompleted ? '完了' : '未完了'}</td>
                                <td>
                                    {onEditTask && (
                                        <button
                                            onClick={() => onEditTask(task)}
                                            className="task-btn-edit"
                                        >
                                            編集
                                        </button>
                                    )}
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(taskId)}
                                            className="task-btn-delete"
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