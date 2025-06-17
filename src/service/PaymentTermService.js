import http from "@/service/http";
import * as yup from "yup";

export default class PaymentTermService {
    // Static API endpoints
    static api = "PaymentTerm";


    static ValidateSchema = yup.object().shape({
        paymentTermName: yup.string().required("Tên điều khoản thanh toán là  bắt buộc"),
    });

    static async getAll(params = {}) {
        return http.get(this.api, { params });
    }
    static async getById(id) {
        return http.get(`${this.api}/${id}`)
    }

    static async save(data) {
        try {
            await this.ValidateSchema.validate(data, { abortEarly: false });
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


