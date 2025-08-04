import * as yup from "yup";
import http from "./http";

export default class OrgsTrucService {
  // Static API endpoints
  static api = "OrganizationalStructure";

  static schema = yup.object({
    // orgStrCode: yup.string().required("Vui lòng nhập mã đơn vị"),
    orgName: yup.string().required("Vui lòng nhập tên đơn vị"),
    orgType: yup.string().required("Vui lòng chọn cấp tổ chức"),
  });

  static async getAll(params = {}) {
    return http.get(this.api, { params });
  }
  static async getById(id) {
    return http.get(`${this.api}/${id}`);
  }
  static async getChildById(id) {
    return http.get(`${this.api}/${id}/children`)
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

  static async delete(id) {
    return http.delete(`${this.api}/${id}`);
  }

  static async getOrgLevels(Page = 1, page_size = 10, Search = "") {
    return http.get(`Organizational?Page=${Page}&${page_size}&Search=${Search}`);
  }
}
