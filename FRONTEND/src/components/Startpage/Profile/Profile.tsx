import img from '../../../assets/profile.png'
import { CiEdit } from "react-icons/ci"

function Profile() {
  return (
    <section className="profile-bg">
            <div className="profileContainer">
                <img src={img} alt="foto-profile" /><br />
                <div>
                    <h2>Nombres y apellidos <button><CiEdit /></button></h2>
                    <h3>Correo electronico <button><CiEdit /></button></h3> 
                    <h3>Libros adquiridos <button><CiEdit /></button></h3>  
                </div>
            </div>
        </section>
  );
}

export default Profile;