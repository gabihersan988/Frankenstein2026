import { z } from 'zod';
const profileSchema = z
    .object({
        profile_name: z
            .string()
            .min(1, { message: 'Campo obligatorio' })
            .min(3, 'Mínimo 3 caracteres')
            .max(15, 'Máximo 15 caracteres'),
        profile_lastname: z
            .string()
            .min(1, { message: 'Campo obligatorio' })
            .min(3, 'Mínimo 3 caracteres')
            .max(30, 'Máximo 30 caracteres'),
        profile_username: z
            .string()
            .min(3, 'Mínimo 3 caracteres')
            .max(15, 'Máximo 15 caracteres')
            .optional()
            .or(z.literal(''))
            .nullable(),
        profile_role: z
            .enum(['expert', 'company', 'student'])
            .optional()
            .default('student'),
        birthdate: z.union([z.coerce.date(), z.literal('')]).optional().nullable(),
        company_name: z.string().optional().nullable(),
    })
    .refine(
        (data) =>
            data.profile_role !== 'company' ||
            (data.profile_role === 'company' && data.company_name),
        {
            message:
                'El nombre de la empresa es obligatorio cuando el rol es empresa',
            path: ['company_name'],
        }
    );

export default profileSchema;
