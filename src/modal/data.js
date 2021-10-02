const Data = {
    local: ['12','23','23'],
    userChoose: '', // 用户语言设置选择
    // indexArr:['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','s','y','z','a2','b2','c2','d2','e2','f2','g2','h2','i2','j2','k2','l2','m2','n2','o2','p2','q2','r2','s2','t2','u2','v2','w2','s2','y2','z2'],//用于存储列表实时更新的全部个体数据，便于更改列表
    index:0,//index是indexArr的索引
    indexIndex:'HDDEVTEAM',//indexIndex用来利用store，动态存储index，更新index，避免数据丢失
    urls: [],//一旦发生改动，要在urls里面利用id索引到对应位置进行变动
    urlsIndex:'HDDEVTEAM2',//用来索引urls，urls用来整体
    // indexArr2:['a1','b1','c1','d1','e1','f1','g1','h1','i1','j1','k1','l1','m1','n1','o1','p1','q1','r1','s1','t1','u1','v1','w1','s1','y1','z1'],//用于存储个体数据，便于数据的更改
    // arr3:['a2','b2','c2','d2','e2','f2','g2','h2','i2','j2','k2','l2','m2','n2','o2','p2','q2','r2','s2','t2','u2','v2','w2','s2','y2','z2'],
    Ping:[{ key:0, url: '' }],//需要Ping的网址
    pingIndex:"HDDEVTEAM",
    historyPing:[],//历史Ping的地址
    urlsArr:["http://","https://","www.",".com",".cn"],
    
    IP1:'',
    IP2:'',
    IP3:'',
    IP4:'',
    IP5:'',
};
export default Data;
