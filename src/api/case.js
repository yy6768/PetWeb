import request from './request.ts'
import axios from "axios";
//url 方法 参数

//获取病例信息
export const getCase = (params, token) => {
    return axios({
        // 病例的url
        url: '/api/case/getall',
        method: 'get', // or 'post', 'put', etc. depending on your API
        params,
        headers: {
            'Authorization': `Bearer ${token}`
            // 如果你的 API 使用的是其他授权方式，比如 Basic Authentication，你需要相应修改这里的 Authorization 头
        }
    });
};

//添加病例???
export const addCase = (data, token) => {
    return axios({
        url: '/api/case/add',
        method: 'post',
        data,
        headers: {
            'Authorization': `Bearer ${token}`
            // 如果你的 API 使用的是其他授权方式，比如 Basic Authentication，你需要相应修改这里的 Authorization 头
        }
    });
};

//修改病例???
export const editCase = (data) =>{
    return request({
        url:`case/${data.id}`,
        method:'put',
        data
    })
}

//删除病例???
export const deleteCase = (cid, token) => {
    return axios({
        url: `/api/case/delete?${cid}`,
        method: 'delete',
        headers: {
            'Authorization': `Bearer ${token}`
            // 如果你的 API 使用的是其他授权方式，比如 Basic Authentication，你需要相应修改这里的 Authorization 头
        }
    });
};

