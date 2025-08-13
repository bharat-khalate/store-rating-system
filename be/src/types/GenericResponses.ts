

export interface GenericSuccessResponse<T>{
    success:true,
    message:string,
    data:T[]
}



export interface GenericErrorResponse{
    success:false,
    message:string,
    error:string
}