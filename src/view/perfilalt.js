import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faLock,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";

import { useHistory } from "react-router-dom";
import { BiX, BiCheck } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";

import { Button, Image, ProgressBar } from "react-bootstrap";
import { auth, storage } from "../Services/FirebaseAuth";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "@firebase/storage";
import avatar from "../Img/avatar.png";

// Local imports
import { app } from "../Services/FirebaseConfig";
import UserImage from "./UserImage";
import "../CSS/Perfil.css";

function Perfil() {
  const db = getFirestore(app);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [newNome, setNewNome] = useState("");
  const [newTelefone, setNewTelefone] = useState("");
  const [newSenha, setNewSenha] = useState("");

  const [isActive, setIsActive] = useState(false);
  const dropDownRef = useRef(null);

  //I-3
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
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
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

    getDownloadURL(storageRef)
      .then((downloadUrl) => {
        setUrl(downloadUrl);
        localStorage.setItem("profileImageUrl", downloadUrl);
      })
      .catch(() => {
        setUrl(avatar);
      });
  }, []);
  //fim I-3

  const closeMenu = () => {
    setIsActive(false);
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  const onClick = (event) => {
    setIsActive(!isActive);
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);

        const q = query(
          collection(db, "users"),
          where("email", "==", user.email)
        );
        getDocs(q).then((querySnapshot) => {
          const users = [];
          querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
          });
          setUsers(users);
          setIsLoading(false);
        });
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [db]);
  const history = useHistory();

  const handleEditClick = (field) => {
    setEditingField(field);
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const handleUpdateNome = async () => {
    try {
      await updateDoc(doc(db, "users", users[0].id), {
        nome: newNome,
      });
      setUsers([
        {
          ...users[0],
          nome: newNome,
        },
      ]);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdateTel = async () => {
    try {
      await updateDoc(doc(db, "users", users[0].id), {
        telefone: newTelefone,
      });
      setUsers([
        {
          ...users[0],
          telefone: newTelefone,
        },
      ]);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdateSenha = async () => {
    try {
      await updateDoc(doc(db, "users", users[0].id), {
        senha: newSenha,
      });
      setUsers([
        {
          ...users[0],
          senha: newSenha,
        },
      ]);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveClickTel = (e) => {
    e.preventDefault();
    handleUpdateTel();
    const confirmSave = window.confirm(
      "Tem certeza que deseja alterar o Telefone?"
    );
    if (confirmSave) {
      setUsers([{ ...users[0], telefone: newTelefone }]);
      setIsEditing(false);
    }
  };

  const handleSaveClickNome = (e) => {
    e.preventDefault();
    handleUpdateNome();
    const confirmSave = window.confirm(
      "Tem certeza que deseja alterar o nome?"
    );
    if (confirmSave) {
      setUsers([{ ...users[0], nome: newNome }]);
      setIsEditing(false);
    }
  };
  const handleSaveClickSenha = (e) => {
    e.preventDefault();
    handleUpdateSenha();
    const confirmSave = window.confirm(
      "Tem certeza que deseja alterar sua Senha?"
    );
    if (confirmSave) {
      setUsers([{ ...users[0], senha: newSenha }]);
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <div>Você precisa estar logado para acessar essa página.</div>;
  }
  const deleteDataFromCollection = async (collectionName, userId) => {
    const querySnapshot = await getDocs(
      query(collection(db, collectionName), where("userId", "==", userId))
    );

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    return batch.commit();
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir sua conta permanentemente?"
    );

    if (confirmDelete) {
      try {
        const userId = users[0].id;

        // Deletar dados das coleções
        const collections = [
          "Relatorio",
          "cofrinho",
          "contaCorrente",
          "gastos",
        ];
        const deletionPromises = collections.map((collectionName) =>
          deleteDataFromCollection(collectionName, userId)
        );

        try {
          await Promise.all(deletionPromises);
        } catch (error) {
          console.error("Erro ao excluir dados das coleções:", error);
          return;
        }

        // Deletar dados da coleção users
        await deleteDoc(doc(db, "users", userId));

        // Deletar autenticação do Firebase
        await auth.currentUser.delete();

        // Deslogar usuário
        auth.signOut();
        history.push("/login");
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onnClick = (event) => {
    event.stopPropagation(); // Adicione esta linha para evitar a propagação do evento
    setIsActive(!isActive);
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form className="perfil-form" onSubmit={handleFormSubmit}>
      
      <div className="perfil-container">
      <h1>Perfil</h1>
        <Image src={url} roundedCircle width={150} height={150} />
        <Button
          className="btnImg"
          onClick={() => setEditingImage(!editingImage)}
        >
          {editingImage ? "Cancelar" : ""}
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
        
        {progress !== 100 && <p>Carregando...</p>}
        <div className="menu-container">
          <button onClick={(event) => onnClick(event)} className="menu-button">
            <FiMoreHorizontal />
          </button>
          <nav
            ref={dropDownRef}
            className={`settings ${isActive ? "active" : "inactive"}`}
          >
            <ul className="listaMenu">
              <li>
                <button type="button" onClick={handleDeleteAccount}>
                  Excluir Conta
                </button>
              </li>
               <li>
                <button
                  type="button"
                  onClick={() => setEditingImage(!editingImage)}
                >
                  {editingImage ? "Cancelar": "Editar Foto"}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    auth.signOut();
                    window.location.href = "/login";
                  }}
                >
                  Sair
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="perfil-info">
          <div className="perfil-coluna">
            <table className="tabelaInfo">
              <th className="infoUser">
                <tbody className="infosUser">
                  <tr>
                    <td className="info">NOME</td>
                    <td className="infosU">
                      {isEditing && editingField === "nome" ? (
                        <div className="editUser">
                          <input
                            type="text"
                            defaultValue={users[0].nome}
                            onChange={(e) => setNewNome(e.target.value)}
                          />
                          <button onClick={handleSaveClickNome}>
                            <BiCheck />
                          </button>
                          <button
                            className="btnX"
                            onClick={() => setIsEditing(false)}
                          >
                            <BiX />
                          </button>
                        </div>
                      ) : (
                        <div>{users[0].nome}</div>
                      )}
                    </td>
                    <td className="infosU">
                      {!isEditing ? (
                        <button
                          className="btnIcon"
                          onClick={() => handleEditClick("nome")}
                        >
                          <span>
                            <FontAwesomeIcon icon={faEdit} />
                          </span>
                        </button>
                      ) : (
                        <div> </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="info">E-MAIL:</td>
                    <td className="infosU">{users[0].email}</td>
                    <td>
                      {!isEditing && (
                        <button
                          className="btnIcon"
                          onClick={() =>
                            alert("Não é possível editar esse tipo de dado")
                          }
                        >
                          <span>
                            <FontAwesomeIcon icon={faLock} />
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="info">TELEFONE:</td>
                    <td className="infosU">
                      {isEditing && editingField === "telefone" ? (
                        <div className="editUser">
                          <input
                            type="text"
                            defaultValue={users[0].telefone}
                            onChange={(e) => setNewTelefone(e.target.value)}
                          />
                          <button onClick={handleSaveClickTel}>
                            <BiCheck />
                          </button>
                          <button
                            className="btnX"
                            onClick={() => setIsEditing(false)}
                          >
                            <BiX />
                          </button>
                        </div>
                      ) : (
                        <div>{users[0].telefone}</div>
                      )}
                    </td>
                    <td className="infosU">
                      {!isEditing ? (
                        <button
                          className="btnIcon"
                          onClick={() => handleEditClick("telefone")}
                        >
                          <span>
                            <FontAwesomeIcon icon={faEdit} />
                          </span>
                        </button>
                      ) : (
                        <div></div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="info">CPF:</td>
                    <td className="infosU">{users[0].cpf}</td>
                    <td>
                      {!isEditing && (
                        <button
                          className="btnIcon"
                          onClick={() =>
                            alert("Não é possível editar esse tipo de dado")
                          }
                        >
                          <span>
                            <FontAwesomeIcon icon={faLock} />
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="info">SENHA </td>
                    <td className="infosU">{users[0].senha}</td>
                    <td>
                      {!isEditing && (
                        <button
                          className="btnIcon"
                          onClick={() =>
                            alert("Não é possível editar esse tipo de dado")
                          }
                        >
                          <span>
                            <FontAwesomeIcon icon={faLock} />
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </th>
            </table>
          </div>
        </div>
      </div>
    </form>
  );
}

export default Perfil;
