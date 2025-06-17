import http from "@/service/http";
import * as yup from "yup";

class AssetService {
    static API_URL = "Asset";

    // API calls
    static async getAll(params = {}) {
        return http.get(this.API_URL, { params });
    }

    static async getById(id) {
        return http.get(`${this.API_URL}/${id}`);
    }

    static async getAllOption(url) {
        return http.get(url);
    }

    static getAssetGroup() {
        return http.get(`AssetGroup?isActive=true`);
    }
    static getDetailAssetType(id) {
        return http.get(`AssetType/${id}`);
    }
    // Validation schemas
    static schema = yup.object({
        assetCode: yup.string().required("Vui lòng nhập mã tài sản"),
        assetName: yup.string().required("Vui lòng nhập tên tài sản"),
        // assetSerial: yup.string().required("Vui lòng nhập mã serial"),
        assetGroupId: yup
            .number()
            .required("Vui lòng chọn nhóm tài sản")
            .typeError("Giá trị phải là số"),
        assetTypeId: yup
            .number()
            .required("Vui lòng chọn loại tài sản")
            .typeError("Giá trị phải là số"),
        assetMaintenance: yup.object({
            type: yup.string().required("Vui lòng chọn loại bảo trì"),
            assetMaintenanceLines: yup.array().of(
                yup.object({
                    frequency: yup.string().required("Vui lòng chọn thông số/tần suất"),
                    // startDate: yup
                    //   .date()
                    //   .required("Vui lòng chọn ngày bắt đầu")
                    //   .typeError("Ngày không hợp lệ"),
                    partner: yup.string().required("Vui lòng chọn đối tác"),
                    maintenanceCode: yup.string().required("Vui lòng nhập mã bảo trì"),
                    autoSchedule: yup
                        .number()
                        .required("Vui lòng chọn loại trường")
                        .min(1, "Lịch tự động phải ít nhất là 1")
                        .typeError("Giá trị phải là số"),
                    autoScheduleType: yup
                        .string()
                        .test(
                            "conditional-required",
                            "Vui lòng chọn kiểu lịch tự động",
                            function (value, context) {
                                const { autoSchedule } = context.parent;
                                if (autoSchedule && autoSchedule !== 0 && !value) {
                                    return false;
                                }
                                return true;
                            }
                        ),
                    taskLists: yup
                        .array()
                        .of(
                            yup.object({
                                detailWorkName: yup.string().test(
                                    "required-if-nb",
                                    "Vui lòng nhập tên công việc",
                                    function (value) {
                                        const { partner } = this.options.context;
                                        if (partner === "NB" && !value) {
                                            return false;
                                        }
                                        return true;
                                    }
                                ),
                                orgStrctId: yup
                                    .number()
                                    .test(
                                        "required-if-nb",
                                        "Vui lòng chọn bộ phận",
                                        function (value) {
                                            const { partner } = this.options.context;
                                            if (partner === "NB" && !value) {
                                                return false;
                                            }
                                            return true;
                                        }
                                    )
                            })
                        )
                        .test(
                            "min-if-nb",
                            "Cần ít nhất một công việc",
                            function (value) {
                                const { partner } = this.options.context;
                                if (partner === "NB" && (!value || value.length === 0)) {
                                    return false;
                                }
                                return true;
                            }
                        ),
                    sparePartMaterials: yup
                        .array()
                        .of(
                            yup.object({
                                classify: yup.string().test(
                                    "required-if-nb",
                                    "Vui lòng chọn vật tư",
                                    function (value) {
                                        const { partner } = this.options.context;
                                        if (partner === "NB" && !value) {
                                            return false;
                                        }
                                        return true;
                                    }
                                ),
                                quantity: yup
                                    .number()
                                    .test(
                                        "required-if-nb",
                                        "Vui lòng nhập số lượng",
                                        function (value) {
                                            const { partner } = this.options.context;
                                            if (partner === "NB" && (value === undefined || value === null)) {
                                                return false;
                                            }
                                            return true;
                                        }
                                    )
                                    .test(
                                        "min-if-nb",
                                        "Số lượng phải ít nhất là 1",
                                        function (value) {
                                            const { partner } = this.options.context;
                                            if (partner === "NB" && (value !== undefined && value !== null && value < 1)) {
                                                return false;
                                            }
                                            return true;
                                        }
                                    ),
                                itemId: yup.string().test(
                                    "required-if-nb",
                                    "Vui lòng nhập mã vật tư",
                                    function (value) {
                                        const { partner } = this.options.context;
                                        if (partner === "NB" && !value) {
                                            return false;
                                        }
                                        return true;
                                    }
                                ),

                                unitOfMeasureId: yup
                                    .number()
                                    .test(
                                        "required-if-nb",
                                        "Vui lòng chọn đơn vị tính",
                                        function (value) {
                                            const { partner } = this.options.context;
                                            if (partner === "NB" && (value === undefined || value === null)) {
                                                return false;
                                            }
                                            return true;
                                        }
                                    ),
                                warehouseId: yup.number().test(
                                    "required-if-nb",
                                    "Vui lòng chọn kho",
                                    function (value) {
                                        const { partner } = this.options.context;
                                        if (partner === "NB" && (value === undefined || value === null)) {
                                            return false;
                                        }
                                        return true;
                                    }
                                )
                            })
                        )
                        .test(
                            "min-if-nb",
                            "Cần ít nhất một vật tư",
                            function (value) {
                                const { partner } = this.options.context;
                                if (partner === "NB" && (!value || value.length === 0)) {
                                    return false;
                                }
                                return true;
                            }
                        ),
                })
            ),
        }),
        assetOperations: yup.object({
            fuelCodes: yup
                .array()
                .of(yup.number())
                .test(
                    "conditional-required",
                    "Vui lòng chọn loại nhiên liệu",
                    function (value, context) {
                        // Lấy giá trị isConsumptionRecorded từ context
                        const { isConsumptionRecorded } = context.parent;
                        // Kiểm tra điều kiện
                        if (isConsumptionRecorded && (!value || value.length === 0)) {
                            return false;
                        }
                        return true;
                    }
                ),
            assetOperationLines: yup.array().of(
                yup.object({
                    parameterCode: yup.string().required("Vui lòng chọn thông số"),
                    parameterMinValue: yup
                        .number()
                        .required("Vui lòng nhập giá trị tối thiểu")
                        .typeError("Giá trị phải là số"),
                    parameterMaxValue: yup
                        .number()
                        .required("Vui lòng nhập giá trị tối đa")
                        .typeError("Giá trị phải là số"),
                })
            ),
        }),
    });

