import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import { getMyUserDataService } from '../services';
import { toast } from 'react-hot-toast';

import { forgotPassword } from '../services/userService';

//* Crear contexto global ---------------------------------------------

export const AuthContext = createContext(); // objeto del contexto

export const AuthProviderComponent = ({ children }) => {
    const savedToken = localStorage.getItem('token');
    const initialToken = savedToken && savedToken !== 'null' && savedToken !== 'undefined' ? savedToken : '';

    // inicializa token
    const [token, setToken] = useState(initialToken);

    // inicializa user
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token && token !== 'null' && token !== 'undefined') {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const authFP = async (email) => {
        try {
            const message = await forgotPassword(email);
            toast.success(message);
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Carga data de user, setear user con su info
    useEffect(() => {
        const getUserData = async () => {
            try {
                const data = await getMyUserDataService({ token });
                setUser(data);
            } catch (error) {
                logout();
            }
        };
        if (token && token !== 'null' && token !== 'undefined') {
            getUserData();
        } else {
            setUser(null);
        }
    }, [token]);

    // login
    const login = (newToken) => {
        setToken(newToken);
    };

    // logout
    const logout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('token');
        toast.success('Usuario deslogueado');
    };

    //exportamos al Context: token, user, login, logout
    return (
        <AuthContext.Provider
            value={{ token, user, setUser, login, logout, authFP }}
        >
            {children}
        </AuthContext.Provider>
    );
};
AuthProviderComponent.propTypes = {
    children: PropTypes.node,
};
