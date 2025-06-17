import Calendar from "primevue/calendar";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import MultiSelect from "primevue/multiselect";
import Slider from "primevue/slider";
import { h } from "vue";

/**
 * Bộ lọc dạng InputText (text hoặc number)
 * @param {Object} options - { placeholder: string, type: 'text' | 'number' }
 */
export function renderInputFilter({ placeholder = "Tìm kiếm...", type = "text" } = {}) {
  return ({ filterModel, filterCallback }) =>
    h(InputText, {
      type,
      modelValue: filterModel.value,
      "onUpdate:modelValue": (val) => {
        filterModel.value = val;
        // filterCallback?.();
      },
      placeholder,
      class: "p-column-filter",
    });
}

/**
 * Bộ lọc dạng Dropdown cho PrimeVue DataTable
 * @param {Object} params - Tham số cấu hình filter
 * @param {string} params.placeholder - Placeholder hiển thị
 * @param {Array} params.options - Danh sách lựa chọn
 * @param {string} params.optionValue - Tên key dùng làm giá trị
 * @param {string} params.optionLabel - Tên key dùng làm nhãn hiển thị
 */
export function renderDropdownFilter({
  placeholder = "Chọn...",
  options = [],
  optionValue = "value",
  optionLabel = "label",
} = {}) {
  return ({ filterModel, filterCallback }) =>
    h(Dropdown, {
      options,
      modelValue: filterModel.value,
      "onUpdate:modelValue": (val) => {
        filterModel.value = val;
        // filterCallback?.(); // Kích hoạt lọc lại
      },
      optionValue,
      optionLabel, // ✅ sửa đúng tên key
      placeholder,
      class: "p-column-filter",
      showClear: true,
    });
}


/**
 * Bộ lọc dạng Calendar (ngày)
 * @param {Object} options - { placeholder: string, dateFormat: string }
 */
export function renderCalendarFilter({ placeholder = "Chọn ngày", dateFormat = "yy-mm-dd" } = {}) {
  return ({ filterModel, filterCallback }) =>
    h(Calendar, {
      modelValue: filterModel.value,
      "onUpdate:modelValue": (val) => {
        filterModel.value = val;
        // filterCallback?.();
      },
      placeholder,
      dateFormat,
      class: "p-column-filter w-full",
      showIcon: true,
    });
}

/**
 * Bộ lọc dạng Checkbox (boolean)
 * @param {string} label - Nhãn bên cạnh checkbox
 */
export function renderCheckboxFilter(label = "") {
  return ({ filterModel, filterCallback }) =>
    h("div", { class: "p-checkbox-filter-wrapper flex items-center" }, [
      h(Checkbox, {
        binary: true,
        modelValue: filterModel.value,
        "onUpdate:modelValue": (val) => {
          filterModel.value = val;
          // filterCallback?.();
        },
        class: "p-column-filter",
      }),
      h("label", { class: "ml-2" }, label),
    ]);
}

/**
 * Bộ lọc dạng TreeSelect (dữ liệu phân cấp)
 * @param {Object} options - { placeholder: string, options: array }
 */

/**
 * Tạo bộ lọc TreeSelect cho cấu trúc dữ liệu có id và label trong `data`
 * @param {Object} options - { placeholder: string, options: array }
 */

/**
 * Tạo bộ lọc TreeSelect
 * @param {Object} options - { placeholder: string, options: array }
 */
// export function renderTreeSelectFilter({
//   placeholder = "Chọn...",
//   options = [],
// } = {}) {
//   return ({ filterModel, filterCallback }) =>
//     h(TreeSelect, {
//       modelValue: filterModel.value, // Giữ giá trị đã chọn
//       // "onUpdate:modelValue": (val) => {
//       //   filterModel.value = val; // Cập nhật giá trị khi người dùng chọn
//       //   // filterCallback?.(); // Nếu cần gọi lại filter callback
//       // },
//       options, // Dữ liệu cây
//       placeholder, // Placeholder cho TreeSelect
//       class: "p-column-filter w-full",
//       showClear: true, // Hiển thị nút xóa
//       filter: true, // Cho phép lọc
//       optionLabel: "data.name", // Hiển thị tên của node
//       optionValue: "data.id", // Trả về giá trị ID khi chọn node
//       children: "children", // Tên trường chứa các node con
//       // Emit sự kiện node-select để lấy thông tin chi tiết của node đã chọn
//       "onNodeSelect": (node) => {
//         if (node && node.data) {
//           // Lấy ID từ node đã chọn
//           filterModel.value = node.data.id;

//           // Cập nhật filterModel.value hoặc làm gì đó với node đã chọn
//         }
//       },
//     });
// }



/**
 * Bộ lọc dạng MultiSelect (chọn nhiều)
 * @param {Object} options - { placeholder: string, options: array }
 */
export function renderMultiSelectFilter({ placeholder = "Chọn nhiều...", options = [] } = {}) {
  return ({ filterModel, filterCallback }) =>
    h(MultiSelect, {
      modelValue: filterModel.value,
      "onUpdate:modelValue": (val) => {
        filterModel.value = val;
        // filterCallback?.();
      },
      options,
      placeholder,
      class: "p-column-filter w-full",
      display: "chip",
      showClear: true,
      filter: true,
    });
}

/**
 * Bộ lọc dạng Slider (số)
 * @param {Object} options - { min: number, max: number, step: number }
 */
export function renderSliderFilter({ min = 0, max = 100, step = 1 } = {}) {
  return ({ filterModel, filterCallback }) =>
    h("div", { class: "p-column-filter w-full" }, [
      h(Slider, {
        modelValue: filterModel.value,
        "onUpdate:modelValue": (val) => {
          filterModel.value = val;
          // filterCallback?.();
        },
        min,
        max,
        step,
        class: "w-full",
      }),
      h("div", { class: "mt-1 text-sm text-center" }, String(filterModel.value ?? "")),
    ]);
}
