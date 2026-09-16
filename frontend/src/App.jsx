import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { TopPage } from './components/TopPage';
import { TaskListPage } from './components/TaskListPage';
import { TaskCreatePage } from './components/TaskCreatePage';
import { ResourceListPage } from './components/ResourceListPage';
import { ResourceCreatePage } from './components/ResourceCreatePage';

export function App() {
    const [auth, setAuth] = useState(null);

    // 表示中のページを管理 ('top' | 'task' | 'task-create' | 'resource' | 'resource-create' | 'user-create')
    const [currentPage, setCurrentPage] = useState('top');

    // 編集用ステート
    const [editingTask, setEditingTask] = useState(null);
    const [editingResource, setEditingResource] = useState(null);

    const handleLoginSuccess = (authData) => {
        setAuth(authData);
        setCurrentPage('top');
    };

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

    // --- リソース画面用の遷移ハンドラー ---
    const handleGoToResourceCreate = () => {
        setEditingResource(null);
        setCurrentPage('resource-create');
    };

    const handleGoToResourceEdit = (resource) => {
        setEditingResource(resource);
        setCurrentPage('resource-create');
    };

    const handleGoToResourceList = () => {
        setEditingResource(null);
        setCurrentPage('resource');
    };

    // 未認証時は LoginForm のみ表示
    if (!auth) {
        return <LoginForm onLoginSuccess={handleLoginSuccess} />;
    }

    // ログインユーザーが ROLE_ADMIN 権限を持っているか判定
    const isAdmin = auth.roles && auth.roles.includes('ROLE_ADMIN');

    return (
        <div>
            {/* ヘッダーバー：ログイン者情報とログアウトボタン */}
            <header style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '10px 20px',
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #dee2e6',
                gap: '15px'
            }}>
                <span style={{ fontSize: '14px', color: '#333' }}>
                    👤 {auth.username} 様 ({isAdmin ? '管理者' : '一般'})
                </span>
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
            </header>

            {/* ページの動的切替 */}
            <main style={{ padding: '20px' }}>
                {currentPage === 'top' && (
                    <TopPage auth={auth} onNavigate={setCurrentPage} />
                )}

                {/* タスク一覧・登録 */}
                {currentPage === 'task' && (
                    <TaskListPage
                        credentials={auth.credentials}
                        auth={auth}
                        onNavigateToCreate={handleGoToTaskCreate}
                        onEditTask={handleGoToTaskEdit}
                        onBackToTop={() => setCurrentPage('top')}
                    />
                )}
                {currentPage === 'task-create' && (
                    <TaskCreatePage
                        credentials={auth.credentials}
                        auth={auth}
                        initialTask={editingTask}
                        onCancel={handleGoToTaskList}
                        onSuccess={handleGoToTaskList}
                    />
                )}

                {/* リソース一覧・登録 */}
                {currentPage === 'resource' && (
                    <ResourceListPage
                        credentials={auth.credentials}
                        onNavigateToCreate={handleGoToResourceCreate}
                        onEditResource={handleGoToResourceEdit}
                        onBackToTop={() => setCurrentPage('top')}
                    />
                )}
                {currentPage === 'resource-create' && (
                    <ResourceCreatePage
                        credentials={auth.credentials}
                        initialResource={editingResource}
                        onCancel={handleGoToResourceList}
                        onSuccess={handleGoToResourceList}
                    />
                )}

                {/* トップ画面の「ユーザーアカウント登録」カードをクリックした際に表示 */}
                {currentPage === 'user-create' && isAdmin && (
                    <RegisterForm
                        credentials={auth.credentials}
                        onSuccess={() => setCurrentPage('top')}
                        onNavigateTop={() => setCurrentPage('top')}
                    />
                )}
            </main>
        </div>
    );
}

export default App;