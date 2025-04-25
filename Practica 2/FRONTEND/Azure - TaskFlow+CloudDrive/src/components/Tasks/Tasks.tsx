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
  createdAt: string;
  status: boolean;
}

function Tasks() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [push, setPush] = useState(false); // Estado para forzar re-render
  const userId = sessionStorage.getItem('userId');

  // GET tasks from the server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://4.174.199.137:80/api/task/${userId}`);
        
        if (!response.ok) throw new Error('Failed to fetch tasks');
  
        const data = await response.json();
        
        // Filtra tareas inválidas antes de guardarlas en el estado
        const validTasks = data.tasks?.filter((task: { id: undefined; title: undefined; }) => 
          task && 
          task.id !== undefined && 
          task.title !== undefined
        ) || [];
        
        setTaskList(validTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTasks();
  }, [userId]);

  // POST new task to the server - Corregido para evitar pantalla blanca
  const handleAddTask = async (event?: React.FormEvent) => {
    event?.preventDefault(); // Previene la recarga si está dentro de un form

    if (!title.trim()) {
      await Swal.fire({
        title: 'Warning!',
        text: 'Task title cannot be empty',
        icon: 'warning',
        backdrop: 'rgba(0,0,0,0.4)',
        background: '#f8f9fa'
      });
      return;
    }

    try {
      const response = await fetch(`http://4.174.199.137:80/api/task/${userId}/create`, {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add task');
      }

      const newTask = await response.json();

      // Actualización optimista del estado
      setTaskList(prev => [...prev, newTask]);
      setTitle('');
      setText('');

      await Swal.fire({
        title: 'Success!',
        text: 'Task added successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        backdrop: 'rgba(0,0,0,0.4)',
        background: '#f8f9fa',
        didClose: () => {
          // Fuerza un ligero re-render al cerrar el modal
          setTaskList(current => [...current]);
          setPush(!push); // Cambia el estado para forzar re-render
        }
      });

    } catch (error) {
      console.error('Error adding task:', error);
      await Swal.fire({
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Failed to add task',
        icon: 'error',
        backdrop: 'rgba(0,0,0,0.4)',
        background: '#f8f9fa'
      });
    }
  };

  // PATCH update task status - Mejorado para actualización en tiempo real
  const handleToggleComplete = async (taskId: number) => {
    try {
      const taskToUpdate = taskList.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      // Actualización optimista
      setTaskList(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: !task.status } : task
        )
      );

      const response = await fetch(`http://4.174.199.137:80/api/task/complete/${taskId}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        // Revertir si falla
        setTaskList(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status: taskToUpdate.status } : task
          )
        );
        throw new Error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to update task status',
        icon: 'error',
        background: '#fff',
        backdrop: 'rgba(0,0,0,0.5)'
      });
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
      padding: '2rem',
      background: '#fff',
      backdrop: 'rgba(0,0,0,0.5)'
    });

    if (formValues) {
      try {
        // Actualización optimista
        setTaskList(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? {
              ...task,
              title: formValues.title,
              description: formValues.description
            } : task
          )
        );

        const response = await fetch(`http://4.174.199.137:80/api/task/update/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formValues.title,
            description: formValues.description
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update task');
        }

        await Swal.fire({
          title: 'Success!',
          text: 'Task updated successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#fff',
          backdrop: 'rgba(0,0,0,0.5)'
        });
      } catch (error) {
        console.error('Error updating task:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to update task',
          icon: 'error',
          background: '#fff',
          backdrop: 'rgba(0,0,0,0.5)'
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
      confirmButtonText: 'Yes, delete it!',
      background: '#fff',
      backdrop: 'rgba(0,0,0,0.5)'
    });

    if (result.isConfirmed) {
      try {
        // Actualización optimista
        setTaskList(prevTasks => prevTasks.filter(task => task.id !== taskId));

        const response = await fetch(`http://4.174.199.137:80/api/task/delete/${taskId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          // Revertir si falla
          setTaskList(taskList);
          throw new Error('Failed to delete task');
        }

        await Swal.fire({
          title: 'Deleted!',
          text: 'Your task has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#fff',
          backdrop: 'rgba(0,0,0,0.5)'
        });
      } catch (error) {
        console.error('Error deleting task:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to delete task',
          icon: 'error',
          background: '#fff',
          backdrop: 'rgba(0,0,0,0.5)'
        });
      }
    }
  };

  return (
    <div className="taskListContainer">
      <form className='newTask' onSubmit={handleAddTask}>
        <button
          className='btn mx-3 fs-1'
          type='submit'
          onClick={(e) => {
            if (!title.trim()) {
              e.preventDefault();
              handleAddTask();
            }
          }}
        >
          Add Task
        </button>
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
      </form>

      <div className='listContainer'>
        <h2 className='mb-3 text-light'>Your Tasks</h2>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary">
              <span className="visually-hidden text-light">Loading...</span>
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
            {taskList.filter(task => task?.id).map((task) => (
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
                        Created: {new Date(task.created_at || task.createdAt ).toLocaleDateString()}
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