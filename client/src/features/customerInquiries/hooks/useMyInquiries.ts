import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/features/crm/utils/queryKeys";
import { getMyInquiries } from "@/features/customerInquiries/services/inquiryService";

export function useMyInquiries() {
  return useQuery({ queryKey: queryKeys.myInquiries, queryFn: getMyInquiries });
}
