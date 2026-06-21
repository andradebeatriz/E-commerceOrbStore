import {
  ADMIN_SUMMARY_REQUEST,
  ADMIN_SUMMARY_SUCCESS,
  ADMIN_SUMMARY_FAIL,
} from '../constants/userConstants';

// Reducer das estatísticas do dashboard administrativo
export const adminSummaryReducer = (state = { summary: {} }, action) => {
  switch (action.type) {
    case ADMIN_SUMMARY_REQUEST:
      return { ...state, loading: true };
    case ADMIN_SUMMARY_SUCCESS:
      return { loading: false, summary: action.payload };
    case ADMIN_SUMMARY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
