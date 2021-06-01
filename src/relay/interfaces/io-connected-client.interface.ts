export const IO_CLIENT_TYPE_AGENT = "agent";
export const IO_CLIENT_TYPE_CUSTOMER = "customer";
export const IO_CLIENT_STATUS_WAITING = "waiting";
export const IO_CLIENT_STATUS_ASSIGNED = "assigned";

export enum IoConnectedClientType {
  IO_CLIENT_TYPE_AGENT = "agent",
  IO_CLIENT_TYPE_CUSTOMER = "customer"
}

export enum IoConnectedClientStatus {
  IO_CLIENT_STATUS_WAITING = "waiting",
  IO_CLIENT_STATUS_ASSIGNED = "assigned"
}

export interface IoConnectedClient {
  uid?: number | null;
  name: string;
  type: IoConnectedClientType;
  status?: number;
}