import * as yup from "yup";
import http from "./http";

export default class ItemGroupService {
    // Static API endpoints
    static api = "ItemGroup";

    static schema = yup.object({
        itemGroupCode: yup.string().required("Vui lòng nhập mã nhóm hàng hóa"),
        itemGroupName: yup.string().required("Vui lòng nhập tên nhóm hàng hóa"),
    });

    static async getAll(params = {}) {
        return http.get(this.api, { params });
    }
    static async getById(id) {
        return http.get(`${this.api}/${id}`);
    }

    static async save(data) {
        try {
            await this.schema.validate(data, { abortEarly: false });
            if (data.id) {
                return await http.put(`${this.api}/${data.id}`, data);
            } else {
                return await http.post(this.api, data);
            }
        } catch (err) {
            if (err.name === "ValidationError") {
                const formatted = { isValidate: true };
                err.inner.forEach((e) => {
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
