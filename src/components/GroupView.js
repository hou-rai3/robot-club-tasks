import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableTaskItem({ task, onToggleComplete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`board-task-item ${task.completed ? 'completed-task' : ''}`}>
      <div className="task-content">
        <h3>{task.what}</h3>
        <p><strong>担当:</strong> {task.who}</p>
        <p><strong>期限:</strong> {task.when}</p>
      </div>
      <div className={`drag-handle ${task.completed ? 'disabled' : ''}`} {...(task.completed ? {} : attributes)} {...(task.completed ? {} : listeners)}>≡</div>
      {!task.completed && (
        <button onClick={(e) => { e.stopPropagation(); onToggleComplete(task.member, task.id); }} className="complete-btn">完了</button>
      )}
    </div>
  );
}

function GroupView({ tasks = {}, onAddTask, onToggleComplete, onMoveTask, onSelectIssue, onDeleteTask }) {
  const groups = ['機械班', '制御班', '回路班'];
  const sensors = useSensors(useSensor(PointerSensor));
  const [currentOverId, setCurrentOverId] = useState(null);

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskWho, setNewTaskWho] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [viewMode, setViewMode] = useState('active'); // 'active' | 'completed'

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText) return;
    const newTask = { id: `${selectedGroup}-${Date.now()}`, what: newTaskText, who: newTaskWho || '', when: '', completed: false, member: selectedGroup };
    if (onAddTask) onAddTask(selectedGroup, newTask);
    setNewTaskText('');
    setNewTaskWho('');
  };

  const handleToggleComplete = (groupName, taskId) => {
    if (onToggleComplete) onToggleComplete(groupName, taskId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active) return;
    let resolvedOverId = null;
    if (over && over.id) resolvedOverId = over.id;
    else if (over && over.data && over.data.current && over.data.current.sortable) resolvedOverId = over.data.current.sortable.id;
    else if (currentOverId) resolvedOverId = currentOverId;

    if (resolvedOverId && active.id !== resolvedOverId) {
      if (onMoveTask) onMoveTask(active.id, resolvedOverId);
    }
    setCurrentOverId(null);
  };

  const handleDragOver = (event) => { setCurrentOverId(event.over?.id || null); };

  return (
    <div className="view-container">
      <h2>班別の反省</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setViewMode('active')} className={viewMode === 'active' ? 'active' : ''}>未完了</button>
        <button onClick={() => setViewMode('completed')} className={viewMode === 'completed' ? 'active' : ''} style={{ marginLeft: 8 }}>完了（再開）</button>
      </div>
      <div className="member-task-adder">
        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          {groups.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <form onSubmit={handleAddTask} style={{ display: 'inline-flex', marginLeft: '10px', gap: '8px', alignItems: 'center' }}>
          <input value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} placeholder="課題を追加" />
          <input value={newTaskWho} onChange={(e) => setNewTaskWho(e.target.value)} placeholder="担当を入力" style={{ width: 140 }} />
          <button type="submit" className="add-btn">追加</button>
        </form>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
        <div className="members-task-container">
          {groups.map(group => {
            const groupTasks = Array.isArray(tasks[group]) ? tasks[group] : [];
            const incomplete = groupTasks.filter(t => !t.completed);
            const completed = groupTasks.filter(t => t.completed);
            return (
              <GroupColumn key={group} group={group} tasks={groupTasks} incomplete={incomplete} completed={completed} viewMode={viewMode} onToggleComplete={handleToggleComplete} onSelectIssue={onSelectIssue} onDeleteTask={onDeleteTask} />
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}

function GroupColumn({ group, tasks = [], incomplete = [], completed = [], viewMode = 'active', onToggleComplete, onSelectIssue, onDeleteTask }) {
  const { setNodeRef } = useDroppable({ id: `col-${group}` });

  return (
    <div ref={setNodeRef} id={`col-${group}`} className="member-column">
      <h3>{group}</h3>
      {viewMode === 'active' && (
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
              <div key={task.id} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1 }} onClick={() => { if (!onSelectIssue) return; onSelectIssue({ issue: task, source: 'group', group }); }}>
                  <SortableTaskItem task={task} onToggleComplete={onToggleComplete} />
                </div>
                {onDeleteTask && <button className="member-task-delete" onClick={(e) => { e.stopPropagation(); onDeleteTask(group, task.id); }}>削除</button>}
              </div>
            ))}
        </SortableContext>
      )}

      {viewMode === 'completed' && (
        <div>
          {completed.map(task => (
            <div key={task.id} className="member-task-item completed-task" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={true} onChange={() => onToggleComplete(group, task.id)} />
                <span>{task.what}</span>
              </div>
              <div>
                <button onClick={() => onToggleComplete(group, task.id)} className="add-btn">再開</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupView;
