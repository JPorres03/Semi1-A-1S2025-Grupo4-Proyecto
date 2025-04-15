import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Files from "../../Files/Files";
import Tasks from "../../Tasks/Tasks";
import Navbar from "../Navbar/Navbar";

function Home() {
  const navigate = useNavigate();
  const [content, setContent] = useState<React.ReactNode>(<Tasks />);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    console.log('Checking userId:', userId);
    
    if (!userId) {
      console.log('No userId, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  const handleNavbarClick = (option: string) => {
    switch (option) {
      case "archivos":
        setContent(<Files />);
        break;
      case "tareas":
        setContent(<Tasks />);
        break;
      default:
        break;
    }
  };

  // Si no hay userId, no renderizar el contenido principal
  if (!sessionStorage.getItem('userId')) {
    return null; // O un loader mientras se redirige
  }

  return (
    <div className="homeContainer d-flex flex-column">
      <Navbar onNavbarClick={handleNavbarClick} />
      <div className="mt-4 mx-3">
        {content}
      </div>
    </div>
  );
}

export default Home;