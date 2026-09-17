import { useState, useCallback } from 'react';
import './ResourceCreatePage.css'; // 専用CSSのインポート

const API_RESOURCE_URL = 'http://localhost:8080/api/resources';

export function ResourceCreatePage({ credentials, initialResource, onCancel, onSuccess }) {
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        id: initialResource?.id ?? initialResource?.resourceId ?? '',
        name: initialResource?.name ?? '',
        department: initialResource?.department ?? '',
        email: initialResource?.email ?? '',
    });

    const getAuthHeaders = useCallback((customHeaders = {}) => {
        const headers = { ...customHeaders };
        if (credentials) {
            headers['Authorization'] = `Basic ${credentials}`;
        }
        return headers;
    }, [credentials]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const isEdit = Boolean(formData.id);
        const method = isEdit ? 'PUT' : 'POST';
        const url = isEdit ? `${API_RESOURCE_URL}/${formData.id}` : API_RESOURCE_URL;

        const payload = {
            id: isEdit ? Number(formData.id) : undefined,
            name: formData.name,
            department: formData.department,
            email: formData.email,
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

    return (
        <div className="resource-create-container">
            <h1>{formData.id ? `リソース編集 (ID: ${formData.id})` : '新規リソース登録'}</h1>

            {error && (
                <div className="resource-create-error">
                    {error}
                </div>
            )}

            <form onSubmit={(e) => void handleSubmit(e)} className="resource-create-form">
                <div className="resource-create-group">
                    <label className="resource-create-label">氏名 *:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="resource-create-input"
                    />
                </div>

                <div className="resource-create-group">
                    <label className="resource-create-label">所属部署:</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="resource-create-input"
                    />
                </div>

                <div className="resource-create-group">
                    <label className="resource-create-label">メールアドレス:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="resource-create-input"
                    />
                </div>

                <div className="resource-create-actions">
                    <button type="submit" className="resource-btn-submit">
                        {formData.id ? '更新する' : '登録する'}
                    </button>
                    <button type="button" onClick={onCancel} className="resource-btn-cancel">
                        一覧へ戻る
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ResourceCreatePage;