// src/utils/getError.js
export default function getError(e){
  return e?.response?.data?.message || e.message || "Lỗi";
}
