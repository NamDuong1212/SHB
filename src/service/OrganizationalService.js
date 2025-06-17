import * as yup from "yup";
import http from "./http";


export default class OrganizationalService {

  static API = "OrganizationalLevel"

  static schema = yup.object({
    organizationLevelName: yup.string().required("Vui lòng nhập tên cấp tổ chức")
  });

  static async getAll(query = '', params = {}) {
    return http.get(`${this.API}${query}`, { params });
  }


  static async save(data) {
    try {
      await this.schema.validate(data, { abortEarly: false });

      if (data.id) {
        return await http.put(`${this.API}/${data.id}`, data);
      } else {
        return await http.post(`${this.API}`, data);
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const formatted = {
          isValidate: true
        };
        err.inner.forEach(e => {
          if (!formatted[e.path]) {
            formatted[e.path] = e.message;
          }
        });
        throw formatted;
      }
      throw err;
    }
  }

}