import React from 'react';
import { TextField, Button, Typography, Paper, Link } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { doLoginThunk } from '../store/slices/userSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserLoginPropsI } from '../types/User';
import { useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object({
    username: Yup.string()
        .required('Required')
        .min(4, 'Must be at least 4 characters'),
    password: Yup.string()
        .required('Required')
        .min(6, 'Must be at least 6 characters'),
});

const LoginForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogin = (values: UserLoginPropsI) => {
        dispatch(doLoginThunk(values));
        navigate('/');
    };

    return (
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Login
            </Typography>
            <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
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
                            color="primary"
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
                            Login
                        </Button>
                        <Typography variant="body2" align="center">
                            Don’t have an account?{' '}
                            <Link href="/register" underline="hover" sx={{
                                color: "#4caf50",
                                '&:hover': {
                                    textDecoration: 'underline',
                                    color: '#2b752f',
                                },
                            }}
                            >
                                Sign up
                            </Link>
                        </Typography>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
};

export default LoginForm;