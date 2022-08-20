import * as types from '../types'
// type User = {
//     email: string,
//     name: string,
//     code : number,
//     token: string,
//     prof: string,
//     wall: string,
//     newAcc: number,
//     settings: Settings
// }
// type Settings = {
//     Sound_UI : number,
//     Theme_Color : number
// }
export const fetchUser = (data : any) => async (dispatch  :any) => {
    dispatch({
        type : types.Get_User,
        payload : data
    })
}