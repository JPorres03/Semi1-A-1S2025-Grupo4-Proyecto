import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: boolean;
}

function Tasks() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const userId = sessionStorage.getItem('userId');

  // GET tasks from the server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/task/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        // Verificar si la respuesta es un array y tiene elementos
        console.log('Fetched tasks:', data.tasks);

        if (data && data.tasks.length > 0) {
          setTaskList(data.tasks);
        } else {
          setTaskList([]); // Asegurarse que taskList esté vacío si no hay datos
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  // POST new task to the server
  const handleAddTask = async () => {
    if (!title.trim()) {
      Swal.fire('Warning!', 'Task title cannot be empty', 'warning');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/task/${userId}/create`, {
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
        Swal.fire({
          title: 'Success!',
          text: 'Task added successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      Swal.fire('Error!', 'Failed to add task', 'error');
    }
  };

  // PATCH update task status
  const handleToggleComplete = async (taskId: number) => {
    try {
      console.log("Task ID to toggle:", taskId);
      const response = await fetch(`http://localhost:3001/api/task/complete/${taskId}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        const updatedTask = await response.json();
        console.log('Updated task:', updatedTask.task.id);
        
        setTaskList(taskList.map(task =>
          task.id === updatedTask.task.id ? { ...task, completed: !task.status } : task
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
      width: '600px',
      padding: '2rem'
    });

    if (formValues) {
      try {
        const response = await fetch(`http://localhost:3001/api/task/update/${taskId}`, {
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
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          throw new Error('Failed to update task');
        }
      } catch (error) {
        console.error('Error updating task:', error);
        Swal.fire('Error!', 'Failed to update task', 'error');
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
        const response = await fetch(`http://localhost:3001/api/task/delete/${taskId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setTaskList(taskList.filter(task => task.id !== taskId));
          Swal.fire({
            title: 'Deleted!',
            text: 'Your task has been deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
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

      <div className='listContainer'>
        <h2 className='mb-3 text-light'>Your Tasks</h2>
        
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading tasks...</p>
          </div>
        ) : taskList.length === 0 ? (
          <Card className="text-center py-4">
            <Card.Body>
              <Card.Title>No tasks found</Card.Title>
              <Card.Text>
                You don't have any tasks yet. Create your first task above!
              </Card.Text>
              <Button variant="primary" onClick={() => {
                document.querySelector('.newTask')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Create Task
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Accordion
            activeKey={selectedTaskId?.toString()}
            onSelect={(e) => setSelectedTaskId(e ? Number(e) : null)}
            alwaysOpen={false}
          >
            {taskList.map((task) => (
              <Accordion.Item
                eventKey={task.id.toString()}
                key={task.id}
                className='mb-3'
              >
                <Accordion.Header>
                  <div className="d-flex align-items-center w-100">
                    <Form.Check
                      type="checkbox"
                      checked={task.status}
                      onChange={() => handleToggleComplete(task.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="me-3"
                    />
                    <div className="d-flex flex-column flex-grow-1">
                      <span className={`fs-4 ${task.status ? 'text-decoration-line-through text-muted' : ''}`}>
                        {task.title}
                      </span>
                      <small className="text-muted">
                        Created: {new Date(task.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className={`mb-3 ${task.status ? 'text-muted' : ''}`}>
                    {task.description || <em>No description provided</em>}
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="warning"
                      onClick={() => handleUpdateTask(task.id, task.title, task.description)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}

export default Tasks;