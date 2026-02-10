import * as Yup from 'yup';

/**
 * User Form Validation Schema
 */
export const userSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .trim(),

    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required')
        .trim()
        .lowercase(),

    password: Yup.string()
        .when('$isEdit', {
            is: false,
            then: (schema) => schema
                .required('Password is required')
                .min(6, 'Password must be at least 6 characters'),
            otherwise: (schema) => schema
                .min(6, 'Password must be at least 6 characters')
                .notRequired(),
        }),

    role: Yup.string()
        .required('Role is required')
        .oneOf(['admin', 'manager', 'user'], 'Invalid role'),

    status: Yup.string()
        .required('Status is required')
        .oneOf(['active', 'inactive', 'suspended'], 'Invalid status'),

    phone: Yup.string()
        .nullable()
        .trim(),
    company: Yup.string().nullable().trim(),
    website: Yup.string().nullable().trim(),
    taxId: Yup.string().nullable().trim(),
    whatsapp: Yup.string().nullable().trim(),
    preferredCommunication: Yup.string().oneOf(['email', 'whatsapp', 'phone', 'slack']).nullable(),
    address: Yup.object({
        street: Yup.string().nullable().trim(),
        city: Yup.string().nullable().trim(),
        state: Yup.string().nullable().trim(),
        zip: Yup.string().nullable().trim(),
        country: Yup.string().nullable().trim(),
    }).nullable(),
    technicalDetails: Yup.object({
        domainName: Yup.string().nullable().trim(),
        serverIP: Yup.string().nullable().trim(),
        serverUser: Yup.string().nullable().trim(),
        serverPassword: Yup.string().nullable(),
        serverPort: Yup.string().nullable().trim(),
    }).nullable(),
});

/**
 * Initial values for create user form
 */
export const userInitialValues = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
    phone: '',
    company: '',
    website: '',
    taxId: '',
    whatsapp: '',
    preferredCommunication: 'email',
    address: {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
    },
    technicalDetails: {
        domainName: '',
        serverIP: '',
        serverUser: '',
        serverPassword: '',
        serverPort: '22',
    }
};

/**
 * Get initial values for edit user form
 */
export const getUserEditInitialValues = (user) => ({
    name: user?.name || '',
    email: user?.email || '',
    password: '', // Leave empty for edit
    role: user?.role || 'user',
    status: user?.status || 'active',
    phone: user?.phone || '',
    company: user?.company || '',
    website: user?.website || '',
    taxId: user?.taxId || '',
    whatsapp: user?.whatsapp || '',
    preferredCommunication: user?.preferredCommunication || 'email',
    address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zip: user?.address?.zip || '',
        country: user?.address?.country || '',
    },
    technicalDetails: {
        domainName: user?.technicalDetails?.domainName || '',
        serverIP: user?.technicalDetails?.serverIP || '',
        serverUser: user?.technicalDetails?.serverUser || '',
        serverPassword: user?.technicalDetails?.serverPassword || '',
        serverPort: user?.technicalDetails?.serverPort || '22',
    }
});

