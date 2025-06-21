import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../styles/Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    const { name, email, subject, message } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setAlert({ show: false, type: '', message: '' });

        try {
            const res = await axios.post('http://localhost:5001/api/contact', formData);
            setAlert({
                show: true,
                type: 'success',
                message: res.data.message
            });
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (err) {
            setAlert({
                show: true,
                type: 'danger',
                message: err.response?.data?.error || 'Something went wrong'
            });
        }
        setLoading(false);
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <div className="text-center mb-4">
                        <h2>Contact Us</h2>
                        <p className="text-muted">
                            Have a question or feedback? We'd love to hear from you.
                        </p>
                    </div>

                    {alert.show && (
                        <Alert 
                            variant={alert.type} 
                            onClose={() => setAlert({ ...alert, show: false })} 
                            dismissible
                        >
                            {alert.message}
                        </Alert>
                    )}

                    <Form onSubmit={onSubmit} className="bg-white p-4 rounded shadow-sm">
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                                placeholder="Enter your name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                placeholder="Enter your email"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control
                                type="text"
                                name="subject"
                                value={subject}
                                onChange={onChange}
                                placeholder="Enter message subject"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="message"
                                value={message}
                                onChange={onChange}
                                placeholder="Enter your message"
                                rows={5}
                                required
                            />
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </Button>
                    </Form>

                    <div className="mt-4 text-center">
                        <h5>Other Ways to Reach Us</h5>
                        <p className="mb-1">
                            <i className="fas fa-envelope me-2"></i>
                            Email: f223857@cfd.nu.edu.pk
                        </p>
                        <p className="mb-1">
                            <i className="fas fa-phone me-2"></i>
                            Phone: +92 (555) 123-4567
                        </p>
                        <p className="mb-0">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            Address: 123 Tech Street, Faisalabad, Pakistan
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Contact; 