(function () {
	const SEPARATOR="={";

	var indexedDB = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;
	var db = null;
	var request = null;

	var game_data = {
		gameDataNum: 0,
		charpter: 0,
		scenario: [],
		bg: null,
		bgm:null,
		character:null,
		face: null
	};
/*		bg: {
			num: 0,
			color: "normal"
		},
		bgm: {
			num: 0,
			volume: "normal"
		},
		character={"name":"1","w":"auto","h":"40%","x":"20%","y":"60%"},
		face: {
			character: "tennzenn",
			num: 0,
			x: 0,
			y: 0
		}
*/

	request = indexedDB.open(System.DB_NAME, System.DB_VERSION);
	request.onerror = function (event) {
		console.log("opening database failed!\nCode=" + event.target.error);
	};
	request.onsuccess = function (event) {
		console.log("opening database successed!");
	};
	request.onupgradeneeded = function (event) {
		var pre_index = 0;
		var next_index = 0;
		var len = scenario.length;
		var class_name = "";
		var str = "";
		var i = 0;
		var req = null;
		var requests = [];
		var store = null;

		function successed(e) {
			console.log("data " + e.target.result + " has benn initialized!");
		};
		function failed(e) {
			console.log("data failed initializing!\nCode=" + e.target.error);
		};

		db = this.result;
		store=db.createObjectStore(System.STORE_NAME_SAVE, {
					keyPath: "saveDataNum",
					autoIncrement: false
				});
		store.createIndex("comment", "comment", {
				unique: false
			});
		store = db.createObjectStore(System.STORE_NAME_GAME, {
				keyPath: "gameDataNum",
				autoIncrement: false
			});

		for (pre_index = 1, next_index = scenario.indexOf("\n", pre_index); pre_index < len && next_index < len && next_index != -1; ) {
			str = scenario.substring(pre_index, next_index);
			if (str != "") {
				i = str.indexOf(SEPARATOR);
				if (i != -1) {
					class_name = str.substring(0, i);
					game_data[class_name] = JSON.parse(str.substring(i + 1));
				} else {
					game_data.scenario.push(str);
				}

			} else {
				game_data.gameDataNum++;
				req = store.add(game_data);
				req.onsuccess = successed;
				req.onerror = failed;
				requests.push(req);
				game_data.scenario = [];
			}
			pre_index = next_index + 1;
			next_index = scenario.indexOf("\n", pre_index);
		}
	};
	
	
	var scenario = `
bg={"name":"1"}
bgm={"name":"1"}
天善「呼……！呼！　呼！　呼！　哈！」
把加重十公斤的球拍挥舞了上千回的时候
才发觉光线从秘密基地尽是缝隙的墙壁中照射了进来
好像到早上了
天善「……又打了一晚上的乒乓球啊」
摘下眼镜，擦掉额头上流下的汗珠
拿起放在乒乓球台旁的水，慢慢喝了一口
已经变成常温的水，慢慢浸润了因特训而发热的身体
回一次家吧？
不…一回家的话估计会直接睡过去吧
我一直在折磨自己的身体，这种程度的自觉还是有的
天善「即使如此，也还是有无法到达的地方啊…太遥远了」
不，也许如今的我…
我把收在秘密基地深处的和良一的玩具箱拿了出来
迷你四驱车、悠悠球、修学旅行时买的双截棍……我还找到一个比这些小时候的回忆更古老的球拍
和平时用的横拍的形状不一样
这是很早以前被称为竖拍的球拍
而且只有一面贴了橡胶，颇具日本风味
如今使用这种球拍的选手已经不多了
但是，我一直赢不了使用这拍子的家伙
就像握笔一样，我用大拇指和食指握紧了日式的竖拍
明明很久没用过了，却有种熟悉的感触
也许是因为我的原点是这个球拍，所以才感到熟悉也说不定
我把乒乓球高高抛起，发出了球
天善「必杀！恶龙咆哮！！」
一击强劲的正手球
强劲的上旋球和空气摩擦，发出宛如恶龙咆哮般的声音
但是，并没有落到对方台面，而是笔直地射向秘密基地的入口
啪———！

bg={"name":2}
羽依里「woc！」
正好打到进来的鹰原的额头上，发出清脆的打击声
天善「打脸也算界内吧」
羽依里「界外！界外！诶说起来这什么跟什么啊，为什么我来玩老是被乒乓球痛击啊？是叫我回去吗？！我内心可没那么坚强，会边走边哭的哦！」
额头红肿得跟乒乓球一样大的鹰原，仿佛责备一般地说
天善「抱歉、我不是故意的、只是……」
羽依里「只是？」
天善「这都躲不开的你太差劲了」
羽依里「你说话注意点啊！」
天善「所以我说了抱歉了吧」
羽依里「被你接下来的话给毁了！」
鹰原是这个暑假来岛上整理加藤奶奶遗物的城里人
虽然好像有些内情，但是我没有追问到那个地步
谁都有一两件对谁也不想说的事情吧
羽依里「说起来，刚刚的奥义，是新创的吗？第一次听说呢」
他经常陪我进行特训
所以说，对刚刚的招数感觉到不对劲了吧
天善「那不是奥义，是必杀技！」
羽依里「……？不对吧？虽然确实说了「必杀」两个字，但是感觉很小孩子气啊」
天善「当然了」
我盯着球拍，轻声道
天善「因为是小孩子想出来的招数啊」
羽依里「……？有什么故事吗？」
天善「没有那么夸张啦，只是……」
如果说对于这个时间到来的他有什么意义的话
跟他说说也许也不错
我直视着鹰原
天善「稍稍听我说说话吗？」
羽依里「噢、噢？」
天善「我为什么会一直在打乒乓球」
羽依里「哦~挺感兴趣呢。一直以来就很在意你如此痴迷乒乓球的原因」
天善「这样吗」
视线从爽朗笑着的鹰原身上移开，我再次看向了手中的球拍
天善「这是某个男孩子的故事」
羽依里「嗯嗯」
天善「那家伙小时候起就很内向……虚弱」
羽依里「嗯……嗯？」
天善「是个体育课的时候跟谁组队都很害羞的家伙」
羽依里「等一下」
鹰原向我伸出手掌，打断了我的话
天善「怎么了？」
羽依里「那个故事的发展，感觉好像听过啊。不，虽然有点不同，仔细想想，这不是良一的故事吗？」
天善「不是，是我的故事」
羽依里「这样啊……打断了你实在是不好意思。继续吧」
天善「啊，讲到哪了……确实、对了，她去往了无法触及的远方」
羽依里「等一下！」
鹰原再次伸出手，打断我的话
羽依里「跳了跳了，跳了好大一段，结果受到一波严重剧透」
天善「呣？是吗、好像只顾顺着这种想说出来的心情了」
羽依里「体育课的时候跟谁组队都……说到这里了」
天善「似乎是这样、不好意思。总之，他是个内向又虚弱又害羞的孩子」
我像怀念往事般闭上了眼
天善「小学有一间图书室。暑假的时候，他也不去外面玩耍，就坐在那里沉浸在读书中。也没有能称得上是朋友的人」
我一看，发现鹰原低着头念叨着什么
天善「怎么了吗？」
羽依里「没——没啥，你继续」
天善「啊。在那里认识了一个女孩子。和我很像，很内向、喜欢读书的孩子」
羽依里「慢慢地开始聊些与书有关的话题，然后，不知不觉中成了朋友对吧？」
天善「正是。……我有跟你说过吗？」
羽依里「没有，不要在意这个」
天善「总之，我开始觉得校园生活也有点乐趣了」
我想起记忆里的小学时代
那一天也是，我和她在图书室深处的座位上，面对面坐着读书

bg={"name":1}
bgm={"name":2}
女孩子「呐、加纳君」
没料到会被打招呼，我没回话，只是抬起了头
女孩子「一个劲地读书不无聊吗？」
天善「但是，图书馆就是读书的地方吧」
女孩子「说是这么说，可是难得呆在一起，实在是有点可惜啊」
她向周围看了一圈，压低声音说
女孩子「不做点不准做的事吗？」
天善「不准做的事？既然是不准做的事还是不做为好吧？」
女孩子「话是这样没错，但正因此才会觉得快乐不是吗」
天善「……做什么？」
是因为我被她的话引诱了而开心吗，她露出了从未见过的笑容
然后，从包中取出文具盒，又从文具盒里面拿出了橡皮
女孩子「嘿嘿、弹橡皮」
那是男孩子们在课间玩的很起劲的游戏
规则很简单，用手指弹桌子上自己的橡皮，把对方的橡皮从桌子上击落就行了
据说凭自己实力玩耍的「专业级」的严格规则是，橡皮一旦被击落，就属于击落者所有
其中也有新买的橡皮只一战就被夺走，然后哭脸的家伙
内向的我，混进那种不说极其但也很热闹的地方之类的事情还是做不到
但是，从远处看起来很有趣啊……
她也是一样的吧
因为是一直想试着玩玩的游戏，所以说，我的心情雀跃起来了
天善「明白了，玩吧」
我也从文具盒里拿出橡皮，摆在桌上
天善「但是，要保持安静，这里可是图书馆」
女孩子「当然啦！不准做的事要悄悄做才有趣嘛」
她眨眨眼，把自己的橡皮放在了桌上

bg={"name":2}
bgm={"name":1}
羽依里「弹橡皮吗，很令人怀念的游戏啊」
鹰原像是很怀念一般说着
天善「城里也玩这个吗？」
羽依里「那不是小学生都会的游戏吗？」
天善「原来如此，不管是城里还是岛上大家的童年都是一样的吗」
羽依里「啊啊，但是我们不是用手指弹」
天善「那用什么方法让橡皮弹起来？」
羽依里「用按压式圆珠笔的上面那部分弹。把里面的弹簧叠两层用来加大威力、在看不见的部分改造一下什么的也都做过」
天善「机械级吗」
羽依里「在鸟白岛是这么叫的吗？」
天善「这是被一部分有钱的家伙认可的级别，主要是德田和他那群拥趸在玩」
羽依里「啊，德田体育的那家伙吗」
天善「总之，那种小游戏也玩得很开心。因为大家寻常做的事对于我们来说是做不到的呢」
说到这里，我咬住了自己的嘴唇
天善「但是，那没持续多久……」
羽依里「发生什么了？」
面对鹰原的询问，我再一次放空眼神，回忆起了小时候的事

bg={"name":1}
bgm={"name":2}
在比学校的更大、桌面经过磨光加工的图书室桌子上进行的弹橡皮大战进入了白热化阶段
只用一点力橡皮也会滑很远
这看起来似乎比大家在学校里玩的时候还要有趣
不，确实很有趣
所以说，两个人都沉迷其中不可自拔
女孩子「吃我一招————！恶龙咆————哮！」
天善「哇哇哇————！我的橡皮碎成两半了————！」
老师「图书室里请保持安静！」
结果被管理图书室的老师骂了个狗血淋头

bg={"name":2}
bgm={"name":1}
天善「我们两个一副要哭的样子，一起道了歉」
羽依里「在图书室里大叫肯定会被骂的吧。说起来，恶龙咆哮就是出自这里啊。把橡皮一分为二的招数？这真的是弹橡皮吗？！」
鹰原半呆然半感兴趣地问道
天善「小孩子的游戏罢了。总觉得把必杀技的名字叫出来就会变得更强对吧」
羽依里「不……但是橡皮碎成两半了吧？」
天善「施加一定的力量，橡皮什么的很容易就掰断了吧。简单来说就是这样」
羽依里「嗯？嗯嗯……是这样吗？」
鹰原一副不能领会我的话的样子
天善「总之，我们弹橡皮大战到这儿就结束了。之后的日子两人还是继续一起读书」
我再次回想起记忆中的小学时代
那一天也是，我和她在图书室深处的座位上，面对面坐着读书

bg={"name":1}
bgm={"name":2}
女孩子「呐、加纳君」
对她的招呼，我没回话，只是抬起了头
女孩子「一个劲地读书不无聊吗？」
天善「图书馆就是读书的地方，而且之前才因为太吵而被骂了一顿吧」
女孩子「说是这么说，可是难得呆在一起，实在是有点可惜啊」
她向周围看了一圈，压低声音说
女孩子「不准做的事，不再做一做吗？」
天善「我是不会再弹橡皮了哦」
女孩子「是更加不准做的事」
她那么说着，从包里拿出几颗玻璃弹珠
女孩子「这个的话，只需稍稍用力就能在桌子上滚动，所以可以安静地对战哦」
我应该想到的
她说的是“更加”不准做的事
也就是说，是比弹橡皮更加不能做的事
但是我对她提议的游戏很在意
感觉很有趣的样子
天善「只玩一会的话……」
我这么一回答，她朝我露出非常开心的笑容
玻璃弹珠的对决，不一会儿就进入了白热化
女孩子「吃我一招————！恶龙咆————哮！」
天善「哇哇哇————！我的指甲————！」
老师「图书室里请保持安静！」
再次被管理图书室的老师骂了个狗血淋头

bg={"name":2}
bgm={"name":1}
天善「我们两个一副要哭的样子，一起道了歉」
羽依里「又使出了恶龙咆哮吗？这不是把橡皮撕成两半的招数吗？」
天善「我的指甲裂成两半了」
羽依里「啊啊啊啊啊——————！痛痛痛！别让我联想起来啊！」
天善「总之，我们再一次向老师道了歉。特别是我是边哭边道歉的」
光是回想一下，那时候的痛感就像要复苏一样，我轻轻地握住了右手食指
天善「被老师警告说下一次还这么吵闹的话，就不准进入图书室了」
羽依里「那是当然了」
天善「所以说，我决定老老实实地看书。但是她又一次对我说，一个劲地读书不无聊吗」
羽依里「那孩子，就一点也不学习吗」
鹰原很显然地呆住了
天善「啊啊，简直和我想得一样。当然，我拒绝了。弹橡皮、弹弹珠都不会再玩了……但是……」
羽依里「但是？」
天善「她给我看的，是一个古老的乒乓球」
羽依里「啊，终于和乒乓球扯上边了」
天善「呵……不能说是打乒乓球。因为连规则都不怎么了解」
我像回想起的那时候一样，握住了面前的乒乓球
天善「把宽大的桌子当作球桌，书立起来当作球网，球拍就用书代替」
羽依里「能想到的在图书室里最差劲的游戏没错了」
天善「啊啊，白热化了」
嘣……咔嘣、嘣……咔嘣

bg={"name":1}
bgm={"name":2}
女孩子「加纳君、能持续对打了呢」
天善「啊啊，虽然不是很明白，但感觉还不错」
女孩子「那么，要稍微认真起来咯？」
天善「正有此意」
女孩子「吃我一招————！恶龙咆————哮！」
天善「哇哇哇————！老师的眼镜裂成两半了————！」

bg={"name":2}
bgm={"name":1}
天善「我们两个，一溜烟跑了」
羽依里「该说最糟糕呢，还是最差劲呢……」
天善「哼……谁年轻时没闯过祸。这样一来我们作为休憩之所的图书室就被夺走了」
羽依里「不是……完全是自作自受吧？为什么装的像个受害者一样啊」
天善「但是，转机这种东西就是完全不知会在何处降临啊」
羽依里「……？」
天善「第二天，我们被叫去了职员室。在那里，老师跟我们说，不打打乒乓球吗」
天无绝人之路
瞧见我们对打、感觉有发展潜力的人出现了
被谁认可还是人生中第一次，所以心中一片茫然
但是，有人在注视着我们，这让人很开心
我和她，马上答应了
我们待的地方，从图书室变成了体育馆

bg={"name":3}
bgm={"name":3}
学校的体育馆里，岛民们把打乒乓球当作娱乐活动
老人们、家庭主妇们看起来很开心地打着乒乓球
悠闲地享受着乒乓球、打出抛物线轨道的人
凭借一身肌肉、打出笔直弹道的人
只是，总而言之大家都满脸笑容
女孩子「哇————这就是乒乓球吗——」
天善「我们真的可以待在这样的地方吗」
女孩子「既然是被邀请过来的当然可以了。给，这是乒乓球拍」
天善「四四方方的，好难拿啊」
女孩子「好像是叫直拍哟」
她把大拇指和食指围成一个环，然后握住球拍给我看
我也照着她的样子握住球拍
在手中固定得意外地紧
天善「知道怎么打乒乓球吗？」
女孩子「不知道，不过之前稍稍学习了一下，想着我来教加纳君」
天善「……乒乓球什么的、我能学会吗」
女孩子「不试一下怎么知道，来试试在图书室的那种互相对打吧」
天善「当热身呐」
女孩子「嗯」
第一次站在乒乓球台前，越过球网能看到她的身姿
映入眼帘的皆是初次接触的东西，因而心情激动不已
女孩子「走你！」
天善「来吧！」
女孩子「吃我一招————！恶龙咆————哮！」
天善「早就知道会来这一招！」
预判到她动作的我，把笔直飞来的球准确地打了回去
击打乒乓球时发出的令人心情愉悦的声音
从手腕传达到身体各处的舒畅的冲击
像是觉醒了什么一样的心情
不，是一直欠缺的什么东西倏然补足一般的心情
女孩子「打的不错嘛，加纳君！哈——————！」
天善「过奖过奖」
嘣！嘣！嘣！一直不停地用球拍把球打回去
但是，果然我们还是不怎么知道规则
都不让乒乓球经过球台的反弹，只是不停地打过来打过去
这是在拿乒乓球的道具打毽球
虽说如此，岛上的大人们却对此看得很起劲
————首先是要玩得开心
他们这么对我们说
在那一份快乐当中，慢慢加入了作为竞技所需的规则
发球的时候，先在自己这边的球台上反弹一下
把球打回去的时候，要让球先在自己台面反弹一次
比起一味对打来说，边思考边打球的情况慢慢增多
但是，也告诉我们必须要让球反弹以及要从正面而不是负面来考虑问题
给乒乓球加上强烈的回旋，就能让球在反弹之后改变方向
那样一来，也就想到了下次要加多少回旋的策略

bg={"name":1}
女孩子「必杀！恶龙咆————哮！」
天善「啊！」
她打出来的上旋球沿着难以置信的曲线，一经反弹就飞向了完全不同的方向
我的球拍无论如何都捕捉不到
女孩子「嘿嘿、这样就是98连胜了！还打吗？」
天善「当然打」
该说是有才能的家伙吗
按照正确的规则来打乒乓球之后，我一次都没赢过她
女孩子「喝——————！恶龙咆————哮！」
天善「哦哦噢噢噢！」
女孩子「好了，99连胜——————！」
天善「再、再打一局！拜托了！」
我握紧了球拍，向她低下了头
女孩子「嗯、但是感觉有点累了呀」
天善「那这正是绝好的机会！」
女孩子「哇！不是打倒全盛状态的对手才有胜利的价值吗？」
天善「为达胜利用尽全力才是礼仪吧」
女孩子「虽说是很帅气的台词，但其实很逊」
她露出略微僵硬的笑容
女孩子「不休息一下吗？」
天善「知道了。但是，仅限于你体力没有回复完全的程度」
女孩子「啊哈哈、为了胜利真的拼命呢」
她笑着，扑通一声坐在那里
调整呼吸一般缓缓深吸一口气
女孩子「加纳君不愧是男孩子呢。最近，感觉到体力的差距了」
天善「我只是不想输，所以独自在做着特训」
女孩子「说的也是。但是果然男孩子和女孩子还是有些决定性的差距呀」
天善「可是，我还是赢不了你」
女孩子「因为我也在拼命呀。心中满是不想输给加纳君的心情」
想赢的心情，与不想输的心情
哪一种想法占据主要呢
保守来说，既然我一直赢不了，那也许是不想输的心情更强烈一些吧
女孩子「哧哧、嘻嘻」
天善「咋了？突然笑起来」
女孩子「没什么，总感觉有点不可思议啊」
她用注视着远处一般的目光看向了体育馆的外面
女孩子「本来可以待的地方只有图书室的，结果没想到还能够做着这样的运动愉悦心情」
天善「啊啊，我也是这么想的」
女孩子「因为是和加纳君在一起，所以觉得很开心」
那么说着的她看起来有点脸红
但是我对她的话疑惑无比，没能好好看着她的脸
也没能做到坦率
天善「一直输球对我来说可谈不上开心」
那样的回答令我竭尽了全力
但是，心中这份激荡不已的感觉是什么呢
和她待在一起的时候，我察觉到自己和平时相比有了不同
奇怪地逞强、不顾一起地想要把帅气的一面展示给她看
女孩子「我还想和加纳君做更多各种各样的事情啊」
天善「各种各样的……事？」
女孩子「从弹橡皮开始，到玩玻璃弹珠，再到如今这样一起打乒乓球」
天善「确实」
女孩子「和加纳君……做更多……咳咳……」
天善「……？怎么了？」
女孩子「没、没什么，比起这个，定胜负就在明天吧」
天善「什么？」
她站起身，做了个深呼吸
女孩子「其实今天有点事，所以胜负留待明天来定」
天善「明白了。打倒全盛状态的你才有胜利的价值呐」
女孩子「那个、不早点说出来的话」
像是发呆一般，她缩了缩肩
但是，马上就直视着我
女孩子「……那个、加纳君，如果我100连胜的话，有些话想对你说」
天善「下一次将会是我的胜利，所以说这似乎有点难度呢」
女孩子「啊——说出来了」
她笑了，我也笑了
确实，我们是朋友，然后，还感觉到一种更深的联系

bg={"name":2}
bgm={"name":1}
天善「但是，我……没有注意到」
时至如今我仍为那时的事感到后悔
即使是勉强也该在那时进行最后一战的
羽依里「发生什么了？」
我的声音低沉了下去，鹰原显得有点担心
天善「第二天，我在体育馆等她。但是，她没有来」
羽依里「没来吗？」
天善「接下来的一天也是，这之后的日子也是。我一直在等着她的到来」
羽依里「她发生了什么事吗？」
天善「早就说过了吧。她去往了无法触及的遥远之处。她已经，不在这个世界了」
我凝视着窗外，轻声道
天善「结果……我连赢她一局的愿望都无法实现」
羽依里「就是因为这个吗？」
天善「什么？」
羽依里「从那以后，一直在打乒乓球，为了什么时候能把自己的心意传达给她」
天善「是啊……能传达到的话就太好了」
我仰望着窗外遥远的苍穹
鹰原也察觉到了吧，没打算探究地更深
良一「早上——好，哦？羽依里已经到了嘛」
手里拿着什么东西的良一走进秘密基地
羽依里「良一？拿的啥东西呀？」
鹰原指着良一拿的东西问道
良一「嘿嘿、收音机啊。好不容易搞来的所以想在这里收听」
羽依里「听什么新闻？」
良一「不——，是比赛」
回答着鹰原的问题，良一给收音机装上了电源
是早就调好了调频器的频段吗，马上就能听到声音
收音机『恶龙咆————哮！』
羽依里「什么鬼！？」
听到收音机传来的声音，鹰原发出震惊的声音
收音机『全日本女子网球大赛决赛，斑鸠丽选手以一击直线球领先一分』
良一「哈~丽状态极佳呀——」
羽依里「诶？是熟人吗？」
良一「丽虽是这座岛出身的同龄人，但已经是专业的网球运动员了」
羽依里「诶~鸟白岛出身的专业网球运动员啊」
良一「但是小学的时候由于父母的关系突然搬走了。啊啊，就在转校前还和天善打乒乓球来着」
羽依里「诶——诶？」
良一「是个相当冒失的家伙，我还以为是和父母去本土玩结果其实是搬家了」
听了良一的说明，鹰原对我露出探询的神色
羽依里「该不会……天善，刚刚你说的那妹子……」
天善「早就说过了吧，她已经不在乒乓球界（世界）了、咳…」
羽依里「太容易让人误会了吧！这意味深长的咳嗽算什么啊！明明在打乒乓球为什么跑去打网球了！」
天善「愚蠢的问题。弹橡皮、弹弹珠、乒乓球、藤球，照这种顺序，接下来去打网球也不奇怪吧」
羽依里「现在奇怪的是中间过渡的那个（译者注：指藤球）！她去本土之后都在做什么啊？为什么是泰国的国技？（译者注：藤球在泰国比较流行）说起来，不应该是很棒的初恋情节吗！不应该是赢了的话就告白的感觉吗！」
天善「确实，当时的话说不定会那样……但如今已经不行了」
我长叹一声
对于我这动作，鹰原眯起了眼睛
像是发现了什么
羽依里「果然、是没赢吧？」
天善「不」
我轻轻地、但却很坚定地摇了摇头
然后直视着鹰原说
天善「虽然很对不起，但是她的胸围实在是无法勾起我的兴趣」
羽依里「……欸？」
天善「岁月是残酷的。因为即使才能得到伸展，却不一定使身体成长起来呢」
羽依里「你、实在是太差劲了……」
斜视着鹰原鄙夷的目光，我握住了自己的球拍
以前的我是个内向、虚弱又害羞的人
沉浸在图书室里，也没有能称得上朋友的人
但是，由于与她的邂逅而与乒乓球相遇了。和以前相比，也结交到了朋友
虽说只是一个小小的契机、但对于我来说，却改变了整个世界
那么，果然也可以说是初恋吧
所以————对我来说乒乓球一直有着特殊的含义
天善「好了……」
我打起精神，重新握住了一直在的球拍
天善「今天也来特训吧？」

		`;

})();
