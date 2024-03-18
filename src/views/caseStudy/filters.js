// const dayjs = require('dayjs')
//
// const filterTimes = (val, format = 'YYYY-MM-DD') => {
//     if(!isNull(val)) {
//         val = parseInt(val) * 1000
//         return dayjs(val).format(format)
//     }else{
//         return '--'
//     }
// }
//
// export const inNull = (date) =>{
//     if(!date) return true
//     if(JSON.stringify(date) === '{}') return ture
//     if(JSON.stringify(date) === '[]') return ture
// }
//
// export default app => {
//     app.config.globalProperties.$filters ={
//         filterTimes
//     }
// }