    static async save(data) {
        try {
            // Tạo context chứa thông tin partner để sử dụng trong validation
            const validationContext = {};

            // Kiểm tra nếu có maintenanceLines và partner
            if (data.assetMaintenance &&
                data.assetMaintenance.assetMaintenanceLines &&
                data.assetMaintenance.assetMaintenanceLines.length > 0) {
                // Lấy partner từ dòng đầu tiên để sử dụng trong validation
                validationContext.partner = data.assetMaintenance.assetMaintenanceLines[0].partner;
            }

            const { formData, dataFormat } = this.formatData(data);
            await this.schema.validate(dataFormat, {
                abortEarly: false,
                context: validationContext
            });

            if (data.id) {
                return await http.put(`${this.API_URL}/${data.id}`, formData);
            } else {
                return await http.post(`${this.API_URL}`, formData);
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
    static formatData(data) {
        // Chuẩn bị dữ liệu để submit
        const formData = new FormData();
        if (
            data.assetMaintenance &&
            data.assetMaintenance.assetMaintenanceLines &&
            data.assetMaintenance.assetMaintenanceLines.length > 0
        ) {
            data.assetMaintenance.assetMaintenanceLines.forEach((item) => {
                if (item && item.repeatDate) {
                    item.repeatDate = Object.keys(item.repeatDate).filter(key => item.repeatDate[key]).toString();
                }
                if (item.taskLists && Array.isArray(item.taskLists)) {
                    item.taskLists = item.taskLists.map(el => ({
                        ...el,
                        orgStrctId: Number(Object.keys(el.orgStrctId)[0])
                    }));
                }

            });
        }

        // Append JSON data
        formData.append("model.Model", JSON.stringify(data));

        // Append images if they exist and are new uploads
        if (data.Image1s && data.Image1s.length > 0) {
            data.Image1s.forEach((item) => {
                formData.append("model.Img1s", item);
            });
        }

        // Append task attachments if they exist
        if (
            data.assetMaintenance &&
            data.assetMaintenance.assetMaintenanceLines &&
            data.assetMaintenance.assetMaintenanceLines.length > 0
        ) {
            data.assetMaintenance.assetMaintenanceLines.forEach((item) => {
                if (item && item.taskLists && item.taskLists.length > 0) {
                    item.taskLists.forEach((task) => {
                        if (task && task.FDoc) {
                            formData.append("model.FDoc", task.FDoc);
                        }
                    });
                }
            });
        }
        return { formData, dataFormat: data };
    }
    static updateService = (data) => {
        if (data.osrnLines.length > 0) {
            data.osrnLines.forEach((item) => {
                item.fieldInput = item.fieldInput.join(",");
            });
        }
        const formData = new FormData();
        formData.append("model.Model", JSON.stringify(data));
        if (data.Img1s && data.Img1s.length > 0) {
            data.Img1s.forEach((item) => {
                formData.append("model.Img1s", item);
            });
        }
        return http.put(`${this.API_URL}/update-osrn`, formData);
    };
}

export default AssetService;
