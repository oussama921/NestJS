// success: true => message, data
// success: false => errorMessage, error

export interface IResponse{
  success: boolean;
  code: number;
  message: string;
  data: any[];
}
