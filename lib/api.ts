import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

/**
 * Universal GET helper function.
 * @param url Endpoint route
 * @param params Param queries
 * @returns result
 */
export const get = <T extends any>(route: string, params?: Object): Promise<T> => {
  return new Promise((resolve, reject) => {
    API.get(route, { params })
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
};

/**
 * Universal POST helper function.
 * @param url Endpoint route
 * @param payload Body payload
 * @returns result
 */
export const post = <T extends any>(route: string, payload?: any): Promise<T> => {
  return new Promise((resolve, reject) => {
    API.post(route, payload)
      .then(response => resolve(response.data))
      .catch(err => reject(err));
  });
};