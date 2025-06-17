import http from "@/service/http";
import * as yup from "yup";

export default class UserSerivce {
    // Static API endpoints
    static api = "User";

    static ValidateSchema = yup.object().shape({
        userName: yup.string().required("Trường tên đăng nhập là bắt buộc"),
        email: yup.string().required("Trường email là bắt buộc"),
        organizationalStructureId: yup.string().required("Vui lòng chọn đơn vị"),
        roleId: yup.string().required("Vui lòng chọn vai trò"),
    });

    static async getAll(params = {}) {
        return http.get(this.api, { params });
    }



    static async save(data) {
        try {
            await this.ValidateSchema.validate(data, { abortEarly: false });
            if (data.id) {
                return await http.put(`${this.api}/update-user`, data);
            } else {
                return await http.post(this.api + '/create-user', data);
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


