import http from "@/service/http";
import * as yup from "yup";

export default class SampleWorkService {
    // Static API endpoints
    static api = "SampleWork";
    static formData = new FormData();

    static schema = yup.object({
        assetId: yup.string().required("Vui lòng chọn tài sản"),
        assetMaintenanceId: yup.string().required("Vui lòng chọn mã bảo trì"),
    });

    static async getAll(params = {}) {
        return http.get(this.api, { params });
    }

    static async getAllAsset(params = {}) {
        return http.get('Asset', { params });
    }

    static async getById(id) {
        return http.get(`${this.api}/${id}`);
    }


    static async save(data) {
        try {
            await this.schema.validate(data, { abortEarly: false });
            if (data.detailWorkLine.length) {
                let indexFile = -1;
                data.detailWorkLine.forEach((line) => {
                    if (line.file) {
                        this.formData.append('Files', line.file);
                        delete line.file;
                        indexFile += 1;
                        line.imageIndex = indexFile;
                    } else {
                        line.imageIndex = -1;
                    }
                });
            }
            this.formData.append('Model', JSON.stringify(data));
            if (data.id) {
                return await http.put(`${this.api}/${data.id}`, this.formData);
            } else {
                return await http.post(this.api, this.formData);
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
        } finally {
            this.formData.delete('Files');
            this.formData.delete('Model');
        }
    }

    static async delete(id) {
        return http.delete(`${this.api}/${id}`);
    }

    static async getOrgLevels(Page = 1, PageSize = 10, Search = "") {
        return http.get(`Organizational?Page=${Page}&${PageSize}&Search=${Search}`);
    }
}
