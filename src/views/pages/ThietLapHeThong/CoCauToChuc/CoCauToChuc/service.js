import http from "src/boot/http";
import * as yup from "yup";

export default class OrgsTrucService {
  // Static API endpoints
  static api = "OrganizationalStructure";

  static schema = yup.object({
    orgStrtCode: yup.string().required("Vui lòng nhập mã đơn vị"),
    orgStrtName: yup.string().required("Vui lòng nhập tên đơn vị"),
    orgLevelId: yup.string().required("Vui lòng chọn cấp tổ chức"),
  });

  static async getAll(params = {}) {
    return http.get(this.api, { params });
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

  static async getOrgLevels(Page = 1, PageSize = 10, Search = "") {
    return http.get(`Organizational?Page=${Page}&${PageSize}&Search=${Search}`);
  }
}
