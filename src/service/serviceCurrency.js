import http from "@/service/http";
import * as yup from "yup";

export default class serviceCurrency {
    // Static API endpoints
    static api = "Currency";

    static ValidateSchema = yup.object().shape({
        unitCode: yup.string().required("Mã đơn vị tính là bắt buộc"),
        unitName: yup.string().required("Tên đơn vị tính là bắt buộc"),
    });

    static async getAll(params = {}) {
        return http.get(this.api, { params });
    }
    static async getById(id) {
        return http.get(`${this.api}/${id}`)
    }

    static async save(data) {
        try {
            // await this.ValidateSchema.validate(data, { abortEarly: false });
            if (data.id) {
                return await http.put(`${this.api}/${data.id}`, data);
            } else {
                return await http.post(this.api, data);
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


