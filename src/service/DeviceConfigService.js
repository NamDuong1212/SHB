import http from "@/service/http";
import { object, string } from "yup";

class DeviceConfigService {
    static API_URL = "DeviceConfig";
    static statusOptions = [
        { label: "Tất cả", value: null },
        { label: "Hoạt động", value: true },
        { label: "Không hoạt động", value: false },
    ];

    // API calls
    static async getAll(params = {}) {
        return http.get(this.API_URL + "", { params });
    }
    // Format dữ liệu khi chỉnh sửa loại tài sản
    static formatAssetTypeForEdit(row) {
        return row;
    }

    // Xác nhận xóa
    static getDeleteConfirmation() {
        return {
            message: "Bạn có chắc chắn muốn xóa thông số hoạt động này?",
            endpoint: `${this.API_URL}`,
        };
    }

    static schema = object({
        code: string().required("Vui lòng nhập mã thông số"),
        name: string().required("Vui lòng nhập tên thông số"),
        unit: string().required("Vui lòng nhập đơn vị"),
    });

    // Validate form với xử lý lỗi
    static async validateForm(schema, formData) {
        try {
            // await schema.validate(formData, { abortEarly: false });
            return { isValid: true, errors: {} };
        } catch (err) {
            const errors = {};
            if (err.inner && err.inner.length > 0) {
                err.inner.forEach((error) => {
                    errors[error.path] = error.message;
                });
            }
            return { isValid: false, errors };
        }
    }
    static async save(data) {
        try {
            const res = data.id ? await http.put(`${this.API_URL}/${data.id}`, data) : await http.post(`${this.API_URL}`, data);
            return res
        } catch (error) {
        }
    }
    // Tạo update and create
    static async create(data) {
        return http.post(`${this.API_URL}`, data);
    }

    static async update(id, data) {
        return http.put(`${this.API_URL}/${id}`, data);
    }
}

export default DeviceConfigService;
