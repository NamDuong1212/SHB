import http from "src/boot/http";
import * as yup from "yup";

export default class WarehouseGrpService {
  static API = "GroupWarehouse";

  static schema = yup.object({
    groupWarehouseCode: yup.string().required("Vui lòng nhập mã nhóm kho"),
    groupWarehouseName: yup.string().required("Vui lòng nhập tên nhóm kho"),
  });

  static async getAll(params = {}) {
    return http.get(`${this.API}`, { params });
  }

  static async create(data) {
    try {
      await this.schema.validate(data, { abortEarly: false });
      return await http.post(`${this.API}`, data);
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
  static async update(id, data) {
    try {
      await this.schema.validate(data, { abortEarly: false });
      return await http.put(`${this.API}/${id}`, data);
    } catch (err) {
      if (err.name === "ValidationError") {
        const formatted = { isValidate: true };
        err.inner.forEach((e) => {
          if (!formatted[e.path]) {
            formatted[e.path] = [];
          }
          formatted[e.path].push(e.message);
        });
        throw formatted;
      }
      throw err;
    }
  }
}
