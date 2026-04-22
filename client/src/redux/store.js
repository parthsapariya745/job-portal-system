import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobsReducer from './slices/jobsSlice';
import jobseekerReducer from './slices/jobseeker/jobseekerSlice';
import companyReducer from './slices/company/companySlice';
import supportCategoryReducer from './slices/supportCategorySlice';
import supportServiceReducer from './slices/supportServiceSlice';
import supportOrganizationReducer from './slices/supportOrganizationSlice';
import supportRequestReducer from './slices/supportRequestSlice';
import workOpportunityReducer from './slices/workOpportunitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    jobseeker: jobseekerReducer,
    company: companyReducer,
    supportCategory: supportCategoryReducer,
    supportService: supportServiceReducer,
    supportOrganization: supportOrganizationReducer,
    supportRequest: supportRequestReducer,
    workOpportunities: workOpportunityReducer,
  },
});
