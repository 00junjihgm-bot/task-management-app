import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { TopPage } from './components/TopPage';
import { TaskListPage } from './components/TaskListPage';
import { TaskCreatePage } from './components/TaskCreatePage';
import { ResourceListPage } from './components/ResourceListPage';
import { ResourceCreatePage } from './components/ResourceCreatePage';

// 作成したCSSファイルをインポート
import './App.css';

export function App() {
    const [auth, setAuth] = useState(null);
    const [currentPage, setCurrentPage] = useState('top');
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

    if (!auth) {
        return <LoginForm onLoginSuccess={handleLoginSuccess} />;
    }

    const isAdmin = auth.roles && auth.roles.includes('ROLE_ADMIN');

    return (
        <div>
            {/* ヘッダーバー：クラス名で指定 */}
            <header className="app-header">
                <span className="app-user-info">
                    👤 {auth.username} 様 ({isAdmin ? '管理者' : '一般'})
                </span>
                <button
                    onClick={handleLogout}
                    className="app-logout-button"
                >
                    ログアウト
                </button>
            </header>

            {/* ページの動的切替：クラス名で指定 */}
            <main className="app-main">
                {currentPage === 'top' && (
                    <TopPage auth={auth} onNavigate={setCurrentPage} />
                )}

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