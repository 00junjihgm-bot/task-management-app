import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './App'; // AuthContext から認証情報を取得

export default function ResourceRegisterPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        department: '',
        position: '',
        email: ''
    });

    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            const res = await fetch('/api/resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${user?.credentials}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('リソース情報を登録しました。');
                navigate('/dashboard');
            } else {
                setErrorMsg('登録に失敗しました。入力内容を確認してください。');
            }
        } catch (err) {
            setErrorMsg('通信エラーが発生しました。');
        }
    };

    return (
        <div style={styles.outerContainer}>
            <div style={styles.cardContainer}>
                {/* 画面タイトル */}
                <h1 style={styles.title}>リソース情報登録ページ</h1>

                {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

                {/* 登録フォーム */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.fieldRow}>
                        <label style={styles.label}>氏名 *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            maxLength={100}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.fieldRow}>
                        <label style={styles.label}>所属</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.fieldRow}>
                        <label style={styles.label}>役職</label>
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.fieldRow}>
                        <label style={styles.label}>mail</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            maxLength={100}
                            style={styles.input}
                        />
                    </div>

                    {/* 登録ボタン */}
                    <div style={styles.buttonRow}>
                        <button type="submit" style={styles.submitButton}>
                            登録する
                        </button>
                    </div>
                </form>

                {/* ログアウト */}
                <div style={styles.footerRow}>
                    <span onClick={logout} style={styles.logoutLink}>
                        ログアウト
                    </span>
                </div>
            </div>
        </div>
    );
}

// 画面イメージ（ワイヤーフレーム）を再現したスタイル設定
const styles = {
    outerContainer: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '50px',
        fontFamily: 'sans-serif'
    },
    cardContainer: {
        width: '920px',
        height: '420px',
        border: '1px solid #000',
        boxSizing: 'border-box',
        padding: '20px 30px',
        position: 'relative',
        backgroundColor: '#fff'
    },
    title: {
        color: '#0000ff',
        fontSize: '23px',
        fontWeight: 'bold',
        margin: '0 0 15px 0'
    },
    errorText: {
        color: 'red',
        fontSize: '14px',
        margin: '0 0 10px 0'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    fieldRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    label: {
        width: '105px',
        height: '30px',
        backgroundColor: '#A9C4EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '5px',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    input: {
        width: '280px',
        height: '30px',
        backgroundColor: '#FFF2CC',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        padding: '0 8px'
    },
    buttonRow: {
        marginTop: '15px'
    },
    submitButton: {
        width: '241px',
        height: '30px',
        backgroundColor: '#f8cecc',
        borderColor: '#b85450',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    footerRow: {
        marginTop: '25px'
    },
    logoutLink: {
        color: '#0000ff',
        fontSize: '18px',
        cursor: 'pointer',
        textDecoration: 'underline'
    }
};