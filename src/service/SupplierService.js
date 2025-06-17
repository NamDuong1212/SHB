import * as yup from "yup";
import http from "./http";

export default class SupplierService {
  // Static API endpoints
  static api = "Supplier";

  static schema = yup.object({
    supplierCode: yup.string().required("Vui lòng nhập mã nhà cung cấp"),
    supplierOrderCode: yup.string(), // Không bắt buộc
    supplierName: yup.string().required("Vui lòng nhập tên nhà cung cấp"),
    supplierOrtherName: yup.string(), // Không bắt buộc
    tax: yup.string().required("Vui lòng nhập mã số thuế"),
    // currencyId: yup.mixed().nullable(), // Có thể null
    // notes: yup.string(),
    // isActive: yup.boolean().required(),

    // supplierInfomationLine: yup.object({
    //   memberType: yup.string(),
    //   phoneNumber1: yup.string().matches(/^[0-9+()\-.\s]*$/, "Số điện thoại không hợp lệ"),
    //   phoneNumber2: yup.string().matches(/^[0-9+()\-.\s]*$/, "Số điện thoại không hợp lệ"),
    //   cellPhone: yup.string().matches(/^[0-9+()\-.\s]*$/, "Số điện thoại không hợp lệ"),
    //   email: yup.string().email("Email không hợp lệ"),
    //   website: yup.string().url("Website không hợp lệ"),
    //   notes: yup.string(),
    //   presentative: yup.string()
    // }),

    // supplierContactLines: yup.array().of(
    //   yup.object({})
    // ),

    // supplierAddressLines: yup.array().of(
    //   yup.object({})
    // ),

    // supplierPaymentTerm: yup.object({
    //   paymentTermId: yup.mixed().nullable(),
    //   supplierPaymentTermLine: yup.array().of(
    //     yup.object({}) // Có thể bổ sung nếu có cấu trúc chi tiết
    //   )
    // }),

    // supplierItemLines: yup.array().of(
    //   yup.object({
    //     itemGroupId: yup.mixed().nullable()
    //   })
    // ),

    // supplierFileLines: yup.array().of(
    //   yup.object({}) // Có thể bổ sung nếu có cấu trúc chi tiết
    // )
  });


  static async getAll(params = {}) {
    return http.get(`${this.api}`, { params });
  }

  static async getById(id) {
    return http.get(`${this.api}/${id}`);
  }

  static async getAllItem(param = {}) {
    return http.get(`Item`, param);
  }


  static async save(data) {
    const formData = new FormData();
    try {
      await this.schema.validate(data, { abortEarly: false });
      if (data.supplierFileLines && Array.isArray(data.supplierFileLines)) {
        let indexFIle = 0;
        data.supplierFileLines.forEach((file, index) => {
          if (!file.id) {
            formData.append('Files', file);
            file.imageIndex = indexFIle;
            indexFIle += 1;
          } else {
            file.imageIndex = -1
          }

        });
      }
      formData.append('Models', JSON.stringify(data));

      if (data.id) {
        return await http.put(`${this.api}/${data.id}`, formData);
      } else {
        return await http.post(`${this.api}`, formData);
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