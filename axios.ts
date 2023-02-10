import axios from "axios";
import router from "@/router";

const ksbTechApi: any = axios.create({
    baseURL: "https://test.ksbtech.com.ng/api",
});

ksbTechApi.interceptors.response.use(
    function (response: any) {
        return response
    },
    async function (error: { response: any }) {

        if (
            error.response.data.code == 101 &&
            error.response.data.message ===
            "Access restricted. Second-factor authentication is required."
        ) {
            await router.push("/authentication/verify-two-fa");
        } else {
            if (error.response.data.code == 105 ||
                error.response.data.message ===
                "Code is invalid.") {
                return Promise.reject(error);
            }
            else {
                return Promise.reject(error);
            }
        }

    }

);

export default ksbTechApi;
