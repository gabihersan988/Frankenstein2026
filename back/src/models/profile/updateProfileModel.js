import getConnection from '../../db/getConnection.js';

const updateProfileModel = async (
    profile_name,
    profile_lastname,
    profile_username,
    birthdate,
    avatar,
    profile_role,
    company_name,
    userId
) => {
    const connection = await getConnection();

    let formattedBirthdate = null;
    if (birthdate) {
        if (birthdate instanceof Date && !isNaN(birthdate.getTime())) {
            formattedBirthdate = birthdate.toISOString().split('T')[0];
        } else if (typeof birthdate === 'string' && birthdate.trim() !== '') {
            const parsed = new Date(birthdate);
            if (!isNaN(parsed.getTime())) {
                formattedBirthdate = parsed.toISOString().split('T')[0];
            }
        }
    }

    const [existing] = await connection.query(
        `SELECT profile_id FROM profile WHERE register_id = ?`,
        [userId]
    );

    if (existing.length === 0) {
        await connection.query(
            `INSERT INTO profile (profile_name, profile_lastname, profile_username, birthdate, avatar, profile_role, register_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                profile_name,
                profile_lastname,
                profile_username || null,
                formattedBirthdate,
                avatar || null,
                profile_role || 'student',
                userId,
            ]
        );
    } else {
        if (!avatar) {
            await connection.query(
                `UPDATE profile SET profile_name = ?, profile_lastname = ?, profile_username = ?, birthdate = ?, profile_role = ?, modified_at = CURRENT_TIMESTAMP WHERE register_id = ?`,
                [
                    profile_name,
                    profile_lastname,
                    profile_username || null,
                    formattedBirthdate,
                    profile_role || 'student',
                    userId,
                ]
            );
        } else {
            await connection.query(
                `UPDATE profile SET profile_name = ?, profile_lastname = ?, profile_username = ?, birthdate = ?, avatar = ?, profile_role = ?, modified_at = CURRENT_TIMESTAMP WHERE register_id = ?`,
                [
                    profile_name,
                    profile_lastname,
                    profile_username || null,
                    formattedBirthdate,
                    avatar,
                    profile_role || 'student',
                    userId,
                ]
            );
        }
    }

    if (profile_role === 'company' && company_name) {
        const [existingCompany] = await connection.query(
            `SELECT company_id FROM companies WHERE register_id = ?`,
            [userId]
        );
        if (existingCompany.length > 0) {
            await connection.query(
                `UPDATE companies SET company_name = ? WHERE register_id = ?`,
                [company_name, userId]
            );
        } else {
            await connection.query(
                `INSERT INTO companies (company_name, register_id) VALUES (?, ?)`,
                [company_name, userId]
            );
        }
    }

    return true;
};
export { updateProfileModel };

