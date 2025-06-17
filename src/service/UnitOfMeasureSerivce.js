import http from "@/service/http";
import * as yup from "yup";

export default class UnitOfMeasureSerivce {
  // Static API endpoints
  static ADD_UnitOfMeasur = "UnitOfMeasure";
  static UPDATE_UnitOfMeasur = "UnitOfMeasure";
  static GET_UnitOfMeasur = "UnitOfMeasure";

  static StrUnitSchema = yup.object().shape({
    unitCode: yup.string().required("Mã đơn vị tính là bắt buộc"),
    unitName: yup.string().required("Tên đơn vị tính là bắt buộc"),
  });

  static async getAll(params = {}) {
    return http.get(this.GET_UnitOfMeasur, { params });
  }
  static async getById(id) {
    return http.get(`${this.GET_UnitOfMeasur}/${id}`)
  }

  static async save(data) {
    try {
      await this.StrUnitSchema.validate(data, { abortEarly: false });
      if (data.id) {
        return await http.put(`${this.UPDATE_UnitOfMeasur}/${data.id}`, data);
      } else {
        return await http.post(this.ADD_UnitOfMeasur, data);
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


