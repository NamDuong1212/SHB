import * as yup from "yup";
import http from "./http";

export default class ItemService {
  // Static API endpoints
  static api = "Item";

  static ItemSchema = yup.object().shape({
    suffix: yup.string().required("Vui lòng chọn tiền tố"),
    itemName: yup.string().required("Tên hàng hóa là bắt buộc"),
    unitOfMeasureGroupId: yup.string().required('Nhóm đơn vị tính là bắt buộc'),
    itemGroupId: yup.string().required('Nhóm hàng hóa là bắt buộc')
  });

  static async getAll(params = {}) {
    return http.get(`${this.api}`, { params });
  }

  static async getById(id) {
    return http.get(`${this.api}/${id}`);
  }

  static async save(payload) {
    const data = { ...payload }
    const formData = new FormData()
    try {
      await this.ItemSchema.validate(data, { abortEarly: false });
      if (data.itemFile && Array.isArray(data.itemFile)) {
        let indexFIle = 0;
        data.itemFile.forEach((file, index) => {
          if (!file.id) {
            formData.append('Files', file);
            file.imageIndex = indexFIle;
            indexFIle += 1;
          } else {
            file.imageIndex = -1
          }
        });
      }
      if (data.itemImage && Array.isArray(data.itemImage)) {
        let indexFIle = 0;
        data.itemImage.forEach((file, index) => {
          if (!file.id) {
            formData.append('Images', file);
            file.imageIndex = indexFIle
            indexFIle += 1;
          } else {
            file.imageIndex = -1
          }
        });
      }

      data.itemAttributeMain.forEach((item) => {
        // item.itemAttributeLine = item.itemAttributeLine.map((e) => ({
        //   itemAttributeLineId: e,
        // }));
        const arrAttribute = []
        item.itemAttributeLine.forEach(el => {
          const itemAttributeLine = item.itemAttributeLineClone.find(e => e.itemAttributeLineId == el);
          if (itemAttributeLine != undefined) {
            arrAttribute.push(itemAttributeLine)
          } else {
            arrAttribute.push({
              itemAttributeLineId: el,
            })
          }
        });
        item.itemAttributeLine = arrAttribute


      });
      formData.append('Models', JSON.stringify(data));
      if (data.id) {
        return await http.put(`${this.api}/${data.id}`, formData);
      } else {
        return await http.post(`${this.api}`, formData);
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


