// validationSchemas.js

import * as Yup from 'yup';

//#region User
export const createUserSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters long')
    .max(50, 'Username cannot exceed 50 characters')
    .matches(/^[a-zA-Z0-9_]*$/, 'Username can only contain letters, numbers, and underscores'),
  first_name: Yup.string()
    .required('First name is required')
    .max(50, 'First name must be at most 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'First name can only contain letters and spaces'),
  last_name: Yup.string()
    .required('Last name is required')
    .max(50, 'Last name must be at most 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required')
    .test('not-disposable-email', 'Disposable email addresses are not allowed', value => {
      const disposableDomains = ['mailinator.com', 'tempmail.com', 'example.com'];
      const emailDomain = value.split('@')[1];
      return !disposableDomains.includes(emailDomain);
    }),
  password1: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  password2: Yup.string()
    .oneOf([Yup.ref('password1'), null], 'Passwords must match')
    .required('Confirm password is required'),
  is_staff: Yup.boolean(),
});

export const updateUserSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters long')
    .max(50, 'Username cannot exceed 50 characters')
    .matches(/^[a-zA-Z0-9_]*$/, 'Username can only contain letters, numbers, and underscores'),
  first_name: Yup.string()
    .required('First name is required')
    .max(50, 'First name must be at most 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'First name can only contain letters and spaces'),
  last_name: Yup.string()
    .required('Last name is required')
    .max(50, 'Last name must be at most 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required')
    .test('not-disposable-email', 'Disposable email addresses are not allowed', value => {
      const disposableDomains = ['mailinator.com', 'tempmail.com', 'example.com'];
      const emailDomain = value.split('@')[1];
      return !disposableDomains.includes(emailDomain);
    }),
  password1: Yup.string(),
  password2: Yup.string().oneOf([Yup.ref('password1'), null], 'Passwords must match'),
  is_staff: Yup.boolean(),
});
//#endregion

//#region Asset
export const createAssetSchema = Yup.object().shape({
  asset_name: Yup.string().required('Asset name is required'),
  purchase_date: Yup.date()
    .required('Purchase date is required')
    .max(new Date(), 'Purchase date cannot be in the future'),
  category: Yup.number()
    .required('Category is required')
    .test('is-valid-category', 'Invalid category', async (value) => {
      const validCategories = await fetchCategoriesFromAPI(); // Hypothetical API call
      return validCategories.includes(value);
    }),
});

export const updateAssetSchema = Yup.object().shape({
  asset_name: Yup.string().required('Asset name is required'),
  purchase_date: Yup.date()
    .required('Purchase date is required')
    .max(new Date(), 'Purchase date cannot be in the future'),
  category: Yup.number()
    .required('Category is required')
    .test('is-valid-category', 'Invalid category', async (value) => {
      const validCategories = await fetchCategoriesFromAPI(); // Hypothetical API call
      return validCategories.includes(value);
    }),
});
//#endregion

//#region Category

export const createCategorySchema = Yup.object().shape({
  category_name: Yup.string()
    .required('Category name is required')
    .max(100, 'Category name must be at most 100 characters'),
});

export const updateCategorySchema = Yup.object().shape({
  category_name: Yup.string()
    .required('Category name is required')
    .max(100, 'Category name must be at most 100 characters'),
});
//#endregion

//#region Request

export const createRequestSchema = Yup.object().shape({
  asset: Yup.number().required('Asset is required'),
  for_date: Yup.date()
    .required('For Date is required')
    .min(new Date(), 'For Date must be in the future'),
  end_date: Yup.date().when('further_notice', {
    is: false,
    then: Yup.date().required('End Date is required when Further Notice is not checked'),
    otherwise: Yup.date().nullable(),
  }),
  further_notice: Yup.boolean(),
});

export const updateRequestSchema = Yup.object().shape({
  asset: Yup.number().required('Asset is required'),
  for_date: Yup.date()
    .required('For Date is required')
    .min(new Date(), 'For Date must be in the future'),
  end_date: Yup.date().when('further_notice', {
    is: false,
    then: Yup.date().required('End Date is required when Further Notice is not checked'),
    otherwise: Yup.date().nullable(),
  }),
  further_notice: Yup.boolean(),
  approved: Yup.boolean(),
  approved_date: Yup.date().nullable(),
  approved_by: Yup.number()
    .nullable()
    .test('is-valid-user', 'Invalid user', async (value) => {
      if (value === null) return true; // Allow nullable value
      const validUsers = await fetchValidUsersFromAPI(); // Hypothetical API call
      return validUsers.includes(value);
    }),
});

//#endregion
