const {Sequelize,Model} = require('sequelize')
const {unset, clone, isArray} = require('lodash')
const { dbName, host, port, user, password } = require('../config/config').database;
const config = require('../config/config');

const sequelize = new Sequelize(dbName, user, password, {
	dialect: 'mysql', // 用于指定数据库的类型
	host,
	port,
	logging: true, // 打印原始sql语句
	timezone: '+08:00', // 设置时区
	define: {
		timestamps: true, // 设置表中是否显示createdAt、updatedAt字段，设置为false时不显示这两个字段
		paranoid: true, // 显示deletedAt字段
		createdAt: 'created_at', // 更改自动生成的字段名
		updatedAt: 'updated_at',
		underscored: true, // 将字段名由驼峰改为下划线连接的方式
		scopes: {
			bh: {// bh名字可以任意选取
				attributes: {// 返回给前端的结果中排除下面三个字段
					exclude: [ 'updated_at', 'deleted_at', 'created_at' ]
				}
			}
		}
	}
});

// 如果不加这句sequelize不会自动把模型创建到数据库的
sequelize.sync({
	force: false // 尽量不要设置为true，会自动删除表从新创建
});

Model.prototype.toJSON= function(){
  // let data = this.dataValues // 获取所有的Model中的字段
  let data = clone(this.dataValues) // 模型中的dataValues是不受get方法影响的，存储的都是数据库中最原始的字符串

  // 指定需要删除的字段
  unset(data, 'updated_at')
  unset(data, 'created_at')
  unset(data, 'deleted_at')

  for (key in data){
    if(key === 'image'){
      if(!data[key].startsWith('http'))
        data[key] = config.host + data[key]
    }
  }

  if(isArray(this.exclude)){
    this.exclude.forEach(
      (value)=>{
        unset(data,value)
      }
    )
  }

  return data
}

module.exports = { sequelize };
