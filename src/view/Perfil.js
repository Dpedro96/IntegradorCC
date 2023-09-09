import React, { useState, useEffect } from "react";
import { Button, Image, ProgressBar } from "react-bootstrap";
import { auth, storage } from "../Services/FirebaseAuth";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "@firebase/storage";
import avatar from "../Img/avatar.png";
import "../CSS/Perfil.css";

function Perfil() {
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(100);
  const [editingImage, setEditingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Adicione esta linha

  const handleFileSelect = (event) => {
    event.preventDefault();
    const file = event.target?.files[0];
    if (!file) {
      return;
    }
    setSelectedFile(file);
  };

const handleSave = () => {
    if (!selectedFile) {
      alert("Por favor, selecione um arquivo primeiro.");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    const profileImageName = `${user.uid}.jpg`;
    const storageRef = ref(storage, `perfil/${user.uid}/${profileImageName}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round( (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setUrl(downloadUrl);
          localStorage.setItem("profileImageUrl", downloadUrl);
        });
      }
    );

    setEditingImage(false);
  };

  const handleDelete = () => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    const profileImageName = `${user.uid}.jpg`;
    const storageRef = ref(storage, `perfil/${user.uid}/${profileImageName}`);


    deleteObject(storageRef)
      .then(() => {
        localStorage.removeItem("profileImageUrl");
        setUrl(avatar);
      })
      .catch((error) => {
        alert(error);
      });
      setEditingImage(false);
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setUrl(avatar);
      return;
    }

    const profileImageName = `${user.uid}.jpg`;
    const storageRef = ref(storage, `perfil/${user.uid}/${profileImageName}`);
    
    getDownloadURL(storageRef).then((downloadUrl) => {
      setUrl(downloadUrl);
      localStorage.setItem("profileImageUrl", downloadUrl);
    }).catch(() => {
      setUrl(avatar);
    });
  }, []);

  return (
    <div className="perfil-container">
      <Image src={url} roundedCircle width={150} height={150} />
      <Button variant="primary" onClick={() => setEditingImage(!editingImage)}>
        {editingImage ? "Cancelar" : "Editar Foto"}
      </Button>
      {editingImage && (
        <div className="editar-imagem">
          <input type="file" accept="image/*" onChange={handleFileSelect} />
          <Button variant="success" onClick={handleSave}>
            Salvar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Excluir
          </Button>
        </div>
      )}
      {progress!=100   && (<p>Carregando...</p>)}
      
    </div>
  );
}

export default Perfil;
