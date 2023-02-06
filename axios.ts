import axios from 'axios'

const ksbTechApi:any = axios.create({
    baseURL:"https://test.ksbtech.com.ng/api"
})

export default ksbTechApi
