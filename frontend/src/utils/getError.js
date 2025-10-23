export default function getError(e){
  if (e?.response) return e.response.data?.message || `HTTP ${e.response.status}`;
  if (e?.request)  return "Không kết nối được server (Network Error)";
  return e?.message || "Lỗi không xác định";
}
