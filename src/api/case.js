import request from './request.ts'
import axios from "axios";
//url 方法 参数

//获取病例信息
export const getCase = (params, token, page, pageSize) => {
    return axios({
        url: '/api/case/getall',
        method: 'get',
        params: {
            ...params,
            page: page,
            pageSize: pageSize
        },
        headers: {
            'Authorization': `Bearer ${token}`
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
        }
    });
};

//修改病例???
export const editCase = (data, token) => {
    return axios({
        // url: `/api/case/getall?`,
        method: 'put',
        data,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

//删除病例???
export const deleteCase = (cid, token) => {
    return axios({
        url: `/api/case/delete?cid=${cid}`,
        method: 'delete',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

