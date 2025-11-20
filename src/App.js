import React, { useState, lazy } from 'react';
import logoGif from './AqVpIU.gif';
import './App.css';
import OverallView from './components/OverallView';
import GroupView from './components/GroupView';
import MembersView from './components/MembersView';

// lazy load detail view
const IssueDetail = lazy(() => import('./components/IssueDetail'));

function App() {
  // activeTab: 'overall', 'robot', 'members', 'detail'
  const [activeTab, setActiveTab] = useState('overall');
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  const [selectedSource, setSelectedSource] = useState(null); // 'overall' | 'group' | 'members'
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [returnTab, setReturnTab] = useState('overall');

  // Centralized state for lists so tab switching doesn't lose changes
  const [overallTasks, setOverallTasks] = useState([]);
  const [groupTasks, setGroupTasks] = useState({});
  const [membersTasks, setMembersTasks] = useState({});

  // load initial data from localStorage once
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('overallTasks');
      if (raw) setOverallTasks(JSON.parse(raw));
    } catch (e) { console.warn('load overall failed', e); }
    try {
      const rawG = localStorage.getItem('groupTasks');
      if (rawG) setGroupTasks(JSON.parse(rawG));
    } catch (e) { console.warn('load group failed', e); }
    try {
      const rawM = localStorage.getItem('membersTasks');
      if (rawM) setMembersTasks(JSON.parse(rawM));
    } catch (e) { console.warn('load members failed', e); }
  }, []);

  // persist whenever central state changes
  React.useEffect(() => { try { localStorage.setItem('overallTasks', JSON.stringify(overallTasks)); } catch(e){} }, [overallTasks]);
  React.useEffect(() => { try { localStorage.setItem('groupTasks', JSON.stringify(groupTasks)); } catch(e){} }, [groupTasks]);
  React.useEffect(() => { try { localStorage.setItem('membersTasks', JSON.stringify(membersTasks)); } catch(e){} }, [membersTasks]);

  // helpers to mutate central state
  const appAddOverallTask = (task) => {
    setOverallTasks(prev => [...prev, task]);
  };
  const appToggleOverall = (id) => {
    setOverallTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  const appReorderOverall = (activeId, overId) => {
    setOverallTasks(prev => {
      const oldIndex = prev.findIndex(p => p.id === activeId);
      const newIndex = prev.findIndex(p => p.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(oldIndex, 1);
      copy.splice(newIndex, 0, moved);
      return copy;
    });
  };

  const appAddGroupTask = (groupName, task) => {
    setGroupTasks(prev => ({ ...prev, [groupName]: [...(prev[groupName] || []), task] }));
  };
  const appToggleGroup = (groupName, id) => {
    setGroupTasks(prev => ({ ...prev, [groupName]: prev[groupName].map(t => t.id === id ? { ...t, completed: !t.completed } : t) }));
  };
  const appMoveGroupTask = (activeId, overId) => {
    setGroupTasks(prev => {
      const groups = Object.keys(prev);
      let source = null, target = null;
      for (const g of groups) {
        if (prev[g].some(t => t.id === activeId)) source = g;
        if (prev[g].some(t => t.id === overId)) target = g;
      }
      if (!source || !target) return prev;
      const sourceList = [...prev[source]];
      const targetList = [...prev[target]];
      const movingIndex = sourceList.findIndex(t => t.id === activeId);
      const [moving] = sourceList.splice(movingIndex, 1);
      const insertIndex = targetList.findIndex(t => t.id === overId);
      const idx = insertIndex === -1 ? targetList.length : insertIndex;
      if (source === target) {
        targetList.splice(idx, 0, moving);
        return { ...prev, [source]: targetList };
      }
      targetList.splice(idx, 0, { ...moving, member: target });
      return { ...prev, [source]: sourceList, [target]: targetList };
    });
  };

  const appAddMemberTask = (member, task) => {
    setMembersTasks(prev => ({ ...prev, [member]: [...(prev[member] || []), task] }));
  };
  const appToggleMember = (member, id) => {
    setMembersTasks(prev => ({ ...prev, [member]: prev[member].map(t => t.id === id ? { ...t, completed: !t.completed } : t) }));
  };
  const appMoveMemberTask = (activeId, overId) => {
    setMembersTasks(prev => {
      const members = Object.keys(prev);
      let source = null, target = null;
      for (const m of members) {
        if (prev[m].some(t => t.id === activeId)) source = m;
        if (prev[m].some(t => t.id === overId)) target = m;
      }
      if (!source || !target) return prev;
      const sourceList = [...prev[source]];
      const targetList = [...prev[target]];
      const movingIndex = sourceList.findIndex(t => t.id === activeId);
      const [moving] = sourceList.splice(movingIndex, 1);
      const insertIndex = targetList.findIndex(t => t.id === overId);
      const idx = insertIndex === -1 ? targetList.length : insertIndex;
      if (source === target) {
        targetList.splice(idx, 0, moving);
        return { ...prev, [source]: targetList };
      }
      targetList.splice(idx, 0, moving);
      return { ...prev, [source]: sourceList, [target]: targetList };
    });
  };

  const handleSelectIssue = (payload) => {
    if (!payload) return;
    // payload: { issue, source, group }
    const issue = payload.issue || payload;
  setSelectedIssue(issue);
    setSelectedSource(payload.source || null);
    setSelectedGroup(payload.group || null);
    // decide which tab to return to after closing detail
    if (payload.source === 'group') setReturnTab('robot');
    else if (payload.source === 'members') setReturnTab('members');
    else setReturnTab('overall');
    setActiveTab('detail');
  };

  // centralized save handler: persist edits directly to localStorage so lists (which may be unmounted)
  // pick up changes when remounted.
  const appSaveIssue = (updated) => {
    // update central state based on source
    if (!selectedSource) {
      setSelectedIssue(updated);
      return;
    }

    if (selectedSource === 'overall') {
      setOverallTasks(prev => {
        let found = false;
        const next = prev.map(t => {
          if (t.id === updated.id) { found = true; return { ...t, ...updated }; }
          return t;
        });
        if (!found) next.push(updated);
        return next;
      });
    } else if (selectedSource === 'group') {
      setGroupTasks(prev => {
        const groupName = selectedGroup || updated.member || updated.group;
        const next = { ...prev };
        next[groupName] = next[groupName] ? next[groupName].map(t => t.id === updated.id ? { ...t, ...updated } : t) : [];
        if (!next[groupName].some(t => t.id === updated.id)) next[groupName].push({ ...updated, member: groupName });
        return next;
      });
    } else if (selectedSource === 'members') {
      setMembersTasks(prev => {
        const member = updated.member;
        const next = { ...prev };
        next[member] = next[member] ? next[member].map(t => t.id === updated.id ? { ...t, ...updated } : t) : [];
        if (!next[member].some(t => t.id === updated.id)) next[member].push(updated);
        return next;
      });
    }

    setSelectedIssue(updated);
    try {
      window.dispatchEvent(new CustomEvent('tasksUpdated', { detail: { source: selectedSource, updated } }));
    } catch (e) { console.warn('dispatch tasksUpdated failed', e); }
  };

  const handleCloseDetail = () => {
  setSelectedIssue(null);
  setSelectedSource(null);
  setSelectedGroup(null);
    setActiveTab(returnTab || 'overall');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overall':
        // pass central tasks and handlers to OverallView
        return (
          <OverallView
            tasks={overallTasks}
            onAddTask={appAddOverallTask}
            onToggleComplete={appToggleOverall}
            onReorder={appReorderOverall}
            onSelectIssue={handleSelectIssue}
          />
        );
      case 'robot':
        return (
          <GroupView
            tasks={groupTasks}
            onAddTask={appAddGroupTask}
            onToggleComplete={appToggleGroup}
            onMoveTask={appMoveGroupTask}
            onSelectIssue={handleSelectIssue}
          />
        );
      case 'members':
        return (
          <MembersView
            tasks={membersTasks}
            onAddTask={appAddMemberTask}
            onToggleComplete={appToggleMember}
            onMoveTask={appMoveMemberTask}
          />
        );
      case 'detail':
        return <div>{selectedIssue ? (
          // lazy-load detail component to keep props simple
          <React.Suspense fallback={<div>読み込み中...</div>}>
            <IssueDetail issue={selectedIssue} onClose={handleCloseDetail} onSave={appSaveIssue} />
          </React.Suspense>
        ) : <div>項目が選択されていません。</div>}</div>;
      default:
        return <OverallView onSelectIssue={handleSelectIssue} />;
    }
  };

  return (
    <div className="App">
      <header>
        <div className="title-row">
          <img src={logoGif} alt="logo" className="title-gif" />
          <h1>ろぼっと倶楽部 - 連中に反省を促すアプリ</h1>
        </div>
        <nav>
          <button onClick={() => setActiveTab('overall')} className={activeTab === 'overall' ? 'active' : ''}>反省一覧</button>
          <button onClick={() => setActiveTab('robot')} className={activeTab === 'robot' ? 'active' : ''}>班別</button>
          <button onClick={() => setActiveTab('members')} className={activeTab === 'members' ? 'active' : ''}>メンバー</button>
        </nav>
      </header>
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;