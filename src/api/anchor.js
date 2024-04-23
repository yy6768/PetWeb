import axios from "axios";
export const addAnchor = (token, params) => {
    // Create a copy of params to avoid mutating the original object
    let modifiedParams = { ...params };
    console.log("add params:", modifiedParams);
    // Remove cate_id from the copied params object
    console.log(token);
    return axios({
        url: '/api/anchor/add',
        method: 'post',
        data: modifiedParams,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};