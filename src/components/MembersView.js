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

// 個々のタスクアイテムを描画するコンポーネント
function SortableTaskItem({ task, onToggleComplete, memberName, onSelectIssue }) {
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`member-task-item ${task.completed ? 'completed-task' : ''}`}
    >
      <input
        id={`chk-${memberName}-${task.id}`}
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(memberName, task.id)}
      />
      <span className="member-task-content" onClick={() => onSelectIssue && onSelectIssue({ issue: task, source: 'members', group: memberName })}>
        {task.content}
      </span>
    </div>
  );
}

// メンバー個人のタスクを管理するメインコンポーネント
function MembersView({ tasks: propTasks = {}, onAddTask, onToggleComplete, onMoveTask, onSelectIssue, onDeleteTask }) {
  const initialMembers = ['ベーコン', '丸', '出山', 'トミー', '正田', 'なりなり', 'アサーダ', 'ジャガー', 'だいふく'];
  // Merge propTasks over sensible defaults so each member has an array (avoids undefined and keeps keys stable)
  const defaultMap = initialMembers.reduce((acc, member) => {
    acc[member] = [];
    return acc;
  }, {});
  const tasks = { ...defaultMap, ...propTasks };
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedMember, setSelectedMember] = useState(initialMembers[0]);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText) return;
    const newTask = { id: `${selectedMember}-${Date.now()}`, content: newTaskText, completed: false, member: selectedMember };
    if (onAddTask) onAddTask(selectedMember, newTask);
    setNewTaskText('');
  };

  const handleToggleComplete = (memberName, taskId) => {
    if (onToggleComplete) onToggleComplete(memberName, taskId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      if (onMoveTask) onMoveTask(active.id, over.id);
    }
  };

  // members view is controlled by props (onAddTask/onToggleComplete/onMoveTask)

  return (
    <div className="view-container">
      <h2>メンバー別タスク</h2>
      <div className="member-task-adder">
        <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
          {initialMembers.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
        <form onSubmit={handleAddTask} style={{ display: 'inline-flex', marginLeft: '10px' }}>
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="タスクを追加"
          />
          <button type="submit">追加</button>
        </form>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="members-task-container">
          {initialMembers.map(member => {
            const memberTasks = Array.isArray(tasks[member]) ? tasks[member] : [];
            const incompleteTasks = memberTasks.filter(t => !t.completed);
            const completedTasks = memberTasks.filter(t => t.completed);
            return (
              <MemberColumn key={member} member={member} memberTasks={memberTasks} incompleteTasks={incompleteTasks} completedTasks={completedTasks} onToggleComplete={handleToggleComplete} onSelectIssue={onSelectIssue} onDeleteTask={onDeleteTask} />
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}

function MemberColumn({ member, memberTasks, incompleteTasks, completedTasks, onToggleComplete, onSelectIssue, onDeleteTask }) {
  const { setNodeRef } = useDroppable({ id: `col-${member}` });

  return (
    <div ref={setNodeRef} id={`col-${member}`} className="member-column">
      <h3>{member}</h3>
      <SortableContext
        items={incompleteTasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {incompleteTasks.map(task => (
          <div key={task.id}><SortableTaskItem task={task} onToggleComplete={onToggleComplete} memberName={member} onSelectIssue={onSelectIssue} />{onDeleteTask && <button className="member-task-delete" onClick={() => onDeleteTask(member, task.id)}>✕</button>}</div>
        ))}
      </SortableContext>
      {/* 完了タスクは下に表示 */}
      {completedTasks.map(task => (
        <div key={task.id} className="member-task-item completed-task">
          <input id={`chk-${member}-${task.id}`} type="checkbox" checked={task.completed} onChange={() => onToggleComplete(member, task.id)} />
          <span className="member-task-content" onClick={() => onSelectIssue && onSelectIssue({ issue: task, source: 'members', group: member })}>{task.content}</span>
          {onDeleteTask && <button className="member-task-delete" onClick={() => onDeleteTask(member, task.id)}>✕</button>}
        </div>
      ))}
      {memberTasks.length === 0 && <div className="member-empty">(空)</div>}
    </div>
  );
}

export default MembersView;