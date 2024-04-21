import axios from "axios";

export const getAllExam = (token, page, pageSize, key) => {
    return axios({
        url: '/api/exam/getAll',
        method: 'get',
        params: {
            key:key,
            page: page,
            pageSize: pageSize
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
export const getAllPaper = (token, page, pageSize, type) => {
    return axios({
        url: '/api/paper/getAll',
        method: 'get',
        params: {
            type:type,
            page: page,
            pageSize: pageSize
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
export const getExamDetailById = (token, exam_id) => {
    return axios({
        url: '/api/exam/getById',
        method: 'get',
        params: {
            exam_id: exam_id
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

export const getUserExam = (token, page, pageSize, uid) => {
    return axios({
        url: '/api/exam/getByUid',
        method: 'get',
        params: {
            uid:uid,
            page: page,
            pageSize: pageSize
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
export const getAllUser = (token, page, pageSize, key) => {
    return axios({
        url: '/api/user/getall',
        method: 'get',
        params: {
            key:key,
            page: page,
            pageSize: pageSize
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
export const addExam = async (params, token) => {
    return axios({
        url: '/api/exam/add',
        method: 'post',
        data: params,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
  };
  
  export const UpdateExam = async (params, token) => {
    return axios({
        url: '/api/exam/update',
        method: 'post',
        data: params,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
  };
  
  export const deleteExam = async (exam_id, token) => {
    return axios({
        url: '/api/exam/delete',
        method: 'delete',
        params: {
            exam_id: exam_id
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
  };       

  export const getContentByPid = async(paper_id, token) =>{
    return axios({
        url: '/api/paper/getById',
        method: 'get',
        params: {
            paper_id: paper_id
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
  }

  export const getPastExamById = async(eu_id, token) =>{
    return axios({
        url: '/api/exam/getDetailById',
        method: 'get',
        params: {
            eu_id: eu_id
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
  }