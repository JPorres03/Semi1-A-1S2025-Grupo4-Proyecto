import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/main/Home/Home";
import Login from "./components/auth/Login/Login";
import Register from "./components/auth/Register/Register";
import TaskList from "./components/tasks/TaskList/TaskList";
import CreateTask from "./components/tasks/CreateTask/CreateTask";
import EditTask from "./components/tasks/EditTask/EditTask";
import TaskDetails from "./components/tasks/TaskList/TaskDetails/TaskDetails";
import FileList from "./components/files/FileList/FileList";
import FileDetails from "./components/files/FileList/FileDetails/FileDetails";
import UploadFile from "./components/files/UploadFile/UploadFile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/create_task" element={<CreateTask />} />
        <Route path="/edit_task" element={<EditTask />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/files" element={<FileList />} />
        <Route path="/files/:id" element={<FileDetails />} />
        <Route path="/upload_file" element={<UploadFile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
