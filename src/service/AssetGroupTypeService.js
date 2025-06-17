import http from "@/service/http";
import * as yup from "yup";

class AssetGroupService {
    static statusOptions = [
        { label: "Tất cả", value: null },
        { label: "Hoạt động", value: true },
        { label: "Không hoạt động", value: false },
    ];
    // Màu sắc trạng thái
    static URL_API_TYPE = 'AssetType';
    static URL_API_GROUP = 'AssetGroup';
    // API calls
    static async getAllType(params = {}) {
        return http.get(this.URL_API_TYPE, { params });
    }
    static async getAllGroup(params = {}) {
        return http.get(this.URL_API_GROUP, { params });
    }
    // Format dữ liệu khi chỉnh sửa loại tài sản
    static formatAssetTypeForEdit(row) {
        const editData = { ...row };
        editData.deviceConfigIds =
            row.assetTypeDeviceConfig?.map((item) => item.deviceConfigId) || [];
        editData.assetTypeLines =
            row.assetTypeLines
                ?.sort((a, b) => a.lineIndex - b.lineIndex)
                .map((item) => ({
                    ...item,
                    status: "U",
                    options: item.options?.map((option) => ({
                        ...option,
                        status: "U",
                    })),
                })) || [];
        return editData;
    }

    // API endpoints cho xóa
    static deleteEndpoints = {
        assetGroup: "AssetGroup",
        assetType: "AssetType",
    };

    // Xác nhận xóa
    static getDeleteConfirmation(isGroup) {
        return {
            message: isGroup
                ? "Bạn có chắc chắn muốn xóa nhóm tài sản này?"
                : "Bạn có chắc chắn muốn xóa loại tài sản này?",
            endpoint: isGroup
                ? this.deleteEndpoints.assetGroup
                : this.deleteEndpoints.assetType,
        };
    }

    // Validation schemas
    static assetGroupSchema = yup.object({
        name: yup.string().required("Vui lòng nhập tên nhóm tài sản"),
    });

    static assetTypeSchema = yup.object({
        name: yup.string().required("Vui lòng nhập tên loại tài sản"),
        assetGroupId: yup.string().required("Vui lòng chọn nhóm tài sản"),
        assetTypeLines: yup
            .array()
            .of(
                yup.object({
                    fieldName: yup.string().required("Vui lòng nhập tên trường"),
                    fieldType: yup.string().required("Vui lòng chọn kiểu trường"),
                    maxLength: yup.number().required("Vui lòng nhập độ dài"),
                    options: yup
                        .array()
                        .test({
                            name: "options-required",
                            test: function (value, context) {
                                const isSelectable = context.parent.isSelectable;
                                if (isSelectable && (!value || value.length === 0)) {
                                    return this.createError({
                                        message:
                                            "Vui lòng thêm ít nhất một lựa chọn cho trường có kiểu chọn",
                                    });
                                }
                                return true;
                            },
                        })
                        .of(
                            yup.object({
                                code: yup.string().required("Vui lòng nhập mã trường"),
                                name: yup.string().required("Vui lòng nhập tên trường"),
                            })
                        ),
                })
            )
            .min(1, "Vui lòng thêm ít nhất 1 trường thông tin"),
    });

    // Validate form với xử lý lỗi
    static async validateForm(schema, formData) {
        try {
            await schema.validate(formData, { abortEarly: false });
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


    static async save(url, data) {
        try {
            const res = data.id ? http.put(url + `/${data.id}`, data) : http.post(url, data)
            return res
        } catch (error) {
        }
    }

    static async getAll(url) {
        try {
            const res = http.get(url)
            return res
        } catch (error) {
        }
    }
}

export default AssetGroupService;
