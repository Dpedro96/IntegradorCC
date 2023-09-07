import "../CSS/Home.css";
import { FaPiggyBank, FaDollarSign, FaMoneyBill } from "react-icons/fa";
import { BiBarChartAlt } from "react-icons/bi";
import React, { useState, useEffect } from "react";
import { app } from "../Services/FirebaseConfig";
import {
  collection,
  getFirestore,
  getDocs,
  setDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import { BiX } from "react-icons/bi";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
} from "react-bootstrap";
import imgAlt from "../Img/michel-com-a-mão.png";

function Home() {
  const [showAddRendaExtra, setShowAddRendaExtra] = useState(false);
  const [showAddCofrinho, setShowAddCofrinho] = useState(false);
  const [showResgateCofrinho, setShowResgateCofrinho] = useState(false);
  const [selected, setSelected] = useState("Descrição");

  const descriptions = {
    Gastos:
      "Em gastos você ira cadastrar suas despesas mensais, tendo dois tipos possiveis de gstos, o Gasto Fixo no qual adicionara apenas o valor maximo, e o Gasto Variado que será preenchido valor maximo e minmo para ser feita a media desses valores",
    Cofrinho:
      "Em Cofrinho servirá para ajudar a você planejar um gasto a longo prazo, como uma viajem para fim do ano, um carro novo, etc. Será adicionado a meta a qual deseja alcançar e o valor inicial depositado, e conforme os dias pode adicionar para alcançar a meta e resgatar caso tire dinheiro do cofrinho",
    Renda:
      "Em Renda você adicionará o seu salário bruto em que ganha todo mês, também podendo edita-lo ou adicionar um valor extra, que seria um dinheiro inseperado naquele mês",
    Relatórios:
      "Em relatórios poderá visualzar toda a sua finaça cadastrada,  como cofrinho e seu progresso, renda bruta, todos os seus gastos como graficos para visualizar qual maior gasto naquele mês e total do gasto e seu salário. Também em relatórios poderá excluir qualquer um de seus cadastros financeiros",
  };

  async function handleResgateCofrinhoSubmit(event) {
    event.preventDefault();

    const auth = getAuth(app);
    const db = getFirestore(app);
    const usersCollectionRef = collection(db, "users");
    const cofrinhoCollectionRef = collection(db, "cofrinho");
    const user = auth.currentUser;
    const valor = parseFloat(event.target.elements.valorR.value);

    // Verificar se o valor é um número válido
    if (isNaN(valor)) {
      alert("Valor inválido. Por favor, insira um número.");
      return;
    }

    // Consultar a coleção "cofrinho" para encontrar o documento do cofrinho do usuário
    const cofrinhoQuerySnapshot = await getDocs(
      query(cofrinhoCollectionRef, where("userEmail", "==", user.email))
    );

    // Verificar se o documento do cofrinho foi encontrado e se o email do usuário corresponde ao campo "userEmail"
    if (cofrinhoQuerySnapshot.empty) {
      console.error(
        "Cofrinho não encontrado ou usuário não corresponde ao email registrado"
      );
      alert("Ocorreu um erro ao resgatar o valor.");
      return;
    }

    const cofrinhoDoc = cofrinhoQuerySnapshot.docs[0];

    if (cofrinhoDoc.data().userEmail !== user.email) {
      console.error(
        "Cofrinho não encontrado ou usuário não corresponde ao email registrado"
      );
      alert("Ocorreu um erro ao resgatar o valor.");
      return;
    }

    // Verificar se o valor a ser resgatado é maior do que o valor disponível no cofrinho
    if (valor > cofrinhoDoc.data().valorMensalCofrinho) {
      alert(
        "O valor a ser resgatado é maior do que o valor disponível no cofrinho."
      );
      return;
    }

    // Subtrair valor do cofrinho existente
    const novoValorMensalCofrinho =
      cofrinhoDoc.data().valorMensalCofrinho - valor;

    // Atualizar o documento do cofrinho com o novo valor
    await updateDoc(cofrinhoDoc.ref, {
      valorMensalCofrinho: novoValorMensalCofrinho,
    });

    // Fechar formulário de resgate do cofrinho
    setShowResgateCofrinho(false);

    // Exibir mensagem de sucesso
    alert("Valor resgatado com sucesso!");
  }

  async function handleAddCofrinhoSubmit(event) {
    event.preventDefault(event);

    const auth = getAuth(app);
    const db = getFirestore(app);
    const usersCollectionRef = collection(db, "users");
    const cofrinhoCollectionRef = collection(db, "cofrinho");
    const user = auth.currentUser;

    // Obter valor inserido pelo usuário
    const valorInput = event.target.elements.valor;
    const valor = parseFloat(valorInput.value);

    // Verificar se o valor é um número válido
    if (isNaN(valor)) {
      // Exibir mensagem de erro
      alert("Por favor, insira apenas números no campo de valor.");
      return;
    }

    // Criar referência para a coleção "users" e recuperar documento do usuário atual
    const querySnapshot = await getDocs(
      query(usersCollectionRef, where("email", "==", user.email))
    );
    const doc = querySnapshot.docs[0];

    // Verificar se o documento foi encontrado
    if (doc) {
      // Criar referência para a coleção "cofrinho" e recuperar documento do cofrinho do usuário atual
      const cofrinhoQuerySnapshot = await getDocs(
        query(cofrinhoCollectionRef, where("userEmail", "==", user.email))
      );
      const cofrinhoDoc = cofrinhoQuerySnapshot.docs[0];

      // Verificar se o documento do cofrinho foi encontrado e se o email do usuário corresponde ao campo "userEmail"
      if (cofrinhoDoc && cofrinhoDoc.data().userEmail === user.email) {
        // Adicionar valor ao valorMensalCofrinho existente
        const novoValorMensalCofrinho =
          cofrinhoDoc.data().valorMensalCofrinho + valor;

        // Atualizar o documento com o novo valor
        await setDoc(
          cofrinhoDoc.ref,
          { valorMensalCofrinho: novoValorMensalCofrinho },
          { merge: true }
        );

        // Fechar formulário de adição de cofrinho
        setShowAddCofrinho(false);

        // Exibir mensagem de sucesso
        alert("Valor adicionado com sucesso!");
      } else {
        console.error(
          "Cofrinho não encontrado ou usuário não corresponde ao email registrado"
        );

        // Exibir mensagem de erro
        alert("Ocorreu um erro ao adicionar o valor.");
      }
    }
  }

  async function handleRendaExtraSubmit(event) {
    event.preventDefault(event);

    const auth = getAuth(app);
    const db = getFirestore(app);
    const usersCollectionRef = collection(db, "contaCorrente");
    const user = auth.currentUser;

    // Obter valor inserido pelo usuário e converter para Number
    const valor = Number(event.target.elements.valor.value);

    // Verificar se o valor é um número válido
    if (isNaN(valor)) {
      // Exibir mensagem de erro
      alert("Valor inválido. Por favor, insira um número.");
      return;
    }

    // Consultar contaCorrente para verificar se o usuário tem uma conta corrente
    const querySnapshot = await getDocs(
      query(usersCollectionRef, where("email", "==", user.email))
    );

    // Verificar se o usuário tem uma conta corrente
    if (!querySnapshot.empty) {
      // Obter o documento do usuário
      const userDoc = querySnapshot.docs[0];

      // Obter o valor atual de rendaMensal e rendaTotal e converter para Number
      const rendaMensal = Number(userDoc.data().rendaMensal);
      const rendaTotal = Number(userDoc.data().rendaTotal);
      // Calcular nova rendaTotal
      const novaRendaTotal = rendaTotal + valor;

      // Atualizar o documento do usuário com a nova rendaTotal e o valor inserido pelo usuário
      await updateDoc(userDoc.ref, {
        rendaTotal: novaRendaTotal,
        valor: valor,
      });

      // Exibir mensagem de sucesso
      alert(`Renda Total atualizada para R$ ${novaRendaTotal.toFixed(2)}`);
    } else {
      // Exibir mensagem de erro se o usuário não tiver uma conta corrente
      alert(
        "Você não tem uma conta corrente. Por favor, crie uma conta corrente primeiro."
      );
      return;
    }
  }

  function handleAddCofrinhoClick() {
    setShowAddCofrinho(true);
  }

  function handleAddRendaExtraClick() {
    setShowAddRendaExtra(true);
  }

  async function handleResgateCofrinhoClick() {
    setShowResgateCofrinho(true);
  }

  return (
    <section>
      <Container fluid>
        <Row>
          <Col className="corpo-sup">
            <Row>
              <Col lg="6">
                <h1>A maneira mais fácil de gerenciar finanças pessoais</h1>
                <p>
                  O gerenciador de gastos que você precisava a um click de
                  distância, adicione seus gastos, lucros e planos futuros que a
                  gente da um jeito para você
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <Container>
        <Row className="posicaoCard">
          <Col>
            <Card id="gastoCard" style={{ width: "16rem" }}>
              <Card.Body>
                <span className="lgGastos">
                  <FaDollarSign />
                </span>
                <Card.Title className="tituloGasto">Gasto</Card.Title>
                <Card.Subtitle className="textoGasto mb-2 text-muted">
                  Para Gerenciar seus Gastos clique aqui!!
                </Card.Subtitle>
                <Link to="/gastos">
                  <Button className="bt_comecar" variant="primary">
                    Criar
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card id="gastoCard" style={{ width: "16rem" }}>
              <Card.Body>
                <span className="lgGastos">
                  <FaPiggyBank />
                </span>
                <Card.Title className="tituloGasto">Cofrinho</Card.Title>
                <Card.Subtitle className="textoGasto mb-2 text-muted">
                  Para Gerenciar seu Cofrinho clique aqui!!
                </Card.Subtitle>
                <Link to="/cofrinho">
                  <Button className="bt_criar bt_comecar">Criar</Button>
                </Link>
                <Button
                  className="bt_resgatar bt_comecar"
                  onClick={handleAddCofrinhoClick}
                >
                  Adicionar
                </Button>
                <Button
                  className="bt_resgatar bt_comecar"
                  onClick={handleResgateCofrinhoClick}
                >
                  Resgatar
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card id="gastoCard" style={{ width: "16rem" }}>
              <Card.Body>
                <span className="lgGastos">
                  <FaMoneyBill />
                </span>
                <Card.Title className="tituloGasto">Renda Bruta</Card.Title>
                <Card.Subtitle className="textoGasto mb-2 text-muted">
                  Para Gerenciar sua Renda clique aqui!!
                </Card.Subtitle>
                <Link to="/contaCorrente">
                  <Button className="bt_criar bt_comecar">Criar</Button>
                </Link>
                <Link to="/EditarContaCorrente">
                  <Button
                    className="bt_comecar"
                    onClick={handleAddCofrinhoClick}
                  >
                    Adicionar
                  </Button>
                </Link>
                <Button
                  className="bt_criar bt_comecar"
                  onClick={handleAddRendaExtraClick}
                >
                  Extra
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card id="gastoCard" style={{ width: "16rem" }}>
              <Card.Body>
                <span className="lgGastos">
                  <BiBarChartAlt />
                </span>
                <Card.Title className="tituloGasto">Relatórios</Card.Title>
                <Card.Subtitle className="textoGasto mb-2 text-muted">
                  Para ver o relatorio completo aqui!!
                </Card.Subtitle>
                <Link to="/relatorios">
                  <Button className="bt_comecar">Ver</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {showAddCofrinho && (
        <div className="cofrinho-overlay">
          <div className="cofrinho-form">
            <h2>Adicionar valor ao Cofrinho</h2>
            <form onSubmit={handleAddCofrinhoSubmit}>
              <label htmlFor="valor">Valor </label>
              <input
                type="text"
                name="valor"
                id="valor"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
              <button type="submit">Adicionar</button>
              <button
                className="btnX"
                onClick={() => setShowAddCofrinho(false)}
              >
                <BiX />
              </button>
            </form>
          </div>
        </div>
      )}
      {showResgateCofrinho && (
        <div className="cofrinho-overlay">
          <div className="cofrinho-form">
            <h2>Resgatar um valor do Cofrinho</h2>
            <form onSubmit={handleResgateCofrinhoSubmit}>
              <label htmlFor="valorR">Valor </label>
              <input type="number" id="valorR" name="valorR" />
              <button type="submit">Resgatar</button>
              <button
                className="btnX"
                onClick={() => setShowResgateCofrinho(false)}
              >
                <BiX />
              </button>
            </form>
          </div>
        </div>
      )}
      {showAddRendaExtra && (
        <div className="cofrinho-overlay">
          <div className="cofrinho-form">
            <h2>Adicionar Renda Extra</h2>
            <form onSubmit={handleRendaExtraSubmit}>
              <label htmlFor="rendaExtra">Valor </label>
              <input type="text" name="valor" id="rendaExtra" />
              <button type="submit">Adicionar</button>
              <button
                className="btnX"
                onClick={() => setShowAddRendaExtra(false)}
              >
                <BiX />
              </button>
            </form>
          </div>
        </div>
      )}
      <Container>
        <hr></hr>
        <Row className="justify-content-center align-items-center">
          <Col md="8">
            <div className="title">{selected}</div>
            <div className="description">{descriptions[selected]}</div>
          </Col>
          <Col md="12">
            <div className="icon-bar">
              <div className="top-strip">
                <div className={selected === "Gastos" ? "highlight" : ""}></div>
                <div
                  className={selected === "Cofrinho" ? "highlight" : ""}
                ></div>
                <div className={selected === "Renda" ? "highlight" : ""}></div>
                <div
                  className={selected === "Relatórios" ? "highlight" : ""}
                ></div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-center align-items-center">
          <Col md="3">
            <div className="boxIcone">
              <Button
                variant="link"
                onClick={() => setSelected("Gastos")}
                className={selected === "Gastos" ? "selected" : ""}
              >
                <FaDollarSign className="icon" />
              </Button>
            </div>
          </Col>
          <Col md="3">
            <div className="boxIcone">
              <Button
                variant="link"
                onClick={() => setSelected("Cofrinho")}
                className={selected === "Cofrinho" ? "selected" : ""}
              >
                <FaPiggyBank className="icon" />
              </Button>
            </div>
          </Col>
          <Col md="3">
            <div className="boxIcone">
              <Button
                variant="link"
                onClick={() => setSelected("Renda")}
                className={selected === "Renda" ? "selected" : ""}
              >
                <FaMoneyBill className="icon" />
              </Button>
            </div>
          </Col>
          <Col md="3">
            <div className="boxIcone">
              <Button
                variant="link"
                onClick={() => setSelected("Relatórios")}
                className={selected === "Relatórios" ? "selected" : ""}
              >
                <BiBarChartAlt className="icon" />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <Container>
        <hr></hr>
        <Row>
          <Col md="6">
            <Image className="imagem-texto" src={imgAlt}></Image>
          </Col>
          <Col md="6" className="descriptiontexto-container">
            <p className="descriptiontexto">
              Na jornada de construir um futuro financeiramente sólido,
              oferecemos uma plataforma que vai além do simples gerenciamento de
              gastos e renda. Aqui, cultivamos a confiança, a disciplina e a
              liberdade financeira. Permita-nos guiá-lo enquanto você cria um
              amanhã mais seguro e próspero, um centavo de cada vez !
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Home;
