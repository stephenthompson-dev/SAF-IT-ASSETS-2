// validationSchemas.js

import * as Yup from 'yup';

//#region User
export const createUserSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password1: Yup.string().required('Password is required'),
  password2: Yup.string()
    .oneOf([Yup.ref('password1'), null], 'Passwords must match')
    .required('Confirm password is required'),
  is_superuser: Yup.boolean(),
});

export const updateUserSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password1: Yup.string(),
  password2: Yup.string().oneOf([Yup.ref('password1'), null], 'Passwords must match'),
  is_superuser: Yup.boolean(),
});
//#endregion

//#region Asset
export const createAssetSchema = Yup.object().shape({
  asset_name: Yup.string().required('Asset name is required'),
  purchase_date: Yup.date().required('Purchase date is required'),
  category: Yup.number().required('Category is required'),
});

export const updateAssetSchema = Yup.object().shape({
  asset_name: Yup.string().required('Asset name is required'),
  purchase_date: Yup.date().required('Purchase date is required'),
  category: Yup.number().required('Category is required'),
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
  for_date: Yup.date().required('For Date is required'),
  end_date: Yup.date().when('further_notice', {
    is: false,
    then: Yup.date().required('End Date is required when Further Notice is not checked'),
    otherwise: Yup.date().nullable(),
  }),
  further_notice: Yup.boolean(),
});

export const updateRequestSchema = Yup.object().shape({
  asset: Yup.number().required('Asset is required'),
  for_date: Yup.date().required('For Date is required'),
  end_date: Yup.date().when('further_notice', {
    is: false,
    then: Yup.date().required('End Date is required when Further Notice is not checked'),
    otherwise: Yup.date().nullable(),
  }),
  further_notice: Yup.boolean(),
  approved: Yup.boolean(),
  approved_date: Yup.date().nullable(),
  approved_by: Yup.number().nullable(),
});

//#endregion