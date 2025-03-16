import { Paper, Typography, Box, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useRequest } from "ahooks";
import { getUser } from "../api/userActions";
import { UserI } from "../types/User";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import { doDeleteThunk, doUpdateThunk } from "../store/slices/userSlice";

const UpdateSchema = Yup.object({
    username: Yup.string()
        .min(4, 'Must be at least 4 characters'),
    email: Yup.string()
        .email('Invalid email format'),
    password: Yup.string()
        .min(6, 'Must be at least 6 characters'),
});

const UserProfile: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const currentUserId = useSelector((state: RootState) => state.user.userId);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<UserI>();

    const { loading, error, run: fetchUserAction } = useRequest(() => getUser({ id: Number(currentUserId) }), {
        manual: true,
        onSuccess: (data) => {
            setUser(data);
        },
    });

    useEffect(() => {
        fetchUserAction();
    }, [fetchUserAction]);


    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);

    const handleDeleteAccount = async () => {
        if (!currentUserId) return;

        await dispatch(doDeleteThunk(Number(currentUserId)));
        navigate('/login');
    };

    const handleSaveChanges = async (values: { username?: string, email?: string, password?: string }) => {
        const filteredValues = Object.fromEntries(
            Object.entries(values).filter(([_, value]) => value?.trim() !== "")
        );

        if (Object.keys(filteredValues).length === 0) {
            console.warn("Немає змін для оновлення");
            return;
        }

        await dispatch(doUpdateThunk({ id: Number(currentUserId), userData: filteredValues }));
        fetchUserAction();
    };

    return (
        <Box sx={{ padding: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ width: '45%' }}>
                <Paper sx={{ padding: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        User Info
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        <strong>Username:</strong> {username}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        <strong>Email:</strong> {email}
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteAccount}
                        sx={{ mt: 2 }}
                    >
                        Delete Account
                    </Button>
                </Paper>
            </Box>

            <Box sx={{ width: '45%' }}>
                <Paper sx={{ padding: 4 }}>
                    <Typography variant="h4" textAlign="center" gutterBottom>
                        {isEditing ? 'Edit Your Profile' : 'Your Profile'}
                    </Typography>
                    <Formik
                        initialValues={{ username: '', email: '', password: '' }}
                        validationSchema={UpdateSchema}
                        onSubmit={handleSaveChanges}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    label="Username"
                                    type="text"
                                    margin="normal"
                                    name="username"
                                    disabled={!isEditing}
                                    error={touched.username && Boolean(errors.username)}
                                    helperText={<ErrorMessage name="username" />}
                                />
                                <Field
                                    as={TextField}
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    margin="normal"
                                    name="email"
                                    disabled={!isEditing}
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={<ErrorMessage name="email" />}
                                />
                                <Field
                                    as={TextField}
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    margin="normal"
                                    name="password"
                                    disabled={!isEditing}
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={<ErrorMessage name="password" />}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                                    {isEditing ? (
                                        <>
                                            <Button type="submit" variant="contained" color="primary">
                                                Save Changes
                                            </Button>
                                            <Button variant="outlined" color="primary" onClick={() => setIsEditing(false)}>
                                                Exit
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="outlined" color="primary" onClick={() => setIsEditing(true)}>
                                            Edit Info
                                        </Button>
                                    )}
                                </Box>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Box>
        </Box>
    );
};

export default UserProfile;