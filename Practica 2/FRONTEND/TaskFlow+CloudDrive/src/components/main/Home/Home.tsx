import TaskList from "../../tasks/TaskList/TaskList";
import Navbar from "../Navbar/Navbar";

function Home() {
  return (
    <div className="homeContainer d-flex flex-column">
      <Navbar />
      <div className="mt-5 mx-3">
        <TaskList />
      </div>
    </div>
  );
}

export default Home;