import http from "@/service/http";
import * as yup from "yup";

export default class RoleService {
    // Static API endpoints
    static api = "Permission";

    static StrUnitSchema = yup.object().shape({
        roleName: yup.string().required("Tên vai trò là bắt buộc"),
    });

    static async getAll(params = {}) {
        return http.get(this.api + '/get-roles', { params });
    }
    static async getById(id) {
        return http.get(`${this.api}/${id}`)
    }

    static async save(data) {
        try {
            await this.StrUnitSchema.validate(data, { abortEarly: false });
            if (data.id) {
                return await http.put(`${this.api}/update-role`, data);
            } else {
                return await http.post(this.api + '/create-role', data);
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


