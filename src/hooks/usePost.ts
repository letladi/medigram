import { useState } from 'react';
import axios from 'axios';

interface PostState<T> {
  data: T | null;
  isLoading: boolean;
  error: any | null;
}

export function usePost<T>(url: string) {
  const [state, setState] = useState<PostState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const postData = async (formData: FormData) => {
    setState({ data: null, isLoading: true, error: null });

    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setState({ data: response.data, isLoading: false, error: null });
      return response.data;
    } catch (error: any) {
      setState({ data: null, isLoading: false, error: error });
      throw error;
    }
  };

  return { ...state, postData };
}
