import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "../CSS/Perfil.css";

function UserImage({ user, nome, setNome }) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const storage = getStorage();

  const handleUpload = () => {
    const currentUid = user.uid;

    const storageRef = ref(storage, `images/${currentUid}/${selectedImage.name}`);
    uploadBytes(storageRef, selectedImage)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          let urlFoto = downloadURL;
          // Atualizar o nome e a foto do perfil aqui, se necessário
          setNome("Novo Nome"); // Substitua por uma função para atualizar o nome
          setImageUrl(urlFoto);
        });
      })
      .catch((error) => {
        console.error(error);
      });
    setIsEditing(false);
  };

  const handleFileChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setImageUrl(URL.createObjectURL(event.target.files[0]));
  };

  const handleSaveClick = () => {
    // Adicione a lógica para salvar as alterações no nome e na foto do perfil, se necessário
    handleUpload();
  };

  return (
    <div className="user-image">
      <img src={imageUrl || user.photoURL} alt="user" />
      {isEditing && (
        <div className="user-image-upload">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}
      {!isEditing && (
        <button className="btnImg" onClick={handleSaveClick}>
          <FontAwesomeIcon icon={faEdit} />
        </button>
      )}
      <label>Nome</label>
      <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
    </div>
  );
}

export default UserImage;
