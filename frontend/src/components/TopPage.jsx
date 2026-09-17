import React, { useState } from 'react';
import './TopPage.css'; // 専用のCSSファイルをインポート

export function TopPage({ auth, onNavigate }) {
    const [errorMessage, setErrorMessage] = useState('');

    // ログインユーザーが ROLE_ADMIN 権限を持っているか判定
    const isAdmin = auth?.roles && auth.roles.includes('ROLE_ADMIN');

    // リソース管理へのクリックハンドラー
    const handleResourceClick = () => {
        if (!isAdmin) {
            setErrorMessage('権限がありません（リソース管理は管理者のみ利用可能です）');
            return;
        }
        setErrorMessage('');
        onNavigate('resource');
    };

    return (
        <div className="top-container">
            <h1 className="top-title">タスク＆リソース管理システム</h1>
            <p className="top-subtitle">
                メニューを選択して管理画面に移動してください。
            </p>

            {/* 権限エラーメッセージの表示 */}
            {errorMessage && (
                <div className="top-error-message">
                    {errorMessage}
                </div>
            )}

            <div className="top-card-grid">
                {/* タスク管理への遷移ボタン（誰でもアクセス可能） */}
                <div
                    className="top-card"
                    onClick={() => { setErrorMessage(''); onNavigate('task'); }}
                >
                    <div className="top-card-icon">📋</div>
                    <h2 className="top-card-title task-title">タスク管理</h2>
                    <p className="top-card-desc">
                        タスクの新規登録、進捗確認、担当者の割り当てを行います。
                    </p>
                </div>

                {/* リソース管理への遷移ボタン（管理者のみアクセス可能） */}
                <div
                    className={`top-card ${!isAdmin ? 'top-card-disabled' : ''}`}
                    onClick={handleResourceClick}
                >
                    <div className="top-card-icon">👤</div>
                    <h2 className="top-card-title resource-title">リソース（担当者）管理</h2>
                    <p className="top-card-desc">
                        担当者の新規追加、情報編集、削除を行います。（管理者限定）
                    </p>
                </div>

                {/* ★ ROLE_ADMIN 専用：ユーザーアカウント登録ボタン */}
                {isAdmin && (
                    <div
                        className="top-card admin-card"
                        onClick={() => { setErrorMessage(''); onNavigate('user-create'); }}
                    >
                        <div className="top-card-icon">🔐</div>
                        <h2 className="top-card-title admin-title">ユーザーアカウント登録</h2>
                        <p className="top-card-desc">
                            新規ユーザーアカウントを追加します（管理者専用）。
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TopPage;