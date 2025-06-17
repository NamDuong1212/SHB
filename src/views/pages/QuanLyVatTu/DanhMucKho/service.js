import http from "src/boot/http";
import * as yup from "yup";

export default class WarehouseSerivce {
  // Static API endpoints
  static ADD_WAREHOUSE = "Warehouse";
  static UPDATE_WAREHOUSE = "Warehouse";
  static GET_WAREHOUSE = "Warehouse";

  static StrUnitSchema = yup.object().shape({
    warehouseCode: yup.string().required("Mã kho là bắt buộc"),
    warehouseName: yup.string().required("Tên kho là bắt buộc"),
    orgStructId: yup.string().required("Vui lòng chọn đơn vị quản lý"),
    groupWarehouseId: yup.string().required( "Vui lòng chọn nhóm kho"),
  });

  static async getAll(params = {}) {
    return http.get(this.GET_WAREHOUSE, { params });
  }

  static async getAllByIdOrg(id) {
    return http.get(`${this.UPDATE_WAREHOUSE}/tree/${id}`);
  }

  static async save(data) {
    try {
      await this.StrUnitSchema.validate(data, { abortEarly: false });
      if(data.id){
        return await http.put(`${this.UPDATE_WAREHOUSE}/${data.id}`, data);
      }else{
        return await http.post(this.ADD_WAREHOUSE, data);
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


