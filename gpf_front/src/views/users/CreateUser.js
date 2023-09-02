import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios';
import * as Reactstrap from 'reactstrap';
import Select from "react-select";
import AlertModal from '../../components/Alert/AlertModal.js'
import InputValidation from '../../Helpers/validacion.js'

const CreateUser = ({ isOpen, toggle, apiGet, type, apiGetP, user, apiGetCenter }) => {
  const [data, setData] = useState({});
  const userParser = localStorage.getItem('User');
  const a = JSON.parse(userParser)

  /*type profile*/
  const [profile, setProfile] = useState([]);

  /*Formation prograns*/
  const [programs, setProgrms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);

  //  Alertas
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  //estados para centro de formacion    
  const [center, setCenter] = useState([]);

  //validación del formulario
  const [isValidForm, setIsValidForm] = useState(true);

  // Función para actualizar el estado isValidForm
  const setInputValidity = (isValid) => {
    setIsValidForm(isValid);
  };

  //estados de titulos y botones
  const [title, setTitle] = useState("");
  const [nameButton, setNameButton] = useState("");

  //^ etsdo para obtener el perfil del localStorage
  const [typeProfile, setTypeProfile] = useState(null);

  const handleSelectChange = (selectedProgram) => {
    setData({ ...data, formation_program: selectedProgram.map((e) => e.value) });
    setSelectedPrograms(selectedProgram);
  };


  useEffect(() => {
    if (type === true) {
      const Data = async () => {
        // const { data } = await axios.get(apiGet);

        setSelectedPrograms(
          user?.formation_program?.map((formation_program) => ({
            value: formation_program._id,
            label: formation_program.program_name,
          })) || []
        )
        setData(user);

      };
      Data();
      setTitle("Editar");
      setNameButton("Actualizar");

      setProgrms(a.formation_program._id)
    } else {
      setData({
        complete_names: "",
        email: "",
        password: "",
        type_profile: "",
        formation_program: "",
        training_center: a.training_center,
      });
      setTitle("Registrar");
      setNameButton("Registrar");
    }

    const get = async () => {
      const { data } = await axios.get(apiGetP);
      setProfile(data.results)
    };

    get();

    //^ api centros
    const getCenter = async () => {
      const { data } = await axios.get(apiGetCenter);
      setCenter(data.results)
    };

    getCenter();

    //*Obtener el perfi del localStorage
    const storedTypeProfile = localStorage.getItem('User');
    const json = JSON.parse(storedTypeProfile)
    setTypeProfile(json.type_profile.map((e)=>{return e.type_profile}));

  }, [type, apiGet, apiGetP, user]);

  //  alertas
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  let options_program = [];
  for (let i = 0; i < a.formation_program?.length; i++) {
    options_program.push({
      value: a.formation_program[i]?._id,
      label: a.formation_program[i]?.program_name,
    });
  }


  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleChange2 = (value, fieldName) => {
    setData({ ...data, [fieldName]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //validación del formulario
    if (!isValidForm) {
      // Si hay algún error de validación, no envíes el formulario
      return;
    }

    if (type === false) {
      axios.post("api/v1/user", data).then(
        (res) => {
          if (res.data.status === 'success') {

            toggle(!toggle);

            setData({
              complete_names: "",
              email: "",
              password: "",
              type_profile: "",
              formation_program: "",
              training_center: ""
            });
          }
          setAlertType(res.data.status);
          setAlertMessage(res.data.message);
          setShowAlert(true);
        }
      ).catch((err) => {
        setAlertType(err.status);
        setAlertMessage(err.message);
        setShowAlert(true);
      });

    } else {
      const { data: res } = axios.put(`api/v1/user/${data._id}`, data).then((res) => {
        setAlertType(res.data?.status);
        setAlertMessage(res.data?.message);
        setShowAlert(true);

      }).catch((err) => {
        setAlertType(err.status);
        setAlertMessage(err.message);
        setShowAlert(true);
      })
      toggle(!toggle);
    }
  }

  //ver y ocultar la cntraseña  
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Reactstrap.Modal
        className="modal-lg modal-dialog-centered "
        isOpen={isOpen}
        toggle={toggle}
      >
        <div className="modal-body p-0">
          <Reactstrap.Card className="bg-secondary shadow border-0">
            <Reactstrap.CardHeader className="bg-transparent pb-1">
              <Reactstrap.ModalHeader toggle={toggle} className="col-12 p-0">
                <div>
                  <h4>{title} Usuario</h4>
                </div>
              </Reactstrap.ModalHeader>
            </Reactstrap.CardHeader>
            <Reactstrap.CardBody className="px-lg-5 py-lg-5">
              <Reactstrap.Form onSubmit={handleSubmit}>

                <Reactstrap.Row>
                  <Reactstrap.Col md="6">
                    <Reactstrap.FormGroup className="mb-3">
                      <label
                        className="form-control-label"
                        htmlFor="input-username"
                      >
                        <span className="text-danger">*</span> Nombres Completos
                      </label>
                      <InputValidation
                        placeholder="Ej: Sebastian Lopez"
                        type="text"
                        name="complete_names"
                        minLength={5}
                        value={data?.complete_names}
                        onChange={(value) => handleChange2(value, 'complete_names')}
                        setIsValid={setInputValidity} // Pasamos la función setIsValidForm al componente InputValidation
                      />
                    </Reactstrap.FormGroup>
                  </Reactstrap.Col>

                  <Reactstrap.Col md="6">
                    <Reactstrap.FormGroup className="mb-3">
                      <label
                        className="form-control-label"
                        htmlFor="input-username"
                      >
                        <span className="text-danger">*</span> Correo
                      </label>
                      <InputValidation
                        placeholder="Ej: sebastianLopez@gmail.com"
                        type="email"
                        name="email"
                        value={data?.email}
                        onChange={(value) => handleChange2(value, 'email')}
                        setIsValid={setInputValidity} // Pasamos la función setIsValidForm al componente InputValidation
                      />
                    </Reactstrap.FormGroup>
                  </Reactstrap.Col>
                </Reactstrap.Row>

                <Reactstrap.Row >
                  <Reactstrap.Col md="6">
                    <Reactstrap.FormGroup className="mb-3">
                      <div className="campo">
                        <label
                          className="form-control-label"
                          htmlFor="input-username"
                        >
                          <span className="text-danger">*</span> Contraseña
                        </label>
                        <InputValidation
                          type={showPassword ? 'textPassword' : 'password'}
                          name="password"
                          value={user?.password}
                          onChange={(value => handleChange2(value, 'password'))}
                          setIsValid={setInputValidity}
                          minLength={8}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: '55px',
                            right: '3rem',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            zIndex: '1',
                            content: 'none',
                          }}
                          className={`password-toggle-icon ${showPassword ? 'fa-sharp fa-solid fa-eye' : 'fa-sharp fa-solid fa-eye-slash'}`}
                          onClick={togglePasswordVisibility}></span>
                      </div>
                    </Reactstrap.FormGroup>
                  </Reactstrap.Col>

                  <Reactstrap.Col md="6">
                    <label
                      className="form-control-label"
                      htmlFor="input-username"
                    >
                      <span className="text-danger">*</span> Seleccione el Tipo de Perfil
                    </label>

                    <select
                      className="form-control"
                      type="text"
                      name="type_profile"
                      value={user?.type_profile?.map((e) => {
                        return e.type_profile
                      })}
                      required
                      onChange={handleChange}
                      style={{ width: "100%" }}
                    >
                      <option value="">Select...</option>
                      {profile.map((profile) => {
                        if (
                          typeProfile === 'Instructor Lider' &&
                          profile.type_profile === 'Administrador'
                        ) {
                          return null; //* Excluir la opción 'Administrador' para 'Instructor Lider'
                        } else {
                          return (
                            <option key={profile.id} value={profile.type_profile}>
                              {profile.type_profile}
                            </option>
                          );
                        }
                      })}
                    </select>
                  </Reactstrap.Col>
                </Reactstrap.Row>

                <Reactstrap.Row >
                  <Reactstrap.Col md="6">
                    <Reactstrap.FormGroup className="mb-3">
                      <label
                        className="form-control-label"
                        htmlFor="input-username"
                      >
                        <span className="text-danger">*</span>Seleccione el programa de Formación</label>

                      <Reactstrap.FormGroup>
                        <Select
                          options={options_program}
                          value={selectedPrograms}
                          isMulti
                          onChange={handleSelectChange}
                        />
                      </Reactstrap.FormGroup>
                    </Reactstrap.FormGroup>
                  </Reactstrap.Col>

                  {/* <Reactstrap.Col md="6">
                    <Reactstrap.FormGroup className="mb-3">
                      <label
                        className="form-control-label"
                        htmlFor="input-username"
                      >
                        <span className="text-danger">*</span>Seleccione el Centro de formación</label>

                      {typeProfile === 'Administrador' && (
                        <Reactstrap.FormGroup>
                          <select
                             className="form-control"
                             type="text"
                             name="training_center"
                             value={user?.training_center?.map((e) => {
                              return e.training_center
                            })}
                            required
                            onChange={handleChange}
                            style={{ width: "100%" }}
                          >
      
                        <option value="" hidden>Select...</option>
                        return <>
                        {center?.map((e, index) => (

                          <option key={index} value={e.training_center}>
                            {e.training_center}
                          </option>))}
                      </>
                      
                          </select>
                        </Reactstrap.FormGroup>
                      )}
                    </Reactstrap.FormGroup>
                  </Reactstrap.Col> */}
                </Reactstrap.Row>

                <div className="text-center">
                  <Reactstrap.Button
                    className="btn-primary"
                    color="primary"
                    type="submit"
                  >
                    {nameButton}
                  </Reactstrap.Button>
                </div>
              </Reactstrap.Form>
            </Reactstrap.CardBody>

          </Reactstrap.Card>
        </div>
      </Reactstrap.Modal>

      {/* alertas */}
      {showAlert && (
        <AlertModal type={alertType} message={alertMessage} onClose={handleCloseAlert} />
      )}
    </>
  )
}

export default CreateUser
