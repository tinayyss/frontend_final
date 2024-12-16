import React, { useEffect, useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINT } from './App';
import Swal from 'sweetalert2';
import Modal from "react-bootstrap/Modal";

// Add the image URL for your background
import backgroundImage from './img/pic1.jpg'; // Replace with your actual image path

function Dashboard () {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDecodedUserID = async () => {
            try {
                const response = JSON.parse(localStorage.getItem('token'));
                setUser(response.data);

                const decoded_token = jwtDecode(response.data.token);
                setUser(decoded_token);
            } catch (error) {
                navigate("/login");
            }
        };

        fetchDecodedUserID();
    }, []);

    /* LOGOUT */
    const handleLogout = async () => {
        try {
            localStorage.removeItem('token');
            navigate("/login");
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    /* DISPLAY USERS */
    const [users, setUsers] = useState([]);
    const userdata = JSON.parse(localStorage.getItem('token'));
    const token = userdata.data.token;

    const headers = {
        accept: 'application/json',
        Authorization: token
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        await axios.get(`${API_ENDPOINT}/user`, { headers: headers }).then(({data}) => {
            setUsers(data);
        });
    };

    /* DELETE USER */
    const deleteUser = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Are you sure you want to delete this?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6c63ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            return result.isConfirmed;
        });

        if (!isConfirm) {
            return;
        }

        await axios.delete(`${API_ENDPOINT}/user/${id}`, { headers: headers }).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: "Finish"  
            });
            fetchUsers();
        }).catch(({response: {data}}) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            });
        });
    };

    /* CREATE USER */
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [passwordx, setPassword] = useState('');
    const [validationError, setValidationError] = useState({});

    const createUser = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('fullname', fullname);
        formData.append('username', username);
        formData.append('password', passwordx);

        await axios.post(`${API_ENDPOINT}/auth/register`, { fullname, username, passwordx }, { headers: headers }).then(({data}) => {
            Swal.fire({
                icon: "success",
                text: data.message
            });
            fetchUsers();
        }).catch(({response}) => {
            if (response.status === 422) {
                setValidationError(response.data.errors);
            } else {
                Swal.fire({
                    text: response.data.message,
                    icon: "error"
                });
            }
        });
    };

    /* READ USER DETAILS */
    const [selectedUser, setSelectedUser] = useState(null);
    const [show1, setShow1] = useState(false);

    const handleClose1 = () => setShow1(false);
    const handleShow1 = (row_users) => {
        setSelectedUser(row_users);
        setShow1(true);
    };

    /* UPDATE USER */
    const [showUpdate, setShowUpdate] = useState(false);
    const [newFullname, setNewFullname] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPasswordx, setNewPassword] = useState("");
    const [editUser, setEditUser] = useState(null);

    const handleShowUpdate = (user) => {
        setEditUser(user);
        setNewFullname(user.fullname);
        setNewUsername(user.username);
        setNewPassword("");  // Reset password field for security
        setShowUpdate(true);
    };

    const handleCloseUpdate = () => setShowUpdate(false);

    const updateUser = async (e) => {
        e.preventDefault();

        if (!editUser) return;

        const updatedData = {
            fullname: newFullname,
            username: newUsername,
            passwordx: newPasswordx,
        };

        try {
            const response = await axios.put(
                `${API_ENDPOINT}/user/${editUser.user_id}`,
                updatedData,
                { headers: headers }
            );

            Swal.fire({
                icon: 'success',
                text: response.data.message,
            });

            setShowUpdate(false);
            fetchUsers();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: error.response ? error.response.data.message : 'An error occurred',
            });
        }
    };

    return (
        <>
            {/* Navbar without background image */}
            <Navbar style={{
                background: 'black', // Genshin-inspired gradient
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }} data-bs-theme="dark">
                <Container>
                    <Navbar.Brand href="#home" style={{color: 'red', fontSize: '24px', fontWeight: 'bold'}}>Movie Marathon</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="https://www.youtube.com/" style={{color: '#fff', fontSize: '16px', marginLeft: '15px'}}>Browse</Nav.Link>
                        <Nav.Link href="https://www.loklok.com/" style={{color: '#fff', fontSize: '16px', marginLeft: '15px'}}>Anime</Nav.Link>
                        <Nav.Link href="https://www.tiktok.com/" style={{color: '#fff', fontSize: '16px', marginLeft: '15px'}}>Tiktok</Nav.Link>
                    </Nav>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <NavDropdown title={user ? `User: ${user.username}` : 'Dropdown'} id="basic-nav-dropdown" align="end">
                                <NavDropdown.Item href="https://www.github.com/" style={{color: '#ff5c8d'}}>Profile</NavDropdown.Item>
                                <NavDropdown.Item href="#" style={{color: '#ff5c8d'}}>Settings</NavDropdown.Item>
                                <NavDropdown.Item href="#" onClick={handleLogout} style={{color: '#ff5c8d'}}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>              
                </Container>
            </Navbar>

            {/* Main content with background image */}
            <div style={{
                backgroundImage: `url(${backgroundImage})`, // Apply the background image
                backgroundSize: '100%', // Scale the image to cover the area
                backgroundPosition: 'center',
                minHeight: '100vh', // Ensure full screen height
                backgroundAttachment: 'fixed',
                paddingTop: '50px'
            }}>
                {/* Dashboard Content */}
                <div className="container" style={{ marginTop: '30px', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px' }}>
                    <div className="col-12">
                        <Button variant="success mb-2 float-end" onClick={handleShow} style={{background: 'gray', borderColor: 'black', color: 'black'}}>Create User</Button>
                    </div>

                    <table className="table table-bordered" style={{background: '#f1f1f1', borderRadius: '8px'}}>
                        <thead style={{textAlign: 'center', background: '#ff5c8d', color: '#fff'}}>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Fullname</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 && users.map((row_users, key) => (
                                <tr key={row_users.user_id}>
                                    <td>{row_users.user_id}</td>
                                    <td>{row_users.username}</td>
                                    <td>{row_users.fullname}</td>
                                    <td>
                                        <center>
                                            <Button variant='success' size='sm' onClick={() => handleShow1(row_users)} style={{ color: 'black', backgroundColor: 'lightblue', borderColor: 'black'}}>Read</Button>
                                            <Button variant='warning' size='sm' onClick={() => handleShowUpdate(row_users)} style={{backgroundColor: '#f0a500', borderColor: 'black'}}>Update</Button>
                                            <Button variant='danger' size='sm' onClick={() => deleteUser(row_users.user_id)} style={{ backgroundColor: '#ff5c8d', borderColor: 'black'}}>Delete</Button>
                                        </center>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            <Modal show={show} onHide={handleClose} autoFocus aria-labelledby="createUserModal" aria-hidden="true">
                <Modal.Header closeButton style={{backgroundColor: 'black'}}>
                    <Modal.Title style={{color: '#fff'}}>Create User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={createUser}>
                        <Row>
                            <Col>
                                <Form.Group controlId="Name">
                                    <Form.Label>Fullname</Form.Label>
                                    <Form.Control type="text" value={fullname} onChange={(event) => { setFullname(event.target.value) }} required autoFocus />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="Username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" value={username} onChange={(event)=>{setUsername(event.target.value)}} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="Passwordx">
                                    <Form.Label>password</Form.Label>
                                    <Form.Control type="passwordx" value={passwordx} onChange={(event) => { setPassword(event.target.value) }} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button variant="primary" className="mt-2" size="sm" block="block" type="submit" style={{background: 'black'}}>Save</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Update User Modal */}
            <Modal show={showUpdate} onHide={handleCloseUpdate} autoFocus aria-labelledby="updateUserModal">
                <Modal.Header closeButton style={{backgroundColor: 'black'}}>
                    <Modal.Title style={{color: '#fff'}}>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateUser}>
                        <Row>
                            <Col>
                                <Form.Group controlId="Fullname">
                                    <Form.Label>Fullname</Form.Label>
                                    <Form.Control type="text" value={newFullname} onChange={(event) => setNewFullname(event.target.value)} required autoFocus />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="Username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" value={newUsername} onChange={(event) => setNewUsername(event.target.value)} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="Passwordx">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="passwordx" value={newPasswordx} onChange={(event) => setNewPassword(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button variant="primary" className="mt-2" size="sm" type="submit" style={{background: 'black'}}>Save</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Read User Modal */}
            <Modal show={show1} onHide={handleClose1} autoFocus aria-labelledby="readUserModal" aria-hidden="true">
                <Modal.Header closeButton style={{backgroundColor: 'black'}}>
                    <Modal.Title style={{color: '#fff'}}>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser ? (
                        <div>
                            <p><strong>ID:</strong> {selectedUser.user_id}</p>
                            <p><strong>Fullname:</strong> {selectedUser.fullname}</p>
                            <p><strong>Username:</strong> {selectedUser.username}</p>
                        </div>
                    ) : (
                        <p>No data available</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose1} style={{backgroundColor: 'black'}}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Dashboard;
