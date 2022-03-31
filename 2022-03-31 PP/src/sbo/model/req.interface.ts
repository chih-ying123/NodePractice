export interface IReqTheirAllData {
    params: AllDataParams;
}

export interface IReqTheirDetailData {
    params: DetailDataParams;
}

export interface AllDataParams {
    secret_key: string
    operator_token:  string;
    row_version: string;
    count: number;
    vendor_code: string;
    timestamp_digit: number;
}

export interface DetailDataParams {
    secret_key: string
    operator_token:  string;
    row_version: string;
    count: number;
    vendor_code: string;
    timestamp_digit: number;
    language: string;
}