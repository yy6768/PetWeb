import request from './request.ts'

//url 方法 参数

//获取病例信息
export const getCase =(params) =>{
    return request({
        // 病例的url
        url:'/api/case/getall',
        params
    })
}

//添加病例
export const addCase = (data) =>{
    return request({
        url:'/api/case/add',
        method:'post',
        data
    })
}

//修改病例
export const editCase = (data) =>{
    return request({
        url:`case/${data.id}`,
        method:'put',
        data
    })
}

//删除病例
export const deleteCase = (id) => {
    return request({
        url:`case/${id}`,
        method:'delete'
    })
}

