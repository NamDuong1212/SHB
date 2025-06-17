import http from "@/service/http";
// import * as yup from "yup";

export default class UnitOfMeasureSerivce {
  // Static API endpoints
  static API_UnitOfMeasure = "UnitOfMeasure";
  static API_URL = 'UnitGroup'
  // static StrUnitSchema = yup.object().shape({
  //   unitGroupName: yup.string().required("Tên nhóm đơn vị tính là bắt buộc"),
  //   unitOfMeasureId: yup.string().required("Đơn vị tính cơ sở là bắt buộc")
  // });
  static async getAllUnit(params = {}) {
    return http.get(`${this.API_UnitOfMeasure}`, { params })
  }
  static async getAll(params = {}) {
    return http.get(`${this.API_URL}/getAll`, { params });
  }


  static async save(data) {
    try {
      // await this.StrUnitSchema.validate(data, { abortEarly: false });
      if (data.id) {
        return await http.put(`${this.API_URL}/${data.id}`, data);
      } else {
        return await http.post(`${this.API_URL}`, data);
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
  static async getUnitGrpById(id) {
    return http.get(`${this.API_URL}/${id}`);
  }
}


