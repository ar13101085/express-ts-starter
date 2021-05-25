export interface DefaultPayloadModel<T> {
    isSuccess: boolean,
    msg: string,
    data: T
}