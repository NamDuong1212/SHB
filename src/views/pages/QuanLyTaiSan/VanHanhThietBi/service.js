import * as yup from "yup";
import http from "../../../../service/http";
import { dataCa } from "./database";

class Service {
  static API_URL = "DeviceOperation";
  static statusOptions = [
    { label: "Tất cả", value: null },
    { label: "Hoạt động", value: true },
    { label: "Không hoạt động", value: false },
  ];

  // API calls
  static async getAll(params = {}) {
    return http.get(this.API_URL + "", { params });
  }
  static async getById(id) {
    return http.get(this.API_URL + `/${id}`,);
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

  // Validation schemas
  static schemaCreate = yup.object({
    creator: yup.string().required("Tên nhân viên ca không được để trống !"),
    note: yup.string().required("Vui lòng nhập ghi chú !"),
    createdDate: yup.date().required("Thời gian không được để trống !"),
  });

  static schemaUpdate = yup.object({
    creator: yup.string().required("Tên nhân viên ca không được để trống !"),
    createdDate: yup.date().typeError("Phải là dạng ngày !").required("Thời gian không được để trống !"),
    deviceOperationLines: yup.array().of(
      yup.object({
        deviceSpecifications: yup.array().of(
          yup.object({
            parameterId: yup.number().required("Vui lòng nhập mã tham số"),
            value: yup.number().required("Vui lòng nhập thực tế").min(1, "Thực tế phải > 0"),
            lastUpdated: yup.date().typeError("Phải là dạng ngày !").required("Vui lòng nhập thời gian"),
          })
        ).min(1, "Yêu cầu ít nhất 1 dữ liệu trong bảng (Thông số)"),
        deviceStatus: yup.array().of(
          yup.object({
            startTime: yup.date().typeError("Phải là dạng ngày !").required("Vui lòng nhập thời gian Từ"),
            endTime: yup.date().typeError("Phải là dạng ngày !").required("Vui lòng nhập thời gian Đến"),
            incidentType: yup.string().required("Vui lòng nhập loại sự cố"),
          })
        ).min(1, "Yêu cầu ít nhất 1 dữ liệu trong bảng (Trạng thái)"),
        deviceFuel: yup.array().of(
          yup.object({
            fuelId: yup.number().required("Vui lòng nhập ID của nhiên liệu"),
            quantity: yup.number().required("Vui lòng nhập số lượng tiêu thu").min(1, "Số lượng tiêu thụ phải > 0"),
          })
        ).min(1, "Yêu cầu ít nhất 1 dữ liệu trong bảng (Nhiên liệu)"),
      })
    ).min(1, "Yêu cầu tìm kiếm dữ liệu")
  });

  // Tạo update and create
  static async save(data, validate = true) {
    try {
      debugger
      if (data.id && validate) {
        await this.schemaUpdate.validate(data, {
          abortEarly: false,
        });
      } else if (validate) {
        await this.schemaCreate.validate(data, {
          abortEarly: false,
        });
      }
      return data.id ? http.put(this.API_URL, data) : http.post(this.API_URL, data)
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

  static getDeviceConfig() {
    return http.get(`DeviceConfig`);
  }

  static getByUser() {
    return http.get(`DeviceOperation/GetByUser`);
  }

  static moCa(data) {
    try {
      dataCa.value.push({ ...data, id: 1 });
    } catch (error) {

    }
  }

  static async searchAsset(keySearch) {
    return await http.get(
      `Asset/get-serial?locationId=2&ManagingUnitId=2${keySearch ? `&serial=${keySearch}` : ""}`
    );
  }
}

export default Service;
