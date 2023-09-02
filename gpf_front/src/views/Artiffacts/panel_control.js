
import { useState, useEffect } from "react";
import Header from "components/Headers/HEAD.js";
import * as Reactstrap from "reactstrap";
import { useParams } from 'react-router-dom';
import axios from "axios";
import Modal from "./modal.js"
import ModalQuarter from "./modalQuarter";
import { NavLink as NavLinkRRD } from "react-router-dom";
import routes from "../../routes.js";
import { NavLink } from 'react-router-dom';



const Butonn = (routeName, data, name) => {
    const matchingRoute = routes.find(route => route.name === routeName);

    if (!matchingRoute) {
        return null;
    }

    const { path, layout, icon, name: routeDisplayName } = matchingRoute;

    const getModifiedPath = (path, data, name) => {
        let modifiedPath = path;

        if (data !== null) {
            const dataStartIndex = path.indexOf('=/:');
            const dataEndIndex = path.indexOf('/&');
            modifiedPath = `${path.slice(0, dataStartIndex)}=/${data}${path.slice(dataEndIndex)}`;
        }

        if (name !== undefined && name !== null) { // Verifica si name no es undefined
            const nameStartIndex = modifiedPath.indexOf('&/:');
            modifiedPath = `${modifiedPath.slice(0, nameStartIndex)}&/${name}`;
        }

        return modifiedPath;
    };

    const modifiedPath = getModifiedPath(path, data, name);

    return (
        <>
            <Reactstrap.Button
                color="primary"
                type="button"
                className="btn-neutral btn-sm"
                onClick={(e) => {
                    e.preventDefault();
                }}
                id={`tooltip${data + path.length}`}
            >
                <NavLink
                    to={`${layout}${modifiedPath}`}
                    tag={NavLinkRRD}
                    activeClassName="active"
                    className="p-0"
                >
                    <i className={icon} />
                </NavLink>
            </Reactstrap.Button>
            <Reactstrap.UncontrolledTooltip
                delay={0}
                target={`tooltip${data + path.length}`}
            >
                {routeDisplayName}
            </Reactstrap.UncontrolledTooltip>
        </>
    );
};

