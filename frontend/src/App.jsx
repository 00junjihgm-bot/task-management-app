import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { TopPage } from './components/TopPage';
import { TaskListPage } from './components/TaskListPage';
import { TaskCreatePage } from './components/TaskCreatePage';
import { ResourceRegisterPage } from './components/ResourceRegisterPage';

export function App() {
    // ログイン認証情報 ({ username, roles, credentials })
    const [auth, setAuth] = useState(null);
    // 表示中のページを管理 ('top' | 'task' | 'task-create' | 'resource')
    const [currentPage, setCurrentPage] = useState('top');
    // 編集対象のタスクデータ（新規登録時は null）
    const [editingTask, setEditingTask] = useState(null);

    // ログイン成功時の処理
    const handleLoginSuccess = (authData) => {
        setAuth(authData);
        setCurrentPage('top');
    };

    // ログアウト処理
    const handleLogout = () => {
        setAuth(null);
        setCurrentPage('top');
    };

    // --- タスク画面用の遷移ハンドラー ---
    const handleGoToTaskCreate = () => {
        setEditingTask(null);
        setCurrentPage('task-create');
    };

    const handleGoToTaskEdit = (task) => {
        setEditingTask(task);
        setCurrentPage('task-create');
    };

    const handleGoToTaskList = () => {
        setEditingTask(null);
        setCurrentPage('task');
    };

    // 未ログイン時
    if (!auth) {
        return <LoginForm onLoginSuccess={handleLoginSuccess} />;
    }

    // ログイン完了時
    return (
        <div>
            {/* 共通ヘッダーナビゲーション */}
            <nav style={{
                backgroundColor: '#333',
                padding: '12px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#fff'
            }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button
                        onClick={() => setCurrentPage('top')}
                        style={{
                            backgroundColor: currentPage === 'top' ? '#555' : 'transparent',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 15px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        🏠 トップ
                    </button>

                    <button
                        onClick={handleGoToTaskList}
                        style={{
                            backgroundColor: (currentPage === 'task' || currentPage === 'task-create') ? '#007bff' : 'transparent',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 15px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        📋 タスク管理
                    </button>

                    <button
                        onClick={() => setCurrentPage('resource')}
                        style={{
                            backgroundColor: currentPage === 'resource' ? '#28a745' : 'transparent',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 15px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        👤 リソース管理
                    </button>
                </div>

                {/* ログイン中のユーザー情報 & ログアウトボタン */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '14px' }}>👤 {auth.username} 様</span>
                    <button
                        onClick={handleLogout}
                        style={{
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px'
                        }}
                    >
                        ログアウト
                    </button>
                </div>
            </nav>

            {/* ページの動的切替 */}
            <main>
                {currentPage === 'top' && (
                    <TopPage onNavigate={setCurrentPage} />
                )}

                {currentPage === 'task' && (
                    <TaskListPage
                        credentials={auth.credentials}
                        onNavigateToCreate={handleGoToTaskCreate}
                        onEditTask={handleGoToTaskEdit}
                    />
                )}

                {currentPage === 'task-create' && (
                    <TaskCreatePage
                        credentials={auth.credentials}
                        initialTask={editingTask}
                        onCancel={handleGoToTaskList}
                        onSuccess={handleGoToTaskList}
                    />
                )}

                {currentPage === 'resource' && (
                    <ResourceRegisterPage credentials={auth.credentials} />
                )}
            </main>
        </div>
    );
}