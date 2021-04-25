const { flatten } = require('lodash');
const { Op } = require('sequelize');
const { NotFound } = require('../../core/http-exception');
const { Movie, Sentence, Music } = require('./classic');

class Art {
	constructor(art_id, type) {
		this.art_id = art_id;
		this.type = type;
	}

	async getDetail(uid) {
		const { Favor } = require('./favor');
		const art = await Art.getData(this.art_id, this.type);
		if (!art) {
			throw new NotFound();
		}

		const like = await Favor.userLikeIt(this.art_id, this.type, uid);
		// art.setDataValue('like_status',like) // 这种方式在这里不太好，因为like_status在这里不属于art
		return {
			art,
			like_status: like
		};
	}

	/* 
  art_id: 媒体id
  type: 媒体类型
  */
	static async getData(art_id, type, useScope = true) {
		let art = null;
		const finder = {
			where: {
				id: art_id
			}
		};
		const scope = useScope ? 'bh' : null; // scope里面传null的话，不会使任何scope生效
		switch (type) {
      case 400:
        const { Book } = require('./book') // book是一个循环导入，不能放到最外面
        art = await Book.scope(scope).findOne(finder)
        if(!art){
          // book表之所以要创建，是因为book表中我们只存了id和点赞数量，没有存其他信息，书籍信息是通过接口请求到的
          art = await Book.create({
            id:art_id
          })
        }
				break;
			default:
				break;
		}
		return art;
	}

	static async getList(artInfoList) {
		const artInfoObj = {
			100: [],
			200: [],
			300: []
		};
		for (let artInfo of artInfoList) {
			artInfoObj[artInfo.type].push(artInfo.art_id);
		}
		const arts = [];
		for (let key in artInfoObj) {
			// 如果数组为空，则跳过
			const ids = artInfoObj[key];
			if (ids.length === 0) {
				continue;
			}

			key = parseInt(key); // 对象的key是字符串，所以需要转型
			arts.push(await Art._getListByType(ids, key));
		}

		// 将二维数组摊平
		return flatten(arts);
	}

	static async _getListByType(ids, type) {
		let arts = [];
		const finder = {
			where: {
				id: {
					[Op.in]: ids
				}
			}
		};
		const scope = 'bh';
		switch (type) {
			case 100:
				arts = await Movie.scope(scope).findAll(finder);
				break;
			case 200:
				arts = await Music.scope(scope).findAll(finder);
				break;
			case 300:
				arts = await Sentence.scope(scope).findAll(finder);
			case 400:
				break;
			default:
				break;
		}
		return arts;
	}
}

module.exports = {
	Art
};
