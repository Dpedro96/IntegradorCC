import { Route, BrowserRouter, Switch } from "react-router-dom";
import Gasto from "./view/Gasto";
import ContaCorrente from "./view/ContaCorrente";
import { Cadastro } from "./view/Cadastro";
import Login from "./view/Login";
import Cofrinho from "./view/Cofrinho";
import Cabecalho from "./Cabecalho_Rodape/Cabecalho";
import Rodape from "./Cabecalho_Rodape/Rodape";
import { Redirect } from "react-router-dom";
import HomePage from "./view/HomePage";
import Home from "./view/Home";
import { useState, useEffect } from "react";
//import Perfil from "./view/Perfil";
import Perfil from "./view/perfilalt"
import { auth } from "./Services/FirebaseAuth";
import Relatorios from "./view/Relatorios";
import EditarContaCorrente from "./view/EditarContaCorrente"

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [authenticated, setAuthenticated] = useState(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        setAuthenticated(!!user);
      } catch (error) {
        console.log(error);
      }
    };
    checkAuth();
  }, [authenticated]);
  
  if (authenticated === null) {
    return authenticated;
  }
  
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/Login" />
        )
      }
    />
  );
};
const Rotas = () => {
  return (
    <BrowserRouter>
      <div>
        <Cabecalho />
      </div>
      <Switch>
        <Route path="/login" component={Login}/>
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/Cadastro" component={Cadastro}/>

          <PrivateRoute exact path="/home" component={Home}/>
          <PrivateRoute exact path="/contaCorrente" component={ContaCorrente} />
          <PrivateRoute exact path="/gastos" component={Gasto}/>
          <PrivateRoute exact path="/cofrinho" component={Cofrinho} />
          <PrivateRoute exact path="/perfil" component={Perfil}/>
          <PrivateRoute exact path="/relatorios" component={Relatorios}/>
          <PrivateRoute exact path="/EditarContaCorrente" component={EditarContaCorrente}/>
        </Switch>
        <div>
          <Rodape/>
        </div>
      </BrowserRouter>
    );
  };
  
export default Rotas;