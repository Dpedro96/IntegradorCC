import React, { useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import avatar  from '../Img/avatar.png'
import "../CSS/Perfil.css";
function UserImage({ user }) {
  const [imageAvatar, setImageAvatar] = useState(null);
  const { user, storageUser, setUser, logout } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)

  function handleFile(e){
    if(e.target.files[0]){
      const image = e.target.files[0];

      if(image.type === 'image/jpeg' || image.type === 'image/png'){
        setImageAvatar(image)
        setAvatarUrl(URL.createObjectURL(image))
      }else{
        alert("Envie uma imagem do tipo PNG ou JPEG")
        setImageAvatar(null);
        return;
      }


    }
  }

 
  async function handleUpload(){
    const currentUid = user.uid;

    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)

    const uploadTask = uploadBytes(uploadRef, imageAvatar)
    .then((snapshot) =>{
      
      getDownloadURL(snapshot.ref).then( async (downloadURL) => {
        let urlFoto = downloadURL;

        const docRef = doc(db, "users", user.uid)
        await updateDoc(docRef, {
          avatarUrl: urlFoto,
          nome: nome,
        })
        .then(() => {
          let data = {
            ...user,
            nome: nome,
            avatarUrl: urlFoto,
          }
   
          setUser(data);
          storageUser(data);
          toast.success("Atualizado com sucesso!")
          
        })

      })

    })

  }
  
  async function handleSubmit(e){
    e.preventDefault();

   if(imageAvatar === null && nome !== ''){
     // Atualizar apenas o nome do user
     const docRef = doc(db, "users", user.uid) 
     await updateDoc(docRef, {
       nome: nome,
     })
     .then(() => {
       let data = {
         ...user,
         nome: nome,
       }

       setUser(data);
       storageUser(data);
       toast.success("Atualizado com sucesso!")

     })

   }else if(nome !== '' && imageAvatar !== null){
     // Atualizar tanto nome quanto a foto
     handleUpload()
   }

  }

  return (
    <div>
      <Header/>

      <div className="content">
        <Title name="Minha conta">
          <FiSettings size={25} />
        </Title>

       <div className="container">

        <form className="form-profile" onSubmit={handleSubmit}>
          <label className="label-avatar">
            <span>
              <FiUpload color="#FFF" size={25} />
            </span>

            <input type="file" accept="image/*" onChange={handleFile}  /> <br/>
            {avatarUrl === null ? (
              <img src={avatar} alt="Foto de perfil" width={250} height={250} />
            ) : (
              <img src={avatarUrl} alt="Foto de perfil" width={250} height={250} />
            )}

          </label>
          <button type="submit">Salvar</button>
        </form>

       </div>

       <div className="container">
         <button className="logout-btn" onClick={ () => logout() }>Sair</button>
       </div>

      </div>

    </div>
  );
}

export default UserImage;