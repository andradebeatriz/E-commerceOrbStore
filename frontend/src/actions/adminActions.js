import axios from 'axios';
import API_URL from '../config/api';
import {
  ADMIN_SUMMARY_REQUEST,
  ADMIN_SUMMARY_SUCCESS,
  ADMIN_SUMMARY_FAIL,
} from '../constants/userConstants';

// Busca as estatísticas gerais para o dashboard administrativo
export const getDashboardSummary = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ADMIN_SUMMARY_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/admin/summary`, config);

    dispatch({ type: ADMIN_SUMMARY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADMIN_SUMMARY_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
