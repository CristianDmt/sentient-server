import { InquiryInterface } from "src/relay/interfaces/io-connected-client.interface";

export interface CustomerTokenInterface {
  name: string;
  inquiry: InquiryInterface;
  conversation: string;
}