import { useState, useEffect } from 'react';
import tasks from "../../../MOCK_DATA_TASKS.json";
import Swal from 'sweetalert2';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

interface Task {
  id: number;
  title: string;
  description: string;
  creation_date: string;
  completed: boolean;
}

function Tasks() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/task');
        const data = await response.json();

        if (data) {
          setTaskList(data);
        } else {
          setTaskList(tasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTaskList(tasks);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: text,
          completed: false
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTaskList([...taskList, newTask]);
        setTitle('');
        setText('');
        Swal.fire('Success!', 'Task added successfully', 'success');
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      Swal.fire('Error!', 'Failed to add task', 'error');
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/task/${taskId}/complete`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setTaskList(taskList.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
      } else {
        throw new Error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      Swal.fire('Error!', 'Failed to update task status', 'error');
    }
  };

  const handleUpdateTask = async (taskId: number, currentTitle: string, currentDescription: string) => {
    const { value: formValues } = await Swal.fire({
      title: 'Update Task',
      html: `
        <div class="swal2-form-container">
          <input 
            id="swal-input1" 
            class="swal2-input full-width-input" 
            placeholder="Title" 
            value="${currentTitle.replace(/"/g, '&quot;')}"
          >
          <textarea 
            id="swal-input2" 
            class="swal2-textarea full-width-textarea" 
            placeholder="Description"
            rows="4"
          >${currentDescription.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          title: (document.getElementById('swal-input1') as HTMLInputElement)?.value,
          description: (document.getElementById('swal-input2') as HTMLTextAreaElement)?.value
        };
      },
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      customClass: {
        container: 'custom-swal-container',
        popup: 'custom-swal-popup',
        htmlContainer: 'custom-swal-html-container'
      },
      width: '600px',
      padding: '2rem',
      backdrop: true,
      showClass: {
        popup: 'swal2-show'
      },
      hideClass: {
        popup: 'swal2-hide'
      }
    });

    if (formValues) {
      try {
        const response = await fetch(`http://localhost:3001/api/task/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formValues.title,
            description: formValues.description
          }),
        });

        if (response.ok) {
          setTaskList(taskList.map(task =>
            task.id === taskId ? {
              ...task,
              title: formValues.title,
              description: formValues.description
            } : task
          ));
          Swal.fire({
            title: 'Success!',
            text: 'Task updated successfully',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error('Failed to update task');
        }
      } catch (error) {
        console.error('Error updating task:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update task',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3001/api/task/${taskId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setTaskList(taskList.filter(task => task.id !== taskId));
          Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
        } else {
          throw new Error('Failed to delete task');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        Swal.fire('Error!', 'Failed to delete task', 'error');
      }
    }
  };

  return (
    <div className="taskListContainer">
      <div className='newTask'>
        <button className='btn mx-3 fs-1' onClick={handleAddTask}>Add task</button>
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
            rows={3}
          />
        </div>
      </div>

      <div className='listContainer mt-2'>
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <Accordion
            activeKey={selectedTaskId?.toString()}
            onSelect={(e) => setSelectedTaskId(e ? Number(e) : null)}
            alwaysOpen={false}
          >
            <div>
              {taskList.map((task, index) => (
                <Accordion.Item
                  eventKey={index.toString()}
                  key={task.id}
                  className='mb-3'
                >
                  <Accordion.Header>
                    <div className="d-flex align-items-center w-100">
                      <Form.Check
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="me-3"
                      />
                      <div className="d-flex flex-column flex-grow-1">
                        <span className='fs-4'>{task.title}</span>
                        <small>
                          Created: {new Date(task.creation_date).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div>
                      {task.description}
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <Button
                        className='btn btn-warning w-25'
                        onClick={() => handleUpdateTask(task.id, task.title, task.description)}
                      >
                        Update
                      </Button>
                      <Button
                        className='btn btn-danger w-25'
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </div>
          </Accordion>
        )}
      </div>
    </div>
  );
}

export default Tasks;