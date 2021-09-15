const TheData={
    Ping:[{ key:0, url: '' }],//需要Ping的网址
    pingIndex:"HDDEVTEAM",
    QuickSelect:[{key:'0',url:"",name:""},{key:'1',url:"",name:""},{key:'2',url:"",name:""},{key:'3',url:"",name:""},{key:'4',url:"",name:""},{key:'5',url:"",name:""}],//快速输入添加的地址
    historyPing:[],//历史Ping的地址
    quickUrls:["http://www.baidu.com","http://www.bilibili.com","http://www.blog.csdn.net"],
    HistoryMessage:[],//历史信息页面flatlist需要加载的数据
    urlsArr:["http://","https://","www.",".com",".cn"],
    tableHead: ['MAX', 'MIN', 'AVG', 'N95'],
      tableData: [
        [this.maxTime, '2', '3', '4'],
        ['a', 'b', 'c', 'd'],
        ['1', '2', '3', '456\n789'],
        ['a', 'b', 'c', 'd']
      ],
};
export default TheData;