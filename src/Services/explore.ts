import {api} from './baseApi';

export const getData = async () => {
  try {
    const response = await api.get(`/photos/1`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
