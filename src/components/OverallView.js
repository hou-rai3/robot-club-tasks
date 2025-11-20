import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 個々のタスクアイテムを描画するためのコンポーネント
function SortableTaskItem({ task, onToggleComplete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // 完了済みのタスクにはドラッグハンドルを表示しない
    cursor: task.completed ? 'default' : 'grab',
  };

  // 強調表示: severity に応じて左のライン色とフォントサイズを変える
  const severityColors = {
    5: '#d9534f', // red
    4: '#ff7f50', // coral
    3: '#ffc107', // amber
    2: '#17a2b8', // cyan
    1: '#6c757d', // gray
  };
  const sev = task.severity || 2;
  const emphasisStyle = {
    borderLeft: `6px solid ${severityColors[sev] || '#6c757d'}`,
    fontSize: `${1 + (sev - 2) * 0.08}rem`,
    fontWeight: sev >= 4 ? '700' : '600',
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...emphasisStyle }}
      className={`board-task-item ${task.completed ? 'completed-task' : ''}`}
    >
      {/* メイン表示部分（クリックで詳細） */}
      <div className="task-content">
        <h3>{task.what}</h3>
        <p><strong>担当:</strong> {task.who}</p>
        <p><strong>期限:</strong> {task.when}</p>
        <span className="task-status">{task.status}</span>
      </div>

      {/* ドラッグハンドル。完了タスクでは表示を薄くする */}
      <div className={`drag-handle ${task.completed ? 'disabled' : ''}`} {...(task.completed ? {} : attributes)} {...(task.completed ? {} : listeners)}>
        ≡
      </div>
      {!task.completed && (
        <button onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }} className="complete-btn">完了</button>
      )}
    </div>
  );
}


// 全体課題コンポーネント本体
function OverallView({ tasks = [], onAddTask, onToggleComplete, onReorder, onSelectIssue }) {
  const [what, setWhat] = useState('');
  const [who, setWho] = useState('');
  const [when, setWhen] = useState('');
  const sensors = useSensors(useSensor(PointerSensor));
  const [isDragging, setIsDragging] = useState(false);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!what || !who || !when) return;
    const newTask = {
      id: Date.now(),
      what,
      who,
      when,
      status: '未着手',
      completed: false
    };
    if (onAddTask) onAddTask(newTask);
    setWhat('');
    setWho('');
    setWhen('');
  };

  const handleToggleComplete = (taskId) => {
    if (onToggleComplete) onToggleComplete(taskId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setIsDragging(false);
    if (over && active.id !== over.id) {
      if (onReorder) onReorder(active.id, over.id);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="view-container">
      <h2>本ロボAチームの課題点一覧</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="task-board">
          <SortableContext
            items={incompleteTasks.map(t => t.id)}
            strategy={rectSortingStrategy}
          >
            {/* 未完了タスクのみドラッグ可能 */}
            {incompleteTasks.map(task => (
              <div key={task.id} style={{ cursor: 'pointer' }} onClick={() => {
                if (isDragging) return; // 無意のドラッグと競合しないように
                if (!onSelectIssue) return;
                onSelectIssue({ issue: task, source: 'overall' });
              }}>
                <SortableTaskItem task={task} onToggleComplete={handleToggleComplete} />
              </div>
            ))}
          </SortableContext>
          
          {/* 完了タスクはドラッグ不可。クリックで詳細へ。再開ボタンで戻せる */}
          {completedTasks.map(task => (
            <div key={task.id} className="board-task-item completed-task" style={{ cursor: 'pointer' }} onClick={() => {
                if (isDragging) return;
                if (!onSelectIssue) return;
                onSelectIssue({ issue: task, source: 'overall' });
            }}>
                <div className="task-content">
                  <h3>{task.what}</h3>
                  <p><strong>担当:</strong> {task.who}</p>
                  <p><strong>期限:</strong> {task.when}</p>
                  <span className="task-status">{task.status}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleToggleComplete(task.id); }} className="add-btn">再開</button>
            </div>
          ))}
        </div>
      </DndContext>

      <form onSubmit={handleAddTask} className="task-form overall-form">
        <h3>新しい全体課題を追加</h3>
        <input type="text" value={what} onChange={(e) => setWhat(e.target.value)} placeholder="What（課題）" required />
        <input type="text" value={who} onChange={(e) => setWho(e.target.value)} placeholder="Who（担当）" required />
        <input type="date" value={when} onChange={(e) => setWhen(e.target.value)} required />
        <button type="submit">追加</button>
      </form>
    </div>
  );
}

export default OverallView;