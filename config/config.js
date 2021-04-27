module.exports = {
	env: 'dev',
	database: {
		dbName: 'e-book',
		host: 'localhost',
		port: 8889,
		user: 'root',
		password: 'root'
	},
	security: {
		secretKey: 'fang!!%$@$%^^$#@DXsDFd1D34?@#$dou?d@add124?(%2334',
		expiresIn: 60 * 60 * 24 * 30 // 指代的是令牌的过期时间，这里代表的是一个小时
	},
	// wx: {
	// 	appId: 'wx2df78a4871588ca8',
	// 	appSecret: 'ad146e061365d814033324fd35e8b70a',
	// 	loginUrl:
	// 		'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
	// },
	// yushu: {
	// 	detailUrl: 'http://t.talelin.com/v2/book/id/%s',
	// 	keywordUrl: 'http://t.talelin.com/v2/book/search?q=%s&count=%s&start=%s&summary=%s'
	// },
	host: 'http://192.168.0.100:8083'
};
