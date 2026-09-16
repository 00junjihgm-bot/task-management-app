import React from 'react';

export function TopPage({ auth, onNavigate }) {
    // ログインユーザーが ROLE_ADMIN 権限を持っているか判定
    const isAdmin = auth?.roles && auth.roles.includes('ROLE_ADMIN');

    return (
        <div style={{ textAlign: 'center', padding: '50px 20px', fontFamily: 'sans-serif' }}>
            <h1 style={{ marginBottom: '10px', color: '#333' }}>タスク＆リソース管理システム</h1>
            <p style={{ color: '#666', marginBottom: '40px' }}>
                メニューを選択して管理画面に移動してください。
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
                {/* タスク管理への遷移ボタン */}
                <div
                    onClick={() => onNavigate('task')}
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '12px',
                        padding: '30px',
                        width: '220px',
                        cursor: 'pointer',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                >
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>📋</div>
                    <h2 style={{ fontSize: '20px', margin: '10px 0', color: '#007bff' }}>タスク管理</h2>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                        タスクの新規登録、進捗確認、担当者の割り当てを行います。
                    </p>
                </div>

                {/* リソース管理への遷移ボタン */}
                <div
                    onClick={() => onNavigate('resource')}
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '12px',
                        padding: '30px',
                        width: '220px',
                        cursor: 'pointer',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                >
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>👤</div>
                    <h2 style={{ fontSize: '20px', margin: '10px 0', color: '#28a745' }}>リソース（担当者）管理</h2>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                        担当者の新規追加、情報編集、削除を行います。
                    </p>
                </div>

                {/* ★ ROLE_ADMIN 専用：ユーザーアカウント登録ボタン */}
                {isAdmin && (
                    <div
                        onClick={() => onNavigate('user-create')}
                        style={{
                            border: '1px solid #ffeba2',
                            borderRadius: '12px',
                            padding: '30px',
                            width: '220px',
                            cursor: 'pointer',
                            backgroundColor: '#fffdf5',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                    >
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔐</div>
                        <h2 style={{ fontSize: '20px', margin: '10px 0', color: '#d97706' }}>ユーザーアカウント登録</h2>
                        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                            新規ユーザーアカウントを追加します（管理者専用）。
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TopPage;