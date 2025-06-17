class AssetDataHelper {
  static statusOptions = [
    { label: "Tất cả", value: null },
    { label: "Hoạt động", value: true },
    { label: "Không hoạt động", value: false },
  ];
  static defaultForm = {
    id: 0,
    assetCode: "",
    assetName: "",
    assetSerial: "",
    serialCode: "",
    isPerformanceGood: false,
    isDeviceActive: false,
    fatherId: null,
    isWarrantyActive: false,
    note: "",
    createDate: new Date(),
    assetMaintenance: {
      id: 0,
      assetId: 0,
      lineId: 0,
      type: "",
      assetMaintenanceLines: [
        {
          id: 0,
          lineId: 0,
          criterion: "",
          frequency: "",
          repeatDate: [],
          repeatType: 0,
          repeatCount: 0,
          maintenanceCode: "",
          autoSchedule: 0,
          autoScheduleType: "",
          taskLists: [

          ],
          sparePartMaterials: [
          ],
        },
      ],
    },
    assetOperations: {
      id: 0,
      lineId: 0,
      isStatusRecorded: true,
      assetId: 0,
      isConsumptionRecorded: true,
      fuelCodes: [],
      assetOperationLines: [
        {
          id: 0,
          lineId: 0,
          parameterCode: "",
          parameterName: "",
          parameterUnit: "",
          isAccumulated: true,
          parameterMinValue: 0,
          parameterMaxValue: 0,
          hasAlert: true,
          status: "",
        },
      ],
    },

    isActive: true,
    serialCode: "##-##-##",
  };

  // Format dữ liệu khi chỉnh sửa tài sản
  static formatAssetForEdit(data) {
    if (!data) return null;
    // Đảm bảo các thuộc tính cần thiết đều có giá trị mặc định nếu null
    return {
      id: data.id || 0,
      assetCode: data.assetCode || "",
      assetName: data.assetName || "",
      assetSerial: data.assetSerial || "",
      serialCode: data.serialCode || "",
      note: data.note || "",
      fatherId: data.fatherId || null,
      createDate: data.createDate || new Date(),
      isDeviceActive:
        data.isDeviceActive !== undefined ? data.isDeviceActive : true,
      isWarrantyActive:
        data.isWarrantyActive !== undefined ? data.isWarrantyActive : false,
      isPerformanceGood:
        data.isPerformanceGood !== undefined ? data.isPerformanceGood : false,
      isActive: data.isActive !== undefined ? data.isActive : true,
      assetTypeId: data.assetTypeId || 0,
      assetGroupId: data.assetGroupId || 0,
      assetType: data.assetType || {},
      assetGroup: data.assetGroup || {},
      assetImgs: data.assetImgs || [],
      Image1s: [], // Sẽ được điền khi tải lên ảnh mới

      assetMaintenance: {
        ...data.assetMaintenance,
        assetMaintenanceLines: data.assetMaintenance.assetMaintenanceLines.map(
          (line) => ({
            ...line,
            repeatDate: line.repeatDate ? line.repeatDate.split(',').reduce((acc, el) => {
              acc[el] = { checked: true, partialChecked: false };
              return acc;
            }, {}) : {},
            taskLists: line.taskLists.map((task) => ({
              ...task,
              orgStrctId: { [task.orgStrctId]: true }
            })),
          })
        ),
      } || {
        assetId: 0,
        type: "",
        assetMaintenanceLines: [],
      },
      assetOperations: data.assetOperations || {
        assetId: 0,
        isStatusRecorded: true,
        isConsumptionRecorded: true,
        assetOperationLines: [],
      },
    };
  }



  static simpleQuy = [
    {
      label: "Quý 1",
      key: "Quý 1",
      children: [
        {
          label: "Tháng 1",
          key: "Tháng 1",
          children: Array.from({ length: 31 }, (_, i) => ({
            label: `Ngày ${String(i + 1).padStart(2, "0")}`,
            key: `${String(i + 1).padStart(2, "0")}/01`,
          })),
        },
        {
          label: "Tháng 2",
          key: "Tháng 2",
          children: Array.from({ length: 29 }, (_, i) => ({
            label: `Ngày ${String(i + 1).padStart(2, "0")}`,
            key: `${String(i + 1).padStart(2, "0")}/02`,
          })),
        },
        {
          label: "Tháng 3",
          key: "Tháng 3",
          children: Array.from({ length: 31 }, (_, i) => ({
            label: `Ngày ${String(i + 1).padStart(2, "0")}`,
            key: `${String(i + 1).padStart(2, "0")}/03`,
          })),
        },
      ],
    },
    {
      label: "Quý 2",
      key: "Quý 2",
      children: [
        {
          label: "Tháng 4",
          key: "Tháng 4",
          children: Array.from({ length: 30 }, (_, i) => ({
            label: `Ngày ${String(i + 1).padStart(2, "0")}`,
            key: `${String(i + 1).padStart(2, "0")}/04`,
          })),
        },
        {
          label: "Tháng 5",
          key: "Tháng 5",
          children: Array.from({ length: 31 }, (_, i) => ({
            label: `Ngày ${String(i + 1).padStart(2, "0")}`,
            key: `${String(i + 1).padStart(2, "0")}/05`,
          })),
        },
        {
          label: "Tháng 6",
          key: "Tháng 6",
          children: Array.from({ length: 30 }, (_, i) => ({
            label: `Ngày ${String(i + 1).padStart(2, "0")}`,
            key: `${String(i + 1).padStart(2, "0")}/06`,
          })),
        },
      ],
    },
    {
      label: "Quý 3",
      key: "Quý 3",
      children: [
        {
          label: "Tháng 7",
          key: "Tháng 7",
          children: Array.from({ length: 31 }, (_, i) => ({
            label: `Ngày ${String(i + 1).padStart(2, "0")}`,
            key: `${String(i + 1).padStart(2, "0")}/07`,
          })),
        },
        {
          label: "Tháng 8",
          key: "Tháng 8",
          children: Array.from({ length: 31 }, (_, i) => ({
            label: `Ngày ${String(i + 1).padStart(2, "0")}`,
            key: `${String(i + 1).padStart(2, "0")}/08`,
          })),
        },
        {
          label: "Tháng 9",
          key: "Tháng 9",
          children: Array.from({ length: 30 }, (_, i) => ({
            label: `Ngày ${String(i + 1).padStart(2, "0")}`,
            key: `${String(i + 1).padStart(2, "0")}/09`,
          })),
        },
      ],
    },
    {
      label: "Quý 4",
      key: "Quý 4",
      children: [
        {
          label: "Tháng 10",
          key: "Tháng 10",
          children: Array.from({ length: 31 }, (_, i) => ({
            label: `Ngày ${String(i + 1).padStart(2, "0")}`,
            key: `${String(i + 1).padStart(2, "0")}/10`,
          })),
        },
        {
          label: "Tháng 11",
          key: "Tháng 11",
          children: Array.from({ length: 30 }, (_, i) => ({
            label: `Ngày ${String(i + 1).padStart(2, "0")}`,
            key: `${String(i + 1).padStart(2, "0")}/11`,
          })),
        },
        {
          label: "Tháng 12",
          key: "Tháng 12",
          children: Array.from({ length: 31 }, (_, i) => ({
            label: `Ngày ${String(i + 1).padStart(2, "0")}`,
            key: `${String(i + 1).padStart(2, "0")}/12`,
          })),
        },
      ],
    },
  ];

  static simpleTuan = [
    {
      label: "Thứ 2",
      key: "1",
    },
    {
      label: "Thứ 3",
      key: "2",
    },
    {
      label: "Thứ 4",
      key: "3",
    },
    {
      label: "Thứ 5",
      key: "4",
    },
    {
      label: "Thứ 6",
      key: "5",
    },
    {
      label: "Thứ 7",
      key: " 6",
    },
    {
      label: "Chủ nhật",
      key: "0",
    },
  ];

  static simpleThang = Array.from({ length: 31 }, (_, i) => ({
    label: `Ngày ${String(i + 1).padStart(2, "0")}`,
    key: `${String(i + 1).padStart(2, "0")}`,
  }));

  static simpleNam = [
    {
      label: "Tháng 1",
      key: "Tháng 1",
      children: Array.from({ length: 31 }, (_, i) => ({
        label: `Ngày ${String(i + 1).padStart(2, "0")}`,
        key: `${String(i + 1).padStart(2, "0")}/01`,
      })),
    },
    {
      label: "Tháng 2",
      key: "Tháng 2",
      children: Array.from({ length: 29 }, (_, i) => ({
        label: `Ngày ${String(i + 1).padStart(2, "0")}`,
        key: `${String(i + 1).padStart(2, "0")}/02`,
      })),
    },
    {
      label: "Tháng 3",
      key: "Tháng 3",
      children: Array.from({ length: 31 }, (_, i) => ({
        label: `Ngày ${String(i + 1).padStart(2, "0")}`,
        key: `${String(i + 1).padStart(2, "0")}/03`,
      })),
    },

    {
      label: "Tháng 4",
      key: "Tháng 4",
      children: Array.from({ length: 30 }, (_, i) => ({
        label: `Ngày ${String(i + 1).padStart(2, "0")}`,
        key: `${String(i + 1).padStart(2, "0")}/04`,
      })),
    },
    {
      label: "Tháng 5",
      key: "Tháng 5",
      children: Array.from({ length: 31 }, (_, i) => ({
        label: `Ngày ${String(i + 1).padStart(2, "0")}`,
        key: `${String(i + 1).padStart(2, "0")}/05`,
      })),
    },
    {
      label: "Tháng 6",
      key: "Tháng 6",
      children: Array.from({ length: 30 }, (_, i) => ({
        label: `Ngày ${String(i + 1).padStart(2, "0")}`,
        key: `${String(i + 1).padStart(2, "0")}/06`,
      })),
    },

    {
      label: "Tháng 7",
      key: "Tháng 7",
      children: Array.from({ length: 31 }, (_, i) => ({
        label: `Ngày ${String(i + 1).padStart(2, "0")}`,
        key: `${String(i + 1).padStart(2, "0")}/07`,
      })),
    },
    {
      label: "Tháng 8",
      key: "Tháng 8",
      children: Array.from({ length: 31 }, (_, i) => ({
        label: `Ngày ${String(i + 1).padStart(2, "0")}`,
        key: `${String(i + 1).padStart(2, "0")}/08`,
      })),
    },
    {
      label: "Tháng 9",
      key: "Tháng 9",
      children: Array.from({ length: 30 }, (_, i) => ({
        label: `Ngày ${String(i + 1).padStart(2, "0")}`,
        key: `${String(i + 1).padStart(2, "0")}/09`,
      })),
    },

    {
      label: "Tháng 10",
      key: "Tháng 10",
      children: Array.from({ length: 31 }, (_, i) => ({
        label: `Ngày ${String(i + 1).padStart(2, "0")}`,
        key: `${String(i + 1).padStart(2, "0")}/10`,
      })),
    },
    {
      label: "Tháng 11",
      key: "Tháng 11",
      children: Array.from({ length: 30 }, (_, i) => ({
        label: `Ngày ${String(i + 1).padStart(2, "0")}`,
        key: `${String(i + 1).padStart(2, "0")}/11`,
      })),
    },
    {
      label: "Tháng 12",
      key: "Tháng 12",
      children: Array.from({ length: 31 }, (_, i) => ({
        label: `Ngày ${String(i + 1).padStart(2, "0")}`,
        key: `${String(i + 1).padStart(2, "0")}/12`,
      })),
    },
  ];
}

export default AssetDataHelper;
