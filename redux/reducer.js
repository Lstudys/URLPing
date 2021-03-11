const states={
    timeDate:{//图表的数据
        y:0,//纵坐标，请求往返的时间(毫秒)
        x:0//横坐标，x值表示第x次请求
    },
    otherDate:{//请求的平均时间、最大最小时间、服务器域名、连接成功或失败的次数
        allTime:0,//总时间，即每次请求响应的时间和
        maxTime:0,//最长时间
        minTime:1000000,//最短时间，定义一个比较大的数，方便与第一次传过来的数据比较
        avgTime:0,//平均时间
        domainName:'',//域名
        okNum:0,//网站可以访问(即服务器返回的状态码是)的次数
    }
}



export const reducer=(state=states,action)=>{
    if(action.type=='req'){
        state.timeDate.y=action.value.time;
        state.timeDate.x=action.value.x;
        return state;
    }
}