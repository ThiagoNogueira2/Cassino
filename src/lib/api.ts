const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const getHeaders = (includeAuth: boolean = false) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (includeAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const api = {
  async get(endpoint: string, withAuth: boolean = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: getHeaders(withAuth),
      });

      if (!response.ok) {
        const error = await response.json();
        throw { status: response.status, data: error };
      }

      return await response.json();
    } catch (error) {
      console.error(`API GET error: ${endpoint}`, error);
      throw error;
    }
  },

  async post(endpoint: string, data: any, withAuth: boolean = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: getHeaders(withAuth),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw { status: response.status, data: error };
      }

      return await response.json();
    } catch (error) {
      console.error(`API POST error: ${endpoint}`, error);
      throw error;
    }
  },

  async put(endpoint: string, data: any, withAuth: boolean = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: getHeaders(withAuth),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw { status: response.status, data: error };
      }

      return await response.json();
    } catch (error) {
      console.error(`API PUT error: ${endpoint}`, error);
      throw error;
    }
  },

  async patch(endpoint: string, data: any, withAuth: boolean = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PATCH",
        headers: getHeaders(withAuth),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw { status: response.status, data: error };
      }

      return await response.json();
    } catch (error) {
      console.error(`API PATCH error: ${endpoint}`, error);
      throw error;
    }
  },

  async delete(endpoint: string, withAuth: boolean = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: getHeaders(withAuth),
      });

      if (!response.ok) {
        const error = await response.json();
        throw { status: response.status, data: error };
      }

      return await response.json();
    } catch (error) {
      console.error(`API DELETE error: ${endpoint}`, error);
      throw error;
    }
  },
};

export const wallet = {
  balance: () => api.get("/wallet/balance", true),
  deposit: (amount: number) => api.post("/wallet/deposit", { amount }, true),
  depositStatus: (id: string) => api.get(`/wallet/deposit/${id}/status`, true),
  withdraw: (body: { amount: number; pix_key_type: string; pix_key: string }) =>
    api.post("/wallet/withdraw", body, true),
  withdrawStatus: (id: string) =>
    api.get(`/wallet/withdraw/${id}/status`, true),
};
