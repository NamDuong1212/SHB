import http from "@/service/http";


export default class FactoryGrpService {

  static API = "GroupFactory"

  // static schema = yup.object({
  //   groupFactoryCode: yup.string().required("Vui lòng nhập mã nhóm xưởng"),
  //   groupFactoryName: yup.string().required("Vui lòng nhập tên nhóm xưởng"),
  // });

  static async getAll(params = {}) {
    return http.get(`${this.API}`, { params });
  }


  static async save(data) {
    try {
      // await this.schema.validate(data, { abortEarly: false });
      if (data.id) {
        return await http.put(`${this.API}/${data.id}`, data);
      } else {
        return await http.post(`${this.API}`, data);
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const formatted = { isValidate: true };
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