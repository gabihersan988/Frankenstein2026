import { useEffect, useState } from 'react';
import { getProfileService } from '../../services/profileServices';

export const useProfile = (id) => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!id || id === 'undefined') {
            setProfile({});
            setLoading(false);
            return;
        }

        const loadProfile = async () => {
            try {
                setLoading(true);
                const data = await getProfileService(id);
                setProfile(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [id]);
    const updateProfile = (profile) => {
        setProfile(profile);
    };
    return { profile, loading, error, updateProfile, getProfileService };
};
