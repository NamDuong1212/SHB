import http from "@/service/http";
import * as yup from "yup";
;

export default class ItemAttributeService {
    // Static API endpoints
    static API_URL = 'ItemAttribute'
    static StrUnitSchema = yup.object().shape({
        itemAttributeName: yup.string().required("Tên thuộc tính là bắt buộc"),
    });

    static async getAll(params = {}) {
        return http.get(`${this.API_URL}`, { params });
    }

    static async getById(id) {
        return http.get(`${this.API_URL}/${id}`);
    }

    static async save(data) {
        try {
            await this.StrUnitSchema.validate(data, { abortEarly: false });
            if (data.id) {
                return await http.put(`${this.API_URL}/${data.id}`, data);
            } else {
                return await http.post(`${this.API_URL}`, data);
            }
        } catch (err) {
            if (err.name === 'ValidationError') {
                const formatted = {
                    isValidate: true
                };
                err.inner.forEach(e => {
                    if (!formatted[e.path]) {
                        formatted[e.path] = e.message;
                    }
                });
                throw formatted;
            }
            throw err;
        }
    }

}


