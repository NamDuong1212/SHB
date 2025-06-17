import * as yup from "yup";
import http from "./http";

class DeviceAdditionService {
  static API = "DeviceAddition";
  static statusOptions = [
    { label: "Tất cả", value: null },
    { label: "Hoạt động", value: true },
    { label: "Không hoạt động", value: false },
  ];

  static dataRequestDefault = {
    id: 0,
    deviceCode: "",
    deviceName: "",
    quantity: 0,
    locationId: null, //Vị trí
    managingUnitId: null, //Đơn vị quản lý
    decisionNumber: null, //Số quyết định
    objType: 1,
    decisionDate: "", //Ngày quyết định
    recoveryEmployee: "", //Nhân viên thanh lý
    note: "", //Ghi chú
    deviceLines: [], //Danh sách tài sản
  };

  // API calls
  static async getAll(params = {}) {
    return http.get(this.API, {
      params: params,
    });
  }
  static async getById(id) {
    return await http.get(`${this.API}/${id}`);
  }
  // Xác nhận xóa
  static getDeleteConfirmation() {
    return {
      message: "Bạn có chắc chắn muốn xóa thông số hoạt động này?",
      endpoint: `${this.API_URL}`,
    };
  }

  // Validation schemas
  static schema = yup.object({
    managingUnitId: yup.number().required("Vui lòng nhập đơn vị quản lý"),
    decisionNumber: yup.string().required("Vui lòng nhập số quyết định"),
    decisionDate: yup.string().required("Vui lòng nhập ngày quyết định"),
    deviceLines: yup
      .array()
      .min(1, "Vui lòng chọn ít nhất 1 tài sản")
      .of(
        yup.object({
          assetValue: yup
            .number()
            .typeError("Vui lòng nhập giá trị tài sản")
            .required("Vui lòng nhập giá trị tài sản")
            .min(0, "Giá trị tài sản phải lớn hơn 0"),
          serial: yup
            .string()
            .required("Vui lòng nhập serial tài sản")
            .nullable(),
        })
      ),
  });

  static async save(data) {
    try {
      await this.schema.validate(data, { abortEarly: false });
      if (data.id) {
        return await http.put(`${this.API}/${data.id}`, data);
      } else {
        return await http.post(`${this.API}`, data);
      }
    } catch (err) {
      if (err.name === "ValidationError") {
        const formatted = {
          isValidate: true,
        };
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

  static async approve(data) {
    return await http.put(`${this.API}?Status=CP`, data);
  }

  static async cancel(data) {
    return await http.put(`${this.API}?Status=C`, data);
  }

  static async searchAsset(keySearch) {
    return await http.get(`Asset${keySearch ? `?search=${keySearch}` : ""}`);
  }

  static async searchDevice(keySearch) {
    if (!keySearch) return;
    return await http.get(`DeviceAddition/code/${keySearch}`);
  }

  static async getLocation(id) {
    return await http.get(`Factory/getByOrgStruct/${id}`);
  }

  static async getByOrganizationalStructure() {
    return await http.get(`OrganizationalStructure`);
  }
}

export default DeviceAdditionService;
