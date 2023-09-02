import {
  Button,
  Card,
  // CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  // Row,
  Col
} from "reactstrap"
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/userContext.js";
import AlertModal from '../../components/Alert/AlertModal.js'

// import './login.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUserJson, setIsLoggendIn } = useAuth();

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');


  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const postData = async () => {
    try {
      const response = await axios.post("api/v1/login", {
        email,
        password,
      })

      const { tokenSession, user } = response.data;

      localStorage.setItem("token", tokenSession);
      // localStorage.setItem("formation_program", user[0].formation_program[0]);
      // localStorage.setItem("_id", user[0]._id);
      localStorage.setItem("User", JSON.stringify(user));
      localStorage.setItem("isLogin", true);
      setIsLoggendIn(localStorage.getItem("isLogin"))
      const updatedUserJson = user;

      axios.defaults.headers.common['authorization'] = localStorage.getItem('token')

      setUserJson(updatedUserJson);
      setUserJson(user)

      setAlertType(response.data.status);
      setAlertMessage(response.data.message);
      setShowAlert(true);

      navigate("/admin/index");
    } catch (error) {
      console.log(error);
    }
  };

    //ver y ocultar la cntraseña  
    const [showPassword, setShowPassword] = useState(false);

    // const togglePasswordVisibility = () => {
    //   setShowPassword(!showPassword);
    // };
    const togglePasswordVisibility = (e) => {
      e.stopPropagation(); // Detener la propagación del evento click
      setShowPassword(!showPassword);
    };

  return (
    <>
      <Col lg="5" md="7">
      <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Ingresa tus credenciales </small>
            </div>
        <Form className="formw" role="form" onSubmit={(e) => {
          e.preventDefault();
          postData(email, password)
        }}
        >
          
          <FormGroup className="mb-5">
            <InputGroup className="input-group-alternative">
              <InputGroupAddon addonType="prepend">
                <InputGroupText >
                  <i className="ni ni-email-83" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                id="input"
                placeholder="Correo"
                type="email"
                value={email}
                onChange={e =>
                  setEmail(e.target.value)
                }
                autoComplete="new-email"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <InputGroup className="input-group-alternative">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-lock-circle-open" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={e =>
                  setPassword(e.target.value)
                }
                autoComplete="new-password"
              />    <span 
                style={{
                position: 'absolute',
                top: '20px',
                right: '2rem',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                zIndex: '999',
                content: 'none',
              }}
              className={`password-toggle-icon ${showPassword ? 'fa-sharp fa-solid fa-eye' : 'fa-sharp fa-solid fa-eye-slash'}`} 
              onClick={togglePasswordVisibility}></span>
                     
            </InputGroup>
          </FormGroup>
          <div className="custom-control custom-control-alternative custom-checkbox">
            <input
              className="custom-control-input"
              id=" customCheckLogin"
              type="checkbox"
            />

          </div>
          <div className="text-center">
            <Button className="my-4" color="primary" type="submit">
              Iniciar sesion
            </Button>
          </div>
        </Form>
        </CardBody>
        </Card>
        {showAlert && (
        <AlertModal type={alertType} message={alertMessage} onClose={handleCloseAlert} />
      )}
      </Col>
      

    </>
  );
};



export default Login;
