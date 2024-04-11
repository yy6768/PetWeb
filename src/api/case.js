import request from './request.ts'
import axios from "axios";
//url 方法 参数

//获取病例信息
export const getCase = (params, token, page, pageSize) => {
    return axios({
        url: '/api/case/getall',
        method: 'get',
        params: {
            // ...params, 这里我注释掉了，你可以看情况再改下（
            search:'',
            page: page,
            pageSize: pageSize
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

//根据id获取病例详情???
export const getCaseById = (params,token,cid) => {
    return axios({
        url: '/api/case/get_by_id',
        method: 'get',
        params: {
            cid:cid
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

//获得病种
export const getCate = (params,token) => {
    return axios({
        url: '/api/cate/get_all',
        method: 'get',
        params,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

//获得病名
export const getIll = (params,token,cate_id) => {
    return axios({
        url: '/api/ill/get_all_in_cate',
        method: 'get',
        params:{
            cate_id:cate_id
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

//获得医师
export const getName = (params,token,key,authority,page,pageSize) => {
    return axios({
        url: '/api/user/getall',
        method: 'get',
        params:{
            key:key,
            authority:authority,
            page:page,
            pageSize:pageSize,
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

//获得药品
export const getMed = (params,token) => {
    return axios({
        url: '/api/case/get_all_medicine',
        method: 'get',
        params,
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
        data:{
            uid:'',
            ill_id:'',
            date:'',
            basic_situation:'',
            photo:'',
            result:'',
            therapy:'',
            surgery_video:''
        },
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

//删除病例
export const deleteCase = (cid, token) => {
    return axios({
        url: `/api/case/delete?cid=${cid}`,
        method: 'delete',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

