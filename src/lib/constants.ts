export const testTypes = [
    { value: "blood_count", label: "Complete Blood Count" },
    { value: "lipid_panel", label: "Lipid Panel" },
    { value: "thyroid_function", label: "Thyroid Function" },
    { value: "liver_function", label: "Liver Function" },
    { value: "kidney_function", label: "Kidney Function" },
    { value: "hba1c", label: "HbA1c" },
    { value: "vitamin_d", label: "Vitamin D" },
    { value: "iron_panel", label: "Iron Panel" },
    { value: "urinalysis", label: "Urinalysis" },
    { value: "electrolytes", label: "Electrolytes" },
  ];
  
export  const MAX_SAMPLES = 8;

export const SA_PROVINCES = [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "North West",
    "Northern Cape",
    "Western Cape",
  ];

export const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "#1F2937",
      borderColor: "#374151",
      color: "#D1D5DB",
      minHeight: "42px", // Match the height of other inputs
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#1F2937",
      zIndex: 9999,
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (
      provided: any,
      state: { isFocused: boolean; isSelected: boolean },
    ) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#374151"
        : state.isSelected
          ? "#4B5563"
          : "#1F2937",
      color: "#D1D5DB",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#D1D5DB",
    }),
  };