const Index = () => {
    let [artiffacts, setArtiffacts] = useState([])
    let { formation_program } = useParams()
    let { program } = useParams()

    const [artiffactOne, setArtiffactOne] = useState([])
    const [data, setData] = useState([])
    const [quarterId, setQuarterId] = useState([])

    const [modal, setModal] = useState(false)
    const [type, setType] = useState(false)

    let [ddelete, setDeleter] = useState(false)
    const [quarter, setQuarter] = useState([])
    const [typeQuarter, setTypeQuarter] = useState(false)
    const [modalQuarter, setModalQuarter] = useState(false)

    const [records, setRecords] = useState([])

    const competence = data?.map((e) => {
        return e.competences
    })

    const toggle = () => {
        setModal(!modal);
        setType(false);
    };

    const toggle2 = () => {
        setModalQuarter(!modalQuarter)
        setTypeQuarter(false)

    };

    const Edit = (r) => {
        setQuarter(r);
        setModalQuarter(!modalQuarter);
        setTypeQuarter(true);
    };
    const Edit2 = (item) => {
        setArtiffactOne(item)
        setModal(!modal);
        setType(true);
    }
    const deletes = async (id) => {
        await axios.delete(`api/v1/quarter/${id}`).then(
            setDeleter(!ddelete)
        )
    }

    const deletesArtiffact = async (id) => {
        await axios.delete(`api/v1/artiffacts/${id}`).then(
            setDeleter(!ddelete)
        )
    }
    useEffect(() => {
        setQuarterId(quarter?._id)
        async function fetchData() {
            const { data } = await axios.get(
                `api/v1/quarter/${formation_program}`
            );
            setData(data.results);

            const records = await axios.get(
                `api/v1/records/${formation_program}`
            );
            setRecords(records.data.results)
            if (quarterId != null && modalQuarter === false) {
                await axios.get(`api/v1/artifacts/quarter/${quarterId}`).then(
                    ({ data }) => {
                        setArtiffacts(data.results)
                    }
                )
            }
        }
        fetchData();
    }, [modalQuarter, ddelete, quarter, quarterId, modal]);


    return (
        <>
            <Modal
                isOpen={modal}
                toggle={toggle}
                type={type}
                competences={artiffacts}
                quarterId={quarter._id}
                OneArtiffact={artiffactOne}
            />
            <Header />
            <ModalQuarter
                isOpen={modalQuarter}
                toggle={toggle2}
                type={typeQuarter}
                competences={competence}
                quarter={quarter}
                artiffactOne={artiffactOne}
            />
            {/* Page content */}
            <Reactstrap.Container className="mt--7" fluid>
                <Reactstrap.Row>
                    <Reactstrap.Col className="mb-5 mb-xl-0" xl="8">
                        <Reactstrap.Card className="bg-gradient-default shadow">
                            <Reactstrap.CardHeader className="bg-transparent">
                                <Reactstrap.Row className="align-items-center col-12">
                                    <div className="col-5">
                                        <h6 className="text-uppercase text-light ls-1 mb-1">
                                            Trismestre por
                                        </h6>
                                        <h2 className="text-white mb-0">Artfeactos</h2>
                                    </div>
                                    <Reactstrap.Col md="12">
                                        <Reactstrap.Card className="shadow">
                                            <Reactstrap.CardHeader className="bg-transparent">
                                                <Reactstrap.Row className="align-items-center">
                                                    <div className="col">
                                                        <Reactstrap.Button color="primary"
                                                            type="button"
                                                            className="btn-circle btn-neutral "
                                                            onClick={toggle}>
                                                            <i className="ni ni-fat-add" />
                                                        </Reactstrap.Button>
                                                    </div>
                                                </Reactstrap.Row>
                                            </Reactstrap.CardHeader>
                                            <Reactstrap.Table className="align-items-center table-flush bg-white shadow" responsive>
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th scope="col">N°</th>
                                                        <th scope="col">Nombre</th>
                                                        <th scope="col">Descripcion</th>
                                                        <th scope="col">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {artiffacts?.artiffacts?.map((item, index) => (
                                                        <tr key={index}>
                                                            <th>{index + 1}</th>
                                                            <th scope="row text-white"><p color="primary">{item.name}</p></th>
                                                            <td>{item.description}</td>
                                                            <td>
                                                                <Reactstrap.Button
                                                                    color="primary"
                                                                    type="button"
                                                                    className="btn-neutral  btn-sm m-0"
                                                                    onClick={() => Edit2(item)}
                                                                    id={`icon1${item._id}`}
                                                                >
                                                                    <i className="fa-solid fa-pencil"></i>
                                                                </Reactstrap.Button>
                                                                <Reactstrap.UncontrolledTooltip
                                                                    delay={0}
                                                                    target={`icon1${item._id}`}
                                                                >
                                                                    Editar
                                                                </Reactstrap.UncontrolledTooltip>
                                                                <Reactstrap.Button
                                                                    color="primary"
                                                                    type="button"
                                                                    className="btn-neutral  btn-sm m-3"
                                                                    onClick={() => deletesArtiffact(item._id)}
                                                                    id={`icon2${item._id}`}
                                                                >
                                                                    <i className="fa-solid fa-trash"></i>
                                                                </Reactstrap.Button>
                                                                <Reactstrap.UncontrolledTooltip
                                                                    delay={0}
                                                                    target={`icon2${item._id}`}
                                                                >
                                                                    Eliminar
                                                                </Reactstrap.UncontrolledTooltip></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Reactstrap.Table>
                                        </Reactstrap.Card>
                                    </Reactstrap.Col>
                                </Reactstrap.Row>
                            </Reactstrap.CardHeader>
                        </Reactstrap.Card>
                    </Reactstrap.Col>

                    <Reactstrap.Col xl="4">
                        <Reactstrap.Card className="shadow">
                            <Reactstrap.CardHeader className="bg-transparent">
                                <Reactstrap.Row className="align-items-center col-12">
                                    <div className="col-6">
                                        <h2 className="mb-0">Trimestre :{quarter.number}</h2>
                                    </div>
                                    <div className="col-6">
                                        <Reactstrap.Button color="primary"
                                            type="button"
                                            className="btn-circle btn-neutral ml-8"
                                            onClick={toggle2}>
                                            <i className="ni ni-fat-add" />
                                        </Reactstrap.Button>
                                    </div>
                                </Reactstrap.Row>
                            </Reactstrap.CardHeader>
                                <Reactstrap.Table className="align-items-center table-flush bg-white shadow" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                        <th scope="col">N°</th>
                                        <th scope="col">Trimestre</th>
                                        <th scope="col">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.map((e) => (
                                            e?.quarters.map((r, index) => ( 
                                                <tr key={r._id}>
                                                     <th>{index + 1}</th>
                                                    <td onClick={() => setQuarter(r)}>{r.number}</td>
                                                    <td>
                                                        <Reactstrap.Button
                                                            color="primary"
                                                            type="button"
                                                            className="btn-neutral  btn-sm m-0"
                                                            onClick={() => Edit(r)}
                                                            id={`icon1${r._id}`}
                                                        >
                                                            <i className="fa-solid fa-pencil"></i>
                                                        </Reactstrap.Button>
                                                        <Reactstrap.UncontrolledTooltip
                                                            delay={0}
                                                            target={`icon1${r._id}`}
                                                        >
                                                            Editar
                                                        </Reactstrap.UncontrolledTooltip>
                                                        <Reactstrap.Button
                                                            color="primary"
                                                            type="button"
                                                            className="btn-neutral  btn-sm m-3"
                                                            onClick={() => deletes(r._id)}
                                                            id={`icon1${r.borrar}`}
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </Reactstrap.Button>
                                                        <Reactstrap.UncontrolledTooltip
                                                            delay={0}
                                                            target={`icon1${r.borrar}`}
                                                        >
                                                            Eliminar
                                                        </Reactstrap.UncontrolledTooltip>
                                                    </td>
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </Reactstrap.Table>
                        </Reactstrap.Card>
                    </Reactstrap.Col>
                </Reactstrap.Row>
            </Reactstrap.Container>
        </>
    );
};

export default Index;

