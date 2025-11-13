import React, { useState } from 'react';

function IssueDetail({ issue, onClose, onSave }) {
  const [local, setLocal] = useState({ ...issue });
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => {
    const value = field === 'severity' ? Number(e.target.value) : e.target.value;
    setLocal(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(local);
    }
    // show quick feedback
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const handleMarkComplete = () => {
    const updated = { ...local, completed: true, status: '完了' };
    if (onSave) onSave(updated);
  };

  return (
    <div className="view-container">
      <h2>反省詳細</h2>
      <div className="issue-detail-card">
        <h3>{local.what}</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
          <div>
            <label>担当</label>
            <div>{local.who}</div>
          </div>
          <div>
            <label>期限</label>
            <input type="date" value={local.when} onChange={handleChange('when')} />
          </div>
          <div>
            <label>重要度</label>
            <select value={local.severity || 2} onChange={handleChange('severity')}>
              <option value={5}>5 - 非常に重要</option>
              <option value={4}>4 - とても重要</option>
              <option value={3}>3 - 中程度</option>
              <option value={2}>2 - 軽度</option>
              <option value={1}>1 - 低</option>
            </select>
          </div>
        </div>

        <div>
          <label>詳細メモ</label>
          <textarea value={local.description || ''} onChange={handleChange('description')} rows={6} style={{ width: '100%' }} />
        </div>

        <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
          <button onClick={handleSave} className="add-btn">保存</button>
          <button onClick={handleMarkComplete} className="complete-btn">完了にする</button>
          <button onClick={onClose} className="remove-btn">閉じる</button>
        </div>
        {saved && <div style={{ marginTop: 8, color: '#28a745' }}>保存しました</div>}
      </div>
    </div>
  );
}

export default IssueDetail;
