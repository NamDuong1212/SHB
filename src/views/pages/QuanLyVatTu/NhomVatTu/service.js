import http from "src/boot/http";
import * as yup from "yup";

export default class GroupGoodSerivce {
  // Static API endpoints
  static api = "GroupGood";

  static schema = yup.object({
    groupGoodCode: yup.string().required("Vui lòng nhập mã nhóm vật tư"),
    groupGoodName: yup.string().required("Vui lòng nhập tên nhóm vật tư"),
  });

  static async getAll(params = {}) {
    return http.get(this.api, { params });
  }

  static async save(data) {
    try {
      await this.schema.validate(data, { abortEarly: false });
     if(data.id){
      return await http.put(`${this.api}/${data.id}`, data);
     }else{
      return await http.post(this.api, data);
     }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const formatted = {isValidate:true};
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
