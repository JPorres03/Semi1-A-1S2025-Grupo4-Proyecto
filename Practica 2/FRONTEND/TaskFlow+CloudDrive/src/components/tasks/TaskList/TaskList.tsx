import { useState } from 'react';

function TaskList() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  return (
    <div className="taskListContainer">
      <button className='btn mx-3 fs-1'>Add task</button>
      <div>
        <input
          className="form-control text dark mb-3"
          placeholder='Task name'
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control text-dark"
          placeholder="Write your task here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3} // Número de líneas visibles inicialmente
        />
      </div>
    </div>
  );
}

export default TaskList;