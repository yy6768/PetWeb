//导入日期 还未使用
// const dayjs = require('dayjs')
import dayjs from 'dayjs';


const filterTimes = (val:any, format = 'YYYY-MM-DD') => {
    if(!isNull(val)) {
        val = parseInt(val) * 1000
        return dayjs(val).format(format)
    }else{
        return '--'
    }
}

export const isNull = (date:any) =>{
    if(!date) return true
    if(JSON.stringify(date) === '{}') return true
    if(JSON.stringify(date) === '[]') return true
}

export default (app:any) => {
    app.config.globalProperties.$filters ={
        filterTimes
    }
}