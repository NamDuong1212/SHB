import http from "./http";

export default class FactorySerivce {
  // Static API endpoints
  static api = "Factory";

  // static StrUnitSchema = yup.object().shape({
  //   factoryCode: yup.string().required("Mã xưởng là bắt buộc"),
  //   factoryName: yup.string().required("Tên xưởng là bắt buộc"),
  //   factoryGroupId: yup.string().required("Vui lòng chọn nhóm xưởng"),
  //   parentId: yup.string().nullable(),
  //   orgStructId: yup.string().nullable(),

  // }).test(
  //   "either-parentId-or-orgStructId",
  //   "Chỉ được chọn Mã nhóm cha hoặc Đơn vị quản lý, không phải cả hai",
  //   function (value) {
  //     const { parentId, orgStructId } = value || {};
  //     const bothEmpty = !parentId && !orgStructId;
  //     const bothFilled = parentId && orgStructId;
  //     if (bothEmpty || bothFilled) {
  //       return this.createError({
  //         path: "orgStructId",
  //         message: "Chỉ được chọn Mã nhóm cha hoặc Đơn vị quản lý, không phải cả hai"
  //       });
  //     }
  //     return true;
  //   }
  // );


  static async getAll(params = {}) {
    return http.get(this.api, { params });
  }


  static async save(data, fromData) {
    try {
      // await this.StrUnitSchema.validate(data, { abortEarly: false });
      if (data.id) {
        return await http.put(`${this.api}/${data.id}`, data);
      } else {
        return await http.post(this.api, fromData);
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

  static async getItemGroupFactory(id) {
    return await http.get(`Factory/getByGroupFactory/${id}`);
  }


  static async getByGroupFactory(id) {
    return await http.get(`Factory/getByGroupFactory/${id}`);
  }

  static async getByOrgStruct(id) {
    return await http.get(`Factory/getByOrgStruct/${id}`);
  }

  static async UpdateFile(data) {
    return await http.post('Factory/addFile', data)
  }

  static async DeleteFile(id) {
    return await http.delete(`Factory/removeFile/${id}`)
  }

}


