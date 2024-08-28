export interface DefaultApiResponse {
  data: any;
  status: number;
}

export interface ApiDelete {
  data?: any;
  url: string;
  params?: any;
}
