import { useState, useEffect, useCallback } from 'react';

const API_TASK_URL = 'http://localhost:8080/api/tasks';

export function TaskListPage({ credentials, onNavigateToCreate, onEditTask }) {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');

    const getAuthHeaders = useCallback((customHeaders = {}) => {
        const headers = { ...customHeaders };
        if (credentials) {
            headers['Authorization'] = `Basic ${credentials}`;
        }
        return headers;
    }, [credentials]);

    const fetchTasks = useCallback(async () => {
        setError('');
        try {
            const res = await fetch(API_TASK_URL, {
                headers: getAuthHeaders(),
            });
            if (!res.ok) {
                setError('タスク一覧の取得に失敗しました');
                return;
            }
            const data = await res.json();
            setTasks(data);
        } catch {
            setError('サーバーとの通信に失敗しました');
        }
    }, [getAuthHeaders]);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            if (isMounted) {
                await fetchTasks();
            }
        };
        void load();
        return () => { isMounted = false; };
    }, [fetchTasks]);

    const handleToggleComplete = async (task) => {
        const taskId = task.id ?? task.taskId;
        const updatedTask = {
            ...task,
            id: taskId,
            completed: !task.completed,
        };

        try {
            const res = await fetch(`${API_TASK_URL}/${taskId}`, {
                method: 'PUT',
                headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(updatedTask),
            });
            if (!res.ok) {
                setError('完了状態の更新に失敗しました');
                return;
            }
            await fetchTasks();
        } catch {
            setError('サーバーとの通信に失敗しました');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('本当に削除しますか？')) return;
        setError('');

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

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h1>📋 タスク一覧</h1>
                <button
                    onClick={onNavigateToCreate}
                    style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    ＋ 新規タスク登録
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
                        const taskId = task.id ?? task.taskId;
                        const isCompleted = Boolean(task.completed);
                        return (
                            <tr key={taskId} style={{ backgroundColor: isCompleted ? '#f9f9f9' : 'transparent' }}>
                                <td style={{ textAlign: 'center' }}>
                                    <input
                                        type="checkbox"
                                        checked={isCompleted}
                                        onChange={() => void handleToggleComplete(task)}
                                        style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                                    />
                                </td>
                                <td>{taskId}</td>
                                <td style={{ textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? '#888' : '#000' }}>
                                    {task.taskName ?? task.title}
                                </td>
                                <td>{task.resourceName ?? task.assignee ?? '-'}</td>
                                <td>{task.dueDate ?? '-'}</td>
                                <td>{task.status ?? (isCompleted ? '完了' : '未完了')}</td>
                                <td>
                                    <button onClick={() => onEditTask(task)}>編集</button>{' '}
                                    <button onClick={() => void handleDelete(taskId)}>削除</button>
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