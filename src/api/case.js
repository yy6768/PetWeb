import request from './request.ts'
import axios from "axios";
//url 方法 参数

//获取病例信息
export const getCase = (params, token, page, pageSize,search) => {
    return axios({
        url: '/api/case/getall',
        method: 'get',
        params: {
            // ...params, 这里我注释掉了，你可以看情况再改下（
            search:search,
            page: page,
            pageSize: pageSize
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

//根据病种查询病例
export const getCasesByCate = (params, token,cate_name,page,pageSize) => {
    return axios({
        url: `/api/case/get_by_cate`,
        method: 'get',
        params: {
            cate_name:cate_name,
            page:page,
            pageSize:pageSize,
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

//根据病名查询病例
export const getCasesByIll = (params, token,ill_name,page,pageSize) => {
    return axios({
        url: `/api/case/get_by_ill`,
        method: 'get',
        params: {
            ill_name:ill_name,
            page:page,
            pageSize:pageSize,
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

//根据id获取病例详情???
export const getCaseById = (params,token,cid) => {
    return axios({
        url: `/api/case/get_by_id`,
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
export const getMed = (token) => {
    return axios({
        url: '/api/case/get_all_medicine',
        method: 'get',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

//获取化验项目
export const getLab = (token) => {
    return axios({
        url: '/api/case/get_all_lab',
        method: 'get',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const getAllLab = (params, token) => {
    return axios({
        url: '/api/lab/getall',
        method: 'get',
        params,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const getAllDrug = (params,token) => {
    return axios({
        url: '/api/medications/getall',
        method: 'get',
        params,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

//添加病例???
export const addCase = (token, params) => {
    // Create a copy of params to avoid mutating the original object
    let modifiedParams = { ...params };
    console.log("add params:", modifiedParams);
    // Remove cate_id from the copied params object
    delete modifiedParams.cate_id;

    return axios({
        url: '/api/case/add',
        method: 'post',
        params: modifiedParams,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};


//修改病例???
export const updateCase = (token, params) => {
    let modifiedParams = { ...params };
    delete modifiedParams.cate_id;
    delete modifiedParams.ill_name;
    delete modifiedParams.username;

    console.log("modify params:", modifiedParams);
    return axios({
        url: `/api/case/update`,
        method: 'post',
        params: modifiedParams,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const addLabToCase = (cid, lab_id, token) => {
    return axios({
        url: `/api/case/add_lab`,
        method: 'post',
        params:{
            lab_id: lab_id,
            cid: cid
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}
export const deleteLabToCase = (cid, lab_id, token) => {
    return axios({
        url: `/api/case/delete_lab`,
        method: 'delete',
        params:{
            lab_id: lab_id,
            cid: cid
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}       
export const addDrugToCase = (cid, med_id, token) => {
    return axios({
        url: `/api/case/add_medicine`,
        method: 'post',
        params:{
            medicine_id: med_id,
            cid: cid
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}
export const deleteDrugToCase = (cid, medicine_id, token) => {
    return axios({
        url: `/api/case/delete_medicine`,
        method: 'delete',
        params:{
            medicine_id: medicine_id,
            cid: cid
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}  
//删除病例
export const deleteCase = async (cid, token) => {
    console.log("Deleting case with CID:", cid);
    console.log("Token:", token)
    try {
        const params = new URLSearchParams({ cid: cid.toString() }).toString();
        const response = await axios.delete(`/api/case/delete?${params}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Delete response:', response.data);

        if (response.data && response.data.error_message === 'success') {
            console.log('Case successfully deleted.');
            return { success: true, message: 'Case deleted successfully' };
        } else {
            console.error('Failed to delete case:', response.data.error_message);
            return { success: false, message: response.data.error_message };
        }
    } catch (error) {
        console.error('Error deleting case:', error);
        return { success: false, message: 'Error deleting case' };
    }
};
