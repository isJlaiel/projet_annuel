import axios, { AxiosInstance } from 'axios'

export default class APIService {
    private static instance: AxiosInstance;

    private constructor(){}
    static getInstance() : AxiosInstance{
        if (!APIService.instance) {
            APIService.instance = axios.create({
                baseURL: "http://localhost:3000",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            APIService.instance.interceptors.response.use(
                response => response,
                error => {
                    console.error("API call fail : ", error);
                    throw error;
                }
            );

        }
        return APIService.instance ;

    }

    static async fetchFeatureModel() {
        try {
           return  (await APIService.getInstance().get("/features")) ;
        } catch (error) {
            console.error("Error fetch FeatureModel data: ", error);
            throw error; 
        }
    }

    static async configureFeatureModel(FeatureModelData : any ){
        try {
            const response=  await APIService.getInstance().put("/features/configure",FeatureModelData)
            return response.data;
        } catch (error) {
            console.error("Error from configure FeatureModel: ", error);
            throw error;
        }
    }

    static async getFilesTree(){
        try {
            return (await APIService.getInstance().get("/features/files")) ;
        } catch (error) {
            console.error("Error fetching files: ", error);
            throw error;
        }
    }

    static async downloadFile(filePath: string){
        try {
            const path = encodeURIComponent(filePath);
            return await APIService.getInstance().get(`/download/${path}`) ;  
        } catch (error) {
            console.error("Error downloading file: ", error);
            throw error;
        }
    }

    static async deleteFile(itemId: string){
        try {
            return (await APIService.getInstance().delete(`/features/files/${itemId}`)) ;
        } catch (error) {
            console.error("Error deleting file: ", error);
            throw error;
        }
    }

}