import React, { useState, useEffect } from 'react';

// ロボットの状態を表示・編集するコンポーネント
function RobotView() {
  const [robotStatus, setRobotStatus] = useState({
    name: '3号機 - "メガヒンジ"',
    progress: '基本設計完了、試作フェーズ',
    mechanisms: [
      { id: 1, name: '新型アーム機構', tested: true, status: '評価完了' },
      { id: 2, name: '全方位移動足回り', tested: true, status: '微調整中' },
      { id: 3, name: '自動照準センサー', tested: false, status: '実験待ち' },
    ]
  });

  // load/save to localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('robotStatus');
      if (raw) setRobotStatus(JSON.parse(raw));
    } catch (e) {
      console.warn('robotStatus load failed', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('robotStatus', JSON.stringify(robotStatus));
    } catch (e) {
      console.warn('robotStatus save failed', e);
    }
  }, [robotStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRobotStatus(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMechanismChange = (id, field, value) => {
    setRobotStatus(prev => ({
      ...prev,
      mechanisms: prev.mechanisms.map(mech =>
        mech.id === id ? { ...mech, [field]: value } : mech
      )
    }));
  };

  const addMechanism = () => {
    const newMechanism = {
      id: Date.now(),
      name: '新しい機構',
      tested: false,
      status: '未着手'
    };
    setRobotStatus(prev => ({
        ...prev,
        mechanisms: [...prev.mechanisms, newMechanism]
    }));
  };

  const removeMechanism = (id) => {
    setRobotStatus(prev => ({
        ...prev,
        mechanisms: prev.mechanisms.filter(mech => mech.id !== id)
    }));
  };


  return (
    <div className="view-container">
      <h2>ロボットの状態（編集可能）</h2>
      <div className="robot-status-card editable">
        <div className="form-group">
          <label>機体名:</label>
          <input type="text" name="name" value={robotStatus.name} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>進捗:</label>
          <input type="text" name="progress" value={robotStatus.progress} onChange={handleInputChange} />
        </div>
        
        <h4>搭載機構リスト</h4>
        {robotStatus.mechanisms.map(mech => (
          <div key={mech.id} className="mechanism-editor">
            <input 
              type="text" 
              className="mech-name"
              value={mech.name} 
              onChange={(e) => handleMechanismChange(mech.id, 'name', e.target.value)}
            />
            <input 
              type="text" 
              className="mech-status-input"
              value={mech.status}
              onChange={(e) => handleMechanismChange(mech.id, 'status', e.target.value)}
            />
            <span className={`status-badge status-${(mech.status || '').replace(/\s+/g,'-')}`}>{mech.status}</span>
            <label>
              <input 
                type="checkbox" 
                checked={mech.tested}
                onChange={(e) => handleMechanismChange(mech.id, 'tested', e.target.checked)}
              />
              実験済み
            </label>
            <button onClick={() => removeMechanism(mech.id)} className="remove-btn">削除</button>
          </div>
        ))}
        <button onClick={addMechanism} className="add-btn">機構を追加</button>
      </div>
    </div>
  );
}

export default RobotView;