import axios from "axios";
import router from "@/router";

const ksbTechApi: any = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

ksbTechApi.interceptors.response.use(
  function (response: any) {
    return response;
  },
  async function (error: { response: any }) {
   


    // if (error.response.data.message == "Unauthenticated.") {
    //   await router.push("/auth/login")
    // }

    if (error.response.data.code == 100) {
      return Promise.reject(error);
    }

    if (
      error.response.data.code == 101 &&
      error.response.data.message ===
        "Access restricted. Second-factor authentication is required."
    ) {
      await router.push("/authentication/verify-two-fa");
    } 
    
    else {
      if (
        error.response.data.code == 105 ||
        error.response.data.message === "Code is invalid."
      ) {
        return Promise.reject(error);
      } 
      
      else {
        return Promise.reject(error);
      }
    }
  }
);

export default ksbTechApi;
