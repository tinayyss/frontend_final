import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.css";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { API_ENDPOINT } from './Api';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [passwordx, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_ENDPOINT}/auth/login`, { username, passwordx });
      localStorage.setItem("token", JSON.stringify(response));
      setError('');
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{
      position: 'relative',
      backgroundImage: 'url("src/img/pic1.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center 230%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Lighter overlay with gradient effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2))', // Lighter gradient
        zIndex: 1
      }}></div>

      <Container style={{ zIndex: 2, marginTop: '50px' }}>
        <Row className="justify-content-center">
          <Col md={5}>
            <div className="login-form" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)', // Lighter background for the form
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
            }}>
              {/* Logo (optional) */}
              <div className="login-logo" style={{
                textAlign: 'center',
                marginBottom: '30px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: '#333' // Lighter color for the logo text
              }}>
                 <span style={{ fontWeight: 'bold', fontSize: '80px', color: 'black' }}>Movie</span> <span style={{ letterSpacing: '25px', fontWeight: 'lighter', fontSize: '45px', color: 'red' }}>Marathon</span>
                 </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername">
                  <Form.Control
                    className="form-control-sm rounded-0"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{
                      padding: '12px',
                      fontSize: '18px',
                      marginBottom: '20px',
                      backgroundColor: 'rgba(0, 0, 0, 0.1)', // Lighter input background
                      color: 'black',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword">
                  <Form.Control
                    className="form-control-sm rounded-0"
                    type="passwords"
                    placeholder="Password"
                    value={passwordx}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      padding: '12px',
                      fontSize: '18px',
                      marginBottom: '20px',
                      backgroundColor: 'rgba(0, 0, 0, 0.1)', // Lighter input background
                      color: 'black',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  />
                </Form.Group>

                {error && <p style={{
                  color: 'red',
                  textAlign: 'center',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>{error}</p>}

                <Form.Group controlId="formButton">
                  <Button
                    variant="dark"
                    className="btn-block bg-custom btn-flat rounded-0"
                    size="lg"
                    type="submit"
                    style={{
                      padding: '15px',
                      fontSize: '18px',
                      width: '100%',
                      backgroundColor: 'black',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}
                  >
                    Log In
                  </Button>
                </Form.Group>
              </Form>

              <div className="login-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#333' }}>By logging in, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
