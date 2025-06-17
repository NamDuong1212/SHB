import * as yup from "yup";
import http from "./http";

export default class ItemTempService {
  static API = "SampleItem";
  static API_ASSET = "Asset";
  static API_UNIT = "UnitOfMeasure"
  static API_WH = 'Warehouse'

  static SampleItemLineSchema = yup.object().shape({
    materialCode: yup.string().required("Vui lòng nhập mã vật tư"),
    materialName: yup.string().required("Vui lòng nhập tên vật tư"),
    unitOfMeasureId: yup.number().required("Vui lòng chọn đơn vị tính"),
    warehouseId: yup.number().required("Vui lòng chọn kho"),
    quantity: yup.number()
      .required("Vui lòng nhập số lượng")
      .min(1, "Số lượng phải lớn hơn 0"),
    isRequired: yup.boolean().required("Vui lòng chọn tính chất"),
  });

  static SampleItemLinesSchema = yup.array().of(ItemTempService.SampleItemLineSchema);

  static AssetSchema = yup.object().shape({
    assetId: yup.number().required("Vui lòng chọn mã tài sản"),
    assetMaintenanceId: yup.number().required("Vui lòng chọn mã tài sản"),
  });

  static async getAll(params = {}) {
    return http.get(`${this.API}`, { params });
  }
  static async getAllAsset(params = {}) {
    return http.get(`${this.API_ASSET}`, { params });
  }
  static async getAllUnits(params = {}) {
    return http.get(`${this.API_UNIT}`, { params });
  }
  static async getAllWh(params) {
    return http.get(`${this.API_WH}`, { params })
  }
  static async save(data) {
    try {
      await this.AssetSchema.validate(data, { abortEarly: false });
      if (data.id) {
        return await http.put(`${this.API}/${data.id}`, data);
      } else {
        return await http.post(this.API, data);
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

  static async getItemById(id) {
    return await http.get(`${this.API}/${id}`);
  }
}


