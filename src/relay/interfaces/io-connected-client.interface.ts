export enum IoConnectedClientType {
  IO_CLIENT_TYPE_AGENT = "agent",
  IO_CLIENT_TYPE_CUSTOMER = "customer"
}

export enum IoConnectedClientStatus {
  IO_CLIENT_STATUS_WAITING = "waiting",
  IO_CLIENT_STATUS_ASSIGNED = "assigned"
}

export interface InquiryInterface {
  companyId: number;
  teamId: number;
}

export interface IoConnectedClientInterface {
  uid?: number | null;
  name: string;
  type: IoConnectedClientType;
  companyId?: number;
  teamIds?: number[];
  inquiry?: InquiryInterface;
  conversation?: string;
  to?: string;
}