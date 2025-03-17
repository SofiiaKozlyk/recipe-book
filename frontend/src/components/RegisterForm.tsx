import React from 'react';
import { TextField, Button, Typography, Paper, Link } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { doRegisterThunk } from '../store/slices/userSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserRegisterPropsI } from '../types/User';
import { useNavigate } from 'react-router-dom';

const RegisterSchema = Yup.object({
    username: Yup.string()
        .required('Required')
        .min(4, 'Must be at least 4 characters'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .required('Required')
        .min(6, 'Must be at least 6 characters'),
});

const RegisterForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleRegister = (values: UserRegisterPropsI) => {
        dispatch(doRegisterThunk(values));
        navigate('/login');
    };

    return (
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Sign Up
            </Typography>
            <Formik
                initialValues={{ username: '', email: '', password: '' }}
                validationSchema={RegisterSchema}
                onSubmit={handleRegister}
            >
                {({ errors, touched }) => (
                    <Form>
                        <Field
                            as={TextField}
                            fullWidth
                            label="Username"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            name="username"
                            error={touched.username && Boolean(errors.username)}
                            helperText={<ErrorMessage name="username" />}
                        />
                        <Field
                            as={TextField}
                            fullWidth
                            label="Email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            name="email"
                            error={touched.email && Boolean(errors.email)}
                            helperText={<ErrorMessage name="email" />}
                        />
                        <Field
                            as={TextField}
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            name="password"
                            error={touched.password && Boolean(errors.password)}
                            helperText={<ErrorMessage name="password" />}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                backgroundColor: '#4caf50',
                                color: 'white',
                                mt: 2, mb: 2,
                                '&:hover': {
                                    backgroundColor: '#2b752f',
                                },
                            }}
                        >
                            Register
                        </Button>
                        <Typography variant="body2" align="center">
                            Already have an account?{' '}
                            <Link href="/login" underline="hover" sx={{
                                color: "#4caf50",
                                '&:hover': {
                                    textDecoration: 'underline',
                                    color: '#2b752f',
                                },
                            }}
                            >
                                Login
                            </Link>
                        </Typography>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default RegisterForm;