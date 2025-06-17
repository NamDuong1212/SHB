import * as yup from "yup";
import http from "./http";

class DeviceTransferService {
  static API = "DeviceTransfer";
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
    toLocationId: null, //Vị trí
    managingUnitId: null, //Đơn vị quản lý
    toManagingUnitId: null, //Đơn vị quản lý
    objType: 2,
    decisionDate: new Date(), //Ngày quyết định
    recoveryEmployee: "", //Nhân viên thanh lý
    note: "", //Ghi chú
    deviceLines: [], //Danh sách tài sản
  };

  // API calls
  static async getAll(params = {}, formFilter) {

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
    managingUnitId: yup.number().required("Vui lòng nhập từ đơn vị quản lý"),
    toManagingUnitId: yup
      .number()
      .required("Vui lòng nhập đến đơn vị quản lý "),
    deviceLines: yup.array().min(1, "Vui lòng chọn ít nhất 1 serial"),
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

  static async searchAsset(keySearch, locationId, managingUnitId) {
    return await http.get(
      `Asset/get-serial?${keySearch ? `serial=${keySearch}` : ""}${locationId ? `&locationId=${locationId}` : ""
      }${managingUnitId ? `&ManagingUnitId=${managingUnitId}` : ""}`
    );
  }

  static async searchDevice(keySearch) {
    if (!keySearch) return;
    return await http.get(`${this.API}/code/${keySearch}`);
  }

  static async getLocation(id) {
    return await http.get(`Factory/getByOrgStruct/${id}`);
  }

  static async getByOrganizationalStructure() {
    return await http.get(`OrganizationalStructure`);
  }
}

export default DeviceTransferService;
